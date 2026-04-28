/**
 * ingest-content — chunks the file-based content corpus, embeds with OpenAI
 * text-embedding-3-large at 1536 dims, and upserts into the `public.rag_chunks`
 * table on Supabase (Prompt 18 PR-A).
 *
 * Run with:  pnpm --filter web ingest:content
 *
 * The script is idempotent — re-running against an unchanged corpus produces
 * the same chunk ids and overwrites by primary key. To handle deleted /
 * renamed sections cleanly, we delete-then-insert by `source_url` per source
 * (so a content file removing a section won't leave orphan chunks).
 *
 * Env vars (read via `tsx --env-file=../../.env.local`):
 *   - OPENAI_API_KEY         (required)
 *   - NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (required)
 *
 * Cost: ~10–15K words of corpus → ~20K tokens → ~$0.003 on text-embedding-3-large.
 */
import { rag, supabase as supabaseLib } from "@propharmex/lib";

import {
  FILE_CONTENT_SOURCES,
  extractAllFileContent,
} from "../lib/rag-sources";

type Chunk = rag.Chunk;
const { embedTexts } = rag;
const { requireServerSupabase } = supabaseLib;

type ChunkRow = {
  id: string;
  content: string;
  embedding: number[];
  source_url: string;
  source_title: string;
  section: string;
  content_type: string;
};

async function main() {
  // eslint-disable-next-line no-console
  console.log("[ingest] starting");

  // 1) Extract chunks from all sources.
  const allChunks: Chunk[] = extractAllFileContent();
  // eslint-disable-next-line no-console
  console.log(
    `[ingest] extracted ${allChunks.length} chunks from ${FILE_CONTENT_SOURCES.length} sources`,
  );
  for (const source of FILE_CONTENT_SOURCES) {
    const count = source.extract().length;
    // eslint-disable-next-line no-console
    console.log(`[ingest]   - ${source.label}: ${count} chunks`);
  }

  if (allChunks.length === 0) {
    // eslint-disable-next-line no-console
    console.error("[ingest] no chunks extracted — refusing to wipe table");
    process.exit(1);
  }

  // 2) Embed all chunks (batched internally).
  // eslint-disable-next-line no-console
  console.log("[ingest] embedding chunks...");
  const startEmbed = Date.now();
  const embeddings = await embedTexts(allChunks.map((c) => c.content));
  if (!embeddings) {
    // eslint-disable-next-line no-console
    console.error("[ingest] embed failed — set OPENAI_API_KEY in .env.local");
    process.exit(1);
  }
  // eslint-disable-next-line no-console
  console.log(
    `[ingest] embedded ${embeddings.length} chunks in ${Date.now() - startEmbed}ms`,
  );

  // 3) Build rows for upsert.
  const rows: ChunkRow[] = allChunks.map((chunk, i) => {
    const embedding = embeddings[i];
    if (!embedding) {
      throw new Error(`Missing embedding for chunk ${chunk.id}`);
    }
    return {
      id: chunk.id,
      content: chunk.content,
      embedding,
      source_url: chunk.sourceUrl,
      source_title: chunk.sourceTitle,
      section: chunk.section,
      content_type: chunk.contentType,
    };
  });

  // 4) Wipe + insert by source_url to handle deletions.
  const supabase = requireServerSupabase();
  const sourceUrls = [...new Set(rows.map((r) => r.source_url))];
  // eslint-disable-next-line no-console
  console.log(`[ingest] clearing ${sourceUrls.length} source URLs...`);
  const { error: deleteError } = await supabase
    .from("rag_chunks")
    .delete()
    .in("source_url", sourceUrls);
  if (deleteError) {
    // eslint-disable-next-line no-console
    console.error("[ingest] delete failed:", deleteError.message);
    process.exit(1);
  }

  // 5) Insert in batches (Supabase REST limit is generous but smaller batches
  // keep memory bounded).
  const BATCH = 100;
  // eslint-disable-next-line no-console
  console.log(`[ingest] inserting ${rows.length} rows in batches of ${BATCH}...`);
  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH);
    const { error } = await supabase.from("rag_chunks").insert(batch);
    if (error) {
      // eslint-disable-next-line no-console
      console.error(
        `[ingest] insert failed at batch starting ${i}:`,
        error.message,
      );
      process.exit(1);
    }
  }

  // 6) Sanity check.
  const { count, error: countError } = await supabase
    .from("rag_chunks")
    .select("*", { count: "exact", head: true });
  if (countError) {
    // eslint-disable-next-line no-console
    console.warn(
      "[ingest] could not verify count:",
      countError.message,
    );
  }
  // eslint-disable-next-line no-console
  console.log(`[ingest] done — rag_chunks now contains ${count ?? "unknown"} rows`);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("[ingest] fatal:", err);
  process.exit(1);
});

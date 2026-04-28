/**
 * retrieve() — query-time embedding + pgvector lookup.
 *
 * Returns the top-k chunks above `minScore` cosine similarity, ordered by
 * similarity (closest first). Source-agnostic interface — when Prompt 22
 * swaps the upstream from file content to Sanity, only the ingest path
 * changes, not this helper.
 *
 * Falls through to an empty array (no throw) on missing keys or transient
 * failures. The chat endpoint can still answer without citations; the user
 * just sees a degraded grounding.
 */
import { getServerSupabase } from "../supabase/server";
import { log } from "../log";

import { embedQuery } from "./embedder";
import type { MatchChunkRow, RetrievedChunk } from "./types";

export interface RetrieveOptions {
  /** How many top chunks to return. Default 8 per Prompt 18 spec. */
  topK?: number;
  /** Minimum cosine score (0..1). Default 0.0 — let the model decide. */
  minScore?: number;
}

const DEFAULT_TOP_K = 8;
const DEFAULT_MIN_SCORE = 0.0;

export async function retrieve(
  query: string,
  opts: RetrieveOptions = {},
): Promise<RetrievedChunk[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const topK = opts.topK ?? DEFAULT_TOP_K;
  const minScore = opts.minScore ?? DEFAULT_MIN_SCORE;

  const queryEmbedding = await embedQuery(trimmed);
  if (!queryEmbedding) {
    log.warn("rag.retrieve.no_embedding", { topK, minScore });
    return [];
  }

  const supabase = getServerSupabase();
  if (!supabase) {
    log.warn("rag.retrieve.no_supabase", { topK, minScore });
    return [];
  }

  const { data, error } = await supabase.rpc("match_chunks", {
    query_embedding: queryEmbedding,
    match_count: topK,
    min_score: minScore,
  });

  if (error) {
    log.error("rag.retrieve.rpc_error", { message: error.message });
    return [];
  }

  const rows = (data ?? []) as MatchChunkRow[];
  return rows.map((row) => ({
    id: row.id,
    content: row.content,
    sourceUrl: row.source_url,
    sourceTitle: row.source_title,
    section: row.section,
    contentType: row.content_type,
    score: row.score,
  }));
}

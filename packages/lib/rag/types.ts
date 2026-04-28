/**
 * Shared types for the RAG pipeline (Prompt 18).
 *
 * Source-agnostic by design — `Chunk` carries enough metadata to render a
 * citation regardless of whether the upstream is a file-based content export
 * (PR-A) or a Sanity GROQ fetch (PR-22).
 */

/**
 * Coarse content categories for filtering + UI grouping. The strings match the
 * `content_type` column in `public.rag_chunks` and the discriminator the
 * source extractors emit.
 */
export type ContentType =
  | "page"
  | "service"
  | "industry"
  | "case-study"
  | "insight"
  | "facility"
  | "quality"
  | "process";

/**
 * Embedding dimensions used across the pipeline. text-embedding-3-large at
 * 1536 dims to fit pgvector's HNSW 2000-dim limit (see
 * supabase/migrations/0001_pgvector.sql for the rationale).
 */
export const EMBEDDING_DIMENSIONS = 1536;
export const EMBEDDING_MODEL = "text-embedding-3-large";

/**
 * A single chunk of source content, ready to be embedded and stored.
 * `id` is stable + deterministic — re-running ingestion against unchanged
 * content yields the same `id`, so upserts are idempotent.
 */
export type Chunk = {
  /** Stable id: `${contentType}:${sourceUrl}:${section-slug}:${chunkIndex}`. */
  id: string;
  /** The chunk text (~500 tokens target). */
  content: string;
  /** Page URL where this chunk lives, e.g. `/services/regulatory-services`. */
  sourceUrl: string;
  /** Page title (e.g. "Regulatory services"). */
  sourceTitle: string;
  /** Section heading inside the page (e.g. "Health Canada DEL licensing"). */
  section: string;
  /** Coarse category for filtering. */
  contentType: ContentType;
};

/**
 * A chunk returned from the retrieve() helper, augmented with similarity score.
 */
export type RetrievedChunk = Chunk & {
  /** Cosine similarity, 0..1 (1 = identical). */
  score: number;
};

/**
 * What every source extractor returns. The pipeline calls `extract()` once per
 * source module to collect all chunks before batching for embedding.
 */
export type IngestSource = {
  /** Human-readable label for logs ("home", "insights", etc.). */
  label: string;
  /** Returns the chunks this source contributes. Pure function, no I/O. */
  extract: () => Chunk[];
};

/**
 * Database row shape — used by the Supabase client when reading/writing
 * rag_chunks. Mirrors the SQL column order.
 */
export type RagChunkRow = {
  id: string;
  content: string;
  embedding: number[];
  source_url: string;
  source_title: string;
  section: string;
  content_type: ContentType;
  created_at?: string;
};

/**
 * Shape returned by the match_chunks() Postgres RPC.
 */
export type MatchChunkRow = {
  id: string;
  content: string;
  source_url: string;
  source_title: string;
  section: string;
  content_type: ContentType;
  score: number;
};

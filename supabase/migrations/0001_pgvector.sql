-- 0001_pgvector — RAG corpus storage for the CDMO Concierge (Prompt 18)
--
-- Schema: public.rag_chunks
--
-- One row per chunked content fragment from apps/web/content/*.ts (PR-22 will
-- swap the upstream source from file-based content to Sanity GROQ fetches; the
-- table shape stays the same).
--
-- Embedding model: OpenAI text-embedding-3-large at dimensions=1536. The full
-- 3072-dim mode is not used because pgvector's HNSW index has a 2000-dimension
-- hard limit. OpenAI natively supports dimension reduction via the `dimensions`
-- request parameter — at 1536 dims, text-embedding-3-large still outperforms
-- text-embedding-ada-002 at 1536 (per the OpenAI 2024-01 evals).
--
-- HNSW with cosine distance for retrieval. RLS enabled with no policies — only
-- the service-role key (used by the ingest script and the /api/ai/concierge
-- route) can read or write.

create extension if not exists vector;

-- Drop in reverse order if re-running locally (idempotent).
drop function if exists public.match_chunks(vector(1536), int, float);
drop table if exists public.rag_chunks;

create table public.rag_chunks (
  id           text primary key,
  content      text not null,
  embedding    vector(1536) not null,
  source_url   text not null,
  source_title text not null,
  section      text not null,
  content_type text not null,
  created_at   timestamptz not null default now()
);

comment on table public.rag_chunks is
  'Chunked + embedded content from apps/web/content/*.ts (Prompt 18). Service-role only.';

-- HNSW index for cosine similarity. Default params (m=16, ef_construction=64)
-- are appropriate for our scale (a few thousand chunks). Re-tune in PR-22 if
-- the corpus grows past ~100K rows.
create index rag_chunks_embedding_idx
  on public.rag_chunks
  using hnsw (embedding vector_cosine_ops);

-- Lookup index for idempotent re-ingestion (delete-by-source then insert).
create index rag_chunks_source_url_idx
  on public.rag_chunks (source_url);

-- Retrieval RPC — invoked from packages/lib/rag/retrieve.ts.
-- Returns the top `match_count` chunks above `min_score` cosine similarity,
-- ordered by similarity (closest first).
create or replace function public.match_chunks(
  query_embedding vector(1536),
  match_count     int   default 8,
  min_score       float default 0.0
)
returns table (
  id           text,
  content      text,
  source_url   text,
  source_title text,
  section      text,
  content_type text,
  score        float
)
language sql
stable
as $$
  select
    rc.id,
    rc.content,
    rc.source_url,
    rc.source_title,
    rc.section,
    rc.content_type,
    1 - (rc.embedding <=> query_embedding) as score
  from public.rag_chunks rc
  where 1 - (rc.embedding <=> query_embedding) >= min_score
  order by rc.embedding <=> query_embedding
  limit match_count;
$$;

comment on function public.match_chunks is
  'Cosine-similarity retrieval over rag_chunks. Used by /api/ai/concierge.';

-- Lock down: RLS on, no policies. Only service_role can read/write.
alter table public.rag_chunks enable row level security;

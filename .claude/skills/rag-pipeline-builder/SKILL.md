---
name: rag-pipeline-builder
description: End-to-end RAG (Retrieval Augmented Generation) scaffolding — Sanity content ingestion, chunking, OpenAI text-embedding-3-large embedding, Supabase pgvector storage with HNSW index, and a typed retrieve() helper. Also wires Sanity webhooks for incremental re-embedding.
when_to_use: Prompt 4 (Sanity + GROQ library setup — wires the ingestion source), Prompt 18 (CDMO Concierge RAG chatbot — the primary consumer), and any later feature that needs "ground this answer in our content".
---

# RAG Pipeline Builder

Builds and maintains the vector store that powers the CDMO Concierge chatbot and any future grounded-AI feature. One embedding model, one vector DB, one retrieval helper.

## Architecture (opinionated)

```
Sanity CMS (source of truth)
  → webhook on publish / unpublish
  → /api/rag/ingest (Next.js route, Node runtime)
    → fetch doc via GROQ
    → strip portable text → plain text with section headings preserved
    → chunker: 800 tokens, 100 overlap (tiktoken cl100k)
    → OpenAI text-embedding-3-large (3072 dims)
    → upsert into Supabase postgres:
        rag_chunks (
          id uuid pk,
          sanity_doc_id text,
          sanity_doc_type text,
          slug text,
          title text,
          section text,
          chunk_text text,
          chunk_index int,
          url text,
          published_at timestamptz,
          embedding vector(3072),
          updated_at timestamptz
        )
        index: hnsw (embedding vector_cosine_ops) m=16, ef_construction=64
        index: btree (sanity_doc_id, chunk_index) unique
        index: btree (sanity_doc_type, published_at desc)

Retrieval helper (packages/lib/rag/retrieve.ts):
  retrieve(query: string, opts: { k?: 8, filter?: { pillar?, docType?, region? }, minScore?: 0.72 })
    → embed query
    → supabase.rpc('match_chunks', { query_embedding, k, filter, min_score })
    → returns { chunks: {text, title, url, score, sanity_doc_id}[], total_tokens }

Concierge API (app/api/ai/concierge/route.ts, Edge):
  streamText({
    model: anthropic('claude-opus-4-7'),
    system: load from Sanity aiPromptConfig 'concierge' doc,
    messages: [...history, { role: 'user', content: buildPromptWithContext(userQ, retrieved.chunks) }],
    experimental_telemetry: { enabled: true }
  })
```

## Supabase migration (via `mcp__5c84b932-...__apply_migration`)

```sql
create extension if not exists vector;

create table public.rag_chunks (
  id uuid primary key default gen_random_uuid(),
  sanity_doc_id text not null,
  sanity_doc_type text not null,
  slug text,
  title text,
  section text,
  chunk_text text not null,
  chunk_index int not null,
  url text,
  published_at timestamptz,
  embedding vector(3072),
  updated_at timestamptz default now()
);

create unique index rag_chunks_doc_idx_u
  on rag_chunks (sanity_doc_id, chunk_index);

create index rag_chunks_type_pub_idx
  on rag_chunks (sanity_doc_type, published_at desc);

create index rag_chunks_hnsw_idx
  on rag_chunks
  using hnsw (embedding vector_cosine_ops)
  with (m = 16, ef_construction = 64);

create or replace function public.match_chunks(
  query_embedding vector(3072),
  k int default 8,
  min_score float default 0.72,
  filter_doc_type text[] default null
) returns table (
  id uuid, title text, url text, chunk_text text, score float, sanity_doc_id text
) language sql stable as $$
  select
    c.id, c.title, c.url, c.chunk_text,
    1 - (c.embedding <=> query_embedding) as score,
    c.sanity_doc_id
  from rag_chunks c
  where (filter_doc_type is null or c.sanity_doc_type = any(filter_doc_type))
    and 1 - (c.embedding <=> query_embedding) >= min_score
  order by c.embedding <=> query_embedding
  limit k
$$;
```

## Chunker rules

- Strip portable-text marks but preserve:
  - H2/H3 → prepend "## " to the first chunk of the section
  - Callouts → wrap with `[CALLOUT:type] ... [/CALLOUT]` so the LLM knows they're emphasized
  - Lists → flatten with `- ` prefix
- Target 800 tokens per chunk with 100-token overlap
- Never split within a callout or a list
- Preserve the ordered `chunk_index` per doc for stable upserts

## Ingestion triggers

1. **Sanity webhook** (publish/unpublish) → `/api/rag/ingest` with `{ _id, _type, _rev, deleted? }`
2. **Backfill CLI** — `pnpm rag:backfill --type=insight,service,caseStudy,whitepaper,faq` (used once at Prompt 4 completion)
3. **Scheduled re-embed** (weekly) — via `mcp__scheduled-tasks__create_scheduled_task` to catch drift

## Tests (required)

- Unit: chunker boundaries, overlap math, callout preservation
- Unit: `retrieve()` returns correctly scored results against fixtures
- Integration: ingest a fixture Sanity doc → retrieve against 3 known queries → assert expected chunk is top-1
- E2E (Playwright): open Concierge → ask "How long does DEL take?" → assert the response cites the DEL page

## Guardrails for the Concierge consumer

- Retrieval `minScore: 0.72` — below that, the chatbot says "I couldn't find that in our content — want to talk to a human?"
- System prompt (stored in Sanity `aiPromptConfig.concierge`) must include:
  - No medical advice
  - No regulatory guarantee — always direct-link to `/services/regulatory-services`
  - Cite every factual claim with the chunk's `url` as an inline reference
  - "Talk to a human" escape hatch surfaces when the user asks pricing, legal, or complaint topics
- PII redaction on input before embedding (emails/phones stripped with regex, logged redaction count)
- Rate limit 20 messages per IP per hour via Upstash

## Outputs when this skill runs

1. Migration SQL (via Supabase MCP `apply_migration`)
2. `packages/lib/rag/chunker.ts`, `packages/lib/rag/embed.ts`, `packages/lib/rag/retrieve.ts`
3. `apps/web/app/api/rag/ingest/route.ts`
4. `apps/web/app/api/ai/concierge/route.ts` (only when called for Prompt 18)
5. `scripts/rag-backfill.ts` CLI
6. Vitest + Playwright test files
7. A Mermaid diagram written to `docs/architecture.md` illustrating the flow

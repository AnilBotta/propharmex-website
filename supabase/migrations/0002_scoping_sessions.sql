-- 0002_scoping_sessions — anonymous persistence for the Project Scoping
-- Assistant (Prompt 19 PR-B).
--
-- Schema: public.scoping_sessions
--
-- One row per finalized session — written only when the user clicks "Send to
-- Propharmex" or "Download PDF" (per Prompt 19: "send only on submit"). Chat
-- turns are NOT persisted; the conversation is ephemeral state in the
-- browser. This keeps inbound write traffic low and makes the surface
-- anonymous-by-default.
--
-- The two scope-write paths are:
--   1. submit  → row written by /api/ai/scoping/submit alongside the BD email
--   2. pdf     → row written by /api/ai/scoping/pdf alongside the PDF stream
--
-- A single user might end up with two rows (one per action). That's
-- intentional — the rows record what was *committed*, not what was drafted.
--
-- PII posture: NEVER store the user's raw email or name (CLAUDE.md §4.9 +
-- Prompt 19's anonymous-by-default rule). The submit path stores the email
-- DOMAIN only (e.g. "acme.com"), enough for BD analytics without retaining
-- identifying data. The transcript jsonb has already passed through
-- packages/lib/redact during the chat — emails / phones / "my name is X"
-- have been replaced with placeholder tokens before reaching this table.
--
-- Service-role only access. RLS enabled with no policies, matching
-- rag_chunks.

create extension if not exists "pgcrypto";

-- Drop in reverse order if re-running locally.
drop table if exists public.scoping_sessions;

create table public.scoping_sessions (
  id                    uuid primary key default gen_random_uuid(),
  -- Lifecycle status. One row per finalization event.
  --   'submitted'  — user clicked Send to Propharmex (BD email sent)
  --   'pdf_only'   — user clicked Download PDF (no BD email)
  status                text not null check (status in ('submitted', 'pdf_only')),
  -- The structured scope at the moment of finalization (post any edits).
  scope_summary         jsonb not null,
  -- The full chat transcript at the moment of finalization. Already
  -- redacted by /api/ai/scoping route. Empty array allowed for sample-only
  -- downloads where the user clicked "See a sample" then Download.
  transcript            jsonb not null default '[]'::jsonb,
  -- Email DOMAIN only (e.g. "acme.com"). Null when the path is pdf_only.
  submitter_email_domain text,
  -- Free-text region tag for analytics ("CA", "US", "EU", null).
  region                text,
  -- Page referrer for inbound-channel analytics. Truncated to 500 chars at
  -- the route boundary.
  referrer              text,
  created_at            timestamptz not null default now()
);

comment on table public.scoping_sessions is
  'Finalized Project Scoping Assistant sessions (Prompt 19 PR-B). Service-role only.';

-- Lookup by recency for the BD dashboard / weekly digest (PR-22).
create index scoping_sessions_created_at_idx
  on public.scoping_sessions (created_at desc);

-- Analytics index — pivot by status × created_at for funnel reporting.
create index scoping_sessions_status_created_idx
  on public.scoping_sessions (status, created_at desc);

-- Lock down: RLS on, no policies. Only service_role can read/write.
alter table public.scoping_sessions enable row level security;

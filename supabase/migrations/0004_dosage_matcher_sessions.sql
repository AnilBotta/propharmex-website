-- 0004_dosage_matcher_sessions — anonymous persistence for the Dosage Form
-- Capability Matcher (Prompt 21 PR-B).
--
-- Schema: public.dosage_matcher_sessions
--
-- One row per finalization event. v1 only writes 'pdf_only' rows when
-- the user downloads the personalized comparison report. Status enum
-- allows 'consultation_clicked' too so the schema doesn't have to
-- migrate when consultation tracking lands later.
--
-- Mirrors scoping_sessions and del_readiness_sessions exactly. The
-- recommendation jsonb stores the full server-enriched payload (model
-- output + deterministic capability coverage %). Raw input is stored
-- alongside it for retroactive analysis ("what kinds of programmes are
-- people scoping?" — without exposing identifying details, since the
-- description has already passed through `redact()` server-side).
--
-- Service-role only access. RLS enabled with no policies, matching
-- the other AI-tool sessions tables.

create extension if not exists "pgcrypto";

drop table if exists public.dosage_matcher_sessions;

create table public.dosage_matcher_sessions (
  id              uuid primary key default gen_random_uuid(),
  -- Lifecycle. v1 writes 'pdf_only'; future actions add new statuses.
  status          text not null check (
    status in ('pdf_only', 'consultation_clicked')
  ),
  -- Server-enriched recommendation payload at the moment of
  -- finalization (inferredRequirements + matches with coverage %).
  recommendation  jsonb not null,
  -- Raw user input — already redacted for emails/phones/self-ID
  -- patterns by /api/ai/dosage-matcher before persistence.
  input           jsonb not null,
  -- Free-text region tag for analytics.
  region          text,
  -- Page referrer for inbound-channel analytics. Truncated at the
  -- route boundary.
  referrer        text,
  created_at      timestamptz not null default now()
);

comment on table public.dosage_matcher_sessions is
  'Finalized Dosage Matcher sessions (Prompt 21 PR-B). Service-role only.';

-- Recency index for the BD dashboard / weekly digest.
create index dosage_matcher_sessions_created_at_idx
  on public.dosage_matcher_sessions (created_at desc);

-- Status × created_at pivot for funnel reporting.
create index dosage_matcher_sessions_status_created_idx
  on public.dosage_matcher_sessions (status, created_at desc);

alter table public.dosage_matcher_sessions enable row level security;

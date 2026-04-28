-- 0003_del_readiness_sessions — anonymous persistence for the Health Canada
-- DEL Readiness Assessment (Prompt 20 PR-B).
--
-- Schema: public.del_readiness_sessions
--
-- One row per finalization event. v1 only writes 'pdf_only' rows when the
-- user downloads the personalized report. Status enum allows
-- 'consultation_booked' too so the schema doesn't have to migrate when
-- consultation tracking lands later.
--
-- The assessment itself is anonymous-by-default — there is no contact
-- form on the DEL surface (the user books a consultation off-site via
-- Cal.com). Telemetry covers per-action funnels; this table records the
-- full assessment payload for trend analysis (which categories
-- chronically score yellow/red across users, etc).
--
-- Service-role only access. RLS enabled with no policies, matching
-- scoping_sessions and rag_chunks.

create extension if not exists "pgcrypto";

drop table if exists public.del_readiness_sessions;

create table public.del_readiness_sessions (
  id              uuid primary key default gen_random_uuid(),
  -- Lifecycle. v1 writes 'pdf_only'; future actions add new statuses.
  status          text not null check (
    status in ('pdf_only', 'consultation_booked')
  ),
  -- The full Assessment payload (score + categoryScores + gaps +
  -- remediation) at the moment of finalization.
  assessment      jsonb not null,
  -- Raw user answers (questionId → optionId). Useful for retroactive
  -- rubric-tuning analysis: see what answer combinations land at
  -- yellow/red bands and whether the rubric weighting is calibrated.
  answers         jsonb not null,
  -- Rubric version the assessment was generated against. Lets us
  -- reanalyze old sessions if the rubric weights change.
  rubric_version  text not null,
  -- Free-text region tag for analytics ("CA", "US", "EU", null).
  region          text,
  -- Page referrer for inbound-channel analytics. Truncated at the
  -- route boundary.
  referrer        text,
  created_at      timestamptz not null default now()
);

comment on table public.del_readiness_sessions is
  'Finalized DEL Readiness Assessment sessions (Prompt 20 PR-B). Service-role only.';

-- Recency index for the BD dashboard / weekly digest.
create index del_readiness_sessions_created_at_idx
  on public.del_readiness_sessions (created_at desc);

-- Status × created_at pivot for funnel reporting.
create index del_readiness_sessions_status_created_idx
  on public.del_readiness_sessions (status, created_at desc);

-- Lock down: RLS on, no policies. service_role only.
alter table public.del_readiness_sessions enable row level security;

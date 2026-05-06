-- 0007_lead_intelligence — cached AI brief + draft reply + intent score
-- per lead (PR-N3).
--
-- One row per lead. Generated lazily by /api/ai/lead-intelligence on first
-- "Generate AI brief" click in the dashboard drawer. Subsequent views read
-- straight from the cache.
--
-- Cost control: button-gated generation, not auto-fire on lead create.
-- Worst-case ~$0.05 per row × N_leads_viewed = small.
--
-- Service-role only access. RLS enabled with no policies.

create extension if not exists "pgcrypto";

drop table if exists public.lead_intelligence;

create table public.lead_intelligence (
  -- One row per lead (1:1 with public.leads).
  lead_id        uuid primary key references public.leads(id) on delete cascade,

  -- 2-line plain-English brief. Shown at the top of the drawer.
  summary        text not null,

  -- 0-100 score. Computed by the AI from role seniority, message
  -- specificity, scope completeness, source weight, etc.
  intent_score   int not null check (intent_score between 0 and 100),

  -- Derived band — UI uses this for the badge color/icon. Source of truth
  -- is intent_score; band is just precomputed for index-friendly filtering
  -- in the dashboard "hot leads" KPI.
  intent_band    text not null check (intent_band in ('hot', 'warm', 'cold')),

  -- Pre-drafted reply email body. Copy/Send into the BD rep's mail client.
  draft_reply    text not null,

  -- 1-sentence rationale for the score. Visible to the BD team so a weak
  -- rationale = visibly weak score (calibration loop).
  rationale      text,

  -- Provenance for cost/quality monitoring.
  model          text not null,            -- e.g., "claude-sonnet-4-5-20250929"
  generated_at   timestamptz not null default now(),

  -- Non-null = stale. Set when the lead's payload is edited; the next view
  -- regenerates. v1 doesn't auto-invalidate; this is a hook for v2.
  invalidated_at timestamptz
);

comment on table public.lead_intelligence is
  'Cached AI brief + draft reply + intent score per lead (PR-N3). Service-role only.';

-- Hot-leads filter index — feeds the "Hot leads" KPI on the dashboard.
create index lead_intelligence_band_idx
  on public.lead_intelligence (intent_band);

-- Recency for cost-monitoring queries ("how much did we spend last week?").
create index lead_intelligence_generated_idx
  on public.lead_intelligence (generated_at desc);

alter table public.lead_intelligence enable row level security;

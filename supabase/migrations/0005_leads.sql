-- 0005_leads — unified lead capture + audit-trail notes (PR-N1).
--
-- Schema:
--   public.leads        — one row per inbound lead from any source surface
--   public.lead_notes   — append-only timeline (notes + status changes)
--
-- Sources covered (one `source` value per surface, see CHECK constraint):
--   contact         — /api/contact form on /contact
--   whitepaper      — /api/whitepaper-download gate on /insights
--   newsletter      — /api/newsletter signup on /insights
--   scoping         — /api/ai/scoping/submit (also writes scoping_sessions)
--   del_readiness   — /api/ai/del-readiness/* if/when contact info is captured
--   dosage_matcher  — /api/ai/dosage-matcher/* if/when contact info is captured
--   concierge       — /api/ai/concierge if/when contact info is captured
--
-- PII posture: this table DOES store the raw email + name + message because the
-- BD team needs to act on the lead (reply, mark contacted, etc.). RLS is enabled
-- with no policies — only service_role can read or write. The dashboard reads
-- via getServerSupabase() (service-role) and gates access at the application
-- layer via the auth_sessions cookie (added in 0006).
--
-- This is a deliberate departure from scoping_sessions, which only stored the
-- email DOMAIN. Leads need the full email so the dashboard can drive
-- mailto: replies and (later) Resend-from-dashboard sending. The trade-off is
-- accepted because access is service-role-only and the dashboard sits behind
-- magic-link auth.

create extension if not exists "pgcrypto";

-- Drop in reverse FK order if re-running locally.
drop table if exists public.lead_notes;
drop table if exists public.leads;

create table public.leads (
  id                  uuid primary key default gen_random_uuid(),

  -- Source surface that captured this lead.
  source              text not null check (source in (
    'contact',
    'whitepaper',
    'newsletter',
    'scoping',
    'del_readiness',
    'dosage_matcher',
    'concierge'
  )),

  -- Lifecycle status (4-state simple workflow per the plan).
  status              text not null default 'new' check (status in (
    'new',
    'contacted',
    'won',
    'lost'
  )),

  -- Identity / contact (raw, for BD action).
  email               text not null,
  email_domain        text not null,           -- denormalized for fast filtering / analytics
  contact_name        text,
  company             text,
  role                text,

  -- Source-specific structured fields (mostly from the contact form taxonomy
  -- in apps/web/content/contact.ts). Nullable since not every source captures
  -- all of them.
  region              text,
  service             text,
  dosage_form         text,
  stage               text,
  message             text,                    -- raw message body (PII)

  -- Source-specific blob (scope summary for scoping leads, whitepaper slug for
  -- whitepaper leads, etc.).
  payload             jsonb not null default '{}'::jsonb,

  -- BD ownership + close timestamps.
  owner_email         text,                    -- assigned BD rep (allowlisted user)

  -- Attribution (UTM + referrer + country).
  utm_source          text,
  utm_medium          text,
  utm_campaign        text,
  referrer            text,
  ip_country          text,                    -- two-letter ISO from x-vercel-ip-country
  posthog_distinct_id text,                    -- link back to PostHog session

  created_at          timestamptz not null default now(),
  contacted_at        timestamptz,
  closed_at           timestamptz,
  updated_at          timestamptz not null default now()
);

comment on table public.leads is
  'Unified lead capture across all marketing-site surfaces (PR-N1). Service-role only.';

-- Recency index for the default dashboard sort.
create index leads_created_idx
  on public.leads (created_at desc);

-- Status × created — for the conversion-rate KPI and Kanban-style filters.
create index leads_status_created_idx
  on public.leads (status, created_at desc);

-- Source × created — for the AI-funnel ROI rollup (PR-N3).
create index leads_source_created_idx
  on public.leads (source, created_at desc);

-- Owner × status — for the "My open leads" view per BD rep.
create index leads_owner_status_idx
  on public.leads (owner_email, status);

-- Email domain — for "show me all Acme leads" and dedupe queries.
create index leads_email_domain_idx
  on public.leads (email_domain);

-- updated_at maintenance trigger so the dashboard's "recently changed" sort
-- stays accurate without app-layer effort.
create or replace function public.leads_set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists leads_set_updated_at_trg on public.leads;
create trigger leads_set_updated_at_trg
  before update on public.leads
  for each row execute function public.leads_set_updated_at();

-- Lock down: RLS on, no policies. Only service_role can read/write.
alter table public.leads enable row level security;


-- lead_notes — append-only timeline of human notes + automatic status changes.
create table public.lead_notes (
  id            uuid primary key default gen_random_uuid(),
  lead_id       uuid not null references public.leads(id) on delete cascade,
  -- Author email (allowlisted dashboard user) or 'system' for automatic events.
  author_email  text not null,
  body          text not null,
  -- 'note'           — free-text BD note
  -- 'status_change'  — automatic on status transition; body = "new → contacted"
  -- 'email_sent'     — future: log when a reply is sent from the dashboard
  -- 'email_drafted'  — future: log when AI draft is generated
  kind          text not null default 'note' check (kind in (
    'note',
    'status_change',
    'email_sent',
    'email_drafted'
  )),
  created_at    timestamptz not null default now()
);

comment on table public.lead_notes is
  'Append-only audit + notes timeline for leads (PR-N1). Service-role only.';

create index lead_notes_lead_created_idx
  on public.lead_notes (lead_id, created_at desc);

alter table public.lead_notes enable row level security;

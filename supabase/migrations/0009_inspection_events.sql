-- 0009_inspection_events — per-track regulatory + QA event schedule (PR-N11).
--
-- Replaces the "Coming in PR-N4" Inspections & gates placeholder on the
-- dashboard with a real per-day event calendar.
--
-- Tracks match the design PDF (Propharmex Console — Lead Intake):
--   health_canada → "GMP inspection" lane
--   usfda         → "DMF Type II / ANDA" lane
--   tga_who_pq    → "Audit prep" lane
--   internal_qa   → "Gates & CAPA" lane
--   stability     → "Pull points" lane
--
-- Each row is one event on one day. Multiple events per (track, day) are
-- stacked in the cell. A cell with no events shows the "+ Add event"
-- affordance.
--
-- Service-role only access. RLS enabled, no policies — same posture as
-- public.leads / public.projects.

create extension if not exists "pgcrypto";

drop table if exists public.inspection_events;

create table public.inspection_events (
  id                  uuid primary key default gen_random_uuid(),

  -- Which lane the event belongs to.
  track               text not null check (track in (
    'health_canada',
    'usfda',
    'tga_who_pq',
    'internal_qa',
    'stability'
  )),

  -- "DEL re-inspection", "ANDA264180 · presubmission call", etc.
  title               text not null,
  -- Optional secondary line: site, party, format ("MISSISSAUGA · ON-SITE",
  -- "SOLACE · TEAMS", "ATLAS BIOCDMO", etc.).
  subtitle            text,

  event_date          date not null,

  status              text not null default 'scheduled' check (status in (
    'scheduled',
    'in_progress',
    'done',
    'cancelled'
  )),

  notes               text,

  -- Optional link to a project so the calendar event can drill into the
  -- pipeline (e.g. "PX-101 · QA gate · Chongdam"). ON DELETE SET NULL so
  -- cancelling a project doesn't cascade-kill the event row.
  related_project_id  uuid references public.projects(id) on delete set null,

  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

comment on table public.inspection_events is
  'Per-track regulatory + QA event schedule (PR-N11). Service-role only.';

-- Range queries by week + track-grouping pattern of the dashboard grid.
create index inspection_events_date_track_idx
  on public.inspection_events (event_date, track);

create index inspection_events_project_idx
  on public.inspection_events (related_project_id);

-- updated_at maintenance trigger.
create or replace function public.inspection_events_set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists inspection_events_set_updated_at_trg on public.inspection_events;
create trigger inspection_events_set_updated_at_trg
  before update on public.inspection_events
  for each row execute function public.inspection_events_set_updated_at();

alter table public.inspection_events enable row level security;

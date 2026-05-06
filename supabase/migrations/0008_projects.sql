-- 0008_projects — five-stage project pipeline (PR-N7).
--
-- A "project" is what a won lead turns into — a tracked piece of BD work
-- with a stage, an owner, a date, and (optionally) a back-link to the
-- originating lead row. Powers the Project Pipeline kanban on /dashboard
-- (replaces the "Coming in PR-N4" placeholder).
--
-- Stages match the design PDF (Propharmex Console — Lead Intake):
--   discovery   → exploratory CMC scoping
--   scoping_nda → NDA signed, scope locked
--   execution   → development underway
--   qa_review   → in QA / regulatory review gate
--   delivered   → handed off / closed-won
--
-- Service-role only access. RLS enabled, no policies — same posture as
-- public.leads (the dashboard reads via service-role; auth is at the app
-- layer via getDashboardUserEmail() / DASHBOARD_AUTH_DISABLED bypass).

create extension if not exists "pgcrypto";

drop table if exists public.projects;

create table public.projects (
  id            uuid primary key default gen_random_uuid(),

  -- Display code shown on the kanban cards (e.g., "PX-A4F1"). Generated
  -- at insert time from the uuid prefix; uppercase + non-overlapping
  -- with lead IDs (which use "LD-" prefix). The column is `text` rather
  -- than `serial` so codes don't gap on rollback / delete.
  code          text not null,

  -- BD-facing title, e.g. "Vireo · CMC analytical scoping".
  title         text not null,
  company       text,

  -- Stage = column on the kanban. CHECK constraint pinned to the design.
  stage         text not null default 'discovery' check (stage in (
    'discovery',
    'scoping_nda',
    'execution',
    'qa_review',
    'delivered'
  )),

  -- BD owners assigned to the project. Stored as a text array of emails;
  -- the UI looks up initials/colors per owner. No FK to auth.users since
  -- owners may be Propharmex staff who don't yet have dashboard accounts.
  owner_emails  text[] not null default '{}',

  -- Soft due-date for the next milestone in the current stage. Nullable
  -- because not every project has a hard deadline (esp. early discovery).
  due_date      date,

  -- Visual flag on the kanban card (the ⚠ in the design).
  flagged       boolean not null default false,
  -- Free-text internal notes / status update.
  notes         text,

  -- Optional back-link to the lead row that spawned this project.
  -- ON DELETE SET NULL so deleting a lead doesn't cascade-kill projects.
  lead_id       uuid references public.leads(id) on delete set null,

  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on table public.projects is
  'Five-stage project pipeline (PR-N7). Service-role only.';

create unique index projects_code_unique_idx on public.projects (code);
create index projects_stage_due_idx on public.projects (stage, due_date);
create index projects_lead_idx on public.projects (lead_id);

-- updated_at maintenance trigger.
create or replace function public.projects_set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists projects_set_updated_at_trg on public.projects;
create trigger projects_set_updated_at_trg
  before update on public.projects
  for each row execute function public.projects_set_updated_at();

alter table public.projects enable row level security;

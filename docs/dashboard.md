# Dashboard operator guide

The Propharmex leads dashboard at `/dashboard` is a single-page admin view
covering every lead the marketing site captures plus an AI-tool conversion
funnel. This document is for operators (BD team, engineering, ops) — it is
not user-facing copy.

> **TL;DR:** edit `DASHBOARD_ALLOWED_EMAILS` to control who can log in. Apply
> the three new migrations (`0005_leads.sql`, `0006_auth_sessions.sql`,
> `0007_lead_intelligence.sql`) once. Magic-link emails come through Resend.

---

## 1. Architecture (how it fits)

| Layer | Where it lives | Notes |
|---|---|---|
| Auth | Supabase Auth (`signInWithOtp`) via `@supabase/ssr` | Email magic link; Supabase delivers the email + manages refresh tokens |
| Auth helpers | `apps/web/lib/supabase-auth/{server,browser}.ts` | `getDashboardUserEmail()` is the canonical access check |
| Allowlist gate | `DASHBOARD_ALLOWED_EMAILS` env var | Checked before sending the magic-link email AND on every page/route |
| Lead spine | `public.leads` + `public.lead_notes` | Service-role only (no RLS policies) |
| AI brief cache | `public.lead_intelligence` | Lazy-generated, cached forever per lead |
| Dashboard UI | `apps/web/app/dashboard/*` | Server-rendered initial state, client-side filters/drawer |
| Funnel rollup | `apps/web/app/dashboard/funnel/page.tsx` | JOINs `leads` × per-tool session tables |

The four marketing-site lead surfaces (`/api/contact`,
`/api/whitepaper-download`, `/api/newsletter`, `/api/ai/scoping/submit`)
write to `leads` via the shared `leadsLib.insertLead()` helper. Inserts are
best-effort — a failed insert logs `leads.insert.db_error` but never 5xxs
the user-facing form.

---

## 2. Allowlist management

`DASHBOARD_ALLOWED_EMAILS` is a comma-separated list, e.g.:

```
DASHBOARD_ALLOWED_EMAILS=alice@propharmex.com,bob@propharmex.com,clientpartner@example.com
```

To add/remove a user:

1. Edit the env var (Vercel UI for prod, `.env.local` for dev).
2. Redeploy or restart `pnpm dev`.
3. Existing sessions for removed addresses keep working until their cookie
   expires (max 30 days). To force-logout a user immediately, run:
   ```sql
   update public.auth_sessions
     set revoked_at = now()
     where email = 'removed@example.com';
   ```

Anyone NOT in the allowlist can still POST to `/api/auth/login` — they
receive a 202 (we don't leak the membership of the allowlist) but no
magic-link email is actually sent.

---

## 3. AI lead intelligence — cost monitoring

Each "Generate AI brief" click costs roughly $0.01-0.05 in Anthropic API
calls (one Claude `generateObject` round trip). Generated briefs are cached
in `public.lead_intelligence` and reused on subsequent views.

**Monthly cost ceiling:** Anthropic API rate limits + the route's per-IP
limit (`lead-intel:ip` = 5 calls/min) plus once-cached-forever-per-lead
caps real spend at ~$0.05 × N_unique_leads_viewed_per_month. For a 200-lead
month, expect $5-10 worst case.

**Cost monitoring queries:**

```sql
-- Total briefs ever generated
select count(*) from public.lead_intelligence;

-- Briefs generated in the last 7 days
select count(*) from public.lead_intelligence
  where generated_at > now() - interval '7 days';

-- Average score by source — sanity-check that scoping-tool leads score higher
select l.source, round(avg(li.intent_score)) as avg_score, count(*) as n
  from public.lead_intelligence li
  join public.leads l on l.id = li.lead_id
  group by l.source order by avg_score desc;
```

---

## 4. Status workflow

The four-state lifecycle:

```
new ──▶ contacted ──▶ won
              └─────▶ lost
```

- **new**: row landed via a form submission. Default for every insert.
- **contacted**: BD team has replied (sets `contacted_at`).
- **won**: closed deal (sets `closed_at`).
- **lost**: not pursued / no fit (sets `closed_at`).

Status transitions auto-write a `lead_notes` row of `kind='status_change'`
so the audit trail tells you who moved the status and when. `lead_notes`
is append-only — never delete from it.

---

## 5. First-time setup

1. **Apply migrations** — two SQL files under `supabase/migrations/`:
   - `0005_leads.sql` — `leads` + `lead_notes` tables
   - `0007_lead_intelligence.sql` — AI brief cache

   `0006_auth_sessions.sql` is now a no-op (Supabase Auth replaces our
   homegrown sessions). Apply via Supabase MCP (`apply_migration`) or
   paste each into the SQL editor at https://supabase.com/dashboard.

2. **Configure Supabase Auth** in the Supabase dashboard:
   - **Authentication → Providers → Email**: ensure "Email" is enabled
     and "Magic Link" is on. The default Supabase email sender works
     for low volume; for production, configure custom SMTP (Resend
     supports this) under Authentication → Settings → SMTP Settings.
   - **Authentication → URL Configuration**: add `https://propharmex.com/api/auth/confirm`
     to the allowed redirect URLs list. For dev, also add
     `http://localhost:3000/api/auth/confirm`.
   - (Optional, recommended for tight allowlisting) **Authentication →
     Settings → User Signups**: turn OFF "Enable Sign Up" and pre-create
     each allowlisted user manually under Authentication → Users.

3. **Set env vars** (production via Vercel UI):
   - `NEXT_PUBLIC_SUPABASE_URL=...` (already set)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY=...` (already set)
   - `SUPABASE_SERVICE_ROLE_KEY=...` (already set; service-role for lead writes)
   - `DASHBOARD_ALLOWED_EMAILS=anilbabubotta@gmail.com,...` (comma list)
   - `NEXT_PUBLIC_SITE_URL=https://propharmex.com` (already set; used as the redirect base)

4. **Visit** `https://propharmex.com/dashboard` → enter your allowlisted
   email → click the Supabase magic-link in your inbox → you're in.

5. **Submit a test lead** via `/contact` and confirm it appears in the
   dashboard within 1–2 seconds.

---

## 6. Truncating + resetting

To wipe all leads (e.g., post-launch tests, never in prod with real data):

```sql
-- Cascades to lead_notes + lead_intelligence via FK on delete cascade.
truncate public.leads;
```

Auth sessions are independent — a truncate doesn't log anyone out.

---

## 7. Out-of-scope follow-ups (PR-N4 candidates)

Tracked, not built:

- Slack notification on new high-intent (`hot`-banded) leads.
- Daily digest email (Resend cron).
- Cal.com webhook → auto-mark `meeting_scheduled` status (currently
  4-state model has no `meeting_scheduled`; would need a 5-state extension).
- Resend-from-dashboard sending so reply threads stay tracked.
- PostHog session-replay deep link per lead.
- Per-user RLS (when allowlist grows past 5).

---

## 8. Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `/dashboard/login` says "Check your inbox" but no email arrives | Email not in allowlist OR Resend misconfigured | Verify `DASHBOARD_ALLOWED_EMAILS` includes the address; check Resend dashboard for delivery status |
| Magic link returns "invalid or expired" | Token >15 min old, or already used | Request a fresh link — the cookie persists 30 days once verified |
| Dashboard shows zero leads but the contact form was submitted | `getServerSupabase()` returned null in the API route | Check `SUPABASE_SERVICE_ROLE_KEY` is set; check `leads.insert.supabase_unavailable` log |
| "Generate AI brief" returns 503 | `ANTHROPIC_API_KEY` not set | Set the key in Vercel env |
| AI brief feels off/wrong | Sanity prompt config or fallback drift | Edit `aiPromptConfig.leadIntelligence` in the embedded Studio at `/studio` |

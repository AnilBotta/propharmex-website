# Runbook — Propharmex web

Operations playbook for the Propharmex marketing site (Prompt 25 PR-A).
Read this before deploying, debugging a prod incident, or rotating
secrets. The runbook is the **source of truth for operational
behaviour** — code that diverges from this doc is wrong; ship a fix or
update the doc, not both at once.

> If you are paged at 03:00 and skim only one section, jump to **§4
> Incident response**.

---

## 1. Surface map

| Component | Where | Provider |
|---|---|---|
| Marketing site | `apps/web` | Vercel (Next.js 15 + Edge runtime mix) |
| CMS | `apps/studio` | Sanity Studio v3 (project `veo2rnkc`, dataset `production`) |
| DB | `packages/lib/supabase` | Supabase Postgres (`uvrgrulamuhwzuvbljbv`) + pgvector |
| AI inference | `app/api/ai/*` | Anthropic Claude (primary), OpenAI GPT-4o (fallback), `text-embedding-3-large` |
| Email | Resend | `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_CONTACT_TO_EMAIL` |
| Booking | Cal.com embed | `CAL_LINK`, `CAL_EVENT_TYPE_ID` |
| Analytics | Plausible + PostHog | See `docs/analytics-taxonomy.md` |
| Bot protection | Cloudflare Turnstile | `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` |
| Rate limit | Upstash Redis | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` |
| Errors | Sentry | `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_AUTH_TOKEN` |
| Logs | Axiom (structured logger) | `AXIOM_TOKEN`, `AXIOM_DATASET` |
| Liveness | `/api/health` | Edge runtime; Vercel + scheduled-tasks MCP probe |

All secrets live in Vercel env (`Project Settings → Environment Variables`); never in the repo. `.env.example` is the spec.

---

## 2. Deploy

### 2.1 Standard deploy (preview + production)

1. Open a PR. Vercel builds a preview automatically.
2. Verify on the preview URL:
   - Hero CTAs work, `/contact` form submits, AI tools open.
   - `/api/health` returns `200 {status:"ok",...}`.
   - `/sitemap.xml` and `/robots.txt` return 200.
   - No CSP violations in browser DevTools (look for `Refused to load…` — see §5.2 for triage).
3. Merge to `main`. Vercel auto-deploys to production (`propharmex.com`).
4. Verify production:
   - `curl -I https://propharmex.com` — 200 + expected security headers.
   - `curl https://propharmex.com/api/health` — `{status:"ok"}`.
   - PostHog Live Events panel — `$pageview` arrives within 30 s.
   - Sentry → Releases — new release appears within 2 minutes.

### 2.2 Pre-deploy checklist

- [ ] `pnpm --filter web typecheck && lint && test` PASS locally.
- [ ] `pnpm --filter @propharmex/lib typecheck && test` PASS locally.
- [ ] PR description has a Test Plan with at least one screenshot for any UI change.
- [ ] If adding a new `posthog.capture(...)` — `docs/analytics-taxonomy.md` updated.
- [ ] If adding a new external asset host — `vercel.json` CSP `connect-src` / `img-src` / `script-src` updated.
- [ ] If adding a new env var — `.env.example` + `packages/lib/env.ts` schema both updated.

---

## 3. Rollback

### 3.1 Production regression — Vercel one-click

1. Vercel dashboard → `propharmex-web` project → `Deployments`.
2. Find the last known-good production deployment (state `Ready`, marked Production).
3. Click `…` → **Promote to Production**.
4. Verify `/api/health` and the affected surface within 5 minutes.
5. Open a `revert` PR against `main` so the bad commit is also out of code (don't leave production diverged from `main` — it confuses future deploys).

### 3.2 Database migration regression

Migrations live in `supabase/migrations/`. They are **forward-only**.
Rolling back a schema change requires a new migration that reverses it.
The `supabase` MCP `apply_migration` should be used in production —
never `psql` directly. See `apps/studio/README.md` for the safe-write
gate.

### 3.3 Sanity content regression

Editor mistakes are reversible via Sanity's revision history (every
document carries `_rev`). Studio → Document → `…` → **Revert to
revision**. No code change needed.

---

## 4. Incident response

### 4.1 Severity ladder

| Sev | Definition | Page on-call? |
|---|---|---|
| 1 | Site down / 500s on `/`, `/contact`, or `/insights/*` for >5 min | **Yes** |
| 2 | AI tool broken, contact form not delivering, >25% Sentry error rate | Yes (business hours) |
| 3 | Cosmetic regression, single-page issue, accessibility miss | No — file a follow-up |
| 4 | Internal-only / non-customer-facing | No |

### 4.2 Sev-1 procedure

1. **Acknowledge** in #propharmex-incidents.
2. **Status check** — `curl -I https://propharmex.com/api/health`. If non-200, jump to step 5.
3. **Vercel deployments** — has a deploy landed in the last 30 min? If yes, **promote previous deployment** (§3.1).
4. **Sentry** — open the trending issue. Read the redacted exception. Note the affected route(s).
5. **External-dependency check** — Sanity status, Anthropic status, Resend status. If any vendor is down, post to the incident channel and wait — our app shouldn't synchronously block the user on these (each is wrapped in env-gated short-circuits).
6. **Communicate** — short status to `hello@propharmex.com` distribution if the outage is customer-visible >15 minutes.
7. **Post-mortem** — file a doc in `docs/incidents/YYYY-MM-DD-<slug>.md` within 48h. No-blame template covers: timeline, contributing factors, what worked, action items.

### 4.3 Sev-2 procedure

1. Acknowledge in #propharmex-incidents.
2. File a tracking issue, assign yourself or the on-call.
3. Triage Sentry; identify whether it's a regression (compare to last release) or a vendor incident.
4. If a regression: revert the commit, redeploy. If a vendor: post status, set up a poller, communicate ETA.
5. Resolve within 24h or escalate to Sev-1.

---

## 5. Security headers

### 5.1 Header policy

All headers ship from `vercel.json`. Layered with the `next.config.ts`
`headers()` declaration for two redundant emit paths.

| Header | Value (summary) |
|---|---|
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | camera/mic/geo/floc all denied |
| `Strict-Transport-Security` | 2-year `max-age`, `includeSubDomains`, `preload` |
| `Content-Security-Policy` | strict allowlist with `report-uri /api/csp-report` |

### 5.2 CSP triage — "Refused to load X"

When DevTools shows a CSP violation:

1. Read the **violated directive** — it tells you which origin/inline script was blocked.
2. Decide: is the asset legitimate, or is this a real attack?
3. If legitimate (e.g. a new analytics vendor), update `vercel.json`'s CSP value with the minimal directive that allows it. Prefer specific hosts (`https://foo.bar.com`) over wildcards. Avoid widening `script-src` if any other directive will do.
4. If suspicious, leave CSP as-is and investigate the source (dev extension, compromised package, malicious npm script).
5. CSP violations also POST to `/api/csp-report` and land in Axiom under `csp.violation`. Filter by `effectiveDirective` to see violation distribution over time.

### 5.3 CSP rollback

If a CSP enforcement causes a prod outage and you cannot ship a fix
immediately: switch `Content-Security-Policy` to
`Content-Security-Policy-Report-Only` in `vercel.json`, redeploy. The
report endpoint will keep collecting violations while the site is
unblocked. Re-enforce after the offending asset is fixed.

---

## 6. Sentry

### 6.1 Triage

1. Filter by `environment = production`.
2. Sort by `Last Seen` desc.
3. Click an issue. Confirm the redaction policy is intact: no email
   addresses, no IPs, no request bodies. If you see PII, **drop the
   event** (Sentry → `…` → `Delete and Discard Future Events`) and
   immediately patch `apps/web/lib/sentry-redact.ts` to cover that
   field. PII in Sentry is a Sev-2 by itself.
4. Read the stack trace. Source maps are uploaded at build time when
   `SENTRY_AUTH_TOKEN` is set; if you see minified frames, the upload
   step failed and the build log is the place to look (`Sentry CLI: …`).

### 6.2 Release health

Each deploy creates a Sentry release matching the Vercel deployment
URL. The `Releases` view shows crash-free session % per release. If a
new release shows < 99.5% crash-free, rollback (§3.1) before
investigating.

### 6.3 Sample-rate tuning

`tracesSampleRate` is 100% in dev, 25% in preview, 10% in prod. If
prod traffic spikes and Sentry quota becomes a concern, drop prod to
5% in `sentry.client.config.ts` / `sentry.server.config.ts` /
`sentry.edge.config.ts` and redeploy.

---

## 7. Analytics & telemetry

`docs/analytics-taxonomy.md` is the canonical event registry. Briefly:

- **PostHog** captures the bounded event taxonomy + `$pageview`. Super-properties are auto-merged on every event (region, referrer_group, device_class, first_touch_utm).
- **Plausible** captures privacy-friendly page counts. No custom goals — we standardize on PostHog for funnel work.
- **Axiom** carries the structured logs from `@propharmex/lib/log` (info/warn/error). CSP violations land here under `csp.violation`. Whitepaper / contact captures land here under `whitepaper.*` / `contact.*`.

---

## 8. PII & redaction policy

Single source of truth: **never log raw PII**. The same rules apply
across logger, Sentry, PostHog, and any future telemetry vendor.

| Field | Action |
|---|---|
| Email address | Redact local part — `re***@example.com` |
| Full name | Replace with `<redacted>` or count only |
| Phone | Replace with `<redacted>` |
| IP | Drop — Sentry `sendDefaultPii: false`, `apps/web/lib/sentry-redact.ts` strips `user.ip_address` |
| Cookies | Drop — Sentry config strips `request.cookies` |
| Request body / form data | Drop — Sentry config strips `request.data`; logger callers must pre-filter |
| Auth headers / API keys | Replace with `<redacted>` — `apps/web/lib/sentry-redact.ts` `TOKEN_HEADER_KEYS` |
| AI chat messages | Bucket into `lengthBucket: "xs" | "s" | "m" | "l" | "xl"` before capture; never raw text |

If you spot an event in Sentry / Axiom / PostHog that violates this
policy, it is a Sev-2 incident: stop the leak first, fix the
redaction layer, then verify the change in production.

---

## 9. Bot protection

- **Cloudflare Turnstile** is wired on `/contact` and `/insights/whitepapers/[slug]` gates. Both server routes verify the token via Cloudflare's `siteverify` API.
- The widget no-ops when `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is unset.
- The server verifier short-circuits to allow when `TURNSTILE_SECRET_KEY` is unset — this keeps dev / preview unblocked without a key, but means **the production env vars must be set** before the widget can actually block bots. See `apps/web/components/site/TurnstileWidget.tsx` and the verifier helpers in `app/api/contact/route.ts` + `app/api/whitepaper-download/route.ts`.
- AI endpoints (`/api/ai/*`) are protected by Upstash rate-limiting (Prompts 18–21). Turnstile is intentionally **not** wired on AI tools — they're inherently exploration-oriented and a captcha would harm legitimate trials.

---

## 10. Vendor outage playbooks

### 10.1 Anthropic / OpenAI down

- AI tool surfaces still render (the system prompt + UI are local). The first user message will fail with `model_overloaded` or 5xx.
- The user-facing error message is friendly (`"We couldn't reach the model — please retry shortly"`). No further action required short-term.
- If the outage is >30 minutes, post a `Service notice` strip on the relevant `/ai/*` page (manual content edit).

### 10.2 Sanity down

- Pages render from the static content dictionaries (`apps/web/content/*.ts`). Editor previews break, but public site is unaffected.
- The Studio at `studio.propharmex.com` will be unreachable. No public-site action needed.

### 10.3 Resend down

- `/api/contact` and `/api/whitepaper-download` log to Axiom and return `202 { queued: false }` to the client. The user sees "We've received your inquiry" with a fallback email link.
- Recover lost messages from Axiom (`contact.submitted_unconfigured` / `whitepaper.resend_not_configured`) and re-send manually after Resend recovers.

### 10.4 Cal.com embed broken

- `/contact` renders a fallback panel ("Email us at hello@propharmex.com") when the embed iframe fails. No app-side action required.

### 10.5 Cloudflare Turnstile down

- Forms still submit — the server verifier returns 403 only when a token was supplied AND verification failed. With Cloudflare down, the widget never delivers a token, the client submits without one, and the server verifier short-circuits to allow (since the body field is optional).
- Spam / bot volume may spike during the outage. Monitor Axiom `contact.submitted` velocity and disable the form temporarily if abuse is severe.

---

## 11. On-call

- Primary: Anil (anilbabubotta@gmail.com)
- Escalation: TBD

---

## 12. Bundle-size budget

The `Bundle budget` GitHub workflow (`.github/workflows/bundle-budget.yml`) runs on every PR and every push to `main`. It builds the web app with `pnpm --filter web build`, captures stdout into `build.log`, and runs [`scripts/check-bundle-budget.mjs`](../scripts/check-bundle-budget.mjs) against the route-size table.

### 12.1 Current threshold

**475 kB First-Load JS per route on mobile.** This is **not** the original Prompt 25 spec value (150 kB). The 150 kB target was unachievable with the stack we ship — Sentry adds ~100 kB, PostHog ~50 kB, Framer Motion ~30 kB, the AI SDK on `/ai/*` tools ~120 kB. Even a barebones React 19 + Next 15 page lands around 173 kB before any app code.

The 475 kB ceiling matches the worst current route (`/ai/project-scoping-assistant` at 452 kB) plus ~5% headroom. **The gate is here to catch regressions, not to enforce an aspirational value** — a Framer Motion duplicate-import or an incidental import of the entire `lucide-react` icon set would push routes well over 475 kB and fail CI.

Override with `BUNDLE_BUDGET_KB` env var if you need to ratchet.

### 12.2 Excluded routes

These don't ship client JS but Next 15's build table prints the shared-baseline number for them anyway (around 173 kB) — meaningless data, so the script filters them out:

- `/api/*` — server-only route handlers
- `/sitemap.xml`, `/robots.txt` — server-rendered XML/text
- `*/opengraph-image`, `*/twitter-image` — PNG generation routes

### 12.3 Local analysis

`ANALYZE=true pnpm --filter web build` writes interactive treemaps to `apps/web/.next/analyze/`. Open `client.html` to see what's heavy on the client bundle.

### 12.4 Remediation tiers (easiest first)

1. Add the offending import to a `dynamic()` boundary so it loads on interaction rather than first paint.
2. Move state-only logic out of client components into server components.
3. Replace heavy deps with lighter ones (e.g. `date-fns` → `Intl.DateTimeFormat`).
4. Code-split with `next/dynamic({ ssr: false })` for components that never need to render on the server.
5. As a last resort: ratchet the budget. Document the new ceiling in §12.5.

If the budget gate fails on a PR you genuinely can't fix in-PR, ratchet `BUNDLE_BUDGET_KB` in the workflow with a TODO comment + follow-up issue. **Do not** delete the workflow — it's the only thing that catches a 600 kB Framer Motion regression.

### 12.5 Ratchet-down follow-ups

Tickets to bring the ceiling down toward a healthier ~300 kB and to promote demoted Lighthouse assertions back to `error`:

- [ ] **Lazy-load Cal.com on `/contact`** — pulls `/contact` from 347 kB → ~250 kB. Recorded Lighthouse follow-up from Prompt 23. **Promotes**: `categories:performance` 0.90 → 0.95 (perf), `largest-contentful-paint` warn → error. The /contact LCP has flaked the gate three times (Prompt 25 PR-B at 2169 ms, Prompt 26 PR-A at 2564 ms — both with thresholds of 2000 then 2500). Cal.com + Turnstile + Sentry stack the page right against any reasonable threshold; lazy-loading the embed is the only durable fix.
- [ ] **Dynamic-import the AI SDK on `/ai/*` tool pages** — `import('ai/react')` only when the user opens the chat surface. Should pull `/ai/project-scoping-assistant` from 452 kB → ~330 kB.
- [ ] **Audit `lucide-react` imports** — confirm we're using per-icon imports (`import { Foo } from 'lucide-react'`) not the barrel.
- [ ] **Audit `framer-motion`** — split feature imports (`m`, `LazyMotion`) where appropriate to enable tree-shaking.
- [ ] After each follow-up lands, ratchet `BUNDLE_BUDGET_KB` down so the gate continues to catch regressions at the new floor.

---

## 13. Uptime monitoring

Vercel Cron (`vercel.json` → `crons[]`) hits `/api/health` every minute. The endpoint is edge-runtime, returns `{status:"ok"}`, and is cheap (~5 ms). Cron requires Vercel **Pro plan** — on Hobby tier the entry is a no-op and uptime is best-effort via external pingers.

- **External uptime check (recommended)**: configure a 60-second ping at https://propharmex.com/api/health from a third-party uptime service (BetterStack / Uptime Kuma / Cronitor). Vercel Cron is good enough for "is the deployment healthy" but doesn't tell you if Vercel itself is up.
- **Alerts**: page on `/api/health` returning non-200 for >2 consecutive checks. Don't alert on a single failure — Vercel cold-start and brief 5xx during deploy promotion are normal and not actionable.

---

## 14. Changelog

| Date | Change | PR |
|---|---|---|
| 2026-04-29 | Runbook initial — Prompt 25 PR-A | [#40](https://github.com/AnilBotta/propharmex-website/pull/40) |
| 2026-04-29 | Bundle budget + uptime cron — Prompt 25 PR-B | TBD |

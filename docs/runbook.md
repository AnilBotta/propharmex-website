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

| Component      | Where                                            | Provider                                                                                                                                                           |
| -------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Marketing site | `apps/web`                                       | Vercel (Next.js 15 + Edge runtime mix)                                                                                                                             |
| CMS            | `apps/web/sanity` (embedded at `/studio`, PR-L′) | Sanity Studio v3 (project `veo2rnkc`, dataset `production`)                                                                                                        |
| DB             | `packages/lib/supabase`                          | Supabase Postgres (`uvrgrulamuhwzuvbljbv`) + pgvector                                                                                                              |
| AI inference   | `app/api/ai/*`                                   | Anthropic Claude (primary), OpenAI GPT-4o (fallback), `text-embedding-3-large`                                                                                     |
| Email          | Resend                                           | `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_CONTACT_TO_EMAIL`                                                                                                   |
| Booking        | Cal.com embed                                    | `CAL_LINK`, `CAL_EVENT_TYPE_ID`                                                                                                                                    |
| Analytics      | Plausible + PostHog                              | See `docs/analytics-taxonomy.md`                                                                                                                                   |
| Bot protection | Cloudflare Turnstile                             | `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`                                                                                                           |
| Rate limit     | Upstash Redis                                    | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`                                                                                                               |
| Errors         | Sentry                                           | `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_AUTH_TOKEN`                                                                                                                      |
| Logs           | Axiom (structured logger)                        | `AXIOM_TOKEN`, `AXIOM_DATASET`                                                                                                                                     |
| Liveness       | `/api/health`                                    | Edge runtime; pinged every 5 min by external uptime monitor (UptimeRobot free tier — see §13). Vercel Pro `crons[]` retired in PR-M′ for Hobby-plan compatibility. |

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
never `psql` directly.

### 3.3 Sanity content regression

Editor mistakes are reversible via Sanity's revision history (every
document carries `_rev`). Studio → Document → `…` → **Revert to
revision**. No code change needed.

---

## 4. Incident response

### 4.1 Severity ladder

| Sev | Definition                                                          | Page on-call?         |
| --- | ------------------------------------------------------------------- | --------------------- |
| 1   | Site down / 500s on `/`, `/contact`, or `/insights/*` for >5 min    | **Yes**               |
| 2   | AI tool broken, contact form not delivering, >25% Sentry error rate | Yes (business hours)  |
| 3   | Cosmetic regression, single-page issue, accessibility miss          | No — file a follow-up |
| 4   | Internal-only / non-customer-facing                                 | No                    |

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

| Header                      | Value (summary)                                    |
| --------------------------- | -------------------------------------------------- |
| `X-Content-Type-Options`    | `nosniff`                                          |
| `X-Frame-Options`           | `DENY`                                             |
| `Referrer-Policy`           | `strict-origin-when-cross-origin`                  |
| `Permissions-Policy`        | camera/mic/geo/floc all denied                     |
| `Strict-Transport-Security` | 2-year `max-age`, `includeSubDomains`, `preload`   |
| `Content-Security-Policy`   | strict allowlist with `report-uri /api/csp-report` |

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

| Field                    | Action                                                                                          |
| ------------------------ | ----------------------------------------------------------------------------------------------- | --- | --- | --- | ------------------------------------ |
| Email address            | Redact local part — `re***@example.com`                                                         |
| Full name                | Replace with `<redacted>` or count only                                                         |
| Phone                    | Replace with `<redacted>`                                                                       |
| IP                       | Drop — Sentry `sendDefaultPii: false`, `apps/web/lib/sentry-redact.ts` strips `user.ip_address` |
| Cookies                  | Drop — Sentry config strips `request.cookies`                                                   |
| Request body / form data | Drop — Sentry config strips `request.data`; logger callers must pre-filter                      |
| Auth headers / API keys  | Replace with `<redacted>` — `apps/web/lib/sentry-redact.ts` `TOKEN_HEADER_KEYS`                 |
| AI chat messages         | Bucket into `lengthBucket: "xs"                                                                 | "s" | "m" | "l" | "xl"` before capture; never raw text |

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
- The embedded Studio at `propharmex.com/studio` (PR-L′) will fail to load schema/desk data and editors will see a connection-error toast. The studio shell itself is hosted from the Next.js bundle and continues to render. No public-site action needed; recovery is automatic when Sanity's API returns.
- If editors report `/studio` cannot reach `*.api.sanity.io`, verify (a) the project's CORS Origins list at https://www.sanity.io/manage/project/veo2rnkc/api includes the current host (production + any preview URL the editor is on) and (b) `vercel.json` CSP `connect-src` still allows the Sanity hostnames. Both were configured in PR-L′ — only re-check if a CSP edit landed since.

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

**350 kB First-Load JS per route on mobile.** This is **not** the original Prompt 25 spec value (150 kB). The 150 kB target remains unrealistic with the stack we ship: Sentry, PostHog, the AI SDK on `/ai/*` tools, and the React 19 + Next 15 baseline all contribute meaningful first-load cost before page code.

The 350 kB ceiling matches the homepage after the June 2026 motion/component audit (`/` at roughly 346 kB) with a small regression buffer. **The gate is here to catch regressions, not to enforce an aspirational value**; a duplicate Framer Motion import or an incidental client-island expansion should fail CI.

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

- [x] **Homepage motion/component audit** — static homepage sections now render as server components; hero CTA analytics are split into a small client island; the process timeline no longer ships scroll-linked Framer Motion. `/` now measures roughly 346 kB.
- [ ] **Reduce remaining homepage Framer usage** — the scientific pathway visual still uses Framer Motion. Split or replace it before any next ratchet below 350 kB.
- [ ] **Dynamic-import the AI SDK on `/ai/*` tool pages** — `import('ai/react')` only when the user opens the chat surface.
- [ ] **Audit `lucide-react` imports** — confirm we're using per-icon imports (`import { Foo } from 'lucide-react'`) not the barrel.
- [ ] **Audit `framer-motion`** — split feature imports (`m`, `LazyMotion`) where appropriate to enable tree-shaking.
- [ ] After each follow-up lands, ratchet `BUNDLE_BUDGET_KB` down so the gate continues to catch regressions at the new floor.

---

## 13. Uptime monitoring

`/api/health` is an edge-runtime route that returns `{status:"ok"}` in ~5 ms. It's pinged from outside Vercel by **UptimeRobot free tier** (configured in PR-M′; the previous Vercel Pro `crons[]` was removed because the project ships on Vercel Hobby).

**Setup recipe** (run once after creating an UptimeRobot account):

1. Sign up at https://uptimerobot.com/ (free, no credit card).
2. **Add new monitor** → Monitor type **HTTPS**.
3. Friendly name: `Propharmex production`. URL: `https://propharmex.com/api/health`.
4. Monitoring interval: **5 minutes** (free-tier max). Timeout: 30 s.
5. Alert contacts: at least one email; add Slack/SMS/webhook as needed.
6. Save → first ping fires within 5 minutes; the monitor flips to "Up" once it returns 200.

**Recommended additions:**

- A second monitor against `https://<project>.vercel.app/api/health` so a broken-preview deploy gets caught before promotion.
- A status-page (UptimeRobot's free public status page is sufficient for client-facing transparency).

**Alerting rule of thumb:** page on `/api/health` returning non-200 for **>2 consecutive checks** (i.e. ≥10 min). Don't alert on a single failure — Vercel cold-start and brief 5xx during deploy promotion are normal and not actionable. UptimeRobot's "Down after X failed checks" setting handles this directly.

**Operating costs:** $0 at free tier. If you outgrow it (need <5 min interval, more monitors, multi-region pings), BetterStack and Cronitor have similar free tiers worth comparing before paying.

---

## 14. Accessibility testing

Three layers; treat all three as required for an AA conformance claim.

### 14.1 Lighthouse CI (automated, every PR)

`.github/workflows/lighthouse.yml` runs Lighthouse against the same 10 URLs the a11y workflow covers. The `categories:accessibility` assertion is currently `warn` at 0.95 — we promote it to `error` at 1.0 once the manual AT pass confirms (§14.3) and axe-core CI shows clean across the same URLs.

### 14.2 axe-core CI (automated, every PR)

`.github/workflows/a11y-budget.yml` boots `next start`, runs `@axe-core/cli` against 11 URLs (the Lighthouse 10 + `/accessibility`), and gates on **serious + critical** violations only. Minor and moderate findings are surfaced via the uploaded `axe-reports` artifact but don't fail the build — they're tracked in [`docs/accessibility-conformance.md`](accessibility-conformance.md) §4 (Known limitations).

The gate is implemented in [`scripts/check-axe-violations.mjs`](../scripts/check-axe-violations.mjs) — Node 20 stdlib only, no npm deps.

To debug a failing run locally:

```bash
pnpm --filter web build
pnpm --filter web start &
pnpm dlx @axe-core/cli@4.10.x --tags wcag2a,wcag2aa,wcag21a,wcag21aa http://localhost:3000/contact
```

### 14.3 Manual AT pass (human, before launch + quarterly)

Automated tools catch ~30–40% of WCAG 2.1 AA failures. The remainder needs a real screen-reader session. Test plan + recording template: [`docs/accessibility-at-test-plan.md`](accessibility-at-test-plan.md).

- **Pre-launch** (before tagging v1.0.0): mandatory.
- **Quarterly** thereafter: scheduled.
- **After material change** to interactive surfaces: triggered.
- **After customer-reported barrier**: triggered.

Findings are written to `docs/accessibility-at-results-YYYY-MM-DD.md` and merged back into [`docs/accessibility-conformance.md`](accessibility-conformance.md) §3 + §7 (revision history).

### 14.4 Public conformance posture

The customer-facing accessibility statement lives at `/accessibility` ([`apps/web/app/accessibility/page.tsx`](../apps/web/app/accessibility/page.tsx)). The internal Accessibility Conformance Report (VPAT 2.5 format) lives at [`docs/accessibility-conformance.md`](accessibility-conformance.md), with a generated `.docx` companion at `docs/accessibility-conformance.docx` for compliance archives.

Regenerate the docx after editorial changes to the markdown:

```bash
py -m pip install python-docx==1.1.2
py scripts/generate-acr-docx.py
```

The script asserts on document structure (expected H1, expected H2 set, ≥6 tables) so silent content-drift breaks the build rather than producing a broken docx.

---

## 15. Cloudflare-proxy ops

The marketing site sits behind a Cloudflare proxy (Vercel is the origin). Architecture record + decision rationale lives in [docs/hosting-strategy.md](hosting-strategy.md). This section is the operational runbook for the proxy layer itself.

### 15.1 Cache purge after a Vercel deploy

Vercel's deploy promotion flips the origin to the new build, but Cloudflare keeps serving cached HTML and `/_next/static/*` until the `Cache-Control` `s-maxage` window elapses or you purge. For high-priority deploys (security fix, content correction visible above the fold) — purge immediately.

```bash
# Set once in your shell:
export CF_API_TOKEN="<your zone-scoped token with Cache Purge:Edit>"
export CF_ZONE_ID="<your zone id from CF dashboard overview>"

# Purge everything:
curl -X POST "https://api.cloudflare.com/client/v4/zones/$CF_ZONE_ID/purge_cache" \
  -H "Authorization: Bearer $CF_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything": true}'
```

For routine deploys, no purge is needed — `/_next/image/*` carries content-hash URLs that change automatically, and ISR pages are short-TTL anyway.

A `scripts/cf-purge-cache.mjs` utility wraps the curl above. Wire it into a Vercel deploy hook (Project Settings → Git → Deploy Hooks) only if you want automatic post-deploy purges.

### 15.2 Dev mode (3-hour proxy bypass)

For emergency debugging when you need to see exactly what Vercel is serving without any CF caching or transformation:

1. Cloudflare dashboard → Caching → Configuration → **Development Mode** → **On**.
2. Cloudflare bypasses cache + Polish + Auto Minify for 3 hours, then auto-disables.
3. Verify with `curl -I https://propharmex.com/<path>` — `cf-cache-status` will be `DYNAMIC` or absent on every request.

Don't leave Dev Mode on past your debugging window. It disables the cache layer entirely.

### 15.3 Error code triage

| Code    | Meaning                                        | First action                                                                                                   |
| ------- | ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| **522** | Origin connection timed out (>100s)            | Check Vercel status page; check `/api/health` direct via Vercel preview URL                                    |
| **523** | Origin unreachable (DNS / routing)             | Verify Vercel deploy succeeded; check `vercel.json` regions; rerun a deploy                                    |
| **525** | SSL handshake failed origin-side               | Verify SSL/TLS Mode = Full (Strict) AND Vercel cert is valid (auto-renewed; check Vercel project SSL settings) |
| **526** | Invalid SSL certificate                        | Same as 525 — usually means Vercel cert expired or domain mis-mapped                                           |
| **520** | Origin returned an empty / unexpected response | Check Vercel runtime logs via Vercel MCP for crashes                                                           |

For all 5xx CF errors, "Always Online" should serve a stale CF copy if one exists. If users see 522 with no stale fallback → escalate to **rollback (§15.5)**.

### 15.4 Bot Fight Mode false positives on `/contact`

Bot Fight Mode runs upstream of Turnstile and may aggressively block automated traffic. False positives surface as:

- PostHog `form_submit` event fires (user clicked Submit on `/contact`)
- PostHog `contact_submit` success event does **not** fire
- Sentry shows no error (the request never reached Vercel)

**Triage:**

1. Check Cloudflare dashboard → Security → Events → filter by host `/contact`. Look for `Bot Fight Mode` blocks in the time window.
2. If a real user is being blocked, lower Security Level on `/contact` only via a Configuration Rule:
   - Match: URI Path equals `/contact`
   - Action: Security Level → Essentially Off
3. Turnstile + WAF Managed Rules continue to protect the form. Bot Fight Mode bypass on `/contact` is acceptable because Turnstile is already specifically tuned for that path.

### 15.5 Rollback

If the proxy is the suspected cause of a production incident, rollback is **<60s**. Procedure documented in [docs/hosting-strategy.md §4](hosting-strategy.md). One-line summary: gray-cloud the apex DNS record in Cloudflare → Vercel direct.

For full Cloudflare removal (rare): switch nameservers back at the registrar. Phase 1 of the original cutover lowered DNS TTL to 300s — this is what makes that switch fast. Keep the TTL low (300s) for at least 24h after any cutover or rollback so resolvers don't carry stale records.

### 15.6 Verify the proxy is working

Sanity check on any incident or after a deploy:

```bash
curl -I https://propharmex.com | grep -iE 'cf-ray|cf-cache-status|server'
```

Expected:

- `cf-ray: <id>-<pop>` — Cloudflare request ID + serving PoP
- `cf-cache-status: HIT|MISS|DYNAMIC|EXPIRED|BYPASS` — cache decision
- `server: cloudflare`

If `cf-ray` is absent, the request bypassed Cloudflare (DNS misrouted, gray-clouded record, or rollback in effect — verify intent before treating as an incident).

---

## 16. Changelog

| Date       | Change                                                   | PR                                                                        |
| ---------- | -------------------------------------------------------- | ------------------------------------------------------------------------- |
| 2026-04-29 | Runbook initial — Prompt 25 PR-A                         | [#40](https://github.com/AnilBotta/propharmex-website/pull/40)            |
| 2026-04-29 | Bundle budget + uptime cron — Prompt 25 PR-B             | [#41](https://github.com/AnilBotta/propharmex-website/pull/41)            |
| 2026-05-05 | Drop Vercel cron, switch uptime to UptimeRobot — PR-M′   | (Hobby-plan compatibility; cron retired, external 5-min ping replaces it) |
| 2026-04-29 | A11y testing layers (§14) + ACR docx — Prompt 26 PR-B    | TBD                                                                       |
| 2026-05-04 | Cloudflare-proxy ops (§15) + hosting-strategy.md — PR-K′ | TBD                                                                       |

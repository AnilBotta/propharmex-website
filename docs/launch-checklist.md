# Launch checklist — Propharmex website v1.0.0

This is the operating document for the Propharmex website launch. It enumerates every gate that must be cleared before, during, and after the v1.0.0 cutover, with the owner and a verification step for each.

The customer-facing copy at [`docs/launch-checklist.pdf`](launch-checklist.pdf) is regenerated from this markdown by `scripts/generate-launch-checklist-pdf.py`. Do not edit the PDF directly. Editorial changes happen here.

Version: 1.0.0. Target launch window: TBD (operations to confirm DNS cutover slot).

---

## 1. Purpose and scope

This checklist applies to the first production launch of the Propharmex marketing website plus the four AI tools. It does **not** cover ongoing release management — that lives in [`docs/runbook.md`](runbook.md).

A launch is "complete" when the following are simultaneously true: the v1.0.0 git tag points to the merge commit deployed to production, all gates in section 2 below show as Pass or Waived-with-rationale, monitoring shows no Sev 1 issues for 24 hours after cutover, and the launch sign-off in section 8 is countersigned by the engineering, operations, and brand owners.

Anything else is a release candidate, not a launch.

---

## 2. Pre-launch gates

These must clear before staging sign-off. Each row has a single owner; multi-owner gates are split into multiple rows.

### 2.1 Code quality and CI

| Gate | Owner | Verification |
|---|---|---|
| `pnpm lint` clean across the monorepo | Engineering | CI workflow `ci.yml` job "Lint" green on main |
| `pnpm typecheck` clean | Engineering | CI workflow `ci.yml` job "Typecheck" green on main |
| `pnpm test` all suites pass | Engineering | CI workflow `ci.yml` job "Test" green on main |
| `pnpm --filter web build` succeeds | Engineering | CI workflow `ci.yml` job "Build" green on main |
| Storybook builds clean | Engineering | CI workflow `ci.yml` job "Storybook" green on main |
| Bundle budget at 450 kB First-Load JS | Engineering | CI workflow `bundle-budget.yml` green; current worst route 431 kB |
| Lighthouse CI: CWV strict, perf warn 0.90 | Engineering | CI workflow `lighthouse.yml` green; review LHCI run reports |
| axe-core CI: zero serious or critical violations | Accessibility | CI workflow `a11y-budget.yml` green |
| Playwright smoke suite passes | Engineering | All seven specs in `apps/web/e2e/*.spec.ts` pass against staging |

### 2.2 Content and editorial

| Gate | Owner | Verification |
|---|---|---|
| All Sanity documents published in production dataset | Editorial | Spot-check via Sanity Studio that every linked doc has `_state: "published"` |
| No placeholder copy or TBD strings remain on public routes | Editorial | Grep production HTML for "Lorem", "TBD", "TODO" — should return zero |
| Brand-voice review run on every page in `docs/handoff.md` §4 | Brand | `brand-voice-guardian` skill returns Pass on each route |
| Regulatory claims anchored to primary sources | Regulatory | `pharma-regulatory-writer` posture — every claim has an "as of" date |
| Whitepaper PDF downloads cleanly via gate form | Editorial | Manual: complete gate form with a real email; receive PDF |
| Insights articles render with correct `publishedAt` dates | Editorial | Visit each article, confirm date matches Sanity |

### 2.3 Identity, DNS, and TLS

| Gate | Owner | Verification |
|---|---|---|
| Apex domain DNS A/ALIAS pointing at Vercel | Operations | `dig propharmex.com A +short` resolves to a Vercel IP |
| `www` CNAME pointing at Vercel | Operations | `dig www.propharmex.com CNAME +short` resolves to Vercel |
| TLS certificate active on apex | Operations | Browser shows valid cert; `openssl s_client` confirms expiry > 60 days |
| TLS certificate active on `www` | Operations | Same as above for www subdomain |
| HSTS header present and includes preload | Operations | `curl -I https://propharmex.com` shows `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload` |
| `www` to apex 301 redirect (or apex to www, choose one and document) | Operations | `curl -I` confirms 301 |

### 2.4 Email and forms

| Gate | Owner | Verification |
|---|---|---|
| Resend production sender domain verified | Operations | DKIM and SPF DNS records visible; Resend dashboard shows green |
| Inquiry form submissions hit business development inbox | BD lead | Submit a test inquiry; confirm receipt within 5 minutes |
| Whitepaper gate triggers download email | BD lead | Complete gate form; confirm email delivery |
| Newsletter double-opt-in flow completes | Operations | Submit on `/insights`; receive confirmation email; confirm subscribe |
| Cloudflare Turnstile production keys deployed | Engineering | `TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` in Vercel env match Cloudflare dashboard |

### 2.5 AI endpoints

| Gate | Owner | Verification |
|---|---|---|
| `ANTHROPIC_API_KEY` set in production env | Engineering | Vercel env shows key present; Concierge replies stream end-to-end |
| `OPENAI_API_KEY` set in production env (embeddings + fallback) | Engineering | Vercel env shows key present; pgvector retrieval returns results |
| All four `/api/ai/*` endpoints return 200 to a real call | Engineering | Manual: open each tool, complete one round-trip |
| Rate limits operate (Upstash Redis reachable) | Engineering | Send 60 requests in 60 seconds to one endpoint; confirm 429 after burst |
| 503 fallback path operates when key is missing | Engineering | Local: unset key, confirm 503 with friendly JSON body |

### 2.6 Observability

| Gate | Owner | Verification |
|---|---|---|
| Sentry production source maps uploaded | Engineering | Trigger a synthetic error; confirm de-minified stack in Sentry |
| Sentry PII redaction `beforeSend` shipping in production bundle | Engineering | Trigger an error containing an email address; confirm it is redacted in Sentry payload |
| CSP enforces and `report-uri /api/csp-report` receives any violations | Engineering | Force a CSP violation in dev tools; confirm report appears in Axiom |
| Axiom production logs receiving structured events | Engineering | Recent events visible in Axiom dataset within 5 minutes |
| PostHog events firing with super-properties | Product | Visit `/`, `/contact`, an `/ai/*` tool; confirm `region`, `referrer_group`, `device_class` populate |
| Health check cron green | Engineering | `vercel.json` `crons[]` entry firing; `/api/health` 200 within 60 seconds |

### 2.7 SEO

| Gate | Owner | Verification |
|---|---|---|
| `/sitemap.xml` resolves and includes all 51 expected URLs | SEO | `curl https://propharmex.com/sitemap.xml | grep -c '<loc>'` returns 51 |
| `/robots.txt` resolves and matches `apps/web/app/robots.ts` | SEO | `curl https://propharmex.com/robots.txt` matches expected user-agent rules |
| 301 redirect map deployed (per `docs/redirects-301-map.xlsx`) | Operations | `curl -I` each legacy URL; expect 301 to new IA |
| JSON-LD valid on every page | SEO | Run Schema.org Validator on the page inventory in `docs/handoff.md` §4 |
| Canonical URLs correct (no draft or staging URLs leaking) | SEO | Spot-check `<link rel="canonical">` on every page; expect production hostname |
| Open Graph tags render correctly on social-link debugger | SEO | Test apex + 3 deep routes with Facebook + LinkedIn debuggers |

### 2.8 Accessibility

| Gate | Owner | Verification |
|---|---|---|
| Manual VoiceOver pass on six sampled pages | Accessibility | Per `docs/accessibility-at-test-plan.md`; Pass on every Sev 1 and Sev 2 case |
| Manual NVDA pass on six sampled pages | Accessibility | Per `docs/accessibility-at-test-plan.md`; Pass on every Sev 1 and Sev 2 case |
| ACR statement public at `/accessibility` | Accessibility | Visit page; matches `docs/accessibility-conformance.md` |

### 2.9 Legal and compliance

| Gate | Owner | Verification |
|---|---|---|
| Privacy policy live at `/privacy` | Legal | Page renders, content reviewed by counsel |
| Terms of service live at `/terms` | Legal | Page renders, content reviewed by counsel |
| Accessibility statement live at `/accessibility` | Legal | Page renders, ACR linked |
| Cookie banner posture matches privacy policy | Legal | Banner shows on first visit, dismisses persistently |
| Copyright footer year accurate | Brand | Footer shows current year |

---

## 3. Staging sign-off

A 30-minute walk-through with engineering, operations, and brand on the staging environment with all gates above marked Pass or Waived-with-rationale. Output: a signed entry in section 8 of this checklist with date, names, and any open items carried into the launch window.

The walk-through agenda is the QA matrix sign-off sheet at `docs/qa-matrix.xlsx`, sheet "Sign-off."

---

## 4. Launch-day sequence

Time T-0 is the moment DNS records are switched to point at production Vercel. The sequence below is annotated with offsets from T-0.

| Time | Step | Owner | Confirm-by |
|---|---|---|---|
| T minus 60 minutes | Final staging smoke pass; merge any final fixes; tag `v1.0.0-rc` if not already | Engineering | CI green on `main` |
| T minus 30 minutes | Operations and engineering on shared call; confirm rollback plan understood | All | Verbal sign-off |
| T minus 5 minutes | Disable any feature flags scheduled to be off at launch | Engineering | Vercel env diff |
| T minus 0 | DNS switch: apex A/ALIAS and `www` CNAME to Vercel | Operations | `dig` confirms within 60 seconds |
| T plus 5 minutes | Smoke test the production URL: home, contact, one /ai/ tool, sitemap, robots | Engineering | All return 200; visible content matches staging |
| T plus 15 minutes | Check Sentry for new errors since cutover | Engineering | Zero new Sev 1; zero new error groups |
| T plus 30 minutes | Submit sitemap to Google Search Console | SEO | GSC shows submission acknowledged |
| T plus 30 minutes | Submit sitemap to Bing Webmaster Tools | SEO | BWT shows submission acknowledged |
| T plus 60 minutes | First PostHog dashboard review: traffic landing on prod, events firing | Product | Lead funnel dashboard shows live events |
| T plus 4 hours | Second monitoring sweep; confirm no degradation pattern | Engineering | LCP and error rates within last-24h-on-staging baseline |
| T plus 24 hours | Launch declared complete; tag `v1.0.0` git tag pushed and announced | Engineering | Tag visible on `git fetch --tags` |

---

## 5. Rollback plan

If a Sev 1 issue surfaces within 4 hours of cutover and cannot be resolved within 30 minutes via a forward fix:

1. Operations reverts the DNS switch (apex and `www`) back to the previous host. TTL is the constraint here; verify the pre-launch TTL was lowered to 300 seconds at least 24 hours before cutover.
2. Engineering rolls back the Vercel deployment to the last known-good build via the Vercel dashboard "Promote previous deployment" action.
3. The team posts a short root-cause note in the engineering channel and opens a forward-fix branch off `main`.
4. The next launch attempt is scheduled with at least one full business day of separation from the rollback.

Detailed rollback procedure including command-line steps lives in [`docs/runbook.md`](runbook.md) section 4.

---

## 6. Post-launch tasks

### Within 24 hours after launch

| Task | Owner |
|---|---|
| Verify Google Search Console picked up the sitemap and started crawling | SEO |
| Verify Bing Webmaster Tools picked up the sitemap and started crawling | SEO |
| Check Resend deliverability — bounces, complaints | Operations |
| Check PostHog event volumes against expected baseline | Product |
| Review Sentry errors logged in first 24 hours, triage anything not yet ticketed | Engineering |

### Within one week after launch

| Task | Owner |
|---|---|
| Build the four PostHog dashboards in the PostHog UI per `docs/analytics-taxonomy.md` §6 | Product |
| Promote Lighthouse `categories:accessibility` warn to error 1.0 once manual AT pass is countersigned | Engineering |
| Open follow-up PR for `apps/web/e2e/concierge.spec.ts` `role="dialog"` to `role="region"` drift | Engineering |
| Ratchet `BUNDLE_BUDGET_KB` toward the 350 kB long-term target as Dosage Matcher and DEL Readiness lazy-splits land | Engineering |
| Schedule the first weekly performance review per `docs/runbook.md` §12 | Engineering |

---

## 7. Out of scope for v1.0.0

These items are tracked but intentionally not blocking launch.

- Per-route Open Graph images for `case-studies/[slug]`, `industries/[slug]`, and `/ai/*` tools.
- Touch-target uplift to 44 by 44 on the Concierge send button, header Region switcher, and `Button size="sm"`.
- Field-level `aria-invalid` on InquiryForm and WhitepaperGateForm (currently form-level errors only).
- Forced-colors mode media queries.
- Refactor of inline `buildDetailJsonLd` functions onto the `@propharmex/lib` schema helpers.
- Defer Cloudflare Turnstile until first form focus on `/contact` to close the four demoted Lighthouse warns from the demote chain.
- Lazy-split `/ai/dosage-matcher` and `/ai/del-readiness` (now the new worst-bundle routes at 431 kB and 429 kB respectively).
- `parsers.ts::zSopCapability` Zod-schema drift cleanup left from Prompt 21.

---

## 8. Sign-off

| Role | Name | Date | Notes |
|---|---|---|---|
| Engineering owner | | | |
| Operations owner | | | |
| Brand owner | | | |
| Accessibility owner | | | |
| Legal counsel review | | | |

---

## 9. Revision history

| Date | Change | Pull request |
|---|---|---|
| 2026-04-30 | Initial launch checklist for v1.0.0 | Pending |

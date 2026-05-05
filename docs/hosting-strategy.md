# Hosting strategy — hybrid Vercel + Cloudflare proxy

Operational record for the Propharmex marketing site's hosting architecture.
Read this before changing DNS, debugging a global TTFB regression, or
proposing a hosting migration.

> Decision in one line: **Vercel is the origin; Cloudflare proxies in
> front for global edge caching, WAF, and DDoS mitigation.**

---

## 1. Architecture

```
Visitor browser
      │
      ▼
Cloudflare PoP (300+ globally)        ← TLS termination, cache hit/miss decision,
      │                                  WAF + Bot Fight Mode + DDoS, Brotli/AVIF
      ▼ (cache miss only)
Cloudflare → Vercel origin (iad1)     ← Cache-Control headers honored
      │
      ▼
Next.js 15 App Router                 ← ISR (revalidate=300), Edge runtime for
                                        AI streaming, Node runtime for PDF gen
```

**TLS posture:** SSL/TLS Mode = Full (Strict). Vercel issues a valid TLS
cert at the origin; Cloudflare validates it on every backhaul connection.
Visitors see Cloudflare's edge cert.

**HTTP/3:** enabled at the Cloudflare edge. Vercel→Cloudflare backhaul
runs on HTTP/2.

**DNS provider:** Cloudflare DNS (recommended) OR upstream registrar with
CNAME flattening on apex pointing at the Cloudflare proxy hostname. Either
works.

---

## 2. Why hybrid (not all-Vercel, not all-Cloudflare)

### What Vercel keeps doing

| Feature | Why it stays on Vercel |
|---|---|
| Next.js 15 App Router | Native runtime; no community adapter needed |
| ISR (`revalidate = 300`) | First-class support; on-demand revalidation API works |
| Edge runtime (`/api/ai/*`, `/api/health`, `/api/csp-report`, OG images) | Vercel Edge is just V8 isolates — same model as Cloudflare Workers but already integrated |
| Node runtime PDF generation (`/api/ai/*/pdf`) | `pdf-lib` works without Node-compat-layer caveats |
| Sanity Visual Editing draft mode | Cookies (`__prerender_bypass`, `__next_preview_data`) round-trip cleanly |
| Sentry tunnel at `/monitoring` | `withSentryConfig` auto-creates the route handler; rewrites work |
| Vercel MCP integration (deploy logs, runtime logs, doc search) | Configured in our workflow per `CLAUDE.md` §6 |
| `/api/health` minute-cadence cron | Vercel Pro `crons[]` in `vercel.json` |
| Source-map upload + release tagging | `withSentryConfig` does this on every Vercel build |

### What Cloudflare adds in front

| Capability | Benefit |
|---|---|
| 300+ global PoPs | Visitors hit a closer edge than Vercel's `iad1` alone (especially APAC/EU) |
| Brotli compression | ~15–20% smaller than gzip; free |
| AVIF re-encoding (Polish lossless) | Smaller-than-WebP images on AVIF-capable browsers |
| HTTP/3 + 0-RTT | Faster first-byte on capable browsers |
| Tiered Cache (Smart) | Regional edge → core PoP → origin; fewer origin pulls under load |
| Always Online | Serves stale CF copy if Vercel origin is unreachable |
| WAF Managed Ruleset (CF default + OWASP Core, Sensitivity = Medium) | Pre-flight blocking of obvious exploit attempts before they reach Vercel |
| Bot Fight Mode | Complements Turnstile already on `/contact` + whitepaper gate |
| DDoS mitigation | Free tier covers L3/L4 unmetered |

### What we explicitly chose NOT to do

- **Migrate to Cloudflare Pages or Workers.** No native Next.js 15 ISR
  (would need `@opennextjs/cloudflare`, a community adapter); `pdf-lib`
  Node-runtime routes need rework; Vercel MCP / cron / Sentry tunnel
  investment lost. Multi-PR migration with significant ops cost.
- **Replace Vercel image optimization with Cloudflare Image Resizing.**
  $5/mo, marginal benefit — Vercel already does AVIF/WebP via `next/image`.
- **Move asset storage to Cloudflare R2.** Not a bottleneck on a marketing
  site. Sanity already serves images via its own CDN.
- **Replace Turnstile with Cloudflare Bot Management Pro.** Turnstile is
  free and already wired into the contact form (PRs #25 PR-A + #49). Bot
  Fight Mode adds free upstream filtering on top.

---

## 3. Cloudflare configuration inventory

Apply via Cloudflare dashboard. All settings below are the source of truth
— if the dashboard diverges, fix the dashboard, not this document.

### 3.1 Zone settings

```
SSL/TLS Mode:        Full (Strict)
HTTP/3:              On
Brotli:              On
Polish:              Lossless (AVIF)
Auto Minify:         OFF (HTML + CSS + JS)        ← critical: do NOT enable
Rocket Loader:       OFF                          ← critical: do NOT enable
Email Obfuscation:   OFF
Mirage:              OFF
Tiered Cache:        On (Smart)
Always Online:       On
Bot Fight Mode:      On
WAF Managed Ruleset: Cloudflare default + OWASP Core, Sensitivity = Medium
Security Level:      Medium
Browser Cache TTL:   Respect existing headers     ← do NOT override Vercel's
```

The four critical "OFF"s above (Auto Minify, Rocket Loader, Email
Obfuscation, Mirage) all break Next.js hydration, Sentry source maps, or
contact-form rendering if turned on. Treat them as safety guards, not
optimisations.

### 3.2 Cache Rules (Caching → Cache Rules)

| # | Match | Action |
|---|---|---|
| 1 | URI Path starts with `/_next/static/` | Eligible for cache, Edge TTL = 1 year, Browser TTL = Respect existing |
| 2 | URI Path starts with `/_next/image` | Eligible for cache, Edge TTL = 30 days, Browser TTL = Respect existing |
| 3 | URI Path matches `^/(api\|monitoring)/` | Bypass cache |
| 4 | (default) | Honor origin `Cache-Control` headers — Vercel sets `s-maxage=300` on ISR pages |

Rule 3 covers both the `/api/*` surface (contact form, AI tools, draft
mode toggles, CSP reports, whitepaper download, revalidate webhook) and
the Sentry tunnel at `/monitoring`. Without rule 3, Sentry would fire
errors into a CF-cached endpoint.

### 3.3 Configuration Rules (only if needed)

If post-cutover verification (runbook §15) shows AI streaming buffering at
the proxy, add:

| Match | Action |
|---|---|
| URI Path starts with `/api/ai/` | Disable: Always Use HTTPS bypass; Origin Cache Control: On |

CF respects SSE / streaming responses on the free tier as long as the
origin sets `Cache-Control: no-cache` (Vercel does this for streaming
routes). The override is only a fallback.

---

## 4. Rollback procedure

> If the proxy is the suspected cause of an outage, rollback is **<60s**.

1. **Cloudflare dashboard → DNS** → find the apex `A` record (or `CNAME`
   to Vercel) and the `www` record.
2. **Click the orange cloud icon** to make it gray. The record becomes
   "DNS only" — Cloudflare stops proxying that hostname; visitors hit
   Vercel directly.
3. **Verify**: `curl -I https://propharmex.com` should now return Vercel
   headers (`x-vercel-id`, `x-vercel-cache`) and **no** `cf-ray` /
   `cf-cache-status`.
4. **Monitor**: PostHog Live Events `$pageview` rate should remain stable
   within 1 minute.

The rollback only affects routing — the Cloudflare proxy stays configured
in the dashboard, just bypassed. Re-enabling is one click (gray → orange).

To roll back **Cloudflare entirely** (move DNS off CF), switch nameservers
back at the registrar. Allow 5–30 min for global resolver propagation.
Phase 1 step 1 of the cutover (lower DNS TTL to 300s) is what makes this
fast — keep TTLs low for at least 24h post-cutover.

---

## 5. When to revisit this decision

| Signal | Action |
|---|---|
| Vercel monthly bill exceeds $200 (10× current marketing-site footprint) | Evaluate moving static assets to Cloudflare R2 |
| Traffic shifts predominantly to APAC / Africa / South America | Consider adding Vercel `edge-regions` or going Cloudflare Workers for AI routes |
| Regulatory data residency requirements (e.g., a Health Canada audit asks where personal data is processed) | Re-architect with explicit region pinning; could mean Cloudflare Workers in CA-only mode + separate Vercel region |
| Vercel platform outage of >2h without "Always Online" coverage | Evaluate true multi-cloud (DNS-level traffic split) — much higher complexity |
| Cloudflare WAF requests/sec exceed free tier | Upgrade to Pro ($20/mo); still cheaper than alternatives |

None of these apply today. This document captures the decision point so
the next operator doesn't redo the analysis from scratch.

---

## 6. Related documentation

- [docs/runbook.md](runbook.md) §15 — Cloudflare-proxy operations (cache
  purge, dev-mode toggle, error code triage).
- [docs/runbook.md](runbook.md) §13 — Uptime monitoring (Vercel cron
  `/api/health`, external pingers).
- `vercel.json` — origin-side security headers + CSP. Cloudflare honors
  these; do **not** duplicate them in Cloudflare.
- `next.config.ts` — Sentry tunnel route (`/monitoring`), redirects, image
  remote patterns.
- `CLAUDE.md` §2 — locked tech stack including Vercel as hosting.

---

## 7. Changelog

| Date | Change | PR |
|---|---|---|
| 2026-05-04 | Initial — hybrid Vercel + Cloudflare proxy strategy | PR-K′ |

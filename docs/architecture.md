# Propharmex Website Architecture

## System diagram (Phase 0 placeholder — expand in Prompt 4)

```
                          ┌──────────────────────────────────────┐
                          │ Sanity Studio  (apps/studio)         │
                          │ Content authors edit in real time    │
                          └──────────────┬───────────────────────┘
                                         │ publish webhook
                                         ▼
  ┌───────────────┐    GROQ     ┌─────────────────────┐    ingest   ┌──────────────────┐
  │ Next.js 15    │◀───────────▶│ Sanity Content Lake │────────────▶│ Supabase         │
  │ (apps/web)    │             └─────────────────────┘             │   pgvector       │
  │  - RSC + ISR  │                                                 │   rag_chunks     │
  │  - /api/ai/*  │◀──── retrieve(k=8) ─────────────────────────────│                  │
  │  - Edge       │                                                 │   + lead, chat,  │
  │               │◀──── lead/chat/session writes ──────────────────│   session,       │
  │               │                                                 │   scope, del_rpt │
  └───┬───────┬───┘                                                 └──────────────────┘
      │       │
      │       │ streaming AI (Vercel AI SDK)
      │       ▼
      │  ┌──────────────────────┐
      │  │ Anthropic Claude     │◀── system prompt from Sanity aiPromptConfig
      │  │  + OpenAI embed      │
      │  │  + GPT-4o fallback   │
      │  └──────────────────────┘
      │
      │ email (Resend) · booking (Cal.com) · analytics (Plausible + PostHog)
      │ auth rate (Upstash) · bot (Turnstile) · errors (Sentry) · logs (Axiom)
      ▼
   Vercel Edge · ISR · per-route caches · middleware (region, rate-limit, CSP)
```

## Monorepo package dependencies

- `apps/web` depends on `packages/ui`, `packages/config`, `packages/lib`
- `apps/studio` depends on `packages/config` (shared types) and Sanity SDK
- `packages/ui` depends on `packages/config`
- `packages/lib` has GROQ clients, RAG helpers, schema.org helpers, logger, zod schemas — no UI deps
- No `apps/` depends on another `apps/`
- No circular deps across packages — enforced via `pnpm dep-graph` in CI

## Data flow — four AI features

| Feature | Runtime | Retrieval | Output |
|---|---|---|---|
| CDMO Concierge | Edge | RAG top-k=8 from Sanity-ingested content | Streamed text chat, citation links |
| Project Scoping Assistant | Edge | No RAG; uses tool-calling to fill a Zod schema | Structured scope + PDF export via `pdf` skill |
| DEL Readiness Assessment | Edge | Rubric from Sanity `aiPromptConfig.delReadiness` | Score + traffic-light gaps + PDF report |
| Dosage Form Matcher | Edge | Sanity `sopCapability` + capability matrix | Ranked dosage forms + rationale + case-study refs |

All four share: rate-limit middleware, PII redaction, disclaimer injection, PostHog telemetry, fallback to GPT-4o on Anthropic errors.

## Region personalization

Vercel geo header → middleware sets `px-region` cookie → RSC reads cookie → adjusts:
- Hero headline variant
- Cert-emphasis order (DEL for CA, USFDA for US, WHO-GMP for global)
- Primary CTA
- Office displayed first

Override via header switcher. Respects privacy (no gating, subtle banner on first visit).

## Caching strategy

| Surface | Strategy |
|---|---|
| Home, Why, About, Quality, Facilities | ISR 300s |
| Service/industry hubs + leaves | ISR 300s |
| Case study detail | ISR 600s |
| Insights index | ISR 60s |
| Insight article | ISR 300s |
| Brand/legal pages | Static |
| `/api/ai/*` | No cache; Edge |
| Sanity webhook → on-demand revalidate affected slugs |

## Deployment topology

- Vercel production: `propharmex.com`
- Vercel preview: every PR
- Sanity Studio: `studio.propharmex.com` (or hosted via Sanity)
- Supabase region: `us-east-1` (lowest latency to Vercel iad1)
- Backups: Supabase daily + point-in-time via their tier; Sanity has its own versioning

## Observability

- **Errors** → Sentry (web + API routes) with PII redaction on message + stack
- **Logs** → structured (pino + Axiom transport) with correlation-id per request
- **Metrics** — Plausible (traffic), PostHog (events + funnels + flags)
- **Uptime** — Vercel analytics + external ping every 60s to `/api/health`
- **Perf** — weekly Lighthouse CI via scheduled task

Expand this doc in Prompt 4 (Sanity + RAG flow), Prompt 18 (Concierge detail), and Prompt 25 (security + observability).

## Application shell (added in Prompt 3)

- Root layout (`apps/web/app/layout.tsx`) loads Manrope + Inter Tight + JetBrains Mono via `next/font/google`, renders the skip-to-content link, Header, Footer, site-wide JSON-LD graph (Organization + WebSite + 2 LocalBusiness nodes from `packages/lib/schema-org`), and the Analytics client island.
- Header (`components/site/Header.tsx`) is sticky, transparent over the home hero until scrolled, and flips solid on every other route. Mega-menus are Framer-motion fade+rise; the mobile variant is a Sheet drawer with a Radix Accordion inside. 44px minimum hit targets.
- Region switcher writes a `propharmex-region` cookie; Prompt 22 replaces the reader with middleware-based geo personalization.
- Newsletter form posts to `/api/newsletter`, which validates with Zod, verifies Cloudflare Turnstile when configured, and hands off to Resend Audiences with `unsubscribed: true` to force their double-opt-in flow. Runtime is Node (not Edge).
- `app/error.tsx`, `app/global-error.tsx`, `app/not-found.tsx`, and `app/loading.tsx` cover the expected failure + loading states at segment level.
- Copy lives in `apps/web/content/site-nav.ts` — the stand-in for the Sanity `siteSettings` + `navigation` singleton that arrives in Prompt 4.

## Sanity content layer (added in Prompt 4)

- Studio lives in `apps/studio`. Project ID `veo2rnkc`, dataset `production`. Run locally with `pnpm --filter studio dev` (port 3333). Deploy hosting separately via `sanity deploy` — the web app does not embed the Studio.
- 14 document types: `siteSettings` + `aiPromptConfig` (singletons), `page`, `service`, `industry`, `caseStudy`, `insight`, `whitepaper`, `person`, `facility`, `certification`, `faq`, `testimonial`, `sopCapability`. All content docs share a base-field factory (`title`, `slug`, `seoTitle`, `seoDescription`, `ogImage`, `publishedAt`, `isVisible`, `region[]`, `ragEligible`).
- 12 section-builder objects (`hero`, `pillars`, `statsStrip`, `processStepper`, `logoWall`, `caseStudyCarousel`, `capabilityMatrix`, `certBand`, `leaderCard`, `faqBlock`, `ctaSection`, `bentoGrid`) are registered as a discriminated-union array on `page.body`, `service.body`, `industry.body`, and `insight.body`.
- Desk structure (`apps/studio/structure/index.ts`) pins the two singletons at the top and buckets remaining types under **Content**, **People & places**, and **Components**. Singleton creation/deletion is filtered out via `document.actions` and `document.newDocumentOptions`.
- Presentation plugin is wired with `defineLocations` for every public-facing document type (page, service, industry, insight, caseStudy). Preview mode is enabled via the web app's `/api/draft` route; Studio passes a signed `secret`.
- GROQ + Zod lib lives at `packages/lib/sanity/`:
  - `client.ts` — published + preview clients, `getClient(preview)` selector, stub clients that fail-loud at call time when `NEXT_PUBLIC_SANITY_PROJECT_ID` is unset so imports stay side-effect-free.
  - `queries.ts` — hand-tuned GROQ strings for every document, drafts excluded on public queries (`!(_id in path("drafts.**"))`), `ragExtractQuery` prepared for Prompt 18 RAG ingestion.
  - `parsers.ts` — Zod schemas mirroring every document + section; exported as a discriminated `zSection` union plus per-doc schemas with `.passthrough()` for forward-compat.
  - `fetch.ts` — `sanityFetch<T>({ query, params, parser, tags, preview, revalidate })` wrapper. Public fetches default to `revalidate: 300`; preview fetches default to `0`. Cache tags follow `sanity:<docType>` and `sanity:<docType>:<slug>`.
- Web app routes for preview + revalidation:
  - `GET /api/draft` — verifies `secret` against `SANITY_PREVIEW_SECRET`, validates the redirect pathname, enables `draftMode()`.
  - `GET /api/exit-draft` — disables draft mode, redirects home or to a validated `path` query.
  - `POST /api/revalidate` — Node runtime. HMAC-SHA256 verification against `SANITY_WEBHOOK_SECRET` using `crypto.timingSafeEqual`, Zod-validates `{_id, _type, slug?.current?}`, calls `revalidateTag("sanity:<_type>")` and the slug-scoped tag. Never logs body or signature.
- `DraftModeIndicator` (client island) renders a fixed banner when draft mode is on; `VisualEditing` lazy-loads `next-sanity`'s overlay only for editors in draft mode.
- `apps/web/app/studio-info/page.tsx` is a static info page that points editors to the separate Studio URL (localhost:3333 in dev, `studio.propharmex.com` in prod).

## Homepage (added in Prompt 5)

- Page composition lives at `apps/web/app/page.tsx` — 14 sections assembled in order from one typed dictionary (`apps/web/content/home.ts`). ISR 300s. `metadata` exports `title`, `description`, canonical, OpenGraph, and Twitter summary; the root layout's site-wide `robots: index:false` is intentionally left in place until Prompt 27 flips the site to indexed.
- Content pattern mirrors Prompt 3's `site-nav.ts`: one discriminated-union `HomeSection` type, one `HOME: HomeContent` export. When the Sanity `page{slug:"home"}` document lands (post-Prompt 4, pre-Prompt 23), the homepage reads the same shape from `packages/lib/sanity` and this file is deleted in one commit.
- Sections live under `apps/web/components/home/*`, one file per section: `Hero`, `TrustStrip`, `WhyPillars`, `WhatWeDo`, `CanadaIndiaAdvantage`, `MatcherTeaser`, `Proof`, `Process`, `Industries`, `Leadership`, `Insights`, `DelBanner`, `ContactMini`, `RegulatoryChips`. Each accepts its slice of `HOME` as props — no hardcoded user-facing strings in the component bodies.
- Motion: `fadeRise` + `staggerContainer` from `@propharmex/ui` with `whileInView` + `viewport={{once:true,margin:"0px 0px -10% 0px"}}`. `useReducedMotion` skips the animated initial state so the reduced-motion branch matches the server render exactly. Hero uses an inline SVG "molecule" (5 nodes, 6 links) — no Lottie, no WebGL. Process uses `useScroll`/`useTransform` for desktop horizontal parallax, vertical stack on mobile. The two-hub Mississauga ↔ Hyderabad section (component still named `CanadaIndiaAdvantage` for stable file path) uses a single `path` with `pathLength` animation — no world map asset.
- Page-level JSON-LD: `WebPage` (referencing the root `Organization` `@id`) + `BreadcrumbList` emitted as a single graph through `jsonLdGraph`. The root layout continues to emit Organization + WebSite + LocalBusiness × 2.
- Contact mini-form (section 13) posts to `POST /api/contact` (Node runtime). Endpoint validates with Zod, optionally verifies Turnstile, and optionally sends a Resend email. It never logs PII — only the email domain and a few structural counts. Header comment notes Prompt 17 replaces the endpoint with the full lead pipeline (Upstash rate-limit, CRM handoff, Supabase lead record, Sentry breadcrumbs).
- Placeholder routes added so homepage links resolve cleanly during the rebuild window: `/ai/del-readiness`, `/ai/dosage-matcher`, `/contact`, `/services`, `/services/[...slug]`, `/quality`, `/case-studies`, `/case-studies/[slug]`, `/industries`, `/industries/[slug]`, `/insights`, `/insights/[slug]`, `/whitepapers/[slug]`, `/about`. All carry `robots: { index: false, follow: false }` and reuse the `PlaceholderPage` component in `components/site/`. Each page is replaced wholesale by its authoring prompt (10–21).

## Why Propharmex page (added in Prompt 6)

- Route: `/why-propharmex` (RSC, ISR 300s). Content lives in `apps/web/content/why.ts` as one typed `WHY: WhyContent` constant with six discriminated-union chapters (Problem → Gap → Our Model → Proof → Two-hub Engine → Call) plus a final `cta` block; the shape will map 1:1 onto the Sanity `page{slug:"why-propharmex"}` document when it lands alongside the homepage migration. Eyebrow, headline, and lede for each chapter render server-side (LCP is the first chapter headline); body paragraphs, stats, and the support callout fade+rise through the `ChapterReveal` client island using `fadeRise` + `staggerContainer` from `@propharmex/ui`, and honour `useReducedMotion` throughout. The sticky right-side `ChapterRail` is a single fixed-position client island that attaches one `IntersectionObserver` across all six chapter targets (`rootMargin: "-30% 0 -45% 0"`) and coalesces state updates through `requestAnimationFrame` — no scroll listeners, no layout thrash; reduced-motion users get `scrollIntoView({ behavior: "auto" })`. Page-level JSON-LD emits a `WebPage` + `BreadcrumbList` graph referencing the root layout's Organization + WebSite `@id`s. CTA targets: `/contact?source=why` (schedule), `/whitepapers/canada-india-playbook` (playbook — TODO: replace when the real whitepaper ships in Prompt 15), `/contact?source=why-primary` (start a project). The Proof chapter carries `// TODO: replace with Sanity caseStudy/testimonial refs (Prompt 14)` markers on every metric and on the embedded quote — when case studies seed in Prompt 14 the stats, metrics, and quote source swap out without touching the component tree.



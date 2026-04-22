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

# CLAUDE.md — Propharmex Website

Project-level instructions for every Claude Code session working in this repo. **Read top to bottom before touching any file.** These rules override defaults.

---

## 1. Identity & mission

**Propharmex** is a pharmaceutical services company positioned as the **Canada–India bridge** for end-to-end drug development, analytical services, regulatory affairs (anchored on the Health Canada Drug Establishment Licence), and 3PL distribution. Mississauga, Ontario (Canada) and Hyderabad, Telangana (India) are our operating hubs.

This repository builds the public marketing website + four AI-powered tools. The site must outperform Vertex, Mabwell, Lonza, Patheon, Catalent, and Piramal in information density, design sophistication, and demonstrable AI-assisted UX — while staying fully compliant with YMYL and healthcare-marketing norms.

**Voice is anti-hype.** Expert. Credible. Humble. Regulatory-precise. If a sentence could appear on a lazy SaaS landing page, it does not belong here.

---

## 2. Tech stack (locked)

| Layer | Choice |
|---|---|
| Framework | Next.js 15 App Router + React 19 + TypeScript strict + Node 20 |
| Styling | Tailwind CSS v4 with `@theme` tokens, `@tailwindcss/typography` |
| Components | shadcn/ui primitives + Framer Motion + selective Magic UI / Aceternity / Next.js Animated Components accents |
| CMS | Sanity Studio v3 (apps/studio) with live visual editing + draft mode |
| Database | **Supabase Postgres** (transactional + `pgvector` in the same DB) — Neon is NOT used |
| AI | Vercel AI SDK + Anthropic Claude (primary) + OpenAI `text-embedding-3-large` (embeddings) + OpenAI GPT-4o (fallback) |
| Email | Resend (transactional + double-opt-in newsletter) |
| Booking | Cal.com embed |
| Analytics | Plausible + PostHog |
| Bot / rate | Cloudflare Turnstile + Upstash Redis |
| Observability | Sentry (PII-redacted) + Axiom |
| Testing | Vitest + Playwright + Lighthouse CI |
| Hosting | Vercel (ISR for content, Edge runtime for `/api/ai/*`) |
| Monorepo | pnpm workspaces |

**No deprecated APIs.** No `pages/` router, no `getServerSideProps`, no `next/legacy-image`. React 19 Server Components by default; add `'use client'` only when required (Framer Motion, stateful hooks, event handlers).

---

## 3. Repo layout (target)

```
apps/
  web/               Next.js 15 app (public site + AI tools)
  studio/            Sanity Studio
packages/
  ui/                shadcn components + Framer primitives + tailwind config
  config/            design tokens, ESLint, Prettier, TS config
  lib/               GROQ queries, Zod schemas, RAG helpers, schema.org helpers, utils
docs/                brand-voice, content-style, regulatory-lexicon, seo-playbook, architecture, runbook, phase-roadmap
.claude/
  skills/            12 project-local skills (see §5)
  agents/            optional project agent overrides
  settings.json      permissions allow-list
Propharmex_Website_Master_Build_Plan.pdf        master spec — source of truth
Claude_Code_Prompts_Propharmex_Rebuild.md       27 sequential prompts
```

Phase 0 (foundation) creates `.claude/`, `docs/`, CLAUDE.md, `.env.example`, `.gitignore`, `.nvmrc`. Phase 2 (Prompt 1) creates `apps/`, `packages/`, `package.json`, `pnpm-workspace.yaml`. **Do not create Next.js or Sanity code before Prompt 1.**

---

## 4. Workflow rules

1. **Prompts 0–27 run strictly in order.** Each is in `Claude_Code_Prompts_Propharmex_Rebuild.md`. Later prompts depend on earlier artifacts. Never skip ahead.
2. **Skills-first.** If a task maps to an existing skill (global, plugin, or project-local), invoke it before writing code. See §5.
3. **Every user-facing string** goes through `design:ux-copy` (authoring) → `brand-voice-guardian` (gate). No hardcoded copy in component files — all copy lives in Sanity or a locale dictionary.
4. **Every PDF/DOCX/XLSX/PPTX** is generated with the matching skill. Never hand-render HTML to PDF.
5. **Every AI endpoint** lives under `/api/ai/*`, runs on Edge runtime, is rate-limited via Upstash, has its system prompt sourced from the `aiPromptConfig` Sanity singleton, and carries the AI-output disclaimer.
6. **Every page** ships with JSON-LD from `pharma-schema-markup`. Page is not done without it.
7. **Every regulatory claim** is anchored to a primary-source URL (Health Canada, USFDA, ICH, WHO, TGA, EMA, PMDA) with an "as of [date]" stamp — see `pharma-regulatory-writer` rules.
8. **TypeScript strict.** No `any`, no `@ts-ignore` without an `// @ts-expect-error <reason>` line. Zod at every external boundary.
9. **No `console.log`** committed. Use the structured logger in `packages/lib/log.ts` (Axiom transport).
10. **Conventional Commits** — `feat(scope): ...`, `fix(scope): ...`, `docs(scope): ...`, `chore(scope): ...`.
11. **Secrets policy** — never commit `.env`. `.env.example` is the spec. All prod secrets in Vercel env UI.
12. **Never delegate understanding.** If a regulatory, medical, or legal question is ambiguous, stop and ask the user.

---

## 5. Skills directory

### Project-local skills (in `.claude/skills/`)

| Skill | Purpose | First used in |
|---|---|---|
| `pharma-ghostwriter` | Long-form article / body copy in Propharmex voice | Prompt 5, 6, 7, 15 |
| `pharma-regulatory-writer` | Strict-mode regulatory content with primary-source-only citations | Prompt 8, 12, 20 |
| `pharma-case-study-writer` | Problem-Approach-Solution-Result with anonymization rules | Prompt 5, 14 |
| `whitepaper-generator` | Orchestrates writer + `pdf` for gated 8–12 page PDFs | Prompt 6, 15 |
| `pharma-seo-optimizer` | Keyword cluster, on-page audit, GEO/AI-citation scoring | Prompt 23 |
| `pharma-schema-markup` | JSON-LD for every page type (Org, LocalBiz, Service, Article, FAQ, Breadcrumb, Person) | Prompt 2 onwards, enforced Prompt 23 |
| `rag-pipeline-builder` | Sanity → chunk → embed → pgvector → retrieve() | Prompt 4 (ingest), Prompt 18 (Concierge) |
| `sanity-schema-builder` | Generates Sanity v3 schemas + GROQ + Zod + TS types | Prompt 4 |
| `animation-choreographer` | Framer Motion storyboards + snippets on motion tokens | Prompt 2 onwards |
| `lighthouse-budget-guard` | CI gate enforcing CWV + JS budgets | CI + Prompt 25 |
| `brand-voice-guardian` | Voice-conformance gate after every writer skill | Every copy change |
| `component-docs-writer` | `docs/design-system.mdx` per component with a11y + motion notes | Prompt 2 |

### Global / plugin skills we rely on

- **Deliverables** — `pdf`, `docx`, `xlsx`, `pptx` (generate files, never inline)
- **Design plugin** — `design:design-system`, `design:design-critique`, `design:design-handoff`, `design:ux-copy`, `design:accessibility-review`, `design:research-synthesis`, `design:user-research`
- **Meta** — `skill-creator` (to evolve the skills above), `schedule` / `scheduled-tasks` MCP (weekly SEO + perf audits), `consolidate-memory`

### Sub-agents (invoke via `Agent` tool)

High-value agents for this project: Frontend Developer, Backend Architect, UI Designer, UX Architect, AI Engineer, Technical Writer, Accessibility Auditor, Performance Benchmarker, Security Engineer, Compliance Auditor, Healthcare Marketing Compliance Specialist, SEO Specialist, Content Creator, Brand Guardian, Code Reviewer, Evidence Collector, Reality Checker, Explore, Plan.

---

## 6. Tool etiquette

- **Supabase MCP** — use for migrations (`apply_migration`), schema queries (`list_tables`, `execute_sql` read-only), typed client generation (`generate_typescript_types`). Prefer MCP over raw `psql` except for one-off DBA tasks.
- **Vercel MCP** — use for deploys (`deploy_to_vercel`), log pulls (`get_runtime_logs`, `get_deployment_build_logs`), and doc search. Prefer MCP over the `vercel` CLI for Claude-initiated actions.
- **Sanity MCP** (if installed) — programmatic schema + content seeding. Fallback: `sanity-cli` + `SANITY_API_WRITE_TOKEN`.
- **scheduled-tasks MCP** — any recurring job: weekly perf audit, monthly content-calendar KPI pull, nightly sitemap ping.
- **Claude-in-Chrome / computer-use** — live UX review and accessibility spot-checks on a running preview.
- **pdf-viewer MCP** — for reading `Propharmex_Website_Master_Build_Plan.pdf` at Phase 1 (Prompt 0).
- **n8n-mcp** — only when a workflow is genuinely event-driven and cross-system (e.g., lead enrichment via Apollo + CRM sync). Not for in-app logic.

Ask the user before taking an action with shared blast radius: `git push`, `vercel deploy --prod`, creating PRs, publishing Sanity docs, sending emails, calling paid APIs beyond a reasonable dev budget.

---

## 7. Definition of Done (mirrors Appendix B of the prompts file)

A prompt is complete only when:

- [ ] Code is TS-strict; `pnpm lint` and `pnpm typecheck` pass clean
- [ ] Unit tests for any logic; all pass
- [ ] Playwright happy-path test exists
- [ ] Lighthouse mobile ≥ 95 Perf / 100 SEO / 100 Best Practices / 100 A11y on every new route
- [ ] `design:accessibility-review` returns zero Sev 1/2 issues
- [ ] `brand-voice-guardian` returns PASS (or PASS_WITH_EDITS applied)
- [ ] JSON-LD present and valid for every page
- [ ] No hardcoded user-facing strings in components
- [ ] No `console.log`
- [ ] README / relevant docs updated
- [ ] Conventional Commits commit message
- [ ] Prompt-level acceptance criteria (from the prompt body) all met

---

## 8. Phase gates

| Phase | Prompts | Gate |
|---|---|---|
| 0. Foundation | this setup | CLAUDE.md + 12 skills + docs + `.env.example` exist |
| 1. Alignment | 0 | 12-bullet summary, Phase 1/2 page list, 4 AI features mapped |
| 2. Scaffold + Design System | 1–2 | `pnpm dev` runs; Storybook renders every component; tokens visible |
| 3. Shell + CMS | 3–4 | Header/Footer/404/500 live; Sanity Studio accepts every schema; GROQ lib typed |
| 4. Core Pages | 5–9 | Home + Why + About + Quality + Facilities pass all DoD items |
| 5. Service + Industry Trees | 10–13 | Every service leaf + industry page live and passes DoD |
| 6. Case Studies + Insights | 14–15 | Hub + 3 seed detail pages + 1 whitepaper downloadable |
| 7. Process + Contact + AI Tools | 16–21 | All 4 AI tools operational with rate-limit + disclaimer + telemetry |
| 8. SEO + Personalization + Analytics | 22–24 | Sitemap submitted; region switch works; PostHog dashboards live |
| 9. Hardening + Launch | 25–27 | v1.0.0 tagged; 301 map deployed; smoke suite green |

---

## 9. Secrets

`.env.example` is the spec. Required vars (full list + source tracked in Phase 0 plan file):

- `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`
- `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_API_READ_TOKEN`, `SANITY_API_WRITE_TOKEN`, `SANITY_WEBHOOK_SECRET`
- `RESEND_API_KEY`, `RESEND_FROM_EMAIL`
- `CAL_LINK`, `CAL_EVENT_TYPE_ID`
- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`, `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`
- `TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
- `SENTRY_DSN`, `SENTRY_AUTH_TOKEN`
- `NEXT_PUBLIC_SITE_URL`

Never commit `.env.local` or `.env.production`. Vercel env UI is authoritative.

---

## 10. Escape hatches — stop and ask the user when

- A medical efficacy or safety claim is being proposed
- A regulatory pathway timeline or outcome is being promised
- A client's name would appear without a confirmed `logoPermitted: true` flag
- A competitor is about to be compared in a way that isn't strictly factual
- An asset (logo, photo, cert document) is missing and cannot be stubbed
- A primary-source URL is unavailable for a claim
- An AI model output is about to be shown to users without a disclaimer
- A production deploy, force push, or destructive migration is proposed

When in doubt: ask. The cost of pausing is low. The cost of a wrong claim on a pharma site is very high.

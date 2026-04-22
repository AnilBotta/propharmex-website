# Propharmex Website

Canada–India bridge for pharmaceutical services — marketing site + AI tools.

Built on **Next.js 15 + React 19 + TypeScript strict + Tailwind v4 + Sanity v3 + Supabase (pgvector) + Vercel AI SDK**.

> **Read [CLAUDE.md](./CLAUDE.md) before touching any code.** It is the project rulebook for Claude Code sessions and human contributors alike.

---

## Quick start

```bash
# 1. Install (pnpm 9+, Node 20+)
pnpm install

# 2. Copy env spec and fill in the keys you have
cp .env.example .env.local

# 3. Boot web (:3000) and Sanity Studio (:3333) in parallel
pnpm dev
```

Health check: `curl http://localhost:3000/api/health` → `{"status":"ok",...}`

---

## Scripts

| Script | What it does |
|---|---|
| `pnpm dev` | Runs web (3000) + studio (3333) via Turbo, in parallel |
| `pnpm build` | Builds every workspace |
| `pnpm lint` | ESLint flat config across all workspaces |
| `pnpm typecheck` | `tsc --noEmit` across all workspaces |
| `pnpm test` | Vitest unit tests |
| `pnpm test:e2e` | Playwright e2e tests |
| `pnpm format` | Prettier write |
| `pnpm format:check` | Prettier check (used in CI) |

---

## Monorepo layout

```
apps/
  web/       Next.js 15 App Router — public site + /api/ai/* endpoints
  studio/    Sanity Studio v3 — content authoring, live visual editing
packages/
  ui/        shadcn/ui primitives + Framer Motion components (populated Prompt 2)
  lib/       Zod env loader, structured logger, GROQ + RAG helpers (grow Prompts 3-7)
  config/    Shared ESLint / Prettier / TSConfig
docs/        brand-voice, content-style-guide, regulatory-lexicon, seo-playbook, architecture, phase-roadmap, alignment-summary
.claude/
  skills/    12 project-local skills (see CLAUDE.md §5)
  settings.json  Permissions allow-list
content-seed/   Placeholder content for Prompt 4 ingestion
```

---

## Environment

Full env-var spec: [.env.example](./.env.example). All variables documented with source URL and the phase that first requires them. See [CLAUDE.md §9](./CLAUDE.md) for the secrets policy.

Prompts 0–2 require **no secrets**. Prompt 3 onward needs Sanity + Supabase. AI endpoints (Prompt 17+) need Anthropic + OpenAI + Upstash + Turnstile. Full key order: see [docs/phase-roadmap.md](./docs/phase-roadmap.md).

---

## Build phases

27 sequential prompts in [Claude_Code_Prompts_Propharmex_Rebuild.md](./Claude_Code_Prompts_Propharmex_Rebuild.md), grouped into 9 phases in [docs/phase-roadmap.md](./docs/phase-roadmap.md). **Prompts run in strict order**; do not skip.

Current phase: **Phase 2 (Scaffold + Design System)** — Prompt 1 landed, Prompt 2 next.

---

## Deploys

- **Preview**: every PR → Vercel preview URL. CORS + Sanity configured per-preview.
- **Production**: push to `main` after CI green → Vercel production. Protected by branch rules.
- Never `vercel deploy --prod` from local. Use GitHub PR → merge flow.

---

## Contributing

1. Every copy change runs through `design:ux-copy` then `brand-voice-guardian` (CLAUDE.md §4.3).
2. Every page ships with JSON-LD from `pharma-schema-markup` (§4.6).
3. Every regulatory claim is anchored to a primary-source URL (§4.7).
4. Definition of Done for every prompt: see [CLAUDE.md §7](./CLAUDE.md).
5. Commits follow [Conventional Commits](https://www.conventionalcommits.org/).

---

## License

Proprietary — all rights reserved, Propharmex Inc.

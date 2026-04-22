# Phase Roadmap

Living copy of the phase plan. Master copy lives in `C:\Users\anilb\.claude\plans\c-users-anilb-onedrive-desktop-projects-sorted-coral.md`.

## 9 phases, 27 prompts

| Phase | Prompts | Goal | Key skills |
|---|---|---|---|
| 0. Foundation | this setup | CLAUDE.md, 12 skills, docs, .env.example, MCP inventory | `skill-creator` |
| 1. Alignment | 0 | Read master plan; 12-bullet summary, page lists, AI-feature map | `pdf` |
| 2. Scaffold + Design System | 1–2 | Monorepo, Tailwind v4 theme, shadcn + Framer, Storybook, design tokens | `design:design-system`, `component-docs-writer`, `animation-choreographer` |
| 3. Shell + CMS | 3–4 | Global layout, Sanity Studio + all schemas, GROQ lib, draft mode | `sanity-schema-builder`, `rag-pipeline-builder`, `design:ux-copy`, `design:accessibility-review` |
| 4. Core Pages | 5–9 | Home, Why, About + Leadership, Quality, Facilities | `pharma-ghostwriter`, `pharma-case-study-writer`, `design:design-critique`, `docx` |
| 5. Service + Industry Trees | 10–13 | Pharma Dev + Analytical + Regulatory (DEL flagship) + Industries | `pharma-regulatory-writer`, `pharma-ghostwriter`, `design:design-handoff`, `pdf` |
| 6. Case Studies + Insights | 14–15 | Case hub + detail, Insights hub + articles + whitepapers | `pharma-case-study-writer`, `whitepaper-generator`, `pharma-ghostwriter` |
| 7. Process + Contact + AI Tools | 16–21 | Process page, Contact + classifier, all 4 AI tools | `rag-pipeline-builder`, `pharma-regulatory-writer`, `pdf` |
| 8. SEO + Personalization + Analytics | 22–24 | Region logic, SEO (sitemap + schema + OG + CWV), analytics, content calendar | `pharma-seo-optimizer`, `pharma-schema-markup`, `xlsx` |
| 9. Hardening + Launch | 25–27 | Perf/security/obs hardening, full a11y, handoff + QA + launch checklist | `design:accessibility-review`, `lighthouse-budget-guard`, `brand-voice-guardian`, `docx`, `xlsx`, `pdf` |

## Phase gate check (must all be green before proceeding)

1. Lint + typecheck clean
2. Unit tests for any logic added, all pass
3. Playwright happy-path test covers new routes
4. Lighthouse mobile ≥ 95 / 100 / 100 / 100
5. `design:accessibility-review` zero Sev 1/2
6. `brand-voice-guardian` PASS
7. JSON-LD present + valid for every new page
8. No hardcoded strings
9. No `console.log`
10. Docs updated (`docs/*`, README, ADRs)
11. Commit message Conventional Commits
12. Prompt's own acceptance criteria met

## Risk register (expand as the build progresses)

| Risk | Phase | Mitigation |
|---|---|---|
| Regulatory claim drift | 5–9 | Quarterly review of `docs/regulatory-lexicon.md`, primary-source-only rule |
| AI hallucination in Concierge | 7 | `minScore: 0.72` retrieval gate + "talk to human" escape hatch |
| Brand voice drift in AI copy | any | `brand-voice-guardian` required post-gate |
| Perf regression from motion | 2–6 | `lighthouse-budget-guard` on every CI, 150KB JS per route cap |
| Asset licensing issues | 2, 4 | Only use brand-owned or confirmed-licensed assets; stock photos banned on trust pages |
| Client anonymization leaks | 4, 6 | Strict `logoPermitted` flag enforcement in `pharma-case-study-writer` |
| Accessibility regressions | any | `design:accessibility-review` gate in Phase 9 + axe in CI |

## Status tracker

This document is a living copy. Update the table below as each phase closes.

| Phase | Started | Completed | Notes |
|---|---|---|---|
| 0 | 2026-04-20 |  | Foundation scaffolding in progress |
| 1 |  |  |  |
| 2 |  |  |  |
| 3 |  |  |  |
| 4 |  |  |  |
| 5 |  |  |  |
| 6 |  |  |  |
| 7 |  |  |  |
| 8 |  |  |  |
| 9 |  |  |  |

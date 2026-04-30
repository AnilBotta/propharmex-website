# Engineering handoff — Propharmex website

This is the lightweight executive overview of the Propharmex website build. It is **not** an exhaustive spec — every claim cross-references an authoritative document elsewhere in this repository or in the running production environment. Treat this file as a map, not as territory.

Editorial source of truth lives in this markdown file. The customer-facing `.docx` copy at [`docs/handoff.docx`](handoff.docx) is regenerated from this file by `scripts/generate-handoff-docx.py`. Do not edit the `.docx` directly.

---

## 1. Project summary

Propharmex is a Canadian pharmaceutical services company anchored at its Mississauga, Ontario site under a Health Canada Drug Establishment Licence, with a development centre in Hyderabad, Telangana. This repository builds the public marketing website plus four AI-powered tools, designed to outperform competitor CDMO sites in information density, design sophistication, and demonstrable AI-assisted UX while remaining fully compliant with healthcare-marketing norms.

Voice is anti-hype: expert, credible, humble, regulatory-precise. Tone, citations, and disclaimer rules are enforced at editorial gates before any user-facing string ships.

The site is a Next.js 15 App Router monorepo. Content is authored in Sanity Studio v3. AI features are powered by the Vercel AI SDK with Anthropic Claude as the primary model. Hosting is on Vercel with ISR for content routes and edge runtime for AI endpoints.

---

## 2. Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 App Router + React 19 + TypeScript strict |
| Runtime | Node 20 |
| Styling | Tailwind CSS v4 with `@theme` tokens + `@tailwindcss/typography` |
| Components | shadcn/ui primitives + Framer Motion + bespoke design system |
| CMS | Sanity Studio v3 (project `veo2rnkc`, dataset `production`) |
| Database | Supabase Postgres with `pgvector` (project `uvrgrulamuhwzuvbljbv`) |
| AI primary | Vercel AI SDK + Anthropic Claude `claude-sonnet-4-5-20250929` |
| AI embeddings | OpenAI `text-embedding-3-large` |
| AI fallback | OpenAI GPT-4o |
| Email | Resend (transactional + double-opt-in newsletter) |
| Booking | Cal.com inline iframe (`loading="lazy"`) |
| Analytics | Plausible + PostHog (region/referrer/device/utm super-properties) |
| Bot defence | Cloudflare Turnstile + Upstash Redis rate limit |
| Observability | Sentry v8 with PII redaction + Axiom structured logs |
| Testing | Vitest + Playwright + Lighthouse CI + axe-core CI |
| Hosting | Vercel (`iad1`), pnpm workspaces |

---

## 3. What shipped (Phase 0–9)

| Phase | Scope | Status |
|---|---|---|
| 0 — Foundation | CLAUDE.md, twelve project skills, docs scaffold, env spec | Done |
| 1 — Alignment | 12-bullet product summary, page list, AI feature mapping | Done |
| 2 — Scaffold + design system | Next.js + Tailwind + shadcn baseline, Storybook, tokens | Done |
| 3 — Shell + CMS | Header, Footer, Sanity Studio, GROQ helpers, draft mode | Done |
| 4 — Core pages | Home, Why Propharmex, About, Quality, Facilities | Done |
| 5 — Service + industry trees | All service leaves, industry pages | Done |
| 6 — Case studies + insights | Hub plus three seeded studies, one whitepaper download | Done |
| 7 — Process + contact + AI tools | Concierge, Scoping, DEL Readiness, Dosage Matcher | Done |
| 8 — SEO + personalization + analytics | Sitemap, robots, region middleware, PostHog taxonomy | Done |
| 9 — Hardening | CSP, Sentry, Turnstile, bundle budget, axe-core, ACR, runbook | Done |
| 10 — Handoff + launch | Prompt 27 deliverables, smoke suite, 301 map, v1.0.0 tag | In progress |

---

## 4. Page inventory

| Route | Type | Sanity-backed | Notes |
|---|---|---|---|
| `/` | Home | Yes | Region-aware hero ordering |
| `/why-propharmex` | Marketing | Yes | Anti-hype proof points |
| `/about` | Marketing | Yes | Canadian anchor narrative |
| `/about/leadership` | Marketing | Yes | Leadership grid |
| `/quality-compliance` | Marketing | Yes | Region-aware certs ordering |
| `/quality` | Redirect | No | Legacy slug; 301 to /quality-compliance |
| `/facilities` | Marketing | Yes | Mississauga + Hyderabad cards |
| `/facilities/mississauga-canada` | Detail | Yes | DEL anchor site |
| `/facilities/hyderabad-india` | Detail | Yes | Development centre |
| `/services` | Hub | Yes | Service tree root |
| `/services/pharmaceutical-development/[dosageForm]` | Detail | Yes | 7 dosage forms |
| `/services/analytical-services/[service]` | Detail | Yes | 7 analytical services |
| `/services/regulatory-services/[service]` | Detail | Yes | 5 regulatory services |
| `/industries/[slug]` | Detail | Yes | 5 industry segments |
| `/case-studies` | Hub | Yes | Anonymized client work |
| `/case-studies/[slug]` | Detail | Yes | Problem-Approach-Solution-Result |
| `/insights` | Hub | Yes | Articles + whitepapers |
| `/insights/[slug]` | Article | Yes | Long-form thought leadership |
| `/insights/whitepapers/[slug]` | Whitepaper | Yes | Gated PDF download |
| `/our-process` | Marketing | Yes | Engagement workflow |
| `/contact` | Form | Partial | Inquiry form + Cal.com + dual addresses |
| `/ai/concierge` | Implicit | No | Always-mounted bubble; no standalone route |
| `/ai/project-scoping-assistant` | AI tool | No | Conversational scope intake |
| `/ai/del-readiness` | AI tool | No | Multi-step DEL gap assessment |
| `/ai/dosage-matcher` | AI tool | No | Hybrid-score formulation match |
| `/accessibility` | Statement | Yes | Public accessibility statement |
| `/sitemap.xml` | Generated | No | 51 URLs |
| `/robots.txt` | Generated | No | 15 user-agents |

---

## 5. AI tools quartet

All four AI surfaces share the same defensive posture: rate-limited via Upstash Redis, PII-redacted on inbound user text, telemetry namespaced per-tool in PostHog, and gated by a 503 fallback when `ANTHROPIC_API_KEY` is unset.

**Concierge** — site-wide floating chat bubble. Dynamic-imported on first open so `ai/react` does not ship in the global bundle. Streams answers grounded in Sanity content via a RAG pipeline (Sanity → embeddings → pgvector → retrieve). Citations and per-message disclaimer arrive via SDK message annotations. Endpoint: `POST /api/ai/concierge`. Telemetry namespace: `concierge.*`.

**Project Scoping Assistant** — full-page conversational intake at `/ai/project-scoping-assistant`. First tool-calling consumer in the codebase. The model exposes one tool, `proposeScope`, whose Zod-validated args populate an editable preview card. Submit emails Business Development via Resend; Download produces a branded PDF via `pdf-lib` at runtime. Surface code-split via `ScopingSurfaceLoader`. Endpoint: `POST /api/ai/scoping`. Telemetry: `scoping.*`.

**DEL Readiness Assessment** — multi-step gap-analysis form at `/ai/del-readiness`. First deterministic-score tool: a 25-question form drives a rules-based readiness score, then Claude synthesises a narrative. Hand-rolled stream parser reads frame `8:` annotations (no `ai/react` import). Endpoint: `POST /api/ai/del-readiness`. Telemetry: `del.*`.

**Dosage Form Matcher** — hybrid-score recommender at `/ai/dosage-matcher`. Combines deterministic feature matching with Claude-authored rationale text. Same hand-rolled stream pattern as DEL. Endpoint: `POST /api/ai/dosage-matcher`. Telemetry: `dosage.*`.

---

## 6. Operations and runbooks

| Topic | Authoritative document |
|---|---|
| Architecture overview | docs/architecture.md |
| Operational runbook (deploy, rollback, incident ladder, CSP triage, Sentry triage, vendor outage playbooks) | docs/runbook.md |
| Accessibility conformance report (VPAT 2.5) | docs/accessibility-conformance.md plus docs/accessibility-conformance.docx |
| Manual assistive-tech test plan | docs/accessibility-at-test-plan.md |
| Analytics event taxonomy and super-properties | docs/analytics-taxonomy.md |
| SEO playbook | docs/seo-playbook.md |
| Brand voice rules | docs/brand-voice.md |
| Editorial style guide | docs/content-style-guide.md |
| Regulatory lexicon | docs/regulatory-lexicon.md |
| Canadian-anchor positioning | docs/positioning-canadian-anchor.md |
| Phase roadmap | docs/phase-roadmap.md |
| Design system overview | docs/design-system.mdx |
| Per-component documentation | docs/design-system/components/*.mdx (19 components) |

---

## 7. CI gates

| Gate | Workflow | What it enforces |
|---|---|---|
| Lint, typecheck, test, build | .github/workflows/ci.yml | Standard validation across the monorepo |
| Storybook build | .github/workflows/ci.yml | Component library compiles cleanly |
| Lighthouse CI | .github/workflows/lighthouse.yml | CWV budgets — perf warn 0.90, LCP warn 2500ms, CLS / TBT / FCP error |
| Bundle budget | .github/workflows/bundle-budget.yml | First-Load JS at most 450 kB per route, excluding API and image-generation routes |
| Axe-core a11y | .github/workflows/a11y-budget.yml | Zero serious or critical violations across 11 sampled URLs |

The bundle budget was ratcheted from 475 kB to 450 kB after the AI surface dynamic-import work; further ratcheting toward the 350 kB long-term target is a recorded follow-up.

---

## 8. Known follow-ups (post-launch backlog)

These are tracked but intentionally out of scope for the v1.0.0 launch.

- Lazy-split `/ai/dosage-matcher` and `/ai/del-readiness` (now the new worst-bundle routes at 431 and 429 kB respectively). Both use hand-rolled stream parsers; lazy-splitting their `pdf-lib` plus multi-step form chunks would close the gap.
- Defer Cloudflare Turnstile until first form focus on `/contact` to close the four demoted Lighthouse warns from the demote chain. Cal.com is already an iframe so no further deferral is available there.
- Promote Lighthouse `categories:accessibility` warn to error 1.0 after the manual VoiceOver and NVDA assistive-tech pass per docs/accessibility-at-test-plan.md.
- Per-route OG images for `case-studies/[slug]`, `industries/[slug]`, services dynamic leaves, and `/ai/*` tools.
- Touch-target uplift to 44 by 44 on the Concierge send button, header Region switcher, and `Button size="sm"`.
- Field-level `aria-invalid` on InquiryForm and WhitepaperGateForm (currently form-level errors only).
- Forced-colors mode media queries.
- Refactor inline `buildDetailJsonLd` functions onto the `@propharmex/lib` schema helpers.
- Resolve `parsers.ts::zSopCapability` Zod-schema drift left from Prompt 21.
- Add `/insights/whitepapers/[slug]` to the axe URL list.
- Build the four PostHog dashboards in the PostHog UI per docs/analytics-taxonomy.md section 6 (Lead funnel, AI tool conversion, Content performance, Region breakdown).

---

## 9. Repository entry points

For a new engineer, these are the most useful files to read first.

| Goal | Start at |
|---|---|
| Understand workflow rules | CLAUDE.md (project root) |
| Understand the build phases | docs/phase-roadmap.md |
| Run the site locally | apps/web/README.md |
| Modify a page | apps/web/app/<route>/page.tsx |
| Add a content type | packages/lib/sanity/schemas/ + apps/studio/schemas/ |
| Modify a component | packages/ui/components/ + matching docs/design-system/components/<X>.mdx |
| Touch an AI endpoint | apps/web/app/api/ai/<tool>/route.ts |
| Add a database migration | supabase/migrations/ + apply via Supabase MCP |
| Adjust a CI gate | .github/workflows/ + scripts/check-*.mjs |
| Triage a production incident | docs/runbook.md (15 sections) |

---

## 10. Handoff next steps

Items that require action outside of the codebase before launch.

| Action | Owner | Notes |
|---|---|---|
| DNS cutover from legacy host to Vercel | Operations | Coordinate apex plus www records |
| TLS certificate active on apex and www | Operations | Vercel automatic; verify before announce |
| 301 redirect map from legacy URLs deployed | Engineering | Source list pending from operations |
| Sitemap submitted to Google Search Console and Bing Webmaster Tools | SEO | After production deploy |
| Manual VoiceOver and NVDA assistive-tech pass | Accessibility lead | Per docs/accessibility-at-test-plan.md |
| PostHog dashboards built in UI | Product | Per docs/analytics-taxonomy.md section 6 |
| Resend production sender domain verified | Operations | DKIM and SPF records |
| Sentry production source maps uploaded | Engineering | Verified on first production deploy |
| Cal.com production link configured | Operations | Set CAL_LINK environment variable |

---

## 11. Revision history

| Date | Change | Pull request |
|---|---|---|
| 2026-04-30 | Initial handoff document for v1.0.0 launch | Pending |

# Prompt 0 — Master-Plan Alignment Summary

*Generated from `Propharmex_Website_Master_Build_Plan.pdf` + `Claude_Code_Prompts_Propharmex_Rebuild.md`. This file is the alignment gate for Prompt 1 onward. If any bullet conflicts with CLAUDE.md, CLAUDE.md wins.*

---

## 1. Twelve-bullet build summary

1. **Positioning & voice** — Propharmex is a Canada-anchored pharmaceutical services company with operating hubs in Mississauga, Ontario and Hyderabad, Telangana, serving drug developers globally. Mississauga holds the Health Canada Drug Establishment Licence and runs 3PL distribution; Hyderabad runs pharmaceutical development and analytical services. Voice is anti-hype, expert, credible, humble; regulatory-precise.
2. **Information architecture** — 9 top-level nav areas: Home, Services, Industries, Quality & Compliance, Facilities, Case Studies, Insights, Our Process, Contact. 4 AI tools ride on top as routes under `/ai-tools/*` and as inline embeds on relevant service pages.
3. **Design system** — Tailwind v4 `@theme` tokens, Inter typeface, restrained color system (clinical neutrals + single regulatory-navy primary + one accent), shadcn/ui primitives, Framer Motion choreography (240ms enter, 180ms exit, 40ms stagger), reduced-motion fallback required everywhere.
4. **CMS (Sanity v3)** — ~16 document types including `service`, `industry`, `caseStudy`, `insight`, `whitepaper`, `leader`, `facility`, `certification`, `navigation`, `siteSettings`, `aiPromptConfig`, `region`, `testimonial`, `faq`. Live visual editing + draft mode. Content is the source of truth; no hardcoded strings in components.
5. **Core pages (Phase 4)** — Home, Why Propharmex, About + Leadership, Quality & Compliance, Facilities. Every page ships with JSON-LD, SEO meta, OG image, accessibility passes, and Framer Motion.
6. **Service tree (Phase 5)** — 3 service hubs (Pharma Dev, Analytical, Regulatory) with 7+7+5 leaf pages. `health-canada-del` is the regulatory flagship with the DEL Readiness AI tool embedded.
7. **Industry tree (Phase 5)** — 5 industry pages (Innovators, Generics, Biotech, Government/NGO, Veterinary) mapping services to sector-specific buyer journeys.
8. **Case studies + insights (Phase 6)** — Problem → Approach → Solution → Result format with anonymization rules. Insights hub with pillar/cluster SEO model. 1 gated whitepaper live at launch.
9. **Four AI wow features (Phase 7)** — (a) CDMO Concierge on `/` (RAG chat over all Sanity content), (b) Project Scoping Assistant on `/services` (guided form → scope draft PDF), (c) DEL Readiness on `/services/regulatory-services/health-canada-del` (intake form → readiness report), (d) Dosage Form Matcher on `/services/pharma-development/dosage-form-development` (molecule/indication → recommended dosage forms). All run on Edge, rate-limited via Upstash, system prompts sourced from Sanity `aiPromptConfig`, mandatory disclaimer on every output.
10. **Personalization + SEO + analytics (Phase 8)** — Geo-based region switch (Canada/India/Global) for regulatory framing, sitemap + robots + JSON-LD everywhere, content calendar + competitor gap monitoring, Plausible + PostHog with event taxonomy.
11. **Hardening (Phase 9)** — Security headers (CSP, HSTS, Permissions-Policy), PII-redacted Sentry, Axiom structured logs, Lighthouse CI budgets (LCP ≤ 2.0s, CLS ≤ 0.05, INP ≤ 200ms, mobile JS ≤ 150KB/route), WCAG 2.2 AA zero Sev 1/2 pass.
12. **Launch (Phase 9 tail)** — 301 redirect map from legacy site, smoke suite, v1.0.0 tag, runbook + incident playbook, handoff docs.

---

## 2. Phase 1 page list (launch-blocking)

| Route | Purpose |
|---|---|
| `/` | Home with CDMO Concierge AI embed + hero + 5 positioning blocks |
| `/why-propharmex` | Two-hub operating model, Canada-anchored differentiation |
| `/about` | Company story, values, timeline |
| `/about/leadership` | Leader cards + bios |
| `/quality-compliance` | Certifications, quality systems, audit posture |
| `/facilities` | Mississauga + Hyderabad facility overviews |
| `/services` | Service hub with Scoping Assistant embed |
| `/services/pharma-development` | Hub page |
| `/services/pharma-development/formulation-development` | Leaf |
| `/services/pharma-development/analytical-method-development` | Leaf |
| `/services/pharma-development/stability-studies` | Leaf |
| `/services/pharma-development/process-development` | Leaf |
| `/services/pharma-development/tech-transfer` | Leaf |
| `/services/pharma-development/clinical-trial-supplies` | Leaf |
| `/services/pharma-development/dosage-form-development` | Leaf + Dosage Form Matcher embed |
| `/services/analytical-services` | Hub |
| `/services/analytical-services/method-development-validation` | Leaf |
| `/services/analytical-services/release-stability-testing` | Leaf |
| `/services/analytical-services/impurities-extractables-leachables` | Leaf |
| `/services/analytical-services/dissolution-bioequivalence` | Leaf |
| `/services/analytical-services/microbiological-testing` | Leaf |
| `/services/analytical-services/elemental-nitrosamine-testing` | Leaf |
| `/services/analytical-services/regulatory-cmc-support` | Leaf |
| `/services/regulatory-services` | Hub |
| `/services/regulatory-services/health-canada-del` | Leaf + DEL Readiness embed (flagship) |
| `/services/regulatory-services/us-fda-submissions` | Leaf |
| `/services/regulatory-services/who-gmp-eu-tga` | Leaf |
| `/services/regulatory-services/cmc-dossier-preparation` | Leaf |
| `/services/regulatory-services/regulatory-strategy-consulting` | Leaf |
| `/industries` | Industry hub |
| `/industries/pharmaceutical-innovators` | Industry leaf |
| `/industries/generic-manufacturers` | Industry leaf (flagship) |
| `/industries/cdmo-partners` | Industry leaf |
| `/industries/governments-and-ngos` | Industry leaf |
| `/industries/clinical-trial-sponsors` | Industry leaf |
| `/case-studies` | Case hub |
| `/case-studies/[slug]` | Case detail (3+ at launch) |
| `/insights` | Insights hub |
| `/insights/[slug]` | Article detail (5–10 at launch) |
| `/whitepapers/[slug]` | Gated whitepaper landing |
| `/our-process` | Engagement model, phases |
| `/contact` | Contact form + Cal.com booking + classifier |
| `/ai-tools/cdmo-concierge` | Full-page Concierge |
| `/ai-tools/scoping-assistant` | Full-page Scoping Assistant |
| `/ai-tools/del-readiness` | Full-page DEL Readiness |
| `/ai-tools/dosage-form-matcher` | Full-page Matcher |
| `/legal/privacy` | Privacy policy |
| `/legal/terms` | Terms |
| `/legal/cookie-policy` | Cookies |
| `/legal/ai-disclaimer` | AI-output disclaimer hub |

## 3. Phase 2 page list (post-launch, Q2+)

| Route | Purpose |
|---|---|
| `/careers` | Open roles + culture |
| `/careers/[slug]` | Role detail |
| `/news` | Press + announcements |
| `/news/[slug]` | Press detail |
| `/events` | Conferences + webinars |
| `/partners` | Partner ecosystem + logistics network |
| `/sustainability` | ESG posture |
| `/investors` | Investor relations (if public stage reached) |
| `/de/*`, `/fr/*` | Locale variants (EU + QC compliance) |

---

## 4. AI wow features × page binding

| Feature | Full-page route | Embed on |
|---|---|---|
| CDMO Concierge | `/ai-tools/cdmo-concierge` | `/` (hero-adjacent), `/services`, `/case-studies` |
| Project Scoping Assistant | `/ai-tools/scoping-assistant` | `/services`, `/contact` |
| DEL Readiness | `/ai-tools/del-readiness` | `/services/regulatory-services/health-canada-del`, `/contact` |
| Dosage Form Matcher | `/ai-tools/dosage-form-matcher` | `/services/pharma-development/dosage-form-development` |

All four share: Edge runtime, Upstash rate limit, Turnstile, Sanity-sourced system prompt from `aiPromptConfig`, AI-output disclaimer, PostHog event tracking, PII-redacted Sentry.

---

## 5. Stack confirmation vs CLAUDE.md §2

| Layer | Master plan says | CLAUDE.md §2 | Drift? |
|---|---|---|---|
| Framework | Next.js 15 App Router, React 19 | Same | ✓ |
| TypeScript | strict, Node 20 | Same | ✓ |
| Styling | Tailwind v4 `@theme` | Same | ✓ |
| Components | shadcn/ui + Framer Motion + Magic UI/Aceternity accents | Same | ✓ |
| CMS | Sanity Studio v3 | Same | ✓ |
| Database | Supabase Postgres + `pgvector` | Same (Neon dropped) | ✓ |
| AI | Vercel AI SDK + Anthropic Claude + OpenAI embeddings | Same | ✓ |
| Email | Resend | Same | ✓ |
| Booking | Cal.com | Same | ✓ |
| Analytics | Plausible + PostHog | Same | ✓ |
| Bot / rate | Cloudflare Turnstile + Upstash | Same | ✓ |
| Observability | Sentry + Axiom | Same | ✓ |
| Testing | Vitest + Playwright + Lighthouse CI | Same | ✓ |
| Hosting | Vercel (ISR + Edge for AI) | Same | ✓ |
| Monorepo | pnpm workspaces | Same | ✓ |

**No drift.** Prompt 1 proceeds under the CLAUDE.md §2 stack.

---

## 6. Rejected variants (for audit trail)

- **Node 22** — rejected. Locked stack is Node 20 LTS (matches Vercel runtime default, matches `.nvmrc` in repo).
- **Biome** (lint+format) — rejected. Locked stack is ESLint flat config + Prettier for ecosystem parity with shadcn + Sanity configs.
- **Voyage embeddings** — rejected. Locked stack is OpenAI `text-embedding-3-large` for ecosystem maturity and Supabase pgvector fit.
- **HubSpot + Slack** — rejected for v1. Contact + newsletter flow uses Resend + Sanity + optional Supabase row insert. CRM sync is a Phase 2 integration if needed.

---

## 7. Gate status

- ✅ 12-bullet summary complete
- ✅ Phase 1 + Phase 2 page lists locked
- ✅ 4 AI features mapped to routes
- ✅ Stack confirmed against CLAUDE.md §2 with zero drift

**Prompt 0 is complete. Prompt 1 may proceed.**

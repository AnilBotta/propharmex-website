# Claude Code Prompts — Propharmex Website Rebuild

**How to use this file:** Paste each prompt into Claude Code **in order**. Each prompt is self‑contained and tells Claude Code which **skills** to invoke (from the global skill library and the project's local skills). Do not skip prompts — later prompts depend on files/conventions created by earlier ones.

---

## Skills Inventory — Available to Claude Code

Before you run the first prompt, note the skills Claude Code can and should load. The rebuild uses them.

**Global / system skills (document & deliverable generation):**

- `docx` — create/edit Microsoft Word documents (specs, one‑pagers, brand guidelines)
- `pdf` — create/read PDFs (lead magnets, capability statements, downloadable docs)
- `pptx` — create PowerPoint decks (sales decks, internal review decks)
- `xlsx` — build spreadsheets (KPI trackers, content calendars, SEO maps)
- `skill-creator` — author new skills on the fly
- `schedule` — create scheduled tasks
- `consolidate-memory` — clean/merge project memory files

**Design plugin skills (use for UI/UX deliverables):**

- `design:design-system` — audit, document, and extend design systems (tokens, components, docs)
- `design:design-critique` — structured review of mockups
- `design:design-handoff` — spec sheets for engineering handoff
- `design:ux-copy` — microcopy, CTAs, error/empty states, onboarding copy
- `design:accessibility-review` — WCAG 2.1 AA audit of designs and built pages
- `design:research-synthesis` — synthesize research notes into themes
- `design:user-research` — plan interviews, usability tests, surveys

**App/integration skills (optional — use where relevant):**

- `apollo:prospect`, `apollo:enrich-lead`, `apollo:sequence-load` — BD / lead enrichment
- `cowork-plugin-management:*` — if packaging internal plugins later

> **Rule for Claude Code**: whenever a task maps to one of these skills, **invoke the skill first** and follow its SKILL.md instructions. Do not reimplement what a skill already does.

---

## Prompt 0 — Read the master plan

```
Read /workspace/Propharmex_Website_Master_Build_Plan.pdf end to end. This PDF is the single source of truth for positioning, IA, page structure, component inventory, design tokens, AI features, KPIs, and phasing. After reading:

1. Summarize the build in 12 bullets — one per major work package.
2. List every page we will ship in Phase 1 and Phase 2 with a one-line purpose each.
3. List the 4 AI wow features and which page each lives on.
4. Confirm the tech stack (Next.js 15 App Router + TypeScript strict + Tailwind v4 + shadcn/ui + Framer Motion + Sanity + Neon Postgres + pgvector + Vercel AI SDK + Anthropic Claude + Resend + Cal.com + Plausible + PostHog).

Use the pdf skill to read the PDF. Do not start coding yet — this prompt is for alignment only.
```

---

## Prompt 1 — Project scaffolding

```
Scaffold a production Next.js 15 monorepo for the Propharmex website.

Requirements:
- pnpm workspaces with apps/web, apps/studio (Sanity), packages/ui, packages/config, packages/lib
- Next.js 15 App Router, React 19, TypeScript strict mode, Node 20
- Tailwind CSS v4 with @theme tokens, PostCSS, @tailwindcss/typography
- shadcn/ui installed with components folder at packages/ui
- ESLint (flat config) + Prettier + lint-staged + Husky pre-commit
- Vitest for unit tests, Playwright for e2e
- GitHub Actions: lint, typecheck, test, build
- Vercel project config (vercel.json) with ISR + Edge runtime presets
- .env.example covering: Sanity, Neon DB, Supabase, Anthropic, OpenAI, Resend, Cal.com, Plausible, PostHog, Turnstile/reCAPTCHA, NextAuth secrets
- README.md explaining local dev, build, preview, tests

Generate the full file tree, then the actual files. Do not use deprecated APIs (no pages router, no getServerSideProps).
```

---

## Prompt 2 — Design system & tokens

```
Build the Propharmex design system.

Use the design:design-system skill to structure this deliverable.
Also invoke design:ux-copy when naming tokens and writing component docs.

Tokens (from the master plan):
- Primary: Deep Teal #0E4C5A (full 50–950 scale)
- Accent: Warm Amber #C99A4B
- Neutrals: Pharma White #FAFAF7, Slate 900–50
- Success / Warn / Danger: #16785A / #B8860B / #A23B3B
- Typography: Manrope (display + UI), Inter Tight (body), JJT Mono (numeric/code)
- Spacing scale 4/8/12/16/24/32/48/64/96
- Radii: 4/8/12/16/24, default 12
- Shadows: subtle multi-layer "pharma glass" set
- Motion: enter 240ms ease-out, exit 180ms ease-in, stagger 40ms

Deliverables:
1. packages/config/design-tokens.css with @theme layer
2. packages/ui/tailwind.config.ts extending theme
3. packages/ui/components — Button, Badge, Input, Textarea, Select, Card, Tabs, Accordion, Dialog, Sheet, Tooltip, Callout, Stat, Marquee, Carousel, Breadcrumb, Pagination, Skeleton — all using shadcn primitives + Framer Motion
4. Storybook (or Ladle) with a page per component
5. docs/design-system.mdx documenting token usage, anatomy, states, a11y notes per component

All interactive components must be keyboard-accessible and meet WCAG 2.1 AA.
```

---

## Prompt 3 — Global layout, navigation, and footer

```
Build the global layout.

Use design:ux-copy for nav labels and footer microcopy.
Use design:accessibility-review to self-check the result.

Requirements:
- app/layout.tsx — root layout, Manrope + Inter Tight via next/font, color scheme meta, skip-to-content link, Plausible + PostHog scripts, JSON-LD Organization + LocalBusiness
- Header: sticky, transparent-over-hero → solid on scroll; logo; mega-menu for Services, Industries, Resources; Region switcher (Canada/India/Global); "Request a Quote" CTA (primary)
- Footer: 5-column (Services, Industries, Company, Resources, Contact); address blocks for Mississauga ON + Hyderabad IN; Health Canada DEL badge; social; newsletter signup with Resend; sitemap and legal links
- Mobile nav: full-sheet drawer with accordion sections, 44px min tap targets
- 404 and 500 pages branded
- Loading and error boundaries at the segment level

Everything keyboard-navigable, focus-visible rings, reduced-motion honored.
```

---

## Prompt 4 — Sanity Studio & content schemas

```
Set up the Sanity content layer.

Create apps/studio with schemas for:
- siteSettings (global: brand, nav, footer, regions)
- page (generic page with portable-text body + section builder)
- service (hub + leaf variant)
- industry
- caseStudy (problem, solution, result, metrics, client logo permitted flag)
- insight (blog/article: author, tags, read time, hero, body, related)
- whitepaper (lead magnet: title, summary, cover, file, gated boolean, form fields)
- person (leadership, scientists)
- facility (location, capabilities, certs, photos)
- certification (name, issuer, date, document)
- faq (question, answer, tag)
- testimonial
- sopCapability (for the Dosage Form Matcher)
- aiPromptConfig (system prompts for all 4 AI features, versioned)

Section builder components: Hero, Pillars, StatsStrip, ProcessStepper, LogoWall, CaseStudyCarousel, CapabilityMatrix, CertBand, LeaderCard, FAQBlock, CTASection, BentoGrid.

Enable draft mode, live preview, and visual editing. Add a GROQ query library at packages/lib/sanity.
```

---

## Prompt 5 — Homepage

```
Build the homepage at apps/web/app/page.tsx using the exact 14-section structure in the master plan.

Use design:ux-copy for every headline, subhead, and CTA.
Use design:design-critique to review the final layout.

Sections in order:
1. Hero — headline "Your Canada-India Bridge for End-to-End Pharma Development & Distribution." Animated molecule/lab scene (Lottie or WebGL) + 3-lane CTA stack (Start a Project / Explore Capabilities / Check DEL Readiness).
2. Trust strip — cert logos (Health Canada DEL, ISO 9001, WHO-GMP, USFDA, TGA) with Framer stagger.
3. Why Propharmex — 4 pillars (Integrated, Regulated, Specialized in Complex Generics, Delivery Certainty).
4. What We Do — 4-card matrix (Pharma Development, Analytical, Regulatory, 3PL/Distribution) with hover reveal.
5. Canada + India Advantage — dual-column: left Mississauga/DEL/3PL, right Hyderabad/R&D/manufacturing. World-map connector animation.
6. AI Capability Matcher teaser — embed the Dosage Form Matcher launcher.
7. Proof — 3 anonymized case-study cards with outcome metric overlays.
8. Process — 6-step horizontal scroll stepper (Inquiry → NDA/Scope → Proposal → Contract → Execute → Deliver/Transfer).
9. Industries Served — bento grid (Innovators, Generics, CDMO partners, NGOs/Governments).
10. Leadership glimpse — 3 leader cards with 1-line credentials.
11. Insights/Resources — 3 latest whitepapers or blog posts.
12. DEL Readiness tool teaser — banner CTA.
13. Contact mini-form — email + company + dosage form dropdown + free text; posts to Resend.
14. Regulatory footer — full address, cert ids, accessibility statement link.

Use Framer Motion with IntersectionObserver for all scroll-driven effects. Every image uses next/image with responsive sizes. Target LCP <2.0s on 4G.
```

---

## Prompt 6 — Why Propharmex page

```
Build /why-propharmex as a narrative single-page story with 6 chapters (Problem → Gap → Our Model → Proof → Canada-India Engine → Call).

Use design:ux-copy. Use design:accessibility-review.

Each chapter gets its own full-viewport section with:
- Scroll-triggered entrance
- Inline stat callouts
- One supporting quote or data point
- Sticky side rail showing chapter progress

End with a dense CTA block offering Schedule a call / Download the Canada-India playbook / Start a project.
```

---

## Prompt 7 — About & Leadership

```
Build /about and /about/leadership.

/about sections: Founding story, Mission/Vision/Values (animated SVG trio), Timeline (2010–today), Global footprint map, Leadership preview, Culture, Careers CTA.

/about/leadership: grid of person cards from Sanity, each with modal detail sheet (bio, credentials, LinkedIn, published papers).

Use design:ux-copy for tone (expert, credible, humble, zero-hype).
Use the docx skill to also export a printable company one-pager to /public/downloads/propharmex-company-overview.docx from the same Sanity source.
```

---

## Prompt 8 — Quality & Compliance

```
Build /quality-compliance — this page is a primary trust lever.

Sections:
1. Hero — "Quality Isn't a Department. It's Our Operating System."
2. Certification wall — interactive grid of every cert with issuer, scope, validity, and downloadable PDF (use the pdf skill to generate a summary sheet per cert).
3. QMS architecture diagram — animated SVG showing SOPs → training → deviations → CAPA → audits → release.
4. Regulatory bodies we work with — Health Canada, USFDA, TGA, EU EMA, WHO, PMDA, etc. with capability per body.
5. Audit history — anonymized audit outcomes with zero-483 callout.
6. Our DEL story — dedicated subsection previewing /regulatory-services/del-licensing.
7. Download center — Quality Policy PDF, SOP index (titles only), Data Integrity policy.

Run design:accessibility-review and design:design-critique before finishing.
```

---

## Prompt 9 — Facilities (Mississauga + Hyderabad)

```
Build /facilities with two sub-pages: /facilities/mississauga-canada and /facilities/hyderabad-india.

Index page: side-by-side comparison with map, size, capabilities, certs, photo carousel.
Detail pages: hero with 360 photo viewer stub, capability matrix, equipment list, cold-chain spec, 3PL warehouse map (Mississauga only), photo gallery with captions, "How to visit" CTA.

Pull content from Sanity facility documents. Use next/image for all photos with blur placeholders.
```

---

## Prompt 10 — Pharmaceutical Development hub + sub-pages

```
Build the Pharmaceutical Development hub and its sub-pages.

Hub: /services/pharmaceutical-development — intro, capability matrix of dosage forms (solid oral, liquid oral, topical, sterile injectables, inhalation, ophthalmic, transdermal), lifecycle diagram (preformulation → formulation → scale-up → tech-transfer), case studies rail, CTA.

Sub-pages (one per dosage form):
- /services/pharmaceutical-development/solid-oral-dosage
- /services/pharmaceutical-development/liquid-oral-dosage
- /services/pharmaceutical-development/topical-semisolid
- /services/pharmaceutical-development/sterile-injectables
- /services/pharmaceutical-development/inhalation
- /services/pharmaceutical-development/ophthalmic
- /services/pharmaceutical-development/transdermal-modified-release

Each sub-page template:
1. Hero with a one-sentence value prop
2. Typical challenges we solve (3–5 bullets)
3. Our process for this dosage form (tailored stepper)
4. Equipment & techniques (scannable chips)
5. Mini case study or outcome metric
6. "Is this right for you?" 3-question self-check → routes to the Dosage Form Matcher
7. FAQ accordion
8. Related services cross-links
9. CTA block

Use design:ux-copy for every headline and CTA.
```

---

## Prompt 11 — Analytical Services hub + sub-pages

```
Build /services/analytical-services hub and sub-pages for Method Development, Method Validation, Stability Studies (ICH zones), Impurity Profiling, Bioanalytical, Extractables & Leachables, Reference Standard Characterization.

Reuse the sub-page template from Prompt 10 but theme the visuals around instruments (HPLC, GC-MS, LC-MS/MS, NMR, Karl Fischer, DSC).

Add an "Instrument Inventory" data table per page, pulled from Sanity, sortable by technique.

Use design:design-handoff to produce the spec sheet for this template before coding the sub-pages.
```

---

## Prompt 12 — Regulatory Services hub + DEL flagship

```
Build /services/regulatory-services hub and sub-pages. The DEL page is the flagship differentiator.

Hub sub-pages:
- /services/regulatory-services/health-canada-del-licensing  ← flagship
- /services/regulatory-services/dossier-preparation-ctd-ectd
- /services/regulatory-services/anda-and-dmf
- /services/regulatory-services/gmp-audit-preparation
- /services/regulatory-services/lifecycle-regulatory-management

DEL flagship page must include:
- Explainer: what DEL is, who needs it, why Propharmex holds it
- The 3PL + DEL combo — our unique Canadian bridge
- Timeline from application to issuance
- Common pitfalls we solve
- **DEL Readiness Assessment** AI tool embedded inline (built in Prompt 20)
- Case study: how a US innovator launched in Canada in X months via Propharmex
- Downloadable DEL checklist (use the pdf skill to generate)

Use design:ux-copy and design:accessibility-review.
```

---

## Prompt 13 — Industries Served

```
Build /industries with leaf pages:
- /industries/pharmaceutical-innovators
- /industries/generic-manufacturers
- /industries/cdmo-partners
- /industries/governments-and-ngos
- /industries/clinical-trial-sponsors

Each page answers: their pain, our tailored offering, regulatory context, proof, and CTA. Use a consistent hero + 3-column layout + relevant case study + industry-specific FAQ.
```

---

## Prompt 14 — Case Studies hub & detail

```
Build /case-studies index with filterable grid (dosage form, service, industry, region) and detail pages at /case-studies/[slug].

Detail template follows Problem → Approach → Solution → Result structure with:
- Outcome metric hero (big number + label)
- Timeline visualization
- Technical approach breakdown
- Regulatory outcome (filings, approvals)
- Anonymization respected: "Top-5 US generic manufacturer" when named use not permitted
- "Similar challenge? Start a project" CTA

Pull from Sanity caseStudy docs. Support client logo show/hide flag.
```

---

## Prompt 15 — Insights hub, articles, whitepapers

```
Build /insights (index) with filter tabs: All / Articles / Whitepapers / Regulatory Updates / Case Studies.

Article pages at /insights/[slug]:
- Hero with read time, author, published date
- Portable Text body with custom serializers for callouts, figures, code blocks, pull quotes
- Author card
- Related reads (3 cards)
- Inline CTA every 800 words suggesting the relevant service
- Table of contents sticky rail on desktop

Whitepapers at /insights/whitepapers/[slug]:
- Summary + covers
- Gated download form (email + company + role) → Resend double opt-in + content sync to Sanity
- Use the pdf skill to generate the downloadable PDF from Sanity content if a file isn't uploaded
```

---

## Prompt 16 — Process page

```
Build /our-process as an animated journey showing the 6 phases (Inquiry → NDA & Scope → Proposal → Contract → Execute → Deliver / Technology Transfer).

Desktop: horizontal scroll-pinned stepper.
Mobile: vertical timeline with reveal animations.

Each phase card shows: what happens, what we need from you, what you receive, typical timeline. End with "Start my project" launching the AI Scoping Assistant (built in Prompt 19).
```

---

## Prompt 17 — Contact page + smart inquiry router

```
Build /contact.

Page content:
- Two address cards (Mississauga + Hyderabad) with map embed, phone, general email
- Routed inquiry form with fields: name, company, role, email, region, service of interest, dosage form (if dev), stage of project, free-text.
- Validation with React Hook Form + Zod
- Turnstile/hCaptcha for bot protection
- On submit: server action classifies the inquiry via Anthropic Claude (use Vercel AI SDK), routes to the right internal team alias via Resend, logs to Neon, and fires PostHog + Plausible events. Show confirmation with expected response time.
- Include a "Prefer to talk first?" Cal.com embed with 15-min discovery slots.

Use design:ux-copy for form labels, helper text, and success/error states.
```

---

## Prompt 18 — AI Feature #1: CDMO Concierge Chatbot

```
Build the floating CDMO Concierge assistant available site-wide.

Architecture:
- Route: POST /api/ai/concierge
- Vercel AI SDK streaming with Anthropic Claude (fallback OpenAI GPT-4o)
- RAG: all Sanity content chunked, embedded with OpenAI text-embedding-3-large, stored in Supabase pgvector
- Query: embed user question → top-k 8 retrieval → pass to Claude with strict system prompt from Sanity aiPromptConfig doc
- Hard guardrails: no medical advice, no regulatory promise, always cite source pages with links, always offer "Talk to a human" escape hatch
- UI: floating bubble bottom-right, expands to 400×600 panel, message streaming, suggested prompts ("What dosage forms do you handle?", "How long does DEL take?", "Do you do bioequivalence studies?"), file upload disabled, thumbs feedback per message → PostHog
- Include rate limit per IP, abuse detection, PII redaction on input
- Analytics: track conversations, deflection rate, handoff rate

Write unit tests for the RAG pipeline and an e2e Playwright test for the happy path.
```

---

## Prompt 19 — AI Feature #2: Project Scoping Assistant

```
Build the AI Project Scoping Assistant at /ai-tools/project-scoping-assistant.

Flow:
1. Conversational intake (5–8 questions) adapting to answers
2. Generates a structured scope summary: objectives, dosage form(s), stage, deliverables, assumptions, risks, estimated phases and ballpark timeline, recommended Propharmex services
3. Shows a preview card; user can tweak fields inline
4. Two outputs:
   a. Send to Propharmex (calls same classifier as the contact form + emails internal BD)
   b. Download as PDF (use the pdf skill) with Propharmex branding

Implementation:
- useChat hook from Vercel AI SDK, streaming Claude responses
- Strongly typed JSON schema (zod) the model must fill — use tool calling
- Final JSON → React scope preview → pdf skill → served via signed URL
- Persist sessions anonymously in Neon; send only on submit

Include a "See a sample" button loading a pre-canned example.
```

---

## Prompt 20 — AI Feature #3: Health Canada DEL Readiness Assessment

```
Build the DEL Readiness Assessment at /ai-tools/del-readiness.

Flow:
- 12–15 regulatory gating questions (facility, QMS, personnel, site master file, GDP, import/export, cold chain, etc.) driven by a JSON rubric in Sanity
- Question branching via tool calls
- At end: model produces a readiness score (0–100), traffic-light gap summary, prioritized remediation plan
- CTA to "Book a DEL consultation" via Cal.com
- Downloadable personalized report via the pdf skill

Guardrails: explicitly labeled "informational, not a regulatory guarantee"; every output includes a disclaimer and a "talk to our regulatory team" CTA.

Run design:accessibility-review on the multi-step form.
```

---

## Prompt 21 — AI Feature #4: Dosage Form Capability Matcher

```
Build the Dosage Form Matcher at /ai-tools/dosage-form-matcher.

Flow:
1. User describes their molecule/product in natural language OR selects from guided filters (API type, target indication, release profile, patient population, development stage)
2. Anthropic Claude matches against Sanity sopCapability documents + published capability matrix
3. Returns: top 3 recommended dosage forms with rationale, Propharmex capability fit score per form, relevant case studies, next-step CTA
4. Side-by-side comparison view (tabs or split panes)

Use structured output (zod + tool calling). Include a "Not sure? Talk to a scientist" escape hatch at every step.
```

---

## Prompt 22 — Region personalization

```
Add region personalization.

- Detect region from Vercel geo headers (edge middleware) with manual override via header switcher
- Persist choice in cookie `px-region` (Canada | India | Global)
- Personalize: hero copy, certification emphasis (DEL first for Canada, USFDA for US visitors, WHO-GMP for Global), CTAs, contact office shown first
- Do not hard-gate any content
- Track region in PostHog

Respect privacy: show a subtle "We detected you're in Canada — showing Canadian services first. Change" banner on first visit.
```

---

## Prompt 23 — SEO, schema, and content strategy

```
Lock in SEO fundamentals.

Deliverables:
- next-sitemap configured (priority map, changefreq, canonical host)
- robots.txt with AI crawler policy
- next-seo defaults per route segment
- JSON-LD schemas: Organization, LocalBusiness ×2 (Mississauga + Hyderabad), Service per service page, Article per insight, FAQPage per page with FAQs, BreadcrumbList site-wide
- OG image generator via @vercel/og for every page (dynamic)
- Core Web Vitals budgets enforced in CI (Lighthouse CI): LCP ≤ 2.0s, CLS ≤ 0.05, INP ≤ 200ms
- Internal linking helper that surfaces 3 "related" links per leaf page based on Sanity taxonomies
- Also build a content plan spreadsheet for the first 30 insight articles.

Use the xlsx skill to generate the content plan spreadsheet: columns = working title, target keyword, intent, persona, target page, pillar, word count, author, status, due date. Deliver at /public/internal/content-calendar-q1.xlsx (internal only).
```

---

## Prompt 24 — Analytics, experimentation, and event taxonomy

```
Wire up analytics.

- Plausible for privacy-respecting page analytics
- PostHog for product analytics, feature flags, funnels
- Standard events: page_view, hero_cta_click (with variant), service_card_click, ai_tool_open (tool name), ai_tool_step_advance, ai_tool_complete, whitepaper_download, form_submit (form name), region_switch, chat_open, chat_message, contact_submit, scope_assistant_send, del_assessment_complete
- Super properties: region, referrer_group, device_class, first_touch_utm
- Dashboards in PostHog: Lead funnel, AI tool conversion, Content performance, Region breakdown

Document the event taxonomy in docs/analytics-taxonomy.md.
```

---

## Prompt 25 — Performance, security, observability

```
Harden the site for production.

- next/image everywhere, AVIF+WebP, proper sizes
- Route-level Suspense + streaming
- Static where possible (ISR 300s for content pages, 60s for insights index, fully static for brand pages)
- Bundle analyzer in CI; warn if any route >150KB JS on mobile
- Middleware: geo, rate limit via Upstash, security headers (CSP, HSTS, X-Frame, Permissions-Policy), bot protection for AI endpoints
- Edge runtime for all /api/ai/* routes
- Sentry for error tracking (redact PII)
- LogTail or Axiom for structured logs
- Status endpoint at /api/health
- Uptime check every 60s
- All secrets via Vercel env, none in repo

Document the runbook in docs/runbook.md.
```

---

## Prompt 26 — Accessibility pass

```
Run a full accessibility pass across every page built so far.

Use design:accessibility-review skill. Audit for:
- WCAG 2.1 AA compliance
- Keyboard navigation: all interactive, focus order, visible focus, no keyboard traps
- Screen reader: landmarks, headings, aria-labels, alt text
- Color contrast (all token pairings — generate a contrast report)
- Motion: prefers-reduced-motion fully respected, no parallax without fallback
- Forms: labels, errors, hints programmatically associated
- Touch targets ≥44px
- Language attributes, document structure

Output:
1. A list of issues grouped by severity
2. Fixes applied for every Sev 1/2 issue
3. An accessibility statement added at /accessibility

Use the docx skill to also export a signed-off Accessibility Conformance Report for internal compliance files.
```

---

## Prompt 27 — Engineering handoff, QA, and launch

```
Produce the engineering handoff package and run launch QA.

Use design:design-handoff for the spec doc.
Use the docx skill for the final handoff doc.
Use the xlsx skill for the QA matrix.
Use the pdf skill for the launch checklist PDF.

Deliverables:
1. docs/handoff.docx — full component + page specs, states, edge cases, animation timings, responsive behavior
2. docs/qa-matrix.xlsx — every page × every breakpoint × every browser × pass/fail cell
3. docs/launch-checklist.pdf — pre-launch gates: DNS, SSL, redirects from old URLs (301 map), robots, sitemap submitted to GSC+Bing, analytics firing, forms hitting inbox, AI endpoints healthy, legal pages live, staging signed off, rollback plan
4. Cypress/Playwright smoke suite: homepage loads, primary CTA works, contact form submits, each AI tool opens, chat streams, insights list loads, whitepaper download works
5. 301 redirect map from the legacy propharmex.com URLs to the new IA (coordinate with ops)
6. Post-launch monitoring dashboard config

Run the full smoke suite. Confirm zero Sev 1 issues. Tag release v1.0.0.
```

---

## Appendix A — When to reinvoke which skill

| Task | Skill |
|---|---|
| Write any user-facing string | `design:ux-copy` |
| Review a mockup or built page | `design:design-critique` |
| Build/document tokens & components | `design:design-system` |
| Produce spec for engineering | `design:design-handoff` |
| Audit a11y on a page | `design:accessibility-review` |
| Generate a downloadable PDF (whitepaper, DEL checklist, scope report) | `pdf` |
| Generate a Word doc (one-pager, handoff, conformance report) | `docx` |
| Generate a spreadsheet (content plan, QA matrix, KPI tracker) | `xlsx` |
| Generate a deck (internal review, sales enablement) | `pptx` |
| Schedule a recurring task (weekly SEO audit, monthly KPI pull) | `schedule` |

## Appendix B — Definition of Done (every prompt)

A prompt is not complete until:

1. Code is TypeScript-strict, passes `pnpm lint` and `pnpm typecheck`
2. Unit tests added where logic exists; all pass
3. Playwright covers the happy path
4. Lighthouse mobile ≥ 95 Performance / 100 SEO / 100 Best Practices / 100 Accessibility on every built route
5. `design:accessibility-review` returns zero Sev 1/2 issues
6. No hardcoded strings in component files — all through Sanity or a locale dictionary
7. No `console.log` left behind
8. README / route docs updated
9. Commit message follows Conventional Commits

---

*End of prompts file. Run Prompt 0 first. Do not skip ahead.*

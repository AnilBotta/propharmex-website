# Propharmex SEO + GEO Playbook

Strategy document consumed by `pharma-seo-optimizer`. Defines pillars, clusters, internal-link rules, entity strategy, and AI-answer optimization.

## Pillar–cluster model

Six pillars map to the top-level IA. Each pillar has a hub page that aggregates 5–15 cluster pages, which in turn collect 5–30 supporting insight articles.

```
Pillar:        Hub page                              Cluster pages (examples)
----------------------------------------------------------------------------------
development    /services/pharmaceutical-development  solid-oral, liquid-oral, topical,
                                                     sterile-injectables, inhalation,
                                                     ophthalmic, transdermal
analytical     /services/analytical-services         method dev, method validation,
                                                     stability (ICH zones), impurity,
                                                     bioanalytical, E&L, reference std
regulatory     /services/regulatory-services         DEL licensing ★flagship, CTD/eCTD,
                                                     ANDA/DMF, GMP audit prep, lifecycle
distribution   /services/3pl-distribution            DEL import/export, cold chain,
                                                     warehousing, last-mile
quality        /quality-compliance                   QMS, deviations, CAPA, audits, DI
company        /about, /why-propharmex               two-hub operating model, leadership
```

Every insight article targets a **primary keyword** that nests under exactly one cluster. Every article links up to its cluster hub and laterally to 2 sibling clusters.

## Internal linking rules

- **Up-link** — every leaf page has at least 1 link to its cluster page with anchor text = cluster keyword
- **Hub-link** — every cluster page links to exactly 1 hub page
- **Sibling-link** — cluster pages link to 2 siblings that share pillar
- **Cross-pillar bridge** — each service leaf links to 1 relevant regulatory page and vice versa
- **Insights link inward** — insight articles link to 1 hub + 1–3 cluster pages
- **Case studies** — link from cluster + industry pages; case study → relevant service leaf
- Implementation: an internal-link helper in `packages/lib/seo/internal-links.ts` surfaces 3 "related" links per leaf page, driven by Sanity taxonomy tags (pillar + cluster + dosage-form)

## Competitor set

- **Global CDMO peers** — wuxiapptec.com, lonza.com, patheon.com, catalent.com, piramal.com
- **Canadian specialists** — pharmalogic.ca, apotex.com (comparator for scale only — we don't compete on generics manufacturing)
- **Indian development CDMOs** — sainor.com, sgsindia.com, sree-lab.com
- **Biotech/pharma leaders** (for design + UX benchmark, not keyword competition) — vertexpharma.com, mabwell.com

Quarterly gap audit via `pharma-seo-optimizer gap <domain>`.

## Entity strategy

- **Primary entity:** "Propharmex" — LocalBusiness + MedicalOrganization + Organization with `@id` anchor
- **Sub-entities:** Mississauga facility, Hyderabad facility, each leadership Person
- **sameAs** — LinkedIn, Crunchbase, Google Business Profile (Mississauga + Hyderabad), Health Canada DEL register entry
- **Consistent NAP** (Name, Address, Phone) across every page footer + schema
- **Author E-E-A-T** — every insight has a Person author with credentials + LinkedIn + published-paper list

## GEO / AI-citation optimization

Goal: be cited by ChatGPT, Claude, Perplexity, Gemini for pharma/CDMO queries.

1. **Answer-first paragraphs.** Every page has a 40–80-word direct answer to the H1's implied question in the first paragraph.
2. **Question H2s.** H2s phrased as questions ("How long does a Canadian DEL take?") — AI engines quote Q+A pairs preferentially.
3. **Citable statements.** Short (≤ 25-word), factual, quote-ready statements sprinkled at the end of each H2 block.
4. **Entity clarity.** First mention of Propharmex: "Propharmex, a Canadian DEL-licensed CDMO headquartered in Mississauga, Ontario with a second facility in Hyderabad, India, offers…"
5. **Dates.** Every data claim tagged with "as of [date]"; last-reviewed timestamp on every insight.
6. **llms.txt** at root enumerating the crawlable content surfaces (built in Prompt 23).
7. **Schema coverage** per page type — see `pharma-schema-markup` skill for the full map.
8. **FAQPage** schema on every page that has FAQs — these are the highest-citation surface.

## Content calendar

Built in Prompt 23 as an `.xlsx` via the `xlsx` skill. Columns: working title, primary keyword, intent, persona, target cluster, pillar, word count, author, status, due date, publish date, primary CTA, related services.

Cadence target for launch + first 3 months:
- 8 insight articles (4 regulatory, 2 analytical, 1 development, 1 quality)
- 2 whitepapers (1 two-hub operating model deep-dive, 1 DEL readiness deep-dive)
- 3 case studies
- Weekly "regulatory update" micro-posts (300–500 words) — low-lift, high citation-value

## Core Web Vitals + technical SEO budget

See `lighthouse-budget-guard` skill. Non-negotiable:

- LCP ≤ 2.0s (mobile 4G)
- CLS ≤ 0.05
- INP ≤ 200ms
- First-load JS ≤ 150KB gzip per route
- Lighthouse mobile ≥ 95/100/100/100

## Keyword monitoring

- Rank tracking via `pharma-seo-optimizer` with manual top-20 keyword list initially
- If DataForSEO MCP is later provisioned, automate
- AI-citation tracking via monthly `geo-check` pass across top 20 keywords (log results to `docs/geo-tracking/YYYY-MM.md`)

## Anti-patterns (do not)

- Keyword stuffing (density > 2.2%)
- Thin doorway pages per city
- AI-generated content without human review + brand-voice-guardian pass
- Claims that compete on regulatory outcomes (e.g., "100% ANDA approval rate") — these are fabrications
- Copying competitor copy (we audit but never plagiarize)
- Inflated `aggregateRating` schema without real reviews
- Hiding content for SEO (noscript, display:none, color-on-color)

---
name: sanity-schema-builder
description: Generates typed Sanity v3 schema files from plain-English specs, emits GROQ query helpers, maintains the studio schema index, and writes matching Zod validators + TypeScript types to packages/lib/sanity/.
when_to_use: Prompt 4 (full Sanity setup) and any later prompt that needs a new content type, a field addition, or a new GROQ query. Always invoked before hand-rolling Sanity schema.
---

# Sanity Schema Builder

## What it generates

For a given schema spec, produces:

1. `apps/studio/schemas/<name>.ts` — Sanity v3 schema with proper field types, validation, previews, and orderings
2. `apps/studio/schemas/index.ts` — updated to export the new schema
3. `packages/lib/sanity/groq/<name>.ts` — GROQ queries: `<name>ByIdQuery`, `<name>BySlugQuery`, `<name>ListQuery`, `<name>FeaturedQuery`
4. `packages/lib/sanity/types/<name>.ts` — inferred TS types (via `groqd` or `@sanity/codegen`)
5. `packages/lib/sanity/zod/<name>.ts` — Zod schema mirroring the Sanity schema for runtime validation on API routes
6. Fixtures under `packages/lib/sanity/fixtures/<name>.json` for tests

## Default fields per doc type

Every content doc inherits from a base template:

- `title` (string, required, min 4 chars)
- `slug` (slug, required, source `title`)
- `seoTitle`, `seoDescription`, `ogImage`
- `publishedAt` (datetime, default `new Date()`)
- `isVisible` (boolean, default true — soft-unpublish)
- `pillar` (reference to `pillar` or enum — `development|analytical|regulatory|distribution|quality|company`)
- `region` (array of `canada|india|global`)
- For AI ingestion: `ragEligible` (boolean, default true — lets us exclude a doc from the Concierge RAG)

## Schema inventory for Propharmex (Prompt 4)

| Schema | Notes |
|---|---|
| `siteSettings` | Singleton. Brand, nav, footer, regions, social. |
| `page` | Generic with portable-text body + section builder array |
| `service` | Variants: `hub` vs `leaf`; references parent hub |
| `industry` | Simple page + audience, no hierarchy |
| `caseStudy` | Problem/Approach/Solution/Result portable-text, metrics, logoPermitted |
| `insight` | Article (`articleType: news|tech|scholar|insight|regulatory-update`), author, tags, readingTime, relatedReads, FAQs |
| `whitepaper` | Summary, cover, file ref, gated boolean, formFields |
| `person` | Leadership/scientists; credentials, publications, LinkedIn |
| `facility` | Location, capabilities, certs, photos, openingHours, map coords |
| `certification` | Name, issuer, date, document, scope, validUntil |
| `faq` | Question, answer, tag — reusable across pages |
| `testimonial` | Quote, author, role, company, permission flag |
| `sopCapability` | For Dosage Form Matcher: dosage form + capabilities matrix |
| `aiPromptConfig` | Singleton with 4 keyed prompts (`concierge`, `scoping`, `delReadiness`, `dosageMatcher`); versioned via history |
| `event` | Webinars, conferences |
| `lead` | Form submissions — write-only from server actions |

## Section builder (portable-text-style array)

Each section is its own schema registered as a block type:
- `hero` (variant, headline, subhead, CTAs[], media)
- `pillars` (4 pillar cards)
- `statsStrip` (N stats with value + label)
- `processStepper` (steps[])
- `logoWall` (logos[] with alt)
- `caseStudyCarousel` (refs[])
- `capabilityMatrix` (rows × columns)
- `certBand` (refs to certification[])
- `leaderCard` (ref to person)
- `faqBlock` (refs to faq[] or inline)
- `ctaSection` (variant, copy, primaryCta, secondaryCta)
- `bentoGrid` (tiles[])

All section schemas live in `apps/studio/schemas/sections/` and are imported by the `page`, `service`, `industry`, `insight` body arrays.

## GROQ conventions

- Always `pt::text(body)` transform for RAG extraction
- Resolve references with explicit projections (never `...->`)
- Filter `!(_id in path("drafts.**"))` on public queries
- For lists, `order(publishedAt desc)[0...{limit}]`
- For related queries, precompute via `references($id)` with pillar match

## Validation

- Every field required for SEO is marked `.required()` (slug, title, seoTitle ≤ 60, seoDescription ≤ 160)
- Image fields require alt text via `.custom()` rule
- Portable-text body length sanity: insight ≥ 600 words, caseStudy section ≥ 200 words each
- Unique slug check per doc type
- Cross-ref integrity: hub references cannot point to leaves and vice versa

## Live preview + visual editing

- Preview URL per doc type (set in `apps/studio/sanity.config.ts`)
- `defineLocations` for visual editing on all page-producing types
- Draft mode toggle via signed cookie (`/api/draft-mode/enable`)

## Outputs when invoked

Answer with the generated file list + diff summary + one-line-per-file purpose, then actually write them.

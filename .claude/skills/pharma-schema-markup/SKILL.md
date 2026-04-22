---
name: pharma-schema-markup
description: Generates, validates, and installs JSON-LD structured data for every Propharmex page type. Covers Organization, LocalBusiness (Mississauga + Hyderabad), Service, MedicalOrganization, Article, FAQPage, BreadcrumbList, Event, Person, and composite nested schemas.
when_to_use: Any time a page is being created or updated (Prompts 2–27). Always invoked once per page before it ships. Also invoked when running `pharma-seo-optimizer audit` to regenerate or fix existing schema.
---

# Pharma Schema Markup Generator

Writes schema to `packages/lib/schema/` as typed helpers, then ensures each page imports the correct helper in its `<head>` via Next.js `generateMetadata` or a client-side `<script type="application/ld+json">`.

## Core entity — single source of truth

`Organization` is the spine. Everything else references it via `@id` → `https://propharmex.com/#organization`.

```ts
{
  "@context": "https://schema.org",
  "@type": ["Organization", "MedicalOrganization"],
  "@id": "https://propharmex.com/#organization",
  "name": "Propharmex",
  "url": "https://propharmex.com",
  "logo": { "@type": "ImageObject", "url": "https://propharmex.com/brand/logo.svg" },
  "description": "Canadian DEL-licensed CDMO providing pharmaceutical development, analytical services, regulatory affairs, and 3PL distribution across Canada and India.",
  "foundingDate": "YYYY",
  "sameAs": ["https://www.linkedin.com/company/propharmex", "..."],
  "hasCredential": [
    { "@type": "EducationalOccupationalCredential", "name": "Health Canada Drug Establishment Licence", "credentialCategory": "license", "recognizedBy": { "@type": "GovernmentOrganization", "name": "Health Canada" } },
    { "@type": "EducationalOccupationalCredential", "name": "ISO 9001:2015", "recognizedBy": {...} },
    { "@type": "EducationalOccupationalCredential", "name": "WHO-GMP" }
  ],
  "location": [ { "@id": "#mississauga" }, { "@id": "#hyderabad" } ]
}
```

## Page-type → schema map

| Page | Schemas required |
|---|---|
| Homepage | Organization + WebSite + WebPage + ItemList (services) |
| `/why-propharmex` | WebPage + AboutPage + BreadcrumbList |
| `/about` | AboutPage + Organization (reuse) |
| `/about/leadership` | ItemList of Person, each linked to Organization |
| `/quality-compliance` | WebPage + Organization.hasCredential expanded |
| `/facilities/*` | LocalBusiness (per facility) with geo, openingHours, hasMap |
| `/services/*` (hub) | Service + ItemList (sub-services) + BreadcrumbList |
| `/services/*/[leaf]` | Service + FAQPage + BreadcrumbList + HowTo (for process sections) |
| `/services/regulatory-services/health-canada-del-licensing` | Service + GovernmentService + FAQPage + CredentialReference |
| `/industries/*` | WebPage + Audience + BreadcrumbList |
| `/case-studies/[slug]` | Article + ItemPage + Organization (author) |
| `/insights/[slug]` | Article (or TechArticle, NewsArticle, ScholarlyArticle as appropriate) + BreadcrumbList + Person (author) |
| `/insights/whitepapers/[slug]` | Article + DigitalDocument + DownloadAction |
| `/our-process` | WebPage + HowTo (6 steps) |
| `/contact` | ContactPage + Organization + LocalBusiness ×2 |
| `/ai-tools/*` | WebApplication + SoftwareApplication + Organization |

## Helpers emitted to `packages/lib/schema/`

- `organizationSchema.ts` — returns the Organization JSON
- `localBusinessSchema.ts(facility)` — Mississauga / Hyderabad
- `serviceSchema.ts(service)` — from a Sanity `service` doc
- `articleSchema.ts(insight)` — from a Sanity `insight` doc, picks NewsArticle/TechArticle/ScholarlyArticle by `articleType`
- `faqSchema.ts(faqs[])`
- `breadcrumbSchema.ts(trail[])`
- `personSchema.ts(person)` — from Sanity `person` doc
- `eventSchema.ts(event)` — for webinars
- `combineJsonLd(...)` — merges into a single `@graph` block for one `<script>` tag per page

All helpers: strongly typed from the Sanity schema output types, tested with Vitest, and validated against Schema.org in CI (use `schema-dts` package).

## Validation

- Every emit passes through Google's Rich Results URL (manual check post-deploy)
- In CI, validate with `schema-dts` type-check + `@types/schema-dts` conformance
- Fail the build if any required property is missing for a page type listed in the map above

## Pharma-specific best-practice overlays

- Use `MedicalOrganization` alongside `Organization` — enables richer AI-answer templates for medical queries
- For the DEL page, add `GovernmentService.serviceOperator` = Health Canada and `areaServed` = Canada
- For facility pages, include `isicV4` and `naics` codes for pharma manufacturing (NAICS 325412)
- Always include `sameAs` arrays pointing to LinkedIn, Crunchbase, and the Health Canada DEL public register entry
- Person schemas include `hasOccupation` with `occupationalCredential` for scientists

## Anti-patterns (will refuse)

- Duplicate `@id` values across pages
- JSON-LD claims that contradict visible page content (Google penalizes)
- `MedicalEntity` typed content making efficacy/safety claims (we are CDMO, not a drug sponsor)
- Inflated `aggregateRating` without a real review source

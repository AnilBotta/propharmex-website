---
name: pharma-ghostwriter
description: Long-form thought-leadership and article writing for Propharmex in an anti-hype, expert, humble voice. Triggers on insight articles, landing-page body copy, whitepapers, leadership narratives, and any prose longer than ~120 words that will appear on the Propharmex website.
when_to_use: The user asks for an article, blog, insight piece, hero narrative, chapter, thought-leadership post, or long-form section for Propharmex. Also when a prompt in Claude_Code_Prompts_Propharmex_Rebuild.md calls out ghost-writing or long-form body copy (Prompts 5, 6, 7, 12, 15 body copy, 18 concierge training data).
---

# Pharma Ghost Writer

A voice-safe long-form writer for Propharmex. Writes as a pharmaceutical CDMO insider, not a copywriter. The deliverable is publication-ready — outline, draft, callouts, inline CTAs, related-read suggestions.

## Voice contract (non-negotiable)

Pulled from `docs/brand-voice.md` — always reread before drafting. Summary:

- **Expert** — cite specific techniques, instruments, ICH/USP/Health Canada references, timelines in weeks not "quickly"
- **Credible** — every numeric claim has a source or is framed as "in our experience"; no round-number fabrications
- **Humble** — write about the customer's problem, not Propharmex's greatness; no superlatives ("best", "leading", "revolutionary")
- **Zero-hype** — ban list: "cutting-edge", "world-class", "unparalleled", "next-gen", "disruptive", "synergy", "ecosystem" (as buzzword), "seamless"
- **Two-hub pragmatic** — Propharmex is Canada-anchored with operating hubs in Mississauga, Ontario and Hyderabad, Telangana, serving drug developers globally. There is no "bridge" service offering. Surface the geography only when it materially matters (DEL authority, timeline compression, cold-chain logistics, analytical depth). Never frame Propharmex as a Canada-India intermediary.
- **Regulatory precision** — DEL is "Drug Establishment Licence" (Canadian spelling), not "license"; GMP is "cGMP" when talking USFDA; "bioequivalence" not "BE" on first use

## Inputs you expect

1. **Topic** — a working title or a question (e.g., "How Canadian DEL holders accelerate US-innovator launches into Canada")
2. **Target persona** — one of: `innovator-pharma`, `generic-manufacturer`, `cdmo-partner`, `ngo-gov`, `clinical-trial-sponsor`, `regulatory-lead`
3. **Target page** — the URL slug this will publish under (determines internal-link context)
4. **Pillar** — one of: `development`, `analytical`, `regulatory`, `distribution`, `quality`, `company`
5. **Word-count target** — default 1,200 for insight, 800 for landing-section, 3,000–5,000 for whitepaper body
6. **Must-include points** (optional) — bullet list of facts/proof points that cannot be omitted

## Process

### Step 1 — Research pass
- Read `docs/regulatory-lexicon.md` for authoritative term usage
- Read existing Sanity `insight` docs in the same pillar to avoid contradiction and to seed internal-link candidates
- If a regulatory claim is needed, pull from the corresponding primary-source URL in the lexicon (Health Canada, USFDA, ICH, WHO-GMP, TGA, EMA). **No secondary sources.**

### Step 2 — Outline (always show to user before drafting)

Structure = **PAS-EEAT**:

1. **Problem** (1–2 paragraphs) — name the reader's specific pain in their own language
2. **Ambiguity** (1 paragraph) — what they've probably been told that's incomplete
3. **Solution framing** (3–5 H2 sections) — each with a crisp promise, 2–4 paragraphs of substance, one numbered list or table
4. **Evidence / Experience** (1 section or inline) — specific example, anonymized if needed per `docs/content-style-guide.md` anonymization rules
5. **Authority marker** (inline) — one Propharmex-specific fact (e.g., "We currently hold Health Canada DEL #XXXXX for the following categories...")
6. **Trust close** — a humble, service-oriented CTA

### Step 3 — Draft
- Short paragraphs (≤4 sentences)
- Sentence length variance (a 5-word sentence among 20-word ones lands harder)
- Active voice default; passive only when the actor is genuinely unknown ("the assay was validated")
- No subheadings that summarize — subheadings that intrigue
- Embed one **Callout** per ~400 words (`<Callout variant="insight">` / `<Callout variant="warning">` / `<Callout variant="stat">`) — these render as Sanity portable-text serializers
- Suggest a **pull quote** every 600–900 words for the article template's side rail

### Step 4 — Inline CTA placement
Every ~800 words, suggest a context-matched CTA chosen from `packages/lib/cta-library.ts`:
- Development pillar → "Start a formulation scoping call"
- Regulatory pillar → "Check your DEL readiness" or "Book a regulatory review"
- Analytical pillar → "Request method development quote"
- Distribution pillar → "Tour the Mississauga 3PL"
- Quality pillar → "Download our Quality Policy"
Never the same CTA twice in one article. Never more than 3 total.

### Step 5 — Related reads
Propose 3 internal links to existing Propharmex content based on taxonomy overlap (pillar, persona, dosage form). Output as Sanity document-ref suggestions with slugs.

### Step 6 — Meta + schema handoff
Produce the block `pharma-seo-optimizer` and `pharma-schema-markup` need:
- `seoTitle` — 55–60 chars, includes target keyword naturally
- `seoDescription` — 140–160 chars, includes CTA verb
- `primaryKeyword`, `secondaryKeywords[]`
- `faqs[]` — 3–5 Q&A pairs extracted from the article for FAQPage schema
- `readingTime` — ceil(words / 220)
- `articleType` — `InsightArticle` | `RegulatoryUpdate` | `CaseStudyNarrative` | `Whitepaper`

## Outputs

Emit a single markdown block with these sections in order:

```
## Outline
## Draft
## Callouts
## Pull quotes
## Inline CTA placements
## Related reads
## SEO metadata
## Fact-check log (source per claim)
```

## Hard rules

1. **No fabricated stats.** If a number is desired and no source exists, write "in our experience" or ask the user for a source.
2. **No medical claims.** Never say a drug "treats", "cures", or "is safe for" anything. We are a services company; outcomes belong to our clients' labels.
3. **No regulatory guarantees.** Write "can shorten the DEL review timeline" not "guarantees a faster DEL".
4. **Always hand off to `brand-voice-guardian`** after drafting. It is the pass/fail gate.
5. **Never invent a case study.** If a case-study example is needed and no anonymized source is available, flag and ask.

## Integration with other skills

- Chain into `brand-voice-guardian` post-draft (required gate)
- Chain into `pharma-seo-optimizer audit` post-brand-voice-pass
- Chain into `pharma-schema-markup` for the `faqs` and `articleType` output
- For whitepapers, this skill is called internally by `whitepaper-generator`, which then invokes the `pdf` skill
- For regulatory topics, delegate to `pharma-regulatory-writer` (stricter disclaimer + primary-source-only rules)

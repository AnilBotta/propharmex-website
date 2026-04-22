---
name: pharma-seo-optimizer
description: SEO + GEO (AI-citation) optimization tuned for pharma/biotech/CDMO vertical. Provides keyword research, on-page audit, competitor gap analysis, content refresh, and AI-citability scoring. Optimizes for both Google SERP and AI answer engines (ChatGPT, Claude, Perplexity, Gemini).
when_to_use: Any of — planning a new page or article, auditing an already-built page, building the content calendar (Prompt 23), generating JSON-LD metadata, refreshing stale insights, or when the user says "rank", "SEO", "keyword", "meta", "OG", "schema", "AI citation", "Perplexity", "GEO", or asks why a competitor is outranking us.
---

# Pharma SEO + GEO Optimizer

Five subcommands. Each is invoked by name. Output is always Markdown + a JSON block ready to paste into Sanity.

Frameworks used:
- **CORE-EEAT** — Credibility, Originality, Relevance, Expertise, Experience, Authoritativeness, Trustworthiness (Google E-E-A-T + modern ranking signals)
- **CITE** — Citability (can AI quote it), Identifiability (schema + entities), Timeliness (freshness + version), Evidence (primary sources)
- Pharma vertical augmentation: regulatory-body entity mapping (Health Canada, USFDA, WHO, ICH, TGA, EMA, PMDA) + YMYL-safety guardrails

## Subcommand 1 — `keyword <target page or topic>`

Produce a keyword cluster for a target page:

- **Pillar keyword** (1) — broad, high-volume, informational intent
- **Head keywords** (3–5) — exact match to the page's job-to-be-done
- **Body keywords** (8–15) — semantic variations, long-tail
- **Question keywords** (5–10) — "how to", "what is", "is X required" — these become FAQ and H2s
- **Comparison keywords** (3–5) — vs. competitor, vs. alternative technique
- **Regulatory-entity keywords** — "Health Canada DEL", "ICH Q1A(R2)", "cGMP 21 CFR 211", etc. — prime both SERP and AI citation

For each, output: `keyword`, `intent` (info|nav|trans|commerc|compar), `estimated_difficulty` (L/M/H), `estimated_monthly_volume` (range), `cluster_parent`, `recommended_h_level` (H1/H2/H3), `cite_value_for_ai` (1–5).

If DataForSEO or Firecrawl MCPs are later added, automate volumes; until then, output estimates with "source: heuristic — confirm via tool when available".

## Subcommand 2 — `audit <page-slug or URL>`

125-item scored audit. Groups:

- **On-page** (30 items) — title, H1, meta description, URL, canonical, OG, Twitter, H structure, internal links (count + distribution), outbound links, image alt, LCP image priority, reading level (Flesch), primary keyword density (0.8–2.2%), secondary keyword coverage, entity coverage
- **Content quality (CORE-EEAT)** (30 items) — originality check vs. top-10 SERP, author bio present, primary-source citations, data-age, claims with evidence, YMYL disclaimers for medical/regulatory content, Propharmex-specific experience signals
- **Technical** (25 items) — indexability, robots, sitemap inclusion, canonical resolution, hreflang (if region-personalized), structured data validation, CWV (LCP/CLS/INP), mobile-friendly, HTTPS, no-soft-404
- **Schema (CITE)** (20 items) — Organization, LocalBusiness, Service, Article, FAQPage, BreadcrumbList, Person, MedicalOrganization, Event — each: present? valid? enriched?
- **GEO / AI-citation** (20 items) — citable statements (short, factual, quote-bait), entity clarity ("Propharmex, a Canadian DEL-licensed CDMO headquartered in Mississauga, Ontario, with..."), schema.org coverage, sameAs linking, llms.txt presence, answer-first paragraphs, explicit "as of [date]" timestamps, primary-source proximity, dual-optimization headers (question + direct answer in first sentence)

Output: per-item pass/fail/partial + a prioritized top-10 fix list with estimated impact (High/Med/Low) and effort (S/M/L).

## Subcommand 3 — `gap <competitor-domain>`

Competitor set for Propharmex: `vertexpharma.com`, `mabwell.com`, `wuxiapptec.com`, `lonza.com`, `patheon.com`, `catalent.com`, `piramal.com`, `sainor.com` (India peers), and any URL the user supplies.

For the given competitor:
- Topics they rank for that Propharmex doesn't cover
- Page types they have that we don't (e.g., `/scientific-publications`, `/clinical-capabilities`, `/investor-relations`)
- Schema coverage they have that we lack
- Citation patterns in AI-answers (does Perplexity cite them for queries where we should be cited?)
- Their anchor-text + internal-link strategy on the closest equivalent to our target page

Output: a gap matrix + top-5 opportunity topics ranked by fit × volume.

## Subcommand 4 — `refresh <page-slug>`

Reverse-chronological freshness audit. Flags:
- Data older than 18 months without "as of" framing
- Regulatory references to superseded guidance (checks `docs/regulatory-lexicon.md` for current versions)
- Broken outbound links
- SERP drift (if rank-tracking data exists, compare snapshot)
- Thin content relative to current top-5 average word count
- Missing or outdated FAQ section
- Schema drift (new schema.org types available)

Output: a refresh brief — what to change, what to keep, what to archive.

## Subcommand 5 — `geo-check <page-slug>`

GEO-only micro-audit focused on AI citability:
- Is there a single-sentence answer to the H1's implied question in the first 60 words? (yes/no)
- Does the page state the entity ("Propharmex") with a short descriptor on first mention?
- Are numeric claims bracketed with "as of" and attributed?
- Is there a `<cite>` or schema `sameAs` to the primary source?
- Is llms.txt reachable and does it include this page?
- Does the page include an FAQPage block?
- Do the H2s read as questions (AI engines quote question-answer pairs preferentially)?

Score 0–100. Output remediation steps.

## Global rules

- Never recommend keyword stuffing. Density cap 2.2%.
- Never recommend cloaking, doorway pages, or anything violating Google's SpamPolicies.
- Never recommend an AI-content flag ("this was written by AI"); instead strengthen E-E-A-T signals.
- For YMYL content (medical, regulatory), recommend author-bio + credential + last-reviewed date + primary-source links.
- Always chain into `pharma-schema-markup` for any schema output.
- Always hand off to `brand-voice-guardian` before publishing rewrite suggestions.

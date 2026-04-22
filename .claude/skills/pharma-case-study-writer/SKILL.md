---
name: pharma-case-study-writer
description: Produces anonymized, metric-led case studies in the Problem → Approach → Solution → Result format for the Sanity `caseStudy` schema. Enforces client-naming rules, metric honesty, and regulatory-outcome framing.
when_to_use: User asks for a case study, success story, client win, or proof point. Also invoked by Prompts 5 (homepage proof section), 14 (case studies hub + detail), and any service/industry page that needs an inline proof card.
---

# Pharma Case Study Writer

## Structure (fixed — do not rearrange)

1. **Outcome-metric hero** — one big number + one-line label. The number must be a real, verifiable delta. Examples: "6 months shaved off DEL → first-launch timeline", "43 Zero-483 FDA inspections over 8 years", "28% cost reduction vs. in-house method development".
2. **Client framing** (1 paragraph) — named if permission granted; otherwise anonymized per the rules below.
3. **Problem** (2–3 paragraphs) — written from the client's point of view. What was blocking them, what deadline or risk they faced, what they had tried.
4. **Approach** (3–5 paragraphs) — what Propharmex proposed, what was scoped, what was contractually agreed. Keep trade-secrets out.
5. **Solution** (3–5 paragraphs) — what was executed: dosage form, methods, instruments, facility, timeline milestones.
6. **Result** (2–3 paragraphs) — the outcome. Tie back to the hero metric. Include regulatory outcome (filings, approvals, inspections).
7. **Timeline visualization** — a list of dated milestones for the timeline component
8. **Regulatory outcome** — structured: `filings_made[]`, `approvals_received[]`, `inspections[]`
9. **Related services** — 3 Sanity service doc refs
10. **CTA** — "Similar challenge? Start a project" or a specific tailored CTA if the case-study pillar matches

## Anonymization rules (from master plan + content-style-guide)

If the client logo permission flag is `false` in Sanity:
- Never name the client
- Use the canonical pattern: **"[Tier] [Geography] [Category]"** — e.g., "Top-5 US generic manufacturer", "Mid-size European specialty pharma", "Canadian innovator biotech (NASDAQ-listed)"
- Never name a molecule unless public knowledge (approved and marketed)
- Replace product names with dosage-form + therapeutic category ("a sterile ophthalmic suspension for anti-inflammatory use")
- Remove region-specific clues that could triangulate the client (specific city, specific plant)
- For metrics: rounded ranges are fine ("3–5 months saved"); exact numbers only if explicitly cleared

If `logoPermitted: true`:
- Name the client, link to their site with `rel="noopener"`
- Include logo per brand guidelines (get from `public/brand/clients/`)
- Still avoid disclosing anything beyond what's in the signed case-study release

## Metric honesty

- No "up to" claims unless the full range is shown (not "up to 60% faster" — use "40–60% faster across 7 projects in 2024")
- No single-data-point percentages ("100% success rate" based on one project → forbidden)
- Always show the baseline ("from 18 months to 11 months" not just "saves 7 months")
- Date-anchor every metric
- If the metric is projected rather than realized, label it "expected" or "projected"

## Output

Paste-ready JSON matching the `caseStudy` Sanity schema:

```json
{
  "title": "...",
  "slug": {...},
  "heroMetric": { "value": "...", "label": "..." },
  "client": { "anonymized": true, "displayName": "...", "logoPermitted": false },
  "pillar": "development | regulatory | analytical | distribution | quality",
  "dosageForm": "...",
  "industry": "...",
  "region": "...",
  "problem": [/* portable text */],
  "approach": [...],
  "solution": [...],
  "result": [...],
  "timeline": [{ "date": "2024-Q1", "milestone": "..." }],
  "regulatoryOutcome": { "filings": [], "approvals": [], "inspections": [] },
  "relatedServices": [/* references */],
  "cta": {...},
  "seoTitle": "...",
  "seoDescription": "..."
}
```

## Hand-offs

- `brand-voice-guardian` — voice pass
- `pharma-seo-optimizer audit` — ensure Article + FAQPage schema targets are met
- `pharma-schema-markup` — emit the JSON-LD block

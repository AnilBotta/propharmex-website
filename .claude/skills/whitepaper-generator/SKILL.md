---
name: whitepaper-generator
description: Orchestrates pharma-ghostwriter + pdf skill to produce gated lead-magnet whitepapers — 8-12 page branded PDFs with cover, executive summary, body, figures, and CTA. Publishes the PDF to /downloads/ and creates the matching Sanity whitepaper doc.
when_to_use: User asks for a whitepaper, lead magnet, long-form PDF, executive guide, playbook, or regulatory explainer deliverable. Also invoked by Prompt 15 (whitepapers pipeline) and Prompt 6 (two-hub operating-model playbook — final title TBD at Prompt 15).
---

# Whitepaper Generator

An orchestrator. Does not write prose itself — delegates to `pharma-ghostwriter` or `pharma-regulatory-writer` then binds via the `pdf` skill.

## Inputs

1. Topic
2. Target persona
3. Pillar
4. Length (8–12 pages)
5. Whether the topic is regulatory (routes through `pharma-regulatory-writer`) or not (routes through `pharma-ghostwriter`)
6. Cover imagery direction (optional — routes to `Image Prompt Engineer` subagent)

## Process

1. Call the appropriate writer skill with `word_count = length_pages × 300`
2. Collect the returned outline, draft, callouts, pull quotes, SEO metadata, and (if regulatory) primary-source list
3. Build the whitepaper structure:
   - **Cover** — Propharmex logo, title, subtitle, publication date, author(s), cover image
   - **Executive summary** (1 page) — 5 bullet takeaways + one-line thesis
   - **Body** (6–10 pages) — from the draft, with section breaks every 600 words
   - **Figures slots** — insert `<Figure caption="..." />` placeholders every 800 words; ask the Image Prompt Engineer to generate matching diagrams if requested
   - **Call-to-action page** (1 page) — "Talk to our [relevant team]" + Cal.com link + "Related services" + signed "authored by" block
   - **Sources page** (regulatory only) — primary sources list from `pharma-regulatory-writer`
   - **Disclaimer page** (regulatory only)
4. Invoke the `pdf` skill with:
   - Branded template (Manrope display + Inter Tight body + Deep Teal #0E4C5A headers + Warm Amber #C99A4B accents per the design tokens)
   - Cover spread layout
   - Page numbering (skip cover)
   - Footer with "propharmex.com/whitepapers/[slug]" + page number
5. Save to `apps/web/public/downloads/whitepapers/<slug>.pdf`
6. Create matching Sanity `whitepaper` doc via `sanity-schema-builder` with:
   - `title`, `slug`, `summary` (the exec-summary bullets), `cover` (upload the PDF cover as PNG), `file` (ref to the PDF), `gated: true`, `formFields: ['email','company','role']`
7. Emit the gated download form config for the frontend:
   - Double opt-in via Resend
   - On submit → Sanity `lead` doc + PostHog event + email the PDF link (signed, 7-day expiry)

## Outputs

- `public/downloads/whitepapers/<slug>.pdf`
- A JSON blob ready to `sanity-cli import` for the whitepaper doc
- A markdown summary for the user confirming delivery

## Branded template defaults

- **Cover**: full-bleed accent gradient (Deep Teal → Slate 900), white typography, Propharmex wordmark bottom-left, issue number top-right
- **Body font**: Inter Tight 10/16 (pt/leading)
- **Display font**: Manrope 28/34 for H1, 18/24 for H2
- **Margin**: 18mm sides, 22mm top, 22mm bottom
- **Color accents**: amber for pull quotes, teal for section dividers
- **Footer** on every body page: page number + wordmark + URL

## Quality gate

Before output:
- Word count within ±15% of target
- All figures have captions
- Regulatory disclaimer present if regulatory
- No broken cross-references
- Passes `brand-voice-guardian`
- Passes a final read-aloud sanity check (skill prompts itself to summarize each page in 1 sentence — if any page summary is "contains filler", reject and rewrite that section)

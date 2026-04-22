# Propharmex Content Style Guide

## Headlines

- Max 68 characters for SEO title (60 rendered in SERP)
- Max 12 words for hero H1
- Lead with benefit or specific noun, not the brand
- No colons unless they're doing real work ("DEL Readiness: A Practical Checklist" is ok; "DEL: Our Approach" is lazy)
- Title case for H1, sentence case for H2/H3 (consistent with Tailwind Typography defaults)

## CTA microcopy library

Never invent a new CTA — pick from this library and let `design:ux-copy` tune the label.

| Context | Primary CTA | Secondary CTA |
|---|---|---|
| Home hero | Start a project | Explore capabilities |
| Development pages | Scope a formulation project | See dosage-form capabilities |
| Analytical pages | Request a method quote | See instrument inventory |
| Regulatory pages | Check DEL readiness | Book a regulatory review |
| Distribution pages | Tour the Mississauga 3PL | See cold-chain specs |
| Quality page | Download our Quality Policy | View certifications |
| Case study | Start a similar project | See related services |
| Insight article | Talk to a scientist | Read related |
| AI tool landing | Launch the tool | See a sample output |

Rules:
- Verb-first, 2–5 words
- Never "Learn more", "Click here", "Submit", "Contact us" (all banned — too vague)
- Secondary CTA is always a softer commitment

## Anonymization rules

If `caseStudy.client.logoPermitted === false` in Sanity:

- **Never name the client.** Use the pattern: *"[Tier] [Geography] [Category]"*
  - Top-5 US generic manufacturer
  - Mid-size European specialty pharma
  - Canadian innovator biotech (NASDAQ-listed)
  - Global NGO procurement agency
- **Never name the molecule** unless it is already approved and marketed publicly
- **Replace product names** with dosage-form + therapeutic-area: "a sterile ophthalmic suspension for anti-inflammatory use"
- **Remove region-specific triangulation clues** — no "our client in Somerset, NJ"
- **Round metrics into ranges**: "3–5 months saved", not "4.2 months"
- **No pre-approval timelines** that would be interpreted as a regulatory commitment

## Quoting and citations

- Primary-source URLs only for regulatory claims. See `docs/regulatory-lexicon.md` for the canonical URL list per body.
- Inline links preferred over footnotes for web content
- Whitepapers use footnotes (numbered) + a final Sources page
- External sites always `rel="noopener"` and never `target="_blank"` on mobile (open in same tab)
- Quoting a person: quote exactly, attribute with full name + role + date. Permission required; track in Sanity `testimonial.permissionGranted`.

## Numbers and dates

- Percentages: numeral + % — "43%"
- Under 10 in body prose: spell out ("seven facilities") — except in tables, callouts, headlines
- Date format: `YYYY-MM-DD` for machine-readable, `3 April 2026` for human prose (Canadian/British form)
- Always anchor claims with "as of [date]" when the claim could drift
- Never use "up to X" without showing the full range

## Images, alt text, captions

- Every image has alt text that describes the information, not the decoration ("HPLC system in Mississauga QC lab" not "laboratory equipment")
- Captions are sentences, not labels ("Our Hyderabad formulation lab runs 24/7 to support Canadian development timelines" ✓; "Hyderabad lab" ✗)
- Portraits of leaders: first + last name + role, and `Person` schema must match
- No stock photos on trust pages (Quality, Facilities, Leadership) — use real Propharmex photography; if unavailable, flag and ask

## Code and spec conventions in copy

- Instrument names in running text: not code-formatted ("HPLC")
- Regulation citations in running text: bold-caps on first use only ("**21 CFR 211.22(d)**")
- File types (PDF, DOCX): small caps via CSS class (`.docFormat`), not ALL CAPS in source

## Inclusivity

- Use "they" as a default singular when role/gender unknown
- Avoid "Westernized" framings of regulatory maturity — Canada, India, US, EU all get equal respect
- Accessibility language: say "people with disabilities", not "the disabled"

## AI-assisted content disclosure

- AI-tool outputs carry the mandatory disclaimer (see `brand-voice-guardian`)
- Insight articles drafted with AI assistance do NOT need a disclosure beyond our standard "Authored by [human name]" — the voice gate ensures human review; we don't call out the drafting tool
- If AI-generated imagery is used (cover art, etc.), caption it as such: "Illustration generated with AI tooling"

## Approval workflow

1. Writer skill drafts
2. `brand-voice-guardian` gates
3. `pharma-seo-optimizer audit` tunes metadata
4. Human review in Sanity draft mode
5. Publish sets `publishedAt`; RAG webhook re-ingests

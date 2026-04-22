# Whitepaper brief seed — placeholder

**Draft brief only.** Full 8–12 page PDF is generated in Prompt 6 via the `whitepaper-generator` skill. This file is the input to that orchestration.

---

## Working title

**"The Canada–India bridge: a CDMO partnership model for regulated-market sponsors"**

## One-line positioning

A field guide for innovator and generic sponsors evaluating split-geography CDMO partnerships that combine Canadian regulatory rigor with Indian manufacturing scale.

## Target personas (ranked)

1. **VP / Head of CMC** at a mid-size US or EU innovator planning Canadian + US + EU launches
2. **VP / Head of Manufacturing** at a US generic manufacturer consolidating CDMO footprint
3. **Director of Regulatory Affairs** evaluating Health Canada DEL pathway for the first time
4. **Procurement lead / WHO prequalification sponsor** at an NGO or donor-funded program

## Commercial intent

Gated lead magnet. Download requires name + work email + company + role. Email capture goes to Resend audience `whitepaper-canada-india-bridge` and triggers a 3-email nurture (day 0 / day 3 / day 10) that ends in a Cal.com 15-minute discovery invitation.

## Suggested outline (8–12 pages)

1. **Executive summary** (1 page)
2. **Why this model, and why now** (1 page) — post-2022 supply-chain realignment, Health Canada's DEL trust signal, Indian manufacturing cost + scale maturity
3. **The Canada side: DEL, QP release, and regulator relationships** (1.5 pages)
4. **The India side: WHO-GMP, cost structures, analytical depth** (1.5 pages)
5. **How a split-geography engagement actually operates** (2 pages) — day-in-the-life workflows, data flow, batch record chain-of-custody, QP release path
6. **Regulatory framings by target market** (US FDA / Health Canada / EMA / TGA / WHO PQ) (1.5 pages)
7. **Risk + governance** (1 page) — data integrity, audit cadence, SLA structure
8. **Three anonymized vignettes** (1 page)
9. **Decision framework + checklist** (1 page)
10. **About Propharmex + CTA** (0.5 page)

## Source inputs to pre-load

- `docs/regulatory-lexicon.md` for term consistency
- Health Canada GUI-0002 current revision (fetch at time of authoring)
- ICH Q7, Q9, Q10 primary sources
- WHO TRS 1010 Annex 10 (stability)
- Propharmex internal case files (3 anonymized composites)

## Tone + voice

- Audience: technical regulatory + CMC + manufacturing leaders
- Reading level: assumes comfort with cGMP, ICH, CTD Module 3 terminology
- Voice rules: `docs/brand-voice.md` — expert, credible, humble, anti-hype
- Every regulatory claim cites a primary source with "as of [date]" stamp

## Visuals

- Cover: Propharmex wordmark + subtitle + single map motif (Toronto–Hyderabad line)
- Section headers: thin geometric rules
- Data: 2 comparison tables, 1 workflow diagram, 1 decision tree
- Monochrome + single accent — prints cleanly B&W

## Distribution channels

- `/whitepapers/canada-india-bridge` landing page
- Email nurture (Resend)
- Enterprise outbound sequences (Apollo MCP)
- Conference giveaway asset (PDAC, AAPS, CPhI)

---

## Replacement / next step

Prompt 6 picks up this brief and invokes:
- `pharma-ghostwriter` for body copy
- `pharma-regulatory-writer` (strict mode) for any regulatory claim
- `pdf` skill for PDF rendering
- `brand-voice-guardian` for final PASS
- `pharma-case-study-writer` for the three vignettes (pulled from `/content-seed/case-studies/`)

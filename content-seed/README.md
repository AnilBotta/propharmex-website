# Content seed

**PLACEHOLDER CONTENT — replace with real content before launch.**

This folder holds drafts that Prompt 4 (`sanity-schema-builder` + ingest) will load into Sanity as seed data. Nothing here is meant to go live as-is. Every stub was drafted through the project skills (`pharma-ghostwriter`, `pharma-case-study-writer`, `pharma-seo-optimizer`, `whitepaper-generator`) and passed the `brand-voice-guardian` conformance check at the time of writing.

## Folders

- `leaders/` — 3 leadership card stubs (name placeholder, title, 2-sentence bio)
- `case-studies/` — 3 anonymized case-study stubs in Problem → Approach → Solution → Result format
- `insights/` — 10 article seed titles + 1-line hooks, mapped to pillar-cluster SEO model
- `whitepaper-briefs.md` — 1 whitepaper topic brief (PDF generated in Prompt 6)

## Replacement workflow

1. Collect real content from stakeholders (leader bios, approved case studies, editorial calendar).
2. Run each through the matching project skill (`pharma-case-study-writer` for case studies, `pharma-ghostwriter` for articles, etc.).
3. `brand-voice-guardian` must return PASS (or PASS_WITH_EDITS applied).
4. For regulatory claims, `pharma-regulatory-writer` in strict mode enforces primary-source citations.
5. Push to Sanity via the ingest helper that Prompt 4 builds.

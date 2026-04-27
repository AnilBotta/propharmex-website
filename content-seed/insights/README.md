# Insights seed — 10 article titles

Pillar/cluster model from `docs/seo-playbook.md`. Each title is mapped to a **pillar** (Health Canada DEL, analytical services, CDMO strategy, formulation, global market entry) and a **primary keyword cluster**. Hooks are 1 line — full outlines drafted via `pharma-ghostwriter` + `pharma-seo-optimizer` at Prompt 15.

All titles below are **placeholders** chosen to exercise the schema and layout. Replace with the real editorial calendar before publication.

---

## Pillar 1 — Health Canada DEL

1. **"The Drug Establishment Licence at a glance: what every foreign sponsor should know before filing"**
   Hook: Primer that unpacks GUI-0002 in plain language and flags the three most common DEL application errors.
   Primary keyword: `drug establishment licence canada`

2. **"DEL vs. US FDA establishment registration: what's the same, what isn't, and where the timelines diverge"**
   Hook: Side-by-side comparison for US-based sponsors planning Canadian market entry.
   Primary keyword: `del vs fda establishment registration`

3. **"Inspection readiness for a first DEL application: a Canadian-perspective checklist"**
   Hook: What Health Canada inspectors actually look for during a pre-licence inspection.
   Primary keyword: `health canada gmp inspection preparation`

## Pillar 2 — Analytical services

4. **"ICH Q2(R2) and what it changed for method validation in 2024"**
   Hook: Practical walkthrough of the revision's impact on validation packages already in flight.
   Primary keyword: `ich q2 r2 method validation`

5. **"Nitrosamine testing in 2025: risk assessments, LOQ expectations, and regulator feedback"**
   Hook: What current regulator feedback tells us about acceptable risk assessments and test strategy.
   Primary keyword: `nitrosamine impurity testing`

## Pillar 3 — CDMO strategy

6. **"When to consolidate your CDMO footprint (and when not to)"**
   Hook: Decision framework for moving from 4+ outsourced partners to a tier-1 + backup model.
   Primary keyword: `cdmo consolidation strategy`

7. **"Inside our operating model: how a Canadian DEL site and an Indian development centre operate under one quality system"**
   Hook: How a Canadian-anchored CDMO operating model actually functions day-to-day for global sponsors.
   Primary keyword: `canadian cdmo operating model`

## Pillar 4 — Formulation & dosage forms

8. **"Oral solid to oral liquid conversion: when reformulation is worth the regulatory cost"**
   Hook: Clinical signals, commercial drivers, and CMC workload reality.
   Primary keyword: `oral solid to liquid reformulation`

## Pillar 5 — Global market entry

9. **"Tropical-zone stability for WHO procurement: Climatic Zone IVb programs without surprises"**
   Hook: Design considerations that separate first-pass WHO PQ submissions from round-two rewrites.
   Primary keyword: `climatic zone ivb stability`

10. **"Entering the EU and Australia in parallel: a dossier-reuse playbook"**
    Hook: Where EMA and TGA dossier requirements diverge and where the same work buys both.
    Primary keyword: `ema tga parallel submission`

---

## Voice + compliance checks

All 10 titles pass the current gates:
- ✓ No clickbait
- ✓ No hype vocabulary ("ultimate guide", "secrets", "you won't believe")
- ✓ Regulatory terms correctly cased per `docs/regulatory-lexicon.md`
- ✓ No promises of outcomes or approvals
- ✓ Every title maps to an identifiable buyer-persona question

## Replacement workflow

Prompt 15 will:
1. Validate each title against current SERP + AI-answer landscape (`pharma-seo-optimizer gap`)
2. Generate full outlines via `pharma-ghostwriter`
3. Run `pharma-regulatory-writer` strict mode on regulatory claims
4. `brand-voice-guardian` PASS before publish

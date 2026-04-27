# Regulatory Lexicon

Authoritative reference for every regulatory term, body, guideline, and URL used anywhere on the Propharmex site. Consulted by `pharma-regulatory-writer`, `brand-voice-guardian`, and the AI Concierge's system prompt. **Review and resign quarterly** — regulatory drift is real.

*Last reviewed: 2026-04-23*

---

## Regulatory bodies

| Body | Canonical name | Short form | Primary-source root |
|---|---|---|---|
| Canada | Health Canada — Health Products and Food Branch | Health Canada | `https://www.canada.ca/en/health-canada/services/drugs-health-products.html` |
| USA | U.S. Food and Drug Administration | USFDA (or FDA) | `https://www.fda.gov/drugs` |
| International council | International Council for Harmonisation | ICH | `https://www.ich.org/page/quality-guidelines` |
| WHO | World Health Organization — Prequalification | WHO-PQ | `https://extranet.who.int/prequal/` |
| Australia | Therapeutic Goods Administration | TGA | `https://www.tga.gov.au/` |
| EU | European Medicines Agency | EMA | `https://www.ema.europa.eu/` |
| Japan | Pharmaceuticals and Medical Devices Agency | PMDA | `https://www.pmda.go.jp/english/` |
| India | Central Drugs Standard Control Organisation | CDSCO | `https://cdsco.gov.in/` |

Use the short form in body prose after first full-name use. Always capitalize exactly as shown.

---

## Claim-status convention (three-tier)

Introduced in Prompt 8 (`apps/web/content/quality.ts`) and binding for every cert, licence, audit outcome, or framework reference published anywhere on the site. The UI must visually disambiguate the three tiers. **Writers and reviewers must not promote a claim to a higher tier without the primary-source evidence that tier requires.**

| Status | Meaning | Evidence required | UI treatment |
|---|---|---|---|
| `confirmed` | Propharmex holds the licence / certification, and a primary-source record exists on a regulator register | Direct link to the primary-source register entry (e.g., Health Canada Drug Product Database for a DEL) **plus** internal document reference ID | "Held · verifiable" badge, primary-source link rendered inline |
| `under-confirmation` | Propharmex holds or is pursuing the credential, but the primary-source trail is not yet published on the marketing site — typically because the client-confirmation pass has not completed | Internal document reference ID only; no external claim | "Documentation on request" affordance routing to `/contact?source=<page>-<credential-id>` |
| `alignment` | Propharmex operates its quality system **in alignment with** the framework but does not claim a certification under it | Public framework URL (ICH, WHO TRS, etc.) for education; no certification asserted | "Operating alignment" label with a link to the framework document |

Only `confirmed` items may use language like "certified", "licensed", "accredited", or "held". `under-confirmation` items use "documentation available on request" or similar. `alignment` items use "operates in alignment with" or "follows [framework] principles" — never "certified".

**Anchor rule:** the Health Canada DEL is the one claim that is always `confirmed` on this site. Every other status must be supported by a document that a reviewer can verify. If that document is missing, the tier must drop — not the reviewer's expectations.

---

## Canadian terms (critical for the DEL flagship page)

### Drug Establishment Licence (DEL)
- Spelling: **Licence** (Canadian). Never "license".
- Authority: Health Canada, under the *Food and Drug Regulations* Part C, Division 1A
- Authorizes: fabrication, packaging/labelling, testing, importation, distribution, and wholesaling of drugs in dosage-form categories and on product categories listed on the license
- **Does not** authorize: specific product market access — that's **Notice of Compliance (NOC)** under Division 8
- Public register: `https://health-products.canada.ca/dpd-bdpp/` and the DEL register
- Typical issuance timeline (as of 2026-04): Health Canada's published service standard is 250 calendar days for a new DEL from a complete application

### Notice of Compliance (NOC)
- Product-level market authorization
- Sponsors file a **New Drug Submission (NDS)** or **Abbreviated New Drug Submission (ANDS)** in eCTD format
- Post-approval changes governed by the *Post-NOC Changes* framework

### Drug Identification Number (DIN)
- Assigned per product/strength/dosage-form on approval

### Good Manufacturing Practices (Canadian)
- GUI-0001 is the canonical interpretation document: `https://www.canada.ca/en/health-canada/services/drugs-health-products/compliance-enforcement/good-manufacturing-practices/guidance-documents/gmp-guidelines-0001.html`

---

## USFDA terms

### Abbreviated New Drug Application (ANDA)
- Generic pathway, FDCA 505(j)
- eCTD mandatory
- Typical first-cycle review target: 10 months (CDER target); median actual review with CRLs: 30+ months

### Drug Master File (DMF)
- Type II typical for Propharmex: drug substances, intermediates, materials used in their preparation
- Not approved on its own — reviewed when referenced by an ANDA/NDA
- Establishment Registration + Drug Listing (FDA form 2657) required separately

### cGMP
- **c** stands for "current" — convention is `cGMP` on first US mention
- Governing regulations: 21 CFR Part 210 (general) + 21 CFR Part 211 (finished pharmaceuticals) + 21 CFR Part 212 (PET drugs) + 21 CFR Part 820 (devices, not applicable to our scope)
- Zero-483 outcome: an FDA inspection with no 483 observations issued

---

## ICH guidelines (always cite with version tag on first use)

| Code | Topic | Current version |
|---|---|---|
| Q1A(R2) | Stability Testing of New Drug Substances and Products | R2, 2003, amended 2024 |
| Q1B | Photostability Testing | 1996 |
| Q1C/D/E/F | Bracketing/matrixing, data evaluation, stability in zones | Various |
| Q2(R2) | Analytical Procedure Validation | R2, 2023 (superseded R1) |
| Q3A(R2)/B(R2)/C(R8) | Impurities | Current R values shown |
| Q6A/B | Specifications | Current |
| Q7 | GMP Guide for Active Pharmaceutical Ingredients | 2000 |
| Q8(R2)/Q9(R1)/Q10/Q11/Q12/Q13/Q14 | Pharmaceutical development, risk, QMS, substance dev, lifecycle, continuous mfg, analytical dev | Versions vary — check before citing |
| M4 (eCTD) | CTD structure, 5 modules | Current |

When citing, link to `https://www.ich.org/page/quality-guidelines` and the PDF on that page.

### The 5 eCTD modules (for explainer content)

1. Administrative information and prescribing information (region-specific)
2. Common technical document summaries
3. Quality (drug substance + product)
4. Nonclinical study reports
5. Clinical study reports

---

## WHO-GMP / prequalification

- WHO Technical Report Series (TRS) Annex 2 is the canonical GMP text
- WHO-PQ applicable for NGO and government procurement clients

---

## India-side operational terms (export and CDSCO)

- **CDSCO registration** for exports from India requires a valid manufacturing license in India + a drug registration certificate for the importing country
- **WHO-GMP certificate (India)** and **CoPP (Certificate of Pharmaceutical Product)** are the usual export credentials
- When content spans both jurisdictions, always specify which body governs which step — never merge.

---

## Dosage-form vocabulary (maps to Prompt 10 sub-pages)

| Canonical term | Synonyms used in queries | Canonical page |
|---|---|---|
| Solid oral dosage | tablets, capsules, ODT, caplets | `/services/pharmaceutical-development/solid-oral-dosage` |
| Liquid oral dosage | syrups, suspensions, oral solutions | `/services/pharmaceutical-development/liquid-oral-dosage` |
| Topical / semisolid | creams, gels, ointments, lotions | `/services/pharmaceutical-development/topical-semisolid` |
| Sterile injectables | parenterals, lyophilized, SVP, LVP | `/services/pharmaceutical-development/sterile-injectables` |
| Inhalation | MDI, DPI, nebulizers, nasal sprays | `/services/pharmaceutical-development/inhalation` |
| Ophthalmic | eye drops, ophthalmic suspensions, ointments | `/services/pharmaceutical-development/ophthalmic` |
| Transdermal / modified release | patches, extended-release, controlled release | `/services/pharmaceutical-development/transdermal-modified-release` |

---

## Disclaimer templates

### Standard regulatory disclaimer

> *This content is informational and reflects Propharmex's understanding of [body]'s published guidance as of [date]. It is not regulatory advice and does not guarantee any specific outcome. Consult [body] or a qualified regulatory professional for decisions affecting your filings.*

### AI-tool disclaimer

> *This output was generated by an AI assistant drawing on Propharmex's public documentation. It is informational only and not a regulatory guarantee. Contact our team for a review tailored to your specific filing.*

### DEL readiness report disclaimer

> *This readiness assessment is an informational self-check, not a regulatory guarantee. Actual DEL issuance depends on Health Canada's review of your complete application. Propharmex offers a professional DEL readiness consultation to supplement this assessment.*

---

## Review log

- 2026-04-20 — Initial seed from Master Build Plan + publicly available guidance. Verify all timelines and guidance version tags before publishing any content that cites them.
- 2026-04-23 — Added the three-tier claim-status convention (`confirmed` / `under-confirmation` / `alignment`) introduced by Prompt 8's `/quality-compliance` page. Every claim-bearing component across the site must map its badge and copy to one of these tiers.

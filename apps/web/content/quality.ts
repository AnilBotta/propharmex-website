/**
 * /quality-compliance content dictionary.
 *
 * Prompt 8 stand-in for what will become a Sanity `page{slug:"quality-compliance"}`
 * document plus a `certification` + `regulator` + `policyDocument` collection.
 * Every user-facing string is drafted via design:ux-copy and gated by
 * brand-voice-guardian (docs/brand-voice.md).
 *
 * Voice rules (CLAUDE.md §1 + docs/brand-voice.md): anti-hype, expert, humble,
 * regulatory-precise. Banned words: world-class, cutting-edge, seamless,
 * industry-leading, trusted partner.
 *
 * Stubbing policy (quickest-path, per Prompt 8 client call):
 *  - The Health Canada DEL is the ONLY hard cert claim. It is the site-wide
 *    positioning anchor per CLAUDE.md §1 and docs/brand-voice.md.
 *  - Every other certification is marked `status: "under-confirmation"` and
 *    rendered behind a "Documentation available on request" affordance.
 *    Framework-alignment rows (ICH Q2/Q10/Q1A) are marked `status: "alignment"`
 *    so the UI can disambiguate a cert from an operating-framework claim.
 *  - Audit outcomes are gated entirely behind a "shared under NDA" panel —
 *    we do NOT claim zero-483 or any inspection outcome on the marketing site
 *    until the regulatory lead has confirmed the exact language.
 *  - Policy-document downloads (Quality Policy, Data Integrity, SOP index)
 *    route to /contact?source=quality-docs-<id> rather than serving PDFs.
 *    PDFs will land in a follow-up once the VP Quality signs them off.
 *
 * YMYL compliance: no unsubstantiated regulatory claim appears on this page.
 * If a claim does not have a `source: {kind:"primary"}` citation OR is not the
 * DEL anchor, it MUST carry a stub marker and be gated behind a request form.
 */

/* -------------------------------------------------------------------------- */
/*  Primitives                                                                */
/* -------------------------------------------------------------------------- */

export type QualityCTA = {
  href: string;
  label: string;
  variant: "primary" | "secondary" | "ghost";
};

export type QualitySource =
  | { kind: "primary"; label: string; href: string }
  | { kind: "internal"; label: string };

export type QualityStatus =
  /** Held today. Only ever used for the Health Canada DEL anchor. */
  | "confirmed"
  /** Cert applied for / in scope / pending client confirmation. */
  | "under-confirmation"
  /** Operating framework — not a certificate, but a standard we work to. */
  | "alignment";

/* -------------------------------------------------------------------------- */
/*  1. Hero                                                                   */
/* -------------------------------------------------------------------------- */

export type QualityHero = {
  eyebrow: string;
  headline: string;
  lede: string;
  anchor: {
    value: string;
    label: string;
    source: QualitySource;
  };
  primaryCta: QualityCTA;
  secondaryCta: QualityCTA;
};

/* -------------------------------------------------------------------------- */
/*  2. Certification wall                                                     */
/* -------------------------------------------------------------------------- */

export type QualityCertification = {
  id: string;
  slug: string;
  /** Short display name, e.g. "Health Canada DEL". */
  title: string;
  /** Issuing body, e.g. "Health Canada". */
  issuer: string;
  /** One-sentence scope. */
  scope: string;
  /** Longer detail paragraph shown in the modal. */
  detail: string;
  /**
   * Confirmed DEL carries a primary-source link to the Health Canada register.
   * Everything else is `null` until documentation is released under NDA.
   */
  reference: QualitySource | null;
  status: QualityStatus;
  /** Applied-as-of / issued-as-of date, ISO-ish ("2019" OK), or null. */
  validity: string | null;
};

export type QualityCertificationWall = {
  eyebrow: string;
  heading: string;
  lede: string;
  /** Copy shown on every non-confirmed card. */
  stubNotice: string;
  requestAction: QualityCTA;
  items: QualityCertification[];
};

/* -------------------------------------------------------------------------- */
/*  3. QMS architecture                                                       */
/* -------------------------------------------------------------------------- */

export type QmsStage = {
  id: string;
  order: number;
  title: string;
  body: string;
  /** ICH / PIC-S / Health Canada reference for the stage. */
  reference: QualitySource;
};

export type QualityQms = {
  eyebrow: string;
  heading: string;
  lede: string;
  stages: QmsStage[];
};

/* -------------------------------------------------------------------------- */
/*  4. Regulatory bodies                                                      */
/* -------------------------------------------------------------------------- */

export type RegulatorScope =
  | "primary-regulator"
  | "inspection-scope"
  | "filing-scope"
  | "engagement-scope";

export type QualityRegulator = {
  id: string;
  /** Short agency label — "Health Canada", "USFDA", "EU EMA", etc. */
  label: string;
  jurisdiction: string;
  scope: RegulatorScope;
  body: string;
  reference: QualitySource;
};

export type QualityRegulators = {
  eyebrow: string;
  heading: string;
  lede: string;
  items: QualityRegulator[];
};

/* -------------------------------------------------------------------------- */
/*  5. Audit history                                                          */
/* -------------------------------------------------------------------------- */

export type QualityAudit = {
  eyebrow: string;
  heading: string;
  lede: string;
  /** Rendered as a bordered callout panel with the NDA gate. */
  ndaPanel: {
    heading: string;
    body: string;
    action: QualityCTA;
  };
  /** Educational reference strip — reader understands what 483/EIR mean. */
  primer: {
    label: string;
    body: string;
    reference: QualitySource;
  }[];
};

/* -------------------------------------------------------------------------- */
/*  6. DEL story teaser                                                       */
/* -------------------------------------------------------------------------- */

export type QualityDelTeaser = {
  eyebrow: string;
  heading: string;
  body: string;
  bullets: string[];
  anchor: {
    label: string;
    source: QualitySource;
  };
  cta: QualityCTA;
};

/* -------------------------------------------------------------------------- */
/*  7. Download centre                                                        */
/* -------------------------------------------------------------------------- */

export type QualityPolicyDoc = {
  id: string;
  title: string;
  body: string;
  /** Framework this doc aligns to, displayed as a small tag. */
  framework: string;
  action: QualityCTA;
};

export type QualityDownloads = {
  eyebrow: string;
  heading: string;
  lede: string;
  /** Stub notice for the whole section. */
  requestNotice: string;
  docs: QualityPolicyDoc[];
};

/* -------------------------------------------------------------------------- */
/*  Top-level                                                                 */
/* -------------------------------------------------------------------------- */

export type QualityContent = {
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  hero: QualityHero;
  certifications: QualityCertificationWall;
  qms: QualityQms;
  regulators: QualityRegulators;
  audit: QualityAudit;
  del: QualityDelTeaser;
  downloads: QualityDownloads;
};

/* -------------------------------------------------------------------------- */
/*  Content                                                                   */
/* -------------------------------------------------------------------------- */

const HEALTH_CANADA_DEL_REGISTER: QualitySource = {
  kind: "primary",
  label: "Health Canada — Drug and Health Product Register",
  href: "https://health-products.canada.ca/dpd-bdpp/",
};

const HEALTH_CANADA_GUI_0002: QualitySource = {
  kind: "primary",
  label: "Health Canada — Guidance on Drug Establishment Licences (GUI-0002)",
  href: "https://www.canada.ca/en/health-canada/services/drugs-health-products/compliance-enforcement/establishment-licences/directives-guidance-documents-policies.html",
};

const ICH_Q10: QualitySource = {
  kind: "primary",
  label: "ICH Q10 — Pharmaceutical Quality System",
  href: "https://www.ich.org/page/quality-guidelines",
};

const ICH_Q2R2: QualitySource = {
  kind: "primary",
  label: "ICH Q2(R2) — Validation of Analytical Procedures",
  href: "https://www.ich.org/page/quality-guidelines",
};

const ICH_Q1A: QualitySource = {
  kind: "primary",
  label: "ICH Q1A(R2) — Stability Testing of New Drug Substances and Products",
  href: "https://www.ich.org/page/quality-guidelines",
};

const ICH_Q9: QualitySource = {
  kind: "primary",
  label: "ICH Q9(R1) — Quality Risk Management",
  href: "https://www.ich.org/page/quality-guidelines",
};

const WHO_GMP: QualitySource = {
  kind: "primary",
  label:
    "WHO — Good Manufacturing Practices for pharmaceutical products: main principles",
  href: "https://www.who.int/teams/health-product-policy-and-standards/standards-and-specifications/norms-and-standards-for-pharmaceuticals/guidelines/production",
};

const USFDA_REGISTRATION: QualitySource = {
  kind: "primary",
  label: "USFDA — Drug Establishment Current Registration Site",
  href: "https://www.accessdata.fda.gov/scripts/cder/drls/default.cfm",
};

const USFDA_FORM_483: QualitySource = {
  kind: "primary",
  label: "USFDA — Form FDA 483 Frequently Asked Questions",
  href: "https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/inspection-references/frequently-asked-questions-about-form-fda-483",
};

const TGA_OVERSEAS_GMP: QualitySource = {
  kind: "primary",
  label:
    "Australian TGA — Overseas GMP clearance for overseas manufacturers",
  href: "https://www.tga.gov.au/resources/resource/guidance/overseas-gmp-clearance-overseas-manufacturers",
};

const EMA_GMP_GDP: QualitySource = {
  kind: "primary",
  label: "European Medicines Agency — Good Manufacturing Practice overview",
  href: "https://www.ema.europa.eu/en/human-regulatory-overview/research-development/compliance-research-development/good-manufacturing-practice",
};

const CDSCO_OVERVIEW: QualitySource = {
  kind: "primary",
  label: "CDSCO — Central Drugs Standard Control Organization",
  href: "https://cdsco.gov.in/opencms/opencms/en/Home/",
};

const WHO_GDP: QualitySource = {
  kind: "primary",
  label: "WHO — Good storage and distribution practices for medical products",
  href: "https://www.who.int/teams/health-product-policy-and-standards/standards-and-specifications/norms-and-standards-for-pharmaceuticals",
};

export const QUALITY: QualityContent = {
  metaTitle:
    "Quality & compliance — Propharmex Health Canada DEL, cGMP, and QMS posture",
  metaDescription:
    "The Propharmex quality system — Health Canada Drug Establishment Licence, ICH Q10 pharmaceutical quality management, cGMP framework alignment, and regulator-by-regulator capability. Documentation available on request.",
  ogTitle: "Quality & compliance — Propharmex",
  ogDescription:
    "DEL, cGMP, ICH Q10 — one quality manual across Mississauga and Hyderabad. Certificates and audit summaries available under NDA.",

  /* ---------- 1. Hero ---------------------------------------------------- */
  hero: {
    eyebrow: "Quality & compliance",
    headline:
      "Quality isn't a department. It's our operating system.",
    lede: "One quality manual, one CTMS, one change-control process across Mississauga and Hyderabad. The Health Canada Drug Establishment Licence is the anchor — every other activity on this page is framed around how we stay inspection-ready for it.",
    anchor: {
      value: "DEL",
      label:
        "Health Canada Drug Establishment Licence — Mississauga site, fabrication through wholesale scope",
      source: HEALTH_CANADA_DEL_REGISTER,
    },
    primaryCta: {
      href: "/contact?source=quality-documentation",
      label: "Request documentation",
      variant: "primary",
    },
    secondaryCta: {
      href: "#qms-architecture",
      label: "See how the QMS works",
      variant: "ghost",
    },
  },

  /* ---------- 2. Certification wall ------------------------------------- */
  certifications: {
    eyebrow: "Certification wall",
    heading: "What we hold, what we align to, what is in confirmation.",
    lede: "We separate licences we hold on the record from operating-framework alignments and cert scopes still under client-side confirmation. The Health Canada DEL is the only entry below that is final and public today.",
    stubNotice:
      "Documentation available on request under NDA. Certificate PDFs, scope annexes, and validity letters are released to qualified partners on signed confidentiality terms.",
    requestAction: {
      href: "/contact?source=quality-certs",
      label: "Request certificate documentation",
      variant: "primary",
    },
    items: [
      {
        id: "health-canada-del",
        slug: "health-canada-del",
        title: "Health Canada Drug Establishment Licence",
        issuer: "Health Canada",
        scope:
          "Fabrication, packaging, labelling, testing, import, and wholesale — Mississauga site.",
        detail:
          "The DEL is the backbone of our Canadian operating posture. It authorizes the Mississauga site for fabrication, packaging, labelling, testing, import, and wholesale activities under Division 1A of the Food and Drug Regulations. The site is maintained inspection-ready on a continuous basis, with annual self-assessment against GUI-0002 and internal audit cycles scheduled on a risk-ranked cadence.",
        reference: HEALTH_CANADA_DEL_REGISTER,
        status: "confirmed",
        validity: "Current — verifiable on the Drug Product Database",
      },
      {
        id: "who-gmp",
        slug: "who-gmp",
        title: "WHO-GMP — Hyderabad manufacturing network",
        issuer: "WHO-GMP framework",
        scope:
          "Good Manufacturing Practice coverage of the Hyderabad manufacturing network.",
        detail:
          "Our Hyderabad operations are structured to WHO-GMP principles — material qualification, process validation, cleaning validation, and ongoing process verification are governed under the same SOP set that binds our Mississauga quality manual. Documentation is available to qualified partners under NDA.",
        reference: WHO_GMP,
        status: "under-confirmation",
        validity: null,
      },
      {
        id: "usfda-registration",
        slug: "usfda-establishment-registration",
        title: "USFDA establishment registration",
        issuer: "US Food and Drug Administration",
        scope:
          "Facility registration under 21 CFR 207 for applicable operations.",
        detail:
          "Scope, facility FEI, and current-registration status are shared on request. We track registration expiry alongside our inspection-readiness cycle and any scope change is logged as a change-control record against the DEL dossier.",
        reference: USFDA_REGISTRATION,
        status: "under-confirmation",
        validity: null,
      },
      {
        id: "tga-recognition",
        slug: "tga-recognition",
        title: "TGA overseas GMP recognition",
        issuer: "Australian Therapeutic Goods Administration",
        scope:
          "Overseas GMP clearance pathway for applicable manufacturing scope.",
        detail:
          "TGA overseas GMP clearance is pursued on a product-registration basis — scope and current clearance pathway are confirmed on a program-by-program basis under NDA.",
        reference: TGA_OVERSEAS_GMP,
        status: "under-confirmation",
        validity: null,
      },
      {
        id: "ich-q10-alignment",
        slug: "ich-q10-alignment",
        title: "ICH Q10 pharmaceutical quality system",
        issuer: "ICH Q10 framework",
        scope:
          "Operating alignment — not a certificate. Our QMS is structured to Q10's four elements.",
        detail:
          "Propharmex operates its quality system in alignment with ICH Q10 — process performance and product quality monitoring, CAPA, change management, and management review are the four pillars we report against internally and to inspectors.",
        reference: ICH_Q10,
        status: "alignment",
        validity: null,
      },
      {
        id: "ich-q2-alignment",
        slug: "ich-q2-alignment",
        title: "ICH Q2(R2) analytical method validation",
        issuer: "ICH Q2(R2) framework",
        scope:
          "Analytical method development and validation alignment — Hyderabad bench.",
        detail:
          "All analytical methods developed or transferred by Propharmex are validated to ICH Q2(R2) parameters — specificity, linearity, accuracy, precision, range, detection and quantitation limits, and robustness — with Mississauga acting as a second-site release laboratory where client dossiers require it.",
        reference: ICH_Q2R2,
        status: "alignment",
        validity: null,
      },
      {
        id: "ich-q1a-alignment",
        slug: "ich-q1a-alignment",
        title: "ICH Q1A(R2) stability framework",
        issuer: "ICH Q1A(R2) framework",
        scope:
          "Stability programs structured for Zones I through IVb climatic conditions.",
        detail:
          "Stability chambers cover long-term, intermediate, and accelerated conditions across the Zones defined in Q1A(R2). Photostability is handled under ICH Q1B. Out-of-trend and out-of-specification handling follows a single SOP shared across both sites.",
        reference: ICH_Q1A,
        status: "alignment",
        validity: null,
      },
      {
        id: "gdp-alignment",
        slug: "gdp-alignment",
        title: "Good Distribution Practice (GDP) alignment",
        issuer: "WHO GDP framework",
        scope:
          "3PL distribution — cold-chain and controlled-ambient under the DEL.",
        detail:
          "Distribution operates under the Mississauga DEL with cold-chain (2–8 °C) and controlled-ambient lanes for Canada, the US, and Caribbean destinations. Temperature excursions, quarantine releases, and returns handling follow WHO GDP principles and are logged under the same deviation management SOP as manufacturing.",
        reference: WHO_GDP,
        status: "alignment",
        validity: null,
      },
    ],
  },

  /* ---------- 3. QMS architecture -------------------------------------- */
  qms: {
    eyebrow: "QMS architecture",
    heading: "Seven stages. One SOP stack. Both sites.",
    lede: "The diagram below is the operating loop behind every engagement — from the SOP that governs a task through to lot release. The loop closes back into annual management review, in line with ICH Q10.",
    stages: [
      {
        id: "sops",
        order: 1,
        title: "SOPs & controlled documents",
        body: "Every recurring task has a controlled SOP with a document owner, effective date, and training plan. Both sites share the master SOP library.",
        reference: ICH_Q10,
      },
      {
        id: "training",
        order: 2,
        title: "Training & qualification",
        body: "Competency-gated role matrix — no operator or scientist takes on a task until the matching SOP training record is signed and date-stamped.",
        reference: ICH_Q10,
      },
      {
        id: "change-control",
        order: 3,
        title: "Change control",
        body: "Any change to a validated system, method, supplier, or facility flows through a single change-control SOP with cross-site review before implementation.",
        reference: ICH_Q9,
      },
      {
        id: "deviations",
        order: 4,
        title: "Deviations & investigations",
        body: "Deviations are logged the same day, classified by risk, and investigated under a structured root-cause methodology. Nothing gets softened on the way up.",
        reference: ICH_Q9,
      },
      {
        id: "capa",
        order: 5,
        title: "CAPA",
        body: "Corrective and preventive actions are tracked against due dates and effectiveness reviews. CAPA status is a standing agenda item on the joint weekly steering.",
        reference: ICH_Q10,
      },
      {
        id: "audits",
        order: 6,
        title: "Internal & external audits",
        body: "Annual internal audit schedule across both sites plus external-readiness reviews before every regulator-facing inspection window.",
        reference: HEALTH_CANADA_GUI_0002,
      },
      {
        id: "release",
        order: 7,
        title: "Lot release & annual review",
        body: "Batch release under the DEL, followed into the annual product review — trend data feeds back into SOP and specification updates.",
        reference: ICH_Q10,
      },
    ],
  },

  /* ---------- 4. Regulatory bodies ------------------------------------- */
  regulators: {
    eyebrow: "Regulatory bodies we work with",
    heading: "Regulator scope, by jurisdiction.",
    lede: "This is the agency list we design programs around. Health Canada is our primary regulator; the others describe where our filings, inspections, or engagement scopes sit today. Every row is confirmed on a program-by-program basis under NDA.",
    items: [
      {
        id: "health-canada",
        label: "Health Canada",
        jurisdiction: "Canada",
        scope: "primary-regulator",
        body: "Our primary regulator. The Mississauga DEL is held against GUI-0002 and the Food and Drug Regulations. ANDS filings, DIN assignments, and post-approval lifecycle work run through here.",
        reference: HEALTH_CANADA_GUI_0002,
      },
      {
        id: "usfda",
        label: "USFDA",
        jurisdiction: "United States",
        scope: "filing-scope",
        body: "Establishment registration and ANDA / DMF Type II filing experience across complex generics and specialty dosage forms. Scope confirmed per program.",
        reference: USFDA_REGISTRATION,
      },
      {
        id: "cdsco",
        label: "CDSCO",
        jurisdiction: "India",
        scope: "inspection-scope",
        body: "Hyderabad operations run under CDSCO licensing and state-regulator oversight. State drug control authority records are available to qualified partners.",
        reference: CDSCO_OVERVIEW,
      },
      {
        id: "ema",
        label: "EU EMA",
        jurisdiction: "European Union",
        scope: "engagement-scope",
        body: "EMA engagement is pursued on a program basis — EU GMP annex alignment, nitrosamine workstream participation, and MAA support where the client holds the marketing authorisation.",
        reference: EMA_GMP_GDP,
      },
      {
        id: "tga",
        label: "Australian TGA",
        jurisdiction: "Australia",
        scope: "engagement-scope",
        body: "Overseas GMP clearance pathway activated on a product-registration basis. Inspection scope confirmed per engagement.",
        reference: TGA_OVERSEAS_GMP,
      },
      {
        id: "who",
        label: "WHO",
        jurisdiction: "International",
        scope: "engagement-scope",
        body: "WHO-GMP and WHO GDP principles are embedded in our SOP set. WHO-PQ engagements supported on a product-by-product basis for applicable markets.",
        reference: WHO_GMP,
      },
    ],
  },

  /* ---------- 5. Audit history ----------------------------------------- */
  audit: {
    eyebrow: "Audit history",
    heading: "Inspection outcomes shared under NDA.",
    lede: "We do not publish inspection outcomes on the marketing site. Audit summaries — regulator, site, date, observation class, CAPA status — are shared with qualified partners on signed confidentiality terms. The primer below is included so procurement and quality reviewers can calibrate what to ask for.",
    ndaPanel: {
      heading: "Inspection summary — request pack",
      body: "We release a structured inspection-summary pack on signature of a mutual NDA. It covers site, regulator, date, observation class, CAPA closure evidence, and the post-closure verification approach. Redaction of client identifiers is standard.",
      action: {
        href: "/contact?source=quality-audit-nda",
        label: "Request inspection summary",
        variant: "primary",
      },
    },
    primer: [
      {
        label: "Form FDA 483",
        body: "The 483 is the list of inspectional observations an USFDA investigator leaves at the end of an inspection. It is not itself an enforcement action — enforcement follows the Establishment Inspection Report (EIR) and subsequent correspondence.",
        reference: USFDA_FORM_483,
      },
      {
        label: "GUI-0002 framework",
        body: "Health Canada DEL inspections are structured against GUI-0002. Observations are classified as Critical, Major, or Other, with response timelines set against each class.",
        reference: HEALTH_CANADA_GUI_0002,
      },
      {
        label: "EU GMP and PIC/S",
        body: "EU GMP inspections are structured against the EMA GMP compilation and the PIC/S guide. Classification is Critical / Major / Other with CAPA response windows.",
        reference: EMA_GMP_GDP,
      },
    ],
  },

  /* ---------- 6. DEL story teaser -------------------------------------- */
  del: {
    eyebrow: "The DEL story",
    heading: "Why the Drug Establishment Licence is the anchor of everything.",
    body: "The DEL is not a badge — it is the legal authorisation under the Food and Drug Regulations that lets us fabricate, package, label, test, import, and wholesale drug products in Canada. Every other activity on this page — cGMP alignment, analytical rigour, 3PL operations, distribution — is scoped and audited against what the DEL demands.",
    bullets: [
      "Issued per GUI-0002 by Health Canada's Regulatory Operations and Enforcement Branch.",
      "Scope covers fabrication, packaging, labelling, testing, import, and wholesale at the Mississauga site.",
      "Maintained under an annual self-assessment with continuous inspection-readiness reviews.",
      "Any scope change is filed as a DEL amendment and entered into change control before it is implemented operationally.",
    ],
    anchor: {
      label: "Verify on the Drug and Health Product Register",
      source: HEALTH_CANADA_DEL_REGISTER,
    },
    cta: {
      href: "/contact?source=quality-del",
      label: "Talk to the regulatory lead",
      variant: "primary",
    },
  },

  /* ---------- 7. Download centre --------------------------------------- */
  downloads: {
    eyebrow: "Download centre",
    heading: "Policies and indices — available on request.",
    lede: "These three documents are the ones procurement, quality, and regulatory reviewers ask for most often. We release them under NDA on a per-engagement basis rather than as open downloads so the revision in your hands always matches the current SOP set.",
    requestNotice:
      "Every document below is released on signed NDA at the current revision. A document release log is included.",
    docs: [
      {
        id: "quality-policy",
        title: "Propharmex Quality Policy",
        body: "The signed corporate quality policy covering scope, accountability, ICH Q10 alignment, and commitment to continuous improvement. Countersigned by the VP Quality and the senior-most site leads.",
        framework: "ICH Q10",
        action: {
          href: "/contact?source=quality-docs-policy",
          label: "Request Quality Policy",
          variant: "primary",
        },
      },
      {
        id: "data-integrity",
        title: "Data Integrity Policy",
        body: "Our data-integrity controls — ALCOA+ principles, audit trail scope, e-signature conformance, and the cross-site data-handling SOPs that govern every GxP record. Aligned to FDA, MHRA, and PIC/S guidance.",
        framework: "ALCOA+",
        action: {
          href: "/contact?source=quality-docs-dataintegrity",
          label: "Request Data Integrity Policy",
          variant: "primary",
        },
      },
      {
        id: "sop-index",
        title: "Controlled SOP index (titles only)",
        body: "The master SOP index — titles, document owners, effective dates, and supersede history. Individual SOP text is released only to procurement-qualified and audit-qualified partners under a specific engagement scope.",
        framework: "Internal controlled document register",
        action: {
          href: "/contact?source=quality-docs-sop-index",
          label: "Request SOP index",
          variant: "primary",
        },
      },
    ],
  },
};

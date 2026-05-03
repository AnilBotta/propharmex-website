/**
 * /quality-compliance content dictionary.
 *
 * Prompt 8 stand-in for what will become a Sanity `page{slug:"quality-compliance"}`
 * document plus a `regulator` + `policyDocument` collection. Every user-facing
 * string is drafted via design:ux-copy and gated by brand-voice-guardian
 * (docs/brand-voice.md).
 *
 * Voice rules (CLAUDE.md §1 + docs/brand-voice.md): anti-hype, expert, humble,
 * regulatory-precise. Banned words: world-class, cutting-edge, seamless,
 * industry-leading, trusted partner.
 *
 * Positioning policy (PR-D2b' — specialty-CDMO repositioning, follows
 * docs/regulatory-lexicon.md §"Positioning update — 2026-05-03"):
 *  - This page no longer asserts a Health Canada Drug Establishment Licence
 *    or any specific certification on the marketing surface. The previous
 *    "DEL is the anchor" framing has been retired.
 *  - Every framework row is `status: "alignment"` — operating-framework
 *    statements only, never credential claims. The `confirmed` and
 *    `under-confirmation` literal members of `QualityStatus` are unused
 *    here; they remain in the union for binary compatibility with the
 *    component layer until a follow-up cleanup PR prunes the dead branches.
 *  - Regulator section describes which regulators we *file submissions
 *    with* on behalf of clients — not regulators that license Propharmex.
 *  - Audit posture remains NDA-gated, which works regardless of what we
 *    hold; the educational primer is scoped to inspection frameworks our
 *    clients' sponsors face during their own filings.
 *  - Policy-document downloads route to /contact?source=quality-docs-<id>
 *    rather than serving PDFs.
 *
 * YMYL compliance: no unsubstantiated regulatory claim appears on this page.
 * Every framework reference carries a primary-source link to the framework
 * itself, with `kind: "primary"`. No claim is made that Propharmex holds
 * accreditation under any framework named here.
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
  /**
   * Reserved. Indicates an externally-verifiable credential held today. Not
   * used by /quality-compliance content as of PR-D2b' — Propharmex does not
   * assert specific certifications on the marketing site. Retained in the
   * union for component-side binary compatibility.
   */
  | "confirmed"
  /**
   * Reserved. Indicates a credential under client-confirmation. Not used by
   * /quality-compliance content as of PR-D2b'.
   */
  | "under-confirmation"
  /** Operating framework — not a certificate, but a published standard we work to. */
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
/*  2. Operating-frameworks wall (formerly "certification wall")              */
/* -------------------------------------------------------------------------- */

export type QualityCertification = {
  id: string;
  slug: string;
  /** Short display name, e.g. "ICH Q10". */
  title: string;
  /** Issuing body, e.g. "ICH". */
  issuer: string;
  /** One-sentence scope. */
  scope: string;
  /** Longer detail paragraph shown in the modal. */
  detail: string;
  /** Primary-source URL for the framework itself. */
  reference: QualitySource | null;
  status: QualityStatus;
  /** Applied-as-of / issued-as-of date, ISO-ish ("2019" OK), or null. */
  validity: string | null;
};

export type QualityCertificationWall = {
  eyebrow: string;
  heading: string;
  lede: string;
  /** Copy shown on every card. */
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
  /** ICH / cGMP reference for the stage. */
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
/*  6. Quality philosophy (formerly "DEL story teaser")                       */
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
/*  Primary-source references                                                 */
/* -------------------------------------------------------------------------- */

const ICH_Q10: QualitySource = {
  kind: "primary",
  label: "ICH Q10 — Pharmaceutical Quality System",
  href: "https://www.ich.org/page/quality-guidelines",
};

const ICH_Q9: QualitySource = {
  kind: "primary",
  label: "ICH Q9(R1) — Quality Risk Management",
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

const ICH_Q3D: QualitySource = {
  kind: "primary",
  label: "ICH Q3D(R2) — Guideline for Elemental Impurities",
  href: "https://www.ich.org/page/quality-guidelines",
};

const WHO_GMP: QualitySource = {
  kind: "primary",
  label:
    "WHO — Good Manufacturing Practices for pharmaceutical products: main principles",
  href: "https://www.who.int/teams/health-product-policy-and-standards/standards-and-specifications/norms-and-standards-for-pharmaceuticals/guidelines/production",
};

const WHO_GDP: QualitySource = {
  kind: "primary",
  label: "WHO — Good storage and distribution practices for medical products",
  href: "https://www.who.int/teams/health-product-policy-and-standards/standards-and-specifications/norms-and-standards-for-pharmaceuticals",
};

const HEALTH_CANADA_DRUGS: QualitySource = {
  kind: "primary",
  label: "Health Canada — Drugs and health products",
  href: "https://www.canada.ca/en/health-canada/services/drugs-health-products.html",
};

const USFDA_DRUGS: QualitySource = {
  kind: "primary",
  label: "USFDA — Drugs",
  href: "https://www.fda.gov/drugs",
};

const USFDA_FORM_483: QualitySource = {
  kind: "primary",
  label: "USFDA — Form FDA 483 Frequently Asked Questions",
  href: "https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/inspection-references/frequently-asked-questions-about-form-fda-483",
};

const TGA_OVERVIEW: QualitySource = {
  kind: "primary",
  label: "Australian TGA — Therapeutic Goods Administration",
  href: "https://www.tga.gov.au/",
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

const PIC_S_GUIDE: QualitySource = {
  kind: "primary",
  label: "PIC/S — Guide to Good Manufacturing Practice for Medicinal Products",
  href: "https://picscheme.org/en/publications",
};

const ALCOA_PLUS: QualitySource = {
  kind: "primary",
  label: "MHRA — 'GXP' Data Integrity Guidance and Definitions (ALCOA+ basis)",
  href: "https://www.gov.uk/government/publications/guidance-on-gxp-data-integrity",
};

export const QUALITY: QualityContent = {
  metaTitle:
    "Quality & compliance — Propharmex specialty CDMO QMS posture",
  metaDescription:
    "How Propharmex runs quality across our Canadian headquarters and our Indian development centre — one ICH Q10-anchored quality system, ICH-aligned analytical and stability practice, ALCOA+ data integrity, and an SOP-controlled change process. Documentation released to qualified partners under NDA.",
  ogTitle: "Quality & compliance — Propharmex",
  ogDescription:
    "One QMS across both sites. ICH Q10 architecture, ICH-anchored analytical and stability practice, NDA-gated audit posture. We do not publish certificates on the marketing site.",

  /* ---------- 1. Hero ---------------------------------------------------- */
  hero: {
    eyebrow: "Quality & compliance",
    headline: "Quality isn't a department. It's our operating system.",
    lede: "We run one quality management system across our Canadian headquarters and our Indian development centre — one quality manual, one SOP library, one change-control process. The system is structured around ICH Q10, with analytical, stability, and data-integrity practice anchored to the matching ICH and global GxP guidelines. We do not publish certificates on this page; documentation is released to qualified partners under NDA.",
    anchor: {
      value: "ICH Q10",
      label:
        "ICH Q10 — Pharmaceutical Quality System (the published framework our QMS is structured to)",
      source: ICH_Q10,
    },
    primaryCta: {
      href: "/contact?source=quality-documentation",
      label: "Request quality documentation",
      variant: "primary",
    },
    secondaryCta: {
      href: "#qms-architecture",
      label: "See how the QMS works",
      variant: "ghost",
    },
  },

  /* ---------- 2. Operating-frameworks wall ------------------------------- */
  certifications: {
    eyebrow: "Operating frameworks",
    heading: "The frameworks our QMS is structured against.",
    lede: "These are the published frameworks our quality, analytical, and data-integrity practice is built around. We do not claim certification under them on the marketing site — the published evidence below is each framework itself, available from its issuing body. Our internal alignment documentation is released to qualified partners under NDA.",
    stubNotice:
      "Documentation — SOP excerpts, framework alignment summaries, validation packets, training records — is released to qualified partners under NDA on a per-engagement basis. Use the request button below to open a scoped conversation.",
    requestAction: {
      href: "/contact?source=quality-frameworks",
      label: "Request operating documentation",
      variant: "primary",
    },
    items: [
      {
        id: "ich-q10-alignment",
        slug: "ich-q10-alignment",
        title: "ICH Q10 — Pharmaceutical Quality System",
        issuer: "ICH",
        scope:
          "The four-pillar PQS architecture our quality manual is structured against.",
        detail:
          "Our quality system is organised around the four elements of ICH Q10 — process performance and product quality monitoring, corrective and preventive action, change management, and management review. The same four pillars are reported against internally on a fixed cadence, with cross-site review across both Propharmex sites.",
        reference: ICH_Q10,
        status: "alignment",
        validity: null,
      },
      {
        id: "ich-q9-alignment",
        slug: "ich-q9-alignment",
        title: "ICH Q9(R1) — Quality Risk Management",
        issuer: "ICH",
        scope: "Risk-based decision-making across change control, deviations, and CAPA.",
        detail:
          "Quality risk management is embedded in change control, deviation handling, supplier qualification, and CAPA prioritisation. Risk classification, residual-risk evaluation, and review cadence follow the principles of ICH Q9(R1).",
        reference: ICH_Q9,
        status: "alignment",
        validity: null,
      },
      {
        id: "ich-q2-alignment",
        slug: "ich-q2-alignment",
        title: "ICH Q2(R2) — Analytical Procedure Validation",
        issuer: "ICH",
        scope:
          "Method development and validation parameters across the analytical bench.",
        detail:
          "Analytical methods developed or transferred by Propharmex are validated to the ICH Q2(R2) parameter set — specificity, linearity, accuracy, precision, range, detection and quantitation limits, and robustness — with validation packages released to clients on a per-engagement basis under NDA.",
        reference: ICH_Q2R2,
        status: "alignment",
        validity: null,
      },
      {
        id: "ich-q1a-alignment",
        slug: "ich-q1a-alignment",
        title: "ICH Q1A(R2) and Q1B — Stability and photostability",
        issuer: "ICH",
        scope:
          "Stability programs structured for ICH Zones I through IVb plus photostability.",
        detail:
          "Stability programs cover long-term, intermediate, and accelerated conditions across the climatic zones defined in Q1A(R2). Photostability is handled under Q1B. Out-of-trend and out-of-specification events are governed by a single SOP under the shared QMS, with cross-site escalation paths.",
        reference: ICH_Q1A,
        status: "alignment",
        validity: null,
      },
      {
        id: "ich-q3d-alignment",
        slug: "ich-q3d-alignment",
        title: "ICH Q3D(R2) — Elemental impurities",
        issuer: "ICH",
        scope:
          "Risk assessment and control strategy for elemental impurities across drug products.",
        detail:
          "Elemental-impurity risk assessment follows the ICH Q3D(R2) framework — Permitted Daily Exposure modelling against route of administration, control-strategy design at the API and excipient interface, and analytical confirmation against the established control limits.",
        reference: ICH_Q3D,
        status: "alignment",
        validity: null,
      },
      {
        id: "cgmp-alignment",
        slug: "cgmp-alignment",
        title: "cGMP principles (WHO and EU references)",
        issuer: "WHO / EU GMP / PIC/S",
        scope:
          "Current Good Manufacturing Practice principles as expressed by the global GMP frameworks.",
        detail:
          "Our SOP set is written against the principles published in the WHO GMP main-principles guidance and the EU GMP / PIC/S guides — material qualification, equipment qualification, cleaning controls, batch documentation, and ongoing process verification. The framework references on this page are the published guidances themselves; conformance summaries are shared with qualified partners under NDA.",
        reference: WHO_GMP,
        status: "alignment",
        validity: null,
      },
      {
        id: "gdp-alignment",
        slug: "gdp-alignment",
        title: "Good Distribution Practice (WHO GDP)",
        issuer: "WHO",
        scope:
          "Storage- and distribution-handling principles for client logistics scope.",
        detail:
          "Where client logistics scope sits inside our facilities, storage and handling follow WHO GDP principles — segregation, temperature control, deviation logging, and quarantine release run under the same deviation-management SOP as manufacturing. Distribution scope is confirmed engagement-by-engagement; the marketing site does not assert distribution authorisation.",
        reference: WHO_GDP,
        status: "alignment",
        validity: null,
      },
      {
        id: "alcoa-plus-alignment",
        slug: "alcoa-plus-alignment",
        title: "ALCOA+ data integrity",
        issuer: "MHRA / FDA / PIC/S guidance basis",
        scope:
          "Data-integrity controls across paper and electronic GxP records.",
        detail:
          "GxP records — paper and electronic — are governed by ALCOA+ principles (attributable, legible, contemporaneous, original, accurate, plus complete, consistent, enduring, available). Audit trail scope, e-signature conformance, and cross-site data handling are documented in a controlled data-integrity policy that is released under NDA.",
        reference: ALCOA_PLUS,
        status: "alignment",
        validity: null,
      },
    ],
  },

  /* ---------- 3. QMS architecture -------------------------------------- */
  qms: {
    eyebrow: "QMS architecture",
    heading: "Seven stages. One SOP stack. One QMS.",
    lede: "The diagram below is the operating loop behind every engagement — from the SOP that governs a task through to lot release and management review. The loop closes back into annual management review, in line with ICH Q10.",
    stages: [
      {
        id: "sops",
        order: 1,
        title: "SOPs & controlled documents",
        body: "Every recurring task has a controlled SOP with a document owner, effective date, and training plan. Our Canadian headquarters and our Indian development centre share a single master SOP library and a single document control register.",
        reference: ICH_Q10,
      },
      {
        id: "training",
        order: 2,
        title: "Training & qualification",
        body: "Competency-gated role matrix — no operator or scientist takes on a task until the matching SOP training record is signed and date-stamped. Re-qualification cadence is fixed by SOP and reviewed at management review.",
        reference: ICH_Q10,
      },
      {
        id: "change-control",
        order: 3,
        title: "Change control",
        body: "Any change to a validated system, method, supplier, or facility flows through a single change-control SOP with cross-site review before implementation. Risk classification follows ICH Q9 principles.",
        reference: ICH_Q9,
      },
      {
        id: "deviations",
        order: 4,
        title: "Deviations & investigations",
        body: "Deviations are logged the same day, classified by risk, and investigated under a structured root-cause methodology. Nothing gets softened on the way up — the investigation report is the investigation report.",
        reference: ICH_Q9,
      },
      {
        id: "capa",
        order: 5,
        title: "CAPA",
        body: "Corrective and preventive actions are tracked against due dates and effectiveness reviews. CAPA status is a standing agenda item on the joint weekly steering across both sites.",
        reference: ICH_Q10,
      },
      {
        id: "audits",
        order: 6,
        title: "Internal & external audits",
        body: "Annual internal audit schedule covering both sites under one audit plan, plus external-readiness reviews ahead of any client-driven or regulator-facing inspection window.",
        reference: ICH_Q10,
      },
      {
        id: "release",
        order: 7,
        title: "Lot release & annual review",
        body: "Batch release follows the controlled release SOP and feeds into annual product review. Trend data from release and stability flows back into specification and SOP updates on a fixed cadence.",
        reference: ICH_Q10,
      },
    ],
  },

  /* ---------- 4. Regulatory bodies ------------------------------------- */
  regulators: {
    eyebrow: "Regulators we file with",
    heading: "Where our submissions go.",
    lede: "These are the agencies our CMC dossiers, ANDAs, and post-approval lifecycle work reach when we prepare them on behalf of clients. Filing scope, document set, and engagement model are confirmed program-by-program under NDA. The body language below describes the type of work we do; it does not assert that any of these regulators license Propharmex.",
    items: [
      {
        id: "health-canada",
        label: "Health Canada",
        jurisdiction: "Canada",
        scope: "filing-scope",
        body: "ANDS, NDS, and DIN-related submissions, plus CMC dossier preparation and post-approval lifecycle work for clients targeting the Canadian market. Submission scope is confirmed program-by-program.",
        reference: HEALTH_CANADA_DRUGS,
      },
      {
        id: "usfda",
        label: "USFDA",
        jurisdiction: "United States",
        scope: "filing-scope",
        body: "ANDA, NDA, and DMF Type II submission support across complex generics and specialty dosage forms. CMC eCTD Module 3 authoring and post-approval change management on a per-program basis.",
        reference: USFDA_DRUGS,
      },
      {
        id: "ema",
        label: "EU EMA",
        jurisdiction: "European Union",
        scope: "filing-scope",
        body: "EU GMP-aligned dossier preparation, MAA-support work where the client holds the marketing authorisation, ASMF authoring, and nitrosamine workstream participation. Engagement model varies by program.",
        reference: EMA_GMP_GDP,
      },
      {
        id: "tga",
        label: "Australian TGA",
        jurisdiction: "Australia",
        scope: "filing-scope",
        body: "Submission support for TGA-targeted programs — overseas GMP-clearance pathway, dossier authoring, and lifecycle-management work confirmed on a per-engagement basis.",
        reference: TGA_OVERVIEW,
      },
      {
        id: "cdsco",
        label: "CDSCO",
        jurisdiction: "India",
        scope: "engagement-scope",
        body: "Our Indian development centre operates within India's pharmaceutical regulatory framework, including state drug control authority oversight. Documentation specific to that scope is shared with qualified partners under NDA.",
        reference: CDSCO_OVERVIEW,
      },
      {
        id: "who",
        label: "WHO",
        jurisdiction: "International",
        scope: "engagement-scope",
        body: "WHO-PQ engagements supported on a product-by-product basis for applicable markets. WHO GMP and GDP principles are embedded in our SOP set as the global GxP reference.",
        reference: WHO_GMP,
      },
    ],
  },

  /* ---------- 5. Audit history ----------------------------------------- */
  audit: {
    eyebrow: "Audit posture",
    heading: "Inspection-readiness, shared under NDA.",
    lede: "We do not publish inspection outcomes on the marketing site. Inspection-readiness summaries — site, regulator, date, observation class, CAPA closure — are released to qualified partners on signed confidentiality terms. The educational primer below exists so procurement and quality reviewers know what to ask for.",
    ndaPanel: {
      heading: "Inspection-readiness summary — request pack",
      body: "We release a structured readiness pack on signature of a mutual NDA. It covers site, applicable inspection framework, observation class, CAPA closure evidence, and the post-closure verification approach. Redaction of client identifiers is standard.",
      action: {
        href: "/contact?source=quality-audit-nda",
        label: "Request inspection-readiness summary",
        variant: "primary",
      },
    },
    primer: [
      {
        label: "Form FDA 483",
        body: "The 483 is the list of inspectional observations a USFDA investigator leaves at the end of an inspection. It is not itself an enforcement action — enforcement follows the Establishment Inspection Report (EIR) and any subsequent correspondence.",
        reference: USFDA_FORM_483,
      },
      {
        label: "EU GMP and PIC/S",
        body: "EU GMP inspections are structured against the EMA GMP compilation and the PIC/S guide. Observations are classified Critical / Major / Other with CAPA response windows scaled to severity.",
        reference: PIC_S_GUIDE,
      },
      {
        label: "ICH Q10 inspection expectations",
        body: "Beyond any single inspection framework, ICH Q10 sets the expectation that the pharmaceutical quality system itself is what an inspector evaluates — process performance and product-quality monitoring, CAPA, change management, and management review must each be evidenced.",
        reference: ICH_Q10,
      },
    ],
  },

  /* ---------- 6. Quality philosophy (was DEL story teaser) ------------- */
  del: {
    eyebrow: "Our quality philosophy",
    heading: "Quality is the discipline of being honest with our own data.",
    body: "Our QMS is structured around ICH Q10 — process performance and product quality monitoring, CAPA, change management, and management review. The system runs the same in Mississauga, Ontario, and in Hyderabad, India: one quality manual, one SOP library, one document control register, one CAPA log. The published frameworks above are how we describe the system to outside reviewers. The internal documentation that backs the system, including SOP text and inspection-readiness packets, is released to qualified partners under NDA.",
    bullets: [
      "ICH Q10 architecture — four pillars: PQS performance, CAPA, change management, management review.",
      "One quality manual across our Canadian headquarters and our Indian development centre.",
      "Internal-audit cadence is fixed and risk-ranked. External-readiness reviews precede any client-driven or regulator-facing inspection window.",
      "Change control is the default. Any change to a validated system, method, supplier, or facility flows through cross-site review before it goes operational.",
    ],
    anchor: {
      label: "Read ICH Q10 directly",
      source: ICH_Q10,
    },
    cta: {
      href: "/contact?source=quality-philosophy",
      label: "Talk to the quality lead",
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
        body: "The signed corporate quality policy covering scope, accountability, ICH Q10 alignment, and commitment to continuous improvement. Countersigned by the senior-most quality and site leads across both sites.",
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
        body: "Our data-integrity controls — ALCOA+ principles, audit-trail scope, e-signature conformance, and the cross-site data-handling SOPs that govern every GxP record. Aligned to MHRA, USFDA, and PIC/S guidance.",
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

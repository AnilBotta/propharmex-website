/**
 * Content dictionary for /services/analytical-services (hub) and the
 * analytical sub-service leaves (Prompt 11).
 *
 * All seven sub-service leaves are now live in this file — method
 * development, method validation, stability studies, impurity profiling,
 * bioanalytical, extractables & leachables, and reference standard
 * characterization. The hub matrix renders Link cards for each; the leaf
 * registry below is now a total `Record` rather than a `Partial<Record>`.
 *
 * Shape is intentionally close to a Sanity `service` document so Prompt 4
 * can port this to CMS with a near-1:1 migration. Until then it is the source
 * of truth for the route.
 *
 * Safe-defaults posture (same precedent as facilities.ts / quality.ts /
 * pharmaceutical-development.ts):
 *  - No anonymized client names; outcome metrics labelled `under-confirmation`
 *    route to /contact for the verified case-study trail.
 *  - Regulatory references follow the three-tier claim-status convention in
 *    `docs/regulatory-lexicon.md`. Analytical work operates in `alignment`
 *    with ICH / USP; instruments are `qualified` under an active IOQ/PQ
 *    programme; only finished, completed methods are `validated` to ICH
 *    Q2(R2). The word "certified" is never used for a method or an instrument.
 *  - Scoping questions prefill a `source` param so the inbound is attributable
 *    on the contact route (no AI Matcher for analytical services).
 */

import type { FacilityCta, FacilitySource } from "./facilities";

/* -------------------------------------------------------------------------- */
/*  Shared primitives                                                         */
/* -------------------------------------------------------------------------- */

export type AnalyticalCta = FacilityCta;
export type AnalyticalSource = FacilitySource;

/** Enumerates every sub-service leaf slug under the analytical hub. Leaf   */
/** pages whose content is not yet populated still render a "shipping next" */
/** state from the hub matrix so no internal links go stale.                */
export const ANALYTICAL_SERVICE_SLUGS = [
  "method-development",
  "method-validation",
  "stability-studies",
  "impurity-profiling",
  "bioanalytical",
  "extractables-and-leachables",
  "reference-standard-characterization",
] as const;

export type AnalyticalServiceSlug = (typeof ANALYTICAL_SERVICE_SLUGS)[number];

export type AnalyticalServiceSummary = {
  slug: AnalyticalServiceSlug;
  label: string;
  /** One-sentence elevator line shown on the hub service matrix. */
  blurb: string;
  /** Short keyword list surfaced below the blurb on the hub card. */
  highlights: string[];
  /** Whether the leaf detail page is live in this PR. */
  leafStatus: "live" | "shipping-next";
};

/* -------------------------------------------------------------------------- */
/*  Hub page                                                                  */
/* -------------------------------------------------------------------------- */

export type AnalyticalHubHero = {
  eyebrow: string;
  headline: string;
  lede: string;
  stats: { label: string; value: string }[];
  primaryCta: AnalyticalCta;
  secondaryCta: AnalyticalCta;
};

export type AnalyticalServiceMatrix = {
  eyebrow: string;
  heading: string;
  lede: string;
  /** Ordered list of sub-service summaries rendered as hub cards. */
  services: AnalyticalServiceSummary[];
  liveCopy: string;
  shippingNextCopy: string;
};

export type LifecycleStage = {
  id: string;
  label: string;
  description: string;
};

export type AnalyticalLifecycle = {
  eyebrow: string;
  heading: string;
  lede: string;
  stages: LifecycleStage[];
  handoffNote: string;
};

export type CaseStudyTeaser = {
  id: string;
  /** The sub-service the teaser sits under (e.g. "Method development"). */
  service: string;
  title: string;
  body: string;
  /** Rendered as an `under-confirmation` pill until a named, permitted case */
  /** study replaces it in Prompt 14.                                       */
  status: "under-confirmation";
};

export type AnalyticalCaseRail = {
  eyebrow: string;
  heading: string;
  lede: string;
  teasers: CaseStudyTeaser[];
  cta: AnalyticalCta;
};

export type AnalyticalHubClosing = {
  eyebrow: string;
  heading: string;
  body: string;
  primaryCta: AnalyticalCta;
  secondaryCta: AnalyticalCta;
};

export type AnalyticalHubContent = {
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  hero: AnalyticalHubHero;
  serviceMatrix: AnalyticalServiceMatrix;
  lifecycle: AnalyticalLifecycle;
  caseRail: AnalyticalCaseRail;
  closing: AnalyticalHubClosing;
};

/* -------------------------------------------------------------------------- */
/*  Leaf template                                                             */
/* -------------------------------------------------------------------------- */

export type AnalyticalLeafHero = {
  eyebrow: string;
  headline: string;
  /** One-sentence value prop per Prompt 11 spec section 1. */
  valueProp: string;
  lede: string;
  stats: { label: string; value: string }[];
  primaryCta: AnalyticalCta;
  secondaryCta: AnalyticalCta;
};

export type ChallengeItem = {
  id: string;
  label: string;
  description: string;
};

export type AnalyticalChallenges = {
  eyebrow: string;
  heading: string;
  lede: string;
  items: ChallengeItem[];
};

export type ProcessStep = {
  id: string;
  label: string;
  description: string;
  /** Short technical notes surfaced under the step description. */
  notes: string[];
};

export type AnalyticalProcess = {
  eyebrow: string;
  heading: string;
  lede: string;
  steps: ProcessStep[];
};

export type InstrumentRow = {
  id: string;
  /** Free-text instrument name (make, model). */
  instrument: string;
  /** Short sortable technique key — e.g. "HPLC", "UHPLC", "LC-MS/MS". */
  technique: string;
  /** What the instrument is used for on most programmes. */
  application: string;
  /** Qualification status. Uses the `qualified` verb, not `certified`. */
  qualification: string;
};

export type AnalyticalInstrumentInventory = {
  eyebrow: string;
  heading: string;
  lede: string;
  /** 8–12 rows for method-development; sortable by technique in the UI. */
  rows: InstrumentRow[];
  representativeNote: string;
  cta: AnalyticalCta;
};

export type OutcomeMetricCard = {
  id: string;
  label: string;
  value: string;
  context: string;
};

export type AnalyticalOutcome = {
  eyebrow: string;
  heading: string;
  lede: string;
  metrics: OutcomeMetricCard[];
  /** Same `under-confirmation` affordance as the hub case rail. */
  status: "under-confirmation";
  statusCopy: string;
};

export type ScopingQuestion = {
  id: string;
  prompt: string;
  /** Short one-line helper text rendered under the prompt. */
  helper: string;
};

export type AnalyticalScopingQuestions = {
  eyebrow: string;
  heading: string;
  lede: string;
  questions: ScopingQuestion[];
  /** CTA routes into /contact with a prefilled `source` param. */
  cta: AnalyticalCta;
  disclaimer: string;
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type AnalyticalFaq = {
  eyebrow: string;
  heading: string;
  lede: string;
  items: FaqItem[];
};

export type RelatedServiceLink = {
  id: string;
  label: string;
  description: string;
  href: string;
};

export type AnalyticalRelated = {
  eyebrow: string;
  heading: string;
  lede: string;
  links: RelatedServiceLink[];
};

export type AnalyticalClosingCta = {
  eyebrow: string;
  heading: string;
  body: string;
  primaryCta: AnalyticalCta;
  secondaryCta: AnalyticalCta;
  regulatoryNote: AnalyticalSource;
};

export type AnalyticalLeafContent = {
  slug: AnalyticalServiceSlug;
  label: string;
  /** Crumb label used in BreadcrumbList — generally shorter than `label`. */
  crumbLabel: string;
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  hero: AnalyticalLeafHero;
  challenges: AnalyticalChallenges;
  process: AnalyticalProcess;
  inventory: AnalyticalInstrumentInventory;
  outcome: AnalyticalOutcome;
  scoping: AnalyticalScopingQuestions;
  faq: AnalyticalFaq;
  related: AnalyticalRelated;
  closing: AnalyticalClosingCta;
};

/* -------------------------------------------------------------------------- */
/*  Hub content                                                               */
/* -------------------------------------------------------------------------- */

export const ANALYTICAL_HUB: AnalyticalHubContent = {
  metaTitle: "Analytical Services — Propharmex",
  metaDescription:
    "Analytical method development, validation, stability, impurity profiling, bioanalytical, E&L and reference standard characterization. Executed by Propharmex, filed under our Health Canada Drug Establishment Licence.",
  ogTitle: "Analytical Services — Propharmex",
  ogDescription:
    "Seven analytical services, one quality system. Methods authored to travel — from the bench into validation, transfer, and the dossier.",
  hero: {
    eyebrow: "Services · Analytical Services",
    headline: "Methods authored to survive validation, transfer, and the dossier.",
    lede: "Analytical work is qualified against ICH Q2(R2) and the relevant USP general chapters, then transferred into release testing under a single quality system. Seven sub-services cover the lifecycle — from early development through reference standard characterization — each documented in a shape the regulator can read.",
    stats: [
      { label: "Sub-services supported", value: "7" },
      { label: "Development anchor", value: "ICH Q14 + Q2(R2)" },
      { label: "Release-testing anchor", value: "Health Canada DEL" },
    ],
    primaryCta: {
      label: "Scope an analytical programme",
      href: "/contact?source=as-hub-hero-scope",
      variant: "primary",
    },
    secondaryCta: {
      label: "Request the instrument inventory",
      href: "/contact?source=as-hub-hero-inventory",
      variant: "outline",
    },
  },
  serviceMatrix: {
    eyebrow: "Service matrix",
    heading: "Seven analytical services we deliver",
    lede: "Each service has its own guideline stack — ICH Q2(R2) for validation, Q14 for development, Q1A(R2) for stability, Q3A/B/C/D for impurities, and the relevant USP chapters. The detail pages walk through both the work and the references. The hub is the index.",
    services: [
      {
        slug: "method-development",
        label: "Method development",
        blurb:
          "Stability-indicating assay, related-substances and dissolution methods authored against ICH Q14 and the target specification.",
        highlights: ["ICH Q14", "Stability-indicating", "Dissolution"],
        leafStatus: "live",
      },
      {
        slug: "method-validation",
        label: "Method validation",
        blurb:
          "Validation packages to ICH Q2(R2) — specificity, linearity, accuracy, precision, range, robustness — executed with auditable raw data.",
        highlights: ["ICH Q2(R2)", "Validation protocols", "Robustness"],
        leafStatus: "live",
      },
      {
        slug: "stability-studies",
        label: "Stability studies",
        blurb:
          "Long-term, accelerated, intermediate and photostability studies under ICH Q1A(R2) and Q1B with pull cadence aligned to submission.",
        highlights: ["ICH Q1A(R2)", "Zone II / IVb", "Photostability"],
        leafStatus: "live",
      },
      {
        slug: "impurity-profiling",
        label: "Impurity profiling",
        blurb:
          "Organic, elemental, residual-solvent and genotoxic impurity workups aligned to ICH Q3A/B, Q3C(R8), Q3D and M7(R2).",
        highlights: ["ICH Q3A/B", "Q3C residual solvents", "Q3D elemental"],
        leafStatus: "live",
      },
      {
        slug: "bioanalytical",
        label: "Bioanalytical",
        blurb:
          "LC-MS/MS bioanalytical methods for PK and biomarker work, authored against USFDA and ICH M10 bioanalytical method validation guidance.",
        highlights: ["LC-MS/MS", "ICH M10", "PK support"],
        leafStatus: "live",
      },
      {
        slug: "extractables-and-leachables",
        label: "Extractables & leachables",
        blurb:
          "E&L study design and execution aligned to USP ⟨1663⟩ / ⟨1664⟩ for container-closure and single-use systems.",
        highlights: ["USP ⟨1663⟩", "USP ⟨1664⟩", "Container-closure"],
        leafStatus: "live",
      },
      {
        slug: "reference-standard-characterization",
        label: "Reference standard characterization",
        blurb:
          "Primary and working standard qualification with orthogonal identity, assay and impurity evidence held under the QMS.",
        highlights: ["Primary standards", "Working standards", "Orthogonal ID"],
        leafStatus: "live",
      },
    ],
    liveCopy: "Detail page available",
    shippingNextCopy: "Detail page shipping next",
  },
  lifecycle: {
    eyebrow: "Method lifecycle",
    heading: "Develop → qualify / validate → transfer → maintain",
    lede: "Every analytical method runs through the same four stages, with ownership written into the plan from day one. Executed by Propharmex — authored, qualified, transferred, and maintained against release use under a single quality system.",
    stages: [
      {
        id: "develop",
        label: "Develop",
        description:
          "Method scope, critical method attributes and analytical target profile defined against the specification and ICH Q14. Early method fitness evaluated with risk-ranked parameters.",
      },
      {
        id: "qualify-validate",
        label: "Qualify / validate",
        description:
          "Formal validation under ICH Q2(R2) with pre-defined acceptance criteria — specificity, linearity, accuracy, precision, range, robustness. USP ⟨1225⟩ is referenced where compendial.",
      },
      {
        id: "transfer",
        label: "Transfer",
        description:
          "Protocol-driven method transfer into the release-testing site with comparative testing, pre-agreed equivalence criteria, and a closeout report that travels with the method.",
      },
      {
        id: "maintain",
        label: "Maintain",
        description:
          "System suitability, change-control, periodic review and revalidation triggers owned under the release-testing QMS. Method history is continuous, not re-started at transfer.",
      },
    ],
    handoffNote:
      "Method transfer is a written protocol with equivalence criteria agreed up front. Nothing in the method is re-authored on arrival; the record is continuous under a single quality system.",
  },
  caseRail: {
    eyebrow: "Worked examples",
    heading: "Patterns of work we see",
    lede: "Named case studies land with Prompt 14 — the teasers below describe the pattern of work rather than the clients, in keeping with our policy of using client names only where permission has been granted.",
    teasers: [
      {
        id: "stability-indicating",
        service: "Method development",
        title: "Stability-indicating assay redevelopment for a BCS-II generic",
        body: "Assay and related-substances methods rebuilt to resolve known and forced-degradation impurities, qualified against ICH Q14 attribute targets, and transferred into release use under our Health Canada DEL.",
        status: "under-confirmation",
      },
      {
        id: "elemental-impurities",
        service: "Impurity profiling",
        title: "ICH Q3D elemental impurity risk assessment for an oral solid",
        body: "Risk-based approach across API, excipients, water and container-closure with ICP-MS confirmatory work scoped at control-threshold levels and reported in CTD module 3 shape.",
        status: "under-confirmation",
      },
      {
        id: "method-transfer",
        service: "Method validation",
        title: "Compendial method transfer across two sites",
        body: "USP monograph method transferred with pre-agreed equivalence criteria under ICH Q2(R2); transfer closeout authored for inclusion in the dossier.",
        status: "under-confirmation",
      },
    ],
    cta: {
      label: "Ask for the full, NDA-gated case files",
      href: "/contact?source=as-hub-case-rail",
      variant: "outline",
    },
  },
  closing: {
    eyebrow: "Next step",
    heading: "Bring the specification. We'll bring the method that holds up to it.",
    body: "We scope analytical work around what the specification requires, what the regulator will ask for, and which hub owns which stage of the method's life. Share the draft specification and the programme context — the first call is a working conversation, not a pitch.",
    primaryCta: {
      label: "Scope an analytical programme",
      href: "/contact?source=as-hub-closing-scope",
      variant: "primary",
    },
    secondaryCta: {
      label: "Book a 30-minute call",
      href: "/contact?source=as-hub-closing-call",
      variant: "outline",
    },
  },
};

/* -------------------------------------------------------------------------- */
/*  Method development leaf                                                   */
/* -------------------------------------------------------------------------- */

export const ANALYTICAL_METHOD_DEVELOPMENT: AnalyticalLeafContent = {
  slug: "method-development",
  label: "Method development",
  crumbLabel: "Method development",
  metaTitle: "Analytical Method Development — Propharmex",
  metaDescription:
    "Analytical method development at Propharmex — stability-indicating assay, related-substances and dissolution methods authored in alignment with ICH Q14 and the relevant USP general chapters.",
  ogTitle: "Analytical Method Development — Propharmex",
  ogDescription:
    "From analytical target profile to a method that travels. Executed by Propharmex — developed, qualified under an active IOQ/PQ programme, and transferred into release use under our Health Canada DEL.",
  hero: {
    eyebrow: "Analytical Services · Method development",
    headline: "Methods built against the analytical target profile — not against the first chromatogram that runs.",
    valueProp:
      "Method-development work anchored in ICH Q14, with stability-indicating power and robustness written into the design rather than discovered in validation.",
    lede: "Most method-development briefs we see arrive with a specification, a known degradation concern, and a delivery date. We work the method against the analytical target profile — resolution, specificity, quantitation range, robustness — so that by the time the method enters validation under ICH Q2(R2), its critical attributes are already characterized and the validation is a confirmation step rather than a discovery one.",
    stats: [
      { label: "Development anchor", value: "ICH Q14" },
      { label: "Validation path", value: "ICH Q2(R2)" },
      { label: "Compendial reference", value: "USP ⟨1225⟩" },
    ],
    primaryCta: {
      label: "Scope a method-development project",
      href: "/contact?source=as-method-dev-hero-scope",
      variant: "primary",
    },
    secondaryCta: {
      label: "See the instrument inventory",
      href: "/contact?source=as-method-dev-hero-inventory",
      variant: "outline",
    },
  },
  challenges: {
    eyebrow: "Typical challenges we solve",
    heading: "What method-development briefs actually run into",
    lede: "The headline problems vary — the underlying mechanisms rarely do. The items below are what we end up scoping against on most briefs.",
    items: [
      {
        id: "stability-indicating",
        label: "Making the assay actually stability-indicating",
        description:
          "Forced-degradation studies that separate real degradants from artefacts, and chromatographic conditions that resolve them from the API under realistic storage stress rather than only under acid stress.",
      },
      {
        id: "low-level-impurities",
        label: "Quantitation at reporting and identification thresholds",
        description:
          "Method sensitivity scoped against ICH Q3A(R2) / Q3B(R2) thresholds so reporting, identification and qualification limits are not set by the LOQ of the day.",
      },
      {
        id: "dissolution-discrimination",
        label: "Dissolution that discriminates formulation change",
        description:
          "Media, apparatus and sink-condition choices made under USP ⟨711⟩ so the method tracks formulation change across the programme, not just pass/fail the current batch.",
      },
      {
        id: "robustness",
        label: "Robustness written into design, not found in validation",
        description:
          "Design-of-experiments on column chemistry, mobile-phase pH, organic modifier and gradient slope up front, so robustness in Q2(R2) is a confirmation rather than a rescue.",
      },
      {
        id: "transfer-readiness",
        label: "Methods that survive transfer to another site",
        description:
          "System-suitability limits, column equivalence guidance and instrument-family notes written into the method on day one so a receiving lab does not have to re-develop it.",
      },
    ],
  },
  process: {
    eyebrow: "Our process",
    heading: "From analytical target profile to a transferable method",
    lede: "The stepper reflects the order of work on most method-development projects. The ownership column signals which hub leads — both hubs operate under a single QMS, so handoffs are document-first.",
    steps: [
      {
        id: "analytical-target-profile",
        label: "Analytical target profile",
        description:
          "Intended use, critical method attributes and performance targets defined against the specification and the stage of the programme, per ICH Q14.",
        notes: [
          "Intended use and decision criteria agreed",
          "Critical method attributes ranked by risk",
          "Performance targets anchored to specification",
        ],
      },
      {
        id: "screening",
        label: "Screening and selectivity",
        description:
          "Column and mobile-phase screening against the API and its known degradation pathway. Selectivity evaluated against forced-degradation samples under acid, base, oxidative, thermal and photolytic stress.",
        notes: [
          "Forced degradation per ICH Q1A(R2) and Q1B",
          "Mass-balance and peak-purity checks",
          "Column chemistry shortlist with rationale",
        ],
      },
      {
        id: "optimization",
        label: "Optimization and range",
        description:
          "Gradient, temperature, injection volume and detection wavelength optimized against resolution, peak shape and quantitation range. LOD and LOQ scoped to ICH Q3A/Q3B reporting thresholds.",
        notes: [
          "Resolution and peak-purity criteria set",
          "LOD / LOQ against Q3A/B thresholds",
          "Working range confirmed across specification",
        ],
      },
      {
        id: "robustness-doe",
        label: "Robustness (DoE)",
        description:
          "Design-of-experiments on the parameters most likely to vary between instruments, columns and analysts. System-suitability limits set from the robustness data, not from a single successful run.",
        notes: [
          "DoE on pH, organic modifier, temperature, gradient",
          "System-suitability limits derived from robustness",
          "Column equivalence guidance drafted",
        ],
      },
      {
        id: "qualification",
        label: "Method qualification and pre-validation",
        description:
          "Method qualified for its intended use ahead of formal validation — specificity, accuracy, precision and linearity demonstrated at pre-validation level so the ICH Q2(R2) study confirms rather than discovers.",
        notes: [
          "Pre-validation package under ICH Q2(R2) principles",
          "Raw-data and instrument logs under QMS control",
          "Documented readiness-for-validation assessment",
        ],
      },
      {
        id: "transfer",
        label: "Transfer into release",
        description:
          "Method, system-suitability, and a transfer protocol move into release-testing for comparative testing, equivalence evaluation, and incorporation into the release-testing QMS.",
        notes: [
          "Transfer protocol with equivalence criteria",
          "Comparative testing across analysts and instruments",
          "Closeout report into release QMS",
        ],
      },
    ],
  },
  inventory: {
    eyebrow: "Instrument inventory",
    heading: "What the bench actually runs on",
    lede: "Representative instrument inventory used on method-development projects. All listed instruments are operated under an active IOQ/PQ programme aligned to USP ⟨1058⟩. Sort by technique to see the toolkit against the method in question; current qualification status and calibration records are shared under NDA during the pre-visit briefing.",
    rows: [
      {
        id: "hplc-agilent-1260",
        instrument: "Agilent 1260 Infinity II HPLC (UV / DAD)",
        technique: "HPLC",
        application: "Assay, related substances, dissolution sample analysis",
        qualification: "Qualified under IOQ/PQ programme aligned to USP ⟨1058⟩",
      },
      {
        id: "uhplc-waters-acquity",
        instrument: "Waters ACQUITY UPLC (PDA)",
        technique: "UHPLC",
        application: "Stability-indicating assay, rapid method screening",
        qualification: "IOQ/PQ current under USP ⟨1058⟩",
      },
      {
        id: "lcmsms-xevo-tqs",
        instrument: "Waters Xevo TQ-S triple quadrupole",
        technique: "LC-MS/MS",
        application: "Trace impurities, degradation product identification, genotoxic screening",
        qualification: "IOQ/PQ current; performance verification per in-house protocol",
      },
      {
        id: "gcms-agilent-8890",
        instrument: "Agilent 8890 / 7000D GC-MS",
        technique: "GC-MS",
        application: "Residual solvents per ICH Q3C(R8), volatile impurities",
        qualification: "IOQ/PQ current under USP ⟨1058⟩",
      },
      {
        id: "gc-fid",
        instrument: "Agilent 7890B GC-FID / headspace",
        technique: "GC",
        application: "Residual solvents (compendial), ethanol content",
        qualification: "IOQ/PQ current under USP ⟨1058⟩",
      },
      {
        id: "kf-metrohm",
        instrument: "Metrohm 831 KF Coulometer",
        technique: "Karl Fischer",
        application: "Water content (moisture) across drug substance and product",
        qualification: "IOQ/PQ current; calibration on certified water standards",
      },
      {
        id: "dissolution-distek",
        instrument: "Distek 2500 Select dissolution system",
        technique: "Dissolution",
        application: "USP ⟨711⟩ Apparatus 1 and 2 method development and execution",
        qualification: "Mechanical qualification per USP ⟨711⟩ toolkit; IOQ/PQ current",
      },
      {
        id: "dsc-mettler",
        instrument: "Mettler Toledo DSC 3+",
        technique: "DSC",
        application: "Thermal characterization, polymorph screen, excipient compatibility",
        qualification: "IOQ/PQ current; indium / zinc reference calibration",
      },
      {
        id: "tga-mettler",
        instrument: "Mettler Toledo TGA 2",
        technique: "TGA",
        application: "Thermal decomposition, residual solvent loss, hydrate characterization",
        qualification: "IOQ/PQ current",
      },
      {
        id: "uvvis-cary60",
        instrument: "Agilent Cary 60 UV-Vis",
        technique: "UV-Vis",
        application: "Assay (compendial), content uniformity, dissolution at lower sensitivity",
        qualification: "IOQ/PQ current; holmium-oxide wavelength check",
      },
      {
        id: "ph-seven",
        instrument: "Mettler Toledo SevenExcellence pH / conductivity",
        technique: "pH",
        application: "Mobile-phase and sample pH; routine analytical support",
        qualification: "IOQ/PQ current; daily three-point buffer calibration",
      },
      {
        id: "balance-xpr",
        instrument: "Mettler Toledo XPR analytical balance",
        technique: "Balance",
        application: "Weighing for standards and sample preparation",
        qualification: "IOQ/PQ current; calibration against Class I / E2 weights",
      },
      {
        id: "nmr-bruker",
        instrument: "Bruker Avance NEO 400 NMR (partner laboratory)",
        technique: "NMR",
        application: "Structural elucidation, impurity identification, polymorph confirmation",
        qualification: "Partner-scope — qualification held by partner laboratory under their QMS",
      },
    ],
    representativeNote:
      "Representative inventory. Current qualification status and calibration records are available on request. Partner-scope instruments are operated under the partner laboratory's quality system; the scope of use is documented in our supplier-qualification file.",
    cta: {
      label: "Request current qualification status",
      href: "/contact?source=as-method-dev-inventory",
      variant: "outline",
    },
  },
  outcome: {
    eyebrow: "Outcome pattern",
    heading: "What a well-developed method gets you downstream",
    lede: "The figures below describe the kind of outcomes method-development work targets — not claims against a specific client engagement. Named, permission-cleared case studies arrive with Prompt 14.",
    metrics: [
      {
        id: "stability-indicating",
        label: "Stability-indicating evidence",
        value: "Forced-degradation covered",
        context: "Methods developed with acid, base, oxidative, thermal and photolytic stress evaluated; mass-balance and peak-purity checks documented.",
      },
      {
        id: "validation-readiness",
        label: "Validation readiness",
        value: "Q2(R2) confirmation, not discovery",
        context: "Pre-validation package under ICH Q2(R2) principles so the formal study confirms method performance rather than finds it.",
      },
      {
        id: "transfer",
        label: "Transfer outcome",
        value: "Equivalence, not re-development",
        context: "System-suitability limits and column-equivalence guidance written into the method, so the receiving release lab runs comparative testing rather than re-optimizing.",
      },
    ],
    status: "under-confirmation",
    statusCopy:
      "Documentation available on request. Named case studies land with Prompt 14 once client permissions are confirmed.",
  },
  scoping: {
    eyebrow: "Is this right for you?",
    heading: "Three questions worth answering before the first call",
    lede: "Short scoping set to shape the conversation. Each question has a short helper line below it — the answers prefill the contact form so the first call opens on your context.",
    questions: [
      {
        id: "specification",
        prompt: "Do you have a draft specification, or are we scoping one against the target product profile?",
        helper:
          "If no specification is drafted, we walk through the relevant ICH Q6A/Q6B tests before the method scope is agreed.",
      },
      {
        id: "stage",
        prompt: "What stage is the programme — early development, registration, or commercial?",
        helper:
          "Stage drives the depth of robustness, pre-validation evidence, and transfer documentation we write into the plan.",
      },
      {
        id: "degradation",
        prompt: "Do you have a known or suspected degradation pathway for the API?",
        helper:
          "Known pathways focus the forced-degradation design; suspected ones tell us where to widen it.",
      },
    ],
    cta: {
      label: "Send these answers to the team",
      href: "/contact?source=as-method-dev-scoping",
      variant: "primary",
    },
    disclaimer:
      "The answers shape the first call — they do not commit either side to a scope.",
  },
  faq: {
    eyebrow: "FAQ",
    heading: "Questions we're usually asked on the first call",
    lede: "If your question is not here, send it ahead of the call — we would rather walk in with an answer than improvise one.",
    items: [
      {
        id: "which-hub",
        question: "Which site actually does the method-development work?",
        answer:
          "Method development, qualification and the pre-validation package are authored by Propharmex. Transfer close-out, release testing and ongoing method maintenance sit under the Health Canada Drug Establishment Licence. The record is continuous under a single quality system rather than stitched together at the handoff.",
      },
      {
        id: "q14-vs-q2",
        question: "How do you separate ICH Q14 development work from ICH Q2(R2) validation?",
        answer:
          "Q14 frames the development — analytical target profile, critical method attributes, and the design choices that get the method ready for use. Q2(R2) is the validation study that confirms method performance against pre-defined acceptance criteria. We treat Q14 as the place where robustness is engineered and Q2(R2) as the place where it is demonstrated.",
      },
      {
        id: "pharmacopoeia",
        question: "Do you start from a compendial method when one exists?",
        answer:
          "Where a USP or Ph. Eur. monograph method exists, we start from it and verify its fitness for the sample matrix before proposing changes. Where changes are warranted — for example, a modified form or a combination product — we document them and follow the compendial change rationale expected by the reviewer.",
      },
      {
        id: "dissolution",
        question: "How do you approach dissolution method development?",
        answer:
          "Media and apparatus are selected against the BCS class, the dosage form and the question the method needs to answer. Sink conditions and discriminatory power are demonstrated before the method is locked. The method carries into validation under ICH Q2(R2) and into release use under the DEL without re-authoring.",
      },
      {
        id: "data-integrity",
        question: "How is raw data handled?",
        answer:
          "Chromatographic and instrumental raw data sit under audit-trail-enabled software running on controlled, time-synchronized systems. Data integrity is evaluated against the ALCOA+ principles referenced by MHRA, USFDA and WHO guidance. Access and review are role-based and logged.",
      },
    ],
  },
  related: {
    eyebrow: "Related services",
    heading: "Work that typically runs alongside method development",
    lede: "Method development rarely lives alone. Each link opens the detail for that service.",
    links: [
      {
        id: "pharmaceutical-development",
        label: "Pharmaceutical development",
        description:
          "Formulation and process work on the other side of the bench — analytical methods are typically authored alongside the formulation, not after it.",
        href: "/services/pharmaceutical-development",
      },
      {
        id: "regulatory",
        label: "Regulatory services",
        description:
          "Methods and their validation packages land in Module 3 of the CTD. The regulatory team authors the submission against the analytical evidence.",
        href: "/services/regulatory-services",
      },
      {
        id: "quality",
        label: "Quality and compliance",
        description:
          "The DEL and the unified QMS under which the method is qualified, transferred and released.",
        href: "/quality-compliance",
      },
    ],
  },
  closing: {
    eyebrow: "Next step",
    heading: "Send the specification. We'll send back a method plan you can review with QA.",
    body: "Most first calls are a working conversation: we walk through the API, the specification, the known degradation concerns and the submission plan, and draft a method-development outline against that. If the project fits better with an existing compendial method, we will say so on that call.",
    primaryCta: {
      label: "Scope a method-development project",
      href: "/contact?source=as-method-dev-closing-scope",
      variant: "primary",
    },
    secondaryCta: {
      label: "Book a 30-minute call",
      href: "/contact?source=as-method-dev-closing-call",
      variant: "outline",
    },
    regulatoryNote: {
      kind: "primary",
      label: "ICH Q14 — Analytical Procedure Development",
      href: "https://www.ich.org/page/quality-guidelines",
    },
  },
};

/* -------------------------------------------------------------------------- */
/*  Method validation leaf                                                    */
/* -------------------------------------------------------------------------- */

export const ANALYTICAL_METHOD_VALIDATION: AnalyticalLeafContent = {
  slug: "method-validation",
  label: "Method validation",
  crumbLabel: "Method validation",
  metaTitle: "Analytical Method Validation — Propharmex",
  metaDescription:
    "Method validation to ICH Q2(R2) with USP ⟨1225⟩ referenced — specificity, linearity, accuracy, precision, range, robustness, LOD/LOQ — authored as an auditable package.",
  ogTitle: "Analytical Method Validation — Propharmex",
  ogDescription:
    "Validation that reads as a confirmation, not a discovery. ICH Q2(R2) acceptance criteria pre-agreed, raw data under QMS control, change-control tied from day one.",
  hero: {
    eyebrow: "Analytical Services · Method validation",
    headline: "Validation that confirms what development has already demonstrated.",
    valueProp:
      "Method validation executed against ICH Q2(R2) with USP ⟨1225⟩ referenced where the method is compendial, and acceptance criteria agreed before the first validation injection.",
    lede: "Validation is the wrong place to find out a method is not ready. We treat ICH Q2(R2) as a confirmation stage — specificity, linearity, accuracy, precision, range, robustness and LOD/LOQ demonstrated against pre-defined acceptance criteria — and write the protocol around what the method has already shown in qualification. When the method is compendial, USP ⟨1225⟩ is the companion text. The output is a validation report that a reviewer can read without asking a second question.",
    stats: [
      { label: "Validation anchor", value: "ICH Q2(R2)" },
      { label: "Compendial reference", value: "USP ⟨1225⟩" },
      { label: "Deliverable", value: "Protocol + report + raw data" },
    ],
    primaryCta: {
      label: "Scope a method validation",
      href: "/contact?source=as-method-val-hero-scope",
      variant: "primary",
    },
    secondaryCta: {
      label: "Request a protocol sample",
      href: "/contact?source=as-method-val-hero-protocol",
      variant: "outline",
    },
  },
  challenges: {
    eyebrow: "Typical challenges we solve",
    heading: "What validation packages actually run into",
    lede: "Validation failures are rarely about the analyst — they are about assumptions that were never written down. The items below are what we end up scoping against on most briefs.",
    items: [
      {
        id: "acceptance-criteria",
        label: "Acceptance criteria that hold up in review",
        description:
          "Pre-defined limits for each Q2(R2) characteristic anchored to the specification and the reporting threshold — not retro-fitted after the first injection sequence.",
      },
      {
        id: "specificity",
        label: "Specificity against real impurity profiles",
        description:
          "Forced-degradation, process-impurity and placebo interference covered against a known pathway so specificity is evidenced, not asserted.",
      },
      {
        id: "robustness",
        label: "Robustness that survives the second analyst and the second column",
        description:
          "Robustness designed with the parameters that actually vary in routine use — mobile-phase pH, organic modifier, column lot, temperature, injection volume — and system-suitability limits drawn from the data, not from the method SOP header.",
      },
      {
        id: "lod-loq",
        label: "LOD and LOQ that match the reporting threshold",
        description:
          "Quantitation limits scoped against ICH Q3A(R2) / Q3B(R2) thresholds so the method does not quietly under-report at the levels the regulator expects to see.",
      },
      {
        id: "change-control",
        label: "Change-control tie-in from protocol to post-approval",
        description:
          "Validation protocol referenced against the change-control SOP so any post-validation change — column chemistry, instrument family, reagent source — has a known revalidation path rather than an ad-hoc one.",
      },
    ],
  },
  process: {
    eyebrow: "Our process",
    heading: "From protocol to a reviewer-ready report",
    lede: "The stepper reflects the order of work on most validation packages. Executed by Propharmex — protocol authoring, validation execution, and close-out into the release QMS — under a single quality system.",
    steps: [
      {
        id: "protocol",
        label: "Protocol authoring",
        description:
          "Validation protocol drafted against ICH Q2(R2) with each characteristic, experimental design, sample plan and acceptance criterion defined before execution. USP ⟨1225⟩ is referenced where the method is compendial.",
        notes: [
          "Each Q2(R2) characteristic written with acceptance criteria",
          "Sample and reference standard plan agreed",
          "Change-control cross-reference written into the protocol",
        ],
      },
      {
        id: "readiness",
        label: "Readiness-for-validation review",
        description:
          "Pre-validation evidence from development reviewed against the protocol so any residual risk — sensitivity, selectivity, peak-purity gaps — is addressed before formal execution begins.",
        notes: [
          "Pre-validation gaps documented and closed",
          "System-suitability limits confirmed against robustness data",
          "Instrument qualification status verified",
        ],
      },
      {
        id: "execution",
        label: "Execution of the validation characteristics",
        description:
          "Specificity, linearity, accuracy, precision (repeatability and intermediate), range, LOD/LOQ and robustness executed per protocol. Raw data captured under audit-trail-enabled software with reviewer sign-off per run.",
        notes: [
          "Specificity against forced-degradation samples",
          "Linearity across the working range",
          "Accuracy and precision at specification-relevant levels",
        ],
      },
      {
        id: "report",
        label: "Validation report",
        description:
          "Report drafted against the protocol with each characteristic's results tied to its acceptance criterion. Deviations — where any — are assessed, closed and cross-referenced. The report is the document that travels into the dossier.",
        notes: [
          "Results tied characteristic-by-characteristic to acceptance criteria",
          "Deviations assessed and closed",
          "Raw data index appended",
        ],
      },
      {
        id: "transfer-closeout",
        label: "Transfer close-out and change-control tie-in",
        description:
          "Validation report, method SOP and system-suitability package move into release. The method is registered under the release-testing QMS with change-control references so post-validation changes have a known revalidation path.",
        notes: [
          "Method registered under the release QMS",
          "Change-control cross-reference activated",
          "Revalidation triggers documented",
        ],
      },
    ],
  },
  inventory: {
    eyebrow: "Instrument inventory",
    heading: "What the validation bench actually runs on",
    lede: "Representative inventory used on method-validation programmes. All instruments are operated under an active IOQ/PQ programme aligned to USP ⟨1058⟩. Current qualification status, calibration records and reference-standard certificates are shared under NDA during the pre-visit briefing.",
    rows: [
      {
        id: "hplc-agilent-1260",
        instrument: "Agilent 1260 Infinity II HPLC (UV / DAD)",
        technique: "HPLC",
        application: "Primary validation platform for assay, related substances and dissolution methods",
        qualification: "Qualified under IOQ/PQ programme aligned to USP ⟨1058⟩",
      },
      {
        id: "uhplc-waters-acquity",
        instrument: "Waters ACQUITY UPLC (PDA)",
        technique: "UHPLC",
        application: "Validation of stability-indicating and short-run methods",
        qualification: "IOQ/PQ current under USP ⟨1058⟩",
      },
      {
        id: "second-hplc-family",
        instrument: "Shimadzu LC-2030C Plus HPLC (second instrument family)",
        technique: "HPLC",
        application: "Intermediate-precision runs across a second instrument family for robustness evidence",
        qualification: "IOQ/PQ current under USP ⟨1058⟩",
      },
      {
        id: "column-bank-qualified",
        instrument: "Qualified column bank (C8, C18, phenyl-hexyl, amide)",
        technique: "Columns",
        application: "Column-equivalence and robustness runs; lot-to-lot comparison",
        qualification: "Column lots tracked under QMS; qualification data retained per method",
      },
      {
        id: "lcmsms-xevo-tqs",
        instrument: "Waters Xevo TQ-S triple quadrupole",
        technique: "LC-MS/MS",
        application: "Specificity support for trace-level impurity methods; confirmatory identification",
        qualification: "IOQ/PQ current; performance verification per in-house protocol",
      },
      {
        id: "dissolution-distek",
        instrument: "Distek 2500 Select dissolution system",
        technique: "Dissolution",
        application: "Dissolution validation per USP ⟨711⟩ with mechanical qualification",
        qualification: "Mechanical qualification per USP ⟨711⟩ toolkit; IOQ/PQ current",
      },
      {
        id: "kf-metrohm",
        instrument: "Metrohm 831 KF Coulometer",
        technique: "Karl Fischer",
        application: "Water-content validation against certified water standards",
        qualification: "IOQ/PQ current; calibration on certified water standards",
      },
      {
        id: "balance-xpr",
        instrument: "Mettler Toledo XPR analytical balance",
        technique: "Balance",
        application: "Weighing for standards, samples and linearity serial dilutions",
        qualification: "IOQ/PQ current; calibration against Class I / E2 weights",
      },
      {
        id: "cds-validated",
        instrument: "Chromatography data system (Empower / OpenLab) — validated install",
        technique: "Data system",
        application: "Audit-trail-enabled data acquisition, review and long-term archive",
        qualification: "Computerized-system validation under GAMP 5 principles; IQ/OQ current",
      },
      {
        id: "reference-standards",
        instrument: "Qualified USP / Ph. Eur. reference standards + in-house working standards",
        technique: "Reference standards",
        application: "Identity, assay and impurity reference across validation runs",
        qualification: "Primary standards sourced from USP / Ph. Eur.; working standards qualified under the QMS",
      },
    ],
    representativeNote:
      "Representative inventory. Current qualification and calibration records are available on request. The computerized-system validation status and data-system access matrix are shared under NDA during the pre-visit briefing.",
    cta: {
      label: "Request current qualification status",
      href: "/contact?source=as-method-val-inventory",
      variant: "outline",
    },
  },
  outcome: {
    eyebrow: "Outcome pattern",
    heading: "What a clean validation package gets you downstream",
    lede: "The figures below describe the kind of outcomes validation work targets — not claims against a specific client engagement. Named, permission-cleared case studies arrive with Prompt 14.",
    metrics: [
      {
        id: "first-pass",
        label: "First-pass acceptance",
        value: "Criteria pre-agreed, not retrofitted",
        context: "Acceptance criteria for each Q2(R2) characteristic set in the protocol before execution, so the report reads as a confirmation rather than a justification.",
      },
      {
        id: "dossier-ready",
        label: "Dossier readiness",
        value: "Module 3 shape, on first draft",
        context: "Validation report authored in a structure that drops into CTD Module 3 without re-formatting.",
      },
      {
        id: "change-control",
        label: "Change-control tie-in",
        value: "Revalidation triggers documented",
        context: "Post-validation changes — column chemistry, instrument family, reagent source — have a pre-agreed revalidation path rather than an ad-hoc one.",
      },
    ],
    status: "under-confirmation",
    statusCopy:
      "Documentation available on request. Named case studies land with Prompt 14 once client permissions are confirmed.",
  },
  scoping: {
    eyebrow: "Is this right for you?",
    heading: "Three questions worth answering before the first call",
    lede: "Short scoping set to shape the conversation. Each question has a short helper line below it — the answers prefill the contact form so the first call opens on your context.",
    questions: [
      {
        id: "method-origin",
        prompt: "Is the method developed in-house, a compendial method being verified, or transferred from another site?",
        helper:
          "Origin drives the protocol shape — full validation, compendial verification, or transfer with equivalence criteria.",
      },
      {
        id: "filing-stage",
        prompt: "What's the intended filing — ANDA, NDS/ANDS, DMF, or a post-approval change?",
        helper:
          "Filing stage sets the depth of robustness and the change-control cross-references we write in.",
      },
      {
        id: "deviation-tolerance",
        prompt: "Are there any known method risks we should design the validation around?",
        helper:
          "Known risks — low-level impurities, matrix interference, column-lot variability — are scoped into the protocol rather than discovered in execution.",
      },
    ],
    cta: {
      label: "Send these answers to the team",
      href: "/contact?source=as-method-val-scoping",
      variant: "primary",
    },
    disclaimer:
      "The answers shape the first call — they do not commit either side to a scope.",
  },
  faq: {
    eyebrow: "FAQ",
    heading: "Questions we're usually asked on the first call",
    lede: "If your question is not here, send it ahead of the call — we would rather walk in with an answer than improvise one.",
    items: [
      {
        id: "full-vs-partial",
        question: "When is full validation required versus partial revalidation?",
        answer:
          "Full validation under ICH Q2(R2) applies to a new method or a method being used for a purpose outside its original scope. Partial revalidation is scoped to the change — a new column chemistry, a new instrument family, a new sample matrix — and covers the characteristics most sensitive to that change. The revalidation plan is agreed with QA and written against the change-control SOP.",
      },
      {
        id: "compendial-verification",
        question: "How do you handle compendial method verification versus validation?",
        answer:
          "USP general chapter ⟨1226⟩ governs verification of compendial procedures. Where a USP or Ph. Eur. monograph method is used without modification, we verify fitness for the sample matrix — specificity, accuracy and precision at minimum — rather than re-validating the monograph method. Where the monograph is modified, we treat it as a validation under ICH Q2(R2) and document the rationale.",
      },
      {
        id: "robustness-depth",
        question: "How deep does robustness testing go?",
        answer:
          "Robustness is scoped around the parameters most likely to vary in routine use — mobile-phase pH and organic composition, column temperature, flow, injection volume, and column lot. Where development has already characterized robustness via DoE, the validation run confirms the pre-defined ranges. Where it has not, the validation includes a designed robustness experiment rather than a single-point check.",
      },
      {
        id: "raw-data",
        question: "How is raw data handled during validation?",
        answer:
          "Chromatographic and instrumental raw data sit under audit-trail-enabled software on computerized systems validated under GAMP 5 principles. Each run is reviewed and signed off against the protocol; the raw-data index is appended to the validation report. Data integrity is assessed against the ALCOA+ principles referenced by MHRA, USFDA and WHO guidance.",
      },
      {
        id: "deviations",
        question: "What happens if a validation run fails its acceptance criterion?",
        answer:
          "A deviation is raised, investigated and closed under the QMS. Depending on root cause, the outcome is a re-run under the existing protocol, a protocol amendment with a documented rationale, or a development rework if the method itself is the source of the failure. The deviation and its closure are referenced in the validation report — we do not author around failed runs.",
      },
      {
        id: "timeline",
        question: "How long does a validation typically take?",
        answer:
          "A standard assay and related-substances validation under ICH Q2(R2) typically runs four to eight weeks on the bench once the protocol is approved, with reviewer sign-off and report authoring after. Dissolution, bioanalytical and low-level impurity methods can extend that depending on range and sensitivity requirements. We quote a timeline against the protocol, not before it.",
      },
    ],
  },
  related: {
    eyebrow: "Related services",
    heading: "Work that typically runs alongside method validation",
    lede: "Validation rarely lives alone. Each link opens the detail for that service.",
    links: [
      {
        id: "method-development",
        label: "Method development",
        description:
          "Validation is a confirmation of what development produced — the two services run as one continuous programme on most briefs.",
        href: "/services/analytical-services/method-development",
      },
      {
        id: "stability-studies",
        label: "Stability studies",
        description:
          "Validated methods feed every stability pull; the stability programme depends on the validation package being locked before T0.",
        href: "/services/analytical-services/stability-studies",
      },
      {
        id: "quality",
        label: "Quality and compliance",
        description:
          "The QMS under which protocols are approved, raw data is reviewed, and change-control is tied back to the validated method.",
        href: "/quality-compliance",
      },
    ],
  },
  closing: {
    eyebrow: "Next step",
    heading: "Send the method SOP. We'll send back a validation protocol you can review with QA.",
    body: "Most first calls walk through the method, its intended use, the filing it supports and any known risk — and produce a protocol outline against ICH Q2(R2) that QA can red-line before execution is scheduled. Where the method is compendial, we discuss verification under USP ⟨1226⟩ rather than full validation.",
    primaryCta: {
      label: "Scope a method validation",
      href: "/contact?source=as-method-val-closing-scope",
      variant: "primary",
    },
    secondaryCta: {
      label: "Book a 30-minute call",
      href: "/contact?source=as-method-val-closing-call",
      variant: "outline",
    },
    regulatoryNote: {
      kind: "primary",
      label: "ICH Q2(R2) — Validation of Analytical Procedures",
      href: "https://www.ich.org/page/quality-guidelines",
    },
  },
};

/* -------------------------------------------------------------------------- */
/*  Stability studies leaf                                                    */
/* -------------------------------------------------------------------------- */

export const ANALYTICAL_STABILITY_STUDIES: AnalyticalLeafContent = {
  slug: "stability-studies",
  label: "Stability studies",
  crumbLabel: "Stability studies",
  metaTitle: "Stability Studies — Propharmex",
  metaDescription:
    "Stability studies under ICH Q1A(R2), Q1B and Q1E — long-term, accelerated, intermediate and photostability — with pull cadence aligned to the submission and statistical shelf-life evaluation.",
  ogTitle: "Stability Studies — Propharmex",
  ogDescription:
    "Zone II and IVb conditions, photostability under Q1B, bracketing and matrixing where justified, and shelf-life evaluated per Q1E. The study plan lands before the first sample is pulled.",
  hero: {
    eyebrow: "Analytical Services · Stability studies",
    headline: "Stability studies designed for the dossier, not just the chamber.",
    valueProp:
      "Stability programmes built against ICH Q1A(R2) and the relevant regional annexes, with photostability under Q1B and shelf-life evaluation per Q1E written into the plan from T0.",
    lede: "Stability is the part of the programme where small upfront decisions — storage zone, pull cadence, bracketing design, photostability exposure — decide whether a submission lands cleanly. We scope the study against ICH Q1A(R2) and the intended market's climatic zone, including Zone IVb for markets that require it, author the protocol with Q1E statistical shelf-life evaluation in mind, and operate the chambers against a mapped temperature and humidity profile.",
    stats: [
      { label: "Storage anchor", value: "ICH Q1A(R2)" },
      { label: "Photostability", value: "ICH Q1B" },
      { label: "Shelf-life evaluation", value: "ICH Q1E" },
    ],
    primaryCta: {
      label: "Scope a stability programme",
      href: "/contact?source=as-stability-hero-scope",
      variant: "primary",
    },
    secondaryCta: {
      label: "Ask about chamber availability",
      href: "/contact?source=as-stability-hero-chamber",
      variant: "outline",
    },
  },
  challenges: {
    eyebrow: "Typical challenges we solve",
    heading: "What stability programmes actually run into",
    lede: "Stability plans fail more often in the planning than on the bench. The items below are what we end up scoping against on most briefs.",
    items: [
      {
        id: "zone-selection",
        label: "Climatic-zone selection for intended markets",
        description:
          "Zone II (25°C / 60% RH) versus Zone IVb (30°C / 75% RH) long-term conditions selected against the submission markets, with intermediate conditions added where regional annexes require them.",
      },
      {
        id: "pull-cadence",
        label: "Pull cadence that matches the submission timeline",
        description:
          "T0, 3, 6, 9, 12, 18, 24, 36 months aligned to the ICH Q1A(R2) table and the submission target — with accelerated pulls timed so the data package lands when the regulatory team needs it, not a quarter late.",
      },
      {
        id: "bracketing-matrixing",
        label: "Bracketing and matrixing where the science supports it",
        description:
          "ICH Q1D designs applied where strengths, container sizes or fills justify it — with the statistical rationale documented rather than asserted.",
      },
      {
        id: "photostability",
        label: "Photostability under Q1B that a reviewer will accept",
        description:
          "Option 1 (D65 / ID65) or Option 2 source selection with radiometric and photometric exposure evidence, quinine actinometry where appropriate, and confirmatory and forced-degradation samples covered.",
      },
      {
        id: "stress-testing",
        label: "Stress testing that distinguishes degradants from artefacts",
        description:
          "Forced-degradation under acid, base, oxidative, thermal and photolytic stress at conditions strong enough to produce degradation but short of pyrolysis — so the stability-indicating method is challenged by the right peaks.",
      },
    ],
  },
  process: {
    eyebrow: "Our process",
    heading: "From protocol to a shelf-life that holds up in review",
    lede: "The stepper reflects the order of work on most stability programmes. Executed by Propharmex — study authoring and execution, then post-submission stability and commitment-stability pulls under the release QMS.",
    steps: [
      {
        id: "protocol",
        label: "Stability protocol",
        description:
          "Protocol authored against ICH Q1A(R2) with storage zone, pull cadence, container-closure, test panel and acceptance criteria defined. Bracketing / matrixing rationale documented where applied.",
        notes: [
          "Storage zone matched to markets",
          "Pull cadence aligned to submission date",
          "Bracketing / matrixing rationale per Q1D",
        ],
      },
      {
        id: "stress-testing",
        label: "Stress testing and photostability setup",
        description:
          "Forced-degradation samples generated to confirm stability-indicating power of the method. Photostability exposure designed under ICH Q1B with actinometry evidence.",
        notes: [
          "Acid, base, oxidative, thermal, photolytic stress",
          "ICH Q1B Option 1 or Option 2 source selection",
          "Mass-balance and peak-purity checks documented",
        ],
      },
      {
        id: "chamber-loading",
        label: "Chamber loading and T0",
        description:
          "Samples loaded under mapped chamber conditions with temperature and humidity recorded continuously. T0 testing executed against the protocol acceptance criteria.",
        notes: [
          "Mapped chambers under ICH Q1A(R2) conditions",
          "Continuous temp/RH logging under QMS",
          "T0 run tied to the validated method",
        ],
      },
      {
        id: "pull-points",
        label: "Scheduled pull-point testing",
        description:
          "Samples pulled at each protocol timepoint and tested against the specification. Out-of-specification and out-of-trend results handled under the QMS deviation workflow.",
        notes: [
          "Pull-point execution against the protocol",
          "OOS / OOT investigation under QMS",
          "Interim trending against Q1E expectations",
        ],
      },
      {
        id: "shelf-life",
        label: "Statistical shelf-life evaluation (Q1E)",
        description:
          "Shelf-life and retest period proposed via the statistical approach in ICH Q1E — linear regression with 95% confidence intervals where data supports it, or the most conservative observed value where it does not.",
        notes: [
          "Q1E statistical treatment with model justification",
          "Proposed shelf-life with confidence intervals",
          "Extrapolation rationale where applied",
        ],
      },
      {
        id: "commitment-release",
        label: "Commitment stability and release hand-off",
        description:
          "Post-approval commitment stability moves under the release-testing QMS, with pull-points, method maintenance and any protocol amendments owned at the release site.",
        notes: [
          "Commitment stability under release QMS",
          "Amendment control tied to change-control",
          "Trend reporting to the customer quarterly",
        ],
      },
    ],
  },
  inventory: {
    eyebrow: "Instrument inventory",
    heading: "What the stability programme actually runs on",
    lede: "Representative inventory used on stability programmes. Chambers are operated against a mapped temperature and humidity profile and monitored continuously; analytical instruments are qualified under an active IOQ/PQ programme aligned to USP ⟨1058⟩.",
    rows: [
      {
        id: "chamber-25-60",
        instrument: "Thermolab walk-in chamber — 25°C / 60% RH (Zone II long-term)",
        technique: "Stability chamber",
        application: "ICH Q1A(R2) long-term storage for Zone II markets",
        qualification: "Temperature/humidity mapping current; ICH Q1A(R2) conditions maintained",
      },
      {
        id: "chamber-30-75",
        instrument: "Thermolab walk-in chamber — 30°C / 75% RH (Zone IVb long-term)",
        technique: "Stability chamber",
        application: "ICH Q1A(R2) long-term storage for Zone IVb markets",
        qualification: "Temperature/humidity mapping current; ICH Q1A(R2) conditions maintained",
      },
      {
        id: "chamber-40-75",
        instrument: "Thermolab reach-in chamber — 40°C / 75% RH (accelerated)",
        technique: "Stability chamber",
        application: "Accelerated storage per ICH Q1A(R2)",
        qualification: "Temperature/humidity mapping current; ICH Q1A(R2) conditions maintained",
      },
      {
        id: "chamber-30-65",
        instrument: "Thermolab reach-in chamber — 30°C / 65% RH (intermediate)",
        technique: "Stability chamber",
        application: "Intermediate storage where regional annexes require it",
        qualification: "Temperature/humidity mapping current",
      },
      {
        id: "chamber-2-8",
        instrument: "Cold-storage chamber — 5°C ± 3°C",
        technique: "Stability chamber",
        application: "Refrigerated storage for refrigerated products and photostability controls",
        qualification: "Temperature mapping current; continuous logging under QMS",
      },
      {
        id: "photostab-chamber",
        instrument: "Suntest photostability chamber (ID65 / D65 source)",
        technique: "Photostability",
        application: "ICH Q1B Option 1 exposure with radiometric / photometric dosimetry",
        qualification: "Actinometry-verified exposure; source qualification current",
      },
      {
        id: "data-loggers",
        instrument: "Elitech RCW-2100 temperature / humidity data loggers",
        technique: "Monitoring",
        application: "Continuous T/RH recording across chambers, with excursion alerting",
        qualification: "Loggers calibrated against NIST-traceable references; QMS-controlled",
      },
      {
        id: "hplc-agilent-1260",
        instrument: "Agilent 1260 Infinity II HPLC (UV / DAD)",
        technique: "HPLC",
        application: "Pull-point assay and related-substances analysis",
        qualification: "Qualified under IOQ/PQ programme aligned to USP ⟨1058⟩",
      },
      {
        id: "uhplc-waters-acquity",
        instrument: "Waters ACQUITY UPLC (PDA)",
        technique: "UHPLC",
        application: "Stability-indicating assay on shorter run-time methods",
        qualification: "IOQ/PQ current under USP ⟨1058⟩",
      },
      {
        id: "kf-metrohm",
        instrument: "Metrohm 831 KF Coulometer",
        technique: "Karl Fischer",
        application: "Water-content tracking at stability timepoints",
        qualification: "IOQ/PQ current; calibration on certified water standards",
      },
      {
        id: "dissolution-distek",
        instrument: "Distek 2500 Select dissolution system",
        technique: "Dissolution",
        application: "Dissolution at each pull point per the protocol",
        qualification: "Mechanical qualification per USP ⟨711⟩ toolkit; IOQ/PQ current",
      },
    ],
    representativeNote:
      "Representative inventory. Chamber mapping reports and continuous T/RH monitoring records are shared under NDA during the pre-visit briefing. Chamber availability is scoped against the programme at protocol stage.",
    cta: {
      label: "Ask about chamber availability",
      href: "/contact?source=as-stability-inventory",
      variant: "outline",
    },
  },
  outcome: {
    eyebrow: "Outcome pattern",
    heading: "What a well-scoped stability programme gets you downstream",
    lede: "The figures below describe the kind of outcomes stability programmes target — not claims against a specific client engagement. Named, permission-cleared case studies arrive with Prompt 14.",
    metrics: [
      {
        id: "submission-aligned",
        label: "Submission-aligned data",
        value: "Pull cadence matches filing date",
        context: "Protocol pull-points scheduled so the required 12-month long-term and 6-month accelerated data lands when the dossier needs it.",
      },
      {
        id: "shelf-life",
        label: "Shelf-life evaluation",
        value: "Q1E statistical treatment",
        context: "Proposed shelf-life supported by the statistical approach in ICH Q1E — not the most convenient observed point.",
      },
      {
        id: "photostability-acceptance",
        label: "Photostability evidence",
        value: "Q1B-acceptable exposure",
        context: "Actinometry-verified exposure with confirmatory and forced-degradation samples, authored in the form reviewers expect.",
      },
    ],
    status: "under-confirmation",
    statusCopy:
      "Documentation available on request. Named case studies land with Prompt 14 once client permissions are confirmed.",
  },
  scoping: {
    eyebrow: "Is this right for you?",
    heading: "Three questions worth answering before the first call",
    lede: "Short scoping set to shape the conversation. Each question has a short helper line below it — the answers prefill the contact form so the first call opens on your context.",
    questions: [
      {
        id: "markets",
        prompt: "Which markets are you filing into?",
        helper:
          "Markets set the climatic zone — Zone II, Zone IVb, or both — and whether intermediate conditions are required.",
      },
      {
        id: "submission-date",
        prompt: "When is the submission date we are working back from?",
        helper:
          "The date drives pull cadence so the required long-term and accelerated data lands on time rather than a quarter late.",
      },
      {
        id: "pack-design",
        prompt: "Is the container-closure locked, or are we stability-testing across candidate packs?",
        helper:
          "If pack is unlocked, we discuss bracketing under Q1D rather than running every pack at full cadence.",
      },
    ],
    cta: {
      label: "Send these answers to the team",
      href: "/contact?source=as-stability-scoping",
      variant: "primary",
    },
    disclaimer:
      "The answers shape the first call — they do not commit either side to a scope.",
  },
  faq: {
    eyebrow: "FAQ",
    heading: "Questions we're usually asked on the first call",
    lede: "If your question is not here, send it ahead of the call — we would rather walk in with an answer than improvise one.",
    items: [
      {
        id: "zone-choice",
        question: "Do we need Zone IVb storage as well as Zone II?",
        answer:
          "Zone IVb (30°C / 75% RH) long-term storage is required by markets in hot, humid climates — including much of South Asia, Latin America and sub-Saharan Africa. If the submission targets those markets, Zone IVb is the long-term condition and 40°C / 75% RH remains the accelerated. Zone II remains the long-term for ICH-region and temperate markets. Where both are in scope, both are run.",
      },
      {
        id: "bracketing",
        question: "When is bracketing or matrixing justified under ICH Q1D?",
        answer:
          "Bracketing applies when extremes of a design factor — strength, container size — are tested and intermediates are assumed to behave between them. Matrixing covers a subset of the total combinations at each timepoint. Both require a documented statistical rationale and are not always accepted by regulators; we design them where the science supports it and flag them early for regulatory review.",
      },
      {
        id: "photostability",
        question: "How is photostability run under ICH Q1B?",
        answer:
          "We use Option 1 (D65 / ID65 emission standards) for most drug products, with actinometry evidence for radiometric and photometric exposure. Confirmatory samples, exposed and dark controls, and forced-degradation samples are all run against the stability-indicating method. The exposure, source qualification, and actinometry results are appended to the stability report.",
      },
      {
        id: "stress-vs-stability",
        question: "How do you separate forced-degradation from formal stability?",
        answer:
          "Forced-degradation is a method-development and validation activity — its purpose is to challenge the method's stability-indicating power under extreme stress. Formal stability is a product study under ICH Q1A(R2) conditions, intended to support shelf-life. The two produce different data packages, authored under different protocols, with different reviewer audiences.",
      },
      {
        id: "oos-handling",
        question: "What happens if a pull-point fails its specification?",
        answer:
          "An out-of-specification (OOS) or out-of-trend (OOT) result triggers an investigation under the QMS — sample integrity, method performance, chamber excursions, and statistical review. Depending on root cause, the outcome is a confirmed specification breach, a laboratory error closed with documented rationale, or a protocol amendment. The investigation and its conclusion are referenced in the stability report.",
      },
      {
        id: "commitment-stability",
        question: "How is post-approval commitment stability handled?",
        answer:
          "Commitment stability is written into the original protocol where possible and pulled through into the release QMS at commercial handover. Annual pull-point testing and stability trending are reported to the customer, and any amendment — pack change, strength addition — is routed through change-control with the revalidation and additional-stability path documented.",
      },
    ],
  },
  related: {
    eyebrow: "Related services",
    heading: "Work that typically runs alongside stability",
    lede: "Stability rarely lives alone. Each link opens the detail for that service.",
    links: [
      {
        id: "method-validation",
        label: "Method validation",
        description:
          "Stability-indicating power is established in validation before T0 — the two services are paired on most programmes.",
        href: "/services/analytical-services/method-validation",
      },
      {
        id: "impurity-profiling",
        label: "Impurity profiling",
        description:
          "Degradation impurities identified through stability feed the Q3A/B profile and the control strategy.",
        href: "/services/analytical-services/impurity-profiling",
      },
      {
        id: "regulatory",
        label: "Regulatory services",
        description:
          "Stability data lands in CTD Module 3; the regulatory team authors the submission around it.",
        href: "/services/regulatory-services",
      },
    ],
  },
  closing: {
    eyebrow: "Next step",
    heading: "Share the specification and the filing date. We'll send back a stability plan.",
    body: "Most first calls walk through the target markets, the container-closure, the submission date and the specification — and produce a stability protocol outline against ICH Q1A(R2) that QA and regulatory can review together before chambers are loaded. Where bracketing or matrixing is on the table, we flag the regulatory risk early.",
    primaryCta: {
      label: "Scope a stability programme",
      href: "/contact?source=as-stability-closing-scope",
      variant: "primary",
    },
    secondaryCta: {
      label: "Book a 30-minute call",
      href: "/contact?source=as-stability-closing-call",
      variant: "outline",
    },
    regulatoryNote: {
      kind: "primary",
      label: "ICH Q1A(R2) — Stability Testing of New Drug Substances and Products",
      href: "https://www.ich.org/page/quality-guidelines",
    },
  },
};

/* -------------------------------------------------------------------------- */
/*  Impurity profiling leaf                                                   */
/* -------------------------------------------------------------------------- */

export const ANALYTICAL_IMPURITY_PROFILING: AnalyticalLeafContent = {
  slug: "impurity-profiling",
  label: "Impurity profiling",
  crumbLabel: "Impurity profiling",
  metaTitle: "Impurity Profiling — Propharmex",
  metaDescription:
    "Organic, residual-solvent, elemental and mutagenic impurity workups under ICH Q3A(R2), Q3B(R2), Q3C(R8), Q3D(R2) and M7(R2), with nitrosamine risk assessment included.",
  ogTitle: "Impurity Profiling — Propharmex",
  ogDescription:
    "Q3A/B organic impurities, Q3C residual solvents, Q3D elemental impurities, M7 mutagenic risk, nitrosamine assessment. The profile is authored in CTD shape, not bolted on at the end.",
  hero: {
    eyebrow: "Analytical Services · Impurity profiling",
    headline: "Impurity profiles authored in the shape the reviewer reads them.",
    valueProp:
      "Organic, residual-solvent, elemental and mutagenic impurity work aligned to ICH Q3A(R2), Q3B(R2), Q3C(R8), Q3D(R2) and M7(R2), with nitrosamine risk assessment included.",
    lede: "A clean impurity profile is the argument behind the specification. We work across the ICH Q3 family — Q3A(R2) for drug substance, Q3B(R2) for product, Q3C(R8) for residual solvents with USP ⟨467⟩ referenced, and Q3D(R2) for elemental impurities via USP ⟨232⟩ / ⟨233⟩ with ICP-MS — and bring M7(R2) for mutagenic impurities and the USFDA / EMA nitrosamine guidance into the same package. The profile that lands in Module 3 is written as a connected argument, not a sheaf of assays.",
    stats: [
      { label: "Organic impurities", value: "ICH Q3A(R2) / Q3B(R2)" },
      { label: "Elemental impurities", value: "ICH Q3D(R2) + USP ⟨232⟩/⟨233⟩" },
      { label: "Mutagenic impurities", value: "ICH M7(R2)" },
    ],
    primaryCta: {
      label: "Scope an impurity workup",
      href: "/contact?source=as-impurity-hero-scope",
      variant: "primary",
    },
    secondaryCta: {
      label: "Ask about nitrosamine assessment",
      href: "/contact?source=as-impurity-hero-nitrosamine",
      variant: "outline",
    },
  },
  challenges: {
    eyebrow: "Typical challenges we solve",
    heading: "What impurity profiling briefs actually run into",
    lede: "Impurity work fails most often at the seams — between organic and mutagenic, between Q3C and nitrosamine, between bench and dossier. The items below are what we end up scoping against on most briefs.",
    items: [
      {
        id: "thresholds",
        label: "Thresholds that match the dose and the indication",
        description:
          "Reporting, identification and qualification thresholds set per ICH Q3A(R2) / Q3B(R2) against the daily dose — not pulled from a generic table — so the control strategy is defensible.",
      },
      {
        id: "residual-solvents",
        label: "Residual solvents against Q3C and USP ⟨467⟩",
        description:
          "Class 1, 2 and 3 solvent limits scoped per ICH Q3C(R8) with PDE values applied correctly, and compendial verification against USP ⟨467⟩ where monograph methods are available.",
      },
      {
        id: "elemental-impurities",
        label: "Q3D risk assessment that survives review",
        description:
          "Risk-based approach across API, excipients, water and container-closure with ICP-MS confirmatory work at control-threshold levels per USP ⟨232⟩ / ⟨233⟩ — not 24-element screens without a rationale.",
      },
      {
        id: "m7-purge",
        label: "M7 mutagenic impurity workups and purge arguments",
        description:
          "Potential mutagenic impurities evaluated under ICH M7(R2) with structural alerts, Ames data where needed, and purge arguments documented where the synthesis removes the impurity before the API.",
      },
      {
        id: "nitrosamine",
        label: "Nitrosamine risk assessment against USFDA / EMA guidance",
        description:
          "Structured risk assessment covering API synthesis, excipients, water and packaging with acceptable intake limits per ICH M7 / regulator-specific guidance and confirmatory LC-MS/MS where the assessment requires it.",
      },
    ],
  },
  process: {
    eyebrow: "Our process",
    heading: "From risk assessment to a control strategy the dossier can hold",
    lede: "The stepper reflects the order of work on most impurity profiling briefs. Executed by Propharmex — assessment authoring, confirmatory work, and release-testing methods tied to the final specification — under a single quality system.",
    steps: [
      {
        id: "risk-assessment",
        label: "Risk assessment across Q3 family",
        description:
          "Structured risk review across organic (Q3A/B), residual-solvent (Q3C), elemental (Q3D) and mutagenic (M7) impurity pathways, with nitrosamine covered as a named workstream.",
        notes: [
          "Synthesis route mapped for impurity sources",
          "Excipient, water and container contributions listed",
          "Nitrosamine risk flagged against regulator guidance",
        ],
      },
      {
        id: "method-scoping",
        label: "Analytical method scoping",
        description:
          "Methods scoped per impurity class — LC / LC-MS/MS for organic and mutagenic, GC-MS / HS-GC for residual solvents, ICP-MS for elemental — and qualified for fitness before confirmatory work begins.",
        notes: [
          "Technique mapped to impurity class",
          "Sensitivity against regulator-expected limits",
          "Method qualification before confirmatory runs",
        ],
      },
      {
        id: "confirmatory",
        label: "Confirmatory analysis",
        description:
          "Confirmatory runs at control-threshold levels with identity, quantitation and — where needed — structural elucidation support from a partner HRMS laboratory.",
        notes: [
          "Quantitation at regulator-expected thresholds",
          "Identity confirmation against reference standards",
          "HRMS partner engaged where structural ID is needed",
        ],
      },
      {
        id: "control-strategy",
        label: "Control strategy authoring",
        description:
          "Control strategy drafted against the risk assessment and the confirmatory data — specification limits, in-process controls, supplier qualification, and purge arguments where synthesis removes the impurity.",
        notes: [
          "Specification limits tied to daily dose",
          "In-process controls and supplier qualification",
          "Purge arguments with numerical justification",
        ],
      },
      {
        id: "dossier",
        label: "Module 3 authoring support",
        description:
          "Impurity profile authored in CTD Module 3 shape — S.3.2 drug substance, P.5.5 drug product, with cross-reference to method-validation packages and stability data.",
        notes: [
          "S.3.2 and P.5.5 authored to shape",
          "Cross-reference to validation and stability",
          "Toxicological hand-off where M7 intake limits apply",
        ],
      },
      {
        id: "release",
        label: "Release-testing transfer",
        description:
          "Impurity methods transferred into the release QMS under the standard transfer protocol. Ongoing trending and change-control owned at the release site.",
        notes: [
          "Transfer under equivalence criteria",
          "Release-QMS registration",
          "Trending across commercial batches",
        ],
      },
    ],
  },
  inventory: {
    eyebrow: "Instrument inventory",
    heading: "What impurity profiling actually runs on",
    lede: "Representative inventory used on impurity profiling programmes. All listed instruments are operated under an active IOQ/PQ programme aligned to USP ⟨1058⟩. High-resolution MS for structural elucidation of unknowns is partner-scope, operated under the partner laboratory's quality system.",
    rows: [
      {
        id: "lcmsms-xevo-tqs",
        instrument: "Waters Xevo TQ-S triple quadrupole LC-MS/MS",
        technique: "LC-MS/MS",
        application: "Trace-level organic impurities, mutagenic impurity quantitation, nitrosamine confirmation",
        qualification: "IOQ/PQ current; performance verification per in-house protocol",
      },
      {
        id: "hplc-agilent-1260",
        instrument: "Agilent 1260 Infinity II HPLC (UV / DAD)",
        technique: "HPLC",
        application: "Q3A / Q3B organic impurity quantitation, related-substances profiling",
        qualification: "Qualified under IOQ/PQ programme aligned to USP ⟨1058⟩",
      },
      {
        id: "uhplc-waters-acquity",
        instrument: "Waters ACQUITY UPLC (PDA)",
        technique: "UHPLC",
        application: "High-resolution chromatographic separation of close-eluting impurities",
        qualification: "IOQ/PQ current under USP ⟨1058⟩",
      },
      {
        id: "gcms-agilent-8890",
        instrument: "Agilent 8890 / 7000D GC-MS",
        technique: "GC-MS",
        application: "Q3C(R8) residual solvents, volatile nitrosamine confirmation",
        qualification: "IOQ/PQ current under USP ⟨1058⟩",
      },
      {
        id: "hs-gc",
        instrument: "Agilent 7890B GC-FID with headspace autosampler",
        technique: "HS-GC",
        application: "Residual solvents per USP ⟨467⟩ / Q3C(R8) — Class 1, 2 and 3",
        qualification: "IOQ/PQ current under USP ⟨1058⟩",
      },
      {
        id: "icp-ms",
        instrument: "Agilent 7900 ICP-MS",
        technique: "ICP-MS",
        application: "ICH Q3D(R2) elemental impurities per USP ⟨232⟩ / ⟨233⟩",
        qualification: "IOQ/PQ current; isotopic performance verification per protocol",
      },
      {
        id: "icp-oes",
        instrument: "Agilent 5110 ICP-OES",
        technique: "ICP-OES",
        application: "Elemental impurity screening where ICP-MS sensitivity is not required",
        qualification: "IOQ/PQ current",
      },
      {
        id: "hrms-partner",
        instrument: "Orbitrap-class LC-HRMS (partner laboratory)",
        technique: "LC-HRMS",
        application: "Structural elucidation of unknown impurities under ICH M7(R2) assessments",
        qualification: "Partner-scope — qualification held by partner laboratory under their QMS",
      },
      {
        id: "nmr-bruker",
        instrument: "Bruker Avance NEO 400 NMR (partner laboratory)",
        technique: "NMR",
        application: "Structural elucidation and impurity identification",
        qualification: "Partner-scope — qualification held by partner laboratory under their QMS",
      },
      {
        id: "balance-xpr",
        instrument: "Mettler Toledo XPR analytical balance",
        technique: "Balance",
        application: "Weighing for reference standards and spike-recovery preparation",
        qualification: "IOQ/PQ current; calibration against Class I / E2 weights",
      },
    ],
    representativeNote:
      "Representative inventory. High-resolution MS and NMR are partner-scope, operated under the partner laboratory's QMS; scope of use is documented in our supplier-qualification file. Current qualification and calibration records are shared under NDA during the pre-visit briefing.",
    cta: {
      label: "Request current qualification status",
      href: "/contact?source=as-impurity-inventory",
      variant: "outline",
    },
  },
  outcome: {
    eyebrow: "Outcome pattern",
    heading: "What a connected impurity profile gets you downstream",
    lede: "The figures below describe the kind of outcomes impurity profiling work targets — not claims against a specific client engagement. Named, permission-cleared case studies arrive with Prompt 14.",
    metrics: [
      {
        id: "profile-connected",
        label: "Profile authored as one argument",
        value: "Q3A/B/C/D + M7 in one package",
        context: "The profile reads as a connected risk-and-control argument across organic, solvent, elemental and mutagenic impurities rather than as isolated assay reports.",
      },
      {
        id: "nitrosamine",
        label: "Nitrosamine risk coverage",
        value: "USFDA / EMA guidance addressed",
        context: "Structured risk assessment with acceptable intake limits per ICH M7 and confirmatory LC-MS/MS where the assessment requires it.",
      },
      {
        id: "module-3",
        label: "Module 3 readiness",
        value: "S.3.2 and P.5.5 in shape",
        context: "Impurity sections authored in CTD shape with cross-reference to validation and stability rather than as standalone lab reports.",
      },
    ],
    status: "under-confirmation",
    statusCopy:
      "Documentation available on request. Named case studies land with Prompt 14 once client permissions are confirmed.",
  },
  scoping: {
    eyebrow: "Is this right for you?",
    heading: "Three questions worth answering before the first call",
    lede: "Short scoping set to shape the conversation. Each question has a short helper line below it — the answers prefill the contact form so the first call opens on your context.",
    questions: [
      {
        id: "scope",
        prompt: "Which impurity classes are in scope — organic, residual solvent, elemental, mutagenic, or all of the above?",
        helper:
          "The scope sets the technique stack and whether HRMS partner work is needed for structural ID.",
      },
      {
        id: "nitrosamine",
        prompt: "Has a nitrosamine risk assessment been completed, or is that part of the scope?",
        helper:
          "If not, we run the risk assessment as a structured workstream with confirmatory LC-MS/MS where triggered.",
      },
      {
        id: "filing-stage",
        prompt: "Is this pre-submission, a deficiency response, or a post-approval change?",
        helper:
          "Stage drives how much structural-ID work is in scope and how the profile lands in Module 3.",
      },
    ],
    cta: {
      label: "Send these answers to the team",
      href: "/contact?source=as-impurity-scoping",
      variant: "primary",
    },
    disclaimer:
      "The answers shape the first call — they do not commit either side to a scope.",
  },
  faq: {
    eyebrow: "FAQ",
    heading: "Questions we're usually asked on the first call",
    lede: "If your question is not here, send it ahead of the call — we would rather walk in with an answer than improvise one.",
    items: [
      {
        id: "thresholds",
        question: "How do you set reporting, identification and qualification thresholds?",
        answer:
          "Thresholds are set per ICH Q3A(R2) / Q3B(R2) against the maximum daily dose. For an API at ≤2 g daily dose, the reporting threshold is 0.05%, identification is 0.10%, and qualification is 0.15% (or 1.0 mg/day, whichever is lower) — with the exact values recalculated when the daily dose changes. The specification limits follow from the thresholds, not the other way around.",
      },
      {
        id: "q3c",
        question: "How is Q3C(R8) applied when multiple solvents are present?",
        answer:
          "Each solvent is evaluated against its ICH Q3C PDE and, where the residual levels approach the PDE, summed exposure is evaluated. For multi-solvent products we calculate total PDE exposure and document the rationale. USP ⟨467⟩ monograph methods are used where fit; modified methods are validated and the modification rationale is documented.",
      },
      {
        id: "q3d-risk-assessment",
        question: "How does a Q3D(R2) risk assessment avoid running every element on every batch?",
        answer:
          "Q3D is explicit that the default is a risk-based approach. We map potential elemental sources across the synthesis, excipients, water and container-closure, apply control thresholds per the permitted daily exposures, and confirm by ICP-MS at the elements the risk assessment identifies. Full 24-element screens are run where the route or the raw-material sourcing requires them — not as a default.",
      },
      {
        id: "m7",
        question: "When does M7 apply and what does a purge argument look like?",
        answer:
          "M7(R2) applies to DNA-reactive (mutagenic) impurities. Once a structural alert is identified, the impurity is either controlled to the threshold of toxicological concern (TTC) or carried through a purge argument that shows the synthesis removes it before the API. The purge argument combines physicochemical reasoning, known process fate and — where needed — spike-and-purge experiments to demonstrate removal to an acceptable level.",
      },
      {
        id: "nitrosamine",
        question: "How do you handle nitrosamine risk assessment?",
        answer:
          "We run a structured risk assessment against the USFDA and EMA nitrosamine guidance — API synthesis, excipients, water and packaging reviewed for nitrosating conditions and secondary amine presence. Where the assessment identifies a potential nitrosamine, confirmatory LC-MS/MS at the acceptable intake limit (per ICH M7 and the regulator-specific dose-based limits) is run. The risk assessment and its outcome are documented for the dossier.",
      },
      {
        id: "unknown-impurities",
        question: "How do you handle unknown impurities above the identification threshold?",
        answer:
          "Unknown impurities above the ICH Q3A/B identification threshold are routed to structural elucidation — LC-MS/MS for initial proposal, HRMS at the partner laboratory for accurate mass, and NMR where structure needs to be confirmed. Once identified, the impurity is evaluated for mutagenic risk under M7 and either added to the specification with a qualified limit or argued through a purge / control rationale.",
      },
    ],
  },
  related: {
    eyebrow: "Related services",
    heading: "Work that typically runs alongside impurity profiling",
    lede: "Impurity work rarely lives alone. Each link opens the detail for that service.",
    links: [
      {
        id: "method-development",
        label: "Method development",
        description:
          "Impurity methods are developed alongside the assay — resolution, selectivity and sensitivity decide whether the profile is auditable.",
        href: "/services/analytical-services/method-development",
      },
      {
        id: "stability-studies",
        label: "Stability studies",
        description:
          "Degradation impurities identified during stability feed the Q3B profile and the control strategy.",
        href: "/services/analytical-services/stability-studies",
      },
      {
        id: "reference-standards",
        label: "Reference standard characterization",
        description:
          "Impurity reference standards are characterized and held under the QMS to support quantitation across the programme.",
        href: "/services/analytical-services/reference-standard-characterization",
      },
    ],
  },
  closing: {
    eyebrow: "Next step",
    heading: "Send the route, the specification and the indication. We'll send back a risk-ranked workplan.",
    body: "Most first calls walk through the synthesis route, the excipient list, the daily dose and the markets in scope — and produce an impurity risk-and-control workplan against the ICH Q3 family, M7 and the relevant regulator's nitrosamine guidance. We flag the items that need partner HRMS or NMR work up front rather than later.",
    primaryCta: {
      label: "Scope an impurity workup",
      href: "/contact?source=as-impurity-closing-scope",
      variant: "primary",
    },
    secondaryCta: {
      label: "Book a 30-minute call",
      href: "/contact?source=as-impurity-closing-call",
      variant: "outline",
    },
    regulatoryNote: {
      kind: "primary",
      label: "ICH M7(R2) — Assessment and Control of Mutagenic Impurities",
      href: "https://www.ich.org/page/quality-guidelines",
    },
  },
};

/* -------------------------------------------------------------------------- */
/*  Bioanalytical leaf                                                        */
/* -------------------------------------------------------------------------- */

export const ANALYTICAL_BIOANALYTICAL: AnalyticalLeafContent = {
  slug: "bioanalytical",
  label: "Bioanalytical",
  crumbLabel: "Bioanalytical",
  metaTitle: "Bioanalytical Services — Propharmex",
  metaDescription:
    "LC-MS/MS bioanalytical method development and validation under ICH M10 and the USFDA 2018 bioanalytical method validation guidance, with CRO collaboration for regulated PK sample analysis.",
  ogTitle: "Bioanalytical Services — Propharmex",
  ogDescription:
    "Regulated PK and biomarker quantitation — ICH M10 and USFDA bioanalytical guidance, LC-MS/MS triple-quadrupole workflows, and a CRO-collaboration model for clinical-study sample analysis.",
  hero: {
    eyebrow: "Analytical Services · Bioanalytical",
    headline: "Bioanalytical methods authored to meet regulated-PK expectations on the first validation run.",
    valueProp:
      "LC-MS/MS method development and validation aligned to ICH M10 and the USFDA 2018 bioanalytical method validation guidance, with CRO collaboration where clinical-study samples are analyzed.",
    lede: "Bioanalytical work is unforgiving at the edges — matrix effect, recovery, selectivity and incurred-sample reanalysis decide whether a regulated PK study is accepted or repeated. We develop and validate LC-MS/MS methods against ICH M10 and the USFDA 2018 bioanalytical method validation guidance, scope the calibration curve and QC scheme to the study, and collaborate with accredited CROs for clinical-study sample analysis where the programme requires it.",
    stats: [
      { label: "Validation anchor", value: "ICH M10" },
      { label: "Guidance", value: "USFDA 2018" },
      { label: "Primary platform", value: "LC-MS/MS" },
    ],
    primaryCta: {
      label: "Scope a bioanalytical method",
      href: "/contact?source=as-bioanalytical-hero-scope",
      variant: "primary",
    },
    secondaryCta: {
      label: "Ask about CRO collaboration",
      href: "/contact?source=as-bioanalytical-hero-cro",
      variant: "outline",
    },
  },
  challenges: {
    eyebrow: "Typical challenges we solve",
    heading: "What bioanalytical briefs actually run into",
    lede: "Bioanalytical methods fail in the places the guidance is most specific about. The items below are what we end up scoping against on most briefs.",
    items: [
      {
        id: "matrix-effect",
        label: "Matrix effect and recovery that survive regulated review",
        description:
          "Ion-suppression and matrix-factor experiments run against multiple donor lots, with recovery evaluated across the calibration range — not asserted from a single lot.",
      },
      {
        id: "selectivity",
        label: "Selectivity against endogenous and co-dosed interference",
        description:
          "Selectivity evaluated across blank lots, hemolyzed and lipemic samples, and — where relevant — co-dosed drugs and their metabolites, so interferences are documented rather than discovered mid-study.",
      },
      {
        id: "calibration-qc",
        label: "Calibration and QC schemes that match the PK range",
        description:
          "Calibration range, QC levels and dilution integrity scoped against the expected Cmax and trough concentrations, so the reportable range supports the study rather than constraining it.",
      },
      {
        id: "isr",
        label: "Incurred-sample reanalysis (ISR) built into the plan",
        description:
          "ISR criteria defined per ICH M10 — two-thirds within 20% of original for small molecules — with the sampling strategy agreed before the study runs.",
      },
      {
        id: "biomarker",
        label: "Biomarker quantitation on a fit-for-purpose basis",
        description:
          "Biomarker methods validated to a level matched to the decision they support — exploratory, pharmacodynamic, or registration — with the fit-for-purpose rationale documented against regulator guidance.",
      },
    ],
  },
  process: {
    eyebrow: "Our process",
    heading: "From method scoping to a regulated PK-ready package",
    lede: "The stepper reflects the order of work on most bioanalytical programmes. Some steps run at either hub — the ownership column reflects typical practice; clinical-study sample analysis runs with a collaborating CRO.",
    steps: [
      {
        id: "scoping",
        label: "Method scoping",
        description:
          "Analyte, matrix, expected concentration range and study purpose agreed. Instrument platform, extraction strategy and internal-standard selection drafted against ICH M10 expectations.",
        notes: [
          "Analyte and matrix defined",
          "Calibration range anchored to expected PK",
          "Extraction and IS selection drafted",
        ],
      },
      {
        id: "development",
        label: "Method development",
        description:
          "Chromatographic and mass-spectrometric conditions optimized; extraction chemistry developed with SPE or liquid-liquid depending on analyte behaviour. Matrix effect, recovery and selectivity characterized at development stage.",
        notes: [
          "Chromatographic and MS/MS optimization",
          "Extraction chemistry with recovery data",
          "Matrix-effect screening across donor lots",
        ],
      },
      {
        id: "validation",
        label: "Validation under ICH M10",
        description:
          "Full validation characteristics executed — selectivity, calibration, accuracy, precision, matrix effect, recovery, stability (short-term, freeze-thaw, long-term), dilution integrity and carryover — against pre-defined acceptance criteria.",
        notes: [
          "Pre-defined acceptance criteria per M10",
          "Stability suites including freeze-thaw cycles",
          "Dilution integrity and carryover documented",
        ],
      },
      {
        id: "clinical-sample-analysis",
        label: "Clinical-study sample analysis",
        description:
          "Study samples run by a collaborating accredited CRO under the validated method, with Propharmex providing method ownership, QC review and investigator-facing documentation. ISR run at the protocol-agreed level.",
        notes: [
          "CRO collaboration under signed QA agreement",
          "Real-time QC review per run",
          "ISR per ICH M10 acceptance criteria",
        ],
      },
      {
        id: "reporting",
        label: "Bioanalytical reporting",
        description:
          "Bioanalytical report authored in the shape expected by regulated-PK reviewers — analyte, validation summary, sample accountability, calibration and QC performance, ISR outcome, and deviations closed under the QMS.",
        notes: [
          "ICH M10-shaped report structure",
          "Run-by-run calibration and QC accountability",
          "Deviation summary and closure",
        ],
      },
    ],
  },
  inventory: {
    eyebrow: "Instrument inventory",
    heading: "What the bioanalytical bench actually runs on",
    lede: "Representative inventory used on bioanalytical programmes. All listed instruments are operated under an active IOQ/PQ programme aligned to USP ⟨1058⟩. Clinical-study sample analysis, where in scope, runs at an accredited CRO partner under their quality system and a joint QA agreement.",
    rows: [
      {
        id: "lcmsms-xevo-tqs",
        instrument: "Waters Xevo TQ-S triple quadrupole LC-MS/MS",
        technique: "LC-MS/MS",
        application: "Primary bioanalytical workhorse — small-molecule PK quantitation and biomarker work",
        qualification: "IOQ/PQ current; performance verification per in-house protocol",
      },
      {
        id: "lcmsms-second",
        instrument: "Sciex Triple Quad 5500+ LC-MS/MS",
        technique: "LC-MS/MS",
        application: "Second instrument family for intermediate precision and orthogonal confirmation",
        qualification: "IOQ/PQ current; performance verification per in-house protocol",
      },
      {
        id: "uhplc-waters-acquity",
        instrument: "Waters ACQUITY UPLC (coupled to TQ-S)",
        technique: "UHPLC",
        application: "High-efficiency separation for bioanalytical gradients",
        qualification: "IOQ/PQ current under USP ⟨1058⟩",
      },
      {
        id: "spe-automation",
        instrument: "Tecan Freedom EVO automated SPE workstation",
        technique: "SPE",
        application: "Automated solid-phase extraction for plasma and serum sample preparation",
        qualification: "IOQ/PQ current; protocol verification per extraction method",
      },
      {
        id: "autosampler-cooled",
        instrument: "Waters ACQUITY autosampler with cooled sample holder (4°C)",
        technique: "Autosampler",
        application: "Cooled sample storage through batch runs to protect analyte stability",
        qualification: "IOQ/PQ current; temperature mapping per protocol",
      },
      {
        id: "freezer-80",
        instrument: "Thermo Scientific TSX −80°C ULT freezer (monitored)",
        technique: "Sample storage",
        application: "Long-term storage of plasma / serum study samples with continuous monitoring",
        qualification: "Temperature mapped; continuous logging under QMS with excursion alerting",
      },
      {
        id: "freezer-20",
        instrument: "−20°C freezer bank (monitored)",
        technique: "Sample storage",
        application: "Short-term storage of extracts and working standards",
        qualification: "Temperature mapped; continuous logging under QMS",
      },
      {
        id: "centrifuge-refrig",
        instrument: "Eppendorf 5810R refrigerated centrifuge",
        technique: "Sample prep",
        application: "Refrigerated centrifugation for plasma / serum processing",
        qualification: "IOQ/PQ current; rpm / temperature verified per calibration",
      },
      {
        id: "balance-xpr",
        instrument: "Mettler Toledo XPR analytical / microbalance",
        technique: "Balance",
        application: "Weighing for reference standards and working solutions",
        qualification: "IOQ/PQ current; calibration against Class I / E2 weights",
      },
      {
        id: "cds-bioanalytical",
        instrument: "MassLynx / Analyst chromatography data systems",
        technique: "Data system",
        application: "Audit-trail-enabled acquisition, batch review and archive",
        qualification: "Computerized-system validation under GAMP 5 principles; IQ/OQ current",
      },
    ],
    representativeNote:
      "Representative inventory. Clinical-study sample analysis, where in scope, runs at an accredited CRO partner under their quality system and a joint QA agreement; the partner is documented in our supplier-qualification file.",
    cta: {
      label: "Request current qualification status",
      href: "/contact?source=as-bioanalytical-inventory",
      variant: "outline",
    },
  },
  outcome: {
    eyebrow: "Outcome pattern",
    heading: "What a well-scoped bioanalytical package gets you downstream",
    lede: "The figures below describe the kind of outcomes bioanalytical work targets — not claims against a specific client engagement. Named, permission-cleared case studies arrive with Prompt 14.",
    metrics: [
      {
        id: "m10-aligned",
        label: "ICH M10 alignment",
        value: "Validation characteristics pre-agreed",
        context: "Acceptance criteria for each M10 validation characteristic defined in the protocol before execution, so the validation report confirms rather than justifies.",
      },
      {
        id: "isr",
        label: "Incurred-sample reanalysis",
        value: "Passed at the M10 threshold",
        context: "ISR pass-rate target of two-thirds within 20% of original for small molecules, written into the sample-analysis protocol from day one.",
      },
      {
        id: "cro-handover",
        label: "CRO collaboration",
        value: "Method ownership stays with us",
        context: "Clinical-study sample analysis runs at the CRO; method ownership, QC review and investigator-facing documentation stay with Propharmex.",
      },
    ],
    status: "under-confirmation",
    statusCopy:
      "Documentation available on request. Named case studies land with Prompt 14 once client permissions are confirmed.",
  },
  scoping: {
    eyebrow: "Is this right for you?",
    heading: "Three questions worth answering before the first call",
    lede: "Short scoping set to shape the conversation. Each question has a short helper line below it — the answers prefill the contact form so the first call opens on your context.",
    questions: [
      {
        id: "study-type",
        prompt: "Is this a regulated PK study, a pharmacodynamic / biomarker study, or exploratory?",
        helper:
          "Study type drives validation depth — regulated PK lands the full M10 package; exploratory biomarker work is validated on a fit-for-purpose basis.",
      },
      {
        id: "matrix",
        prompt: "Which matrix — plasma, serum, urine, tissue, or more than one?",
        helper:
          "Matrix choice sets extraction chemistry, selectivity design and stability suite.",
      },
      {
        id: "sample-analysis",
        prompt: "Are we validating only, or also analyzing clinical-study samples?",
        helper:
          "Sample analysis at the CRO requires a signed QA agreement and ISR plan written in at protocol stage.",
      },
    ],
    cta: {
      label: "Send these answers to the team",
      href: "/contact?source=as-bioanalytical-scoping",
      variant: "primary",
    },
    disclaimer:
      "The answers shape the first call — they do not commit either side to a scope.",
  },
  faq: {
    eyebrow: "FAQ",
    heading: "Questions we're usually asked on the first call",
    lede: "If your question is not here, send it ahead of the call — we would rather walk in with an answer than improvise one.",
    items: [
      {
        id: "m10-vs-fda",
        question: "How do you reconcile ICH M10 with the USFDA 2018 guidance?",
        answer:
          "The USFDA 2018 bioanalytical method validation guidance and ICH M10 are broadly harmonized — M10 is now the primary reference, with the 2018 FDA guidance referenced where regional expectations differ. We validate against M10 as the anchor and document any FDA-specific expectations — ISR frequency, incurred-sample selection strategy — that apply to the study.",
      },
      {
        id: "matrix-effect",
        question: "How is matrix effect characterized?",
        answer:
          "Matrix effect is evaluated using the post-extraction spike approach of Matuszewski, run against six individual donor lots plus hemolyzed and lipemic lots for small-molecule assays. The matrix factor is calculated at low and high QC levels with CV across lots reported. Where matrix effect approaches acceptance limits, we either change the extraction chemistry or use a stable-isotope-labelled internal standard to compensate.",
      },
      {
        id: "isr",
        question: "How is incurred-sample reanalysis (ISR) run?",
        answer:
          "ISR is planned at protocol stage — typically 5 to 10% of study samples, selected across subjects and timepoints with emphasis on Cmax and elimination-phase samples. Acceptance per ICH M10 is that at least two-thirds of reanalyzed samples are within 20% of the original for small molecules; for biomarkers, the acceptance is fit-for-purpose and documented in the protocol.",
      },
      {
        id: "cro-collaboration",
        question: "How does the CRO collaboration model work?",
        answer:
          "We develop and validate the method in-house, then transfer the method — SOPs, reference standards, extraction kits and QC plan — to the accredited CRO partner under a joint QA agreement. Study samples run at the CRO; Propharmex remains the method owner, reviews QC data in real time, and authors the bioanalytical report. The CRO is documented in our supplier-qualification file and audited against their quality system.",
      },
      {
        id: "biomarker",
        question: "How are biomarker methods validated?",
        answer:
          "Biomarker methods are validated on a fit-for-purpose basis — validation depth matched to the decision the biomarker supports. For exploratory biomarkers, selectivity, accuracy and precision at relevant levels are sufficient; for pharmacodynamic markers driving dose selection, the validation deepens; for registration-intent biomarkers, the validation approaches full ICH M10. The fit-for-purpose rationale is documented against regulator guidance.",
      },
      {
        id: "stability-plasma",
        question: "What stability data is required for study samples?",
        answer:
          "ICH M10 requires short-term (bench-top), freeze-thaw (typically three cycles), long-term frozen (covering the duration between sample collection and analysis), stock-solution and processed-sample stability. Each is validated at low and high QC levels against a freshly prepared comparator. The long-term frozen condition is extended during sample analysis if the study duration requires it.",
      },
    ],
  },
  related: {
    eyebrow: "Related services",
    heading: "Work that typically runs alongside bioanalytical",
    lede: "Bioanalytical work rarely lives alone. Each link opens the detail for that service.",
    links: [
      {
        id: "method-validation",
        label: "Method validation",
        description:
          "The release-testing side of method validation — ICH Q2(R2) for API and finished-product methods, run as a separate but often concurrent package.",
        href: "/services/analytical-services/method-validation",
      },
      {
        id: "impurity-profiling",
        label: "Impurity profiling",
        description:
          "Metabolite identification and unknown characterization work that can feed bioanalytical selectivity design.",
        href: "/services/analytical-services/impurity-profiling",
      },
      {
        id: "pharmaceutical-development",
        label: "Pharmaceutical development",
        description:
          "Formulation work whose PK profile drives the bioanalytical calibration range and study design.",
        href: "/services/pharmaceutical-development",
      },
    ],
  },
  closing: {
    eyebrow: "Next step",
    heading: "Send the analyte, the matrix and the study design. We'll send back a method plan.",
    body: "Most first calls walk through the analyte, the expected PK range, the matrix and the study purpose — and produce a method-development and validation outline against ICH M10 that CRO and clinical teams can review together. Where clinical-study sample analysis is in scope, we flag CRO partner and QA-agreement requirements early.",
    primaryCta: {
      label: "Scope a bioanalytical method",
      href: "/contact?source=as-bioanalytical-closing-scope",
      variant: "primary",
    },
    secondaryCta: {
      label: "Book a 30-minute call",
      href: "/contact?source=as-bioanalytical-closing-call",
      variant: "outline",
    },
    regulatoryNote: {
      kind: "primary",
      label: "USFDA — Bioanalytical Method Validation Guidance for Industry (2018)",
      href: "https://www.fda.gov/regulatory-information/search-fda-guidance-documents/bioanalytical-method-validation-guidance-industry",
    },
  },
};

/* -------------------------------------------------------------------------- */
/*  Extractables & leachables leaf                                            */
/* -------------------------------------------------------------------------- */

export const ANALYTICAL_EXTRACTABLES_AND_LEACHABLES: AnalyticalLeafContent = {
  slug: "extractables-and-leachables",
  label: "Extractables & leachables",
  crumbLabel: "Extractables & leachables",
  metaTitle: "Extractables & Leachables — Propharmex",
  metaDescription:
    "E&L studies under USP ⟨1663⟩ and ⟨1664⟩, with PQRI / BPOG best-practice frameworks, AET calculation, container-closure and single-use systems, and toxicological risk assessment hand-off.",
  ogTitle: "Extractables & Leachables — Propharmex",
  ogDescription:
    "Controlled extractions, simulation and in-use leachables, AET calculation from dose and exposure, and toxicological risk assessment hand-off for container-closure and single-use systems.",
  hero: {
    eyebrow: "Analytical Services · Extractables & leachables",
    headline: "E&L studies designed around the patient dose, the contact material and the decision the study has to support.",
    valueProp:
      "Extractables and leachables studies aligned to USP ⟨1663⟩ and ⟨1664⟩ with PQRI and BPOG best-practice frameworks, AET calculated from exposure, and toxicological risk assessment hand-off.",
    lede: "E&L work is where chemistry, toxicology and container-closure engineering meet. We design controlled extraction studies under USP ⟨1663⟩, simulation and in-use leachables under USP ⟨1664⟩, and reference PQRI and BPOG best-practice frameworks where the dosage form calls for them — OINDP, parenteral, ophthalmic, and single-use systems. The AET is calculated from the patient dose and exposure; the toxicological risk assessment hand-off is written into the plan rather than tacked on at the end.",
    stats: [
      { label: "Extractables anchor", value: "USP ⟨1663⟩" },
      { label: "Leachables anchor", value: "USP ⟨1664⟩" },
      { label: "Best-practice frameworks", value: "PQRI / BPOG" },
    ],
    primaryCta: {
      label: "Scope an E&L study",
      href: "/contact?source=as-el-hero-scope",
      variant: "primary",
    },
    secondaryCta: {
      label: "Ask about single-use systems",
      href: "/contact?source=as-el-hero-sus",
      variant: "outline",
    },
  },
  challenges: {
    eyebrow: "Typical challenges we solve",
    heading: "What E&L briefs actually run into",
    lede: "E&L fails more often at the design stage than at the bench — wrong solvents, wrong exposure model, wrong AET. The items below are what we end up scoping against on most briefs.",
    items: [
      {
        id: "aet",
        label: "AET calculation anchored to real exposure",
        description:
          "Analytical Evaluation Threshold derived from patient dose, dosage-form exposure and safety concern threshold — not from a default 0.15 µg/day applied without justification.",
      },
      {
        id: "solvent-selection",
        label: "Extraction solvents that match the drug-product chemistry",
        description:
          "Controlled extraction solvent set selected to bracket the polarity and pH of the drug product, with rationale documented rather than reflexive use of water / IPA / hexane.",
      },
      {
        id: "simulation-vs-in-use",
        label: "Simulation versus in-use leachables distinguished clearly",
        description:
          "Simulation leachables run on matrix surrogates to time-plus-margin; in-use leachables run on actual drug product at end-of-shelf-life. The two data sets answer different regulatory questions.",
      },
      {
        id: "single-use",
        label: "Single-use systems with BPOG-aligned extraction design",
        description:
          "Single-use bioprocess components scoped against BPOG extractables protocol with process-relevant solvents, temperatures and contact times — with the link to the downstream drug substance documented.",
      },
      {
        id: "tox-handoff",
        label: "Toxicological risk assessment hand-off that doesn't re-open chemistry",
        description:
          "Extractables and leachables data delivered in the shape a toxicologist can work from — compound identification, confidence level, measured concentration, dose-exposure calculation — so the TRA lands on the first review cycle.",
      },
    ],
  },
  process: {
    eyebrow: "Our process",
    heading: "From AET to a TRA-ready data package",
    lede: "The stepper reflects the order of work on most E&L programmes. Executed by Propharmex — study authoring and execution, plus release-testing-tied leachables and post-approval commitments — under a single quality system.",
    steps: [
      {
        id: "scoping-aet",
        label: "Study scoping and AET calculation",
        description:
          "Drug-product scope, container-closure or single-use component inventory, patient dose and exposure mapped. AET calculated from dose, exposure and safety concern threshold.",
        notes: [
          "Component inventory against dosage form",
          "AET from dose and exposure, not default",
          "Route-of-administration risk ranking",
        ],
      },
      {
        id: "extractables",
        label: "Controlled extraction studies (USP ⟨1663⟩)",
        description:
          "Controlled extractions run under time-and-temperature conditions that bracket product storage and use. Solvent set selected against drug-product polarity and pH range.",
        notes: [
          "Solvent set bracketed to product chemistry",
          "Exaggerated time-and-temperature conditions",
          "Non-target screening across GC-MS, LC-MS, ICP-MS",
        ],
      },
      {
        id: "identification",
        label: "Identification and semi-quantitation",
        description:
          "Extractable compounds identified at the AET or above, with confidence levels documented (confirmed by reference standard, tentatively identified, or unknown class). Semi-quantitation against surrogate response factors.",
        notes: [
          "Identification confidence levels documented",
          "Semi-quantitation against surrogate standards",
          "Compounds below AET excluded with rationale",
        ],
      },
      {
        id: "leachables",
        label: "Simulation and in-use leachables (USP ⟨1664⟩)",
        description:
          "Simulation leachables run on drug product or matrix surrogate. In-use leachables run on aged drug product at end-of-shelf-life, with results reconciled against the extractables profile.",
        notes: [
          "Simulation study to time-plus-margin",
          "In-use leachables at end-of-shelf-life",
          "Reconciliation against extractables profile",
        ],
      },
      {
        id: "tra-handoff",
        label: "Toxicological risk assessment hand-off",
        description:
          "Extractables and leachables package delivered to the toxicologist in a shape that supports TRA authoring — compound, ID confidence, measured concentration, daily exposure, applicable threshold.",
        notes: [
          "Data shaped for toxicologist review",
          "Per-compound daily exposure calculated",
          "ICH Q3D crossover for elemental extractables",
        ],
      },
      {
        id: "release",
        label: "Release and post-approval leachables",
        description:
          "Periodic release and post-approval leachables monitoring run under the release QMS, with any trending or specification change routed through change-control.",
        notes: [
          "Release leachables under release QMS",
          "Post-approval commitment tracking",
          "Change-control on container-closure changes",
        ],
      },
    ],
  },
  inventory: {
    eyebrow: "Instrument inventory",
    heading: "What the E&L bench actually runs on",
    lede: "Representative inventory used on extractables and leachables programmes. All listed instruments are operated under an active IOQ/PQ programme aligned to USP ⟨1058⟩. High-resolution MS for unknown extractable identification is partner-scope, operated under the partner laboratory's quality system.",
    rows: [
      {
        id: "gcms-agilent-8890",
        instrument: "Agilent 8890 / 7000D GC-MS",
        technique: "GC-MS",
        application: "Volatile and semi-volatile extractables identification and quantitation",
        qualification: "IOQ/PQ current under USP ⟨1058⟩",
      },
      {
        id: "hs-gcms",
        instrument: "Agilent 8890 GC-MS with headspace autosampler",
        technique: "HS-GC-MS",
        application: "Volatile extractables by headspace sampling",
        qualification: "IOQ/PQ current",
      },
      {
        id: "lcms-xevo",
        instrument: "Waters Xevo TQ-S LC-MS/MS",
        technique: "LC-MS/MS",
        application: "Semi-volatile and non-volatile extractables / leachables quantitation",
        qualification: "IOQ/PQ current; performance verification per protocol",
      },
      {
        id: "icp-ms",
        instrument: "Agilent 7900 ICP-MS",
        technique: "ICP-MS",
        application: "Elemental extractables per ICH Q3D crossover from container-closure",
        qualification: "IOQ/PQ current under USP ⟨1058⟩",
      },
      {
        id: "hplc-dad",
        instrument: "Agilent 1260 Infinity II HPLC (DAD)",
        technique: "HPLC-DAD",
        application: "Non-volatile extractables screening and quantitation",
        qualification: "Qualified under IOQ/PQ programme aligned to USP ⟨1058⟩",
      },
      {
        id: "uvvis-cary60",
        instrument: "Agilent Cary 60 UV-Vis",
        technique: "UV-Vis",
        application: "Non-specific extractable screening and TOC support",
        qualification: "IOQ/PQ current",
      },
      {
        id: "toc",
        instrument: "Sievers M9 TOC analyzer",
        technique: "TOC",
        application: "Total organic carbon as a non-specific extractables indicator",
        qualification: "IOQ/PQ current; calibration per USP ⟨643⟩",
      },
      {
        id: "ph-seven",
        instrument: "Mettler Toledo SevenExcellence pH / conductivity",
        technique: "pH",
        application: "Extraction solvent and leachable matrix pH / conductivity",
        qualification: "IOQ/PQ current; daily three-point buffer calibration",
      },
      {
        id: "spe-extract",
        instrument: "Biotage Extrahera automated SPE workstation",
        technique: "SPE",
        application: "Sample concentration and clean-up for trace leachable analysis",
        qualification: "IOQ/PQ current",
      },
      {
        id: "hrms-partner",
        instrument: "Orbitrap-class LC-HRMS (partner laboratory)",
        technique: "LC-HRMS",
        application: "Structural elucidation of unknown extractables",
        qualification: "Partner-scope — qualification held by partner laboratory under their QMS",
      },
    ],
    representativeNote:
      "Representative inventory. High-resolution MS is partner-scope, operated under the partner laboratory's QMS; scope of use is documented in our supplier-qualification file. Current qualification and calibration records are shared under NDA during the pre-visit briefing.",
    cta: {
      label: "Request current qualification status",
      href: "/contact?source=as-el-inventory",
      variant: "outline",
    },
  },
  outcome: {
    eyebrow: "Outcome pattern",
    heading: "What a well-scoped E&L package gets you downstream",
    lede: "The figures below describe the kind of outcomes E&L work targets — not claims against a specific client engagement. Named, permission-cleared case studies arrive with Prompt 14.",
    metrics: [
      {
        id: "aet-defensible",
        label: "Defensible AET",
        value: "Calculated from dose and exposure",
        context: "AET derived from patient dose, dosage-form exposure and safety concern threshold — with the calculation documented for review rather than a default applied.",
      },
      {
        id: "tra-first-pass",
        label: "Toxicological hand-off",
        value: "TRA-ready on first delivery",
        context: "Data delivered in the shape a toxicologist can author from — compound, ID confidence, measured concentration, daily exposure — so the TRA lands on first cycle.",
      },
      {
        id: "frameworks-referenced",
        label: "Frameworks referenced",
        value: "USP ⟨1663⟩/⟨1664⟩ + PQRI / BPOG",
        context: "Study design references the relevant best-practice framework — PQRI for OINDP, BPOG for single-use — with rationale documented rather than implied.",
      },
    ],
    status: "under-confirmation",
    statusCopy:
      "Documentation available on request. Named case studies land with Prompt 14 once client permissions are confirmed.",
  },
  scoping: {
    eyebrow: "Is this right for you?",
    heading: "Three questions worth answering before the first call",
    lede: "Short scoping set to shape the conversation. Each question has a short helper line below it — the answers prefill the contact form so the first call opens on your context.",
    questions: [
      {
        id: "dosage-form",
        prompt: "What is the dosage form — parenteral, OINDP, ophthalmic, oral, or a bioprocess single-use application?",
        helper:
          "Dosage form drives the applicable framework — PQRI for OINDP, BPOG for single-use, and USP ⟨1663⟩/⟨1664⟩ as the common spine.",
      },
      {
        id: "stage",
        prompt: "Is this an extractables study, a leachables study, or both?",
        helper:
          "Extractables typically run first to define the search space; leachables confirm what actually migrates into the product in use.",
      },
      {
        id: "tra",
        prompt: "Will a toxicologist be engaged on your side, or do we need to arrange the TRA?",
        helper:
          "We deliver the data package in TRA-ready shape and can arrange a toxicologist partner where one is not in place.",
      },
    ],
    cta: {
      label: "Send these answers to the team",
      href: "/contact?source=as-el-scoping",
      variant: "primary",
    },
    disclaimer:
      "The answers shape the first call — they do not commit either side to a scope.",
  },
  faq: {
    eyebrow: "FAQ",
    heading: "Questions we're usually asked on the first call",
    lede: "If your question is not here, send it ahead of the call — we would rather walk in with an answer than improvise one.",
    items: [
      {
        id: "aet",
        question: "How is the AET calculated?",
        answer:
          "The Analytical Evaluation Threshold is derived from the Safety Concern Threshold (SCT), the patient daily dose, and the dosage-form exposure. For most drug products the SCT is 1.5 µg/day per TTC principles, adjusted for dose and route of administration. The AET sets the analytical reporting floor — compounds detected above AET are reported, identified and passed to the toxicologist; compounds below are excluded with documented rationale.",
      },
      {
        id: "extractables-vs-leachables",
        question: "What's the difference between extractables and leachables?",
        answer:
          "Extractables are what can be extracted from a contact material under exaggerated conditions — stronger solvents, longer time, higher temperature than actual use. Leachables are what actually migrates into the drug product under normal storage and use. The extractables profile defines the search space; the leachables profile confirms what crosses into the product. The two studies answer different questions and are designed together.",
      },
      {
        id: "pqri-bpog",
        question: "When do PQRI and BPOG frameworks apply?",
        answer:
          "PQRI (Product Quality Research Institute) best-practice recommendations apply to orally-inhaled and nasal drug products (OINDP) and, by extension, to parenteral and ophthalmic dosage forms where higher risk dictates more rigorous E&L. BPOG (BioPhorum Operations Group) best-practice protocols apply to single-use bioprocess systems used in drug substance and drug product manufacturing. We reference the applicable framework in the study design and document the rationale.",
      },
      {
        id: "single-use",
        question: "How are single-use systems studied?",
        answer:
          "Single-use components — bags, tubing, filters, connectors — are studied against the BPOG extractables protocol with process-relevant solvents, temperatures and contact times. The link between the extractable profile and the drug substance or drug product is documented, with carryover calculations from component to batch. For novel or high-risk components, additional simulation work is scoped in.",
      },
      {
        id: "identification",
        question: "How is identification of extractables handled?",
        answer:
          "Identification is assigned a confidence level — confirmed (matched to a reference standard with retention time and mass spectrum), tentatively identified (matched to a library or accurate mass proposal without reference standard), or unknown class (molecular formula or structural class proposed). Partner HRMS work is engaged for unknown identification where accurate mass and fragmentation-pattern analysis is required.",
      },
      {
        id: "elemental",
        question: "How do elemental extractables from container-closure interact with ICH Q3D?",
        answer:
          "Container-closure systems are one of the sources evaluated under ICH Q3D(R2) elemental impurity risk assessments. Where the E&L study identifies elemental extractables at or above control thresholds, the data feeds the Q3D assessment and, where required, confirmatory ICP-MS at the relevant elements is run per USP ⟨232⟩/⟨233⟩. The two workstreams are reconciled in the control strategy.",
      },
    ],
  },
  related: {
    eyebrow: "Related services",
    heading: "Work that typically runs alongside E&L",
    lede: "E&L rarely lives alone. Each link opens the detail for that service.",
    links: [
      {
        id: "impurity-profiling",
        label: "Impurity profiling",
        description:
          "Elemental extractables from container-closure feed the ICH Q3D risk assessment; the two workstreams are scoped together.",
        href: "/services/analytical-services/impurity-profiling",
      },
      {
        id: "stability-studies",
        label: "Stability studies",
        description:
          "In-use leachables are measured on aged drug product at end-of-shelf-life — the stability chamber supply is the leachables sample supply.",
        href: "/services/analytical-services/stability-studies",
      },
      {
        id: "pharmaceutical-development",
        label: "Pharmaceutical development",
        description:
          "Container-closure and single-use system selection decided in formulation / process development drives the E&L scope.",
        href: "/services/pharmaceutical-development",
      },
    ],
  },
  closing: {
    eyebrow: "Next step",
    heading: "Share the dosage form, the component inventory and the dose. We'll send back an E&L plan.",
    body: "Most first calls walk through the dosage form, the container-closure or single-use component inventory, the patient dose and the submission plan — and produce an E&L study outline against USP ⟨1663⟩/⟨1664⟩ and the relevant best-practice framework. The AET and TRA hand-off shape are agreed up front rather than negotiated later.",
    primaryCta: {
      label: "Scope an E&L study",
      href: "/contact?source=as-el-closing-scope",
      variant: "primary",
    },
    secondaryCta: {
      label: "Book a 30-minute call",
      href: "/contact?source=as-el-closing-call",
      variant: "outline",
    },
    regulatoryNote: {
      kind: "primary",
      label: "USP ⟨1663⟩ — Assessment of Extractables Associated with Pharmaceutical Packaging / Delivery Systems",
      href: "https://www.usp.org/",
    },
  },
};

/* -------------------------------------------------------------------------- */
/*  Reference standard characterization leaf                                  */
/* -------------------------------------------------------------------------- */

export const ANALYTICAL_REFERENCE_STANDARD_CHARACTERIZATION: AnalyticalLeafContent = {
  slug: "reference-standard-characterization",
  label: "Reference standard characterization",
  crumbLabel: "Reference standards",
  metaTitle: "Reference Standard Characterization — Propharmex",
  metaDescription:
    "Primary and working reference standard qualification under USP ⟨11⟩, the USP General Notices, ICH Q6A and Ph. Eur. 5.12 — orthogonal identity, assay, impurity profile and stability monitoring.",
  ogTitle: "Reference Standard Characterization — Propharmex",
  ogDescription:
    "Primary versus working standard qualification, orthogonal identity by NMR / IR / MS, assay by mass balance, impurity profile and stability monitoring — all under QMS control.",
  hero: {
    eyebrow: "Analytical Services · Reference standards",
    headline: "Reference standards whose paperwork reads as clearly as their spectra.",
    valueProp:
      "Primary and working reference standard qualification anchored on USP ⟨11⟩, the USP General Notices on reference standards, ICH Q6A and Ph. Eur. chapter 5.12.",
    lede: "A working standard is only as good as the characterization behind it. We qualify primary and working reference standards with orthogonal identity — NMR, IR, MS, elemental analysis where relevant — assay by mass balance, impurity profile, water and residual-solvent content, and a stability-monitoring schedule. Where a USP or Ph. Eur. primary standard is available, the working standard is qualified against it; where not, the characterization is built from first principles and held under QMS control.",
    stats: [
      { label: "Compendial anchor", value: "USP ⟨11⟩ + Ph. Eur. 5.12" },
      { label: "Specification anchor", value: "ICH Q6A" },
      { label: "Control", value: "QMS-held CoA and stability" },
    ],
    primaryCta: {
      label: "Scope a reference standard qualification",
      href: "/contact?source=as-refstd-hero-scope",
      variant: "primary",
    },
    secondaryCta: {
      label: "Ask about working-standard requalification",
      href: "/contact?source=as-refstd-hero-requal",
      variant: "outline",
    },
  },
  challenges: {
    eyebrow: "Typical challenges we solve",
    heading: "What reference standard briefs actually run into",
    lede: "Reference standards fail in the seams — incomplete identity, assay that doesn't balance, stability that was never monitored. The items below are what we end up scoping against on most briefs.",
    items: [
      {
        id: "primary-vs-working",
        label: "Primary versus working standard decisions made explicit",
        description:
          "Primary standard selected against a compendial source where available; working standards qualified against the primary with a documented qualification protocol and CoA.",
      },
      {
        id: "orthogonal-identity",
        label: "Orthogonal identity that actually disambiguates",
        description:
          "Identity by at least two orthogonal techniques — typically NMR, IR, MS or elemental analysis — so a polymorph or stereoisomer does not slip through on a single-technique check.",
      },
      {
        id: "assay-mass-balance",
        label: "Assay by mass balance, not by chromatography alone",
        description:
          "Assay calculated via mass balance — 100% minus water, residual solvents, inorganic residues and organic impurities — with chromatographic assay run as a check, not as the primary value.",
      },
      {
        id: "impurity-profile",
        label: "Impurity profile tied to the specification",
        description:
          "Impurity content characterized to support the release specification of the drug substance, so standards used in release testing report against the same profile the product is specified to.",
      },
      {
        id: "stability-monitoring",
        label: "Stability monitoring that doesn't lapse",
        description:
          "Working standards placed on a pre-agreed requalification schedule with defined triggers — time, analytical drift, exposure — so expiry does not surface mid-batch release.",
      },
    ],
  },
  process: {
    eyebrow: "Our process",
    heading: "From source material to a QMS-controlled CoA",
    lede: "The stepper reflects the order of work on most reference-standard qualifications. Executed by Propharmex — characterization package authoring, plus working-standard custody in the release-testing QMS and requalification cycles — under a single quality system.",
    steps: [
      {
        id: "scoping",
        label: "Scoping — primary or working?",
        description:
          "Intended use scoped — release testing, method validation, impurity quantitation, stability reference. Primary source identified where available (USP, Ph. Eur., in-house primary) and qualification path selected.",
        notes: [
          "Intended use and downstream assay mapped",
          "Compendial primary source checked",
          "Qualification protocol drafted",
        ],
      },
      {
        id: "identity",
        label: "Orthogonal identity",
        description:
          "Identity confirmed by at least two orthogonal techniques — NMR and IR / MS typical, with elemental analysis where structure or purity warrants. Partner NMR laboratory engaged where structural confirmation is needed.",
        notes: [
          "NMR (partner), IR, MS identity evidence",
          "Stereochemistry and polymorph flags",
          "Reference against compendial primary where available",
        ],
      },
      {
        id: "purity-panel",
        label: "Purity panel",
        description:
          "Water by Karl Fischer, residual solvents by GC/HS-GC, inorganic residues by sulphated-ash and ICP-MS (where elemental risk exists), and organic impurity profile by HPLC / LC-MS/MS.",
        notes: [
          "Water by KF; residual solvents per Q3C / USP ⟨467⟩",
          "Inorganic residues + elemental by ICP-MS",
          "Organic impurity profile tied to specification",
        ],
      },
      {
        id: "assay-mass-balance",
        label: "Assay by mass balance",
        description:
          "Assay value calculated by mass balance — 100% minus water, residual solvents, inorganic residues and organic impurities — with chromatographic assay run as a cross-check and variance documented.",
        notes: [
          "Mass-balance assay calculation",
          "Chromatographic assay as confirmatory",
          "Variance documented and reconciled",
        ],
      },
      {
        id: "coa-authoring",
        label: "Certificate of analysis authoring",
        description:
          "CoA authored with identity evidence, purity panel, assay, impurity profile, storage conditions and expiry. CoA held under QMS with versioning; superseded versions retained.",
        notes: [
          "CoA structure per USP General Notices",
          "Storage conditions and expiry rationale",
          "QMS-controlled document ID",
        ],
      },
      {
        id: "stability-requal",
        label: "Stability monitoring and requalification",
        description:
          "Working standards placed on a stability monitoring schedule with requalification triggers — periodic analytical check, visual inspection, exposure events. Requalification runs under the release QMS.",
        notes: [
          "Stability monitoring schedule written",
          "Requalification triggers defined",
          "Release-QMS custody of working standards",
        ],
      },
    ],
  },
  inventory: {
    eyebrow: "Instrument inventory",
    heading: "What the reference-standard bench actually runs on",
    lede: "Representative inventory used on reference-standard qualification. All listed instruments are operated under an active IOQ/PQ programme aligned to USP ⟨1058⟩. NMR is partner-scope, operated under the partner laboratory's quality system.",
    rows: [
      {
        id: "hplc-agilent-1260",
        instrument: "Agilent 1260 Infinity II HPLC (UV / DAD)",
        technique: "HPLC",
        application: "Organic impurity profile and chromatographic assay cross-check",
        qualification: "Qualified under IOQ/PQ programme aligned to USP ⟨1058⟩",
      },
      {
        id: "uhplc-waters-acquity",
        instrument: "Waters ACQUITY UPLC (PDA)",
        technique: "UHPLC",
        application: "High-resolution impurity profiling and purity check",
        qualification: "IOQ/PQ current under USP ⟨1058⟩",
      },
      {
        id: "lcmsms-xevo-tqs",
        instrument: "Waters Xevo TQ-S LC-MS/MS",
        technique: "LC-MS/MS",
        application: "Trace impurity confirmation and low-level quantitation",
        qualification: "IOQ/PQ current; performance verification per protocol",
      },
      {
        id: "nmr-bruker",
        instrument: "Bruker Avance NEO 400 NMR (partner laboratory)",
        technique: "NMR",
        application: "Orthogonal identity; structural confirmation; quantitative NMR where applied",
        qualification: "Partner-scope — qualification held by partner laboratory under their QMS",
      },
      {
        id: "ftir",
        instrument: "Agilent Cary 630 FT-IR (ATR)",
        technique: "FT-IR",
        application: "Orthogonal identity by IR fingerprint",
        qualification: "IOQ/PQ current; polystyrene reference check",
      },
      {
        id: "dsc-mettler",
        instrument: "Mettler Toledo DSC 3+",
        technique: "DSC",
        application: "Melting-point, polymorph confirmation and purity by DSC",
        qualification: "IOQ/PQ current; indium / zinc reference calibration",
      },
      {
        id: "tga-mettler",
        instrument: "Mettler Toledo TGA 2",
        technique: "TGA",
        application: "Residual solvent loss, hydrate / solvate characterization",
        qualification: "IOQ/PQ current",
      },
      {
        id: "kf-metrohm",
        instrument: "Metrohm 831 KF Coulometer",
        technique: "Karl Fischer",
        application: "Water content for mass-balance assay",
        qualification: "IOQ/PQ current; calibration on certified water standards",
      },
      {
        id: "gcms-agilent-8890",
        instrument: "Agilent 8890 / 7000D GC-MS with headspace",
        technique: "GC-MS",
        application: "Residual solvents per Q3C(R8) / USP ⟨467⟩",
        qualification: "IOQ/PQ current under USP ⟨1058⟩",
      },
      {
        id: "uvvis-cary60",
        instrument: "Agilent Cary 60 UV-Vis",
        technique: "UV-Vis",
        application: "Absorptivity and spectral identity",
        qualification: "IOQ/PQ current; holmium-oxide wavelength check",
      },
      {
        id: "icp-ms",
        instrument: "Agilent 7900 ICP-MS",
        technique: "ICP-MS",
        application: "Elemental content for mass-balance and Q3D crossover",
        qualification: "IOQ/PQ current under USP ⟨1058⟩",
      },
      {
        id: "balance-xpr",
        instrument: "Mettler Toledo XPR analytical / microbalance",
        technique: "Balance",
        application: "Weighing for mass-balance assay and CoA preparation",
        qualification: "IOQ/PQ current; calibration against Class I / E2 weights",
      },
    ],
    representativeNote:
      "Representative inventory. NMR is partner-scope, operated under the partner laboratory's QMS; scope of use is documented in our supplier-qualification file. Current qualification and calibration records are shared under NDA during the pre-visit briefing.",
    cta: {
      label: "Request current qualification status",
      href: "/contact?source=as-refstd-inventory",
      variant: "outline",
    },
  },
  outcome: {
    eyebrow: "Outcome pattern",
    heading: "What a fully characterized reference standard gets you downstream",
    lede: "The figures below describe the kind of outcomes reference-standard characterization work targets — not claims against a specific client engagement. Named, permission-cleared case studies arrive with Prompt 14.",
    metrics: [
      {
        id: "orthogonal-id",
        label: "Orthogonal identity",
        value: "Two or more techniques",
        context: "Identity evidenced by NMR, IR, MS or elemental analysis rather than a single-technique check — disambiguating polymorph and stereoisomer risk.",
      },
      {
        id: "mass-balance",
        label: "Assay by mass balance",
        value: "Cross-checked chromatographically",
        context: "Assay derived from 100% minus water, residual solvents, inorganic residues and organic impurities, with a chromatographic check and reconciled variance.",
      },
      {
        id: "coa-qms",
        label: "CoA under QMS",
        value: "Versioned, stable, requalified",
        context: "CoA held under QMS with stability monitoring and a pre-defined requalification schedule — so expiry does not surface mid-batch release.",
      },
    ],
    status: "under-confirmation",
    statusCopy:
      "Documentation available on request. Named case studies land with Prompt 14 once client permissions are confirmed.",
  },
  scoping: {
    eyebrow: "Is this right for you?",
    heading: "Three questions worth answering before the first call",
    lede: "Short scoping set to shape the conversation. Each question has a short helper line below it — the answers prefill the contact form so the first call opens on your context.",
    questions: [
      {
        id: "primary-or-working",
        prompt: "Is this a primary standard qualification, a working standard qualification, or a periodic requalification?",
        helper:
          "Qualification depth varies — primary standards are characterized from first principles; working standards are qualified against the primary; requalification runs against the original CoA.",
      },
      {
        id: "compendial",
        prompt: "Is a USP or Ph. Eur. primary standard available for this material?",
        helper:
          "If yes, the working-standard qualification runs against the compendial primary. If not, the characterization is built from first principles.",
      },
      {
        id: "intended-use",
        prompt: "What is the intended analytical use — release testing, method validation, impurity quantitation, or stability reference?",
        helper:
          "Intended use drives the purity panel depth and the impurity-profile scope.",
      },
    ],
    cta: {
      label: "Send these answers to the team",
      href: "/contact?source=as-refstd-scoping",
      variant: "primary",
    },
    disclaimer:
      "The answers shape the first call — they do not commit either side to a scope.",
  },
  faq: {
    eyebrow: "FAQ",
    heading: "Questions we're usually asked on the first call",
    lede: "If your question is not here, send it ahead of the call — we would rather walk in with an answer than improvise one.",
    items: [
      {
        id: "primary-vs-working",
        question: "What's the practical difference between a primary and a working standard?",
        answer:
          "A primary standard is qualified from first principles or sourced from a compendial body (USP, Ph. Eur., WHO) — its purity is characterized directly. A working standard is a material qualified against the primary, and used in routine release testing. The USP General Notices on reference standards and Ph. Eur. chapter 5.12 describe the hierarchy; ICH Q6A frames the specification context.",
      },
      {
        id: "mass-balance",
        question: "Why assay by mass balance rather than by HPLC alone?",
        answer:
          "Chromatographic assay against another reference standard is a circular argument for a reference standard itself. Mass balance — 100% minus water, residual solvents, inorganic residues and organic impurities — assigns the assay value from independent characterization. The chromatographic assay is then run as a cross-check and any variance documented.",
      },
      {
        id: "qnmr",
        question: "When is quantitative NMR (qNMR) used?",
        answer:
          "Quantitative NMR is used where mass balance is difficult to close — typically for materials with unknown or complex residues, or where a primary-value cross-check is desirable. We use the Bruker Avance NEO 400 at our partner laboratory for qNMR where the programme requires it, with acquisition parameters documented against published qNMR best practice.",
      },
      {
        id: "stability",
        question: "How often are working standards requalified?",
        answer:
          "Requalification schedules are material- and use-specific. Typical frequency is 12 to 24 months for a stable small-molecule working standard under controlled storage, with more frequent requalification for hygroscopic or photolabile materials. Requalification triggers include time, analytical drift during use, visual change, and exposure events. The schedule is written into the CoA and held under the release QMS.",
      },
      {
        id: "impurity-standards",
        question: "Do you also characterize impurity reference standards?",
        answer:
          "Yes — impurity reference standards are characterized to a level matched to their use. For impurities controlled at the specification level, identity, purity and assay are characterized with the same rigor as the API standard. For impurities used only as identity markers, characterization is narrower but documented. Mutagenic impurity standards under ICH M7 are characterized with additional care given their low-level quantitation use.",
      },
      {
        id: "coa-release",
        question: "How is the CoA controlled?",
        answer:
          "The CoA is authored against the characterization data and held under QMS document control, with a unique document ID, version history, and superseded-version retention. Working standards are transferred into the release QMS with the CoA travelling with them. Any requalification results in a new CoA version; the old version is retained rather than overwritten.",
      },
    ],
  },
  related: {
    eyebrow: "Related services",
    heading: "Work that typically runs alongside reference-standard characterization",
    lede: "Reference-standard work rarely lives alone. Each link opens the detail for that service.",
    links: [
      {
        id: "impurity-profiling",
        label: "Impurity profiling",
        description:
          "Impurity reference standards are characterized for identity and quantitation to support the Q3A/B profile of the drug substance.",
        href: "/services/analytical-services/impurity-profiling",
      },
      {
        id: "method-validation",
        label: "Method validation",
        description:
          "Validated methods depend on qualified reference standards; the two workstreams are paired on most briefs.",
        href: "/services/analytical-services/method-validation",
      },
      {
        id: "quality",
        label: "Quality and compliance",
        description:
          "The QMS under which CoAs are held, working standards are transferred, and requalification cycles are run.",
        href: "/quality-compliance",
      },
    ],
  },
  closing: {
    eyebrow: "Next step",
    heading: "Send the material and the intended use. We'll send back a qualification plan.",
    body: "Most first calls walk through the material, its intended analytical use, any compendial primary available, and the release specification it supports — and produce a characterization plan against USP ⟨11⟩, the USP General Notices and Ph. Eur. 5.12. Where qNMR or partner NMR work is needed, we flag it up front.",
    primaryCta: {
      label: "Scope a reference standard qualification",
      href: "/contact?source=as-refstd-closing-scope",
      variant: "primary",
    },
    secondaryCta: {
      label: "Book a 30-minute call",
      href: "/contact?source=as-refstd-closing-call",
      variant: "outline",
    },
    regulatoryNote: {
      kind: "primary",
      label: "ICH Q6A — Specifications: Test Procedures and Acceptance Criteria",
      href: "https://www.ich.org/page/quality-guidelines",
    },
  },
};

/* -------------------------------------------------------------------------- */
/*  Leaf registry                                                             */
/* -------------------------------------------------------------------------- */

export const ANALYTICAL_LEAF_CONTENT: Record<
  AnalyticalServiceSlug,
  AnalyticalLeafContent
> = {
  "method-development": ANALYTICAL_METHOD_DEVELOPMENT,
  "method-validation": ANALYTICAL_METHOD_VALIDATION,
  "stability-studies": ANALYTICAL_STABILITY_STUDIES,
  "impurity-profiling": ANALYTICAL_IMPURITY_PROFILING,
  "bioanalytical": ANALYTICAL_BIOANALYTICAL,
  "extractables-and-leachables": ANALYTICAL_EXTRACTABLES_AND_LEACHABLES,
  "reference-standard-characterization": ANALYTICAL_REFERENCE_STANDARD_CHARACTERIZATION,
};

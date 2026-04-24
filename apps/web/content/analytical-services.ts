/**
 * Content dictionary for /services/analytical-services (hub) and the
 * analytical sub-service leaves (Prompt 11).
 *
 * This PR ships the hub + the `/method-development` leaf as the template
 * proof. The other six sub-service slugs are declared here as
 * `ANALYTICAL_SERVICE_SLUGS` so the hub matrix and the leaf route can render
 * "shipping next" states without creating dead links. Their content lands in
 * follow-up PRs.
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
  owner: "hyderabad" | "mississauga" | "both";
};

export type AnalyticalLifecycle = {
  eyebrow: string;
  heading: string;
  lede: string;
  stages: LifecycleStage[];
  ownerLegend: {
    hyderabad: string;
    mississauga: string;
    both: string;
  };
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
  /** Which hub owns the step — mirrors lifecycle ownership shorthand. */
  owner: "hyderabad" | "mississauga" | "both";
  /** Short technical notes surfaced under the step description. */
  notes: string[];
};

export type AnalyticalProcess = {
  eyebrow: string;
  heading: string;
  lede: string;
  steps: ProcessStep[];
  ownerLegend: {
    hyderabad: string;
    mississauga: string;
    both: string;
  };
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
  location: "Hyderabad" | "Mississauga" | "Both";
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
    "Analytical method development, validation, stability, impurity profiling, bioanalytical, E&L and reference standard characterization. Authored in Hyderabad, transferred into Mississauga under the Health Canada DEL.",
  ogTitle: "Analytical Services — Propharmex",
  ogDescription:
    "Seven analytical services, one quality system. Methods authored to travel — from the bench into validation, transfer, and the dossier.",
  hero: {
    eyebrow: "Services · Analytical Services",
    headline: "Methods authored to survive validation, transfer, and the dossier.",
    lede: "Analytical work begins in Hyderabad, is qualified against ICH Q2(R2) and the relevant USP general chapters, and is transferred into Mississauga for release testing under a single quality system. Seven sub-services cover the lifecycle — from early development through reference standard characterization — each documented in a shape the regulator can read.",
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
        leafStatus: "shipping-next",
      },
      {
        slug: "stability-studies",
        label: "Stability studies",
        blurb:
          "Long-term, accelerated, intermediate and photostability studies under ICH Q1A(R2) and Q1B with pull cadence aligned to submission.",
        highlights: ["ICH Q1A(R2)", "Zone II / IVb", "Photostability"],
        leafStatus: "shipping-next",
      },
      {
        slug: "impurity-profiling",
        label: "Impurity profiling",
        blurb:
          "Organic, elemental, residual-solvent and genotoxic impurity workups aligned to ICH Q3A/B, Q3C(R8), Q3D and M7(R2).",
        highlights: ["ICH Q3A/B", "Q3C residual solvents", "Q3D elemental"],
        leafStatus: "shipping-next",
      },
      {
        slug: "bioanalytical",
        label: "Bioanalytical",
        blurb:
          "LC-MS/MS bioanalytical methods for PK and biomarker work, authored against USFDA and ICH M10 bioanalytical method validation guidance.",
        highlights: ["LC-MS/MS", "ICH M10", "PK support"],
        leafStatus: "shipping-next",
      },
      {
        slug: "extractables-and-leachables",
        label: "Extractables & leachables",
        blurb:
          "E&L study design and execution aligned to USP ⟨1663⟩ / ⟨1664⟩ for container-closure and single-use systems.",
        highlights: ["USP ⟨1663⟩", "USP ⟨1664⟩", "Container-closure"],
        leafStatus: "shipping-next",
      },
      {
        slug: "reference-standard-characterization",
        label: "Reference standard characterization",
        blurb:
          "Primary and working standard qualification with orthogonal identity, assay and impurity evidence held under the QMS.",
        highlights: ["Primary standards", "Working standards", "Orthogonal ID"],
        leafStatus: "shipping-next",
      },
    ],
    liveCopy: "Detail page available",
    shippingNextCopy: "Detail page shipping next",
  },
  lifecycle: {
    eyebrow: "Method lifecycle",
    heading: "Develop → qualify / validate → transfer → maintain",
    lede: "Every analytical method runs through the same four stages, with ownership written into the plan from day one. Hyderabad authors and qualifies; Mississauga receives, validates against release use, and maintains the method across its operational life.",
    stages: [
      {
        id: "develop",
        label: "Develop",
        description:
          "Method scope, critical method attributes and analytical target profile defined against the specification and ICH Q14. Early method fitness evaluated with risk-ranked parameters.",
        owner: "hyderabad",
      },
      {
        id: "qualify-validate",
        label: "Qualify / validate",
        description:
          "Formal validation under ICH Q2(R2) with pre-defined acceptance criteria — specificity, linearity, accuracy, precision, range, robustness. USP ⟨1225⟩ is referenced where compendial.",
        owner: "hyderabad",
      },
      {
        id: "transfer",
        label: "Transfer",
        description:
          "Protocol-driven method transfer into Mississauga with comparative testing, pre-agreed equivalence criteria, and a closeout report that travels with the method.",
        owner: "both",
      },
      {
        id: "maintain",
        label: "Maintain",
        description:
          "System suitability, change-control, periodic review and revalidation triggers owned in Mississauga under the release-testing QMS. Method history is continuous, not re-started at transfer.",
        owner: "mississauga",
      },
    ],
    ownerLegend: {
      hyderabad: "Hyderabad — development and qualification",
      mississauga: "Mississauga — transfer close-out, release, method maintenance",
      both: "Both hubs — jointly planned",
    },
    handoffNote:
      "The transfer between Hyderabad and Mississauga is a written protocol with equivalence criteria agreed up front. Nothing in the method is re-authored on arrival; the record is continuous.",
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
        body: "Assay and related-substances methods rebuilt to resolve known and forced-degradation impurities, qualified against ICH Q14 attribute targets, and transferred into Mississauga for release use.",
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
    "From analytical target profile to a method that travels. Developed in Hyderabad, qualified under an active IOQ/PQ programme, transferred into Mississauga for release use.",
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
        owner: "hyderabad",
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
        owner: "hyderabad",
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
        owner: "hyderabad",
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
        owner: "hyderabad",
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
        owner: "hyderabad",
        notes: [
          "Pre-validation package under ICH Q2(R2) principles",
          "Raw-data and instrument logs under QMS control",
          "Documented readiness-for-validation assessment",
        ],
      },
      {
        id: "transfer",
        label: "Transfer into Mississauga",
        description:
          "Method, system-suitability, and a transfer protocol move to Mississauga for comparative testing, equivalence evaluation, and incorporation into the release-testing QMS.",
        owner: "mississauga",
        notes: [
          "Transfer protocol with equivalence criteria",
          "Comparative testing across analysts and instruments",
          "Closeout report into release QMS",
        ],
      },
    ],
    ownerLegend: {
      hyderabad: "Hyderabad — development and qualification",
      mississauga: "Mississauga — transfer close-out, release, method maintenance",
      both: "Both hubs — jointly planned",
    },
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
        location: "Both",
      },
      {
        id: "uhplc-waters-acquity",
        instrument: "Waters ACQUITY UPLC (PDA)",
        technique: "UHPLC",
        application: "Stability-indicating assay, rapid method screening",
        qualification: "IOQ/PQ current under USP ⟨1058⟩",
        location: "Hyderabad",
      },
      {
        id: "lcmsms-xevo-tqs",
        instrument: "Waters Xevo TQ-S triple quadrupole",
        technique: "LC-MS/MS",
        application: "Trace impurities, degradation product identification, genotoxic screening",
        qualification: "IOQ/PQ current; performance verification per in-house protocol",
        location: "Hyderabad",
      },
      {
        id: "gcms-agilent-8890",
        instrument: "Agilent 8890 / 7000D GC-MS",
        technique: "GC-MS",
        application: "Residual solvents per ICH Q3C(R8), volatile impurities",
        qualification: "IOQ/PQ current under USP ⟨1058⟩",
        location: "Hyderabad",
      },
      {
        id: "gc-fid",
        instrument: "Agilent 7890B GC-FID / headspace",
        technique: "GC",
        application: "Residual solvents (compendial), ethanol content",
        qualification: "IOQ/PQ current under USP ⟨1058⟩",
        location: "Hyderabad",
      },
      {
        id: "kf-metrohm",
        instrument: "Metrohm 831 KF Coulometer",
        technique: "Karl Fischer",
        application: "Water content (moisture) across drug substance and product",
        qualification: "IOQ/PQ current; calibration on certified water standards",
        location: "Hyderabad",
      },
      {
        id: "dissolution-distek",
        instrument: "Distek 2500 Select dissolution system",
        technique: "Dissolution",
        application: "USP ⟨711⟩ Apparatus 1 and 2 method development and execution",
        qualification: "Mechanical qualification per USP ⟨711⟩ toolkit; IOQ/PQ current",
        location: "Hyderabad",
      },
      {
        id: "dsc-mettler",
        instrument: "Mettler Toledo DSC 3+",
        technique: "DSC",
        application: "Thermal characterization, polymorph screen, excipient compatibility",
        qualification: "IOQ/PQ current; indium / zinc reference calibration",
        location: "Hyderabad",
      },
      {
        id: "tga-mettler",
        instrument: "Mettler Toledo TGA 2",
        technique: "TGA",
        application: "Thermal decomposition, residual solvent loss, hydrate characterization",
        qualification: "IOQ/PQ current",
        location: "Hyderabad",
      },
      {
        id: "uvvis-cary60",
        instrument: "Agilent Cary 60 UV-Vis",
        technique: "UV-Vis",
        application: "Assay (compendial), content uniformity, dissolution at lower sensitivity",
        qualification: "IOQ/PQ current; holmium-oxide wavelength check",
        location: "Hyderabad",
      },
      {
        id: "ph-seven",
        instrument: "Mettler Toledo SevenExcellence pH / conductivity",
        technique: "pH",
        application: "Mobile-phase and sample pH; routine analytical support",
        qualification: "IOQ/PQ current; daily three-point buffer calibration",
        location: "Both",
      },
      {
        id: "balance-xpr",
        instrument: "Mettler Toledo XPR analytical balance",
        technique: "Balance",
        application: "Weighing for standards and sample preparation",
        qualification: "IOQ/PQ current; calibration against Class I / E2 weights",
        location: "Both",
      },
      {
        id: "nmr-bruker",
        instrument: "Bruker Avance NEO 400 NMR (partner laboratory)",
        technique: "NMR",
        application: "Structural elucidation, impurity identification, polymorph confirmation",
        qualification: "Partner-scope — qualification held by partner laboratory under their QMS",
        location: "Hyderabad",
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
        context: "System-suitability limits and column-equivalence guidance written into the method, so the receiving lab in Mississauga runs comparative testing rather than re-optimizing.",
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
          "Method development, qualification and the pre-validation package are authored in Hyderabad. Transfer close-out, release testing and ongoing method maintenance sit in Mississauga under the Health Canada DEL. Both sites operate under a single quality system, so the method record is continuous rather than stitched together at the handoff.",
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
          "Media and apparatus are selected against the BCS class, the dosage form and the question the method needs to answer. Sink conditions and discriminatory power are demonstrated before the method is locked. The method carries into validation under ICH Q2(R2) and into release use in Mississauga without re-authoring.",
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
          "Methods and their validation packages land in Module 3 of the CTD. The regulatory team in Mississauga authors the submission against the analytical evidence.",
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
/*  Leaf registry                                                             */
/* -------------------------------------------------------------------------- */

export const ANALYTICAL_LEAF_CONTENT: Partial<
  Record<AnalyticalServiceSlug, AnalyticalLeafContent>
> = {
  "method-development": ANALYTICAL_METHOD_DEVELOPMENT,
};

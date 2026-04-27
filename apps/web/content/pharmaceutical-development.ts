/**
 * Content dictionary for /services/pharmaceutical-development (hub) and the
 * dosage-form sub-pages (Prompt 10).
 *
 * This PR ships the hub + the `/solid-oral-dosage` leaf as the template proof.
 * The other six dosage-form slugs are declared here as `DOSAGE_FORM_SLUGS` so
 * the hub matrix and the leaf route can render "shipping next" states without
 * creating dead links. Their content lands in a follow-up PR.
 *
 * Shape is deliberately close to a Sanity `service` document so Prompt 4 can
 * port this to CMS with a near-1:1 migration. Until then it is the source of
 * truth for the route.
 *
 * Safe-defaults posture (same precedent as facilities.ts / quality.ts):
 *  - No anonymized client names; outcome metrics labelled `under-confirmation`
 *    route to /contact for the verified case-study trail.
 *  - Regulatory references follow the three-tier claim-status convention in
 *    `docs/regulatory-lexicon.md`. Development work does not claim
 *    certification under any framework — only `alignment` with it.
 *  - Self-check questions prefill a `source` param so the Dosage Form Matcher
 *    (Prompt 18) can attribute inbound and, later, pre-seed its first turn.
 */

import type { FacilityCta, FacilitySource } from "./facilities";

/* -------------------------------------------------------------------------- */
/*  Shared primitives                                                         */
/* -------------------------------------------------------------------------- */

export type PharmDevCta = FacilityCta;
export type PharmDevSource = FacilitySource;

/** Enumerates every dosage-form leaf slug under the hub. Leaf pages whose */
/** content is not yet populated still render a "shipping next" state from */
/** the hub matrix so no internal links go stale. */
export const DOSAGE_FORM_SLUGS = [
  "solid-oral-dosage",
  "liquid-oral-dosage",
  "topical-semisolid",
  "sterile-injectables",
  "inhalation",
  "ophthalmic",
  "transdermal-modified-release",
] as const;

export type DosageFormSlug = (typeof DOSAGE_FORM_SLUGS)[number];

export type DosageFormSummary = {
  slug: DosageFormSlug;
  label: string;
  /** One-sentence elevator line shown on the hub capability matrix. */
  blurb: string;
  /** Short keyword list surfaced below the blurb on the hub card. */
  highlights: string[];
  /** Whether the leaf detail page is live in this PR. */
  leafStatus: "live" | "shipping-next";
};

/* -------------------------------------------------------------------------- */
/*  Hub page                                                                  */
/* -------------------------------------------------------------------------- */

export type PharmDevHubHero = {
  eyebrow: string;
  headline: string;
  lede: string;
  stats: { label: string; value: string }[];
  primaryCta: PharmDevCta;
  secondaryCta: PharmDevCta;
};

export type PharmDevCapabilityMatrix = {
  eyebrow: string;
  heading: string;
  lede: string;
  /** Ordered list of dosage-form summaries rendered as hub cards. */
  forms: DosageFormSummary[];
  liveCopy: string;
  shippingNextCopy: string;
};

export type LifecycleStage = {
  id: string;
  label: string;
  description: string;
};

export type PharmDevLifecycle = {
  eyebrow: string;
  heading: string;
  lede: string;
  stages: LifecycleStage[];
  handoffNote: string;
};

export type CaseStudyTeaser = {
  id: string;
  dosageForm: string;
  title: string;
  body: string;
  /** Rendered as an `under-confirmation` pill until a named, permitted case */
  /** study replaces it in Prompt 14. */
  status: "under-confirmation";
};

export type PharmDevCaseRail = {
  eyebrow: string;
  heading: string;
  lede: string;
  teasers: CaseStudyTeaser[];
  cta: PharmDevCta;
};

export type PharmDevHubClosing = {
  eyebrow: string;
  heading: string;
  body: string;
  primaryCta: PharmDevCta;
  secondaryCta: PharmDevCta;
};

export type PharmDevHubContent = {
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  hero: PharmDevHubHero;
  capabilityMatrix: PharmDevCapabilityMatrix;
  lifecycle: PharmDevLifecycle;
  caseRail: PharmDevCaseRail;
  closing: PharmDevHubClosing;
};

/* -------------------------------------------------------------------------- */
/*  Leaf template                                                             */
/* -------------------------------------------------------------------------- */

export type DosageFormHero = {
  eyebrow: string;
  headline: string;
  /** One-sentence value prop per Prompt 10 spec section 1. */
  valueProp: string;
  lede: string;
  stats: { label: string; value: string }[];
  primaryCta: PharmDevCta;
  secondaryCta: PharmDevCta;
};

export type ChallengeItem = {
  id: string;
  label: string;
  description: string;
};

export type DosageFormChallenges = {
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

export type DosageFormProcess = {
  eyebrow: string;
  heading: string;
  lede: string;
  steps: ProcessStep[];
};

export type EquipmentChipGroup = {
  id: string;
  category: string;
  chips: string[];
};

export type DosageFormEquipment = {
  eyebrow: string;
  heading: string;
  lede: string;
  groups: EquipmentChipGroup[];
  representativeNote: string;
  cta: PharmDevCta;
};

export type OutcomeMetricCard = {
  id: string;
  label: string;
  value: string;
  context: string;
};

export type DosageFormOutcome = {
  eyebrow: string;
  heading: string;
  lede: string;
  metrics: OutcomeMetricCard[];
  /** Same `under-confirmation` affordance as the hub case rail. */
  status: "under-confirmation";
  statusCopy: string;
};

export type SelfCheckQuestion = {
  id: string;
  prompt: string;
  /** Short one-line helper text rendered under the prompt. */
  helper: string;
};

export type DosageFormSelfCheck = {
  eyebrow: string;
  heading: string;
  lede: string;
  questions: SelfCheckQuestion[];
  /** CTA routes into the Dosage Form Matcher with a prefilled `source` param. */
  cta: PharmDevCta;
  disclaimer: string;
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type DosageFormFaq = {
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

export type DosageFormRelated = {
  eyebrow: string;
  heading: string;
  lede: string;
  links: RelatedServiceLink[];
};

export type DosageFormClosingCta = {
  eyebrow: string;
  heading: string;
  body: string;
  primaryCta: PharmDevCta;
  secondaryCta: PharmDevCta;
  regulatoryNote: PharmDevSource;
};

export type DosageFormContent = {
  slug: DosageFormSlug;
  label: string;
  /** Crumb label used in BreadcrumbList — generally shorter than `label`. */
  crumbLabel: string;
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  hero: DosageFormHero;
  challenges: DosageFormChallenges;
  process: DosageFormProcess;
  equipment: DosageFormEquipment;
  outcome: DosageFormOutcome;
  selfCheck: DosageFormSelfCheck;
  faq: DosageFormFaq;
  related: DosageFormRelated;
  closing: DosageFormClosingCta;
};

/* -------------------------------------------------------------------------- */
/*  Hub content                                                               */
/* -------------------------------------------------------------------------- */

export const PHARM_DEV_HUB: PharmDevHubContent = {
  metaTitle: "Pharmaceutical Development — Propharmex",
  metaDescription:
    "End-to-end pharmaceutical development across seven dosage forms — formulation, scale-up and tech-transfer executed by Propharmex and filed under our Health Canada Drug Establishment Licence.",
  ogTitle: "Pharmaceutical Development — Propharmex",
  ogDescription:
    "Seven dosage forms, one quality system. Development work authored to travel — from bench to dossier to batch record.",
  hero: {
    eyebrow: "Services · Pharmaceutical Development",
    headline: "Development work, authored to travel.",
    lede: "Formulation and process work are executed by Propharmex under a single quality system and arrive at the regulator as a readable dossier. Seven dosage forms are supported — from solid oral tablets to sterile injectables — each with a process tailored to what the molecule actually requires.",
    stats: [
      { label: "Dosage forms supported", value: "7" },
      { label: "Regulatory anchor", value: "Health Canada DEL" },
      { label: "Development quality system", value: "ICH Q10 alignment" },
    ],
    primaryCta: {
      label: "Scope a development programme",
      href: "/contact?source=pd-hub-hero-scope",
      variant: "primary",
    },
    secondaryCta: {
      label: "Use the Dosage Form Matcher",
      href: "/ai/dosage-matcher?source=pd-hub-hero",
      variant: "outline",
    },
  },
  capabilityMatrix: {
    eyebrow: "Capability matrix",
    heading: "Seven dosage forms we develop",
    lede: "Each form has its own bench, its own process stepper, and its own set of ICH guidelines it must read against. The detail pages walk through both the work and the standards — the hub is the index.",
    forms: [
      {
        slug: "solid-oral-dosage",
        label: "Solid oral dosage",
        blurb:
          "Tablets, capsules, ODTs. Granulation, direct compression, coating, dissolution method work.",
        highlights: ["Tablets", "Capsules", "ODT", "USP ⟨711⟩"],
        leafStatus: "live",
      },
      {
        slug: "liquid-oral-dosage",
        label: "Liquid oral dosage",
        blurb:
          "Syrups, suspensions, oral solutions. Preservative systems, rheology, taste-masking strategy.",
        highlights: ["Syrups", "Suspensions", "Preservatives"],
        leafStatus: "live",
      },
      {
        slug: "topical-semisolid",
        label: "Topical & semisolid",
        blurb:
          "Creams, gels, ointments, lotions. Phase behaviour, in-vitro release testing, preservative efficacy.",
        highlights: ["Creams", "Gels", "IVRT"],
        leafStatus: "live",
      },
      {
        slug: "sterile-injectables",
        label: "Sterile injectables",
        blurb:
          "Parenterals, lyophilized products, SVP and LVP. Container-closure, sterility assurance, lyo cycle design.",
        highlights: ["Lyophilization", "SVP", "Container-closure"],
        leafStatus: "live",
      },
      {
        slug: "inhalation",
        label: "Inhalation",
        blurb:
          "MDIs, DPIs, nebulizer solutions, nasal sprays. Aerosol characterization and device pairing.",
        highlights: ["MDI", "DPI", "Nasal spray"],
        leafStatus: "live",
      },
      {
        slug: "ophthalmic",
        label: "Ophthalmic",
        blurb:
          "Eye drops, ophthalmic suspensions and ointments. Tonicity, sterility, preservative efficacy.",
        highlights: ["Eye drops", "Sterility", "Osmolality"],
        leafStatus: "live",
      },
      {
        slug: "transdermal-modified-release",
        label: "Transdermal & modified release",
        blurb:
          "Patches, extended- and controlled-release oral. Diffusion, in-vitro release, food-effect strategy.",
        highlights: ["Patches", "Extended release", "IVIVC"],
        leafStatus: "live",
      },
    ],
    liveCopy: "Detail page available",
    shippingNextCopy: "Detail page shipping next",
  },
  lifecycle: {
    eyebrow: "Programme lifecycle",
    heading: "Preformulation → formulation → scale-up → tech-transfer",
    lede: "Every programme runs through the same four stages, with ownership written into the plan from day one. Executed by Propharmex — the record never leaves a single quality system, and the handoff is documented, not improvised.",
    stages: [
      {
        id: "preformulation",
        label: "Preformulation",
        description:
          "Characterization of the drug substance, compatibility screening, and early dosage-form feasibility against the target product profile.",
      },
      {
        id: "formulation",
        label: "Formulation development",
        description:
          "Iterative formulation work against critical quality attributes. Method-development and stability-indicating assays are authored alongside the formulation.",
      },
      {
        id: "scale-up",
        label: "Scale-up",
        description:
          "Process parameter ranges are defined, risk-assessed under ICH Q9(R1), and qualified for pilot- or registration-scale batches.",
      },
      {
        id: "tech-transfer",
        label: "Tech-transfer",
        description:
          "Methods, specifications, and batch records move into release testing and, where applicable, DEL-scope operations.",
      },
    ],
    handoffNote:
      "Every handoff between stages is captured in a written protocol, not a call. The protocol travels with the programme into the dossier.",
  },
  caseRail: {
    eyebrow: "Worked examples",
    heading: "Programme patterns we see",
    lede: "Named case studies land with Prompt 14 — the teasers below describe the pattern of work rather than the clients, in keeping with our policy of using client names only where permission has been granted.",
    teasers: [
      {
        id: "solid-oral-stability",
        dosageForm: "Solid oral dosage",
        title: "Stability-indicating method redevelopment for a BCS-II generic",
        body: "Assay and related-substances methods rebuilt to be stability-indicating under ICH Q1A(R2) zone IVb conditions, with transfer into release use under our Health Canada DEL.",
        status: "under-confirmation",
      },
      {
        id: "injectable-tech-transfer",
        dosageForm: "Sterile injectables",
        title: "Lyophilized injectable tech-transfer across two sites",
        body: "Lyophilization cycle re-qualified on a pilot train and transferred with container-closure integrity and cycle-robustness data aligned to the sponsor's NDS.",
        status: "under-confirmation",
      },
      {
        id: "topical-ivrt",
        dosageForm: "Topical & semisolid",
        title: "In-vitro release testing package for a generic cream",
        body: "USP ⟨1724⟩-aligned IVRT development with rheology and microstructure characterization to support bioequivalence strategy.",
        status: "under-confirmation",
      },
    ],
    cta: {
      label: "Ask for the full, NDA-gated case files",
      href: "/contact?source=pd-hub-case-rail",
      variant: "outline",
    },
  },
  closing: {
    eyebrow: "Next step",
    heading: "Bring the molecule. We'll bring the process that travels with it.",
    body: "We scope development programmes around what the molecule needs, what the regulator will ask, and which hub closes out which stage. Send the target product profile and a one-page brief — the first call is a working conversation, not a pitch.",
    primaryCta: {
      label: "Scope a development programme",
      href: "/contact?source=pd-hub-closing-scope",
      variant: "primary",
    },
    secondaryCta: {
      label: "Book a 30-minute call",
      href: "/contact?source=pd-hub-closing-call",
      variant: "outline",
    },
  },
};

/* -------------------------------------------------------------------------- */
/*  Solid oral dosage leaf                                                    */
/* -------------------------------------------------------------------------- */

export const DOSAGE_FORM_SOLID_ORAL: DosageFormContent = {
  slug: "solid-oral-dosage",
  label: "Solid oral dosage",
  crumbLabel: "Solid oral dosage",
  metaTitle: "Solid oral dosage development — Propharmex",
  metaDescription:
    "Tablet, capsule and ODT development at Propharmex — granulation, direct compression, dissolution method development under USP ⟨711⟩, and ICH Q1A(R2) stability authored to travel.",
  ogTitle: "Solid oral dosage development — Propharmex",
  ogDescription:
    "From BCS classification to dossier. Solid oral development executed by Propharmex, filed under our Health Canada Drug Establishment Licence.",
  hero: {
    eyebrow: "Pharmaceutical Development · Solid oral dosage",
    headline: "Tablets, capsules, and orally disintegrating forms — developed to dissolve on cue, not by accident.",
    valueProp:
      "Solid oral programmes, authored from the BCS class outward, with dissolution and stability evidence a reviewer can follow.",
    lede: "Most programmes we see arrive with a BCS classification, a target dose, and a release profile in mind. We build the formulation and the analytical evidence in parallel — so by the time the batch record is written, dissolution behaviour, content uniformity, and stability under ICH Q1A(R2) are already documented in a shape the regulator will recognize.",
    stats: [
      { label: "Forms supported", value: "Tablets · Capsules · ODT" },
      { label: "Dissolution reference", value: "USP ⟨711⟩ / Q6A" },
      { label: "Stability reference", value: "ICH Q1A(R2)" },
    ],
    primaryCta: {
      label: "Scope a solid oral programme",
      href: "/contact?source=pd-solid-oral-hero-scope",
      variant: "primary",
    },
    secondaryCta: {
      label: "Use the Dosage Form Matcher",
      href: "/ai/dosage-matcher?source=pd-solid-oral-hero",
      variant: "outline",
    },
  },
  challenges: {
    eyebrow: "Typical challenges we solve",
    heading: "What solid oral programmes actually run into",
    lede: "The headline problems vary — the root causes rarely do. The list below is what we end up scoping against on most briefs.",
    items: [
      {
        id: "bcs-class",
        label: "BCS class II and IV solubility limits",
        description:
          "Poor aqueous solubility that constrains dissolution and, downstream, bioavailability. Particle-size strategy, solid-state screening, and enabling technology selection framed against the target product profile.",
      },
      {
        id: "content-uniformity",
        label: "Content uniformity at low-dose strengths",
        description:
          "Blend uniformity and segregation risk under direct compression, evaluated per USP ⟨905⟩ and addressed through granulation or carrier-based blending where appropriate.",
      },
      {
        id: "dissolution",
        label: "Dissolution that is stability-indicating and biorelevant",
        description:
          "Method development under USP ⟨711⟩ with media selection and discriminatory power that track formulation change, not just pass/fail the current batch.",
      },
      {
        id: "stability",
        label: "Stability under ICH zones that matter to your market",
        description:
          "Zone II and zone IVb studies authored to ICH Q1A(R2), with degradation pathways identified and reported to ICH Q3A/Q3B thresholds.",
      },
      {
        id: "tech-transfer",
        label: "Tech-transfer that does not re-open the formulation",
        description:
          "Process parameters, method transfer, and specifications moved into the release site with documentation a reviewer — or a later site — can reproduce without calling the development team.",
      },
    ],
  },
  process: {
    eyebrow: "Our process",
    heading: "From characterization to release-ready, in one record",
    lede: "The stepper reflects the order of work on most solid oral programmes. The ownership column signals which hub leads — both hubs operate under a single QMS, so handoffs are document-first.",
    steps: [
      {
        id: "characterization",
        label: "Drug substance characterization",
        description:
          "Solid-state profile, particle-size distribution, hygroscopicity and compatibility with candidate excipients. Establishes the baseline every later decision references.",
        notes: [
          "Polymorph and hydrate screen",
          "Excipient compatibility matrix",
          "Target product profile anchored",
        ],
      },
      {
        id: "formulation",
        label: "Formulation development",
        description:
          "Dosage-form selection (tablet, capsule, ODT), granulation strategy, and in-process controls defined against critical quality attributes.",
        notes: [
          "Wet granulation, DC or roller compaction",
          "Blend uniformity via USP ⟨905⟩",
          "Critical quality attributes agreed with sponsor",
        ],
      },
      {
        id: "analytical",
        label: "Analytical method development",
        description:
          "Assay, related substances and dissolution methods developed in parallel with the formulation, then validated under ICH Q2(R2) once the formulation is locked.",
        notes: [
          "Stability-indicating assay",
          "Dissolution per USP ⟨711⟩",
          "Method validation to ICH Q2(R2)",
        ],
      },
      {
        id: "stability",
        label: "Stability study conduct",
        description:
          "Long-term and accelerated stability under ICH Q1A(R2) zone II and zone IVb conditions, with pull cadence aligned to registration milestones.",
        notes: [
          "ICH zone II and IVb conditions",
          "Photostability per ICH Q1B where applicable",
          "Degradation products to Q3B thresholds",
        ],
      },
      {
        id: "scale-up",
        label: "Scale-up and process characterization",
        description:
          "Process parameter ranges defined and risk-assessed under ICH Q9(R1); pilot- or registration-scale batches manufactured and characterized.",
        notes: [
          "Design space articulated per Q8(R2)",
          "Risk assessment under Q9(R1)",
          "Pilot batch manufactured and sampled",
        ],
      },
      {
        id: "tech-transfer",
        label: "Tech-transfer and release",
        description:
          "Methods, specifications, and batch records transfer into release testing and, where applicable, DEL-scope operations.",
        notes: [
          "Method transfer protocol and report",
          "Release testing under the Canadian DEL",
          "Change-control path established",
        ],
      },
    ],
  },
  equipment: {
    eyebrow: "Equipment and techniques",
    heading: "What the bench actually looks like",
    lede: "Representative equipment and techniques used on solid oral programmes. The validated inventory with qualification status is shared under NDA during the pre-visit briefing — matching the disclosure posture on the facilities pages.",
    groups: [
      {
        id: "formulation",
        category: "Formulation and processing",
        chips: [
          "High-shear wet granulation",
          "Fluid-bed granulation and drying",
          "Roller compaction",
          "Direct compression",
          "Tablet compression (rotary)",
          "Film coating (pan coater)",
          "Capsule filling (bench-scale)",
          "Blending and lubrication",
        ],
      },
      {
        id: "analytical",
        category: "Analytical",
        chips: [
          "HPLC (UV / DAD)",
          "LC-MS/MS",
          "Dissolution — USP Apparatus 1 and 2",
          "Disintegration",
          "Content uniformity per USP ⟨905⟩",
          "Karl Fischer moisture",
          "Particle size (laser diffraction)",
          "DSC and TGA",
          "XRPD (via partner lab)",
        ],
      },
      {
        id: "stability",
        category: "Stability and environment",
        chips: [
          "ICH zone II chambers",
          "ICH zone IVb chambers",
          "Photostability per ICH Q1B",
          "Continuous monitoring and mapping",
        ],
      },
    ],
    representativeNote:
      "Representative list. The current validated inventory is available on request.",
    cta: {
      label: "Request the validated inventory",
      href: "/contact?source=pd-solid-oral-inventory",
      variant: "outline",
    },
  },
  outcome: {
    eyebrow: "Outcome pattern",
    heading: "Programme-level outcomes we aim for",
    lede: "The figures below describe the kind of outcomes solid oral programmes target — not claims against a specific client engagement. Named, permission-cleared case studies arrive with Prompt 14.",
    metrics: [
      {
        id: "dissolution",
        label: "Dissolution method",
        value: "Stability-indicating",
        context: "Developed under USP ⟨711⟩, with media selection that discriminates formulation change.",
      },
      {
        id: "stability",
        label: "Stability evidence",
        value: "ICH Q1A(R2)",
        context: "Zone II and IVb study conduct with pull cadence aligned to submission milestones.",
      },
      {
        id: "transfer",
        label: "Tech-transfer",
        value: "Document-first",
        context: "Methods, specifications and batch records transferred without re-opening formulation work.",
      },
    ],
    status: "under-confirmation",
    statusCopy:
      "Documentation available on request. Named case studies land with Prompt 14 once client permissions are confirmed.",
  },
  selfCheck: {
    eyebrow: "Is this right for you?",
    heading: "Three questions worth answering before the first call",
    lede: "Short self-check to shape the conversation. The answers prefill the Dosage Form Matcher so the assistant opens on your context rather than a blank page.",
    questions: [
      {
        id: "bcs-class",
        prompt: "Do you know the BCS classification of your drug substance?",
        helper:
          "If not, preformulation will start with solubility and permeability work under your target product profile.",
      },
      {
        id: "dose-strength",
        prompt: "What is the intended dose range, and is any strength below 5 mg?",
        helper:
          "Low-dose strengths change the blend-uniformity and granulation conversation early.",
      },
      {
        id: "markets",
        prompt: "Which markets is the product intended for — Canada, US, both, or broader?",
        helper:
          "Market scope drives ICH stability zones and the release-testing footprint we plan.",
      },
    ],
    cta: {
      label: "Open the Dosage Form Matcher",
      href: "/ai/dosage-matcher?source=pd-solid-oral-selfcheck",
      variant: "primary",
    },
    disclaimer:
      "The Matcher is an AI assistant drawing on Propharmex's public documentation. Its output is informational and not a regulatory guarantee — the team will review any recommendation that shapes your filing.",
  },
  faq: {
    eyebrow: "FAQ",
    heading: "Questions we're usually asked on the first call",
    lede: "If your question is not here, send it ahead of the call — we would rather walk in with an answer than improvise one.",
    items: [
      {
        id: "which-hub",
        question: "Which site actually does the formulation work?",
        answer:
          "Formulation, analytical method development and the initial stability work are authored by Propharmex. Tech-transfer, release testing and — where applicable — DEL-scope operations are executed under the Health Canada Drug Establishment Licence. The record is continuous under a single quality system rather than stitched together at the handoff.",
      },
      {
        id: "stability-zones",
        question: "Which ICH stability zones can you run?",
        answer:
          "Zone II (25°C / 60% RH) and zone IVb (30°C / 75% RH) chambers run under ICH Q1A(R2) conditions with continuous monitoring. Photostability testing is scoped under ICH Q1B where applicable. The study design is agreed against your submission plan before the first sample is pulled.",
      },
      {
        id: "dissolution",
        question: "How do you approach dissolution method development?",
        answer:
          "We develop dissolution methods to be both stability-indicating and discriminatory. Media selection is driven by the dosage form and the question the method needs to answer — not by a single default. The method travels with the formulation into validation under ICH Q2(R2) and into release use under our DEL.",
      },
      {
        id: "regulatory",
        question: "Do you handle the regulatory submission as well?",
        answer:
          "The regulatory team authors Health Canada submissions and coordinates ANDA or DMF work with the USFDA when the programme spans both markets. The development record is written with those submissions in mind from the start — it is not re-authored at the end.",
      },
      {
        id: "timeline",
        question: "How long does a typical solid oral development programme take?",
        answer:
          "Duration depends on the drug substance, the dosage form, and the registration target. We scope timelines against those three inputs on the first call and share a working schedule rather than a template. What we do not do is commit to a regulatory review timeline — that is the regulator's call, not ours.",
      },
    ],
  },
  related: {
    eyebrow: "Related services",
    heading: "Work that typically runs alongside a solid oral programme",
    lede: "Most programmes touch at least two of the following. Each link opens the detail for that service.",
    links: [
      {
        id: "analytical",
        label: "Analytical services",
        description:
          "Method development, validation, stability study conduct and impurity profiling — authored alongside the formulation.",
        href: "/services/analytical-services",
      },
      {
        id: "regulatory",
        label: "Regulatory services",
        description:
          "Health Canada submissions and coordinated USFDA ANDA or DMF work for programmes spanning both markets.",
        href: "/services/regulatory-services",
      },
      {
        id: "quality",
        label: "Quality and compliance",
        description:
          "The DEL and the unified QMS that make tech-transfer a document exercise rather than a re-authoring one.",
        href: "/quality-compliance",
      },
    ],
  },
  closing: {
    eyebrow: "Next step",
    heading: "Send the target product profile. We'll send back a development plan you can review with QA.",
    body: "Most first calls are a working conversation: we walk through the drug substance, the target product profile, and the submission plan, and draft a development outline against that. If we are not the right partner for the molecule, we will tell you on that call.",
    primaryCta: {
      label: "Scope a solid oral programme",
      href: "/contact?source=pd-solid-oral-closing-scope",
      variant: "primary",
    },
    secondaryCta: {
      label: "Book a 30-minute call",
      href: "/contact?source=pd-solid-oral-closing-call",
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
/*  Liquid oral dosage leaf                                                   */
/* -------------------------------------------------------------------------- */

export const DOSAGE_FORM_LIQUID_ORAL: DosageFormContent = {
  slug: "liquid-oral-dosage",
  label: "Liquid oral dosage",
  crumbLabel: "Liquid oral dosage",
  metaTitle: "Liquid oral dosage development — Propharmex",
  metaDescription:
    "Syrup, suspension and oral solution development at Propharmex — preservative efficacy, rheology, taste-masking, and stability authored under ICH Q1A(R2) to travel into submission.",
  ogTitle: "Liquid oral dosage development — Propharmex",
  ogDescription:
    "From preservative strategy to dossier. Liquid oral development executed by Propharmex, filed under our Health Canada Drug Establishment Licence.",
  hero: {
    eyebrow: "Pharmaceutical Development · Liquid oral dosage",
    headline: "Syrups, suspensions and oral solutions — formulated to hold shape from first shake to last dose.",
    valueProp:
      "Liquid oral programmes built around a defensible preservative system, documented rheology, and a taste-masking strategy the patient will actually accept.",
    lede: "Most liquid oral briefs turn on three questions: will the preservative system hold across the shelf life, will the product redisperse the way the label claims, and will the child take it. We work those three questions in parallel with the analytical and stability package, so by the time the batch record is written the answers are in the record rather than beside it.",
    stats: [
      { label: "Forms supported", value: "Syrups · Suspensions · Solutions" },
      { label: "Preservative reference", value: "USP ⟨51⟩ alignment" },
      { label: "Stability reference", value: "ICH Q1A(R2)" },
    ],
    primaryCta: {
      label: "Scope a liquid oral programme",
      href: "/contact?source=pd-liquid-oral-hero-scope",
      variant: "primary",
    },
    secondaryCta: {
      label: "Use the Dosage Form Matcher",
      href: "/ai/dosage-matcher?source=pd-liquid-oral-hero",
      variant: "outline",
    },
  },
  challenges: {
    eyebrow: "Typical challenges we solve",
    heading: "What liquid oral programmes actually run into",
    lede: "The label problems vary — the underlying mechanisms rarely do. The items below are what we end up scoping against on most briefs.",
    items: [
      {
        id: "preservative",
        label: "Preservative systems that hold across shelf life",
        description:
          "Preservative efficacy evaluated under USP ⟨51⟩ with adsorption, partitioning and pH-drift effects characterized rather than assumed.",
      },
      {
        id: "rheology",
        label: "Rheology and redispersibility for suspensions",
        description:
          "Viscosity, yield stress and sedimentation rate characterized against the label redispersibility claim. Settling behaviour is framed as an in-use question, not a batch-release one.",
      },
      {
        id: "taste",
        label: "Taste-masking without sacrificing dissolution",
        description:
          "Ion-exchange, polymer coating or flavour-based approaches selected against the API and the intended patient population. Paediatric palatability is scoped as its own workstream when relevant.",
      },
      {
        id: "stability",
        label: "Stability for aqueous systems under ICH zones",
        description:
          "Hydrolysis, oxidation and microbial-risk pathways studied under ICH Q1A(R2) zone II and IVb conditions, with photostability per Q1B where the formulation is light-sensitive.",
      },
      {
        id: "container",
        label: "Container-closure and in-use stability",
        description:
          "Extractables, leachables and headspace interactions assessed against the proposed primary pack; in-use stability after first opening documented against the shelf-life claim.",
      },
    ],
  },
  process: {
    eyebrow: "Our process",
    heading: "From compatibility screen to release-ready, in one record",
    lede: "The stepper reflects the order of work on most liquid oral programmes. Both hubs operate under a single QMS, so handoffs are document-first.",
    steps: [
      {
        id: "characterization",
        label: "Drug substance and excipient characterization",
        description:
          "Solubility in aqueous and co-solvent systems, pH-solubility profile, hydrolytic stability and excipient compatibility characterized against the target product profile.",
        notes: [
          "pH-solubility and pKa profile",
          "Excipient compatibility matrix",
          "Forced-degradation under aqueous stress",
        ],
      },
      {
        id: "formulation",
        label: "Formulation and preservative development",
        description:
          "Vehicle, preservative system and taste-masking strategy developed against critical quality attributes. Rheology and redispersibility built into the brief, not retro-fitted.",
        notes: [
          "Preservative efficacy per USP ⟨51⟩",
          "Rheology and sedimentation characterization",
          "Taste-masking strategy agreed with sponsor",
        ],
      },
      {
        id: "analytical",
        label: "Analytical method development",
        description:
          "Assay, related substances, preservative content and, where applicable, dissolution methods authored alongside the formulation and validated under ICH Q2(R2).",
        notes: [
          "Stability-indicating assay and preservative quantitation",
          "Microbial limits per USP ⟨61⟩ / ⟨62⟩",
          "Method validation to ICH Q2(R2)",
        ],
      },
      {
        id: "stability",
        label: "Stability study conduct",
        description:
          "Long-term, accelerated and in-use stability studies under ICH Q1A(R2) with pull cadence aligned to registration milestones.",
        notes: [
          "ICH zone II and IVb conditions",
          "Photostability per ICH Q1B where applicable",
          "In-use stability post first-opening",
        ],
      },
      {
        id: "scale-up",
        label: "Scale-up and process characterization",
        description:
          "Mixing, homogenization and filling parameters defined and risk-assessed under ICH Q9(R1); pilot- or registration-scale batches manufactured and sampled.",
        notes: [
          "Homogenization and deaeration parameters",
          "Risk assessment under Q9(R1)",
          "Container-closure extractable / leachable scoping",
        ],
      },
      {
        id: "tech-transfer",
        label: "Tech-transfer and release",
        description:
          "Methods, specifications and batch records transfer into release testing and, where applicable, DEL-scope operations.",
        notes: [
          "Method transfer protocol and report",
          "Release testing under the Canadian DEL",
          "Change-control path established",
        ],
      },
    ],
  },
  equipment: {
    eyebrow: "Equipment and techniques",
    heading: "What the bench actually looks like",
    lede: "Representative equipment and techniques used on liquid oral programmes. The validated inventory with qualification status is shared under NDA during the pre-visit briefing.",
    groups: [
      {
        id: "formulation",
        category: "Formulation and processing",
        chips: [
          "High-shear homogenization",
          "Overhead and propeller mixing",
          "Colloid milling",
          "Vacuum deaeration",
          "Bottle filling (bench-scale)",
          "In-line particle-size monitoring",
          "pH and conductivity control",
        ],
      },
      {
        id: "analytical",
        category: "Analytical",
        chips: [
          "HPLC (UV / DAD)",
          "LC-MS/MS",
          "Rheometry (rotational and oscillatory)",
          "Particle size (laser diffraction)",
          "Osmolality",
          "Karl Fischer moisture",
          "Microbial limits per USP ⟨61⟩ / ⟨62⟩",
          "Preservative efficacy per USP ⟨51⟩",
        ],
      },
      {
        id: "stability",
        category: "Stability and environment",
        chips: [
          "ICH zone II chambers",
          "ICH zone IVb chambers",
          "Photostability per ICH Q1B",
          "In-use stability stations",
        ],
      },
    ],
    representativeNote:
      "Representative list. The current validated inventory is available on request.",
    cta: {
      label: "Request the validated inventory",
      href: "/contact?source=pd-liquid-oral-inventory",
      variant: "outline",
    },
  },
  outcome: {
    eyebrow: "Outcome pattern",
    heading: "Programme-level outcomes we aim for",
    lede: "The figures below describe the kind of outcomes liquid oral programmes target — not claims against a specific client engagement. Named, permission-cleared case studies arrive with Prompt 14.",
    metrics: [
      {
        id: "preservative",
        label: "Preservative system",
        value: "USP ⟨51⟩-defensible",
        context: "Preservative efficacy characterized across shelf life with adsorption and partitioning evaluated.",
      },
      {
        id: "stability",
        label: "Stability evidence",
        value: "ICH Q1A(R2)",
        context: "Zone II and IVb conduct plus in-use stability after first opening.",
      },
      {
        id: "transfer",
        label: "Tech-transfer",
        value: "Document-first",
        context: "Methods, specifications and batch records transferred without re-opening formulation work.",
      },
    ],
    status: "under-confirmation",
    statusCopy:
      "Documentation available on request. Named case studies land with Prompt 14 once client permissions are confirmed.",
  },
  selfCheck: {
    eyebrow: "Is this right for you?",
    heading: "Three questions worth answering before the first call",
    lede: "Short self-check to shape the conversation. The answers prefill the Dosage Form Matcher so the assistant opens on your context rather than a blank page.",
    questions: [
      {
        id: "form-type",
        prompt: "Is the product a true solution, a suspension, or a syrup base?",
        helper:
          "Dosage-form class changes the preservative, rheology and dissolution conversation from the first call.",
      },
      {
        id: "patient",
        prompt: "Is the product intended for paediatric, adult or geriatric use?",
        helper:
          "Patient population drives palatability, dose-measuring and excipient-exclusion decisions.",
      },
      {
        id: "container",
        prompt: "Do you have a preferred primary container-closure system?",
        helper:
          "Pack choice shapes extractable / leachable scoping and in-use stability design.",
      },
    ],
    cta: {
      label: "Open the Dosage Form Matcher",
      href: "/ai/dosage-matcher?source=pd-liquid-oral-selfcheck",
      variant: "primary",
    },
    disclaimer:
      "The Matcher is an AI assistant drawing on Propharmex's public documentation. Its output is informational and not a regulatory guarantee — the team will review any recommendation that shapes your filing.",
  },
  faq: {
    eyebrow: "FAQ",
    heading: "Questions we're usually asked on the first call",
    lede: "If your question is not here, send it ahead of the call — we would rather walk in with an answer than improvise one.",
    items: [
      {
        id: "preservative",
        question: "How do you pick a preservative system?",
        answer:
          "We evaluate the preservative against the API, the excipient matrix and the pack. Preservative efficacy testing is conducted under USP ⟨51⟩, and partitioning into non-aqueous phases or adsorption onto container surfaces is characterized rather than assumed. The system needs to hold across the labelled shelf life and the in-use period — both are studied.",
      },
      {
        id: "suspension",
        question: "How do you handle redispersibility claims on suspensions?",
        answer:
          "Sedimentation rate, yield stress and redispersion behaviour are characterized early and tied back to the label claim. If the label says 'shake well before use', we document what 'well' means in seconds and inversions, so the claim is testable at release.",
      },
      {
        id: "paediatric",
        question: "Do you develop paediatric formulations?",
        answer:
          "Yes. Paediatric programmes are scoped with excipient-exclusion lists, dose-measuring accuracy, and palatability work treated as named workstreams rather than afterthoughts. Where the sponsor plans a paediatric investigation plan or written request, the development record is authored to feed it.",
      },
      {
        id: "stability",
        question: "Which stability zones can you run for aqueous products?",
        answer:
          "Zone II (25°C / 60% RH) and zone IVb (30°C / 75% RH) chambers run under ICH Q1A(R2) conditions. Photostability testing is scoped under ICH Q1B where the formulation is light-sensitive. In-use stability after first opening is run against the intended pack.",
      },
    ],
  },
  related: {
    eyebrow: "Related services",
    heading: "Work that typically runs alongside a liquid oral programme",
    lede: "Most programmes touch at least two of the following. Each link opens the detail for that service.",
    links: [
      {
        id: "analytical",
        label: "Analytical services",
        description:
          "Assay, preservative quantitation, microbial limits and stability method work authored alongside the formulation.",
        href: "/services/analytical-services",
      },
      {
        id: "regulatory",
        label: "Regulatory services",
        description:
          "Health Canada submissions and coordinated USFDA ANDA work for programmes spanning both markets.",
        href: "/services/regulatory-services",
      },
      {
        id: "quality",
        label: "Quality and compliance",
        description:
          "The DEL and the unified QMS that make tech-transfer a document exercise rather than a re-authoring one.",
        href: "/quality-compliance",
      },
    ],
  },
  closing: {
    eyebrow: "Next step",
    heading: "Send the target product profile. We'll send back a development plan you can review with QA.",
    body: "Most first calls are a working conversation: we walk through the API, the preservative constraints, the intended pack, and the submission plan, and draft a development outline against that. If we are not the right partner for the molecule, we will tell you on that call.",
    primaryCta: {
      label: "Scope a liquid oral programme",
      href: "/contact?source=pd-liquid-oral-closing-scope",
      variant: "primary",
    },
    secondaryCta: {
      label: "Book a 30-minute call",
      href: "/contact?source=pd-liquid-oral-closing-call",
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
/*  Topical & semisolid leaf                                                  */
/* -------------------------------------------------------------------------- */

export const DOSAGE_FORM_TOPICAL_SEMISOLID: DosageFormContent = {
  slug: "topical-semisolid",
  label: "Topical & semisolid",
  crumbLabel: "Topical & semisolid",
  metaTitle: "Topical and semisolid development — Propharmex",
  metaDescription:
    "Cream, gel, ointment and lotion development at Propharmex — phase behaviour, IVRT under USP ⟨1724⟩, preservative efficacy, and microstructure characterization authored to travel.",
  ogTitle: "Topical and semisolid development — Propharmex",
  ogDescription:
    "From phase diagram to dossier. Topical development executed by Propharmex, filed under our Health Canada Drug Establishment Licence.",
  hero: {
    eyebrow: "Pharmaceutical Development · Topical & semisolid",
    headline: "Creams, gels, ointments and lotions — developed around the microstructure, not the label claim.",
    valueProp:
      "Semisolid programmes authored against phase behaviour and in-vitro release performance, with the microstructure documented rather than inferred.",
    lede: "Most semisolid briefs ultimately come back to microstructure: phase composition, droplet or particle size, and how they shift across the shelf life. We characterize the microstructure early, tie it to in-vitro release under USP ⟨1724⟩, and carry the evidence forward into stability and scale-up. The rheology, the preservative efficacy and the IVRT profile travel together into the dossier.",
    stats: [
      { label: "Forms supported", value: "Creams · Gels · Ointments · Lotions" },
      { label: "Release reference", value: "USP ⟨1724⟩ alignment" },
      { label: "Preservative reference", value: "USP ⟨51⟩ alignment" },
    ],
    primaryCta: {
      label: "Scope a topical programme",
      href: "/contact?source=pd-topical-hero-scope",
      variant: "primary",
    },
    secondaryCta: {
      label: "Use the Dosage Form Matcher",
      href: "/ai/dosage-matcher?source=pd-topical-hero",
      variant: "outline",
    },
  },
  challenges: {
    eyebrow: "Typical challenges we solve",
    heading: "What semisolid programmes actually run into",
    lede: "The label problems vary — the underlying mechanisms rarely do. The items below are what we end up scoping against on most briefs.",
    items: [
      {
        id: "phase",
        label: "Phase behaviour and microstructure",
        description:
          "Emulsion type, droplet-size distribution and internal-phase volume mapped against formulation levers. Phase inversion and creaming pathways characterized rather than discovered at accelerated stability.",
      },
      {
        id: "ivrt",
        label: "IVRT that discriminates formulation change",
        description:
          "In-vitro release testing developed under USP ⟨1724⟩ with membrane, media and receptor-fluid selection documented against the discriminatory-power objective.",
      },
      {
        id: "preservative",
        label: "Preservative efficacy in multiphase systems",
        description:
          "Partitioning of preservative into the oil phase and adsorption onto container surfaces evaluated under USP ⟨51⟩ — not assumed from single-phase data.",
      },
      {
        id: "stability",
        label: "Stability under ICH zones for semisolid systems",
        description:
          "Phase separation, crystal growth and viscosity drift characterized under ICH Q1A(R2) zone II and IVb, with photostability per Q1B where the formulation is light-sensitive.",
      },
      {
        id: "container",
        label: "Container-closure and dose delivery",
        description:
          "Tube, jar or airless-pump interactions with the formulation evaluated; dose-delivery uniformity on the intended pack treated as its own release attribute when the product so warrants.",
      },
    ],
  },
  process: {
    eyebrow: "Our process",
    heading: "From phase diagram to release-ready, in one record",
    lede: "The stepper reflects the order of work on most semisolid programmes. Both hubs operate under a single QMS, so handoffs are document-first.",
    steps: [
      {
        id: "characterization",
        label: "Drug substance and excipient characterization",
        description:
          "Solubility in aqueous and oil phases, partition coefficient, thermal behaviour and excipient compatibility characterized against the target product profile.",
        notes: [
          "Log P and phase-distribution profile",
          "Excipient compatibility matrix",
          "Thermal analysis (DSC)",
        ],
      },
      {
        id: "formulation",
        label: "Formulation and microstructure development",
        description:
          "Emulsifier selection, phase-ratio optimisation and processing-temperature profile developed against the intended microstructure and critical quality attributes.",
        notes: [
          "Phase diagram and HLB screening",
          "Rheology and droplet-size characterization",
          "Preservative efficacy per USP ⟨51⟩",
        ],
      },
      {
        id: "analytical",
        label: "Analytical and IVRT method development",
        description:
          "Assay, related substances, preservative content and IVRT methods authored alongside the formulation and validated under ICH Q2(R2).",
        notes: [
          "IVRT per USP ⟨1724⟩",
          "Stability-indicating assay",
          "Method validation to ICH Q2(R2)",
        ],
      },
      {
        id: "stability",
        label: "Stability study conduct",
        description:
          "Long-term, accelerated and photostability studies under ICH Q1A(R2) and Q1B, with pull cadence aligned to registration milestones.",
        notes: [
          "ICH zone II and IVb conditions",
          "Photostability per ICH Q1B where applicable",
          "Phase behaviour tracked across pulls",
        ],
      },
      {
        id: "scale-up",
        label: "Scale-up and process characterization",
        description:
          "Homogenization, cooling-rate and addition-sequence parameters defined and risk-assessed under ICH Q9(R1); pilot- or registration-scale batches manufactured and sampled.",
        notes: [
          "Design space articulated per Q8(R2)",
          "Risk assessment under Q9(R1)",
          "Pilot batch manufactured and sampled",
        ],
      },
      {
        id: "tech-transfer",
        label: "Tech-transfer and release",
        description:
          "Methods, specifications and batch records transfer into release testing and, where applicable, DEL-scope operations.",
        notes: [
          "Method transfer protocol and report",
          "Release testing under the Canadian DEL",
          "Change-control path established",
        ],
      },
    ],
  },
  equipment: {
    eyebrow: "Equipment and techniques",
    heading: "What the bench actually looks like",
    lede: "Representative equipment and techniques used on semisolid programmes. The validated inventory with qualification status is shared under NDA during the pre-visit briefing.",
    groups: [
      {
        id: "formulation",
        category: "Formulation and processing",
        chips: [
          "High-shear emulsification",
          "Rotor-stator homogenization",
          "Vacuum processor (jacketed)",
          "Colloid milling",
          "Controlled-cooling profiles",
          "Tube and jar filling (bench-scale)",
          "Sieving and dispersion stations",
        ],
      },
      {
        id: "analytical",
        category: "Analytical",
        chips: [
          "HPLC (UV / DAD)",
          "IVRT (vertical diffusion cells)",
          "Rheometry (rotational and oscillatory)",
          "Optical and polarized microscopy",
          "Droplet-size analysis",
          "pH and conductivity",
          "Microbial limits per USP ⟨61⟩ / ⟨62⟩",
          "Preservative efficacy per USP ⟨51⟩",
        ],
      },
      {
        id: "stability",
        category: "Stability and environment",
        chips: [
          "ICH zone II chambers",
          "ICH zone IVb chambers",
          "Photostability per ICH Q1B",
          "Freeze–thaw cycling stations",
        ],
      },
    ],
    representativeNote:
      "Representative list. The current validated inventory is available on request.",
    cta: {
      label: "Request the validated inventory",
      href: "/contact?source=pd-topical-inventory",
      variant: "outline",
    },
  },
  outcome: {
    eyebrow: "Outcome pattern",
    heading: "Programme-level outcomes we aim for",
    lede: "The figures below describe the kind of outcomes semisolid programmes target — not claims against a specific client engagement. Named, permission-cleared case studies arrive with Prompt 14.",
    metrics: [
      {
        id: "ivrt",
        label: "IVRT package",
        value: "USP ⟨1724⟩-aligned",
        context: "Membrane, media and receptor-fluid selection documented against discriminatory power.",
      },
      {
        id: "microstructure",
        label: "Microstructure evidence",
        value: "Characterized",
        context: "Droplet-size distribution, rheology and phase behaviour tracked across stability pulls.",
      },
      {
        id: "transfer",
        label: "Tech-transfer",
        value: "Document-first",
        context: "Methods, specifications and batch records transferred without re-opening formulation work.",
      },
    ],
    status: "under-confirmation",
    statusCopy:
      "Documentation available on request. Named case studies land with Prompt 14 once client permissions are confirmed.",
  },
  selfCheck: {
    eyebrow: "Is this right for you?",
    heading: "Three questions worth answering before the first call",
    lede: "Short self-check to shape the conversation. The answers prefill the Dosage Form Matcher so the assistant opens on your context rather than a blank page.",
    questions: [
      {
        id: "form-type",
        prompt: "Is the product a cream, gel, ointment or lotion?",
        helper:
          "Form selection shapes the phase-behaviour, rheology and IVRT conversation from the first call.",
      },
      {
        id: "strategy",
        prompt: "Is the intended filing a generic Q1/Q2 match or a new product?",
        helper:
          "Q1/Q2 matching drives IVRT and excipient-sourcing decisions early; a new product allows more formulation freedom.",
      },
      {
        id: "pack",
        prompt: "Do you have a preferred primary pack — tube, jar or airless pump?",
        helper:
          "Pack choice shapes extractable / leachable scoping and dose-delivery uniformity work.",
      },
    ],
    cta: {
      label: "Open the Dosage Form Matcher",
      href: "/ai/dosage-matcher?source=pd-topical-selfcheck",
      variant: "primary",
    },
    disclaimer:
      "The Matcher is an AI assistant drawing on Propharmex's public documentation. Its output is informational and not a regulatory guarantee — the team will review any recommendation that shapes your filing.",
  },
  faq: {
    eyebrow: "FAQ",
    heading: "Questions we're usually asked on the first call",
    lede: "If your question is not here, send it ahead of the call — we would rather walk in with an answer than improvise one.",
    items: [
      {
        id: "ivrt",
        question: "How do you approach IVRT method development?",
        answer:
          "We develop IVRT to be discriminatory, not just reportable. Membrane, media and receptor-fluid selection are chosen against the discriminatory-power objective under USP ⟨1724⟩, and the method is validated under ICH Q2(R2) once the formulation is locked. The method travels with the formulation into release use under our DEL.",
      },
      {
        id: "q1q2",
        question: "Can you match a reference Q1/Q2 for generic development?",
        answer:
          "Yes. Where the filing strategy requires Q1/Q2 match to a reference listed drug, we scope excipient sourcing, grade selection and qualitative match work as a named workstream — with the supporting deviation and justification documentation authored for the dossier, not improvised at submission time.",
      },
      {
        id: "preservative",
        question: "How do you handle preservative efficacy in multiphase systems?",
        answer:
          "Preservative partitioning into the oil phase and adsorption onto pack surfaces are characterized rather than assumed. USP ⟨51⟩ testing is run across the shelf life and in-use period against the proposed pack, so the claim holds for the labelled conditions of use.",
      },
      {
        id: "stability",
        question: "Which stability studies do you run for semisolids?",
        answer:
          "Zone II (25°C / 60% RH) and zone IVb (30°C / 75% RH) studies under ICH Q1A(R2), with photostability per Q1B where applicable. Freeze–thaw and temperature-cycling studies are added for products where phase-separation risk warrants them.",
      },
    ],
  },
  related: {
    eyebrow: "Related services",
    heading: "Work that typically runs alongside a semisolid programme",
    lede: "Most programmes touch at least two of the following. Each link opens the detail for that service.",
    links: [
      {
        id: "analytical",
        label: "Analytical services",
        description:
          "IVRT, assay, microbial limits and preservative method development authored alongside the formulation.",
        href: "/services/analytical-services",
      },
      {
        id: "regulatory",
        label: "Regulatory services",
        description:
          "Health Canada submissions and coordinated USFDA ANDA work, including Q1/Q2 matching strategy for generics.",
        href: "/services/regulatory-services",
      },
      {
        id: "quality",
        label: "Quality and compliance",
        description:
          "The DEL and the unified QMS that make tech-transfer a document exercise rather than a re-authoring one.",
        href: "/quality-compliance",
      },
    ],
  },
  closing: {
    eyebrow: "Next step",
    heading: "Send the target product profile. We'll send back a development plan you can review with QA.",
    body: "Most first calls are a working conversation: we walk through the API, the reference product if any, the intended pack, and the submission plan, and draft a development outline against that. If we are not the right partner for the molecule, we will tell you on that call.",
    primaryCta: {
      label: "Scope a topical programme",
      href: "/contact?source=pd-topical-closing-scope",
      variant: "primary",
    },
    secondaryCta: {
      label: "Book a 30-minute call",
      href: "/contact?source=pd-topical-closing-call",
      variant: "outline",
    },
    regulatoryNote: {
      kind: "primary",
      label: "USP General Chapter ⟨1724⟩ — Semisolid Drug Products — Performance Tests",
      href: "https://www.uspnf.com/",
    },
  },
};

/* -------------------------------------------------------------------------- */
/*  Sterile injectables leaf                                                  */
/* -------------------------------------------------------------------------- */

export const DOSAGE_FORM_STERILE_INJECTABLES: DosageFormContent = {
  slug: "sterile-injectables",
  label: "Sterile injectables",
  crumbLabel: "Sterile injectables",
  metaTitle: "Sterile injectables development — Propharmex",
  metaDescription:
    "Parenteral, lyophilized, SVP and LVP development at Propharmex — lyo cycle design, container-closure integrity, sterility assurance and USP ⟨788⟩ particulate work authored to travel.",
  ogTitle: "Sterile injectables development — Propharmex",
  ogDescription:
    "From formulation to dossier. Sterile injectable development executed by Propharmex, filed under our Health Canada Drug Establishment Licence.",
  hero: {
    eyebrow: "Pharmaceutical Development · Sterile injectables",
    headline: "Parenterals, lyophilized products and SVP / LVP forms — developed around sterility assurance and container-closure integrity.",
    valueProp:
      "Injectable programmes authored against a documented contamination-control strategy, with lyo cycle design, CCI and particulate work carried together into the dossier.",
    lede: "Injectable briefs turn on two connected questions: can the sterility assurance level be defended across the process, and does the container-closure system hold across shelf life and shipping. We scope the formulation, the lyo cycle (where applicable), and the CCI package as one workstream so the contamination-control strategy reads as a single argument rather than three separate ones.",
    stats: [
      { label: "Forms supported", value: "SVP · LVP · Lyophilized" },
      { label: "Particulate reference", value: "USP ⟨788⟩ alignment" },
      { label: "Stability reference", value: "ICH Q1A(R2)" },
    ],
    primaryCta: {
      label: "Scope a sterile injectable programme",
      href: "/contact?source=pd-sterile-hero-scope",
      variant: "primary",
    },
    secondaryCta: {
      label: "Use the Dosage Form Matcher",
      href: "/ai/dosage-matcher?source=pd-sterile-hero",
      variant: "outline",
    },
  },
  challenges: {
    eyebrow: "Typical challenges we solve",
    heading: "What sterile injectable programmes actually run into",
    lede: "The label problems vary — the underlying mechanisms rarely do. The items below are what we end up scoping against on most briefs.",
    items: [
      {
        id: "sterility",
        label: "Sterility assurance across the process",
        description:
          "Contamination-control strategy scoped against the process, from compounding through filtration, fill and, where applicable, terminal sterilization. The argument is documented end-to-end rather than filled in at submission.",
      },
      {
        id: "lyo",
        label: "Lyophilization cycle design and robustness",
        description:
          "Freeze-dry cycle developed against thermal characterization of the formulation (Tg', Tc), with primary and secondary drying parameters scoped under a documented design space.",
      },
      {
        id: "cci",
        label: "Container-closure integrity across shelf life and shipping",
        description:
          "CCI method selection, validation and routine-test strategy authored against the primary pack, shipping lane and shelf-life claim. Integrity is a claim to be defended, not inferred.",
      },
      {
        id: "particulate",
        label: "Particulate matter and visible-inspection criteria",
        description:
          "Subvisible particulate matter per USP ⟨788⟩ and visible-inspection criteria scoped against the dosage form, route and clinical context.",
      },
      {
        id: "leachables",
        label: "Extractables and leachables for the primary pack",
        description:
          "E&L study design scoped against the route of administration, dose volume and contact duration, with the study report authored to be reviewable in the dossier.",
      },
    ],
  },
  process: {
    eyebrow: "Our process",
    heading: "From thermal characterization to release-ready, in one record",
    lede: "The stepper reflects the order of work on most sterile injectable programmes. Both hubs operate under a single QMS, so handoffs are document-first.",
    steps: [
      {
        id: "characterization",
        label: "Drug substance and formulation characterization",
        description:
          "Solubility, pH–stability profile, thermal behaviour (including Tg' and Tc for lyo candidates) and excipient compatibility characterized against the target product profile.",
        notes: [
          "Thermal characterization (DSC, FDM)",
          "pH–stability and isotonicity profile",
          "Excipient compatibility matrix",
        ],
      },
      {
        id: "formulation",
        label: "Formulation and cycle development",
        description:
          "Vehicle, buffer and tonicity-adjuster selection; for lyo programmes, primary and secondary drying profiles developed against a documented design space.",
        notes: [
          "Lyophilization cycle design (bench-scale)",
          "Isotonicity and pH control",
          "Critical quality attributes agreed with sponsor",
        ],
      },
      {
        id: "analytical",
        label: "Analytical and particulate method development",
        description:
          "Assay, related substances, sub-visible particulate (USP ⟨788⟩) and, where applicable, reconstitution-time methods authored alongside the formulation and validated under ICH Q2(R2).",
        notes: [
          "Particulate matter per USP ⟨788⟩",
          "Stability-indicating assay",
          "Method validation to ICH Q2(R2)",
        ],
      },
      {
        id: "stability",
        label: "Stability and CCI study conduct",
        description:
          "Long-term and accelerated stability under ICH Q1A(R2), container-closure integrity across pulls, and photostability per Q1B where applicable.",
        notes: [
          "ICH zone II and IVb conditions",
          "CCI method per selected technology",
          "Photostability per ICH Q1B where applicable",
        ],
      },
      {
        id: "scale-up",
        label: "Scale-up and contamination-control strategy",
        description:
          "Filtration, filling and, where applicable, lyo cycle parameters scaled and risk-assessed under ICH Q9(R1); contamination-control strategy documented end-to-end.",
        notes: [
          "Filter compatibility and validation scoping",
          "Risk assessment under Q9(R1)",
          "Contamination-control strategy authored",
        ],
      },
      {
        id: "tech-transfer",
        label: "Tech-transfer and release",
        description:
          "Methods, specifications and batch records transfer into release testing and, where applicable, DEL-scope operations.",
        notes: [
          "Method transfer protocol and report",
          "Release testing under the Canadian DEL",
          "Change-control path established",
        ],
      },
    ],
  },
  equipment: {
    eyebrow: "Equipment and techniques",
    heading: "What the bench actually looks like",
    lede: "Representative equipment and techniques used on sterile injectable programmes. The validated inventory with qualification status is shared under NDA during the pre-visit briefing.",
    groups: [
      {
        id: "formulation",
        category: "Formulation and processing",
        chips: [
          "Bench-scale lyophilizer (instrumented)",
          "Sterile filtration trains",
          "Compounding under LAF",
          "Filter compatibility rig",
          "Vial and prefilled-syringe filling (bench-scale)",
          "Controlled-rate freezing",
          "Freeze-drying microscopy (FDM)",
        ],
      },
      {
        id: "analytical",
        category: "Analytical",
        chips: [
          "HPLC (UV / DAD)",
          "Sub-visible particulate per USP ⟨788⟩",
          "Visible inspection station",
          "Osmolality and pH",
          "Karl Fischer moisture (residual moisture for lyo)",
          "CCI (headspace or dye-ingress)",
          "Reconstitution-time studies",
          "Endotoxin (LAL) via partner lab",
        ],
      },
      {
        id: "stability",
        category: "Stability and environment",
        chips: [
          "ICH zone II chambers",
          "ICH zone IVb chambers",
          "Photostability per ICH Q1B",
          "Cold-chain (2–8°C) stability",
        ],
      },
    ],
    representativeNote:
      "Representative list. The current validated inventory and site-scope is available on request under NDA.",
    cta: {
      label: "Request the validated inventory",
      href: "/contact?source=pd-sterile-inventory",
      variant: "outline",
    },
  },
  outcome: {
    eyebrow: "Outcome pattern",
    heading: "Programme-level outcomes we aim for",
    lede: "The figures below describe the kind of outcomes sterile injectable programmes target — not claims against a specific client engagement. Named, permission-cleared case studies arrive with Prompt 14.",
    metrics: [
      {
        id: "cycle",
        label: "Lyo cycle",
        value: "Design-space defined",
        context: "Primary and secondary drying parameters scoped under a documented design space per Q8(R2).",
      },
      {
        id: "cci",
        label: "CCI package",
        value: "Shelf-life defensible",
        context: "Integrity method selected and validated against pack, shipping lane and shelf-life claim.",
      },
      {
        id: "transfer",
        label: "Tech-transfer",
        value: "Document-first",
        context: "Methods, specifications and batch records transferred without re-opening formulation work.",
      },
    ],
    status: "under-confirmation",
    statusCopy:
      "Documentation available on request. Named case studies land with Prompt 14 once client permissions are confirmed.",
  },
  selfCheck: {
    eyebrow: "Is this right for you?",
    heading: "Three questions worth answering before the first call",
    lede: "Short self-check to shape the conversation. The answers prefill the Dosage Form Matcher so the assistant opens on your context rather than a blank page.",
    questions: [
      {
        id: "presentation",
        prompt: "Is the presentation liquid-fill, lyophilized, SVP or LVP?",
        helper:
          "Presentation drives the lyo cycle, CCI and filling-line conversation from the first call.",
      },
      {
        id: "route",
        prompt: "What is the intended route of administration and dose volume?",
        helper:
          "Route and volume shape tonicity, particulate acceptance criteria and container-closure selection.",
      },
      {
        id: "sterilization",
        prompt: "Is the product intended to be terminally sterilized or aseptically processed?",
        helper:
          "Sterilization strategy drives the contamination-control argument and the filling-line requirements.",
      },
    ],
    cta: {
      label: "Open the Dosage Form Matcher",
      href: "/ai/dosage-matcher?source=pd-sterile-selfcheck",
      variant: "primary",
    },
    disclaimer:
      "The Matcher is an AI assistant drawing on Propharmex's public documentation. Its output is informational and not a regulatory guarantee — the team will review any recommendation that shapes your filing.",
  },
  faq: {
    eyebrow: "FAQ",
    heading: "Questions we're usually asked on the first call",
    lede: "If your question is not here, send it ahead of the call — we would rather walk in with an answer than improvise one.",
    items: [
      {
        id: "lyo",
        question: "How do you develop a lyophilization cycle?",
        answer:
          "Cycle design starts from thermal characterization of the formulation — Tg' and collapse temperature for amorphous systems, eutectic behaviour for crystalline ones. Primary and secondary drying parameters are developed against that characterization, and the cycle is scoped under a documented design space per ICH Q8(R2). We do not copy cycles from similar products without the thermal work to justify the transfer.",
      },
      {
        id: "cci",
        question: "How do you approach container-closure integrity?",
        answer:
          "CCI method selection is driven by the pack, the shelf-life claim and the shipping lane. Headspace analysis and dye-ingress are both in scope; the method is validated against positive controls and carried into routine stability. Integrity is documented as a claim with supporting evidence, not inferred from sterility testing alone.",
      },
      {
        id: "particulate",
        question: "How are particulate matter criteria set?",
        answer:
          "Sub-visible particulate testing under USP ⟨788⟩ applies to the dosage form and route. Acceptance criteria are anchored to the compendial limits and tightened where the clinical context — paediatric, ophthalmic-adjacent, or long-infusion — warrants. Visible inspection criteria are authored against the same clinical context.",
      },
      {
        id: "stability",
        question: "Which stability studies do you run for injectables?",
        answer:
          "Long-term, accelerated and, where relevant, cold-chain (2–8°C) stability under ICH Q1A(R2), with photostability per Q1B where the formulation is light-sensitive. CCI is tracked across pulls, not only at release, so the integrity claim is supported across the labelled shelf life.",
      },
    ],
  },
  related: {
    eyebrow: "Related services",
    heading: "Work that typically runs alongside a sterile injectable programme",
    lede: "Most programmes touch at least two of the following. Each link opens the detail for that service.",
    links: [
      {
        id: "analytical",
        label: "Analytical services",
        description:
          "Particulate, assay, CCI and reconstitution-time method development authored alongside the formulation.",
        href: "/services/analytical-services",
      },
      {
        id: "regulatory",
        label: "Regulatory services",
        description:
          "Health Canada submissions and coordinated USFDA ANDA or NDA work for injectable programmes.",
        href: "/services/regulatory-services",
      },
      {
        id: "quality",
        label: "Quality and compliance",
        description:
          "The DEL and the unified QMS, including the contamination-control strategy authored end-to-end.",
        href: "/quality-compliance",
      },
    ],
  },
  closing: {
    eyebrow: "Next step",
    heading: "Send the target product profile. We'll send back a development plan you can review with QA.",
    body: "Most first calls are a working conversation: we walk through the API, the presentation, the sterilization strategy, and the submission plan, and draft a development outline against that. If we are not the right partner for the molecule or the presentation, we will tell you on that call.",
    primaryCta: {
      label: "Scope a sterile injectable programme",
      href: "/contact?source=pd-sterile-closing-scope",
      variant: "primary",
    },
    secondaryCta: {
      label: "Book a 30-minute call",
      href: "/contact?source=pd-sterile-closing-call",
      variant: "outline",
    },
    regulatoryNote: {
      kind: "primary",
      label: "USP General Chapter ⟨788⟩ — Particulate Matter in Injections",
      href: "https://www.uspnf.com/",
    },
  },
};

/* -------------------------------------------------------------------------- */
/*  Inhalation leaf                                                           */
/* -------------------------------------------------------------------------- */

export const DOSAGE_FORM_INHALATION: DosageFormContent = {
  slug: "inhalation",
  label: "Inhalation",
  crumbLabel: "Inhalation",
  metaTitle: "Inhalation product development — Propharmex",
  metaDescription:
    "MDI, DPI, nebulizer solution and nasal spray development at Propharmex — aerosol characterization, device pairing, and cascade-impaction work authored to travel into the dossier.",
  ogTitle: "Inhalation product development — Propharmex",
  ogDescription:
    "From formulation to device pairing. Inhalation development executed by Propharmex, filed under our Health Canada Drug Establishment Licence.",
  hero: {
    eyebrow: "Pharmaceutical Development · Inhalation",
    headline: "MDIs, DPIs, nebulizer solutions and nasal sprays — developed around the device and the dose that leaves it.",
    valueProp:
      "Inhalation programmes authored against aerodynamic particle-size distribution and device-pairing evidence a regulator can follow.",
    lede: "Inhalation briefs turn on the delivered dose and the aerodynamic particle-size distribution — the rest of the package exists to defend them. We characterize aerosol performance on the intended device early, carry the evidence through formulation and stability work, and document the device-pairing argument alongside the formulation so the dossier reads as one record rather than two.",
    stats: [
      { label: "Forms supported", value: "MDI · DPI · Nebulizer · Nasal" },
      { label: "Aerosol reference", value: "USP ⟨601⟩ alignment" },
      { label: "Stability reference", value: "ICH Q1A(R2)" },
    ],
    primaryCta: {
      label: "Scope an inhalation programme",
      href: "/contact?source=pd-inhalation-hero-scope",
      variant: "primary",
    },
    secondaryCta: {
      label: "Use the Dosage Form Matcher",
      href: "/ai/dosage-matcher?source=pd-inhalation-hero",
      variant: "outline",
    },
  },
  challenges: {
    eyebrow: "Typical challenges we solve",
    heading: "What inhalation programmes actually run into",
    lede: "The label problems vary — the underlying mechanisms rarely do. The items below are what we end up scoping against on most briefs.",
    items: [
      {
        id: "apsd",
        label: "Aerodynamic particle-size distribution on device",
        description:
          "APSD characterized by cascade impaction under USP ⟨601⟩, evaluated on the intended device, not a surrogate. Fine-particle fraction and mass-median aerodynamic diameter are the outputs the dossier is built around.",
      },
      {
        id: "dose",
        label: "Delivered dose uniformity across the canister or blister",
        description:
          "Through-life dose uniformity characterized from initial to end-of-use, across hold orientations and actuation rates that reflect real use.",
      },
      {
        id: "device",
        label: "Device pairing and formulation–device interaction",
        description:
          "Actuator, dose-metering and airflow characteristics matched to the formulation; interaction effects documented rather than assumed compatible.",
      },
      {
        id: "stability",
        label: "Stability under ICH zones for pressurized and powder systems",
        description:
          "Chemical and physical stability under ICH Q1A(R2), with orientation-specific studies for MDIs and moisture-exposure studies for DPIs.",
      },
      {
        id: "leachables",
        label: "Extractables and leachables for the primary device",
        description:
          "E&L scoped against the route of administration and the device materials, with study design authored to be reviewable in the dossier.",
      },
    ],
  },
  process: {
    eyebrow: "Our process",
    heading: "From APSD target to release-ready, in one record",
    lede: "The stepper reflects the order of work on most inhalation programmes. Both hubs operate under a single QMS, so handoffs are document-first.",
    steps: [
      {
        id: "characterization",
        label: "Drug substance and device-target characterization",
        description:
          "Particle size, morphology, hygroscopicity and surface-energy profile characterized against the intended device class and the target APSD.",
        notes: [
          "Particle size and morphology",
          "Hygroscopicity and surface energy",
          "Target APSD and fine-particle fraction agreed",
        ],
      },
      {
        id: "formulation",
        label: "Formulation and device pairing",
        description:
          "For MDIs: propellant and co-solvent selection; for DPIs: carrier selection, blend morphology and fluidisation behaviour; for nebulizer solutions and nasal sprays: vehicle and spray-pattern work.",
        notes: [
          "Device pairing and formulation–device interaction study",
          "Carrier or propellant selection",
          "Critical quality attributes agreed with sponsor",
        ],
      },
      {
        id: "analytical",
        label: "Analytical and aerosol method development",
        description:
          "Assay, related substances, delivered-dose uniformity and cascade-impaction methods authored alongside the formulation and validated under ICH Q2(R2).",
        notes: [
          "APSD by cascade impaction per USP ⟨601⟩",
          "Delivered-dose uniformity through-life",
          "Method validation to ICH Q2(R2)",
        ],
      },
      {
        id: "stability",
        label: "Stability study conduct",
        description:
          "Long-term, accelerated, orientation-specific and, for DPIs, moisture-exposure stability under ICH Q1A(R2) with pull cadence aligned to registration milestones.",
        notes: [
          "ICH zone II and IVb conditions",
          "Orientation-specific studies for MDIs",
          "Moisture-exposure studies for DPIs",
        ],
      },
      {
        id: "scale-up",
        label: "Scale-up and process characterization",
        description:
          "Blending, filling and crimping parameters defined and risk-assessed under ICH Q9(R1); pilot- or registration-scale batches manufactured and sampled on the intended device.",
        notes: [
          "Design space articulated per Q8(R2)",
          "Risk assessment under Q9(R1)",
          "Pilot batch on intended device",
        ],
      },
      {
        id: "tech-transfer",
        label: "Tech-transfer and release",
        description:
          "Methods, specifications and batch records transfer into release testing and, where applicable, DEL-scope operations.",
        notes: [
          "Method transfer protocol and report",
          "Release testing under the Canadian DEL",
          "Change-control path established",
        ],
      },
    ],
  },
  equipment: {
    eyebrow: "Equipment and techniques",
    heading: "What the bench actually looks like",
    lede: "Representative equipment and techniques used on inhalation programmes. The validated inventory with qualification status is shared under NDA during the pre-visit briefing.",
    groups: [
      {
        id: "formulation",
        category: "Formulation and processing",
        chips: [
          "MDI suspension and solution compounding",
          "DPI blending (low-shear)",
          "Cold-filling rigs (bench-scale)",
          "Crimping stations (bench-scale)",
          "Nasal-spray actuator pairing",
          "Nebulizer vehicle compounding",
          "Blister and capsule filling (bench-scale)",
        ],
      },
      {
        id: "analytical",
        category: "Analytical",
        chips: [
          "Next Generation Impactor (NGI)",
          "Andersen Cascade Impactor (ACI)",
          "Dose Uniformity Sampling Apparatus (DUSA)",
          "HPLC (UV / DAD)",
          "Laser diffraction (particle size)",
          "Spray pattern and plume geometry",
          "Actuation-force and dose-metering characterization",
        ],
      },
      {
        id: "stability",
        category: "Stability and environment",
        chips: [
          "ICH zone II chambers",
          "ICH zone IVb chambers",
          "Orientation-specific stations",
          "Low-humidity DPI stability stations",
        ],
      },
    ],
    representativeNote:
      "Representative list. The current validated inventory is available on request under NDA.",
    cta: {
      label: "Request the validated inventory",
      href: "/contact?source=pd-inhalation-inventory",
      variant: "outline",
    },
  },
  outcome: {
    eyebrow: "Outcome pattern",
    heading: "Programme-level outcomes we aim for",
    lede: "The figures below describe the kind of outcomes inhalation programmes target — not claims against a specific client engagement. Named, permission-cleared case studies arrive with Prompt 14.",
    metrics: [
      {
        id: "apsd",
        label: "APSD evidence",
        value: "USP ⟨601⟩-characterized",
        context: "Cascade-impaction work on the intended device, not a surrogate.",
      },
      {
        id: "dose",
        label: "Delivered dose uniformity",
        value: "Through-life",
        context: "Characterized from initial to end-of-use across hold orientations that reflect real use.",
      },
      {
        id: "transfer",
        label: "Tech-transfer",
        value: "Document-first",
        context: "Methods, specifications and batch records transferred without re-opening formulation work.",
      },
    ],
    status: "under-confirmation",
    statusCopy:
      "Documentation available on request. Named case studies land with Prompt 14 once client permissions are confirmed.",
  },
  selfCheck: {
    eyebrow: "Is this right for you?",
    heading: "Three questions worth answering before the first call",
    lede: "Short self-check to shape the conversation. The answers prefill the Dosage Form Matcher so the assistant opens on your context rather than a blank page.",
    questions: [
      {
        id: "device-class",
        prompt: "Is the product an MDI, DPI, nebulizer solution or nasal spray?",
        helper:
          "Device class drives the APSD, stability and filling-line conversation from the first call.",
      },
      {
        id: "device-paired",
        prompt: "Do you already have a device partner, or is device selection part of the brief?",
        helper:
          "Device selection changes the scope, timelines and E&L package materially.",
      },
      {
        id: "filing",
        prompt: "Is the filing strategy generic (e.g. ANDA with bioequivalence) or a new product?",
        helper:
          "Strategy drives APSD-matching work, in-vitro bioequivalence design and comparator-sourcing decisions.",
      },
    ],
    cta: {
      label: "Open the Dosage Form Matcher",
      href: "/ai/dosage-matcher?source=pd-inhalation-selfcheck",
      variant: "primary",
    },
    disclaimer:
      "The Matcher is an AI assistant drawing on Propharmex's public documentation. Its output is informational and not a regulatory guarantee — the team will review any recommendation that shapes your filing.",
  },
  faq: {
    eyebrow: "FAQ",
    heading: "Questions we're usually asked on the first call",
    lede: "If your question is not here, send it ahead of the call — we would rather walk in with an answer than improvise one.",
    items: [
      {
        id: "apsd",
        question: "How do you characterize APSD?",
        answer:
          "Aerodynamic particle-size distribution is characterized by cascade impaction under USP ⟨601⟩ — NGI for most programmes, ACI where the sponsor's reference package uses it. The test is run on the intended device, at actuation conditions that reflect the labelled use. Fine-particle fraction and mass-median aerodynamic diameter are reported with the full stage profile, not summary figures only.",
      },
      {
        id: "device",
        question: "Do you work on device selection or only on pre-selected devices?",
        answer:
          "Both. Where the sponsor arrives with a device partner, we work the formulation against that device. Where device selection is part of the brief, we scope device pairing as a named workstream — with the interaction study and the selection rationale authored for the dossier, not improvised at submission.",
      },
      {
        id: "stability",
        question: "Which stability studies do you run for inhalation products?",
        answer:
          "ICH Q1A(R2) zone II and IVb as a baseline, with orientation-specific studies for MDIs and moisture-exposure studies for DPIs. Through-life dose uniformity and APSD are tracked across pulls, so the performance claims hold across the labelled shelf life and use pattern.",
      },
      {
        id: "generic",
        question: "Can you support a generic inhalation filing?",
        answer:
          "Yes. Generic inhalation programmes carry additional APSD-matching and in-vitro bioequivalence work — we scope that as a named workstream against the reference listed drug, with stage-by-stage comparison and statistical treatment authored to the agency's expectations.",
      },
    ],
  },
  related: {
    eyebrow: "Related services",
    heading: "Work that typically runs alongside an inhalation programme",
    lede: "Most programmes touch at least two of the following. Each link opens the detail for that service.",
    links: [
      {
        id: "analytical",
        label: "Analytical services",
        description:
          "APSD, delivered-dose uniformity, assay and E&L method development authored alongside the formulation.",
        href: "/services/analytical-services",
      },
      {
        id: "regulatory",
        label: "Regulatory services",
        description:
          "Health Canada submissions and coordinated USFDA ANDA or NDA work for inhalation programmes.",
        href: "/services/regulatory-services",
      },
      {
        id: "quality",
        label: "Quality and compliance",
        description:
          "The DEL and the unified QMS that make tech-transfer a document exercise rather than a re-authoring one.",
        href: "/quality-compliance",
      },
    ],
  },
  closing: {
    eyebrow: "Next step",
    heading: "Send the target product profile. We'll send back a development plan you can review with QA.",
    body: "Most first calls are a working conversation: we walk through the API, the device class, the target APSD, and the submission plan, and draft a development outline against that. If we are not the right partner for the molecule or the device, we will tell you on that call.",
    primaryCta: {
      label: "Scope an inhalation programme",
      href: "/contact?source=pd-inhalation-closing-scope",
      variant: "primary",
    },
    secondaryCta: {
      label: "Book a 30-minute call",
      href: "/contact?source=pd-inhalation-closing-call",
      variant: "outline",
    },
    regulatoryNote: {
      kind: "primary",
      label: "USP General Chapter ⟨601⟩ — Inhalation and Nasal Drug Products: Aerosols, Sprays, and Powders",
      href: "https://www.uspnf.com/",
    },
  },
};

/* -------------------------------------------------------------------------- */
/*  Ophthalmic leaf                                                           */
/* -------------------------------------------------------------------------- */

export const DOSAGE_FORM_OPHTHALMIC: DosageFormContent = {
  slug: "ophthalmic",
  label: "Ophthalmic",
  crumbLabel: "Ophthalmic",
  metaTitle: "Ophthalmic product development — Propharmex",
  metaDescription:
    "Eye-drop, ophthalmic suspension and ointment development at Propharmex — tonicity, sterility assurance, USP ⟨789⟩ particulate, and preservative efficacy authored to travel into the dossier.",
  ogTitle: "Ophthalmic product development — Propharmex",
  ogDescription:
    "From tonicity to dossier. Ophthalmic development executed by Propharmex, filed under our Health Canada Drug Establishment Licence.",
  hero: {
    eyebrow: "Pharmaceutical Development · Ophthalmic",
    headline: "Eye drops, ophthalmic suspensions and ointments — developed for the eye, not a general-purpose sterile.",
    valueProp:
      "Ophthalmic programmes authored around tonicity, sterility assurance and ocular-specific particulate limits — with preservative efficacy documented for the in-use period the patient actually lives with.",
    lede: "Ophthalmic briefs turn on a tight set of constraints: isotonicity with the tear film, sterility assurance with a defensible preservative argument, and particulate matter controlled at ophthalmic limits rather than general-parenteral limits. We scope the formulation, the preservative system and the CCI package as one workstream so the ocular context is in the record from the first compatibility study.",
    stats: [
      { label: "Forms supported", value: "Drops · Suspensions · Ointments" },
      { label: "Particulate reference", value: "USP ⟨789⟩ alignment" },
      { label: "Preservative reference", value: "USP ⟨51⟩ alignment" },
    ],
    primaryCta: {
      label: "Scope an ophthalmic programme",
      href: "/contact?source=pd-ophthalmic-hero-scope",
      variant: "primary",
    },
    secondaryCta: {
      label: "Use the Dosage Form Matcher",
      href: "/ai/dosage-matcher?source=pd-ophthalmic-hero",
      variant: "outline",
    },
  },
  challenges: {
    eyebrow: "Typical challenges we solve",
    heading: "What ophthalmic programmes actually run into",
    lede: "The label problems vary — the underlying mechanisms rarely do. The items below are what we end up scoping against on most briefs.",
    items: [
      {
        id: "tonicity",
        label: "Tonicity, pH and buffer capacity",
        description:
          "Osmolality and pH controlled to ranges tolerated by the ocular surface, with buffer capacity selected to hold those ranges across the labelled shelf life.",
      },
      {
        id: "sterility",
        label: "Sterility assurance for multi-dose presentations",
        description:
          "Contamination-control strategy scoped across compounding, filtration, fill and in-use. For preservative-free multi-dose presentations, pack selection is treated as part of the sterility argument.",
      },
      {
        id: "preservative",
        label: "Preservative efficacy for the in-use period",
        description:
          "USP ⟨51⟩ testing extended to cover the in-use period once the dropper is opened, with partitioning into suspended phases or ointment bases characterized rather than assumed.",
      },
      {
        id: "particulate",
        label: "Particulate matter at ophthalmic limits",
        description:
          "Sub-visible particulate per USP ⟨789⟩ — the ocular-specific chapter — rather than the general-parenteral limits of ⟨788⟩.",
      },
      {
        id: "stability",
        label: "Stability for aqueous ophthalmics and suspensions",
        description:
          "Hydrolysis, oxidation and phase behaviour studied under ICH Q1A(R2) zone II and IVb, with photostability per Q1B where the formulation is light-sensitive.",
      },
    ],
  },
  process: {
    eyebrow: "Our process",
    heading: "From tonicity scoping to release-ready, in one record",
    lede: "The stepper reflects the order of work on most ophthalmic programmes. Both hubs operate under a single QMS, so handoffs are document-first.",
    steps: [
      {
        id: "characterization",
        label: "Drug substance and ocular-target characterization",
        description:
          "Solubility, pH–stability profile, ocular-tolerance considerations and excipient compatibility characterized against the target product profile.",
        notes: [
          "pH–solubility and buffer-capacity profile",
          "Osmolality targeting",
          "Excipient compatibility matrix",
        ],
      },
      {
        id: "formulation",
        label: "Formulation and preservative development",
        description:
          "Vehicle, buffer, tonicity-adjuster and preservative system developed against critical quality attributes and ocular tolerability.",
        notes: [
          "Preservative efficacy per USP ⟨51⟩",
          "Tonicity and pH control",
          "Critical quality attributes agreed with sponsor",
        ],
      },
      {
        id: "analytical",
        label: "Analytical and particulate method development",
        description:
          "Assay, related substances, sub-visible particulate (USP ⟨789⟩) and preservative content methods authored alongside the formulation and validated under ICH Q2(R2).",
        notes: [
          "Particulate matter per USP ⟨789⟩",
          "Stability-indicating assay",
          "Method validation to ICH Q2(R2)",
        ],
      },
      {
        id: "stability",
        label: "Stability and in-use study conduct",
        description:
          "Long-term, accelerated and in-use stability under ICH Q1A(R2), with photostability per Q1B where applicable.",
        notes: [
          "ICH zone II and IVb conditions",
          "In-use stability across labelled use period",
          "Photostability per ICH Q1B where applicable",
        ],
      },
      {
        id: "scale-up",
        label: "Scale-up and contamination-control strategy",
        description:
          "Filtration, filling and, for ointments, processing-temperature parameters defined and risk-assessed under ICH Q9(R1); contamination-control strategy documented end-to-end.",
        notes: [
          "Filter compatibility and validation scoping",
          "Risk assessment under Q9(R1)",
          "Contamination-control strategy authored",
        ],
      },
      {
        id: "tech-transfer",
        label: "Tech-transfer and release",
        description:
          "Methods, specifications and batch records transfer into release testing and, where applicable, DEL-scope operations.",
        notes: [
          "Method transfer protocol and report",
          "Release testing under the Canadian DEL",
          "Change-control path established",
        ],
      },
    ],
  },
  equipment: {
    eyebrow: "Equipment and techniques",
    heading: "What the bench actually looks like",
    lede: "Representative equipment and techniques used on ophthalmic programmes. The validated inventory with qualification status is shared under NDA during the pre-visit briefing.",
    groups: [
      {
        id: "formulation",
        category: "Formulation and processing",
        chips: [
          "Compounding under LAF",
          "Sterile filtration trains",
          "Filter compatibility rig",
          "Dropper-bottle filling (bench-scale)",
          "Ointment tube filling (bench-scale)",
          "Homogenization for suspensions",
          "Ophthalmic-grade rinsing stations",
        ],
      },
      {
        id: "analytical",
        category: "Analytical",
        chips: [
          "HPLC (UV / DAD)",
          "Sub-visible particulate per USP ⟨789⟩",
          "Osmolality",
          "pH and conductivity",
          "Viscosity (for suspensions)",
          "Preservative efficacy per USP ⟨51⟩",
          "Microbial limits per USP ⟨61⟩ / ⟨62⟩",
          "Endotoxin (LAL) via partner lab",
        ],
      },
      {
        id: "stability",
        category: "Stability and environment",
        chips: [
          "ICH zone II chambers",
          "ICH zone IVb chambers",
          "Photostability per ICH Q1B",
          "In-use stability stations",
        ],
      },
    ],
    representativeNote:
      "Representative list. The current validated inventory is available on request under NDA.",
    cta: {
      label: "Request the validated inventory",
      href: "/contact?source=pd-ophthalmic-inventory",
      variant: "outline",
    },
  },
  outcome: {
    eyebrow: "Outcome pattern",
    heading: "Programme-level outcomes we aim for",
    lede: "The figures below describe the kind of outcomes ophthalmic programmes target — not claims against a specific client engagement. Named, permission-cleared case studies arrive with Prompt 14.",
    metrics: [
      {
        id: "tonicity",
        label: "Tonicity and pH",
        value: "Ocular-compatible",
        context: "Osmolality and pH held across shelf life with buffer capacity selected against the study.",
      },
      {
        id: "particulate",
        label: "Particulate matter",
        value: "USP ⟨789⟩-aligned",
        context: "Sub-visible particulate evaluated against ophthalmic-specific limits rather than general parenteral.",
      },
      {
        id: "transfer",
        label: "Tech-transfer",
        value: "Document-first",
        context: "Methods, specifications and batch records transferred without re-opening formulation work.",
      },
    ],
    status: "under-confirmation",
    statusCopy:
      "Documentation available on request. Named case studies land with Prompt 14 once client permissions are confirmed.",
  },
  selfCheck: {
    eyebrow: "Is this right for you?",
    heading: "Three questions worth answering before the first call",
    lede: "Short self-check to shape the conversation. The answers prefill the Dosage Form Matcher so the assistant opens on your context rather than a blank page.",
    questions: [
      {
        id: "form-type",
        prompt: "Is the product an aqueous drop, a suspension or an ointment?",
        helper:
          "Form drives the preservative, particulate and container-closure conversation from the first call.",
      },
      {
        id: "presentation",
        prompt: "Is the intended presentation multi-dose preserved, multi-dose preservative-free, or unit-dose?",
        helper:
          "Presentation choice shapes the sterility argument and the pack selection materially.",
      },
      {
        id: "markets",
        prompt: "Which markets is the product intended for — Canada, US, both, or broader?",
        helper:
          "Market scope drives stability zones and regulatory pathway — ophthalmic filings vary meaningfully by region.",
      },
    ],
    cta: {
      label: "Open the Dosage Form Matcher",
      href: "/ai/dosage-matcher?source=pd-ophthalmic-selfcheck",
      variant: "primary",
    },
    disclaimer:
      "The Matcher is an AI assistant drawing on Propharmex's public documentation. Its output is informational and not a regulatory guarantee — the team will review any recommendation that shapes your filing.",
  },
  faq: {
    eyebrow: "FAQ",
    heading: "Questions we're usually asked on the first call",
    lede: "If your question is not here, send it ahead of the call — we would rather walk in with an answer than improvise one.",
    items: [
      {
        id: "particulate",
        question: "Why USP ⟨789⟩ rather than ⟨788⟩?",
        answer:
          "USP ⟨789⟩ is the ophthalmic-specific sub-visible particulate chapter, with limits tighter than — and specifically fit for — the ocular route. Using ⟨788⟩ for an ophthalmic product is a common misstep that we flag early and correct against the dosage form.",
      },
      {
        id: "preservative",
        question: "How do you handle preservative efficacy for multi-dose ophthalmics?",
        answer:
          "Preservative efficacy is evaluated under USP ⟨51⟩ at release and across the shelf life, with the in-use period studied against the intended dropper. For preservative-free multi-dose presentations, the pack — typically an airless or filtered-vent system — is treated as part of the sterility argument, not an accessory.",
      },
      {
        id: "suspension",
        question: "How do you approach ophthalmic suspensions?",
        answer:
          "Suspensions are developed with particle size, sedimentation and redispersion behaviour characterized against dosing uniformity and ocular tolerability. The redispersibility claim on the label is tied to documented shake conditions, and the particulate specification is set below the ocular-sensation threshold.",
      },
      {
        id: "stability",
        question: "Which stability studies do you run for ophthalmics?",
        answer:
          "Long-term and accelerated stability under ICH Q1A(R2) zone II and IVb, with photostability per Q1B where the formulation is light-sensitive. In-use stability across the labelled use period is standard, since the dropper spends more time in the patient's life than on the shelf.",
      },
    ],
  },
  related: {
    eyebrow: "Related services",
    heading: "Work that typically runs alongside an ophthalmic programme",
    lede: "Most programmes touch at least two of the following. Each link opens the detail for that service.",
    links: [
      {
        id: "analytical",
        label: "Analytical services",
        description:
          "Particulate, osmolality, assay and preservative method development authored alongside the formulation.",
        href: "/services/analytical-services",
      },
      {
        id: "regulatory",
        label: "Regulatory services",
        description:
          "Health Canada submissions and coordinated USFDA ANDA or NDA work for ophthalmic programmes.",
        href: "/services/regulatory-services",
      },
      {
        id: "quality",
        label: "Quality and compliance",
        description:
          "The DEL and the unified QMS, including the contamination-control strategy authored end-to-end.",
        href: "/quality-compliance",
      },
    ],
  },
  closing: {
    eyebrow: "Next step",
    heading: "Send the target product profile. We'll send back a development plan you can review with QA.",
    body: "Most first calls are a working conversation: we walk through the API, the presentation, the preservative strategy, and the submission plan, and draft a development outline against that. If we are not the right partner for the molecule or the presentation, we will tell you on that call.",
    primaryCta: {
      label: "Scope an ophthalmic programme",
      href: "/contact?source=pd-ophthalmic-closing-scope",
      variant: "primary",
    },
    secondaryCta: {
      label: "Book a 30-minute call",
      href: "/contact?source=pd-ophthalmic-closing-call",
      variant: "outline",
    },
    regulatoryNote: {
      kind: "primary",
      label: "USP General Chapter ⟨789⟩ — Particulate Matter in Ophthalmic Solutions",
      href: "https://www.uspnf.com/",
    },
  },
};

/* -------------------------------------------------------------------------- */
/*  Transdermal & modified release leaf                                       */
/* -------------------------------------------------------------------------- */

export const DOSAGE_FORM_TRANSDERMAL_MR: DosageFormContent = {
  slug: "transdermal-modified-release",
  label: "Transdermal & modified release",
  crumbLabel: "Transdermal & MR",
  metaTitle: "Transdermal and modified-release development — Propharmex",
  metaDescription:
    "Patch, extended-release and controlled-release development at Propharmex — diffusion, IVRT, food-effect strategy and release-mechanism characterization authored to travel.",
  ogTitle: "Transdermal and modified-release development — Propharmex",
  ogDescription:
    "From release mechanism to dossier. Transdermal and MR development executed by Propharmex, filed under our Health Canada Drug Establishment Licence.",
  hero: {
    eyebrow: "Pharmaceutical Development · Transdermal & modified release",
    headline: "Patches and extended- or controlled-release oral products — developed around the release mechanism, not just the release curve.",
    valueProp:
      "Transdermal and MR programmes authored with the release mechanism characterized, the in-vitro package discriminating, and the food-effect argument made before the pivotal trial.",
    lede: "MR briefs are usually judged on a release curve, but the defensible argument lives one layer beneath — the mechanism that produces the curve and will reproduce it at scale. We characterize the mechanism early, design the in-vitro package to discriminate formulation change rather than pass a single batch, and scope the food-effect strategy alongside the formulation so it is not the last question answered.",
    stats: [
      { label: "Forms supported", value: "Patches · ER · CR oral" },
      { label: "Release reference", value: "USP ⟨711⟩ / ⟨724⟩ alignment" },
      { label: "Stability reference", value: "ICH Q1A(R2)" },
    ],
    primaryCta: {
      label: "Scope a transdermal / MR programme",
      href: "/contact?source=pd-transdermal-hero-scope",
      variant: "primary",
    },
    secondaryCta: {
      label: "Use the Dosage Form Matcher",
      href: "/ai/dosage-matcher?source=pd-transdermal-hero",
      variant: "outline",
    },
  },
  challenges: {
    eyebrow: "Typical challenges we solve",
    heading: "What transdermal and MR programmes actually run into",
    lede: "The label problems vary — the underlying mechanisms rarely do. The items below are what we end up scoping against on most briefs.",
    items: [
      {
        id: "mechanism",
        label: "Release mechanism characterization",
        description:
          "Diffusion, erosion, osmotic and matrix mechanisms distinguished and documented — not described by curve-fit alone. Mechanism evidence carries into scale-up and change-control decisions.",
      },
      {
        id: "ivrt",
        label: "Discriminatory in-vitro release testing",
        description:
          "USP ⟨711⟩ dissolution or ⟨724⟩ drug release developed to discriminate formulation change and, where applicable, to support IVIVC rather than pass a single batch.",
      },
      {
        id: "food",
        label: "Food-effect strategy for oral MR products",
        description:
          "Dose-dumping risk, pH-dependency and lipid-phase interaction scoped against the release mechanism. The food-effect argument is authored into the development record, not reverse-engineered from trial data.",
      },
      {
        id: "adhesion",
        label: "Adhesion and skin-permeation for transdermals",
        description:
          "Adhesive system characterized against wear-time, backing and release-liner choices; in-vitro permeation testing designed around the target flux and the intended wear pattern.",
      },
      {
        id: "stability",
        label: "Stability for MR systems under ICH zones",
        description:
          "Mechanism drift across shelf life tracked under ICH Q1A(R2) zone II and IVb — the release profile holding is necessary but not sufficient if the mechanism behind it has shifted.",
      },
    ],
  },
  process: {
    eyebrow: "Our process",
    heading: "From mechanism scoping to release-ready, in one record",
    lede: "The stepper reflects the order of work on most transdermal and MR programmes. Both hubs operate under a single QMS, so handoffs are document-first.",
    steps: [
      {
        id: "characterization",
        label: "Drug substance and release-target characterization",
        description:
          "Permeability, pH–solubility, dose–release target and, for transdermals, skin-permeation profile characterized against the target product profile.",
        notes: [
          "Permeability and pH–solubility profile",
          "Dose–release target agreed with sponsor",
          "Skin-permeation baseline for transdermals",
        ],
      },
      {
        id: "formulation",
        label: "Formulation and mechanism selection",
        description:
          "For oral MR: matrix, osmotic or reservoir system selection with polymer-grade sourcing documented. For transdermals: adhesive chemistry and backing selection against wear-time target.",
        notes: [
          "Mechanism selection with justification",
          "Polymer or adhesive grade sourcing",
          "Critical quality attributes agreed with sponsor",
        ],
      },
      {
        id: "analytical",
        label: "Analytical and in-vitro release development",
        description:
          "Assay, related substances and release-testing methods authored alongside the formulation, with discriminatory power the primary design objective. Validation under ICH Q2(R2) once locked.",
        notes: [
          "USP ⟨711⟩ dissolution or ⟨724⟩ drug release",
          "In-vitro permeation testing (Franz cells) for transdermals",
          "Method validation to ICH Q2(R2)",
        ],
      },
      {
        id: "stability",
        label: "Stability study conduct",
        description:
          "Long-term and accelerated stability under ICH Q1A(R2), with release-profile stability and, where applicable, mechanism-drift tracking across pulls.",
        notes: [
          "ICH zone II and IVb conditions",
          "Release-profile stability across pulls",
          "Photostability per ICH Q1B where applicable",
        ],
      },
      {
        id: "scale-up",
        label: "Scale-up and process characterization",
        description:
          "Coating, lamination or compression parameters defined and risk-assessed under ICH Q9(R1); pilot- or registration-scale batches manufactured and characterized.",
        notes: [
          "Design space articulated per Q8(R2)",
          "Risk assessment under Q9(R1)",
          "Pilot batch manufactured and sampled",
        ],
      },
      {
        id: "tech-transfer",
        label: "Tech-transfer and release",
        description:
          "Methods, specifications and batch records transfer into release testing and, where applicable, DEL-scope operations.",
        notes: [
          "Method transfer protocol and report",
          "Release testing under the Canadian DEL",
          "Change-control path established",
        ],
      },
    ],
  },
  equipment: {
    eyebrow: "Equipment and techniques",
    heading: "What the bench actually looks like",
    lede: "Representative equipment and techniques used on transdermal and MR programmes. The validated inventory with qualification status is shared under NDA during the pre-visit briefing.",
    groups: [
      {
        id: "formulation",
        category: "Formulation and processing",
        chips: [
          "Hot-melt extrusion",
          "Film coating (pan and fluid-bed)",
          "Laminator (transdermal)",
          "Solvent casting",
          "Matrix compression (rotary)",
          "Roller compaction",
          "Die-cutting (patch)",
          "Osmotic-system laser drilling (via partner)",
        ],
      },
      {
        id: "analytical",
        category: "Analytical",
        chips: [
          "HPLC (UV / DAD)",
          "LC-MS/MS",
          "Dissolution — USP Apparatus 1, 2, 3, 4",
          "Drug release — USP ⟨724⟩",
          "In-vitro permeation (Franz cells)",
          "Adhesion and peel testing",
          "Rheometry",
          "Particle size (laser diffraction)",
        ],
      },
      {
        id: "stability",
        category: "Stability and environment",
        chips: [
          "ICH zone II chambers",
          "ICH zone IVb chambers",
          "Photostability per ICH Q1B",
          "Wear-time simulation (transdermal)",
        ],
      },
    ],
    representativeNote:
      "Representative list. The current validated inventory is available on request under NDA.",
    cta: {
      label: "Request the validated inventory",
      href: "/contact?source=pd-transdermal-inventory",
      variant: "outline",
    },
  },
  outcome: {
    eyebrow: "Outcome pattern",
    heading: "Programme-level outcomes we aim for",
    lede: "The figures below describe the kind of outcomes transdermal and MR programmes target — not claims against a specific client engagement. Named, permission-cleared case studies arrive with Prompt 14.",
    metrics: [
      {
        id: "mechanism",
        label: "Release mechanism",
        value: "Characterized",
        context: "Distinguished by evidence, not curve-fit alone — documented into change-control decisions.",
      },
      {
        id: "ivrt",
        label: "In-vitro release",
        value: "Discriminatory",
        context: "Method designed to detect formulation change, not pass a single batch.",
      },
      {
        id: "transfer",
        label: "Tech-transfer",
        value: "Document-first",
        context: "Methods, specifications and batch records transferred without re-opening formulation work.",
      },
    ],
    status: "under-confirmation",
    statusCopy:
      "Documentation available on request. Named case studies land with Prompt 14 once client permissions are confirmed.",
  },
  selfCheck: {
    eyebrow: "Is this right for you?",
    heading: "Three questions worth answering before the first call",
    lede: "Short self-check to shape the conversation. The answers prefill the Dosage Form Matcher so the assistant opens on your context rather than a blank page.",
    questions: [
      {
        id: "form-type",
        prompt: "Is the product a transdermal patch or an oral modified-release form?",
        helper:
          "Form drives the adhesion or the dissolution-apparatus conversation from the first call.",
      },
      {
        id: "mechanism",
        prompt: "Do you have a target release mechanism in mind — matrix, osmotic, reservoir or other?",
        helper:
          "Mechanism selection shapes polymer sourcing, release-testing apparatus and scale-up path.",
      },
      {
        id: "food",
        prompt: "For oral MR: is food-effect mitigation already in scope?",
        helper:
          "Food-effect work is cheaper authored into development than reverse-engineered after a pivotal trial.",
      },
    ],
    cta: {
      label: "Open the Dosage Form Matcher",
      href: "/ai/dosage-matcher?source=pd-transdermal-selfcheck",
      variant: "primary",
    },
    disclaimer:
      "The Matcher is an AI assistant drawing on Propharmex's public documentation. Its output is informational and not a regulatory guarantee — the team will review any recommendation that shapes your filing.",
  },
  faq: {
    eyebrow: "FAQ",
    heading: "Questions we're usually asked on the first call",
    lede: "If your question is not here, send it ahead of the call — we would rather walk in with an answer than improvise one.",
    items: [
      {
        id: "mechanism",
        question: "Why characterize the release mechanism rather than just the curve?",
        answer:
          "Two formulations can produce indistinguishable release curves at release and diverge at month-nine stability, or at scale. Characterizing the mechanism — matrix erosion vs. diffusion vs. osmotic pumping — gives the development team and the regulator a defensible basis for change-control and for the release specification. Curve-fit alone does not.",
      },
      {
        id: "ivivc",
        question: "Do you support IVIVC development?",
        answer:
          "Where the programme warrants it, yes. IVIVC is scoped as a named workstream against the release mechanism and the pharmacokinetic profile, and the in-vitro method is designed to be predictive rather than retrospective. We do not promise an IVIVC on products where the mechanism or the PK data do not support one.",
      },
      {
        id: "food",
        question: "How do you handle food-effect for oral MR?",
        answer:
          "Food-effect strategy is scoped at the formulation stage, not after the pivotal trial. Dose-dumping risk, pH-dependency and lipid-phase interactions are evaluated against the proposed mechanism, and the in-vitro package is designed to flag food-related release changes before the clinic does.",
      },
      {
        id: "adhesion",
        question: "How do you approach patch adhesion and wear-time?",
        answer:
          "Adhesive chemistry, backing and release-liner choices are scoped against the target wear-time and the anatomical site. Peel, tack and shear are characterized at release and across shelf life; wear-time simulation is used to stress the adhesive argument before clinical confirmation.",
      },
    ],
  },
  related: {
    eyebrow: "Related services",
    heading: "Work that typically runs alongside a transdermal or MR programme",
    lede: "Most programmes touch at least two of the following. Each link opens the detail for that service.",
    links: [
      {
        id: "analytical",
        label: "Analytical services",
        description:
          "Dissolution, drug release, in-vitro permeation and assay method development authored alongside the formulation.",
        href: "/services/analytical-services",
      },
      {
        id: "regulatory",
        label: "Regulatory services",
        description:
          "Health Canada submissions and coordinated USFDA ANDA or NDA work for transdermal and MR programmes.",
        href: "/services/regulatory-services",
      },
      {
        id: "quality",
        label: "Quality and compliance",
        description:
          "The DEL and the unified QMS that make tech-transfer a document exercise rather than a re-authoring one.",
        href: "/quality-compliance",
      },
    ],
  },
  closing: {
    eyebrow: "Next step",
    heading: "Send the target product profile. We'll send back a development plan you can review with QA.",
    body: "Most first calls are a working conversation: we walk through the API, the intended release mechanism, the submission plan and the food-effect strategy, and draft a development outline against that. If we are not the right partner for the molecule or the mechanism, we will tell you on that call.",
    primaryCta: {
      label: "Scope a transdermal / MR programme",
      href: "/contact?source=pd-transdermal-closing-scope",
      variant: "primary",
    },
    secondaryCta: {
      label: "Book a 30-minute call",
      href: "/contact?source=pd-transdermal-closing-call",
      variant: "outline",
    },
    regulatoryNote: {
      kind: "primary",
      label: "ICH Q8(R2) — Pharmaceutical Development",
      href: "https://www.ich.org/page/quality-guidelines",
    },
  },
};

export const DOSAGE_FORM_CONTENT: Record<DosageFormSlug, DosageFormContent> = {
  "solid-oral-dosage": DOSAGE_FORM_SOLID_ORAL,
  "liquid-oral-dosage": DOSAGE_FORM_LIQUID_ORAL,
  "topical-semisolid": DOSAGE_FORM_TOPICAL_SEMISOLID,
  "sterile-injectables": DOSAGE_FORM_STERILE_INJECTABLES,
  "inhalation": DOSAGE_FORM_INHALATION,
  "ophthalmic": DOSAGE_FORM_OPHTHALMIC,
  "transdermal-modified-release": DOSAGE_FORM_TRANSDERMAL_MR,
};

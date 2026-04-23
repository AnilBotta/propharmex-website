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
  owner: "hyderabad" | "mississauga" | "both";
};

export type PharmDevLifecycle = {
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
  /** Which hub owns the step — mirrors lifecycle ownership shorthand. */
  owner: "hyderabad" | "mississauga" | "both";
  /** Short technical notes surfaced under the step description. */
  notes: string[];
};

export type DosageFormProcess = {
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
    "End-to-end pharmaceutical development across seven dosage forms. Formulation, scale-up and tech-transfer authored in Hyderabad and closed out under the Health Canada DEL in Mississauga.",
  ogTitle: "Pharmaceutical Development — Propharmex",
  ogDescription:
    "Seven dosage forms, one quality system. Development work authored to travel — from bench to dossier to batch record.",
  hero: {
    eyebrow: "Services · Pharmaceutical Development",
    headline: "Development work, authored to travel.",
    lede: "Formulation and process work begin in Hyderabad, are transferred into Mississauga under a single quality system, and arrive at the regulator as a readable dossier. Seven dosage forms are supported — from solid oral tablets to sterile injectables — each with a process tailored to what the molecule actually requires.",
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
        leafStatus: "shipping-next",
      },
      {
        slug: "topical-semisolid",
        label: "Topical & semisolid",
        blurb:
          "Creams, gels, ointments, lotions. Phase behaviour, in-vitro release testing, preservative efficacy.",
        highlights: ["Creams", "Gels", "IVRT"],
        leafStatus: "shipping-next",
      },
      {
        slug: "sterile-injectables",
        label: "Sterile injectables",
        blurb:
          "Parenterals, lyophilized products, SVP and LVP. Container-closure, sterility assurance, lyo cycle design.",
        highlights: ["Lyophilization", "SVP", "Container-closure"],
        leafStatus: "shipping-next",
      },
      {
        slug: "inhalation",
        label: "Inhalation",
        blurb:
          "MDIs, DPIs, nebulizer solutions, nasal sprays. Aerosol characterization and device pairing.",
        highlights: ["MDI", "DPI", "Nasal spray"],
        leafStatus: "shipping-next",
      },
      {
        slug: "ophthalmic",
        label: "Ophthalmic",
        blurb:
          "Eye drops, ophthalmic suspensions and ointments. Tonicity, sterility, preservative efficacy.",
        highlights: ["Eye drops", "Sterility", "Osmolality"],
        leafStatus: "shipping-next",
      },
      {
        slug: "transdermal-modified-release",
        label: "Transdermal & modified release",
        blurb:
          "Patches, extended- and controlled-release oral. Diffusion, in-vitro release, food-effect strategy.",
        highlights: ["Patches", "Extended release", "IVIVC"],
        leafStatus: "shipping-next",
      },
    ],
    liveCopy: "Detail page available",
    shippingNextCopy: "Detail page shipping next",
  },
  lifecycle: {
    eyebrow: "Programme lifecycle",
    heading: "Preformulation → formulation → scale-up → tech-transfer",
    lede: "Every programme runs through the same four stages, with ownership written into the plan from day one. Hyderabad authors and Mississauga closes out — the record never leaves a single quality system, and the handoff is documented, not improvised.",
    stages: [
      {
        id: "preformulation",
        label: "Preformulation",
        description:
          "Characterization of the drug substance, compatibility screening, and early dosage-form feasibility against the target product profile.",
        owner: "hyderabad",
      },
      {
        id: "formulation",
        label: "Formulation development",
        description:
          "Iterative formulation work against critical quality attributes. Method-development and stability-indicating assays are authored alongside the formulation.",
        owner: "hyderabad",
      },
      {
        id: "scale-up",
        label: "Scale-up",
        description:
          "Process parameter ranges are defined, risk-assessed under ICH Q9(R1), and qualified for pilot- or registration-scale batches.",
        owner: "both",
      },
      {
        id: "tech-transfer",
        label: "Tech-transfer",
        description:
          "Methods, specifications, and batch records move to Mississauga for release testing and, where applicable, DEL-scope operations.",
        owner: "mississauga",
      },
    ],
    ownerLegend: {
      hyderabad: "Hyderabad — development authoring",
      mississauga: "Mississauga — tech-transfer, release, DEL scope",
      both: "Both hubs — jointly planned",
    },
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
        body: "Assay and related-substances methods rebuilt to be stability-indicating under ICH Q1A(R2) zone IVb conditions, with transfer into Mississauga for release use.",
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
    "From BCS classification to dossier. Solid oral development authored in Hyderabad, closed out in Mississauga under the Health Canada DEL.",
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
          "Process parameters, method transfer, and specifications moved to Mississauga with documentation a reviewer — or a later site — can reproduce without calling the development team.",
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
        owner: "hyderabad",
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
        owner: "hyderabad",
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
        owner: "hyderabad",
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
        owner: "both",
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
        owner: "both",
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
          "Methods, specifications, and batch records transfer into Mississauga for release testing and, where applicable, DEL-scope operations.",
        owner: "mississauga",
        notes: [
          "Method transfer protocol and report",
          "Release testing under the Canadian DEL",
          "Change-control path established",
        ],
      },
    ],
    ownerLegend: {
      hyderabad: "Hyderabad — development authoring",
      mississauga: "Mississauga — transfer, release, DEL scope",
      both: "Both hubs — jointly planned",
    },
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
          "Formulation, analytical method development and the initial stability work are authored in Hyderabad. Tech-transfer, release testing and — where applicable — DEL-scope operations are executed in Mississauga. Both sites run on a single quality system, so the record is continuous rather than stitched together at the handoff.",
      },
      {
        id: "stability-zones",
        question: "Which ICH stability zones can you run?",
        answer:
          "Zone II (25°C / 60% RH) and zone IVb (30°C / 75% RH) chambers are operated at the Hyderabad site with continuous monitoring. Photostability testing is scoped under ICH Q1B where applicable. The study design is agreed against your submission plan before the first sample is pulled.",
      },
      {
        id: "dissolution",
        question: "How do you approach dissolution method development?",
        answer:
          "We develop dissolution methods to be both stability-indicating and discriminatory. Media selection is driven by the dosage form and the question the method needs to answer — not by a single default. The method travels with the formulation into validation under ICH Q2(R2) and into release use in Mississauga.",
      },
      {
        id: "regulatory",
        question: "Do you handle the regulatory submission as well?",
        answer:
          "The regulatory team in Mississauga authors Health Canada submissions and coordinates ANDA or DMF work with the USFDA when the programme spans both markets. The development record is written with those submissions in mind from the start — it is not re-authored at the end.",
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

export const DOSAGE_FORM_CONTENT: Partial<Record<DosageFormSlug, DosageFormContent>> = {
  "solid-oral-dosage": DOSAGE_FORM_SOLID_ORAL,
};

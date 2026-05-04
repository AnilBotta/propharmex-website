/**
 * Content dictionary for /services/clinical-be-insight — the Clinical & BE
 * Insight pillar hub.
 *
 * The fourth capability pillar named in the brand brief and referenced in
 * about.ts and why.ts. Scope is insight + strategy work — bioequivalence
 * study design, pivotal BE strategy, clinical regulatory strategy, and
 * IND-enabling study consultation. We do not run trials.
 *
 * Type aliases reuse the PharmDev hub primitives structurally so the
 * existing <HubHero> and <HubClosing> components in components/pharmdev/
 * render this content without modification. The capability grid uses a
 * dedicated <ServicesMatrix> component (clinical/) because the pharm-dev
 * CapabilityMatrix is hard-typed to dosage-form slugs.
 */
import type {
  PharmDevHubClosing,
  PharmDevHubHero,
} from "./pharmaceutical-development";

/* -------------------------------------------------------------------------- */
/*  Type aliases (structural reuse of pharmdev hub shapes)                    */
/* -------------------------------------------------------------------------- */

export type ClinicalHubHero = PharmDevHubHero;
export type ClinicalHubClosing = PharmDevHubClosing;

/** Clinical & BE Insight services. Slug is currently unused (no leaf pages */
/** ship in this PR) but is reserved for future leaf routes under            */
/** /services/clinical-be-insight/[service].                                  */
export const CLINICAL_SERVICE_SLUGS = [
  "bioequivalence-study-design",
  "pivotal-be-strategy",
  "clinical-regulatory-strategy",
  "ind-enabling-study-consultation",
] as const;

export type ClinicalServiceSlug = (typeof CLINICAL_SERVICE_SLUGS)[number];

export type ClinicalServiceSummary = {
  slug: ClinicalServiceSlug;
  label: string;
  /** One-sentence elevator line on the hub card. */
  blurb: string;
  /** Short keyword chips below the blurb. */
  highlights: string[];
  /** Whether the leaf detail page is live in this PR. */
  leafStatus: "live" | "shipping-next";
};

export type ClinicalServicesMatrix = {
  eyebrow: string;
  heading: string;
  lede: string;
  services: ClinicalServiceSummary[];
  liveCopy: string;
  shippingNextCopy: string;
};

export type ClinicalHubContent = {
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  hero: ClinicalHubHero;
  matrix: ClinicalServicesMatrix;
  closing: ClinicalHubClosing;
};

/* -------------------------------------------------------------------------- */
/*  Hub content                                                               */
/* -------------------------------------------------------------------------- */

export const CLINICAL_HUB: ClinicalHubContent = {
  metaTitle: "Clinical & BE Insight — Propharmex",
  metaDescription:
    "Bioequivalence study design, pivotal BE strategy, clinical regulatory strategy, and IND-enabling consultation. Insight and strategy work for drug developers running complex-generic and specialty programmes — under one quality system with the development bench.",
  ogTitle: "Clinical & BE Insight — Propharmex",
  ogDescription:
    "BE study design, pivotal strategy, and clinical regulatory insight for complex-generic and specialty programmes — read against ICH E9(R1), Health Canada, and USFDA guidance.",
  hero: {
    eyebrow: "Capabilities · Clinical & BE Insight",
    headline: "Insight, not a clinical menu.",
    lede: "Clinical and bioequivalence work is a strategy problem before it is an operational one — what study answers the regulator's question, what comparator to use, what statistical model to lock down, what dosage-form difference will the agency tolerate. We are positioned for the strategy and design work, read against ICH E9(R1) and the relevant Health Canada and USFDA guidance — and we coordinate with the named CROs that run the trials.",
    stats: [
      { label: "Capability pillars", value: "4 of 4" },
      { label: "Detail pages live", value: "0 of 4" },
      { label: "Statistical framework", value: "ICH E9(R1)" },
    ],
    primaryCta: {
      label: "Scope a BE strategy review",
      href: "/contact?intent=quote&source=clinical-hub-hero",
      variant: "primary",
    },
    secondaryCta: {
      label: "Read how we operate",
      href: "/our-process",
      variant: "outline",
    },
  },
  matrix: {
    eyebrow: "Service index",
    heading: "Four insight capabilities.",
    lede: "Each capability sits ahead of the trial — the work that decides whether the trial answers the question, and whether the agency will read the answer the way you intend it. Detail pages are shipping next; briefs are available on request in the meantime.",
    services: [
      {
        slug: "bioequivalence-study-design",
        label: "Bioequivalence study design",
        blurb:
          "Comparator selection, sample-size calculation, fasting versus fed strategy, replicate versus parallel design, and the statistical lock that the agency will read against.",
        highlights: ["AUC / Cmax", "Replicate design", "ICH E9(R1)"],
        leafStatus: "shipping-next",
      },
      {
        slug: "pivotal-be-strategy",
        label: "Pivotal BE strategy",
        blurb:
          "Pilot-to-pivotal transition, scale-up impact assessment, and product-specific guidance gap analysis for ANDA, ANDS, and complex-generic 505(j) pathways.",
        highlights: ["ANDA", "ANDS", "Product-specific guidance"],
        leafStatus: "shipping-next",
      },
      {
        slug: "clinical-regulatory-strategy",
        label: "Clinical regulatory strategy",
        blurb:
          "Regulator-by-regulator clinical strategy across Health Canada, USFDA, EMA, and TGA — including biowaivers, BCS-class arguments, and clinical-pharmacology summary authoring.",
        highlights: ["Biowaivers", "BCS class", "Module 2.7"],
        leafStatus: "shipping-next",
      },
      {
        slug: "ind-enabling-study-consultation",
        label: "IND-enabling study consultation",
        blurb:
          "Pre-IND meeting strategy, study-package gap analysis, and the bridge between development data and the clinical question the regulator will need answered.",
        highlights: ["Pre-IND", "Study package", "Module 2.6"],
        leafStatus: "shipping-next",
      },
    ],
    liveCopy: "Detail page available.",
    shippingNextCopy: "Detail page shipping next — brief on request.",
  },
  closing: {
    eyebrow: "Talk to clinical strategy",
    heading: "Bring the protocol question, not just the molecule.",
    body: "We will read your draft protocol or product-specific guidance gap against current regulator practice — and tell you which study answers the question you actually need answered, what statistical lock the agency will accept, and which CRO is the right operational partner for the trial itself.",
    primaryCta: {
      label: "Request a quote",
      href: "/contact?intent=quote&source=clinical-hub-closing",
      variant: "primary",
    },
    secondaryCta: {
      label: "Read how we operate",
      href: "/our-process",
      variant: "outline",
    },
  },
};

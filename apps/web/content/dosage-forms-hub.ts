/**
 * Content dictionary for /dosage-forms — the dosage-form index hub.
 *
 * The hub surfaces all seven dosage forms in one place. Cards link into the
 * existing leaf pages under /services/pharmaceutical-development/[slug]. The
 * Solid oral leaf is live; the other six are "shipping-next" placeholders
 * served by the same dynamic route, and are surfaced here with a status
 * pill so the IA stays honest.
 *
 * Type aliases below reuse the PharmDev hub shapes structurally so the
 * existing <HubHero>, <CapabilityMatrix>, and <HubClosing> components in
 * apps/web/components/pharmdev/ render this content without modification.
 * Cross-namespace import is intentional and noted as future cleanup.
 */
import type {
  PharmDevCapabilityMatrix,
  PharmDevHubClosing,
  PharmDevHubHero,
} from "./pharmaceutical-development";

/* -------------------------------------------------------------------------- */
/*  Type aliases (structural reuse of pharmdev hub shapes)                    */
/* -------------------------------------------------------------------------- */

export type DosageFormsHubHero = PharmDevHubHero;
export type DosageFormsHubGrid = PharmDevCapabilityMatrix;
export type DosageFormsHubClosing = PharmDevHubClosing;

export type DosageFormsHubContent = {
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  hero: DosageFormsHubHero;
  grid: DosageFormsHubGrid;
  closing: DosageFormsHubClosing;
};

/* -------------------------------------------------------------------------- */
/*  Hub content                                                               */
/* -------------------------------------------------------------------------- */

export const DOSAGE_FORMS_HUB: DosageFormsHubContent = {
  metaTitle: "Dosage Forms — Propharmex",
  metaDescription:
    "Seven dosage forms, one development pathway. Index of Propharmex pharmaceutical-development capabilities — solid oral, liquid oral, topical, sterile injectable, inhalation, ophthalmic, and transdermal — each with its own process, equipment, and regulatory reading.",
  ogTitle: "Dosage Forms — Propharmex",
  ogDescription:
    "Pick the dosage form. Read the development pathway. Each form has its own process, equipment, and ICH reading list.",
  hero: {
    eyebrow: "Capabilities · Dosage Forms",
    headline: "Seven dosage forms, one development pathway.",
    lede: "Dosage form is the first decision a development programme makes — it sets the equipment, the analytical method work, and the regulatory pathway. We support seven forms across the Propharmex pharmaceutical-development practice. Pick the form below to read its process, equipment list, and the standards it is read against.",
    stats: [
      { label: "Dosage forms supported", value: "7" },
      { label: "Detail pages live", value: "1 of 7" },
      { label: "Quality system", value: "ICH Q10 alignment" },
    ],
    primaryCta: {
      label: "Use the Dosage Form Matcher",
      href: "/ai/dosage-matcher?source=dosage-forms-hub-hero",
      variant: "primary",
    },
    secondaryCta: {
      label: "Scope a development programme",
      href: "/contact?intent=quote&source=dosage-forms-hub-hero",
      variant: "outline",
    },
  },
  grid: {
    eyebrow: "Dosage form index",
    heading: "Choose by form, dive into the process.",
    lede: "Each card opens the development pathway for that form — challenges the formulation has to clear, the process stepper, the equipment groups, and the ICH guidelines the work is read against. Six detail pages are shipping next; their development briefs are available on request in the meantime.",
    forms: [
      {
        slug: "solid-oral-dosage",
        label: "Solid oral dosage",
        blurb:
          "Tablets, capsules, granules. Wet granulation, direct compression, and roller compaction processes.",
        highlights: ["Tablets", "Capsules", "Granules", "Coating"],
        leafStatus: "live",
      },
      {
        slug: "liquid-oral-dosage",
        label: "Liquid oral dosage",
        blurb:
          "Solutions, suspensions, and syrups. Preservation, taste-masking, and stability work for paediatric and adult presentations.",
        highlights: ["Solutions", "Suspensions", "Syrups"],
        leafStatus: "shipping-next",
      },
      {
        slug: "topical-semisolid",
        label: "Topical & semisolid",
        blurb:
          "Creams, ointments, and gels. Rheology, microbial preservation, and tube/jar fill compatibility.",
        highlights: ["Creams", "Ointments", "Gels"],
        leafStatus: "shipping-next",
      },
      {
        slug: "sterile-injectables",
        label: "Sterile injectables",
        blurb:
          "Lyophilized and liquid presentations. Aseptic process design, container-closure, and visible-particulate work.",
        highlights: ["Lyophilized", "Liquid", "Container-closure"],
        leafStatus: "shipping-next",
      },
      {
        slug: "inhalation",
        label: "Inhalation",
        blurb:
          "DPIs, MDIs, and nebulised solutions. Particle-size distribution, device compatibility, and FPF work.",
        highlights: ["DPI", "MDI", "Nebulised"],
        leafStatus: "shipping-next",
      },
      {
        slug: "ophthalmic",
        label: "Ophthalmic",
        blurb:
          "Sterile drops and ointments. Tonicity, pH, viscosity, and bioburden control across the product life.",
        highlights: ["Drops", "Ointments", "Sterility"],
        leafStatus: "shipping-next",
      },
      {
        slug: "transdermal-modified-release",
        label: "Transdermal & modified release",
        blurb:
          "Patches and modified-release matrices. Permeation work, adhesive selection, and dissolution profiling.",
        highlights: ["Patches", "Modified release", "Permeation"],
        leafStatus: "shipping-next",
      },
    ],
    liveCopy: "Detail page available.",
    shippingNextCopy: "Detail page shipping next — brief on request.",
  },
  closing: {
    eyebrow: "Talk to development",
    heading: "Bring the molecule, the target market, and the timeline.",
    body: "We will read your target product profile against the seven dosage-form pathways and tell you which fits the molecule, the manufacturing footprint, and the regulatory route — with the bench, equipment, and analytical reading that pathway will require.",
    primaryCta: {
      label: "Request a quote",
      href: "/contact?intent=quote&source=dosage-forms-hub-closing",
      variant: "primary",
    },
    secondaryCta: {
      label: "Use the Dosage Form Matcher",
      href: "/ai/dosage-matcher?source=dosage-forms-hub-closing",
      variant: "outline",
    },
  },
};

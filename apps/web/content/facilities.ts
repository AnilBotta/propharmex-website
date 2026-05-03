/**
 * Content dictionary for /facilities + /facilities/mississauga-canada +
 * /facilities/hyderabad-india.
 *
 * This is the interim shape; Prompt 4 will migrate it to Sanity `facility`
 * documents. The type surface is intentionally close to a Sanity schema so the
 * migration is a near-1:1 port.
 *
 * Positioning policy (PR-D2c1' — specialty-CDMO repositioning, follows
 * docs/regulatory-lexicon.md §"Positioning update — 2026-05-03"):
 *  - This page no longer asserts a Health Canada Drug Establishment Licence,
 *    a 3PL distribution footprint, WHO-GMP, ISO 9001, USFDA-registered, or
 *    TGA-recognized status. The previous "Mississauga is the DEL anchor"
 *    framing has been retired.
 *  - Mississauga is described as our Canadian headquarters — the
 *    client-facing site for project management, regulatory strategy, dossier
 *    authoring, and partner visits. It is not described as a manufacturing
 *    or distribution site.
 *  - Hyderabad is described as the development centre — formulation, method
 *    development and validation, stability, and impurity profiling. The
 *    scientific bench of the operation.
 *  - The optional `warehouseMap` field on the Mississauga detail is intentionally
 *    omitted because there is no longer a 3PL footprint to schematise.
 *  - Cold-chain content scoped to stability and reference-material storage
 *    (a real lab requirement) rather than 3PL distribution lanes.
 *  - Photography frames are still reserved (no real assets); equipment lists
 *    are representative; visit logistics are by appointment under NDA.
 *  - All claim-bearing UI follows the alignment-only pattern set in PR-D2b'
 *    (`apps/web/content/quality.ts`): operating-framework references only,
 *    no credential claims.
 */

/* -------------------------------------------------------------------------- */
/*  Shared primitives                                                         */
/* -------------------------------------------------------------------------- */

export type FacilityCta = {
  label: string;
  href: string;
  variant: "primary" | "secondary" | "ghost" | "outline";
};

/**
 * Primary-source link for any externally verifiable framework reference.
 * When `kind` is "internal", the label is rendered as muted copy with no
 * outbound link — the document is held internally and available on request.
 */
export type FacilitySource =
  | { kind: "primary"; label: string; href: string }
  | { kind: "internal"; label: string };

export type FacilityCode = "mississauga" | "hyderabad";

/**
 * Reserved photo frame. Consumers render a solid-colour gradient placeholder
 * shaped by `aspect` with the `caption` as an accessible label. When a real
 * asset arrives, upgrade the rendering component to `next/image` with
 * `blurDataURL` — the frame contract does not change.
 */
export type PhotoStub = {
  id: string;
  caption: string;
  /** CSS `aspect-ratio` value. Default 4/3 for gallery, 16/9 for hero strips. */
  aspect: "4/3" | "16/9" | "1/1";
  /**
   * Tailwind gradient class suffix — paired with a fixed `bg-gradient-to-br`
   * in the component so brand colour tokens stay inside the theme.
   */
  tone: "brand" | "neutral" | "warm";
};

/* -------------------------------------------------------------------------- */
/*  Index page                                                                */
/* -------------------------------------------------------------------------- */

export type FacilitiesIndexHero = {
  eyebrow: string;
  headline: string;
  lede: string;
  primaryCta: FacilityCta;
  secondaryCta: FacilityCta;
};

export type FacilitiesComparisonRow = {
  label: string;
  mississauga: string;
  hyderabad: string;
  /** Optional footnote shown as a primary-source link or muted caveat. */
  note?: FacilitySource;
};

export type FacilitiesComparison = {
  eyebrow: string;
  heading: string;
  lede: string;
  rows: FacilitiesComparisonRow[];
};

export type FacilitiesMap = {
  eyebrow: string;
  heading: string;
  lede: string;
  hubs: {
    code: FacilityCode;
    label: string;
    flag: string;
    country: string;
    coordinates: { lat: number; lng: number };
    role: string;
  }[];
  caveat: string;
};

export type FacilitiesCarousel = {
  eyebrow: string;
  heading: string;
  lede: string;
  photos: PhotoStub[];
};

/* -------------------------------------------------------------------------- */
/*  Detail page                                                               */
/* -------------------------------------------------------------------------- */

export type FacilityHero = {
  eyebrow: string;
  headline: string;
  lede: string;
  stats: { label: string; value: string }[];
  /** 360-viewer slot is a reserved placeholder. */
  viewerPlaceholder: {
    caption: string;
    note: string;
  };
  primaryCta: FacilityCta;
  secondaryCta: FacilityCta;
};

export type FacilityCapability = {
  id: string;
  label: string;
  description: string;
  /** "primary" = ops run here; "secondary" = supported in partnership with the other hub. */
  tier: "primary" | "secondary";
};

export type FacilityCapabilityMatrix = {
  eyebrow: string;
  heading: string;
  lede: string;
  capabilities: FacilityCapability[];
  legendPrimary: string;
  legendSecondary: string;
};

export type FacilityEquipmentItem = {
  id: string;
  category: string;
  label: string;
  detail: string;
};

export type FacilityEquipmentList = {
  eyebrow: string;
  heading: string;
  lede: string;
  representativeNote: string;
  items: FacilityEquipmentItem[];
  cta: FacilityCta;
};

export type FacilityColdChainZone = {
  id: string;
  label: string;
  range: string;
  uses: string;
  monitoring: string;
};

export type FacilityColdChainSpec = {
  eyebrow: string;
  heading: string;
  lede: string;
  zones: FacilityColdChainZone[];
  reference: FacilitySource;
};

export type WarehouseZone = {
  id: string;
  label: string;
  subLabel: string;
  tone: "neutral" | "cool" | "cold" | "secure" | "warm";
  /** Grid column/row position in a 3-col × 2-row schematic. */
  grid: { col: 1 | 2 | 3; row: 1 | 2 };
};

export type FacilityWarehouseMap = {
  eyebrow: string;
  heading: string;
  lede: string;
  schematicNote: string;
  zones: WarehouseZone[];
  legend: {
    tone: WarehouseZone["tone"];
    label: string;
  }[];
};

export type FacilityPhotoGallery = {
  eyebrow: string;
  heading: string;
  lede: string;
  photos: PhotoStub[];
};

export type FacilityVisitCta = {
  eyebrow: string;
  heading: string;
  body: string;
  primaryCta: FacilityCta;
  secondaryCta: FacilityCta;
  notice: string;
};

export type FacilityDetail = {
  code: FacilityCode;
  slug: string;
  city: string;
  region: string;
  country: string;
  countryCode: "CA" | "IN";
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  hero: FacilityHero;
  capabilities: FacilityCapabilityMatrix;
  equipment: FacilityEquipmentList;
  coldChain: FacilityColdChainSpec;
  warehouseMap?: FacilityWarehouseMap;
  gallery: FacilityPhotoGallery;
  visit: FacilityVisitCta;
};

/* -------------------------------------------------------------------------- */
/*  Top-level content payload                                                 */
/* -------------------------------------------------------------------------- */

export type FacilitiesContent = {
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  hero: FacilitiesIndexHero;
  map: FacilitiesMap;
  comparison: FacilitiesComparison;
  carousel: FacilitiesCarousel;
  closing: {
    eyebrow: string;
    heading: string;
    body: string;
    primaryCta: FacilityCta;
    secondaryCta: FacilityCta;
  };
};

/* -------------------------------------------------------------------------- */
/*  Content payload                                                           */
/* -------------------------------------------------------------------------- */

export const FACILITIES_CONTENT: FacilitiesContent = {
  metaTitle: "Facilities — Mississauga, Canada and Hyderabad, India | Propharmex",
  metaDescription:
    "Two sites, one quality system. Our Canadian headquarters in Mississauga, Ontario hosts client engagement, regulatory strategy, and project management; our development centre in Hyderabad, Telangana runs formulation, analytical services, and stability work. Visits by appointment.",
  ogTitle: "Mississauga, Canada and Hyderabad, India — Propharmex facilities",
  ogDescription:
    "Canadian headquarters in Mississauga, development centre in Hyderabad. One quality system across both sites.",
  hero: {
    eyebrow: "Facilities",
    headline: "Two sites, one quality system.",
    lede: "Our Canadian headquarters in Mississauga, Ontario is the client-facing site for project management, regulatory strategy, and dossier authoring. Our development centre in Hyderabad, Telangana runs the scientific bench — formulation, method development and validation, stability, and impurity profiling. Work moves between them under one quality manual, with documented chain-of-custody at every handoff.",
    primaryCta: {
      label: "Arrange a site visit",
      href: "/contact?source=facilities-index-visit",
      variant: "primary",
    },
    secondaryCta: {
      label: "Request capability decks",
      href: "/contact?source=facilities-index-decks",
      variant: "outline",
    },
  },
  map: {
    eyebrow: "Where we work",
    heading: "Headquarters and development centre, drawn to scale",
    lede: "Both sites are connected by a unified document stream, harmonised SOPs, and a weekly operations cadence. The arc below is illustrative, not a flight path.",
    hubs: [
      {
        code: "mississauga",
        label: "Mississauga",
        flag: "CA",
        country: "Canada",
        coordinates: { lat: 43.589, lng: -79.6441 },
        role: "Head office · regulatory strategy · client engagement",
      },
      {
        code: "hyderabad",
        label: "Hyderabad",
        flag: "IN",
        country: "India",
        coordinates: { lat: 17.385, lng: 78.4867 },
        role: "Pharmaceutical development · analytical services",
      },
    ],
    caveat:
      "Schematic only, not to scale. Exact site coordinates shared during pre-visit briefing under NDA.",
  },
  comparison: {
    eyebrow: "Compare the sites",
    heading: "What each site carries",
    lede: "A side-by-side view for procurement and quality reviewers. Quality-system documentation is held internally and available on request under NDA.",
    rows: [
      {
        label: "Primary role",
        mississauga: "Head office · regulatory strategy · client engagement · project management.",
        hyderabad: "Pharmaceutical development, analytical services, stability, CMC support.",
      },
      {
        label: "Operating framework",
        mississauga: "Unified QMS aligned to ICH Q10.",
        hyderabad: "Unified QMS aligned to ICH Q10.",
        note: {
          kind: "primary",
          label: "ICH Q10 — Pharmaceutical Quality System",
          href: "https://www.ich.org/page/quality-guidelines",
        },
      },
      {
        label: "Scientific bench",
        mississauga: "Project management, regulatory authoring, client coordination.",
        hyderabad: "Method development, validation, stability, impurity profiling — full panel.",
      },
      {
        label: "Stability and reference storage",
        mississauga: "Reference materials and pre-visit sample handling, scoped for client engagement.",
        hyderabad: "ICH Zone II and Zone IVb stability chambers; reference and sample storage.",
      },
      {
        label: "Typical visit format",
        mississauga: "Half-day; longer when an authoring or submission review is in scope.",
        hyderabad: "Full day; two days for analytical method qualification.",
      },
    ],
  },
  carousel: {
    eyebrow: "Inside the sites",
    heading: "A walking view",
    lede: "Photography is reserved for the next content freeze. Frames below preserve gallery dimensions; captions describe what the eventual image will show.",
    photos: [
      {
        id: "miss-exterior",
        caption: "Mississauga site exterior and main entrance.",
        aspect: "4/3",
        tone: "brand",
      },
      {
        id: "miss-reception",
        caption: "Reception and visitor briefing area.",
        aspect: "4/3",
        tone: "neutral",
      },
      {
        id: "miss-review",
        caption: "Client and regulatory review room.",
        aspect: "4/3",
        tone: "brand",
      },
      {
        id: "hyd-lab",
        caption: "Hyderabad analytical suite — HPLC bench.",
        aspect: "4/3",
        tone: "warm",
      },
      {
        id: "hyd-formulation",
        caption: "Hyderabad formulation development — bench-scale equipment.",
        aspect: "4/3",
        tone: "neutral",
      },
      {
        id: "hyd-stability",
        caption: "Stability chamber bank at the Hyderabad site.",
        aspect: "4/3",
        tone: "warm",
      },
    ],
  },
  closing: {
    eyebrow: "Next step",
    heading: "Bring your project to the rooms it will live in.",
    body: "Site visits are standard before a qualification decision. We scope the agenda to the dossier sections that matter to you — quality, analytical, regulatory authoring — and share the pre-visit briefing pack under NDA.",
    primaryCta: {
      label: "Arrange a site visit",
      href: "/contact?source=facilities-index-closing-visit",
      variant: "primary",
    },
    secondaryCta: {
      label: "Book a 30-minute call",
      href: "/contact?source=facilities-index-closing-call",
      variant: "outline",
    },
  },
};

/* -------------------------------------------------------------------------- */
/*  Mississauga detail                                                        */
/* -------------------------------------------------------------------------- */

export const FACILITY_MISSISSAUGA: FacilityDetail = {
  code: "mississauga",
  slug: "mississauga-canada",
  city: "Mississauga",
  region: "Ontario",
  country: "Canada",
  countryCode: "CA",
  metaTitle: "Mississauga, Canada — Propharmex headquarters",
  metaDescription:
    "Propharmex Mississauga is our Canadian headquarters and client-facing site — regulatory strategy, dossier authoring, project management, and partner visits. Visit logistics, operating-framework alignment, and capability matrix for procurement reviewers.",
  ogTitle: "Mississauga, Canada — Propharmex",
  ogDescription:
    "Canadian headquarters and client-facing site in Mississauga, Ontario.",
  hero: {
    eyebrow: "Propharmex · Mississauga, Ontario · Canadian headquarters",
    headline: "Where the client engagement is run, and the dossier is authored.",
    lede: "Our Mississauga site is our Canadian headquarters. It is where project management, regulatory strategy, dossier authoring, and partner visits happen — the room in which the work plan is built and the regulatory narrative is shaped. The scientific bench that fills out the dossier sits at our development centre in Hyderabad and is governed by the same quality manual.",
    stats: [
      { label: "Primary role", value: "Headquarters and client engagement" },
      { label: "Operating framework", value: "ICH Q10-aligned QMS" },
      { label: "Visit format", value: "Half-day; longer with authoring review" },
    ],
    viewerPlaceholder: {
      caption: "Planned 360° walkthrough — reception, client review room, regulatory authoring suite.",
      note: "Viewer is reserved in the UI and will stream from a Matterport-style capture when recorded.",
    },
    primaryCta: {
      label: "Arrange a Mississauga visit",
      href: "/contact?source=facilities-miss-visit",
      variant: "primary",
    },
    secondaryCta: {
      label: "Request the site briefing pack",
      href: "/contact?source=facilities-miss-briefing",
      variant: "outline",
    },
  },
  capabilities: {
    eyebrow: "Capability matrix",
    heading: "What runs here, and what runs with Hyderabad",
    lede: "Capabilities marked primary are executed and closed out at Mississauga. Secondary capabilities are supported from this site in partnership with Hyderabad under a single QMS.",
    capabilities: [
      {
        id: "regulatory-strategy",
        label: "Regulatory strategy and authoring",
        description:
          "Submission strategy, CMC dossier authoring (eCTD Module 3), pathway scoping, and post-approval lifecycle planning for client programs targeting Health Canada, USFDA, EMA, TGA, and other regulators.",
        tier: "primary",
      },
      {
        id: "client-engagement",
        label: "Client engagement and program management",
        description:
          "Single-point program ownership, milestone tracking, scope governance, and the cross-site cadence that keeps Hyderabad's bench work and Mississauga's authoring on the same drumbeat.",
        tier: "primary",
      },
      {
        id: "qms",
        label: "Quality management system stewardship",
        description:
          "The unified QMS — quality manual, SOP library, change control, deviation handling, CAPA — is owned and stewarded from Mississauga and applied identically across both sites.",
        tier: "primary",
      },
      {
        id: "visits",
        label: "Client and partner visits",
        description:
          "Pre-qualification visits, mid-program reviews, and dossier walk-throughs are hosted from Mississauga. The pre-visit briefing pack is released under NDA on a per-engagement basis.",
        tier: "primary",
      },
      {
        id: "method-dev",
        label: "Method development",
        description:
          "Executed at the Hyderabad development centre with documented authoring and review pathways through Mississauga; unified protocols under one QMS.",
        tier: "secondary",
      },
      {
        id: "formulation",
        label: "Formulation development",
        description:
          "Hyderabad leads; Mississauga participates in tech-transfer reviews and dossier authoring of the formulation rationale.",
        tier: "secondary",
      },
      {
        id: "stability",
        label: "Stability programs",
        description:
          "Chamber bank and analytical pulls run at Hyderabad; Mississauga authors the stability narrative into the dossier.",
        tier: "secondary",
      },
    ],
    legendPrimary: "Primary — executed and closed out here",
    legendSecondary: "Secondary — supported in partnership with Hyderabad",
  },
  equipment: {
    eyebrow: "Equipment and systems",
    heading: "Representative systems on site",
    lede: "Mississauga is the client-facing and authoring site rather than a primary scientific bench; the systems below are the document, data, and review infrastructure that supports regulatory authoring and program management. Validated-instrument detail for the Hyderabad bench is shared under NDA during the pre-visit briefing.",
    representativeNote:
      "Representative list. Cross-site validated-system documentation is available on request.",
    items: [
      {
        id: "edms",
        category: "Document systems",
        label: "Electronic document management",
        detail: "Audit-trailed document control unified with Hyderabad; one master SOP library across both sites.",
      },
      {
        id: "qms-systems",
        category: "Quality systems",
        label: "QMS workflow tools",
        detail: "Change control, deviation handling, and CAPA tracked in a single workflow tool with cross-site visibility.",
      },
      {
        id: "regulatory-tooling",
        category: "Regulatory authoring",
        label: "eCTD authoring environment",
        detail: "Module 3 authoring and lifecycle-management tooling for ANDS, ANDA, NDA, DMF, and ASMF submissions.",
      },
      {
        id: "review-rooms",
        category: "Facility",
        label: "Client and regulatory review rooms",
        detail: "Configured for dossier walk-throughs, pre-submission reviews, and partner-visit working sessions.",
      },
      {
        id: "monitoring",
        category: "Facility",
        label: "Environmental monitoring",
        detail: "Validated probes for the on-site reference- and sample-storage areas with continuous logging.",
      },
    ],
    cta: {
      label: "Request the site systems pack",
      href: "/contact?source=facilities-miss-inventory",
      variant: "outline",
    },
  },
  coldChain: {
    eyebrow: "On-site storage",
    heading: "Reference and sample storage, tightly monitored",
    lede: "Mississauga is not a manufacturing or distribution site. On-site temperature-controlled storage is scoped to reference materials and pre-visit / mid-engagement sample handling. Every zone is continuously monitored on validated probes.",
    zones: [
      {
        id: "ambient",
        label: "Ambient",
        range: "15°C – 25°C",
        uses: "Reference materials and document-control samples for client review.",
        monitoring: "Continuous; excursion alarms routed to on-call quality.",
      },
      {
        id: "cool",
        label: "Refrigerated",
        range: "2°C – 8°C",
        uses: "Pre-visit and mid-engagement temperature-sensitive samples brought on site for client review.",
        monitoring: "Continuous; redundant probes; routine mapping.",
      },
    ],
    reference: {
      kind: "primary",
      label: "ICH Q1A(R2) — Stability Testing of New Drug Substances and Products",
      href: "https://www.ich.org/page/quality-guidelines",
    },
  },
  // warehouseMap intentionally omitted — Mississauga is not a distribution site.
  gallery: {
    eyebrow: "Gallery",
    heading: "Mississauga, in frames",
    lede: "Reserved photography frames for the Mississauga site. Captions describe the eventual image; frames preserve gallery dimensions so the page does not reflow when photography replaces them.",
    photos: [
      {
        id: "miss-reception",
        caption: "Reception and visitor briefing room.",
        aspect: "4/3",
        tone: "brand",
      },
      {
        id: "miss-review",
        caption: "Client and regulatory review room.",
        aspect: "4/3",
        tone: "neutral",
      },
      {
        id: "miss-authoring",
        caption: "Regulatory authoring suite.",
        aspect: "4/3",
        tone: "warm",
      },
      {
        id: "miss-meeting",
        caption: "Cross-site meeting room with Hyderabad bridge.",
        aspect: "4/3",
        tone: "brand",
      },
    ],
  },
  visit: {
    eyebrow: "How to visit",
    heading: "A Mississauga visit, end to end",
    body: "Send your program scope ahead of the visit so we can align the agenda. Regulatory-only reviews centre on the client review room and the authoring suite; cross-site reviews add a working session with Hyderabad over the bridge. Most visits fit a half day; plan a full day if a dossier or scope review is in depth.",
    primaryCta: {
      label: "Arrange a Mississauga visit",
      href: "/contact?source=facilities-miss-visit-cta",
      variant: "primary",
    },
    secondaryCta: {
      label: "Book a 30-minute pre-visit call",
      href: "/contact?source=facilities-miss-previsit-call",
      variant: "outline",
    },
    notice:
      "All visits are under NDA. Photography in client-review areas is not permitted. Reception logs all visits and pairs visitors with the engagement lead on arrival.",
  },
};

/* -------------------------------------------------------------------------- */
/*  Hyderabad detail                                                          */
/* -------------------------------------------------------------------------- */

export const FACILITY_HYDERABAD: FacilityDetail = {
  code: "hyderabad",
  slug: "hyderabad-india",
  city: "Hyderabad",
  region: "Telangana",
  country: "India",
  countryCode: "IN",
  metaTitle: "Hyderabad, India — Propharmex development centre",
  metaDescription:
    "Propharmex Hyderabad runs pharmaceutical development and analytical services — formulation, method development and validation, stability, impurity profiling. Capability matrix, equipment footprint, and visit logistics.",
  ogTitle: "Hyderabad, India — Propharmex",
  ogDescription:
    "Development and analytical operations at our Hyderabad, Telangana site.",
  hero: {
    eyebrow: "Propharmex · Hyderabad, Telangana · Development centre",
    headline: "Where molecules become methods, and methods become dossier sections.",
    lede: "Our Hyderabad site runs the development and analytical bench: formulation screening, method development and validation, stability study conduct, and impurity profiling. Work is authored to travel — every protocol, every report, and every data file is designed to be read at the Mississauga authoring suite and in the regulators' review rooms downstream.",
    stats: [
      { label: "Primary role", value: "Development + analytical services" },
      { label: "Operating framework", value: "ICH Q10-aligned QMS" },
      { label: "Visit format", value: "Full day; longer for method qualification" },
    ],
    viewerPlaceholder: {
      caption: "Planned 360° walkthrough — analytical suite, formulation bench, stability bank.",
      note: "Viewer is reserved in the UI and will stream from a Matterport-style capture when recorded.",
    },
    primaryCta: {
      label: "Arrange a Hyderabad visit",
      href: "/contact?source=facilities-hyd-visit",
      variant: "primary",
    },
    secondaryCta: {
      label: "Request the analytical capability deck",
      href: "/contact?source=facilities-hyd-deck",
      variant: "outline",
    },
  },
  capabilities: {
    eyebrow: "Capability matrix",
    heading: "What runs here, and what runs with Mississauga",
    lede: "Capabilities marked primary are executed and closed out at Hyderabad. Secondary capabilities are supported from this site in partnership with Mississauga under a single QMS — typically for regulatory authoring and client engagement.",
    capabilities: [
      {
        id: "formulation",
        label: "Formulation development",
        description:
          "Preformulation, dosage-form screening, and formulation refinement across solid oral, liquid oral, topical, and early-stage sterile programs.",
        tier: "primary",
      },
      {
        id: "method-dev",
        label: "Analytical method development",
        description:
          "HPLC, LC-MS/MS, dissolution, and impurity method development for assay, related substances, and stability-indicating applications.",
        tier: "primary",
      },
      {
        id: "method-val",
        label: "Method validation",
        description:
          "ICH Q2(R2)-aligned validation protocols, executions, and reports authored for downstream regulatory submission.",
        tier: "primary",
      },
      {
        id: "stability",
        label: "Stability studies",
        description:
          "ICH Q1A(R2) Zone II and Zone IVb protocols, with pull and report cycles aligned to program milestones.",
        tier: "primary",
      },
      {
        id: "impurities",
        label: "Impurity profiling",
        description:
          "Identification, quantitation, and qualification support for related substances, elemental impurities (ICH Q3D), and nitrosamine risk assessments.",
        tier: "primary",
      },
      {
        id: "regulatory-authoring",
        label: "Regulatory authoring",
        description:
          "Mississauga leads dossier authoring and submission; Hyderabad authors the development and analytical narrative that feeds Module 3 sections.",
        tier: "secondary",
      },
      {
        id: "client-engagement",
        label: "Client engagement",
        description:
          "Mississauga leads program management and client-facing engagement; Hyderabad participates in scientific working sessions over the cross-site bridge.",
        tier: "secondary",
      },
    ],
    legendPrimary: "Primary — executed and closed out here",
    legendSecondary: "Secondary — supported in partnership with Mississauga",
  },
  equipment: {
    eyebrow: "Equipment and systems",
    heading: "Representative equipment on site",
    lede: "The items below are representative of the Hyderabad site's analytical and development footprint. A full validated inventory — with qualification status for each instrument — is shared under NDA during the pre-visit briefing.",
    representativeNote:
      "Representative list. The current validated inventory is available on request.",
    items: [
      {
        id: "hplc",
        category: "Analytical",
        label: "HPLC systems",
        detail: "Multiple benches; UV, DAD, and RI detectors for assay and impurity work.",
      },
      {
        id: "lcms",
        category: "Analytical",
        label: "LC-MS / MS",
        detail: "Triple-quadrupole configuration for bioanalytical and trace impurity work.",
      },
      {
        id: "dissolution",
        category: "Analytical",
        label: "Dissolution apparatus",
        detail: "USP Apparatus 1 and 2 with multi-vessel baths and media-prep station.",
      },
      {
        id: "stability",
        category: "Stability",
        label: "Stability chambers",
        detail: "ICH Zone II and Zone IVb conditions with continuous monitoring.",
      },
      {
        id: "formulation",
        category: "Formulation",
        label: "Formulation bench",
        detail: "Granulation, compression, coating, and blending equipment at development scale.",
      },
      {
        id: "qms",
        category: "Systems",
        label: "Electronic document and data system",
        detail: "Unified with Mississauga; audit-trailed records under one QMS.",
      },
    ],
    cta: {
      label: "Request the validated inventory",
      href: "/contact?source=facilities-hyd-inventory",
      variant: "outline",
    },
  },
  coldChain: {
    eyebrow: "Cold-chain specification",
    heading: "Development-scale cold-chain, tightly monitored",
    lede: "Hyderabad is the scientific bench, not a distribution site; cold-chain storage is sized for development and stability programs. Every zone is continuously monitored and mapped on a routine requalification cadence.",
    zones: [
      {
        id: "ambient",
        label: "Ambient",
        range: "15°C – 25°C",
        uses: "Development and analytical reference storage.",
        monitoring: "Continuous; excursion alarms routed to quality operations.",
      },
      {
        id: "cool",
        label: "Refrigerated",
        range: "2°C – 8°C",
        uses: "Stability samples and biological reference standards where in scope.",
        monitoring: "Continuous; redundant probes; routine mapping.",
      },
      {
        id: "stab-zone-ii",
        label: "ICH Zone II stability",
        range: "25°C / 60% RH",
        uses: "Long-term stability under ICH Q1A(R2) Zone II conditions.",
        monitoring: "Continuous environmental monitoring with validated probes.",
      },
      {
        id: "stab-zone-ivb",
        label: "ICH Zone IVb stability",
        range: "30°C / 75% RH",
        uses: "Long-term stability for hot and humid climates (India, South Asia, South-East Asia).",
        monitoring: "Continuous environmental monitoring with validated probes.",
      },
    ],
    reference: {
      kind: "primary",
      label: "ICH Q1A(R2) — Stability Testing of New Drug Substances and Products",
      href: "https://www.ich.org/page/quality-guidelines",
    },
  },
  gallery: {
    eyebrow: "Gallery",
    heading: "Hyderabad, in frames",
    lede: "Reserved photography frames for the Hyderabad site. Captions describe the eventual image; frames preserve gallery dimensions so the page does not reflow when photography replaces them.",
    photos: [
      {
        id: "hyd-reception",
        caption: "Reception and visitor briefing room.",
        aspect: "4/3",
        tone: "brand",
      },
      {
        id: "hyd-analytical",
        caption: "Analytical suite — HPLC and LC-MS/MS benches.",
        aspect: "4/3",
        tone: "warm",
      },
      {
        id: "hyd-formulation",
        caption: "Formulation development bench.",
        aspect: "4/3",
        tone: "neutral",
      },
      {
        id: "hyd-stability",
        caption: "Stability chamber bank with monitoring wall.",
        aspect: "4/3",
        tone: "brand",
      },
    ],
  },
  visit: {
    eyebrow: "How to visit",
    heading: "A Hyderabad visit, end to end",
    body: "Send your program scope ahead of the visit so we can align the agenda: method development reviews centre on the analytical suite and method-validation files; formulation reviews add the development bench; stability reviews add the chamber bank and monitoring records. Most visits run a full day; plan two days if a method-qualification audit is in scope.",
    primaryCta: {
      label: "Arrange a Hyderabad visit",
      href: "/contact?source=facilities-hyd-visit-cta",
      variant: "primary",
    },
    secondaryCta: {
      label: "Book a 30-minute pre-visit call",
      href: "/contact?source=facilities-hyd-previsit-call",
      variant: "outline",
    },
    notice:
      "All visits are under NDA. Photography on the operating floor is not permitted. Personal protective equipment is provided at reception.",
  },
};

export const FACILITY_DETAILS: Record<FacilityCode, FacilityDetail> = {
  mississauga: FACILITY_MISSISSAUGA,
  hyderabad: FACILITY_HYDERABAD,
};

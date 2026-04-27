/**
 * Content dictionary for /facilities + /facilities/mississauga-canada +
 * /facilities/hyderabad-india (Prompt 9).
 *
 * This is the interim shape; Prompt 4 will migrate it to Sanity `facility`
 * documents. The type surface is intentionally close to a Sanity schema so the
 * migration is a near-1:1 port.
 *
 * Safe-defaults posture (per CLAUDE.md §10 quickest-path agreement on Prompt 8):
 *  - No street addresses until client confirms (city-level only).
 *  - No real photography yet — `PhotoStub` reserves the frame shape with a
 *    labelled gradient and caption. When photos arrive, swap the component
 *    internals to `next/image` with a real blurDataURL.
 *  - Equipment list is indicative only; the full inventory lands in Prompt 11.
 *  - Warehouse map is a schematic zone diagram, labelled as such. No floor plan.
 *  - All claim-bearing UI respects the three-tier claim-status convention
 *    documented in `docs/regulatory-lexicon.md` and introduced by Prompt 8.
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
 * Primary-source link for any externally verifiable claim (e.g. Health Canada
 * register). When `kind` is "internal", the label is rendered as muted copy
 * with no outbound link — the document is held internally and available on
 * request.
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
  /** 360-viewer slot is a reserved placeholder per Prompt 9 spec. */
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
  metaTitle: "Facilities — Mississauga and Hyderabad | Propharmex",
  metaDescription:
    "A Canadian DEL site and an Indian development centre, one lineage of practice. Mississauga holds our Health Canada Drug Establishment Licence and 3PL operations; our Hyderabad development centre runs formulation and analytical services. Visits by appointment.",
  ogTitle: "Mississauga and Hyderabad — Propharmex facilities",
  ogDescription:
    "Health Canada DEL site in Mississauga; Indian development centre in Hyderabad. One quality system, in rooms you can walk.",
  hero: {
    eyebrow: "Facilities",
    headline: "Anchored in Mississauga. Supported by our development bench.",
    lede: "Our Mississauga site carries the Health Canada Drug Establishment Licence and operates our third-party logistics footprint. Our Indian development centre in Hyderabad runs formulation and analytical services under the same QMS. Work moves between them under a single quality system, with documented tech-transfer and chain-of-custody at every handoff.",
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
    heading: "DEL site and development centre, drawn to scale",
    lede: "Both sites are connected by a unified document stream, harmonised SOPs, and a weekly operations cadence. The arc below is illustrative, not a flight path.",
    hubs: [
      {
        code: "mississauga",
        label: "Mississauga",
        flag: "CA",
        country: "Canada",
        coordinates: { lat: 43.5890, lng: -79.6441 },
        role: "Health Canada DEL · 3PL · regulatory affairs",
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
    eyebrow: "Compare the hubs",
    heading: "What each site carries",
    lede: "A side-by-side view for procurement and quality reviewers. Where a claim is externally verifiable, a primary-source link is shown; where documentation is held internally, it is available on request.",
    rows: [
      {
        label: "Primary role",
        mississauga: "Regulatory affairs, Drug Establishment Licence operations, 3PL distribution.",
        hyderabad: "Pharmaceutical development, analytical services, CMC support.",
      },
      {
        label: "Regulatory anchor",
        mississauga: "Health Canada Drug Establishment Licence (held).",
        hyderabad: "Operates under WHO-GMP alignment; client-specific audits on request.",
        note: {
          kind: "primary",
          label: "Health Canada — Drug Product Database",
          href: "https://health-products.canada.ca/dpd-bdpp/",
        },
      },
      {
        label: "Quality system",
        mississauga: "Unified QMS with Hyderabad; ICH Q10 aligned.",
        hyderabad: "Unified QMS with Mississauga; ICH Q10 aligned.",
      },
      {
        label: "Cold-chain storage",
        mississauga: "Ambient, 2–8°C, −20°C, controlled-substance vault.",
        hyderabad: "Ambient, 2–8°C (development scale); not a primary distribution site.",
      },
      {
        label: "Instrument reach",
        mississauga: "Method transfer, release and stability testing.",
        hyderabad: "Method development, validation, stability, impurity profiling — full panel.",
      },
      {
        label: "Typical visit length",
        mississauga: "Half-day; longer for 3PL qualification audits.",
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
        caption: "Mississauga site exterior and loading-bay elevation.",
        aspect: "4/3",
        tone: "brand",
      },
      {
        id: "miss-3pl-floor",
        caption: "3PL ambient-storage floor, aisle view.",
        aspect: "4/3",
        tone: "neutral",
      },
      {
        id: "miss-coldchain",
        caption: "2–8°C cold room with monitoring panel.",
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
    body: "Site visits are standard before a qualification decision. We scope the agenda to the dossier sections that matter to you — quality, analytical, or 3PL — and share the pre-visit briefing pack under NDA.",
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
  metaTitle: "Mississauga, Canada — Propharmex facility",
  metaDescription:
    "Propharmex Mississauga carries the Health Canada Drug Establishment Licence and runs our 3PL footprint for Canadian distribution. Visit logistics, capability matrix, and cold-chain specification for procurement reviewers.",
  ogTitle: "Mississauga, Canada — Propharmex",
  ogDescription:
    "Health Canada DEL site and 3PL hub in Mississauga, Ontario.",
  hero: {
    eyebrow: "Propharmex · Mississauga, Ontario · Head office and DEL site",
    headline: "The Canadian regulatory anchor, and the warehouse behind it.",
    lede: "Our Mississauga site holds the Health Canada Drug Establishment Licence. The same site operates our third-party logistics footprint, the controlled-substance vault, and the release-and-stability bench that supports Canadian and US submissions. Regulatory and distribution share a roof by design — the record of a product's journey never leaves a single quality system.",
    stats: [
      { label: "Regulatory anchor", value: "Health Canada DEL" },
      { label: "Primary role", value: "Regulatory, 3PL, release testing" },
      { label: "Visit format", value: "Half-day, longer for qualification" },
    ],
    viewerPlaceholder: {
      caption: "Planned 360° walkthrough — reception, QA review room, 3PL floor.",
      note: "Viewer is reserved in the Prompt 9 UI and will stream from a Matterport-style capture when recorded.",
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
    lede: "Capabilities marked primary are executed and closed out at Mississauga. Secondary capabilities are supported from this hub in partnership with Hyderabad under a single QMS — typically for tech-transfer or method-transfer projects.",
    capabilities: [
      {
        id: "del",
        label: "Drug Establishment Licence operations",
        description:
          "Fabrication, packaging/labelling, testing, importation, distribution and wholesaling authorizations per the DEL, as applicable to each project.",
        tier: "primary",
      },
      {
        id: "threepl",
        label: "3PL distribution",
        description:
          "Canadian-market storage and distribution, lot-level traceability, customer-level pick/pack, returns and recall support.",
        tier: "primary",
      },
      {
        id: "release",
        label: "Release and stability testing",
        description:
          "Batch release testing for Canadian distribution and supporting stability pulls under ICH Q1A(R2) protocols.",
        tier: "primary",
      },
      {
        id: "regulatory",
        label: "Regulatory affairs",
        description:
          "Health Canada submissions, post-NOC lifecycle management, and DMF/ANDA coordination with USFDA when the programme spans both markets.",
        tier: "primary",
      },
      {
        id: "cold-chain",
        label: "Cold-chain handling",
        description:
          "Validated 2–8°C and −20°C zones, plus a controlled-substance vault for Schedule II–V handling.",
        tier: "primary",
      },
      {
        id: "method-dev",
        label: "Method development",
        description:
          "Executed at the development centre with documented transfer into Mississauga for release use; unified protocols under one QMS.",
        tier: "secondary",
      },
      {
        id: "formulation",
        label: "Formulation development",
        description:
          "Hyderabad leads; Mississauga participates in tech-transfer and scale-up reviews for Canada-bound programmes.",
        tier: "secondary",
      },
    ],
    legendPrimary: "Primary — executed and closed out here",
    legendSecondary: "Secondary — supported in partnership with Hyderabad",
  },
  equipment: {
    eyebrow: "Equipment and systems",
    heading: "Representative equipment on site",
    lede: "The items below are representative of the Mississauga site's instrument and systems footprint. A full, validated inventory — with calibration and qualification dates — is shared under NDA during the pre-visit briefing.",
    representativeNote:
      "Representative list. The current validated inventory is available on request.",
    items: [
      {
        id: "hplc",
        category: "Analytical",
        label: "HPLC systems",
        detail: "Reversed-phase and normal-phase configurations; UV + DAD detectors.",
      },
      {
        id: "dissolution",
        category: "Analytical",
        label: "Dissolution apparatus",
        detail: "USP Apparatus 1 and 2; multi-vessel bath with auto-sampling.",
      },
      {
        id: "stability",
        category: "Stability",
        label: "Stability chambers",
        detail: "ICH zone II and IV conditions with continuous monitoring.",
      },
      {
        id: "wms",
        category: "3PL systems",
        label: "Warehouse management system",
        detail: "Lot-level tracking, FEFO picking, controlled-substance workflows.",
      },
      {
        id: "monitoring",
        category: "Facility",
        label: "Environmental monitoring",
        detail: "Continuous temperature and humidity mapping on validated probes.",
      },
      {
        id: "cs-vault",
        category: "Security",
        label: "Controlled-substance vault",
        detail: "Constructed and operated to Health Canada Office of Controlled Substances expectations.",
      },
    ],
    cta: {
      label: "Request the validated inventory",
      href: "/contact?source=facilities-miss-inventory",
      variant: "outline",
    },
  },
  coldChain: {
    eyebrow: "Cold-chain specification",
    heading: "Four temperature zones, one continuous record",
    lede: "Every zone is continuously monitored, alarmed, and mapped on a routine requalification cadence. Storage scope for a specific programme is confirmed during qualification and recorded in the service agreement.",
    zones: [
      {
        id: "ambient",
        label: "Ambient",
        range: "15°C – 25°C",
        uses: "General pharmaceutical storage for Canadian distribution.",
        monitoring: "Continuous; excursion alarms routed to on-call operations.",
      },
      {
        id: "cool",
        label: "Refrigerated",
        range: "2°C – 8°C",
        uses: "Biologics, vaccines where programme applicable, stability samples.",
        monitoring: "Continuous; redundant probes; routine mapping.",
      },
      {
        id: "frozen",
        label: "Frozen",
        range: "−20°C nominal",
        uses: "Long-term stability samples and temperature-sensitive APIs.",
        monitoring: "Continuous; back-up power and escalation path in place.",
      },
      {
        id: "vault",
        label: "Controlled-substance vault",
        range: "Ambient, secured",
        uses: "Schedule II–V handling under the Controlled Drugs and Substances Act.",
        monitoring: "Access logged; inventory reconciled per regulatory cadence.",
      },
    ],
    reference: {
      kind: "primary",
      label: "Health Canada — GUI-0001 Good Manufacturing Practices",
      href: "https://www.canada.ca/en/health-canada/services/drugs-health-products/compliance-enforcement/good-manufacturing-practices/guidance-documents/gmp-guidelines-0001.html",
    },
  },
  warehouseMap: {
    eyebrow: "3PL layout",
    heading: "Six zones, one lot history",
    lede: "A schematic of the Mississauga warehouse. Zones are laid out so that inbound, storage, and outbound never cross paths — lot identity is preserved from receiving to dispatch.",
    schematicNote:
      "Schematic — for illustration. The actual floor plan is shared in the pre-visit briefing pack under NDA.",
    zones: [
      {
        id: "receiving",
        label: "Receiving",
        subLabel: "Inbound dock · quarantine",
        tone: "neutral",
        grid: { col: 1, row: 1 },
      },
      {
        id: "ambient",
        label: "Ambient storage",
        subLabel: "15°C – 25°C",
        tone: "warm",
        grid: { col: 2, row: 1 },
      },
      {
        id: "cool",
        label: "2–8°C",
        subLabel: "Refrigerated",
        tone: "cool",
        grid: { col: 3, row: 1 },
      },
      {
        id: "frozen",
        label: "−20°C",
        subLabel: "Frozen stability and APIs",
        tone: "cold",
        grid: { col: 1, row: 2 },
      },
      {
        id: "cs-vault",
        label: "Controlled substances",
        subLabel: "Schedule II–V vault",
        tone: "secure",
        grid: { col: 2, row: 2 },
      },
      {
        id: "dispatch",
        label: "Dispatch",
        subLabel: "Outbound dock · staging",
        tone: "neutral",
        grid: { col: 3, row: 2 },
      },
    ],
    legend: [
      { tone: "neutral", label: "Flow — inbound/outbound and staging" },
      { tone: "warm", label: "Ambient — 15–25°C" },
      { tone: "cool", label: "Cool — 2–8°C" },
      { tone: "cold", label: "Frozen — −20°C" },
      { tone: "secure", label: "Secure — controlled substances" },
    ],
  },
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
        id: "miss-qa",
        caption: "QA review area with document wall.",
        aspect: "4/3",
        tone: "neutral",
      },
      {
        id: "miss-3pl",
        caption: "3PL ambient floor, aisle view.",
        aspect: "4/3",
        tone: "warm",
      },
      {
        id: "miss-cold",
        caption: "2–8°C cold-room monitoring panel.",
        aspect: "4/3",
        tone: "brand",
      },
    ],
  },
  visit: {
    eyebrow: "How to visit",
    heading: "A Mississauga visit, end to end",
    body: "Send your programme scope ahead of the visit so we can align the agenda: regulatory-only reviews centre on the QA review area and DEL documentation; 3PL qualification adds a warehouse walk; release-testing audits add the analytical bench. Most visits fit a half day; plan a full day if a qualification audit is in scope.",
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
      "All visits are under NDA. Photography on the operating floor is not permitted. Personal protective equipment is provided at reception.",
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
  metaTitle: "Hyderabad, India — Propharmex facility",
  metaDescription:
    "Propharmex Hyderabad runs pharmaceutical development and analytical services — formulation, method development and validation, stability, impurity profiling. Capability matrix, equipment footprint, and visit logistics.",
  ogTitle: "Hyderabad, India — Propharmex",
  ogDescription:
    "Development and analytical operations at our Hyderabad, Telangana hub.",
  hero: {
    eyebrow: "Propharmex · Hyderabad, Telangana · Indian development centre",
    headline: "Where molecules become methods, and methods become dossiers.",
    lede: "Our Indian development centre runs the development and analytical bench: formulation screening, method development and validation, stability study conduct, and impurity profiling. Work is authored to travel — every protocol, every report, and every data file is designed to be read at the DEL site, in Ottawa, and in the regulators' review rooms downstream.",
    stats: [
      { label: "Primary role", value: "Development + analytical services" },
      { label: "Quality alignment", value: "ICH Q10 · WHO-GMP principles" },
      { label: "Visit format", value: "Full day; longer for method qualification" },
    ],
    viewerPlaceholder: {
      caption: "Planned 360° walkthrough — analytical suite, formulation bench, stability bank.",
      note: "Viewer is reserved in the Prompt 9 UI and will stream from a Matterport-style capture when recorded.",
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
    lede: "Capabilities marked primary are executed and closed out at Hyderabad. Secondary capabilities are supported from this hub in partnership with Mississauga under a single QMS — typically for regulatory handoff or Canadian-market release.",
    capabilities: [
      {
        id: "formulation",
        label: "Formulation development",
        description:
          "Preformulation, dosage-form screening, and formulation refinement across solid oral, liquid oral, topical and early-stage sterile programmes.",
        tier: "primary",
      },
      {
        id: "method-dev",
        label: "Analytical method development",
        description:
          "HPLC, LC-MS/MS, dissolution, and impurity method development for assay, related substances and stability-indicating applications.",
        tier: "primary",
      },
      {
        id: "method-val",
        label: "Method validation",
        description:
          "ICH Q2(R2)-compliant validation protocols, executions, and reports authored for regulatory submission.",
        tier: "primary",
      },
      {
        id: "stability",
        label: "Stability studies",
        description:
          "ICH Q1A(R2) zone II and IVb protocols, with pull and report cycles aligned to programme milestones.",
        tier: "primary",
      },
      {
        id: "impurities",
        label: "Impurity profiling",
        description:
          "Identification, quantitation and qualification support for related substances, elemental impurities (ICH Q3D), and nitrosamine risk assessments.",
        tier: "primary",
      },
      {
        id: "release",
        label: "Release testing (Canadian market)",
        description:
          "Executed at Mississauga under the DEL; Hyderabad authors and transfers the methods used.",
        tier: "secondary",
      },
      {
        id: "threepl",
        label: "3PL distribution",
        description:
          "Mississauga leads Canadian distribution; Hyderabad is not a primary distribution site.",
        tier: "secondary",
      },
    ],
    legendPrimary: "Primary — executed and closed out here",
    legendSecondary: "Secondary — supported in partnership with Mississauga",
  },
  equipment: {
    eyebrow: "Equipment and systems",
    heading: "Representative equipment on site",
    lede: "The items below are representative of the Hyderabad site's analytical and development footprint. A full, validated inventory — with qualification status for each instrument — is shared under NDA during the pre-visit briefing.",
    representativeNote:
      "Representative list. The current validated inventory is available on request.",
    items: [
      {
        id: "hplc",
        category: "Analytical",
        label: "HPLC systems",
        detail: "Multiple benches; UV, DAD and RI detectors for assay and impurity work.",
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
        detail: "USP Apparatus 1 and 2 with multi-vessel baths and media prep station.",
      },
      {
        id: "stability",
        category: "Stability",
        label: "Stability chambers",
        detail: "ICH zone II and zone IVb conditions with continuous monitoring.",
      },
      {
        id: "formulation",
        category: "Formulation",
        label: "Formulation bench",
        detail: "Granulation, compression, coating and blending equipment at development scale.",
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
    lede: "Hyderabad is not a primary distribution site; cold-chain storage is sized for development and stability programmes. Every zone is continuously monitored and mapped on a routine requalification cadence.",
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
        uses: "Stability samples, biological reference standards where in scope.",
        monitoring: "Continuous; redundant probes; routine mapping.",
      },
      {
        id: "stab-zone-ii",
        label: "ICH zone II stability",
        range: "25°C / 60% RH",
        uses: "Long-term stability under ICH Q1A(R2) zone II conditions.",
        monitoring: "Continuous environmental monitoring with validated probes.",
      },
      {
        id: "stab-zone-ivb",
        label: "ICH zone IVb stability",
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
    body: "Send your programme scope ahead of the visit so we can align the agenda: method development reviews centre on the analytical suite and method-validation files; formulation reviews add the development bench; stability reviews add the chamber bank and monitoring records. Most visits run a full day; plan two days if a method-qualification audit is in scope.",
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

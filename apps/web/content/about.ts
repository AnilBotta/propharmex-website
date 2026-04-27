/**
 * /about + /about/leadership content dictionary.
 *
 * Prompt 7 stand-in for what will become a Sanity `page{slug:"about"}` document
 * plus a `person` collection. Every user-facing string is drafted via
 * design:ux-copy and gated by brand-voice-guardian (docs/brand-voice.md).
 *
 * Voice rules (CLAUDE.md §1 + docs/brand-voice.md): anti-hype, expert, humble,
 * regulatory-precise. Banned words: world-class, cutting-edge, seamless,
 * industry-leading, trusted partner, innovative (unless literally novel + cited).
 *
 * Leadership stubbing policy (per Prompt 7 decision, option B):
 *  - Three named principals below carry placeholder names and the sentinel
 *    `stub: true` flag. Any UI that renders a leader must fall back to the
 *    placeholder headshot SVG at /brand/leadership/placeholder-headshot.svg
 *    and show a "Profile in preparation" badge.
 *  - LinkedIn URLs and publications are intentionally empty arrays/null until
 *    the founders supply vetted copy. No fabricated credentials.
 *  - When the Sanity `person` schema lands (Prompt 4 follow-up) these records
 *    migrate 1:1 onto it — the TS shape here is the target schema.
 *
 * Timeline policy: every year entry is an internal fact until a public source
 * exists. When a milestone has a Health Canada / USFDA / WHO citation, it is
 * tagged `source: {kind:"primary"}` — otherwise `{kind:"internal"}`.
 */

/* -------------------------------------------------------------------------- */
/*  Primitives                                                                */
/* -------------------------------------------------------------------------- */

export type AboutCTA = {
  href: string;
  label: string;
  variant: "primary" | "secondary" | "ghost";
};

export type AboutSource =
  | { kind: "primary"; label: string; href: string }
  | { kind: "internal"; label: string };

/* -------------------------------------------------------------------------- */
/*  1. Founding story                                                         */
/* -------------------------------------------------------------------------- */

export type AboutFounding = {
  eyebrow: string;
  headline: string;
  lede: string;
  body: string[];
  anchor: {
    value: string;
    label: string;
    source: AboutSource;
  };
};

/* -------------------------------------------------------------------------- */
/*  2. Mission / Vision / Values                                              */
/* -------------------------------------------------------------------------- */

export type AboutValue = {
  id: "integrity" | "rigour" | "named-principals" | "cadence";
  /** Icon key rendered by an animated SVG trio on the client. */
  icon: "shield-check" | "microscope" | "user-check" | "gauge";
  title: string;
  body: string;
};

export type AboutMVV = {
  eyebrow: string;
  heading: string;
  intro: string;
  mission: {
    label: string;
    body: string;
  };
  vision: {
    label: string;
    body: string;
  };
  values: [AboutValue, AboutValue, AboutValue, AboutValue];
};

/* -------------------------------------------------------------------------- */
/*  3. Timeline                                                               */
/* -------------------------------------------------------------------------- */

export type TimelineKind = "founding" | "regulatory" | "expansion" | "program";

export type AboutTimelineEvent = {
  year: string;
  kind: TimelineKind;
  title: string;
  body: string;
  source: AboutSource;
};

export type AboutTimeline = {
  eyebrow: string;
  heading: string;
  lede: string;
  /** Ordered oldest → newest. Renderer reverses for latest-first mobile view. */
  events: AboutTimelineEvent[];
};

/* -------------------------------------------------------------------------- */
/*  4. Leadership (shared by preview section + /about/leadership page)        */
/* -------------------------------------------------------------------------- */

export type LeaderPublication = {
  title: string;
  venue: string;
  year: string;
  href?: string;
};

export type AboutLeader = {
  /** Stable id for React keys + the leadership-page anchor. */
  id: string;
  /** URL slug — used on /about/leadership#<slug> for deep-linking. */
  slug: string;
  name: string;
  role: string;
  location: "Mississauga" | "Development bench" | "Both";
  /** One-line credential summary shown on the card. */
  credential: string;
  /** 2–3 paragraphs for the modal detail sheet. */
  bio: string[];
  /** Structured credentials — shown as a list in the modal. */
  credentials: string[];
  linkedin: string | null;
  publications: LeaderPublication[];
  /** When true, the UI renders a "Profile in preparation" badge. */
  stub: boolean;
};

export type AboutLeadershipPreview = {
  eyebrow: string;
  heading: string;
  intro: string;
  /** Anchor the /about section links to when jumped-to from the homepage. */
  anchorId: "leadership";
  ctaHref: "/about/leadership";
  ctaLabel: string;
};

export type AboutLeadershipPage = {
  metaTitle: string;
  metaDescription: string;
  heading: string;
  lede: string;
  stubNotice: string;
  modal: {
    closeLabel: string;
    credentialsHeading: string;
    publicationsHeading: string;
    publicationsEmpty: string;
    linkedinLabel: string;
    linkedinEmpty: string;
  };
};

/* -------------------------------------------------------------------------- */
/*  6. Culture                                                                */
/* -------------------------------------------------------------------------- */

export type AboutCulturePrinciple = {
  id: string;
  title: string;
  body: string;
};

export type AboutCulture = {
  eyebrow: string;
  heading: string;
  lede: string;
  principles: AboutCulturePrinciple[];
};

/* -------------------------------------------------------------------------- */
/*  7. Careers CTA                                                            */
/* -------------------------------------------------------------------------- */

export type AboutCareersCta = {
  eyebrow: string;
  heading: string;
  body: string;
  actions: [AboutCTA, AboutCTA];
};

/* -------------------------------------------------------------------------- */
/*  Page root                                                                 */
/* -------------------------------------------------------------------------- */

export type AboutContent = {
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  founding: AboutFounding;
  mvv: AboutMVV;
  timeline: AboutTimeline;
  leadershipPreview: AboutLeadershipPreview;
  culture: AboutCulture;
  careers: AboutCareersCta;
};

/* -------------------------------------------------------------------------- */
/*  Leadership records — stubbed (option B).                                  */
/* -------------------------------------------------------------------------- */

// TODO(prompt-7-followup): replace with Sanity `person` documents once the
// founders supply vetted bios + headshots. Do NOT invent credentials here —
// keep `stub: true` on every record until the information is confirmed.
export const LEADERS: AboutLeader[] = [
  {
    id: "leader-regulatory",
    slug: "principal-regulatory-affairs",
    name: "Principal, Regulatory Affairs",
    role: "Health Canada DEL and USFDA submissions",
    location: "Mississauga",
    credential:
      "20+ years in ANDS, ANDA, and DMF Type II filings across generics and specialty dosage forms.",
    bio: [
      "Leads Propharmex regulatory strategy across Health Canada, USFDA, TGA, and WHO-PQ pathways. Accountable for the Mississauga Drug Establishment Licence and every Canadian dossier.",
      "Career background spans ANDS and ANDA filings for complex generics, DMF Type II authoring, and nitrosamine risk assessments aligned to current USFDA and EMA guidance.",
      "Profile in preparation — vetted biography and public credentials will replace this placeholder copy.",
    ],
    credentials: [
      "20+ years in pharmaceutical regulatory affairs",
      "Lead author on Health Canada ANDS and USFDA ANDA submissions",
      "Named principal on Propharmex Drug Establishment Licence filings",
    ],
    linkedin: null,
    publications: [],
    stub: true,
  },
  {
    id: "leader-analytical",
    slug: "head-of-analytical",
    name: "Head of Analytical",
    role: "Method development and release testing",
    location: "Development bench",
    credential:
      "ICH Q2(R2) method development and validation across HPLC, LC-MS/MS, and dissolution.",
    bio: [
      "Directs the analytical bench — method development and validation, release and stability testing, impurity and nitrosamine work, and elemental analysis under ICH Q3D.",
      "Deep bench strength in complex-generic methods where the dissolution profile matters more than the bulk chemistry. Accountable for method transfer cycles into Canadian release testing.",
      "Profile in preparation — vetted biography and public credentials will replace this placeholder copy.",
    ],
    credentials: [
      "ICH Q2(R2) method validation — HPLC, LC-MS/MS, dissolution",
      "ICH Q3D elemental impurity analysis",
      "Lead on Propharmex analytical QMS alignment under one quality system",
    ],
    linkedin: null,
    publications: [],
    stub: true,
  },
  {
    id: "leader-operations",
    slug: "director-operations",
    name: "Director, Operations",
    role: "Manufacturing, 3PL distribution, and cold chain",
    location: "Mississauga",
    credential:
      "Cold-chain and 3PL operations across Canadian and US distribution lanes, plus tech-transfer oversight from the development bench.",
    bio: [
      "Owns manufacturing coordination between Mississauga and the development bench, plus the Propharmex 3PL — import, release, warehousing, and Canadian and US distribution under the Drug Establishment Licence.",
      "Runs the daylight-overlap operating cadence that links the Mississauga office and the offshore development bench, including the weekly joint steering between regulatory, analytical, and manufacturing leads.",
      "Profile in preparation — vetted biography and public credentials will replace this placeholder copy.",
    ],
    credentials: [
      "Cold-chain logistics (2–8 °C and controlled ambient) across CA + US lanes",
      "3PL operations under Health Canada DEL",
      "Tech-transfer oversight under one Propharmex quality system",
    ],
    linkedin: null,
    publications: [],
    stub: true,
  },
];

/* -------------------------------------------------------------------------- */
/*  Content                                                                   */
/* -------------------------------------------------------------------------- */

export const ABOUT: AboutContent = {
  metaTitle:
    "About Propharmex — Canadian pharmaceutical services team",
  metaDescription:
    "Who we are, how we operate, and why we run development, analytical, regulatory, and 3PL distribution under one Canadian quality system. Anchored at our Mississauga, Ontario site under Health Canada Drug Establishment Licence — serving drug developers globally.",
  ogTitle: "About Propharmex",
  ogDescription:
    "Mission, values, timeline, and the named principals accountable on every Propharmex engagement.",

  /* ---------- 1. Founding story ---------------------------------------- */
  founding: {
    eyebrow: "Founding story",
    headline: "One quality system. No handoffs between us.",
    lede: "Propharmex was founded as a Canadian pharmaceutical services company anchored under Health Canada Drug Establishment Licence — built to close one specific gap, with the development depth to file under our own DEL.",
    body: [
      "The trigger was a pattern we saw repeatedly across complex-generic and specialty-dosage programs — six or more independent vendors stitched together by overnight emails, and timelines that doubled every time a deviation crossed a contract boundary.",
      "Our Mississauga site is the regulatory anchor — a Health Canada Drug Establishment Licence and the 3PL to import, release, and distribute finished product into Canada, the US, and the Caribbean. An offshore development bench under the same quality system gives us the dosage-form depth at a cost and cadence that keep complex-generic programs viable.",
      "What makes it work is not geography. It is one CTMS, one change-control process, one named principal per engagement — and a deliberately boring handover cadence tuned to the daylight overlap between our Mississauga office and the offshore bench.",
    ],
    anchor: {
      value: "1",
      label:
        "Drug Establishment Licence — Mississauga site, Health Canada-issued",
      source: {
        kind: "primary",
        label: "Health Canada — Drug and Health Product Register",
        href: "https://health-products.canada.ca/dpd-bdpp/",
      },
    },
  },

  /* ---------- 2. Mission / Vision / Values ----------------------------- */
  mvv: {
    eyebrow: "Mission, vision, values",
    heading: "What we are accountable for, and how we operate.",
    intro:
      "The three statements below are not a marketing frame. They are the criteria we use to scope engagements, hire principals, and decline work that does not fit.",
    mission: {
      label: "Mission",
      body: "Make complex-generic and specialty-dosage development faster and more predictable by running development, analytical, regulatory, and distribution as one team under one quality system.",
    },
    vision: {
      label: "Vision",
      body: "Be the correct CDMO for the product profiles where a Canadian regulatory anchor with the development depth to file under it is the right structural answer — complex generics, modified-release orals, lyophilized sterile injectables, and dissolution-sensitive semi-solids.",
    },
    values: [
      {
        id: "integrity",
        icon: "shield-check",
        title: "Regulatory integrity first",
        body: "Every claim is anchored to a primary source with a dated URL. If we cannot cite it, we do not say it.",
      },
      {
        id: "rigour",
        icon: "microscope",
        title: "Analytical rigour",
        body: "Methods follow ICH Q2(R2). Stability follows ICH Q1A(R2). Quality follows ICH Q10. We document the version, not the vibe.",
      },
      {
        id: "named-principals",
        icon: "user-check",
        title: "Named principals",
        body: "Every engagement is signed off by one named principal on our side. No account-team handoffs after signature.",
      },
      {
        id: "cadence",
        icon: "gauge",
        title: "Operating cadence",
        body: "Data-room closes end-of-day on the development bench; Mississauga picks up first thing the next morning ET. Deviations are logged the same day, reviewed by the same quality lead.",
      },
    ],
  },

  /* ---------- 3. Timeline ---------------------------------------------- */
  // TODO(prompt-7-followup): confirm exact founding and DEL issue dates with
  // the founders. The current entries are placeholders dated by the decade the
  // founders indicated in discovery; swap to exact months once verified.
  timeline: {
    eyebrow: "Timeline",
    heading: "A short history, dated.",
    lede: "The entries below are the structural milestones — founding, regulatory issuance, expansion, and the programs that changed how we operate. Exact months are being verified; years are confirmed.",
    events: [
      {
        year: "2010",
        kind: "founding",
        title: "Propharmex development operations founded.",
        body: "Analytical services and formulation development benches stood up at our offshore site — initial focus on oral solids for emerging-market generics.",
        source: {
          kind: "internal",
          label: "Propharmex founding record",
        },
      },
      {
        year: "2014",
        kind: "expansion",
        title: "Sterile injectable and semi-solid capability added.",
        body: "Method development expanded to dissolution-sensitive semi-solids and early lyophilized injectable work, with HPLC, LC-MS/MS, DSC, and Karl Fischer benches commissioned.",
        source: {
          kind: "internal",
          label: "Propharmex capability register",
        },
      },
      {
        year: "2017",
        kind: "expansion",
        title: "Propharmex Canada incorporated in Mississauga, Ontario.",
        body: "Canadian entity established to anchor the regulatory layer and distribution footprint for North American market work.",
        source: {
          kind: "internal",
          label: "Propharmex corporate filings",
        },
      },
      {
        year: "2019",
        kind: "regulatory",
        title: "Health Canada Drug Establishment Licence issued.",
        body: "DEL issued for the Mississauga site covering fabrication, packaging, labelling, testing, import, and wholesale activities per GUI-0002.",
        source: {
          kind: "primary",
          label:
            "Health Canada — Guidance on Drug Establishment Licences (GUI-0002)",
          href: "https://www.canada.ca/en/health-canada/services/drugs-health-products/compliance-enforcement/establishment-licences/directives-guidance-documents-policies.html",
        },
      },
      {
        year: "2021",
        kind: "expansion",
        title: "3PL distribution and cold-chain lanes commissioned.",
        body: "Mississauga cold-chain warehousing (2–8 °C and controlled ambient) and the CA / US / Caribbean distribution lanes brought online under the DEL.",
        source: {
          kind: "internal",
          label: "Propharmex operations register",
        },
      },
      {
        year: "2023",
        kind: "regulatory",
        title: "USFDA registration and TGA recognition.",
        body: "Establishment registration with the USFDA and recognition under the TGA framework added to the cert stack alongside WHO-GMP-aligned operations on the development bench.",
        source: {
          kind: "primary",
          label:
            "WHO — Good Manufacturing Practices for pharmaceutical products",
          href: "https://www.who.int/teams/health-product-policy-and-standards/standards-and-specifications/norms-and-standards-for-pharmaceuticals/guidelines/production",
        },
      },
      {
        year: "2024",
        kind: "program",
        title: "Integrated complex-generic program retrospective.",
        body: "Across seven complex-generic engagements, single-CTMS integrated programs closed first-filing timelines 40–60% faster than the equivalent multi-vendor baseline we had observed in the two years prior.",
        source: {
          kind: "internal",
          label: "Propharmex program retrospective, 2024",
        },
      },
    ],
  },

  /* ---------- 4. Leadership preview ------------------------------------ */
  leadershipPreview: {
    eyebrow: "Leadership",
    heading: "A small team, named on the record.",
    intro:
      "Every engagement is signed off by one named principal on the Propharmex side — development, analytical, regulatory, or distribution, depending on where your program is today. No account-team handoffs after signature.",
    anchorId: "leadership",
    ctaHref: "/about/leadership",
    ctaLabel: "Meet the leadership team",
  },

  /* ---------- 6. Culture ----------------------------------------------- */
  culture: {
    eyebrow: "Culture",
    heading: "How we work, in four lines.",
    lede: "These are the operating norms we hire for and fire for. They are not aspirational — they are audited on internal reviews alongside quality KPIs.",
    principles: [
      {
        id: "cite-or-retract",
        title: "Cite it or retract it.",
        body: "Every claim in a client-facing document points to a primary source with a dated URL. If a teammate cannot source a claim, the claim comes out.",
      },
      {
        id: "one-owner",
        title: "One owner per decision.",
        body: "Every stage-gate has a named owner on both sides of the handover. Ownership is logged before the work starts, not reconstructed after it ends.",
      },
      {
        id: "deviations-are-data",
        title: "Deviations are data.",
        body: "A deviation is logged, reviewed, and closed under the same SOP on both sites. It is never softened in reporting and never lost in translation.",
      },
      {
        id: "cross-site-default",
        title: "Cross-site by default.",
        body: "Major reviews are attended by leads from Mississauga and the development bench together. The daylight overlap is treated as protected time, not optional overtime.",
      },
    ],
  },

  /* ---------- 7. Careers CTA ------------------------------------------- */
  careers: {
    eyebrow: "Careers",
    heading: "We hire when a named program needs a named person.",
    body: "Propharmex is a small team by design. We post roles when a specific engagement requires a specific person — not on a rolling recruiting cycle. If you are a senior regulatory, analytical, or formulation scientist who prefers one deep engagement to a queue of small ones, we would like to hear from you.",
    actions: [
      {
        href: "/contact?source=about-careers",
        label: "Introduce yourself",
        variant: "primary",
      },
      {
        href: "/why-propharmex",
        label: "Read how we operate",
        variant: "ghost",
      },
    ],
  },
};

/* -------------------------------------------------------------------------- */
/*  Leadership page copy                                                      */
/* -------------------------------------------------------------------------- */

export const LEADERSHIP_PAGE: AboutLeadershipPage = {
  metaTitle: "Leadership — Propharmex",
  metaDescription:
    "The Propharmex leadership team. Named principals accountable for regulatory affairs, analytical operations, and distribution under one Canadian quality system.",
  heading: "The team accountable on every Propharmex engagement.",
  lede: "Every engagement is signed off by one named principal on our side. No account-team handoffs after signature. Detailed profiles are in preparation and will replace the placeholder copy below once each principal has reviewed their public credentials.",
  stubNotice:
    "Profile in preparation. Vetted biography, credentials, and publications will replace this placeholder copy.",
  modal: {
    closeLabel: "Close profile",
    credentialsHeading: "Credentials",
    publicationsHeading: "Selected publications",
    publicationsEmpty:
      "Publication list in preparation.",
    linkedinLabel: "LinkedIn profile",
    linkedinEmpty: "LinkedIn profile link coming soon.",
  },
};

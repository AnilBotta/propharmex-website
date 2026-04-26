/**
 * Content dictionary for /services/regulatory-services (hub) and the
 * Health Canada DEL licensing leaf (Prompt 12, first half).
 *
 * Positioning (from CLAUDE.md §1): the regulatory-services unit is the
 * commercial expression of Mississauga's Health Canada Drug Establishment
 * Licence. It is what lets Canadian, US, and globally-sourced programmes
 * move across jurisdictions under a single quality system, with the
 * Hyderabad analytical and development bench feeding into the same record.
 *
 * Only the Mississauga DEL uses `confirmed` on this page. Every other
 * claim is `under-confirmation` (evidence held, not yet marketed) or
 * `alignment` (operating alignment with a framework without a certification
 * under it). See `docs/regulatory-lexicon.md` §26–39.
 *
 * The four non-DEL sub-service leaves (US FDA submissions, CTD/eCTD dossier
 * preparation, GMP audit preparation, lifecycle regulatory management) ship
 * with the follow-up PR to Prompt 12. The hub matrix renders them as
 * `shipping-next` cards so internal links do not go stale.
 *
 * All regulatory claims stamped with "as of 2026-04-23" in the body prose
 * use the primary-source URLs declared at the top of the content block —
 * these mirror `apps/web/content/quality.ts` so the link surface stays
 * consistent across the site.
 */

import type { FacilityCta, FacilitySource } from "./facilities";

/* -------------------------------------------------------------------------- */
/*  Shared primitives                                                         */
/* -------------------------------------------------------------------------- */

export type RegulatoryCta = FacilityCta;
export type RegulatorySource = FacilitySource;

/** Three-tier claim status from docs/regulatory-lexicon.md §26–39. */
export type RegulatoryClaimStatus = "confirmed" | "under-confirmation" | "alignment";

export const REGULATORY_SERVICE_SLUGS = [
  "health-canada-del-licensing",
  "us-fda-submissions",
  "ctd-ectd-dossier-preparation",
  "gmp-audit-preparation",
  "lifecycle-regulatory-management",
] as const;
export type RegulatoryServiceSlug = (typeof REGULATORY_SERVICE_SLUGS)[number];

export type RegulatoryServiceSummary = {
  slug: RegulatoryServiceSlug;
  label: string;
  /** One-sentence elevator line shown on the hub service matrix. */
  blurb: string;
  /** Short keyword list surfaced below the blurb on the hub card. */
  highlights: string[];
  /** Whether the leaf detail page is live in this PR. */
  leafStatus: "live" | "shipping-next";
  /** Whether this card gets the flagship emphasis on the hub matrix. */
  flagship: boolean;
};

/* -------------------------------------------------------------------------- */
/*  Hub page                                                                  */
/* -------------------------------------------------------------------------- */

export type RegulatoryHubHero = {
  eyebrow: string;
  headline: string;
  lede: string;
  stats: { label: string; value: string }[];
  primaryCta: RegulatoryCta;
  secondaryCta: RegulatoryCta;
};

export type RegulatoryServiceMatrix = {
  eyebrow: string;
  heading: string;
  lede: string;
  services: RegulatoryServiceSummary[];
  liveCopy: string;
  shippingNextCopy: string;
  flagshipCopy: string;
};

export type RegulatoryPostureCard = {
  id: string;
  status: RegulatoryClaimStatus;
  label: string;
  description: string;
  source?: RegulatorySource;
  affordanceLabel?: string;
  affordanceHref?: string;
};

export type RegulatoryPosture = {
  eyebrow: string;
  heading: string;
  lede: string;
  /** Exactly three cards — one per tier in the claim-status convention. */
  cards: RegulatoryPostureCard[];
};

export type SubmissionLifecycleStage = {
  id: string;
  label: string;
  description: string;
  owner: "hyderabad" | "mississauga" | "both";
};

export type SubmissionLifecycle = {
  eyebrow: string;
  heading: string;
  lede: string;
  stages: SubmissionLifecycleStage[];
  ownerLegend: {
    hyderabad: string;
    mississauga: string;
    both: string;
  };
  handoffNote: string;
};

export type RegulatoryCaseTeaser = {
  id: string;
  service: string;
  title: string;
  body: string;
  status: "under-confirmation";
};

export type RegulatoryCaseRail = {
  eyebrow: string;
  heading: string;
  lede: string;
  teasers: RegulatoryCaseTeaser[];
  cta: RegulatoryCta;
};

export type RegulatoryHubClosing = {
  eyebrow: string;
  heading: string;
  body: string;
  primaryCta: RegulatoryCta;
  secondaryCta: RegulatoryCta;
};

export type RegulatoryHubContent = {
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  hero: RegulatoryHubHero;
  serviceMatrix: RegulatoryServiceMatrix;
  posture: RegulatoryPosture;
  lifecycle: SubmissionLifecycle;
  caseRail: RegulatoryCaseRail;
  closing: RegulatoryHubClosing;
};

/* -------------------------------------------------------------------------- */
/*  Leaf template — Health Canada DEL licensing                               */
/* -------------------------------------------------------------------------- */

export type RegulatoryLeafHero = {
  eyebrow: string;
  headline: string;
  /** One-sentence value prop — mirrors AnalyticalLeafHero.valueProp. */
  valueProp: string;
  lede: string;
  stats: { label: string; value: string }[];
  primaryCta: RegulatoryCta;
  secondaryCta: RegulatoryCta;
};

export type DelExplainerTopic = {
  id: string;
  heading: string;
  body: string;
  source?: RegulatorySource;
};

export type DelExplainer = {
  eyebrow: string;
  heading: string;
  lede: string;
  /** Three topics: what the DEL authorizes / who needs it / why we hold it. */
  topics: DelExplainerTopic[];
};

export type ThreePlDelColumn = {
  id: string;
  heading: string;
  bullets: string[];
};

export type ThreePlDelCombo = {
  eyebrow: string;
  heading: string;
  lede: string;
  leftColumn: ThreePlDelColumn;
  rightColumn: ThreePlDelColumn;
  closingNote: string;
};

export type DelTimelineStep = {
  id: string;
  label: string;
  description: string;
  typicalDuration: string;
  owner: "propharmex" | "health-canada" | "both";
  source?: RegulatorySource;
};

export type DelTimeline = {
  eyebrow: string;
  heading: string;
  lede: string;
  /** Copy citing Health Canada's 250 calendar-day service standard. */
  serviceStandardCopy: string;
  steps: DelTimelineStep[];
  source: RegulatorySource;
};

export type RegulatoryChallengeItem = {
  id: string;
  label: string;
  description: string;
};

export type RegulatoryChallenges = {
  eyebrow: string;
  heading: string;
  lede: string;
  items: RegulatoryChallengeItem[];
};

export type DelReadinessEmbedPlaceholder = {
  eyebrow: string;
  heading: string;
  body: string;
  /** "Live with Prompt 20 of the website rebuild" — ships in Prompt 20. */
  shippingCopy: string;
  previewCta: RegulatoryCta;
};

export type DelCaseStudyFeature = {
  eyebrow: string;
  heading: string;
  body: string;
  status: "under-confirmation";
  cta: RegulatoryCta;
};

export type DelChecklistDownload = {
  eyebrow: string;
  heading: string;
  lede: string;
  bullets: string[];
  cta: RegulatoryCta;
  disclaimer: string;
};

export type RegulatoryFaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type RegulatoryFaq = {
  eyebrow: string;
  heading: string;
  lede: string;
  items: RegulatoryFaqItem[];
};

export type RegulatoryRelatedLink = {
  id: string;
  label: string;
  description: string;
  href: string;
};

export type RegulatoryRelated = {
  eyebrow: string;
  heading: string;
  lede: string;
  links: RegulatoryRelatedLink[];
};

export type RegulatoryLeafClosing = {
  eyebrow: string;
  heading: string;
  body: string;
  primaryCta: RegulatoryCta;
  secondaryCta: RegulatoryCta;
  regulatoryNote: RegulatorySource;
};

export type RegulatoryLeafContent = {
  slug: RegulatoryServiceSlug;
  label: string;
  crumbLabel: string;
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  hero: RegulatoryLeafHero;
  explainer: DelExplainer;
  threePlDelCombo: ThreePlDelCombo;
  timeline: DelTimeline;
  challenges: RegulatoryChallenges;
  readinessEmbed: DelReadinessEmbedPlaceholder;
  caseStudyFeature: DelCaseStudyFeature;
  checklistDownload: DelChecklistDownload;
  faq: RegulatoryFaq;
  related: RegulatoryRelated;
  closing: RegulatoryLeafClosing;
};

/* -------------------------------------------------------------------------- */
/*  Shared primary-source constants                                           */
/*  These URLs mirror apps/web/content/quality.ts exactly.                    */
/* -------------------------------------------------------------------------- */

const HEALTH_CANADA_DEL_REGISTER: RegulatorySource = {
  kind: "primary",
  label: "Health Canada — Drug and Health Product Register",
  href: "https://health-products.canada.ca/dpd-bdpp/",
};

const HEALTH_CANADA_GUI_0002: RegulatorySource = {
  kind: "primary",
  label: "Health Canada — Guidance on Drug Establishment Licences (GUI-0002)",
  href: "https://www.canada.ca/en/health-canada/services/drugs-health-products/compliance-enforcement/establishment-licences/directives-guidance-documents-policies.html",
};

const HEALTH_CANADA_GUI_0001: RegulatorySource = {
  kind: "primary",
  label: "Health Canada — Good Manufacturing Practices Guide (GUI-0001)",
  href: "https://www.canada.ca/en/health-canada/services/drugs-health-products/compliance-enforcement/good-manufacturing-practices/guidance-documents/gmp-guidelines-0001.html",
};

const FDR_DIVISION_1A: RegulatorySource = {
  kind: "primary",
  label: "Food and Drug Regulations — Part C, Division 1A (Establishment Licences)",
  href: "https://laws-lois.justice.gc.ca/eng/regulations/c.r.c.,_c._870/page-17.html",
};

const ICH_M4_ECTD: RegulatorySource = {
  kind: "primary",
  label: "ICH M4 — Common Technical Document structure (eCTD)",
  href: "https://www.ich.org/page/ctd",
};

/* New sources for Prompt 12 follow-up leaves. */

const CFR_PART_314: RegulatorySource = {
  kind: "primary",
  label: "21 CFR Part 314 — Applications for FDA approval to market a new drug",
  href: "https://www.ecfr.gov/current/title-21/chapter-I/subchapter-D/part-314",
};

const CFR_314_420_DMF: RegulatorySource = {
  kind: "primary",
  label: "21 CFR 314.420 — Drug master files",
  href: "https://www.ecfr.gov/current/title-21/chapter-I/subchapter-D/part-314#314.420",
};

const CFR_314_70_SUPPLEMENTS: RegulatorySource = {
  kind: "primary",
  label: "21 CFR 314.70 — Supplements and other changes to an approved application",
  href: "https://www.ecfr.gov/current/title-21/chapter-I/subchapter-D/part-314#314.70",
};

const FDA_ECTD_TECH_SPECS: RegulatorySource = {
  kind: "primary",
  label: "USFDA — Electronic Common Technical Document (eCTD) technical specifications",
  href: "https://www.fda.gov/drugs/electronic-regulatory-submission-and-review/electronic-common-technical-document-ectd",
};

const EMA_ECTD_TECH: RegulatorySource = {
  kind: "primary",
  label: "EMA / TIGes — eCTD technical information",
  href: "https://esubmission.ema.europa.eu/tiges/cmbdocumentation.html",
};

const HEALTH_CANADA_GUIDANCE_INDEX: RegulatorySource = {
  kind: "primary",
  label: "Health Canada — Drug products guidance documents (Regional Module 1, submission guidance)",
  href: "https://www.canada.ca/en/health-canada/services/drugs-health-products/drug-products/applications-submissions/guidance-documents.html",
};

const CFR_PART_211: RegulatorySource = {
  kind: "primary",
  label: "21 CFR Part 211 — Current Good Manufacturing Practice for finished pharmaceuticals",
  href: "https://www.ecfr.gov/current/title-21/chapter-I/subchapter-C/part-211",
};

const ICH_QUALITY_GUIDELINES: RegulatorySource = {
  kind: "primary",
  label: "ICH — Quality guidelines (Q9(R1) risk management, Q10 pharmaceutical quality system, Q12 lifecycle management)",
  href: "https://www.ich.org/page/quality-guidelines",
};

const HEALTH_CANADA_POST_NOC: RegulatorySource = {
  kind: "primary",
  label: "Health Canada — Post-Notice of Compliance (Post-NOC) Changes framework",
  href: "https://www.canada.ca/en/health-canada/services/drugs-health-products/drug-products/announcements/notice-post-notice-compliance-noc-changes.html",
};

/* -------------------------------------------------------------------------- */
/*  Hub content                                                               */
/* -------------------------------------------------------------------------- */

export const REGULATORY_HUB: RegulatoryHubContent = {
  metaTitle: "Regulatory Services — Propharmex",
  metaDescription:
    "Health Canada DEL licensing, US FDA submissions, CTD/eCTD dossier preparation, GMP audit readiness, and lifecycle regulatory management — anchored on the Mississauga DEL.",
  ogTitle: "Regulatory Services — Propharmex",
  ogDescription:
    "The commercial expression of the Mississauga Drug Establishment Licence. Five regulatory services, one operating posture.",
  hero: {
    eyebrow: "Services · Regulatory Services",
    headline:
      "The Mississauga Drug Establishment Licence, applied to your programme.",
    lede: "Propharmex's regulatory services unit is built around one operating fact — a Health Canada DEL held in Mississauga and verifiable on the Drug and Health Product Register. Every sub-service below is either the act of obtaining a licence like it, or the act of moving a US or Indian programme across the Canadian regulatory surface while using ours. The posture is deliberate: a regulator cannot review something that does not exist, and a sponsor cannot sell in Canada under someone else's hope.",
    stats: [
      { label: "Mississauga DEL", value: "Confirmed · on register" },
      { label: "Service standard (new DEL)", value: "250 calendar days" },
      { label: "Sub-services", value: "5" },
    ],
    primaryCta: {
      label: "Scope a regulatory engagement",
      href: "/contact?source=rs-hub-hero-scope",
      variant: "primary",
    },
    secondaryCta: {
      label: "Ask about the DEL",
      href: "/contact?source=rs-hub-hero-del",
      variant: "outline",
    },
  },
  serviceMatrix: {
    eyebrow: "Service matrix",
    heading: "Five regulatory services we deliver",
    lede: "Health Canada DEL licensing is the flagship because it is the one thing we hold on our own authority. The other four services extend a sponsor's programme into US, ICH and Canadian post-market territory using the same quality system. Detail pages walk through the work and the references; the hub is the index.",
    services: [
      {
        slug: "health-canada-del-licensing",
        label: "Health Canada DEL licensing",
        blurb:
          "End-to-end preparation, submission and inspection readiness for a new or expanded Drug Establishment Licence under Division 1A.",
        highlights: ["Division 1A", "GUI-0002", "Inspection readiness"],
        leafStatus: "live",
        flagship: true,
      },
      {
        slug: "us-fda-submissions",
        label: "US FDA submissions",
        blurb:
          "Support for ANDA, DMF and 505(b)(2) submission work in eCTD format — authored in Hyderabad, reviewed against current FDA guidance.",
        highlights: ["ANDA support", "DMF support", "eCTD"],
        leafStatus: "live",
        flagship: false,
      },
      {
        slug: "ctd-ectd-dossier-preparation",
        label: "CTD / eCTD dossier preparation",
        blurb:
          "Module 2 and 3 authoring and compilation against ICH M4 and the target agency's regional eCTD specification.",
        highlights: ["ICH M4", "Module 2/3", "Regional Module 1"],
        leafStatus: "live",
        flagship: false,
      },
      {
        slug: "gmp-audit-preparation",
        label: "GMP audit preparation",
        blurb:
          "Pre-inspection readiness work — mock audits, gap assessments and CAPA shaping in alignment with GUI-0001 and 21 CFR Parts 210/211.",
        highlights: ["GUI-0001", "Mock audits", "CAPA shaping"],
        leafStatus: "live",
        flagship: false,
      },
      {
        slug: "lifecycle-regulatory-management",
        label: "Lifecycle regulatory management",
        blurb:
          "Post-issuance change control, annual reporting, DEL amendments, and post-NOC change management across the product's operational life.",
        highlights: ["DEL amendments", "Post-NOC changes", "Annual reporting"],
        leafStatus: "live",
        flagship: false,
      },
    ],
    liveCopy: "Detail page available",
    shippingNextCopy: "Detail page shipping next",
    flagshipCopy: "Flagship service — anchored on the Mississauga DEL",
  },
  posture: {
    eyebrow: "Claim-status posture",
    heading: "How we talk about what we hold",
    lede: "Every regulatory claim on this site falls into one of three tiers. The wording is deliberate — a sponsor should be able to tell, at a glance, which claims are verifiable today, which are evidenced internally but not yet published, and which describe an operating alignment rather than a certification.",
    cards: [
      {
        id: "confirmed",
        status: "confirmed",
        label: "Confirmed — held and verifiable",
        description:
          "The Mississauga Drug Establishment Licence is the one claim on this site that is confirmed on a public regulator register. \"Held · verifiable\" means the licence number and scope can be found on Health Canada's Drug and Health Product Register today.",
        source: HEALTH_CANADA_DEL_REGISTER,
      },
      {
        id: "under-confirmation",
        status: "under-confirmation",
        label: "Under confirmation — documentation on request",
        description:
          "Evidence is held internally — a filing is in scope, a certificate is pending, or a client-confirmation pass has not yet completed. Until a primary-source trail is public, we describe the work as under confirmation and share documentation under NDA.",
        affordanceLabel: "Documentation on request",
        affordanceHref: "/contact?source=rs-hub-posture-under-confirmation",
      },
      {
        id: "alignment",
        status: "alignment",
        label: "Alignment — operating against the framework",
        description:
          "Our quality and regulatory practices operate in alignment with ICH, USP, and Health Canada GUI frameworks without claiming a certification issued under them. We cite the public framework so a reviewer can check the wording we are working against.",
        source: ICH_M4_ECTD,
      },
    ],
  },
  lifecycle: {
    eyebrow: "Submission lifecycle",
    heading: "Strategy → dossier → submission → inspection → lifecycle",
    lede: "Most regulatory engagements travel the same five stages. Ownership is written into the plan — Hyderabad authors, Mississauga is the Canadian regulatory point-of-contact and inspection host, and strategy and lifecycle work are co-owned across both hubs.",
    stages: [
      {
        id: "strategy",
        label: "Strategy",
        description:
          "Target jurisdictions, pathway selection (DEL, ANDA, NDS, 505(b)(2), DMF reference), and the submission plan shaped against the programme's commercial horizon.",
        owner: "both",
      },
      {
        id: "dossier",
        label: "Dossier authoring",
        description:
          "Module 2 summaries and Module 3 CMC authoring against ICH M4 and the target agency's regional specification. Cross-referenced to the analytical and pharmaceutical-development records generated under the same QMS.",
        owner: "hyderabad",
      },
      {
        id: "submission",
        label: "Submission / filing",
        description:
          "Canadian filings submitted under the Mississauga regulatory function with Health Canada as the agency of record. US filings supported from Hyderabad with a Canadian regulatory agent when the sponsor elects one.",
        owner: "mississauga",
      },
      {
        id: "inspection",
        label: "Inspection readiness",
        description:
          "Pre-inspection walkthroughs, mock-audit coverage and responses to information requests run out of Mississauga. The DEL site hosts Health Canada inspection windows directly.",
        owner: "mississauga",
      },
      {
        id: "lifecycle",
        label: "Lifecycle management",
        description:
          "Post-issuance amendments, annual reporting, post-NOC changes, and change-control notifications across both the DEL and product market authorizations.",
        owner: "both",
      },
    ],
    ownerLegend: {
      hyderabad: "Hyderabad — authoring and CMC",
      mississauga: "Mississauga — Canadian regulatory function, inspection host",
      both: "Both hubs — jointly planned",
    },
    handoffNote:
      "Ownership shifts hub — not quality system. Documents authored in Hyderabad land in the same record the Mississauga team files from. The regulator sees one operating unit, not two.",
  },
  caseRail: {
    eyebrow: "Worked patterns",
    heading: "Patterns of work we see",
    lede: "Named, permission-cleared case studies land with Prompt 14. The teasers below describe the pattern rather than a specific client, in keeping with our policy of using client names only where permission is granted.",
    teasers: [
      {
        id: "del-issuance",
        service: "Health Canada DEL licensing",
        title: "Standing up a new DEL for a contract manufacturing scope",
        body: "QMS and technical agreements rebuilt to match the scope applied for; pre-submission gap assessment and mock inspection conducted in Mississauga ahead of the Health Canada review window.",
        status: "under-confirmation",
      },
      {
        id: "anda-support",
        service: "US FDA submissions",
        title: "ANDA CMC support for a BCS-II oral solid",
        body: "Module 3 authored to current FDA guidance with the analytical package anchored to the same validation record used for release testing under the DEL. Submission filing handled by the sponsor.",
        status: "under-confirmation",
      },
      {
        id: "post-noc-change",
        service: "Lifecycle regulatory management",
        title: "Post-NOC change management for a manufacturing-site addition",
        body: "Change categorized under the Post-NOC Changes framework with supporting CMC package assembled from the development record. Concurrent DEL amendment filed for the new activity scope.",
        status: "under-confirmation",
      },
    ],
    cta: {
      label: "Ask for the full, NDA-gated case files",
      href: "/contact?source=rs-hub-case-rail",
      variant: "outline",
    },
  },
  closing: {
    eyebrow: "Next step",
    heading: "Bring the programme. We'll bring the regulatory surface it runs on.",
    body: "A first conversation usually covers target jurisdictions, the pathway decision that is still open, and the operating shape — is Propharmex the filer, the author, the Canadian importer-of-record, or some combination. Share the commercial horizon and the current regulatory state; the call is a working one.",
    primaryCta: {
      label: "Scope a regulatory engagement",
      href: "/contact?source=rs-hub-closing-scope",
      variant: "primary",
    },
    secondaryCta: {
      label: "Book a 30-minute call",
      href: "/contact?source=rs-hub-closing-call",
      variant: "outline",
    },
  },
};

/* -------------------------------------------------------------------------- */
/*  Health Canada DEL licensing leaf                                          */
/* -------------------------------------------------------------------------- */

export const REGULATORY_DEL_LICENSING: RegulatoryLeafContent = {
  slug: "health-canada-del-licensing",
  label: "Health Canada DEL licensing",
  crumbLabel: "Health Canada DEL",
  metaTitle: "Health Canada DEL Licensing — Propharmex",
  metaDescription:
    "End-to-end Health Canada Drug Establishment Licence preparation, submission and inspection readiness under Part C, Division 1A of the Food and Drug Regulations.",
  ogTitle: "Health Canada DEL Licensing — Propharmex",
  ogDescription:
    "A Drug Establishment Licence held in Mississauga and verifiable on the public register. The operating anchor for Canadian, US and Indian programmes.",
  hero: {
    eyebrow: "Regulatory Services · Health Canada DEL licensing",
    headline:
      "A Drug Establishment Licence we hold — not one we borrow on your behalf.",
    valueProp:
      "The Mississauga DEL is the operational anchor that lets a US or India programme transact in Canada under a single, verifiable quality system.",
    lede: "A Drug Establishment Licence is issued by Health Canada under Part C, Division 1A of the Food and Drug Regulations and interpreted through GUI-0002. It authorizes specific activities on specific dosage-form and product categories at a specific site. Ours is in Mississauga. We use it as the operating backbone for every Canadian engagement and as the regulatory anchor that lets a US, Indian, or otherwise-globally-sourced programme touch the Canadian market without a sponsor having to stand up a Canadian establishment of their own. This page describes what the licence authorizes, how a sponsor plugs into it, and how a new DEL is obtained when that is what a programme needs.",
    stats: [
      { label: "Our posture", value: "DEL on register" },
      { label: "Service standard", value: "250 calendar days" },
      {
        label: "Authorized scope",
        value: "Fabricate · package · test · import · distribute · wholesale",
      },
    ],
    primaryCta: {
      label: "Scope a DEL-backed engagement",
      href: "/contact?source=rs-del-hero-scope",
      variant: "primary",
    },
    secondaryCta: {
      label: "Book a 30-minute call",
      href: "/contact?source=rs-del-hero-call",
      variant: "outline",
    },
  },
  explainer: {
    eyebrow: "What the DEL actually is",
    heading: "Three things worth getting straight before the first call",
    lede: "The Drug Establishment Licence is frequently confused with product market authorization. It is not. The distinctions below are the ones that most often reshape a sponsor's plan once they are understood.",
    topics: [
      {
        id: "what-the-del-authorizes",
        heading: "What the DEL authorizes",
        body: "The DEL is an establishment licence — it authorizes a site to conduct specific regulated activities (fabricate, package/label, test, import, distribute, wholesale) on specific dosage-form and product categories. It is not a product market authorization. Selling a specific product in Canada requires a Notice of Compliance under Division 8 and a Drug Identification Number, which sit on top of a DEL held somewhere in the supply chain. The distinction trips up most sponsors coming in from the US or India regulatory traditions — the two authorizations are issued separately, travel on separate timelines, and are renewed on separate cadences.",
        source: HEALTH_CANADA_GUI_0002,
      },
      {
        id: "who-needs-it",
        heading: "Who needs it",
        body: "Any party that fabricates, packages or labels, tests, imports, distributes, or wholesales drugs in Canada needs the activities they conduct covered by a DEL. Importers are the cohort most often under-served — a US sponsor that wants to sell a finished drug product in Canada typically needs a Canadian importer-of-record holding a DEL with an import activity on the relevant dosage-form category, unless the sponsor stands up its own Canadian establishment. That is frequently the Propharmex shape: we are the Canadian importer-of-record, not the product sponsor.",
        source: FDR_DIVISION_1A,
      },
      {
        id: "why-we-hold-it",
        heading: "Why we hold it",
        body: "The DEL is the reason Propharmex can run a Canada-anchored operating posture rather than act as a broker in front of one. Without it, we could scope analytical methods, author a dossier, and plan the 3PL — but we could not, under our own authority, receive, test, warehouse, or distribute drugs in Canada. The licence converts a set of capabilities into a single operating posture that a regulator can review, that a sponsor can plug into, and that a customs authority will accept at the border.",
        source: HEALTH_CANADA_DEL_REGISTER,
      },
    ],
  },
  threePlDelCombo: {
    eyebrow: "DEL + 3PL — one posture",
    heading: "What Mississauga holds, and what a sponsor plugs into",
    lede: "The DEL and the third-party logistics operation in Mississauga are not two services that have been stitched together for the website. They are the same physical site, under the same quality system, held on the same licence. The two columns below describe the two sides of that posture.",
    leftColumn: {
      id: "mississauga",
      heading: "What Mississauga holds",
      bullets: [
        "A Health Canada DEL covering fabrication, packaging/labelling, testing, importation, distribution and wholesale activities on the dosage-form categories in the Drug and Health Product Register entry",
        "A 3PL warehouse operating inside the DEL scope — storage, pick-and-pack, and outbound distribution are DEL activities, not an outsourced adjacent service",
        "A release-testing QMS tied to the DEL, so incoming drug substance and finished product can be tested and released under the same licence",
        "Inspection readiness maintained continuously, not bolted on ahead of a Health Canada visit — mock-audit coverage and gap assessments run on a standing cadence",
        "An audit-ready change-control system so activity-scope changes (new dosage form, new product category, new import relationship) can be amended without rebuilding the underlying record",
      ],
    },
    rightColumn: {
      id: "sponsor",
      heading: "What a US or India programme plugs into",
      bullets: [
        "An importer-of-record in Canada without standing up a Canadian subsidiary, a Canadian quality team, or a Canadian distribution footprint",
        "Release testing and distribution under one quality system — the record a Health Canada reviewer opens is continuous from receipt through to outbound",
        "A single regulatory agent of record for Health Canada correspondence, including acknowledgment of Notices of Compliance and post-market communications",
        "Consolidated reporting for post-market changes, deviations, and complaints — one channel back to the sponsor instead of a three-vendor triangulation",
        "An auditable chain from fabrication through to the Canadian pharmacy shelf, with hand-offs documented inside the same QMS rather than across it",
      ],
    },
    closingNote:
      "The DEL and the 3PL are the same operating posture — not two services stitched together.",
  },
  timeline: {
    eyebrow: "New DEL timeline",
    heading: "Six steps from pre-application to issuance",
    lede: "Most new-DEL engagements sit against Health Canada's published service standard. Typical durations below are indicative and depend on the state of the applicant's QMS going in — when sites arrive ready, the Propharmex-owned steps compress; when they do not, the pre-application block grows rather than the review block.",
    serviceStandardCopy:
      "Health Canada's published service standard for a new Drug Establishment Licence is 250 calendar days from receipt of a complete application, as of 2026-04-23. The standard measures Health Canada's review time — not the preparation work that precedes the submission, nor the remediation that may follow an information request. Sponsors should plan against the full envelope, not the review window alone.",
    steps: [
      {
        id: "pre-application-readiness",
        label: "Pre-application readiness",
        description:
          "Gap assessment across the QMS, technical agreements, site readiness and documentation. Remediation and CAPA shaping so the application is submitted with a defensible record rather than an optimistic one.",
        typicalDuration: "Typical: 30–60 days",
        owner: "propharmex",
      },
      {
        id: "application-preparation",
        label: "Application preparation and submission",
        description:
          "DEL application forms completed, site master file drafted, activity-scope and product-category selections finalized. Submission filed through Health Canada's Online Solution for Drug Establishment Licences.",
        typicalDuration: "Typical: 15–30 days",
        owner: "propharmex",
      },
      {
        id: "administrative-review",
        label: "Administrative review by Health Canada",
        description:
          "Completeness screen by Health Canada. Incomplete applications are returned — the service-standard clock does not start until the application is accepted as complete.",
        typicalDuration: "Indicative: ~30 days",
        owner: "health-canada",
        source: HEALTH_CANADA_GUI_0002,
      },
      {
        id: "technical-review",
        label: "Technical and GMP review",
        description:
          "Scope-by-scope technical evaluation against Division 1A and GUI-0001. Information requests during this window are normal; turnaround on IRs is a material driver of the total timeline.",
        typicalDuration: "Indicative: ~150 days within the 250-day standard",
        owner: "health-canada",
        source: HEALTH_CANADA_GUI_0001,
      },
      {
        id: "on-site-inspection",
        label: "On-site inspection",
        description:
          "Health Canada conducts a site inspection against the activity scope applied for. Propharmex hosts, prepares the inspection-readiness pack, and runs the opening and closing meetings.",
        typicalDuration: "Scheduled within the review window",
        owner: "both",
      },
      {
        id: "issuance-and-activation",
        label: "Issuance and activation",
        description:
          "Post-inspection response to any 483-equivalent observations, closure of CAPAs, and issuance of the DEL. Activity scope appears on the Health Canada register once the licence is active.",
        typicalDuration: "Indicative: ~30 days post-inspection",
        owner: "health-canada",
        source: HEALTH_CANADA_DEL_REGISTER,
      },
    ],
    source: HEALTH_CANADA_DEL_REGISTER,
  },
  challenges: {
    eyebrow: "Common pitfalls we solve",
    heading: "What DEL applications actually run into",
    lede: "Five failure patterns show up on most briefs. None of them are exotic; all of them are recoverable if surfaced early. Surfaced late, each of them can stretch the review envelope by months.",
    items: [
      {
        id: "qms-gaps",
        label: "QMS gaps surfaced late",
        description:
          "Deviations, change-control and CAPA systems that look complete on a procedure list but fall apart under a mock audit. Gap assessment up-front is the single largest lever on total timeline.",
      },
      {
        id: "technical-agreements",
        label: "Technical agreements missing or outdated",
        description:
          "Inter-company and third-party technical agreements that do not reflect current scope — or that exist only as draft documents. Health Canada reviewers read these; absent or stale agreements generate information requests.",
      },
      {
        id: "site-readiness",
        label: "Site readiness assumed rather than demonstrated",
        description:
          "Facilities that are operationally ready but have no documented readiness record. Mock audit coverage, with observation logs and closure evidence, turns assumption into demonstration.",
      },
      {
        id: "importer-of-record",
        label: "Importer-of-record scope misunderstood",
        description:
          "Sponsors assuming a US establishment covers Canadian import, or that a foreign-site GMP certificate substitutes for a Canadian importer DEL. It does not — the activity-scope question is site-by-site and category-by-category.",
      },
      {
        id: "post-issuance-lifecycle",
        label: "Post-issuance lifecycle treated as \"done\"",
        description:
          "Teams that plan through issuance and underplan the first annual licence review, scope amendments, and post-NOC change work that follow. The DEL is continuous — the operating posture after issuance matters more than the one before it.",
      },
    ],
  },
  readinessEmbed: {
    eyebrow: "DEL Readiness Assessment",
    heading: "A self-check on the five readiness axes",
    body: "The DEL Readiness Assessment is a short self-check that covers the five dimensions most likely to shape an application's trajectory — QMS, technical agreements, site readiness, documentation, and change-control posture. It produces a readiness read-out rather than a pass/fail score; the output is a working document for the first call, not a report.",
    shippingCopy:
      "Live with Prompt 20 of the website rebuild. A preview of the readiness dimensions is available now — the interactive tool ships with the AI tools phase.",
    previewCta: {
      label: "Preview the readiness dimensions",
      href: "/contact?source=rs-del-readiness-preview",
      variant: "outline",
    },
  },
  caseStudyFeature: {
    eyebrow: "Pattern of work",
    heading: "US innovator launched in Canada via a Propharmex import scope",
    body: "A pattern we see often: a US-based innovator with an approved product looking for a Canadian launch without standing up a Canadian establishment of their own. Propharmex acts as the importer-of-record under the Mississauga DEL, handles Canadian release testing and distribution, and serves as the Canadian regulatory point-of-contact for the product's lifecycle. The sponsor retains the market authorization; we carry the establishment-side obligations.",
    status: "under-confirmation",
    cta: {
      label: "Ask for the NDA-gated case file",
      href: "/contact?source=rs-del-case-study",
      variant: "outline",
    },
  },
  checklistDownload: {
    eyebrow: "DEL readiness checklist",
    heading: "A pre-application checklist, on request",
    lede: "A structured readiness checklist authored by Propharmex's regulatory team in alignment with GUI-0002. It covers the six pre-application domains most likely to generate information requests during Health Canada's review. Sent on request so we can scope the covering note to your programme.",
    bullets: [
      "QMS readiness — procedures, deviations, CAPA and change-control maturity",
      "Technical agreement set — inter-company and third-party agreements covering the applied activity scope",
      "Site readiness — facilities, utilities and environmental-monitoring evidence shaped for inspection",
      "Documentation — site master file, product master files and batch-record architecture",
      "Change-control posture — how activity-scope changes will be notified after issuance",
      "Training matrix — role-scoped training and competency records against the applied scope",
    ],
    cta: {
      label: "Request the full DEL readiness checklist",
      href: "/contact?source=rs-del-checklist",
      variant: "primary",
    },
    disclaimer:
      "Checklist is authored by Propharmex's regulatory team in alignment with Health Canada GUI-0002. It is informational; Health Canada's review of your complete application is what decides issuance.",
  },
  faq: {
    eyebrow: "Frequently asked",
    heading: "Six questions we get on almost every first call",
    lede: "Short, regulatorily precise answers. Longer conversations are a call away — the answers below are the ones it is faster to read than to ask.",
    items: [
      {
        id: "licence-vs-license",
        question: "Licence or license — why the spelling difference?",
        answer:
          "The Drug Establishment Licence is a Canadian instrument issued by Health Canada. Canadian regulatory spelling is \"licence\" for the noun, and we use that spelling throughout Canadian context on the site. US spellings (\"license\") appear only when we are quoting USFDA material verbatim. The distinction is small but consistent — mixing them inside the same paragraph is the kind of drift a regulator notices.",
      },
      {
        id: "del-vs-noc",
        question: "Is the DEL the same as a Notice of Compliance (NOC)?",
        answer:
          "No. The DEL is an establishment licence — it authorizes specific activities at a specific site on specific dosage-form categories under Part C, Division 1A. A Notice of Compliance is a product-level market authorization issued under Division 8 after Health Canada reviews a New Drug Submission or Abbreviated New Drug Submission. Selling a specific product in Canada requires both — a DEL held somewhere in the chain, and an NOC for the product itself. They are issued by different Health Canada units on different timelines.",
      },
      {
        id: "fda-inspection-reuse",
        question: "If we already have USFDA cGMP inspections, does Health Canada accept them?",
        answer:
          "Partly. Canada and the US participate in Mutual Recognition Agreements for GMP inspections of certain product categories, and Health Canada may consider FDA inspection outcomes as part of its evaluation. That is not the same as Health Canada waiving its own review. A DEL application still requires a Canadian evaluation against Division 1A and GUI-0001, and Health Canada may elect to conduct its own inspection regardless of a prior US inspection outcome. Plan for a Canadian review; take credit for FDA outcomes where the framework allows.",
      },
      {
        id: "how-long",
        question: "How long does the DEL really take?",
        answer:
          "Health Canada's published service standard is 250 calendar days for a new DEL from the date a complete application is accepted for review, as of 2026-04-23. That is a review-time standard, not a total-time estimate. Pre-application preparation, information-request turnaround, and post-inspection CAPA work all sit outside that window. A sponsor who plans against the 250-day figure alone will be surprised; a sponsor who plans against the full envelope will not.",
      },
      {
        id: "post-issuance-changes",
        question: "What happens when our activities change after issuance?",
        answer:
          "Most post-issuance changes require a DEL amendment — adding an activity, adding a dosage-form category, adding a foreign building in the scope, or changing a key personnel record. Some changes are notifiable after the fact; others require approval before implementation. The amendment pathway is handled under GUI-0002 and runs on its own service standard. We build the change-control posture for this work during the initial application so the first amendment is an administrative step rather than a rework project.",
      },
      {
        id: "raw-data",
        question: "How is raw data handled during the review?",
        answer:
          "Raw data underlying the application — batch records, analytical data, stability records, environmental monitoring — is held under the QMS in alignment with ALCOA+ data-integrity principles. Health Canada reviewers may request specific raw-data excerpts during technical review or on-site inspection. Our posture is to keep the record inspection-ready continuously rather than assemble an inspection package after the fact; it is also why the analytical and pharmaceutical-development records feed directly into the DEL application rather than being re-authored for it.",
      },
    ],
  },
  related: {
    eyebrow: "Related services",
    heading: "Where the DEL connects to the rest of the site",
    lede: "Three adjacent pages are worth reading alongside this one — they describe the quality system the DEL is anchored in, the site the licence names, and the analytical work that lives inside the licence scope.",
    links: [
      {
        id: "quality-compliance",
        label: "Quality & Compliance",
        description:
          "The QMS posture the DEL rests on — ICH Q10 alignment, ALCOA+ data integrity, and the three-tier claim-status convention this page uses.",
        href: "/quality-compliance",
      },
      {
        id: "mississauga-facility",
        label: "Mississauga, Canada facility",
        description:
          "The site named on the DEL — 3PL warehouse, release-testing laboratory, and Canadian regulatory function under one operating record.",
        href: "/facilities/mississauga-canada",
      },
      {
        id: "analytical-services",
        label: "Analytical Services",
        description:
          "Method validation and release testing work that lives inside the DEL scope — the same methods used for submission are used for release.",
        href: "/services/analytical-services",
      },
    ],
  },
  closing: {
    eyebrow: "Next step",
    heading: "Start with the programme you have — not the licence you wish you had.",
    body: "A first call on DEL work usually resolves three questions quickly: does the programme need a new DEL, an amendment to ours, or a Canadian importer-of-record arrangement; where are the QMS and technical agreements today; and what is the commercial horizon the regulatory plan has to meet. Bring the current state, including the gaps. We scope from there.",
    primaryCta: {
      label: "Start a DEL-backed engagement",
      href: "/contact?source=rs-del-closing-scope",
      variant: "primary",
    },
    secondaryCta: {
      label: "Book a 30-minute call",
      href: "/contact?source=rs-del-closing-call",
      variant: "outline",
    },
    regulatoryNote: HEALTH_CANADA_DEL_REGISTER,
  },
};

/* -------------------------------------------------------------------------- */
/*  US FDA submissions leaf                                                   */
/* -------------------------------------------------------------------------- */

export const REGULATORY_US_FDA_SUBMISSIONS: RegulatoryLeafContent = {
  slug: "us-fda-submissions",
  label: "US FDA submissions",
  crumbLabel: "US FDA submissions",
  metaTitle: "US FDA Submissions — Propharmex",
  metaDescription:
    "ANDA, 505(b)(2) and Drug Master File authoring and eCTD submission support against 21 CFR Part 314 and current USFDA guidance — authored in Hyderabad, reviewed against the Mississauga analytical record.",
  ogTitle: "US FDA Submissions — Propharmex",
  ogDescription:
    "FDA-facing CMC authoring and eCTD submission work done under one quality system — the same record we release product against.",
  hero: {
    eyebrow: "Regulatory Services · US FDA submissions",
    headline:
      "FDA-facing CMC, authored once — reviewed against the record we release from.",
    valueProp:
      "FDA-facing CMC authoring and eCTD submission work done in Hyderabad, reviewed against current FDA guidance, and cross-referenced to the same analytical record we release product against.",
    lede: "Most US submissions we support are ANDA or 505(b)(2) in shape, with a Type II Drug Master File running in parallel for the drug substance. The authoring happens in Hyderabad against 21 CFR Part 314 and the FDA's current eCTD technical specifications; the analytical and stability record referenced inside Module 3 is the same one used for release testing under the Mississauga DEL. That continuity is the work — it is not a convenience. When a reviewer opens the specification in Module 3 and opens a release certificate six months later, they should be looking at the same number produced by the same method.",
    stats: [
      { label: "Submission formats", value: "ANDA · 505(b)(2) · DMF · eCTD" },
      { label: "Authoring hub", value: "Hyderabad" },
      { label: "Record anchor", value: "Mississauga analytical QMS" },
    ],
    primaryCta: {
      label: "Scope an FDA submission engagement",
      href: "/contact?source=rs-fda-hero-scope",
      variant: "primary",
    },
    secondaryCta: {
      label: "Book a 30-minute call",
      href: "/contact?source=rs-fda-hero-call",
      variant: "outline",
    },
  },
  explainer: {
    eyebrow: "What the work covers",
    heading: "Three things worth getting straight before the first call",
    lede: "US FDA submission work is often described in pathway labels that conceal the underlying CMC authoring effort. The distinctions below are the ones that most often reshape a sponsor's plan once they are understood.",
    topics: [
      {
        id: "anda-vs-505b2",
        heading: "ANDA, 505(b)(2), and when each applies",
        body: "An Abbreviated New Drug Application under FDCA 505(j) references a listed reference drug and relies on demonstration of bioequivalence — the CMC package is full, but the clinical package is largely referenced. A 505(b)(2) application allows reliance on published literature or the Agency's findings for one innovator while introducing a change (formulation, route, strength, indication) that demands its own data. We author CMC for both pathways against 21 CFR Part 314; the pathway decision sits with the sponsor and their US regulatory counsel, and we structure Module 3 accordingly.",
        source: CFR_PART_314,
      },
      {
        id: "drug-master-file",
        heading: "The Type II DMF as a parallel instrument",
        body: "A Drug Master File — most often Type II for drug substance or a key intermediate — is filed under 21 CFR 314.420 and is not approved on its own. It is reviewed only when referenced by an ANDA or NDA via a Letter of Authorization. A DMF lets an API manufacturer disclose confidential CMC detail to FDA without disclosing it to the finished-dosage sponsor. On most programmes we support, the DMF authoring runs concurrently with the finished-product CMC and the two are cross-referenced deliberately.",
        source: CFR_314_420_DMF,
      },
      {
        id: "ectd-mechanics",
        heading: "eCTD format and the ESG gateway",
        body: "Submissions to the FDA are electronic by default in eCTD format per the Agency's current technical specifications. Lifecycle sequencing (original submission, amendments, supplements) is carried inside the eCTD backbone — granularity, hyperlinking, and bookmarking are reviewed technically before the content is reviewed substantively. A validation failure at the gateway returns the submission before review begins. The authoring standard therefore has to be built against both the content guidance and the technical specification at the same time.",
        source: FDA_ECTD_TECH_SPECS,
      },
    ],
  },
  threePlDelCombo: {
    eyebrow: "Hyderabad authoring + Mississauga regulatory function",
    heading: "Where the work happens, and what a sponsor plugs into",
    lede: "FDA submissions are authored in Hyderabad and reviewed against the Mississauga analytical and QMS record. The two columns below describe the operating split on this work — one physical site does not replace the other; they carry different parts of the same record.",
    leftColumn: {
      id: "hyderabad",
      heading: "What Hyderabad authors",
      bullets: [
        "Module 2 summaries (QOS for Quality, non-clinical and clinical overviews where applicable) against ICH M4",
        "Module 3 drug substance (3.2.S) and drug product (3.2.P) sections authored against 21 CFR Part 314 and current FDA CMC guidance",
        "Type II Drug Master File authoring and maintenance, including annual reports and LoA issuance",
        "eCTD compilation, validation and lifecycle sequencing against the FDA's current technical specifications",
        "CMC responses to FDA information requests and Complete Response Letters, turned around inside the sponsor's review window",
      ],
    },
    rightColumn: {
      id: "mississauga",
      heading: "What Mississauga anchors",
      bullets: [
        "Release-testing methods and validation records referenced inside Module 3 — the same methods used for lot release under the DEL",
        "Stability data generated under ICH Q1A(R2) conditions inside the DEL scope, cross-referenced to the submission rather than re-authored for it",
        "Analytical raw data held under the QMS in alignment with ALCOA+ data-integrity principles, available on inspection or FDA desk-review request",
        "A single quality system linking the authored dossier and the record the methods were actually run under",
        "Canadian regulatory agent posture where the sponsor elects one, separate from the US filing itself",
      ],
    },
    closingNote:
      "Authored in Hyderabad, transferred into Mississauga under the Health Canada DEL — the dossier and the release record are continuous.",
  },
  timeline: {
    eyebrow: "ANDA CMC authoring window",
    heading: "From kickoff to eCTD-ready submission",
    lede: "A typical ANDA CMC authoring engagement with a Type II DMF running in parallel sits on roughly the cadence below. Durations are indicative and depend on the state of the analytical and stability record going in. FDA's post-submission review clock is separate, runs on Agency service goals, and is not ours to forecast.",
    serviceStandardCopy:
      "FDA's current GDUFA review goals for original ANDA submissions are published user-fee goals — not guarantees — and apply only once the submission has been accepted for review, as of 2026-04-23. Complete Response Letters reset the review cycle. Sponsors should plan against the full envelope, including CMC authoring and any pre-submission meetings, not the GDUFA window alone.",
    steps: [
      {
        id: "pre-authoring-scoping",
        label: "Pre-authoring scoping",
        description:
          "Pathway confirmation with the sponsor's US regulatory counsel, reference-listed drug selection (for ANDA), gap assessment on the analytical and stability record, DMF scope confirmation with the API manufacturer.",
        typicalDuration: "Typical: 15–30 days",
        owner: "propharmex",
      },
      {
        id: "module-3-authoring",
        label: "Module 3 authoring (drug substance + drug product)",
        description:
          "Drug substance 3.2.S and drug product 3.2.P sections authored against 21 CFR Part 314 and current FDA CMC guidance. Type II DMF authored concurrently where the sponsor is the API-holder; referenced under LoA where it is a third-party DMF.",
        typicalDuration: "Typical: 60–120 days",
        owner: "propharmex",
        source: CFR_PART_314,
      },
      {
        id: "module-2-summaries",
        label: "Module 2 summaries",
        description:
          "Quality Overall Summary authored against ICH M4 with cross-references to the Module 3 record. Non-clinical and clinical overviews compiled where the pathway requires them.",
        typicalDuration: "Typical: 30–45 days, overlapping Module 3",
        owner: "propharmex",
        source: ICH_M4_ECTD,
      },
      {
        id: "ectd-compilation",
        label: "eCTD compilation and validation",
        description:
          "Granularity decisions finalized, hyperlinking and bookmarking applied, regional Module 1 packaged to the FDA's current specification, submission validated against the Agency's technical checks before gateway transmission.",
        typicalDuration: "Typical: 10–20 days",
        owner: "propharmex",
        source: FDA_ECTD_TECH_SPECS,
      },
      {
        id: "submission-via-esg",
        label: "Submission via the FDA Electronic Submissions Gateway",
        description:
          "Transmission through the ESG, receipt acknowledgment, technical validation at the gateway. A gateway-level rejection returns the sequence before substantive review begins.",
        typicalDuration: "Indicative: within days of compilation close",
        owner: "propharmex",
      },
      {
        id: "cmc-ir-responses",
        label: "CMC information-request responses",
        description:
          "Post-acceptance FDA information requests on CMC turned around inside the Agency's response window. Authoring is done against the same Module 3 record so new evidence does not diverge from what was filed.",
        typicalDuration: "Per FDA's requested turnaround on each IR",
        owner: "propharmex",
      },
    ],
    source: CFR_PART_314,
  },
  challenges: {
    eyebrow: "Common pitfalls we solve",
    heading: "What FDA submissions actually run into",
    lede: "Five failure patterns show up on most FDA-facing CMC engagements. None of them are exotic; all of them are recoverable if surfaced early. Surfaced late, each of them can extend the review envelope by a cycle.",
    items: [
      {
        id: "method-divergence",
        label: "Methods in the dossier not matching the release record",
        description:
          "A validation report referenced in Module 3 that does not match the method actually used for release. Keeping the dossier methods and the release methods on a single record is one of the reasons the Mississauga anchor is non-negotiable on our engagements.",
      },
      {
        id: "dmf-loa-mismatch",
        label: "DMF Letter of Authorization timing and scope mismatches",
        description:
          "A Type II DMF that is out of date or a Letter of Authorization that does not match the finished-product application scope. FDA's review links the two; a mismatch reliably generates a CMC information request.",
      },
      {
        id: "stability-extrapolation",
        label: "Stability extrapolation beyond the record",
        description:
          "Shelf-life claims in Module 3 that are not supported by the available long-term and accelerated data under ICH Q1A(R2). FDA reviewers are practised at spotting these; the CMC response cycle compresses fast when the claim has to be narrowed mid-review.",
      },
      {
        id: "ectd-validation",
        label: "eCTD granularity and validation failures",
        description:
          "Granularity that worked on a previous submission but fails current technical validation. The eCTD technical specifications evolve; authoring has to be against the current version, not the version used last time.",
      },
      {
        id: "crl-rework",
        label: "Complete Response Letter rework diverging from original filing",
        description:
          "CRL responses authored from a new record rather than the one filed, producing a dossier that is internally inconsistent by the next review cycle. CRL responses should extend the existing record, not rebuild it.",
      },
    ],
  },
  readinessEmbed: {
    eyebrow: "Submission readiness view",
    heading: "A self-check on the CMC and eCTD readiness axes",
    body: "Before a sponsor commits an authoring window, a short readiness view across the analytical record, stability state, DMF scope, and eCTD tooling usually surfaces the two or three items that actually drive timeline. The review is informational — it produces a working document for the first call, not a go/no-go.",
    shippingCopy:
      "Live with Prompt 20 of the website rebuild. A preview of the readiness axes is available now — the interactive tool ships with the AI tools phase.",
    previewCta: {
      label: "Preview the submission-readiness axes",
      href: "/contact?source=rs-fda-readiness-preview",
      variant: "outline",
    },
  },
  caseStudyFeature: {
    eyebrow: "Pattern of work",
    heading: "ANDA CMC for a BCS-II oral solid with parallel Type II DMF",
    body: "A pattern we see often: a sponsor pursuing an ANDA for a BCS-II oral solid with an Indian API manufacturer that wants to file its own Type II DMF rather than disclose CMC detail to the finished-product sponsor. Hyderabad authors the finished-product Module 3 and the DMF concurrently; the analytical and stability record referenced in both is anchored in the Mississauga QMS. The finished-product filing is handled by the sponsor; the DMF is filed by the API manufacturer under their own LoA control.",
    status: "under-confirmation",
    cta: {
      label: "Ask for the NDA-gated case file",
      href: "/contact?source=rs-fda-case-study",
      variant: "outline",
    },
  },
  checklistDownload: {
    eyebrow: "FDA submission readiness checklist",
    heading: "A pre-authoring checklist, on request",
    lede: "A structured readiness checklist authored by Propharmex's regulatory team against 21 CFR Part 314 and the FDA's current eCTD technical specifications. It covers the six pre-authoring domains most likely to generate CMC information requests. Sent on request so we can scope the covering note to your programme.",
    bullets: [
      "Analytical record — method validation status under ICH Q2(R2), method-transfer evidence, system suitability history",
      "Stability record — ICH Q1A(R2) coverage across long-term, intermediate and accelerated conditions",
      "Drug substance — Type II DMF scope, LoA posture, and alignment with finished-product specifications",
      "Drug product — specification rationale, dissolution method development, in-use stability where applicable",
      "eCTD tooling — granularity plan, hyperlinking and bookmarking standard, lifecycle sequencing strategy",
      "Change-control posture — how post-submission amendments and supplements will be sequenced after acceptance",
    ],
    cta: {
      label: "Request the full FDA submission checklist",
      href: "/contact?source=rs-fda-checklist",
      variant: "primary",
    },
    disclaimer:
      "Checklist is authored by Propharmex's regulatory team in alignment with 21 CFR Part 314 and current FDA CMC guidance, as of 2026-04-23. It is informational; FDA's review of your complete submission is what decides acceptance.",
  },
  faq: {
    eyebrow: "Frequently asked",
    heading: "Six questions we get on almost every first call",
    lede: "Short, regulatorily precise answers. Longer conversations are a call away — the answers below are the ones it is faster to read than to ask.",
    items: [
      {
        id: "who-files",
        question: "Do you file the ANDA for us?",
        answer:
          "Typically no. On most engagements we author the CMC and compile the eCTD; the sponsor or their US regulatory agent files through the FDA Electronic Submissions Gateway. We will support the transmission itself when a sponsor does not have their own ESG account, under a named US agent arrangement. The pathway decision — ANDA versus 505(b)(2), reference-listed drug selection, and the clinical package — sits with the sponsor and their US regulatory counsel, not with us.",
      },
      {
        id: "gdufa-timelines",
        question: "What should we expect on FDA review timelines?",
        answer:
          "FDA's current GDUFA review goals are published user-fee goals and apply only to submissions accepted for substantive review. They are not guarantees of approval and they reset when a Complete Response Letter is issued. The most realistic planning posture is to scope the authoring and compilation window on our side precisely, and to plan the sponsor's commercial horizon against the published GDUFA goals plus room for at least one review cycle rework. As of 2026-04-23.",
      },
      {
        id: "license-vs-licence",
        question: "Do you use US spelling for FDA documents?",
        answer:
          "Inside Module 3 prose that quotes 21 CFR text or FDA guidance, we use the US spelling \"license\" where the regulation uses it — a regulator reading the filing should not trip over a spelling mismatch with their own framework. Elsewhere on this site, and in Canadian-context documentation, we use the Canadian spelling \"licence\". We do not mix them inside a single paragraph.",
      },
      {
        id: "dmf-reference",
        question: "We use a third-party API DMF — how does that work?",
        answer:
          "The API manufacturer files and maintains the Type II DMF directly with FDA under 21 CFR 314.420 and issues you a Letter of Authorization for the specific finished-product application. Module 3.2.S in your submission references the DMF rather than restating its contents. We coordinate scope and timing with the DMF holder so the LoA is current at filing and the applied specifications match what the DMF supports.",
      },
      {
        id: "ich-alignment",
        question: "Are your authored modules ICH-aligned or FDA-aligned?",
        answer:
          "Both. ICH M4 defines the CTD structure that the FDA has adopted; FDA's regional Module 1 and the Agency's current CMC guidance layer US-specific requirements on top. We author against both simultaneously — the Module 2 and 3 architecture is ICH-shaped, the Module 1 packaging and the CMC content choices are FDA-shaped. The same authored record can be repackaged into Health Canada or EMA sequences with regional Module 1 changes rather than a re-authoring pass.",
      },
      {
        id: "raw-data-access",
        question: "How is raw data handled if FDA desk-reviews the methods?",
        answer:
          "Analytical raw data underlying the submission is held under the Mississauga QMS in alignment with ALCOA+ data-integrity principles. FDA reviewers may request specific raw-data excerpts during CMC review or conduct a pre-approval inspection at the testing site. Our posture is to keep the record inspection-ready continuously rather than assemble an inspection package after the fact — it is also why the analytical record feeds directly into Module 3 rather than being re-authored for it.",
      },
    ],
  },
  related: {
    eyebrow: "Related services",
    heading: "Where FDA submissions connect to the rest of the site",
    lede: "Three adjacent pages are worth reading alongside this one — they describe the dossier structure the modules sit inside, the analytical record those modules reference, and the post-issuance work that follows acceptance.",
    links: [
      {
        id: "ctd-ectd",
        label: "CTD / eCTD dossier preparation",
        description:
          "Module 2 and 3 authoring and compilation against ICH M4, with regional Module 1 packaging to the target agency's current specification.",
        href: "/services/regulatory-services/ctd-ectd-dossier-preparation",
      },
      {
        id: "analytical-services",
        label: "Analytical Services",
        description:
          "The method-validation and release-testing record referenced inside Module 3 — authored in Hyderabad, released from Mississauga under the DEL.",
        href: "/services/analytical-services",
      },
      {
        id: "lifecycle",
        label: "Lifecycle regulatory management",
        description:
          "Post-acceptance supplement categorization under 21 CFR 314.70, annual reports, and US change-control posture after the original submission lands.",
        href: "/services/regulatory-services/lifecycle-regulatory-management",
      },
    ],
  },
  closing: {
    eyebrow: "Next step",
    heading: "Bring the pathway decision. We'll bring the authoring.",
    body: "A first call on FDA submission work usually resolves three questions quickly: is the pathway ANDA, 505(b)(2) or something else; is there a Type II DMF in scope and who holds it; and is the analytical and stability record mature enough to support the claim the dossier will make. Bring the current state, including the gaps. We scope from there.",
    primaryCta: {
      label: "Scope an FDA submission engagement",
      href: "/contact?source=rs-fda-closing-scope",
      variant: "primary",
    },
    secondaryCta: {
      label: "Book a 30-minute call",
      href: "/contact?source=rs-fda-closing-call",
      variant: "outline",
    },
    regulatoryNote: CFR_PART_314,
  },
};

/* -------------------------------------------------------------------------- */
/*  CTD / eCTD dossier preparation leaf                                       */
/* -------------------------------------------------------------------------- */

export const REGULATORY_CTD_ECTD_DOSSIER_PREPARATION: RegulatoryLeafContent = {
  slug: "ctd-ectd-dossier-preparation",
  label: "CTD / eCTD dossier preparation",
  crumbLabel: "CTD / eCTD dossier",
  metaTitle: "CTD / eCTD Dossier Preparation — Propharmex",
  metaDescription:
    "Module 2 and 3 authoring against ICH M4, with Regional Module 1 packaging to FDA, Health Canada or EMA current specifications. Lifecycle sequencing discipline end-to-end.",
  ogTitle: "CTD / eCTD Dossier Preparation — Propharmex",
  ogDescription:
    "Dossier authoring anchored on ICH M4 and on the release record — one authored core, repackaged per target agency.",
  hero: {
    eyebrow: "Regulatory Services · CTD / eCTD dossier preparation",
    headline:
      "One authored core. Regional Module 1 swapped per agency. Lifecycle sequenced end-to-end.",
    valueProp:
      "Module 2 and 3 authored against ICH M4, Regional Module 1 packaged to the target agency's current specification, submitted under lifecycle sequencing discipline.",
    lede: "The Common Technical Document, as defined by ICH M4, is the shared backbone — five modules, the same Module 2 summaries, the same Module 3 quality content. What changes between FDA, Health Canada and EMA submissions is Regional Module 1, the granularity conventions, and the eCTD technical specification against which the sequence is validated. The authoring posture is therefore to build the core once — against ICH M4 and against the release record — and package Regional Module 1 to the target agency. When a sponsor adds a second agency later, it is a packaging pass rather than a re-authoring project.",
    stats: [
      { label: "Modules we author", value: "Module 2 + Module 3" },
      { label: "Regional Module 1 formats", value: "FDA · Health Canada · EMA" },
      { label: "Format", value: "eCTD under ICH M4" },
    ],
    primaryCta: {
      label: "Scope a dossier engagement",
      href: "/contact?source=rs-ctd-hero-scope",
      variant: "primary",
    },
    secondaryCta: {
      label: "Book a 30-minute call",
      href: "/contact?source=rs-ctd-hero-call",
      variant: "outline",
    },
  },
  explainer: {
    eyebrow: "What the work covers",
    heading: "Three things worth getting straight before the first call",
    lede: "CTD work is often discussed at the module level without distinguishing the authored core from the regional packaging. The distinctions below are the ones that most often reshape a sponsor's plan once they are understood.",
    topics: [
      {
        id: "ich-m4-backbone",
        heading: "ICH M4 as the shared backbone",
        body: "Module 2 (summaries) and Module 3 (quality) are authored against ICH M4 and are largely portable across FDA, Health Canada, EMA and other ICH-aligned agencies. Module 4 (non-clinical) and Module 5 (clinical) are also ICH-aligned. The authored content in these modules is the expensive part of a dossier; treating it as a shared asset rather than a per-agency one is what lets a sponsor add jurisdictions without proportionally adding cost.",
        source: ICH_M4_ECTD,
      },
      {
        id: "regional-module-1",
        heading: "Why Regional Module 1 is different per agency",
        body: "Module 1 carries administrative information, application forms, and regional requirements that each agency sets independently. FDA Module 1 looks different from Health Canada Module 1, which looks different from EMA Module 1. Packaging Module 1 to the target agency's current specification is a distinct, technical step — forms, XML backbone, regional validation criteria. It is not an authoring project; it is a compliance-packaging project, and it has to be redone each time a submission is sequenced for a new agency.",
        source: HEALTH_CANADA_GUIDANCE_INDEX,
      },
      {
        id: "lifecycle-sequencing",
        heading: "Lifecycle sequencing as an authoring discipline",
        body: "An eCTD submission is not a single PDF bundle; it is a sequence. The original submission is sequence 0000; amendments, responses to information requests, and supplements are later sequences that reference the earlier ones. Granularity, hyperlinking and bookmarking choices made in sequence 0000 bind every later sequence. Building sequence 0000 against the target agency's technical specification — not against the last specification the team worked with — is what keeps the lifecycle coherent. It is also what keeps validation-at-gateway failures from surfacing on amendment sequences.",
        source: FDA_ECTD_TECH_SPECS,
      },
    ],
  },
  threePlDelCombo: {
    eyebrow: "Hyderabad authoring + Mississauga regulatory function",
    heading: "Where the work happens, and what a sponsor plugs into",
    lede: "CTD authoring happens in Hyderabad against ICH M4; Regional Module 1 packaging and the relationship to the underlying release record is anchored in Mississauga. The two columns below describe the operating split on this work.",
    leftColumn: {
      id: "hyderabad",
      heading: "What Hyderabad authors",
      bullets: [
        "Module 2 — Quality Overall Summary, and non-clinical and clinical overviews where the pathway includes them — authored against ICH M4",
        "Module 3 — drug substance (3.2.S) and drug product (3.2.P) CMC content authored against ICH M4 and the target agency's current CMC guidance",
        "eCTD backbone compilation — granularity decisions, hyperlinking, bookmarking, cross-references inside Module 3 and between Modules 2 and 3",
        "Regional Module 1 packaging passes against the FDA, Health Canada, or EMA current technical specification, authored from the shared core",
        "Lifecycle sequencing plans — original, amendments, supplements, annual reports — shaped at sequence 0000 so later sequences are additive rather than corrective",
      ],
    },
    rightColumn: {
      id: "mississauga",
      heading: "What Mississauga anchors",
      bullets: [
        "The release-testing and stability record referenced inside Module 3 — the same record used for lot release under the DEL",
        "A single QMS linking the authored dossier and the analytical raw data, so Module 3 claims are evidenced against data a reviewer can inspect",
        "Canadian regulatory agent posture for Health Canada submissions when the sponsor elects one",
        "Document control and change-control linkage between the dossier record and post-issuance activities",
        "Inspection-ready access to Module 3 source records on request from Health Canada or the FDA during review or pre-approval inspection",
      ],
    },
    closingNote:
      "Authored in Hyderabad, anchored in the Mississauga record — one dossier core, packaged per agency.",
  },
  timeline: {
    eyebrow: "Greenfield Module 2 + Module 3 authoring",
    heading: "From kickoff to eCTD-ready dossier",
    lede: "A typical greenfield Module 2 and Module 3 authoring engagement sits on roughly the cadence below. Durations are indicative and depend on the state of the analytical and stability record going in — when the underlying record is mature, the authoring blocks compress; when it is not, remediation work sits ahead of authoring rather than extending it.",
    serviceStandardCopy:
      "No agency publishes a service standard for the authoring phase itself — the standards belong to the post-submission review window (Health Canada 250 calendar days for a new DEL, FDA's GDUFA goals for ANDAs, EMA's own review clocks for MAAs), as of 2026-04-23. The cadence below is an authoring-side plan, not a regulatory promise.",
    steps: [
      {
        id: "scoping-and-gap-assessment",
        label: "Scoping and gap assessment",
        description:
          "Target agency confirmation, pathway decision confirmation, gap assessment across the analytical and stability record, authoring plan shaped to the sponsor's commercial horizon.",
        typicalDuration: "Typical: 15–30 days",
        owner: "propharmex",
      },
      {
        id: "module-3-drug-substance",
        label: "Module 3 — drug substance (3.2.S)",
        description:
          "Drug substance CMC authored against ICH M4, either as a DMF-referencing section or as a full substance section where the sponsor is the API-holder.",
        typicalDuration: "Typical: 30–60 days",
        owner: "propharmex",
        source: ICH_M4_ECTD,
      },
      {
        id: "module-3-drug-product",
        label: "Module 3 — drug product (3.2.P)",
        description:
          "Drug product CMC authored against ICH M4 and the target agency's current CMC guidance. Specification rationale, method validation references and stability sections built from the release record rather than re-authored for the dossier.",
        typicalDuration: "Typical: 45–90 days",
        owner: "propharmex",
      },
      {
        id: "module-2-summaries",
        label: "Module 2 summaries",
        description:
          "Quality Overall Summary authored against ICH M4 with precise cross-references to Module 3 sections. Non-clinical and clinical overviews compiled where the pathway requires them.",
        typicalDuration: "Typical: 30–45 days, overlapping Module 3 close",
        owner: "propharmex",
      },
      {
        id: "regional-module-1-packaging",
        label: "Regional Module 1 packaging",
        description:
          "Module 1 authored or compiled against the target agency's current specification — FDA, Health Canada, or EMA. Forms, regional requirements and XML backbone packaged per agency. A second agency is a repeat of this step, not the preceding ones.",
        typicalDuration: "Typical: 15–20 days per target agency",
        owner: "propharmex",
        source: EMA_ECTD_TECH,
      },
      {
        id: "ectd-validation-and-delivery",
        label: "eCTD validation and delivery",
        description:
          "Sequence compiled, hyperlinks and bookmarks validated, technical validation against the agency's current checks completed before gateway transmission. Delivered to the sponsor or filed via the sponsor's gateway access on request.",
        typicalDuration: "Typical: 10–15 days",
        owner: "propharmex",
        source: FDA_ECTD_TECH_SPECS,
      },
    ],
    source: ICH_M4_ECTD,
  },
  challenges: {
    eyebrow: "Common pitfalls we solve",
    heading: "What CTD / eCTD engagements actually run into",
    lede: "Five failure patterns show up on most dossier engagements. None of them are exotic; all of them are recoverable if surfaced early. Surfaced late, each of them compounds through every downstream sequence.",
    items: [
      {
        id: "granularity-drift",
        label: "Granularity chosen once, regretted forever",
        description:
          "Module 3 granularity decisions made at sequence 0000 without regard for how amendments and supplements will be built. Later sequences then have to work around awkward file boundaries rather than cleanly replacing earlier content.",
      },
      {
        id: "regional-drift",
        label: "Regional Module 1 drift between agencies",
        description:
          "A Module 1 packaged once for the FDA and copy-adapted for Health Canada or EMA without rebuilding against the current regional specification. Technical validation at the receiving agency's gateway catches this reliably; the time lost is at the worst possible point in the plan.",
      },
      {
        id: "module-3-to-record-drift",
        label: "Module 3 content drifting from the underlying record",
        description:
          "Specifications, methods, or stability data stated in Module 3 that do not match the release record six months later. Usually the result of authoring from a snapshot rather than from the live QMS. The fix is to author from the record, not from a copy of it.",
      },
      {
        id: "qos-summary-gap",
        label: "Quality Overall Summary written from a template rather than from Module 3",
        description:
          "A QOS that reads cleanly but does not cross-reference the Module 3 sections it is summarizing. Reviewers notice; the information-request cycle then costs more than writing the QOS properly would have.",
      },
      {
        id: "lifecycle-sequencing-afterthought",
        label: "Lifecycle sequencing treated as a post-submission concern",
        description:
          "Teams that plan sequence 0000 without planning sequences 0001 onwards. The granularity, hyperlinking and bookmarking standard has to be designed at the start — the first amendment is where a weak standard starts costing review time.",
      },
    ],
  },
  readinessEmbed: {
    eyebrow: "Dossier readiness view",
    heading: "A self-check on the dossier readiness axes",
    body: "Before committing an authoring window, a short readiness view across the analytical and stability record, the granularity plan, the regional Module 1 choices, and the lifecycle sequencing intent usually surfaces the two or three items that actually drive timeline. The review is informational — it produces a working document for the first call, not a go/no-go.",
    shippingCopy:
      "Live with Prompt 20 of the website rebuild. A preview of the readiness axes is available now — the interactive tool ships with the AI tools phase.",
    previewCta: {
      label: "Preview the dossier-readiness axes",
      href: "/contact?source=rs-ctd-readiness-preview",
      variant: "outline",
    },
  },
  caseStudyFeature: {
    eyebrow: "Pattern of work",
    heading: "Shared Module 2/3 core, three regional packagings",
    body: "A pattern we see often: a sponsor pursuing the same finished product across FDA, Health Canada and EMA on a staggered timeline. Hyderabad authors Module 2 and Module 3 against ICH M4 once; Regional Module 1 is packaged for FDA at sequence 0000, repackaged for Health Canada six months later, and repackaged for EMA after that. The analytical and stability record in Module 3 is anchored in Mississauga under the DEL; the same record is referenced by all three regional submissions.",
    status: "under-confirmation",
    cta: {
      label: "Ask for the NDA-gated case file",
      href: "/contact?source=rs-ctd-case-study",
      variant: "outline",
    },
  },
  checklistDownload: {
    eyebrow: "Dossier readiness checklist",
    heading: "A pre-authoring checklist, on request",
    lede: "A structured readiness checklist authored by Propharmex's regulatory team against ICH M4 and the FDA, Health Canada and EMA current eCTD technical specifications. It covers the six pre-authoring domains most likely to surface as issues during review or gateway validation. Sent on request so we can scope the covering note to your programme.",
    bullets: [
      "Analytical record — method validation status, method-transfer evidence, system suitability history under ICH Q2(R2)",
      "Stability record — ICH Q1A(R2) coverage and extrapolation posture for the claimed shelf-life",
      "Drug substance — DMF scope if third-party, full-section posture if sponsor-held",
      "Drug product — specification rationale, formulation development record, in-use stability as applicable",
      "Regional packaging plan — which agencies are in scope now, which are in scope later, and which Module 1 specifications are current",
      "Lifecycle sequencing plan — granularity, hyperlinking and bookmarking standards carried forward from sequence 0000",
    ],
    cta: {
      label: "Request the full dossier readiness checklist",
      href: "/contact?source=rs-ctd-checklist",
      variant: "primary",
    },
    disclaimer:
      "Checklist is authored by Propharmex's regulatory team in alignment with ICH M4 and the target agencies' current eCTD technical specifications, as of 2026-04-23. It is informational; each agency's review of your complete submission is what decides acceptance.",
  },
  faq: {
    eyebrow: "Frequently asked",
    heading: "Six questions we get on almost every first call",
    lede: "Short, regulatorily precise answers. Longer conversations are a call away — the answers below are the ones it is faster to read than to ask.",
    items: [
      {
        id: "module-1-differences",
        question: "How different are the Regional Module 1 formats across agencies?",
        answer:
          "Different enough that a Module 1 packaged for one agency cannot be used for another. FDA's regional specification, Health Canada's regional Module 1, and EMA's regional Module 1 each define their own forms, administrative attachments and XML backbone. The Module 2 and Module 3 content authored against ICH M4 is largely portable; Module 1 is not. Plan each agency's Module 1 as a discrete packaging pass against that agency's current technical specification.",
      },
      {
        id: "granularity-decision",
        question: "How do we decide granularity at sequence 0000?",
        answer:
          "The granularity decision is driven by how the dossier will be amended, not by how it will be filed. Finer granularity makes it easier to replace a single section in a later sequence; coarser granularity makes sequence 0000 simpler but every amendment heavier. Our working default is granularity fine enough that a typical CMC amendment replaces one or two files rather than a whole section. We set the granularity standard before authoring starts so the authored content matches it.",
      },
      {
        id: "licence-vs-license",
        question: "Which spelling do you use inside the dossier?",
        answer:
          "Inside a Health Canada submission, we use the Canadian spelling \"licence\" where the regulation uses it. Inside an FDA submission, we use the US spelling \"license\" where 21 CFR text uses it — the authored content should not diverge from the regulatory framework it is filed against. We do not mix the two inside a single paragraph. On this site, and in Canadian-context prose, the default is \"licence\".",
      },
      {
        id: "ich-m4-vs-agency-guidance",
        question: "When ICH M4 and an agency's CMC guidance disagree, what wins?",
        answer:
          "The agency's guidance, for a submission to that agency. ICH M4 is the structural backbone; each ICH-aligned agency issues its own CMC guidance on top. Where FDA CMC guidance is more specific than ICH M4, we author to FDA guidance for an FDA submission. The same Module 3 can usually be adjusted for Health Canada or EMA at the regional packaging step without restructuring — the agency-specific choices show up as content, not as structure.",
      },
      {
        id: "reusing-the-dossier",
        question: "Can the same Module 2 and 3 be reused across agencies?",
        answer:
          "Largely yes, with targeted content revisions where the target agency's CMC guidance requires them. The structure is shared (ICH M4); the bulk of the content is shared; the per-agency revisions are usually specification rationale, regional stability conditions where they differ from ICH Q1A(R2) zones, and regional device-specific sections where applicable. Regional Module 1 is always a separate packaging pass.",
      },
      {
        id: "lifecycle-amendments",
        question: "What happens to the dossier after the original submission?",
        answer:
          "Each amendment, response to information request, supplement, or annual report is a later eCTD sequence referencing the earlier ones. The granularity standard set at sequence 0000 carries through. We build the lifecycle sequencing plan at the start so the first amendment is an additive step rather than a rework project — and so the record a reviewer opens on amendment three is continuous with the record they accepted at sequence 0000.",
      },
    ],
  },
  related: {
    eyebrow: "Related services",
    heading: "Where CTD / eCTD work connects to the rest of the site",
    lede: "Three adjacent pages are worth reading alongside this one — the FDA submission shape that most often uses this authoring work, the analytical record that feeds Module 3, and the post-acceptance lifecycle work that runs on top of the same sequence backbone.",
    links: [
      {
        id: "us-fda-submissions",
        label: "US FDA submissions",
        description:
          "ANDA, 505(b)(2) and Type II DMF authoring work that uses this CTD backbone — packaged with FDA Regional Module 1 and delivered via the ESG.",
        href: "/services/regulatory-services/us-fda-submissions",
      },
      {
        id: "analytical-services",
        label: "Analytical Services",
        description:
          "The method-validation and release-testing record Module 3 references — authored in Hyderabad, released from Mississauga under the DEL.",
        href: "/services/analytical-services",
      },
      {
        id: "lifecycle",
        label: "Lifecycle regulatory management",
        description:
          "Post-acceptance amendments, supplements and annual reports that run on the same eCTD sequence backbone the original submission established.",
        href: "/services/regulatory-services/lifecycle-regulatory-management",
      },
    ],
  },
  closing: {
    eyebrow: "Next step",
    heading: "Bring the target agency. We'll bring the authoring.",
    body: "A first call on dossier work usually resolves three questions quickly: which agencies are in scope now and which are in scope later; is the analytical and stability record mature enough to anchor Module 3; and is the granularity and lifecycle sequencing plan something we are setting now or inheriting. Bring the current state, including the gaps. We scope from there.",
    primaryCta: {
      label: "Scope a dossier engagement",
      href: "/contact?source=rs-ctd-closing-scope",
      variant: "primary",
    },
    secondaryCta: {
      label: "Book a 30-minute call",
      href: "/contact?source=rs-ctd-closing-call",
      variant: "outline",
    },
    regulatoryNote: ICH_M4_ECTD,
  },
};

/* -------------------------------------------------------------------------- */
/*  GMP audit preparation leaf                                                */
/* -------------------------------------------------------------------------- */

export const REGULATORY_GMP_AUDIT_PREPARATION: RegulatoryLeafContent = {
  slug: "gmp-audit-preparation",
  label: "GMP audit preparation",
  crumbLabel: "GMP audit preparation",
  metaTitle: "GMP Audit Preparation — Propharmex",
  metaDescription:
    "Pre-inspection readiness for Health Canada and USFDA cGMP inspections — gap assessment, mock inspection coverage, CAPA shaping and post-inspection response work in alignment with GUI-0001, 21 CFR Parts 210/211, and ICH Q10.",
  ogTitle: "GMP Audit Preparation — Propharmex",
  ogDescription:
    "Inspection-ready on a standing cadence, not bolted on ahead of a scheduled visit. GUI-0001, 21 CFR 210/211, ICH Q10 and Q9(R1).",
  hero: {
    eyebrow: "Regulatory Services · GMP audit preparation",
    headline:
      "Inspection-ready continuously — not bolted on ahead of a scheduled visit.",
    valueProp:
      "Inspection-ready continuously — gap assessment, mock inspection coverage, and CAPA shaping run on a standing cadence, not bolted on ahead of a scheduled visit.",
    lede: "The posture we work from is simple: a site that is inspection-ready on a standing cadence meets a Health Canada or USFDA inspection as one more day of operating the QMS. A site that is inspection-ready only ahead of a scheduled visit meets the same inspection as an event. The difference shows up in the record a reviewer opens — continuous versus assembled — and in the quality of the observations issued. This page describes the pre-inspection, inspection-day and post-inspection work we run in alignment with Health Canada GUI-0001, 21 CFR Parts 210 and 211, ICH Q10 and ICH Q9(R1).",
    stats: [
      { label: "Regulatory frame", value: "GUI-0001 · 21 CFR 210/211" },
      { label: "QMS anchor", value: "ICH Q10 · Q9(R1)" },
      { label: "Cadence", value: "Standing readiness, not event-driven" },
    ],
    primaryCta: {
      label: "Scope an inspection-readiness engagement",
      href: "/contact?source=rs-gmp-hero-scope",
      variant: "primary",
    },
    secondaryCta: {
      label: "Book a 30-minute call",
      href: "/contact?source=rs-gmp-hero-call",
      variant: "outline",
    },
  },
  explainer: {
    eyebrow: "What the work covers",
    heading: "Three things worth getting straight before the first call",
    lede: "Inspection-readiness work is often reduced to a \"mock audit\" week. That framing underserves the work. The distinctions below are the ones that most often reshape a sponsor's plan once they are understood.",
    topics: [
      {
        id: "mock-inspection-not-audit",
        heading: "Mock inspection, not mock audit",
        body: "Internal GMP audits are a QMS obligation under ICH Q10 — sites run them on a published schedule regardless of external inspection activity. A mock inspection is different: it simulates the posture, cadence and observation shape of a Health Canada or USFDA inspection. The vocabulary matters because the two activities generate different records. We run mock inspections as discrete exercises, documented separately from the routine internal-audit programme, so the site's observation trail stays clean.",
        source: HEALTH_CANADA_GUI_0001,
      },
      {
        id: "gap-assessment-vs-capa",
        heading: "Gap assessment versus CAPA shaping",
        body: "A gap assessment identifies distance between current state and the regulatory framework — GUI-0001 for Canadian inspections, 21 CFR 210/211 for US inspections, and ICH Q10 for the underlying QMS. CAPA shaping is the next step: turning each gap into a corrective-and-preventive-action record that closes on evidence rather than on assertion. The two are sequential, not interchangeable. A gap assessment without CAPA shaping produces a list; a CAPA programme without gap assessment produces motion without direction.",
        source: CFR_PART_211,
      },
      {
        id: "risk-based-posture",
        heading: "Risk management as the underlying posture",
        body: "Inspection-readiness work is risk-weighted against ICH Q9(R1). Not every gap is equal; not every observation risk is equal. Prioritization is explicit and documented — which procedures are most likely to be examined, which records carry the highest data-integrity exposure, and which product-quality risks would most concern an inspector. That risk register is the document a reviewer reads first; the rest of the QMS is what the risk register pushes against.",
        source: ICH_QUALITY_GUIDELINES,
      },
    ],
  },
  threePlDelCombo: {
    eyebrow: "Hyderabad documentation + Mississauga inspection hosting",
    heading: "Where the work happens, and what a site plugs into",
    lede: "GMP audit preparation runs across both hubs. Hyderabad supports documentation shaping, CAPA authoring and training materials; Mississauga hosts Canadian inspections directly under the DEL and runs on-site mock inspection coverage. The two columns below describe the operating split.",
    leftColumn: {
      id: "hyderabad",
      heading: "What Hyderabad supports",
      bullets: [
        "Documentation gap assessment against GUI-0001, 21 CFR 210/211 and ICH Q10 — SOP inventory, deviation records, change control, and CAPA record architecture",
        "CAPA authoring and closure-evidence shaping — root-cause analysis methodology, effectiveness-check design, and documentation trails",
        "Training-matrix gap analysis and role-scoped competency record review",
        "Risk register authored against ICH Q9(R1), weighted to inspection likelihood and data-integrity exposure",
        "Post-inspection response drafting — Health Canada observation responses and Form 483 responses against the raw observation text",
      ],
    },
    rightColumn: {
      id: "mississauga",
      heading: "What Mississauga runs",
      bullets: [
        "On-site mock inspection coverage — opening meetings, document-handling simulation, floor walkthroughs, raw-data access drills",
        "Hosting Health Canada inspections under the DEL — opening and closing meetings, escort discipline, and inspector access coordination",
        "Inspection-day coaching — SME response posture, scope-defence discipline, and when to commit to a CAPA versus seek clarification",
        "Environmental monitoring, utility qualification and equipment IOQ/PQ evidence held inspection-ready continuously",
        "Live QMS access — a reviewer opens the same system the site operates from, not an assembled inspection binder",
      ],
    },
    closingNote:
      "Documentation shaped in Hyderabad, inspections hosted in Mississauga — one QMS record across both.",
  },
  timeline: {
    eyebrow: "90-day pre-inspection readiness engagement",
    heading: "From scoping to inspection-ready posture",
    lede: "A typical 90-day pre-inspection readiness engagement sits on roughly the cadence below. Durations are indicative and depend on the state of the QMS going in — standing readiness work on an existing relationship compresses this significantly; greenfield inspection preparation typically needs more than 90 days.",
    serviceStandardCopy:
      "Neither Health Canada nor the FDA publishes a service standard for pre-inspection readiness — the standards belong to the inspection itself and to post-inspection observation response windows. Health Canada's post-inspection response expectations and FDA's Form 483 response window (15 business days for acknowledgment is the conventional posture, as of 2026-04-23) apply after the inspection, not before it. The cadence below is an engagement plan, not a regulatory promise.",
    steps: [
      {
        id: "scoping-and-risk-register",
        label: "Scoping and risk register",
        description:
          "Target agency confirmation (Health Canada inspection expected, USFDA PAI, routine cGMP, or both), site scope confirmation, and authoring of the ICH Q9(R1)-aligned risk register that prioritizes the rest of the work.",
        typicalDuration: "Typical: 5–10 days",
        owner: "propharmex",
        source: ICH_QUALITY_GUIDELINES,
      },
      {
        id: "gap-assessment",
        label: "Gap assessment",
        description:
          "Documented gap assessment against GUI-0001 for Canadian-targeted inspections, 21 CFR 210/211 for US-targeted inspections, and ICH Q10 for the underlying QMS. Output is a prioritized gap list, not a flat inventory.",
        typicalDuration: "Typical: 15–20 days",
        owner: "propharmex",
        source: HEALTH_CANADA_GUI_0001,
      },
      {
        id: "capa-shaping",
        label: "CAPA shaping and closure evidence",
        description:
          "Prioritized gaps moved into CAPAs with documented root-cause analysis, corrective-action design, preventive-action design, and effectiveness-check plans. Closure evidence built as the CAPA closes, not assembled at the end.",
        typicalDuration: "Typical: 30–45 days, overlapping later steps",
        owner: "propharmex",
      },
      {
        id: "mock-inspection",
        label: "Mock inspection",
        description:
          "Simulated inspection on-site — opening meeting, document-handling drill, floor walkthrough, raw-data access simulation, closing meeting with classified observations. Documented separately from the routine internal-audit programme so the site's audit trail stays clean.",
        typicalDuration: "Typical: 3–5 days on-site",
        owner: "both",
      },
      {
        id: "mock-findings-remediation",
        label: "Mock-findings remediation",
        description:
          "Observations from the mock inspection remediated through the CAPA system. Effectiveness checks run before the actual inspection window opens where timing allows.",
        typicalDuration: "Typical: 15–25 days",
        owner: "propharmex",
      },
      {
        id: "inspection-day-coaching",
        label: "Inspection-day coaching and hosting",
        description:
          "SME briefings on response posture, scope-defence discipline, and raw-data access protocols. On Canadian inspections, Mississauga hosts directly under the DEL; on US inspections, coaching is provided to the site team.",
        typicalDuration: "As scheduled by the agency",
        owner: "both",
      },
    ],
    source: HEALTH_CANADA_GUI_0001,
  },
  challenges: {
    eyebrow: "Common pitfalls we solve",
    heading: "What inspections actually run into",
    lede: "Five failure patterns show up on most pre-inspection engagements. None of them are exotic; all of them are recoverable if surfaced early. Surfaced late, each of them shifts the inspection outcome by at least one observation category.",
    items: [
      {
        id: "data-integrity-surface",
        label: "Data-integrity surface underestimated",
        description:
          "Sites confident on their procedural record but weak on ALCOA+ posture in electronic systems — audit trails, user-access controls, and system-clock settings. Data-integrity observations are the most consequential; the fix is architectural, not procedural.",
      },
      {
        id: "capa-closed-on-assertion",
        label: "CAPAs closed on assertion rather than evidence",
        description:
          "Corrective actions documented as complete without the effectiveness-check evidence that closure requires. A reviewer opening the CAPA record sees a closed status and an empty evidence trail — the outcome is a repeat observation on the same underlying issue.",
      },
      {
        id: "technical-agreements-stale",
        label: "Technical agreements out of date with current scope",
        description:
          "Inter-company and third-party technical agreements that do not reflect the site's current activity scope. Inspectors read these; stale or absent agreements generate observations on oversight responsibility rather than on the activity itself.",
      },
      {
        id: "sme-response-discipline",
        label: "SME response discipline untrained",
        description:
          "Subject-matter experts who answer beyond the scope of the question, commit to CAPAs in the moment, or rehearse answers rather than reference the record. Inspection-day coaching is usually the highest-leverage work in the engagement.",
      },
      {
        id: "post-inspection-response-drift",
        label: "Post-inspection response authored under time pressure",
        description:
          "Form 483 or Canadian observation responses drafted against the deadline rather than against the record. Responses that commit to CAPAs without scoping them reliably generate the next inspection cycle's observations. The response should extend the CAPA system, not improvise around it.",
      },
    ],
  },
  readinessEmbed: {
    eyebrow: "Inspection-readiness view",
    heading: "A self-check on the readiness axes",
    body: "Before scheduling a mock inspection, a short readiness view across the QMS maturity, data-integrity posture, CAPA-closure evidence quality, and inspection-host discipline usually surfaces the two or three items that actually drive the mock-inspection observation count. The review is informational — it produces a working document for the first call, not a go/no-go.",
    shippingCopy:
      "Live with Prompt 20 of the website rebuild. A preview of the readiness axes is available now — the interactive tool ships with the AI tools phase.",
    previewCta: {
      label: "Preview the inspection-readiness axes",
      href: "/contact?source=rs-gmp-readiness-preview",
      variant: "outline",
    },
  },
  caseStudyFeature: {
    eyebrow: "Pattern of work",
    heading: "Pre-inspection readiness for an FDA pre-approval inspection",
    body: "A pattern we see often: a sponsor-owned manufacturing site expecting an FDA pre-approval inspection against a pending ANDA, with 90 to 120 days of runway. Hyderabad supports documentation gap assessment and CAPA shaping against 21 CFR 210/211 and ICH Q10; Mississauga runs on-site mock inspection coverage and SME response coaching. Observations from the mock inspection close before the FDA window opens. The inspection itself is hosted by the sponsor's site team; we stand down for the duration and re-engage only for post-inspection response support.",
    status: "under-confirmation",
    cta: {
      label: "Ask for the NDA-gated case file",
      href: "/contact?source=rs-gmp-case-study",
      variant: "outline",
    },
  },
  checklistDownload: {
    eyebrow: "Inspection-readiness checklist",
    heading: "A pre-inspection checklist, on request",
    lede: "A structured readiness checklist authored by Propharmex's regulatory team against Health Canada GUI-0001, 21 CFR Parts 210 and 211, ICH Q10 and ICH Q9(R1). It covers the six domains most likely to generate observations during a cGMP inspection. Sent on request so we can scope the covering note to your site.",
    bullets: [
      "QMS maturity — procedures, deviations, change control and CAPA record architecture against ICH Q10",
      "Data integrity — ALCOA+ posture across electronic systems, audit-trail review, and user-access control",
      "Risk register — ICH Q9(R1)-aligned register, weighted to inspection likelihood and product-quality exposure",
      "Technical agreements — inter-company and third-party agreements covering current activity scope",
      "Training and competency — role-scoped training matrix and SME inspection-response discipline",
      "Inspection hosting — opening-meeting discipline, document-handling protocol, and raw-data access readiness",
    ],
    cta: {
      label: "Request the full inspection-readiness checklist",
      href: "/contact?source=rs-gmp-checklist",
      variant: "primary",
    },
    disclaimer:
      "Checklist is authored by Propharmex's regulatory team in alignment with GUI-0001, 21 CFR Parts 210 and 211, ICH Q10 and ICH Q9(R1), as of 2026-04-23. It is informational; the agency's inspection outcome is decided by the inspection itself, not by pre-inspection preparation alone.",
  },
  faq: {
    eyebrow: "Frequently asked",
    heading: "Six questions we get on almost every first call",
    lede: "Short, regulatorily precise answers. Longer conversations are a call away — the answers below are the ones it is faster to read than to ask.",
    items: [
      {
        id: "mock-inspection-vs-audit",
        question: "What is the difference between a mock inspection and our internal audit?",
        answer:
          "Internal GMP audits are a QMS obligation under ICH Q10 — they run on a published schedule regardless of external inspection activity and feed the site's routine CAPA record. A mock inspection simulates the posture and observation shape of a Health Canada or USFDA inspection, is documented separately from the routine audit programme, and closes with classified observations that mirror the way a real inspection would classify them. Both are useful; they are not interchangeable, and they generate different records.",
      },
      {
        id: "483-response-window",
        question: "What is the response window for a Form 483 or a Canadian observation letter?",
        answer:
          "For FDA Form 483 observations, the conventional posture is an acknowledgment response within 15 business days of receipt, followed by the CAPA record as commitments close — as of 2026-04-23. For Health Canada inspections, response expectations are communicated in the inspection report; the standing principle is that responses should address the observation, commit to corrective actions with defined timelines, and evidence closure as the CAPA completes. We draft responses against the raw observation text, not against a summary of it.",
      },
      {
        id: "license-vs-licence",
        question: "Which spelling do you use in inspection documents?",
        answer:
          "In Canadian inspection documents — the DEL, Health Canada responses, GUI-0001-aligned procedures — we use the Canadian spelling \"licence\" where the regulation uses it. In US inspection responses and 21 CFR-aligned documents, we use the US spelling \"license\" where 21 CFR text uses it. We do not mix the two inside a single document. On this site and in Canadian-context prose, the default is \"licence\".",
      },
      {
        id: "mra-reuse",
        question: "Can an FDA cGMP inspection outcome reduce our Health Canada scope?",
        answer:
          "Partly. Canada and the US participate in Mutual Recognition Agreements for GMP inspections of certain product categories, and Health Canada may consider FDA inspection outcomes as part of its evaluation. That is not the same as Health Canada waiving its own inspection — a Canadian inspection may still occur regardless of a prior US outcome. Plan for a Canadian inspection; take credit for FDA outcomes where the framework allows.",
      },
      {
        id: "data-integrity-focus",
        question: "How do you approach data-integrity readiness?",
        answer:
          "Data-integrity readiness sits on ALCOA+ principles — attributable, legible, contemporaneous, original, accurate, complete, consistent, enduring and available. The posture starts with system architecture (audit trails enabled and reviewed, user-access controls, system-clock settings, time-stamp integrity) and extends into procedural practice (contemporaneous recording, raw-data retention, second-person review). We audit both in the mock inspection; observations in this space are the most consequential during an inspection and benefit most from early remediation.",
      },
      {
        id: "post-inspection-support",
        question: "Do you stay engaged after the inspection?",
        answer:
          "Yes — the most common post-inspection engagement shape is observation-response drafting in the first two weeks, CAPA shaping in the weeks after, and a standing follow-up cadence until the agency closes out the inspection. We do not author responses that commit to CAPAs we cannot evidence; the CAPA record has to extend the QMS rather than promise to. That discipline matters more in the response phase than in any other part of the engagement.",
      },
    ],
  },
  related: {
    eyebrow: "Related services",
    heading: "Where inspection readiness connects to the rest of the site",
    lede: "Three adjacent pages are worth reading alongside this one — the DEL the Mississauga inspections run against, the quality system the readiness work is anchored in, and the lifecycle work that follows an inspection.",
    links: [
      {
        id: "del-licensing",
        label: "Health Canada DEL licensing",
        description:
          "The DEL that Mississauga inspections are conducted under — pre-issuance inspection readiness and post-issuance inspection continuity.",
        href: "/services/regulatory-services/health-canada-del-licensing",
      },
      {
        id: "quality-compliance",
        label: "Quality & Compliance",
        description:
          "The QMS posture the readiness work is anchored in — ICH Q10 alignment, ALCOA+ data integrity, and the three-tier claim-status convention.",
        href: "/quality-compliance",
      },
      {
        id: "lifecycle",
        label: "Lifecycle regulatory management",
        description:
          "Post-inspection CAPA closure, DEL amendments driven by inspection commitments, and continuous change control across the site's operating life.",
        href: "/services/regulatory-services/lifecycle-regulatory-management",
      },
    ],
  },
  closing: {
    eyebrow: "Next step",
    heading: "Start with the QMS you have — not the one you wish you had.",
    body: "A first call on inspection readiness usually resolves three questions quickly: which agency is expected and on what horizon; what is the state of the data-integrity posture today; and is the engagement greenfield or an extension of a standing readiness cadence. Bring the current state, including the gaps. We scope from there.",
    primaryCta: {
      label: "Scope an inspection-readiness engagement",
      href: "/contact?source=rs-gmp-closing-scope",
      variant: "primary",
    },
    secondaryCta: {
      label: "Book a 30-minute call",
      href: "/contact?source=rs-gmp-closing-call",
      variant: "outline",
    },
    regulatoryNote: HEALTH_CANADA_GUI_0001,
  },
};

/* -------------------------------------------------------------------------- */
/*  Lifecycle regulatory management leaf                                      */
/* -------------------------------------------------------------------------- */

export const REGULATORY_LIFECYCLE_MANAGEMENT: RegulatoryLeafContent = {
  slug: "lifecycle-regulatory-management",
  label: "Lifecycle regulatory management",
  crumbLabel: "Lifecycle management",
  metaTitle: "Lifecycle Regulatory Management — Propharmex",
  metaDescription:
    "DEL amendments, annual DEL review, Post-NOC change management for Canada, and 21 CFR 314.70 supplement categorization for the US — anchored on ICH Q12 lifecycle principles.",
  ogTitle: "Lifecycle Regulatory Management — Propharmex",
  ogDescription:
    "Post-issuance change management across DEL amendments, Canadian Post-NOC changes, and US supplement categorization — without rebuilding the underlying record.",
  hero: {
    eyebrow: "Regulatory Services · Lifecycle regulatory management",
    headline:
      "Change management that extends the record — without rebuilding it.",
    valueProp:
      "Post-issuance change management across DEL amendments, Canadian Post-NOC changes, and US supplement categorization — without rebuilding the underlying record.",
    lede: "Most of a product's regulatory life sits after the original authorization. Site changes, specification changes, formulation changes, manufacturing-site additions, equipment swaps, supplier changes — each has to be categorized against the right framework, filed under the right instrument, and linked back to the underlying development and release record. The lifecycle posture we work from is that every post-issuance change extends the authored record rather than replacing it. Done well, a reviewer opening the sequence-4 amendment sees a record continuous with sequence-0 original. Done poorly, they see a different dossier with the same product name on it.",
    stats: [
      { label: "Canadian instruments", value: "DEL amendments · Post-NOC changes" },
      { label: "US instruments", value: "CBE-0 · CBE-30 · PAS · annual report" },
      { label: "Lifecycle frame", value: "ICH Q12 · GUI-0002" },
    ],
    primaryCta: {
      label: "Scope a lifecycle engagement",
      href: "/contact?source=rs-lifecycle-hero-scope",
      variant: "primary",
    },
    secondaryCta: {
      label: "Book a 30-minute call",
      href: "/contact?source=rs-lifecycle-hero-call",
      variant: "outline",
    },
  },
  explainer: {
    eyebrow: "What the work covers",
    heading: "Three things worth getting straight before the first call",
    lede: "Lifecycle regulatory work is often discussed as a set of filings without naming the categorization logic underneath them. The distinctions below are the ones that most often reshape a sponsor's plan once they are understood.",
    topics: [
      {
        id: "del-amendments",
        heading: "DEL amendments and annual licence review",
        body: "A Drug Establishment Licence is a live instrument. Adding an activity, adding a dosage-form category, adding a foreign building to the scope, or changing a key personnel record requires a DEL amendment under GUI-0002. Some changes are notifiable after the fact; others require Health Canada's prior approval. Annual licence review is a separate, scheduled obligation — the licence is reviewed on its anniversary and fees are reassessed against the scope in effect on that date. We build the change-control posture for amendments at the original application stage so the first amendment is an administrative step rather than a rework project.",
        source: HEALTH_CANADA_GUI_0002,
      },
      {
        id: "post-noc-changes",
        heading: "Post-NOC changes for Canada",
        body: "Product-level changes after a Notice of Compliance are categorized under Health Canada's Post-NOC Changes framework into Level I (prior-approval supplement required), Level II (notifiable change), Level III (record in annual notification), and Level IV (internal record). Correct categorization at the change-scoping stage is the highest-leverage decision in the engagement — Level I carries a review clock and a data burden that Level II does not, and Level III commitments that should have been Level II reliably generate follow-up questions at the next annual notification.",
        source: HEALTH_CANADA_POST_NOC,
      },
      {
        id: "us-supplement-categorization",
        heading: "US supplement categorization under 21 CFR 314.70",
        body: "Post-approval changes in the US are categorized under 21 CFR 314.70 as Prior Approval Supplement (PAS), Changes Being Effected in 30 days (CBE-30), Changes Being Effected (CBE-0), or annual report. The categorization is driven by the potential for the change to have an adverse effect on product quality — the sponsor's categorization decision is reviewable by FDA after the fact, and a change categorized down from PAS to CBE-30 that should have been a PAS is one of the standard failure modes. We categorize against 21 CFR 314.70 and current FDA guidance rather than against precedent from other programmes.",
        source: CFR_314_70_SUPPLEMENTS,
      },
    ],
  },
  threePlDelCombo: {
    eyebrow: "Hyderabad authoring + Mississauga regulatory function",
    heading: "Where the work happens, and what a sponsor plugs into",
    lede: "Lifecycle work runs across both hubs. Hyderabad authors the supporting CMC and amendment text; Mississauga files DEL amendments as the Canadian regulatory function and coordinates Post-NOC change submissions. The two columns below describe the operating split.",
    leftColumn: {
      id: "hyderabad",
      heading: "What Hyderabad authors",
      bullets: [
        "Change-categorization assessments against the Post-NOC Changes framework for Canada and 21 CFR 314.70 for the US",
        "Supporting CMC packages drawn from the development record — not re-authored for the amendment, but extended from what was already filed",
        "Amendment sequences as later eCTD entries referencing the original submission, preserving granularity and lifecycle discipline",
        "ICH Q12-aligned lifecycle management tools where they are in scope — established conditions, post-approval change management protocols",
        "Annual reports and annual notifications consolidating the year's activity against the authorization",
      ],
    },
    rightColumn: {
      id: "mississauga",
      heading: "What Mississauga anchors",
      bullets: [
        "DEL amendment filings under GUI-0002 — activity-scope additions, dosage-form category additions, foreign-building additions, key personnel changes",
        "Annual DEL review handling, fee reassessment and scope reconciliation with Health Canada on the licence anniversary",
        "Canadian regulatory point-of-contact for Post-NOC submissions and for Health Canada follow-up on any lifecycle filing",
        "Change-control linkage between the authored amendment and the underlying QMS records — the amendment is not complete until the site operating record reflects it",
        "Adjacent inspection-readiness coverage on changes that affect the DEL scope — some DEL amendments trigger an inspection window",
      ],
    },
    closingNote:
      "Authored in Hyderabad, filed from Mississauga — one record, extended across the product's life.",
  },
  timeline: {
    eyebrow: "Lifecycle cadences",
    heading: "Typical cadences for post-issuance work",
    lede: "Lifecycle work does not sit on a single timeline — it sits on several overlapping ones. The cadences below are the ones most often in scope on the engagements we run. Durations are indicative; agency service standards apply only where named.",
    serviceStandardCopy:
      "Health Canada's Post-NOC Changes framework sets categorization expectations and filing windows rather than a single service standard; FDA's 21 CFR 314.70 sets supplement types with their own review clocks (PAS subject to GDUFA goals, CBE-30 by name a 30-day pre-distribution window, CBE-0 effective on submission, annual reports reviewed at cycle), as of 2026-04-23. The cadence below is a planning cadence for the Propharmex-owned authoring and filing work.",
    steps: [
      {
        id: "del-annual-review",
        label: "Annual DEL review",
        description:
          "Reconciliation of the licence scope against the site's actual operating scope, fee reassessment with Health Canada, and filing of any pending amendments as part of the annual review posture.",
        typicalDuration: "Cadence: once per licence year on the anniversary",
        owner: "propharmex",
        source: HEALTH_CANADA_GUI_0002,
      },
      {
        id: "del-amendment-filing",
        label: "DEL amendment filing",
        description:
          "Activity-scope or dosage-form category additions, foreign-building additions, or key personnel changes filed under GUI-0002. Some amendments carry their own service standard and inspection-readiness expectations.",
        typicalDuration: "Typical authoring window: 20–45 days; Health Canada review per GUI-0002",
        owner: "propharmex",
      },
      {
        id: "post-noc-level-i",
        label: "Post-NOC Level I — prior-approval supplement",
        description:
          "Product-level changes with the highest quality risk — new manufacturing site for a drug substance or drug product, major specification changes, significant formulation changes. Filed as a supplement requiring Health Canada approval before implementation.",
        typicalDuration: "Authoring: 45–90 days; Health Canada review per framework",
        owner: "propharmex",
        source: HEALTH_CANADA_POST_NOC,
      },
      {
        id: "post-noc-level-ii",
        label: "Post-NOC Level II — notifiable change",
        description:
          "Medium-risk changes notified to Health Canada with supporting data. Implementation can proceed under the filing terms; Health Canada may request further information.",
        typicalDuration: "Authoring: 20–45 days",
        owner: "propharmex",
      },
      {
        id: "us-pas-cbe",
        label: "US supplements — PAS, CBE-30, CBE-0",
        description:
          "Change categorized under 21 CFR 314.70 and filed as the appropriate supplement type. Prior Approval Supplements carry GDUFA review goals; CBE-30 supplements allow distribution 30 days post-submission; CBE-0 supplements are effective on submission.",
        typicalDuration: "Authoring: 20–60 days depending on category",
        owner: "propharmex",
        source: CFR_314_70_SUPPLEMENTS,
      },
      {
        id: "annual-reports",
        label: "Annual reports and annual notifications",
        description:
          "Consolidation of year-over-year changes that did not warrant their own supplement at the time — Level III/IV for Canada, annual report items for the US. Authored from the QMS change record rather than assembled at year-end.",
        typicalDuration: "Cadence: annual, per authorization anniversary",
        owner: "propharmex",
      },
    ],
    source: HEALTH_CANADA_POST_NOC,
  },
  challenges: {
    eyebrow: "Common pitfalls we solve",
    heading: "What lifecycle work actually runs into",
    lede: "Five failure patterns show up on most post-issuance engagements. None of them are exotic; all of them are recoverable if surfaced early. Surfaced late, each of them compounds across the next cycle of amendments.",
    items: [
      {
        id: "under-categorization",
        label: "Under-categorization of supplements",
        description:
          "Changes that should have been Level I under Post-NOC or PAS under 21 CFR 314.70, filed as Level II or CBE-30 to compress timeline. Usually identified by the receiving agency during review; the result is a re-filing at the correct category with the timeline lost anyway.",
      },
      {
        id: "change-control-disconnect",
        label: "QMS change control disconnected from regulatory filings",
        description:
          "Change-control records inside the QMS that do not name the regulatory filing triggered by the change. The amendment authors then re-assemble the change history from source documents instead of extending the change-control record. The fix is architectural — link the change-control record to the filing record at the site level.",
      },
      {
        id: "annual-report-backlog",
        label: "Annual reports assembled at year-end",
        description:
          "Annual reports or Level III notifications built from the change-control log in the weeks before the anniversary. The common outcome is either items missed (generating agency questions at the next cycle) or items re-characterized under pressure. Authoring from the live record, incrementally, is the fix.",
      },
      {
        id: "del-drift",
        label: "DEL scope drift from actual operating scope",
        description:
          "Sites operating slightly outside the DEL scope they filed — a new dosage-form category in development, a new foreign building sending samples — without the scope amendment in flight. The next Health Canada inspection finds it; the licence is then amended under inspection pressure rather than on the site's cadence.",
      },
      {
        id: "multi-jurisdiction-diverge",
        label: "Multi-jurisdiction filings drifting apart",
        description:
          "A change filed with Health Canada under Post-NOC that is not mirrored to the FDA under 21 CFR 314.70, or vice versa. The two authorizations then diverge on scope or specification, and the sponsor carries two records where they should have one. Cross-jurisdiction change registers are the fix.",
      },
    ],
  },
  readinessEmbed: {
    eyebrow: "DEL Readiness Assessment",
    heading: "A self-check adjacent to the lifecycle work",
    body: "The DEL Readiness Assessment is a short self-check on the five readiness axes that shape a DEL's trajectory — QMS, technical agreements, site readiness, documentation, and change-control posture. The change-control axis in particular is directly adjacent to lifecycle regulatory work: sites that score strongly on change-control posture are also the sites whose DEL amendments and Post-NOC submissions travel cleanly.",
    shippingCopy:
      "Live with Prompt 20 of the website rebuild. A preview of the readiness dimensions is available now — the interactive tool ships with the AI tools phase.",
    previewCta: {
      label: "Preview the readiness dimensions",
      href: "/contact?source=rs-lifecycle-readiness-preview",
      variant: "outline",
    },
  },
  caseStudyFeature: {
    eyebrow: "Pattern of work",
    heading: "Post-NOC Level I plus parallel DEL amendment for a manufacturing-site addition",
    body: "A pattern we see often: a sponsor adding a new finished-product manufacturing site to an existing Canadian authorization. The change is categorized as Post-NOC Level I (prior-approval supplement) and requires a parallel DEL amendment to cover the new site's activity scope under the DEL. Hyderabad authors both the supplement CMC and the DEL amendment documentation; Mississauga files the DEL amendment as the Canadian regulatory function and serves as the Canadian point-of-contact for Health Canada follow-up on both instruments. The underlying QMS change-control record ties the two filings together.",
    status: "under-confirmation",
    cta: {
      label: "Ask for the NDA-gated case file",
      href: "/contact?source=rs-lifecycle-case-study",
      variant: "outline",
    },
  },
  checklistDownload: {
    eyebrow: "Lifecycle readiness checklist",
    heading: "A post-issuance readiness checklist, on request",
    lede: "A structured readiness checklist authored by Propharmex's regulatory team against Health Canada GUI-0002, the Post-NOC Changes framework, 21 CFR 314.70 and ICH Q12 lifecycle principles. It covers the six domains most likely to surface as issues during post-issuance regulatory work. Sent on request so we can scope the covering note to your programme.",
    bullets: [
      "DEL scope reconciliation — actual activities versus licensed activities, with change-amendment plan where they diverge",
      "Post-NOC change register — ongoing and planned Canadian product changes with categorization pre-assigned",
      "US supplement register — ongoing and planned US changes categorized under 21 CFR 314.70",
      "QMS change-control linkage — each change-control record naming the regulatory filing it triggers",
      "Annual-report cadence — live authoring posture, not year-end assembly",
      "Established conditions and PACMPs — ICH Q12 tooling where the authorization supports them",
    ],
    cta: {
      label: "Request the full lifecycle readiness checklist",
      href: "/contact?source=rs-lifecycle-checklist",
      variant: "primary",
    },
    disclaimer:
      "Checklist is authored by Propharmex's regulatory team in alignment with GUI-0002, the Post-NOC Changes framework, 21 CFR 314.70 and ICH Q12, as of 2026-04-23. It is informational; each agency's review of your specific filings is what decides acceptance.",
  },
  faq: {
    eyebrow: "Frequently asked",
    heading: "Six questions we get on almost every first call",
    lede: "Short, regulatorily precise answers. Longer conversations are a call away — the answers below are the ones it is faster to read than to ask.",
    items: [
      {
        id: "when-to-amend-del",
        question: "When does a change actually require a DEL amendment?",
        answer:
          "Most changes to the activity scope, dosage-form categories, foreign buildings, or key personnel listed on the DEL require an amendment under GUI-0002. Some are notifiable after implementation; others require Health Canada approval before implementation. Operational changes that sit inside the licensed scope — a new SOP revision, a routine equipment swap — generally do not require an amendment but do require change-control records inside the QMS. The decision is scope-by-scope, not category-by-category; we categorize at the change-scoping stage rather than at filing.",
      },
      {
        id: "post-noc-level-choice",
        question: "How do we decide the Post-NOC level for a product-level change?",
        answer:
          "Health Canada's Post-NOC Changes framework sets categorization criteria based on the change's potential to affect product quality, safety and efficacy. Level I is reserved for the highest-risk changes (new manufacturing site, major specification changes, significant formulation changes); Level II covers medium-risk notifiable changes; Level III feeds the annual notification; Level IV is internal record. The categorization drives the filing type, the data burden and the review clock. We categorize against the framework at change-scoping rather than at filing — re-categorization mid-submission costs more than scoping it properly at the start.",
      },
      {
        id: "license-vs-licence",
        question: "Which spelling do you use in lifecycle filings?",
        answer:
          "In Canadian lifecycle filings — DEL amendments, Post-NOC submissions, annual notifications — we use the Canadian spelling \"licence\" where the regulation uses it. In US supplements and 21 CFR 314.70-aligned documents, we use the US spelling \"license\" where 21 CFR text uses it. We do not mix the two inside a single filing. On this site, and in cross-jurisdiction prose, the default is \"licence\".",
      },
      {
        id: "us-vs-canada-same-change",
        question: "If the same change affects both Canadian and US authorizations, do we file twice?",
        answer:
          "Yes — the two authorizations are separate and the change is categorized under each agency's framework independently. A change categorized as Post-NOC Level I in Canada may be a PAS or a CBE-30 in the US depending on 21 CFR 314.70 criteria. The CMC content supporting the change is largely shared; the filings are separate. We run a cross-jurisdiction change register so the two filings stay synchronized on specification and scope even though they travel on different clocks.",
      },
      {
        id: "ich-q12",
        question: "Where does ICH Q12 fit in?",
        answer:
          "ICH Q12 introduces lifecycle-management tools — established conditions, post-approval change management protocols (PACMPs), and product lifecycle management documents — that allow pre-agreed change categories to be managed with lower regulatory burden after acceptance. Agency implementation varies; Health Canada and the FDA both support aspects of ICH Q12. Where the programme is suitable and the authorization supports it, we use Q12 tooling to shift Level I / PAS work into lower categories over the life of the authorization. Q12 is a structural choice at sequence 0000; retrofitting it to a mid-life authorization is harder.",
      },
      {
        id: "after-expiry",
        question: "What happens when the DEL is up for renewal or the product moves to discontinuation?",
        answer:
          "The DEL is reviewed annually, not renewed — it is a continuous instrument unless suspended or cancelled. The annual review reconciles scope, fees and any amendments filed in the licence year. Product-level discontinuation is a separate process — withdrawal of the Notice of Compliance in Canada, or withdrawal of the approval in the US. The DEL continues to cover the site's other activities after a single product's discontinuation; the filing to withdraw the product is distinct from any licence-side change.",
      },
    ],
  },
  related: {
    eyebrow: "Related services",
    heading: "Where lifecycle work connects to the rest of the site",
    lede: "Three adjacent pages are worth reading alongside this one — the DEL the amendments extend, the quality system the change-control posture is anchored in, and the original dossier the supplements sequence against.",
    links: [
      {
        id: "del-licensing",
        label: "Health Canada DEL licensing",
        description:
          "The DEL the amendments extend — original-issuance work and the change-control posture that carries through to post-issuance lifecycle.",
        href: "/services/regulatory-services/health-canada-del-licensing",
      },
      {
        id: "ctd-ectd",
        label: "CTD / eCTD dossier preparation",
        description:
          "The eCTD sequence backbone that supplements and amendments are built on — granularity and lifecycle sequencing decisions made at sequence 0000.",
        href: "/services/regulatory-services/ctd-ectd-dossier-preparation",
      },
      {
        id: "quality-compliance",
        label: "Quality & Compliance",
        description:
          "The QMS posture that the change-control record is anchored in — ICH Q10 alignment and the three-tier claim-status convention.",
        href: "/quality-compliance",
      },
    ],
  },
  closing: {
    eyebrow: "Next step",
    heading: "Bring the change that's in scope. We'll bring the categorization.",
    body: "A first call on lifecycle work usually resolves three questions quickly: what is the change and which authorizations does it affect; which framework categorizes it today (Post-NOC, 21 CFR 314.70, DEL amendment, or several at once); and is the QMS change-control record ready to extend into the filing or does it need to be rebuilt alongside. Bring the current state, including the gaps. We scope from there.",
    primaryCta: {
      label: "Scope a lifecycle engagement",
      href: "/contact?source=rs-lifecycle-closing-scope",
      variant: "primary",
    },
    secondaryCta: {
      label: "Book a 30-minute call",
      href: "/contact?source=rs-lifecycle-closing-call",
      variant: "outline",
    },
    regulatoryNote: HEALTH_CANADA_POST_NOC,
  },
};

/* -------------------------------------------------------------------------- */
/*  Leaf registry                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Full registry — all five regulatory sub-service leaves are live as of the
 * Prompt 12 follow-up PR. The DEL flagship shipped in PR #14; the four
 * non-DEL leaves (US FDA submissions, CTD/eCTD dossier preparation, GMP
 * audit preparation, lifecycle regulatory management) ship with this PR.
 */
export const REGULATORY_LEAF_CONTENT: Record<
  RegulatoryServiceSlug,
  RegulatoryLeafContent
> = {
  "health-canada-del-licensing": REGULATORY_DEL_LICENSING,
  "us-fda-submissions": REGULATORY_US_FDA_SUBMISSIONS,
  "ctd-ectd-dossier-preparation": REGULATORY_CTD_ECTD_DOSSIER_PREPARATION,
  "gmp-audit-preparation": REGULATORY_GMP_AUDIT_PREPARATION,
  "lifecycle-regulatory-management": REGULATORY_LIFECYCLE_MANAGEMENT,
};

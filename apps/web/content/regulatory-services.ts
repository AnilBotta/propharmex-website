/**
 * Content dictionary for /services/regulatory-services (hub) and the
 * Health Canada DEL licensing leaf (Prompt 12, first half).
 *
 * Positioning (from CLAUDE.md §1): the regulatory-services unit is the
 * commercial expression of Mississauga's Health Canada Drug Establishment
 * Licence. It is the bridge that lets Canadian, US, and Indian programmes
 * move across jurisdictions under a single quality system.
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
        leafStatus: "shipping-next",
        flagship: false,
      },
      {
        slug: "ctd-ectd-dossier-preparation",
        label: "CTD / eCTD dossier preparation",
        blurb:
          "Module 2 and 3 authoring and compilation against ICH M4 and the target agency's regional eCTD specification.",
        highlights: ["ICH M4", "Module 2/3", "Regional Module 1"],
        leafStatus: "shipping-next",
        flagship: false,
      },
      {
        slug: "gmp-audit-preparation",
        label: "GMP audit preparation",
        blurb:
          "Pre-inspection readiness work — mock audits, gap assessments and CAPA shaping in alignment with GUI-0001 and 21 CFR Parts 210/211.",
        highlights: ["GUI-0001", "Mock audits", "CAPA shaping"],
        leafStatus: "shipping-next",
        flagship: false,
      },
      {
        slug: "lifecycle-regulatory-management",
        label: "Lifecycle regulatory management",
        blurb:
          "Post-issuance change control, annual reporting, DEL amendments, and post-NOC change management across the product's operational life.",
        highlights: ["DEL amendments", "Post-NOC changes", "Annual reporting"],
        leafStatus: "shipping-next",
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
    lede: "A Drug Establishment Licence is issued by Health Canada under Part C, Division 1A of the Food and Drug Regulations and interpreted through GUI-0002. It authorizes specific activities on specific dosage-form and product categories at a specific site. Ours is in Mississauga. We use it as the operating backbone for every Canadian engagement and as the bridge that lets a US or India programme touch the Canadian market without a sponsor having to stand up a Canadian establishment of their own. This page describes what the licence authorizes, how a sponsor plugs into it, and how a new DEL is obtained when that is what a programme needs.",
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
        body: "The DEL is the reason Propharmex can be a Canada–India bridge rather than a broker in front of one. Without it, we could scope analytical methods, author a dossier, and plan the 3PL — but we could not, under our own authority, receive, test, warehouse, or distribute drugs in Canada. The licence converts a set of capabilities into a single operating posture that a regulator can review, that a sponsor can plug into, and that a customs authority will accept at the border.",
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
/*  Leaf registry                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Partial registry — four non-DEL leaves ship in the Prompt 12 follow-up PR.
 * The hub matrix renders the other slugs as `shipping-next` cards so internal
 * navigation does not dead-end.
 */
export const REGULATORY_LEAF_CONTENT: Partial<
  Record<RegulatoryServiceSlug, RegulatoryLeafContent>
> = {
  "health-canada-del-licensing": REGULATORY_DEL_LICENSING,
};

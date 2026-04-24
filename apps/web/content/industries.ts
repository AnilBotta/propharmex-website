/**
 * Content dictionary for /industries (hub) and the generic-manufacturers leaf
 * (Prompt 13, first half).
 *
 * Positioning (from CLAUDE.md §1): Propharmex sits at the Canada–India bridge.
 * Industries are the commercial lens on who we build programmes for — the
 * service trees under /services describe what we do; the industry pages under
 * /industries describe who we do it with and what that engagement looks like
 * from the sponsor's side of the table.
 *
 * Prompt 13 lists five industry leaves:
 *  - pharmaceutical-innovators
 *  - generic-manufacturers   (flagship — shipped in this PR)
 *  - cdmo-partners
 *  - governments-and-ngos
 *  - clinical-trial-sponsors
 *
 * The flagship in this PR is `generic-manufacturers`. The Canada–India bridge
 * narrative — analytical and CMC work authored in Hyderabad, filed and
 * inspection-hosted under the Mississauga DEL — maps most cleanly to a generic
 * manufacturer's ANDA + DMF workflow. Shipping the flagship first lets the
 * other four leaves inherit the same template without rewriting the shape.
 *
 * Claim-status convention (see docs/regulatory-lexicon.md §26–39): this page
 * uses `confirmed` only when referencing the Mississauga Drug Establishment
 * Licence on the Health Canada Drug and Health Product Register. Named client
 * work is `under-confirmation` (documentation on request). Everything else is
 * framed as operational alignment or descriptive capability — no certification
 * claim is made that cannot be pointed at a public register.
 *
 * All primary-source URLs stamped with "as of 2026-04-23" in the body prose
 * are declared once at the top of the content block below and mirror the
 * URLs already used in analytical-services.ts and regulatory-services.ts so
 * the outbound-link surface stays consistent across the site.
 */

import type { FacilityCta, FacilitySource } from "./facilities";

/* -------------------------------------------------------------------------- */
/*  Shared primitives                                                         */
/* -------------------------------------------------------------------------- */

export type IndustryCta = FacilityCta;
export type IndustrySource = FacilitySource;

/** Three-tier claim status mirrored from docs/regulatory-lexicon.md §26–39. */
export type IndustryClaimStatus =
  | "confirmed"
  | "under-confirmation"
  | "alignment";

export const INDUSTRY_SLUGS = [
  "pharmaceutical-innovators",
  "generic-manufacturers",
  "cdmo-partners",
  "governments-and-ngos",
  "clinical-trial-sponsors",
] as const;
export type IndustrySlug = (typeof INDUSTRY_SLUGS)[number];

export type IndustrySummary = {
  slug: IndustrySlug;
  label: string;
  /** One-sentence elevator line shown on the hub industry matrix. */
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

export type IndustryHubHero = {
  eyebrow: string;
  headline: string;
  lede: string;
  stats: { label: string; value: string }[];
  primaryCta: IndustryCta;
  secondaryCta: IndustryCta;
};

export type IndustryMatrix = {
  eyebrow: string;
  heading: string;
  lede: string;
  industries: IndustrySummary[];
  liveCopy: string;
  shippingNextCopy: string;
  flagshipCopy: string;
};

export type IndustryPostureCard = {
  id: string;
  label: string;
  description: string;
};

export type IndustryPosture = {
  eyebrow: string;
  heading: string;
  lede: string;
  /** Three cards describing how industry engagements are shaped. */
  cards: IndustryPostureCard[];
};

export type IndustryHubClosing = {
  eyebrow: string;
  heading: string;
  body: string;
  primaryCta: IndustryCta;
  secondaryCta: IndustryCta;
};

export type IndustryHubContent = {
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  hero: IndustryHubHero;
  matrix: IndustryMatrix;
  posture: IndustryPosture;
  closing: IndustryHubClosing;
};

/* -------------------------------------------------------------------------- */
/*  Leaf template                                                             */
/* -------------------------------------------------------------------------- */

export type IndustryLeafHero = {
  eyebrow: string;
  headline: string;
  /** One-sentence value prop — mirrors the regulatory leaf pattern. */
  valueProp: string;
  lede: string;
  stats: { label: string; value: string }[];
  primaryCta: IndustryCta;
  secondaryCta: IndustryCta;
};

export type IndustryPainPoint = {
  id: string;
  label: string;
  description: string;
};

export type IndustryPainPoints = {
  eyebrow: string;
  heading: string;
  lede: string;
  /** Three cards (Prompt 13: "consistent ... 3-column layout"). */
  items: IndustryPainPoint[];
};

export type IndustryOfferingColumn = {
  id: string;
  label: string;
  description: string;
  /** Links the column to a service-tree leaf we already ship. */
  serviceHref: string;
  serviceLabel: string;
};

export type IndustryTailoredOffering = {
  eyebrow: string;
  heading: string;
  lede: string;
  /** Three columns, each pointing at a service leaf. */
  columns: IndustryOfferingColumn[];
  closingNote: string;
};

export type IndustryRegulatoryTopic = {
  id: string;
  heading: string;
  body: string;
  status: IndustryClaimStatus;
  source?: IndustrySource;
};

export type IndustryRegulatoryContext = {
  eyebrow: string;
  heading: string;
  lede: string;
  topics: IndustryRegulatoryTopic[];
};

export type IndustryCaseTeaser = {
  id: string;
  service: string;
  title: string;
  body: string;
  status: "under-confirmation";
};

export type IndustryCaseRail = {
  eyebrow: string;
  heading: string;
  lede: string;
  teasers: IndustryCaseTeaser[];
  cta: IndustryCta;
};

export type IndustryFaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type IndustryFaq = {
  eyebrow: string;
  heading: string;
  lede: string;
  items: IndustryFaqItem[];
};

export type IndustryRelatedLink = {
  id: string;
  label: string;
  description: string;
  href: string;
};

export type IndustryRelated = {
  eyebrow: string;
  heading: string;
  lede: string;
  links: IndustryRelatedLink[];
};

export type IndustryLeafClosing = {
  eyebrow: string;
  heading: string;
  body: string;
  primaryCta: IndustryCta;
  secondaryCta: IndustryCta;
  regulatoryNote: IndustrySource;
};

export type IndustryLeafContent = {
  slug: IndustrySlug;
  label: string;
  crumbLabel: string;
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  hero: IndustryLeafHero;
  painPoints: IndustryPainPoints;
  offering: IndustryTailoredOffering;
  regulatory: IndustryRegulatoryContext;
  caseRail: IndustryCaseRail;
  faq: IndustryFaq;
  related: IndustryRelated;
  closing: IndustryLeafClosing;
};

/* -------------------------------------------------------------------------- */
/*  Shared primary-source constants                                           */
/*  Mirrored from analytical-services.ts / regulatory-services.ts.            */
/* -------------------------------------------------------------------------- */

const HEALTH_CANADA_DEL_REGISTER: IndustrySource = {
  kind: "primary",
  label: "Health Canada — Drug and Health Product Register",
  href: "https://health-products.canada.ca/dpd-bdpp/",
};

const CFR_PART_314: IndustrySource = {
  kind: "primary",
  label:
    "21 CFR Part 314 — Applications for FDA approval to market a new drug",
  href: "https://www.ecfr.gov/current/title-21/chapter-I/subchapter-D/part-314",
};

const CFR_314_420_DMF: IndustrySource = {
  kind: "primary",
  label: "21 CFR 314.420 — Drug master files",
  href: "https://www.ecfr.gov/current/title-21/chapter-I/subchapter-D/part-314#314.420",
};

const FDA_BE_GUIDANCE: IndustrySource = {
  kind: "primary",
  label:
    "USFDA — Bioequivalence studies with pharmacokinetic endpoints for drugs submitted under an ANDA (guidance)",
  href: "https://www.fda.gov/regulatory-information/search-fda-guidance-documents/bioequivalence-studies-pharmacokinetic-endpoints-drugs-submitted-anda",
};

/* -------------------------------------------------------------------------- */
/*  Hub content                                                               */
/* -------------------------------------------------------------------------- */

export const INDUSTRIES_HUB: IndustryHubContent = {
  metaTitle: "Industries We Serve — Propharmex",
  metaDescription:
    "Pharmaceutical innovators, generic manufacturers, CDMO partners, governments and NGOs, and clinical trial sponsors — five industry lenses on the Canada–India bridge.",
  ogTitle: "Industries We Serve — Propharmex",
  ogDescription:
    "Five industry lenses on one operating model: Hyderabad CMC and analytical work, filed and inspection-hosted under the Mississauga Drug Establishment Licence.",
  hero: {
    eyebrow: "Industries",
    headline: "One operating model, five industry lenses.",
    lede: "Propharmex runs a single quality system across two hubs — Hyderabad for analytical and CMC authoring, Mississauga for the Canadian regulatory function and Drug Establishment Licence. The shape of each engagement changes depending on who we are building with: an innovator with a branded programme, a generic manufacturer chasing an ANDA window, a CDMO partner extending bandwidth, an institutional buyer under a tender, or a trial sponsor needing investigational material. Industry pages describe the engagement from the sponsor's side; service pages describe the work.",
    stats: [
      { label: "Industries", value: "5" },
      { label: "Operating hubs", value: "Mississauga · Hyderabad" },
      { label: "Anchor licence", value: "Health Canada DEL (confirmed)" },
    ],
    primaryCta: {
      label: "Start a scoping conversation",
      href: "/contact?source=industries-hub-hero-scope",
      variant: "primary",
    },
    secondaryCta: {
      label: "See the service trees",
      href: "/services",
      variant: "outline",
    },
  },
  matrix: {
    eyebrow: "Industry matrix",
    heading: "Five industries, one operating model",
    lede: "Generic manufacturers is the flagship because the Canada–India bridge economics — Hyderabad authoring, Mississauga filing and inspection — map most cleanly to an ANDA plus DMF workflow under a single QMS. The other four lenses apply the same operating model to different programme shapes. Detail pages walk through the engagement; the hub is the index.",
    industries: [
      {
        slug: "pharmaceutical-innovators",
        label: "Pharmaceutical innovators",
        blurb:
          "Branded programmes needing CMC, analytical and regulatory bandwidth with a Canadian establishment licence behind the filings.",
        highlights: ["Branded CMC", "Canadian DEL", "ICH alignment"],
        leafStatus: "shipping-next",
        flagship: false,
      },
      {
        slug: "generic-manufacturers",
        label: "Generic manufacturers",
        blurb:
          "ANDA programmes with DMF reference, bioequivalence planning and eCTD Module 2/3 authoring under one quality system across both hubs.",
        highlights: ["ANDA support", "DMF support", "BE planning"],
        leafStatus: "live",
        flagship: true,
      },
      {
        slug: "cdmo-partners",
        label: "CDMO partners",
        blurb:
          "Bandwidth and regulatory surface for contract manufacturers taking on Canadian-market scope without standing up their own DEL.",
        highlights: ["Canadian scope", "Regulatory surface", "Tech transfer"],
        leafStatus: "shipping-next",
        flagship: false,
      },
      {
        slug: "governments-and-ngos",
        label: "Governments and NGOs",
        blurb:
          "Capability alignment for institutional procurement and prequalification processes — tender-grade documentation under a DEL-anchored QMS.",
        highlights: ["Tender documentation", "QMS alignment", "Traceability"],
        leafStatus: "shipping-next",
        flagship: false,
      },
      {
        slug: "clinical-trial-sponsors",
        label: "Clinical trial sponsors",
        blurb:
          "Investigational material, analytical release and regulatory handling for sponsors running Canadian and multi-jurisdictional trials.",
        highlights: [
          "Investigational material",
          "Analytical release",
          "CTA support",
        ],
        leafStatus: "shipping-next",
        flagship: false,
      },
    ],
    liveCopy: "Detail page available",
    shippingNextCopy: "Detail page shipping next",
    flagshipCopy:
      "Flagship industry — the cleanest fit for the Canada–India bridge model",
  },
  posture: {
    eyebrow: "How we shape engagements",
    heading: "What the sponsor sees from their side of the table",
    lede: "Industry pages describe how the engagement is shaped, not what we claim. The three cards below hold across all five industries — they are the operating posture the sponsor experiences regardless of which lens they land on first.",
    cards: [
      {
        id: "one-qms",
        label: "One quality system across both hubs",
        description:
          "The document authored in Hyderabad and the document filed from Mississauga live in the same record under one quality system. The regulator sees one operating unit. The sponsor does not pay for a translation layer between two vendors.",
      },
      {
        id: "del-anchored",
        label: "Anchored on a verifiable Canadian licence",
        description:
          "The Mississauga Drug Establishment Licence is listed on the Health Canada Drug and Health Product Register. Every industry engagement that touches a Canadian filing, import, or distribution scope is filed from that licence or under a declared amendment path toward it.",
      },
      {
        id: "no-overclaim",
        label: "Claims that match what a regulator can check",
        description:
          "Named client work is described as \"under confirmation · documentation on request\" until public proof exists. Our posture is to say less than we could prove rather than more than we can defend — the cost of a wrong claim on a pharma site is very high.",
      },
    ],
  },
  closing: {
    eyebrow: "Start a conversation",
    heading: "Scope a programme from your side of the table",
    body: "Tell us which lens fits your programme and what you need next — an ANDA CMC pass, a DEL-anchored filing surface, a trial-sponsor release pathway, a tender-grade documentation set, or an innovator-scale CMC package. The conversation is structured enough to produce a scope outline; short enough to not waste your day.",
    primaryCta: {
      label: "Start a scoping conversation",
      href: "/contact?source=industries-hub-closing-scope",
      variant: "primary",
    },
    secondaryCta: {
      label: "See the service trees",
      href: "/services",
      variant: "outline",
    },
  },
};

/* -------------------------------------------------------------------------- */
/*  Leaf content — generic-manufacturers (flagship)                           */
/* -------------------------------------------------------------------------- */

const GENERIC_MANUFACTURERS: IndustryLeafContent = {
  slug: "generic-manufacturers",
  label: "Generic manufacturers",
  crumbLabel: "Generic manufacturers",
  metaTitle: "Generic Manufacturers — Propharmex Industries",
  metaDescription:
    "ANDA programmes with DMF reference, bioequivalence planning, eCTD Module 2/3 authoring and DEL-anchored Canadian filing surface — one quality system across Hyderabad and Mississauga.",
  ogTitle: "Generic Manufacturers — Propharmex",
  ogDescription:
    "The Canada–India bridge applied to generics: Hyderabad-authored ANDA CMC and DMF work, filed and inspection-hosted under the Mississauga Drug Establishment Licence.",
  hero: {
    eyebrow: "Industries · Generic manufacturers",
    headline:
      "ANDA programmes, authored in Hyderabad, filed under a Canadian DEL.",
    valueProp:
      "One quality system across two hubs — the economics of Indian CMC authoring with a Health Canada–licensed filing surface on the other side.",
    lede: "Generic manufacturers run against compressed windows: the reference product's exclusivity clock, the agency's review queue, and a DMF-holder's supply schedule rarely agree. Propharmex's operating model is built for that pattern — Hyderabad authors the Module 2 and Module 3 content against current USFDA, ICH, and Health Canada specifications; Mississauga is the Canadian regulatory function and the establishment-licensed site for any Canadian filing, import, or distribution scope. Both hubs work from a single quality record, which keeps audit trails short and handoffs boring.",
    stats: [
      { label: "ANDA framework", value: "21 CFR Part 314" },
      { label: "DMF framework", value: "21 CFR 314.420" },
      { label: "Canadian anchor", value: "Mississauga DEL (confirmed)" },
    ],
    primaryCta: {
      label: "Scope an ANDA programme",
      href: "/contact?source=industries-generics-hero-scope",
      variant: "primary",
    },
    secondaryCta: {
      label: "Ask about DMF support",
      href: "/contact?source=industries-generics-hero-dmf",
      variant: "outline",
    },
  },
  painPoints: {
    eyebrow: "The pain",
    heading: "Three patterns we see on almost every generics programme",
    lede: "The specifics change — the product, the dosage form, the reference — but the shape of the pain repeats. Sponsors usually arrive at one of three positions, often more than one.",
    items: [
      {
        id: "fragmented-vendors",
        label: "Fragmented vendor stack",
        description:
          "Analytical method work at one vendor, CMC authoring at another, a regulatory writer on retainer, a Canadian importer-of-record nobody has called in six months. The audit trail is a chain of emails. Every agency question costs a week just to identify the right authoritative source.",
      },
      {
        id: "filing-timing",
        label: "Filing timing against exclusivity windows",
        description:
          "The reference product's exclusivity clock dictates the submission target. The DMF holder's stability timeline dictates the CMC readiness date. When those two clocks disagree, the programme loses either the window or the quality-of-filing margin that clears deficiency rounds.",
      },
      {
        id: "canadian-scope-gap",
        label: "Canadian scope without a Canadian licence",
        description:
          "A US-focused programme suddenly needs Canadian market scope — a partner request, an unexpected tender, a manufacturing-site change. Standing up a Drug Establishment Licence from scratch runs against a 250 calendar-day Health Canada service standard. Using an existing DEL-holder's surface is usually faster, and usually preferable.",
      },
    ],
  },
  offering: {
    eyebrow: "Our tailored offering",
    heading: "Three service trees, shaped for a generics workflow",
    lede: "The three service trees below are the ones a generics programme draws from most often. Each column is a real leaf under /services, not a sales label — the detail page describes the work, the sources, and how we scope it.",
    columns: [
      {
        id: "analytical",
        label: "Analytical method development and release",
        description:
          "Method development, validation to ICH Q2(R2), and routine release testing of the finished dosage form. The analytical record that lands in Module 3 is the same record the Mississauga team releases product against — no reconciliation step between development and release.",
        serviceHref: "/services/analytical-services",
        serviceLabel: "See analytical services",
      },
      {
        id: "regulatory",
        label: "ANDA, DMF and eCTD support",
        description:
          "Module 2 summaries and Module 3 CMC authoring to the target agency's current eCTD technical specifications. DMF Type II support under 21 CFR 314.420. Canadian NDS / ANDS support filed from the Mississauga DEL when the sponsor elects a Canadian pathway.",
        serviceHref: "/services/regulatory-services/us-fda-submissions",
        serviceLabel: "See US FDA submission support",
      },
      {
        id: "pharmdev",
        label: "Formulation, scale-up and tech transfer",
        description:
          "Formulation work under ICH Q8 principles, process optimisation and scale-up, and tech transfer into a contract manufacturer's site. Analytical bridging keeps release specifications consistent across the transfer.",
        serviceHref: "/services/pharmaceutical-development",
        serviceLabel: "See pharmaceutical development",
      },
    ],
    closingNote:
      "The shape is deliberate. Analytical, regulatory, and development work live under one QMS so that a sponsor never has to act as the integrator between three separate vendor streams.",
  },
  regulatory: {
    eyebrow: "Regulatory context",
    heading: "The frameworks a generics programme actually runs against",
    lede: "Every generics programme we support is run against a specific public framework. The four items below are the ones referenced on almost every engagement — each is cited from its primary source with \"as of 2026-04-23\" for claims that reference current agency expectations.",
    topics: [
      {
        id: "anda-314",
        heading: "ANDA submission framework — 21 CFR Part 314",
        body: "Abbreviated New Drug Applications are filed under 21 CFR Part 314. Our Module 2 and Module 3 authoring is shaped against the current regulation text and the agency's prevailing eCTD technical specification, with Module 1 assembled to the target agency's regional specification at filing time. As of 2026-04-23 the ecfr.gov version of Part 314 is the operative text.",
        status: "alignment",
        source: CFR_PART_314,
      },
      {
        id: "dmf-314-420",
        heading: "Drug master files — 21 CFR 314.420",
        body: "DMF Type II support for drug substance manufacturers covers the technical content that the Section of the DMF holds and the letters of authorization a sponsor references into an ANDA. The scope and numbering of our DMF-facing work tracks 21 CFR 314.420 as published on ecfr.gov, reviewed at each engagement. As of 2026-04-23 the ecfr.gov version is the operative text.",
        status: "alignment",
        source: CFR_314_420_DMF,
      },
      {
        id: "bioequivalence",
        heading: "Bioequivalence planning",
        body: "Pharmacokinetic bioequivalence study planning follows the USFDA guidance on bioequivalence studies submitted under an ANDA. Propharmex supports study design, protocol authoring and bioanalytical method strategy; the clinical conduct is performed at a qualified CRO the sponsor selects. As of 2026-04-23 the referenced guidance remains the operative agency position.",
        status: "alignment",
        source: FDA_BE_GUIDANCE,
      },
      {
        id: "del-anchor",
        heading: "Canadian establishment licence anchor",
        body: "Canadian scope on a generics programme — import, release, distribution, Canadian market authorization holding — is exercised under the Mississauga Drug Establishment Licence. The licence is listed on the Health Canada Drug and Health Product Register and can be verified today. Sponsors using our DEL as a surface avoid standing one up themselves inside a compressed filing window.",
        status: "confirmed",
        source: HEALTH_CANADA_DEL_REGISTER,
      },
    ],
  },
  caseRail: {
    eyebrow: "Worked patterns",
    heading: "What generics work looks like on our desk",
    lede: "Named, permission-cleared case studies land with Prompt 14. The teasers below describe the pattern rather than a specific client, in keeping with our policy of using client names only where permission is granted.",
    teasers: [
      {
        id: "bcs-ii-anda",
        service: "ANDA CMC authoring",
        title: "ANDA CMC package for a BCS-II oral solid",
        body: "Module 3 authored in Hyderabad to current FDA eCTD expectations with a Type II DMF reference and an analytical package anchored to the same validation record used for release. Submission filing handled by the sponsor.",
        status: "under-confirmation",
      },
      {
        id: "dmf-type-ii",
        service: "DMF Type II support",
        title: "Type II DMF buildout for a small-molecule API",
        body: "Drug substance manufacturing, controls and stability content authored against 21 CFR 314.420 with letters of authorization prepared for multiple downstream ANDA sponsors. Held under NDA until the first cross-referencing ANDA is disclosed.",
        status: "under-confirmation",
      },
      {
        id: "canadian-scope-addition",
        service: "Canadian scope addition",
        title: "Adding Canadian market scope to a US-filed generics programme",
        body: "Existing US ANDA-filed product extended into Canadian scope under the Mississauga DEL — import, release and distribution handled from Mississauga while the sponsor's US operations continued unchanged.",
        status: "under-confirmation",
      },
    ],
    cta: {
      label: "Start a scoping conversation",
      href: "/contact?source=industries-generics-caserail",
      variant: "primary",
    },
  },
  faq: {
    eyebrow: "Frequently asked",
    heading: "What generics sponsors usually ask first",
    lede: "The answers here are the ones that tend to determine whether a programme is a fit before anyone draws up a scope. None of them are surprising on reflection; sponsors ask them because the answers vary a lot across vendors.",
    items: [
      {
        id: "q-canadian-licence",
        question:
          "Do we need our own Canadian Drug Establishment Licence to use your Canadian filing surface?",
        answer:
          "No. For most engagement shapes, work is filed from the Mississauga Drug Establishment Licence that Propharmex already holds. If a sponsor eventually wants its own DEL, we can run that separately under the regulatory-services tree — the 250 calendar-day Health Canada service standard for a new DEL is a documented agency expectation, not a promise (as of 2026-04-23).",
      },
      {
        id: "q-dmf-type",
        question:
          "Can you support DMF Type II work for a drug substance we are sourcing from a partner we already use?",
        answer:
          "Yes. DMF Type II support per 21 CFR 314.420 is typically structured against the drug substance manufacturer's existing quality record — we do not require switching API suppliers. The scope we take on is the authoring, referencing and letter-of-authorization handling; the manufacturing is the supplier's.",
      },
      {
        id: "q-bioequivalence",
        question: "Do you run the bioequivalence study itself?",
        answer:
          "No. Clinical conduct of a bioequivalence study is performed at a qualified CRO, typically one the sponsor selects. Propharmex supports the protocol authoring, bioanalytical method strategy, and the CMC-side integration of the study report into Module 5 and Module 2.",
      },
      {
        id: "q-timeline",
        question:
          "How compressed can an ANDA CMC authoring timeline realistically be?",
        answer:
          "The honest answer is that it depends on stability, method validation state, and DMF readiness at kickoff — not authoring speed. When those three are clean, the authoring pass itself is usually measured in weeks rather than months. When one of them is not clean, the number we would quote for authoring would mislead the sponsor about the actual critical path.",
      },
      {
        id: "q-canadian-site-change",
        question:
          "We need to add a Canadian market authorisation holder partway through a US programme — is that realistic?",
        answer:
          "Often, yes. Adding Canadian scope onto a US-filed generics programme under our DEL is a pattern we see repeatedly. The work is real — it is a regulatory strategy, a scope amendment, and sometimes a product-monograph pass — but it does not require rebuilding the US programme. The decision tree is a scoping conversation.",
      },
    ],
  },
  related: {
    eyebrow: "Adjacent reading",
    heading: "Service trees a generics programme draws from",
    lede: "The industry page describes the engagement; the service pages describe the work. Start where your next decision sits.",
    links: [
      {
        id: "analytical",
        label: "Analytical services",
        description:
          "Method development, validation and release testing under the same QMS that authors your Module 3 content.",
        href: "/services/analytical-services",
      },
      {
        id: "regulatory-fda",
        label: "US FDA submissions",
        description:
          "ANDA, DMF and eCTD support authored in Hyderabad, reviewed against current FDA guidance.",
        href: "/services/regulatory-services/us-fda-submissions",
      },
      {
        id: "pharmdev",
        label: "Pharmaceutical development",
        description:
          "Formulation, scale-up and tech transfer work, bridged cleanly into the release analytical record.",
        href: "/services/pharmaceutical-development",
      },
    ],
  },
  closing: {
    eyebrow: "Start a conversation",
    heading: "Scope a generics programme with one quality system behind it",
    body: "Tell us where the programme is — reference product identified, DMF path chosen, stability running, filing target set — and we will shape a scope around what is real rather than what is hypothetical. The Canada–India bridge is not a tagline; it is how the paperwork ends up on the regulator's desk.",
    primaryCta: {
      label: "Scope an ANDA programme",
      href: "/contact?source=industries-generics-closing-scope",
      variant: "primary",
    },
    secondaryCta: {
      label: "Ask about DMF support",
      href: "/contact?source=industries-generics-closing-dmf",
      variant: "outline",
    },
    regulatoryNote: HEALTH_CANADA_DEL_REGISTER,
  },
};

/* -------------------------------------------------------------------------- */
/*  Leaf registry                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Registry of leaf content keyed by slug. PR A ships `generic-manufacturers`;
 * the other four slugs are declared in `INDUSTRY_SLUGS` above and surfaced on
 * the hub matrix as `shipping-next`, but their leaf pages return `notFound()`
 * until the follow-up PR publishes their content.
 *
 * The follow-up PR flips this declaration to
 *   `Record<IndustrySlug, IndustryLeafContent>`
 * once all five slugs resolve — same pattern used for regulatory-services.ts.
 */
export const INDUSTRIES_LEAF_CONTENT: Partial<
  Record<IndustrySlug, IndustryLeafContent>
> = {
  "generic-manufacturers": GENERIC_MANUFACTURERS,
};

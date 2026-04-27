/**
 * Content dictionary for /industries (hub) and all five industry leaves
 * (Prompt 13, complete).
 *
 * Positioning (from CLAUDE.md §1): Propharmex is a Canadian pharmaceutical
 * services company anchored at our Mississauga DEL site, with an Indian
 * development centre in Hyderabad providing operational depth, serving drug
 * developers globally.
 * Industries are the commercial lens on who we build programmes for — the
 * service trees under /services describe what we do; the industry pages under
 * /industries describe who we do it with and what that engagement looks like
 * from the sponsor's side of the table.
 *
 * Prompt 13 lists five industry leaves. The first PR (#16) shipped the hub
 * and the `generic-manufacturers` flagship; this follow-up ships the remaining
 * four leaves and flips the registry from `Partial<Record<...>>` to a full
 * `Record<IndustrySlug, IndustryLeafContent>`:
 *
 *  - pharmaceutical-innovators   — branded CMC under a Canadian DEL
 *  - generic-manufacturers       — flagship (ANDA + DMF workflow)
 *  - cdmo-partners               — Canadian scope surface without standing up a DEL
 *  - governments-and-ngos        — narrowed capability-alignment framing
 *  - clinical-trial-sponsors     — investigational supply + CTA handling
 *
 * The flagship remains `generic-manufacturers`. The Canadian-anchored
 * operating model — CMC and analytical work executed by Propharmex, filed
 * and inspection-hosted under the Health Canada DEL — maps most cleanly to
 * a generic manufacturer's ANDA + DMF workflow. The other four leaves inherit the same
 * template, with one deliberate exception: governments-and-ngos ships without
 * a case-study rail and with `alignment` status across every regulatory topic.
 * Propharmex is developing the institutional-procurement practice area and the
 * page is written to reflect that honestly, not to imply a prequalification
 * history we do not hold. The `caseRail` field on `IndustryLeafContent` is
 * optional for that reason.
 *
 * Claim-status convention (see docs/regulatory-lexicon.md §26–39): this page
 * uses `confirmed` only when referencing the Health Canada Drug Establishment
 * Licence on the Drug and Health Product Register. Named client
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
  /**
   * Optional: governments-and-ngos ships without a case-study rail because the
   * practice area is in development and we do not have permission-cleared
   * institutional procurement case studies to show yet. All other leaves must
   * populate this field.
   */
  caseRail?: IndustryCaseRail;
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

const CFR_PART_211: IndustrySource = {
  kind: "primary",
  label:
    "21 CFR Part 211 — Current Good Manufacturing Practice for Finished Pharmaceuticals",
  href: "https://www.ecfr.gov/current/title-21/chapter-I/subchapter-C/part-211",
};

const ICH_M4_ECTD: IndustrySource = {
  kind: "primary",
  label:
    "ICH M4 — Common Technical Document (CTD) and eCTD specification",
  href: "https://www.ich.org/page/ctd",
};

const ICH_E6_R3_GCP: IndustrySource = {
  kind: "primary",
  label: "ICH E6(R3) — Good Clinical Practice",
  href: "https://www.ich.org/page/efficacy-guidelines",
};

const WHO_PREQUALIFICATION: IndustrySource = {
  kind: "primary",
  label: "WHO Prequalification Programme — medicines stream",
  href: "https://extranet.who.int/prequal/",
};

const UNICEF_SUPPLY_DIVISION: IndustrySource = {
  kind: "primary",
  label: "UNICEF Supply Division — procurement of essential medicines",
  href: "https://www.unicef.org/supply/",
};

const GLOBAL_FUND_QA_POLICY: IndustrySource = {
  kind: "primary",
  label:
    "The Global Fund — Quality Assurance Policy for Pharmaceutical Products",
  href: "https://www.theglobalfund.org/en/sourcing-management/quality-assurance/",
};

/* -------------------------------------------------------------------------- */
/*  Hub content                                                               */
/* -------------------------------------------------------------------------- */

export const INDUSTRIES_HUB: IndustryHubContent = {
  metaTitle: "Industries We Serve — Propharmex",
  metaDescription:
    "Pharmaceutical innovators, generic manufacturers, CDMO partners, governments and NGOs, and clinical trial sponsors — five industry lenses on Propharmex's Canadian-anchored operating model.",
  ogTitle: "Industries We Serve — Propharmex",
  ogDescription:
    "Five industry lenses on one operating model: CMC and analytical work executed by Propharmex, filed and inspection-hosted under the Health Canada Drug Establishment Licence.",
  hero: {
    eyebrow: "Industries",
    headline: "One operating model, five industry lenses.",
    lede: "Propharmex runs a single quality system anchored at our Mississauga site under the Health Canada Drug Establishment Licence, with an Indian development centre providing analytical and CMC depth. The shape of each engagement changes depending on who we are building with: an innovator with a branded programme, a generic manufacturer chasing an ANDA window, a CDMO partner extending bandwidth, an institutional buyer under a tender, or a trial sponsor needing investigational material. Industry pages describe the engagement from the sponsor's side; service pages describe the work.",
    stats: [
      { label: "Industries", value: "5" },
      { label: "Regulatory anchor", value: "Health Canada DEL (confirmed)" },
      { label: "Operating model", value: "Canadian-anchored, single QMS" },
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
    lede: "Generic manufacturers is the flagship because the Canadian-anchored operating economics — Propharmex-authored CMC, filed and inspection-hosted under the DEL — map most cleanly to an ANDA plus DMF workflow under a single QMS. The other four lenses apply the same operating model to different programme shapes. Detail pages walk through the engagement; the hub is the index.",
    industries: [
      {
        slug: "pharmaceutical-innovators",
        label: "Pharmaceutical innovators",
        blurb:
          "Branded programmes needing CMC, analytical and regulatory bandwidth with a Canadian establishment licence behind the filings.",
        highlights: ["Branded CMC", "Canadian DEL", "ICH alignment"],
        leafStatus: "live",
        flagship: false,
      },
      {
        slug: "generic-manufacturers",
        label: "Generic manufacturers",
        blurb:
          "ANDA programmes with DMF reference, bioequivalence planning and eCTD Module 2/3 authoring under one quality system, executed by Propharmex.",
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
        leafStatus: "live",
        flagship: false,
      },
      {
        slug: "governments-and-ngos",
        label: "Governments and NGOs",
        blurb:
          "Capability alignment for institutional procurement and prequalification processes — tender-grade documentation under a DEL-anchored QMS.",
        highlights: ["Tender documentation", "QMS alignment", "Traceability"],
        leafStatus: "live",
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
        leafStatus: "live",
        flagship: false,
      },
    ],
    liveCopy: "Detail page available",
    shippingNextCopy: "Detail page shipping next",
    flagshipCopy:
      "Flagship industry — the cleanest fit for the Canadian-anchored operating model",
  },
  posture: {
    eyebrow: "How we shape engagements",
    heading: "What the sponsor sees from their side of the table",
    lede: "Industry pages describe how the engagement is shaped, not what we claim. The three cards below hold across all five industries — they are the operating posture the sponsor experiences regardless of which lens they land on first.",
    cards: [
      {
        id: "one-qms",
        label: "One quality system, end to end",
        description:
          "The document authored and the document filed live in the same record under one quality system. The regulator sees one operating unit. The sponsor does not pay for a translation layer between two vendors.",
      },
      {
        id: "del-anchored",
        label: "Anchored on a verifiable Canadian licence",
        description:
          "Our Health Canada Drug Establishment Licence is held in Mississauga and listed on the Drug and Health Product Register. Every industry engagement that touches a Canadian filing, import, or distribution scope is filed from that licence or under a declared amendment path toward it.",
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
    "ANDA programmes with DMF reference, bioequivalence planning, eCTD Module 2/3 authoring and DEL-anchored Canadian filing surface — one quality system, executed by Propharmex.",
  ogTitle: "Generic Manufacturers — Propharmex",
  ogDescription:
    "The Canadian-anchored operating model applied to generics: Propharmex-authored ANDA CMC and DMF work, filed and inspection-hosted under the Health Canada Drug Establishment Licence.",
  hero: {
    eyebrow: "Industries · Generic manufacturers",
    headline:
      "ANDA programmes — executed by Propharmex, filed under our Health Canada DEL.",
    valueProp:
      "One Canadian-anchored quality system — CMC and analytical depth executed by Propharmex, with a Health Canada–licensed filing surface on the other side.",
    lede: "Generic manufacturers run against compressed windows: the reference product's exclusivity clock, the agency's review queue, and a DMF-holder's supply schedule rarely agree. Propharmex's operating model is built for that pattern — Module 2 and Module 3 content authored against current USFDA, ICH, and Health Canada specifications, and filed under the Health Canada DEL as the establishment-licensed site for any Canadian filing, import, or distribution scope. Everything works from a single quality record, which keeps audit trails short and handoffs boring.",
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
          "Method development, validation to ICH Q2(R2), and routine release testing of the finished dosage form. The analytical record that lands in Module 3 is the same record we release product against under the DEL — no reconciliation step between development and release.",
        serviceHref: "/services/analytical-services",
        serviceLabel: "See analytical services",
      },
      {
        id: "regulatory",
        label: "ANDA, DMF and eCTD support",
        description:
          "Module 2 summaries and Module 3 CMC authoring to the target agency's current eCTD technical specifications. DMF Type II support under 21 CFR 314.420. Canadian NDS / ANDS support filed under our Health Canada DEL when the sponsor elects a Canadian pathway.",
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
        body: "Canadian scope on a generics programme — import, release, distribution, Canadian market authorization holding — is exercised under our Health Canada Drug Establishment Licence. The licence is listed on the Drug and Health Product Register and can be verified today. Sponsors using our DEL as a surface avoid standing one up themselves inside a compressed filing window.",
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
        body: "Module 3 authored to current FDA eCTD expectations with a Type II DMF reference and an analytical package anchored to the same validation record used for release. Submission filing handled by the sponsor.",
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
        body: "Existing US ANDA-filed product extended into Canadian scope under our Health Canada DEL — import, release and distribution handled by Propharmex while the sponsor's US operations continued unchanged.",
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
          "No. For most engagement shapes, work is filed from the Health Canada Drug Establishment Licence that Propharmex already holds in Mississauga. If a sponsor eventually wants its own DEL, we can run that separately under the regulatory-services tree — the 250 calendar-day Health Canada service standard for a new DEL is a documented agency expectation, not a promise (as of 2026-04-23).",
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
          "ANDA, DMF and eCTD support — authored and reviewed against current FDA guidance under a single quality system.",
        href: "/services/regulatory-services/us-fda-submissions",
      },
      {
        id: "pharmdev",
        label: "Pharmaceutical development",
        description:
          "Formulation, scale-up and tech transfer work, fed cleanly into the release analytical record.",
        href: "/services/pharmaceutical-development",
      },
    ],
  },
  closing: {
    eyebrow: "Start a conversation",
    heading: "Scope a generics programme with one quality system behind it",
    body: "Tell us where the programme is — reference product identified, DMF path chosen, stability running, filing target set — and we will shape a scope around what is real rather than what is hypothetical. The Canadian-anchored operating model is not a tagline; it is how the paperwork ends up on the regulator's desk.",
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
/*  Leaf content — pharmaceutical-innovators                                  */
/* -------------------------------------------------------------------------- */

const PHARMACEUTICAL_INNOVATORS: IndustryLeafContent = {
  slug: "pharmaceutical-innovators",
  label: "Pharmaceutical innovators",
  crumbLabel: "Pharmaceutical innovators",
  metaTitle: "Pharmaceutical Innovators — Propharmex Industries",
  metaDescription:
    "Branded CMC, analytical and regulatory bandwidth for innovators — Module 3 executed by Propharmex, Canadian filings anchored on our Health Canada Drug Establishment Licence.",
  ogTitle: "Pharmaceutical Innovators — Propharmex",
  ogDescription:
    "The Canadian-anchored operating model applied to branded innovator programmes: Propharmex CMC authoring with a DEL-anchored filing surface.",
  hero: {
    eyebrow: "Industries · Pharmaceutical innovators",
    headline:
      "Branded CMC — executed by Propharmex, filed under our Health Canada DEL.",
    valueProp:
      "Innovator-scale CMC depth — ICH Q8–Q11 framing, Module 3 authoring, analytical bridging — under the same quality system that carries our Health Canada Drug Establishment Licence.",
    lede: "Innovator programmes run against a different clock than generics. The CMC package has to satisfy an agency that will see the molecule for the first time, the quality narrative has to hold up to ICH Q8–Q11 scrutiny, and the Canadian market is usually an eventual destination rather than the primary target. Propharmex's operating model fits that shape by authoring Module 2 and Module 3 content against current USFDA and ICH expectations, and holding the Canadian regulatory function — and the Drug Establishment Licence — under our DEL for when Canadian scope lands on the roadmap.",
    stats: [
      { label: "Submission framework", value: "21 CFR Part 314" },
      { label: "CTD structure", value: "ICH M4 eCTD" },
      { label: "Canadian anchor", value: "Mississauga DEL (confirmed)" },
    ],
    primaryCta: {
      label: "Scope an innovator CMC programme",
      href: "/contact?source=industries-innovators-hero-scope",
      variant: "primary",
    },
    secondaryCta: {
      label: "Ask about Canadian market planning",
      href: "/contact?source=industries-innovators-hero-canadian",
      variant: "outline",
    },
  },
  painPoints: {
    eyebrow: "The pain",
    heading: "Three patterns we see across innovator programmes",
    lede: "Innovator teams are usually small, deep, and focused on the molecule. Three gaps tend to appear at the interface between the science and the regulatory submission.",
    items: [
      {
        id: "cmc-bandwidth",
        label: "CMC bandwidth at the pivotal-trial inflection",
        description:
          "The team that carried the molecule through preclinical and early clinical work is often too small to also author a Module 3 package against ICH Q8–Q11 while the pivotal trial is being designed. Outsourcing the CMC authoring pass is usually the right answer; finding a vendor who will work inside the sponsor's quality system instead of a parallel one is harder.",
      },
      {
        id: "ich-quality-depth",
        label: "ICH quality-framework depth",
        description:
          "Innovator submissions are evaluated against the full ICH quality suite — Q8 for formulation development, Q9 for risk, Q10 for quality systems, Q11 for drug substance development. The CMC narrative has to tell a coherent story across all four. Piecing that narrative together from separate vendor streams produces a package that reads like it was pieced together from separate vendor streams.",
      },
      {
        id: "canadian-planning",
        label: "Canadian market planning that arrives late",
        description:
          "Canadian market authorization is often scoped as a Phase 3 or post-approval consideration. When the decision lands, the innovator team discovers that Canadian NDS filing runs through Health Canada, has its own Module 1 structure, and benefits from a Drug Establishment Licence on file. Standing one up inside an active regulatory cycle is difficult; using an existing DEL-holder's surface is usually faster.",
      },
    ],
  },
  offering: {
    eyebrow: "Our tailored offering",
    heading: "Three service trees, shaped for an innovator workflow",
    lede: "The three service trees below are the ones an innovator programme draws from most often. The detail pages describe the work itself — the industry page describes how the work gets shaped for an innovator's operating rhythm.",
    columns: [
      {
        id: "pharmdev",
        label: "Pharmaceutical development",
        description:
          "Formulation work under ICH Q8 quality-by-design principles, process development, and scale-up bridging. Development-phase analytical work is authored into the same record that will carry release testing, so the package going into Module 3 and the package going into release are the same package.",
        serviceHref: "/services/pharmaceutical-development",
        serviceLabel: "See pharmaceutical development",
      },
      {
        id: "analytical",
        label: "Analytical services",
        description:
          "Method development and validation to ICH Q2(R2), release and stability testing under ICH Q1A(R2), and impurities work under ICH Q3A/B/D. Stability data is authored with an eye toward Module 3 tables rather than a standalone technical report.",
        serviceHref: "/services/analytical-services",
        serviceLabel: "See analytical services",
      },
      {
        id: "regulatory",
        label: "Regulatory services",
        description:
          "Module 2 summaries and Module 3 CMC authoring to the target agency's current eCTD technical specification. Canadian NDS support filed under our Health Canada DEL when Canadian scope is added. Pre-submission interactions handled in coordination with the sponsor's regulatory lead.",
        serviceHref: "/services/regulatory-services",
        serviceLabel: "See regulatory services",
      },
    ],
    closingNote:
      "Innovator engagements usually start with an analytical or CMC-authoring scope and widen into regulatory support as the programme approaches submission. The shape is deliberate — the same quality record carries the work the whole way across.",
  },
  regulatory: {
    eyebrow: "Regulatory context",
    heading: "The frameworks an innovator programme runs against",
    lede: "Four public frameworks anchor most innovator engagements. Each is cited from its primary source, with \"as of 2026-04-23\" where the claim references current agency expectations rather than a stable statutory text.",
    topics: [
      {
        id: "nda-314",
        heading: "NDA submission framework — 21 CFR Part 314",
        body: "New Drug Applications are filed under 21 CFR Part 314. Our Module 2 and Module 3 authoring is shaped against the current regulation text and the agency's prevailing eCTD technical specification. As of 2026-04-23 the ecfr.gov version of Part 314 is the operative text for the filing pathway Propharmex authors against.",
        status: "alignment",
        source: CFR_PART_314,
      },
      {
        id: "ctd-ich-m4",
        heading: "CTD structure — ICH M4",
        body: "The Common Technical Document and its electronic form (eCTD) are specified under ICH M4. Module 1 is regional (US, Canada, ICH, WHO PQ and others); Modules 2–5 are harmonised. Propharmex authors Modules 2 and 3 against ICH M4 and assembles Module 1 to the target agency's regional specification at filing time. As of 2026-04-23 the ICH M4 specification is the operative framework.",
        status: "alignment",
        source: ICH_M4_ECTD,
      },
      {
        id: "cgmp-211",
        heading: "cGMP for finished pharmaceuticals — 21 CFR Part 211",
        body: "Manufacturing and control expectations for finished pharmaceuticals filed under an NDA are anchored on 21 CFR Part 211. Our CMC authoring reflects the Part 211 framework in how process and control strategy is described in Module 3. As of 2026-04-23 the ecfr.gov version of Part 211 is the operative text.",
        status: "alignment",
        source: CFR_PART_211,
      },
      {
        id: "del-anchor",
        heading: "Canadian establishment licence anchor",
        body: "Canadian scope on an innovator programme — import, release, distribution, Canadian market authorization holding — is exercised under our Health Canada Drug Establishment Licence. The licence is listed on the Drug and Health Product Register and can be verified today. Sponsors using our DEL as a surface avoid standing one up themselves inside an active submission cycle.",
        status: "confirmed",
        source: HEALTH_CANADA_DEL_REGISTER,
      },
    ],
  },
  caseRail: {
    eyebrow: "Worked patterns",
    heading: "What innovator work looks like on our desk",
    lede: "Named, permission-cleared case studies land with Prompt 14. The teasers below describe the pattern rather than a specific client, in line with our policy of using client names only where permission is granted.",
    teasers: [
      {
        id: "nda-module-3",
        service: "NDA Module 3 authoring",
        title: "Module 3 CMC package for a first-in-class small-molecule NDA",
        body: "Drug substance and drug product sections authored to current FDA eCTD expectations, integrated with the sponsor's ongoing clinical programme and submitted by the sponsor. Analytical bridging kept development and release data in one record.",
        status: "under-confirmation",
      },
      {
        id: "elemental-impurity",
        service: "ICH Q3D risk assessment",
        title: "Elemental impurity risk assessment for a branded oral solid",
        body: "Route-based risk assessment under ICH Q3D, elemental-impurity method development and validation, and the corresponding Module 3 narrative. Held under NDA pending the sponsor's consent to publish.",
        status: "under-confirmation",
      },
      {
        id: "canadian-scope-add",
        service: "Canadian scope addition",
        title: "Adding Canadian NDS scope to a US-filed innovator programme",
        body: "An existing US-filed innovator product extended into Canadian scope under our Health Canada DEL — import, release and market authorization holding handled by Propharmex without disturbing the sponsor's US operations.",
        status: "under-confirmation",
      },
    ],
    cta: {
      label: "Start a scoping conversation",
      href: "/contact?source=industries-innovators-caserail",
      variant: "primary",
    },
  },
  faq: {
    eyebrow: "Frequently asked",
    heading: "What innovator teams usually ask first",
    lede: "The answers below tend to determine fit before anyone draws up a scope. They are the questions that most often decide whether the engagement is structured correctly from the start.",
    items: [
      {
        id: "q-novel-excipients",
        question:
          "Can you handle novel excipients, or do you require precedent of use?",
        answer:
          "Both. Where a formulation uses only listed or precedent-of-use excipients the path is straightforward. Where a novel excipient is required, we structure the CMC and toxicology-facing narrative to the ICH Q8 and agency-specific expectations for novel-excipient justification. The additional authoring effort is real and we scope it as a separate line item rather than burying it.",
      },
      {
        id: "q-integration",
        question:
          "How do you integrate CMC authoring with our in-house clinical programme?",
        answer:
          "The sponsor's regulatory lead owns the submission. We author into their document-management system, attend CMC sub-team meetings, and work to their change-control conventions. The integration model is deliberately low-surface — our authoring is a component in the sponsor's regulatory package, not a parallel programme.",
      },
      {
        id: "q-pre-submission",
        question:
          "Do you support pre-submission interactions — pre-IND, EOP2, Type C meetings — or only submission authoring?",
        answer:
          "Both, with a clear handoff. We prepare the CMC portions of briefing documents and support the sponsor's regulatory lead through the meeting preparation. The agency-facing role stays with the sponsor. When Canadian pre-submission interaction is required, that runs through the regulatory team under our DEL.",
      },
      {
        id: "q-canadian-market",
        question:
          "How do we plan Canadian market authorization alongside a US-primary NDA?",
        answer:
          "Usually as a staged plan. The NDS can be filed after US approval with the US CMC package as a basis, with the Canadian-specific Module 1 assembled fresh. Filing from our DEL means the sponsor does not need to stand up a Canadian establishment licence for the NDS or for post-approval distribution. The service standard for a new DEL is 250 calendar days as of 2026-04-23.",
      },
    ],
  },
  related: {
    eyebrow: "Adjacent reading",
    heading: "Service trees an innovator programme draws from",
    lede: "The industry page describes the engagement; the service pages describe the work itself. Start where your next decision sits.",
    links: [
      {
        id: "pharmdev",
        label: "Pharmaceutical development",
        description:
          "Formulation, process development and scale-up — authored into the record that carries the CMC package.",
        href: "/services/pharmaceutical-development",
      },
      {
        id: "analytical",
        label: "Analytical services",
        description:
          "Method development and validation, release and stability testing, impurities work under the ICH quality suite.",
        href: "/services/analytical-services",
      },
      {
        id: "regulatory",
        label: "Regulatory services",
        description:
          "Module 2/3 authoring, eCTD assembly, and DEL-anchored Canadian regulatory handling.",
        href: "/services/regulatory-services",
      },
    ],
  },
  closing: {
    eyebrow: "Start a conversation",
    heading: "Scope an innovator programme with one quality system behind it",
    body: "Tell us where the molecule is — early clinical, pivotal-ready, approaching submission, or already filed in one market and heading for another — and we will shape a CMC and analytical scope around what is real rather than what is hypothetical. The Canadian-anchored operating model is how the submission ends up on the regulator's desk with a single coherent quality narrative behind it.",
    primaryCta: {
      label: "Scope an innovator CMC programme",
      href: "/contact?source=industries-innovators-closing-scope",
      variant: "primary",
    },
    secondaryCta: {
      label: "Ask about Canadian market planning",
      href: "/contact?source=industries-innovators-closing-canadian",
      variant: "outline",
    },
    regulatoryNote: HEALTH_CANADA_DEL_REGISTER,
  },
};

/* -------------------------------------------------------------------------- */
/*  Leaf content — cdmo-partners                                              */
/* -------------------------------------------------------------------------- */

const CDMO_PARTNERS: IndustryLeafContent = {
  slug: "cdmo-partners",
  label: "CDMO partners",
  crumbLabel: "CDMO partners",
  metaTitle: "CDMO Partners — Propharmex Industries",
  metaDescription:
    "Canadian establishment-licence surface, regulatory bandwidth and analytical extension for contract manufacturers serving innovator and generic sponsors — a complement to your core manufacturing, not a competitor.",
  ogTitle: "CDMO Partners — Propharmex",
  ogDescription:
    "The Canadian-anchored operating model applied to contract manufacturing: DEL-anchored Canadian scope and regulatory bandwidth without standing up your own establishment licence.",
  hero: {
    eyebrow: "Industries · CDMO partners",
    headline:
      "Canadian scope and regulatory bandwidth, without standing up your own DEL.",
    valueProp:
      "A complement, not a competitor — Canadian establishment-licence surface, regulatory authoring bandwidth, and analytical extension for CDMOs whose core business is manufacturing.",
    lede: "Most CDMOs are built around a set of dosage-form platforms and a core regulatory surface that fits their primary markets. Canadian market scope, or sudden analytical or regulatory bandwidth needs from a sponsor, can fall outside that core without being worth building in-house. Propharmex's operating model is to plug into that gap — our Health Canada Drug Establishment Licence as an establishment-licensed surface for Canadian scope, our analytical and CMC bench for authoring bandwidth, and one quality system end to end so the CDMO's sponsor sees one coherent record rather than a subcontracted patchwork.",
    stats: [
      { label: "Licensed surface", value: "Mississauga DEL (confirmed)" },
      { label: "cGMP framework", value: "21 CFR Part 211" },
      { label: "CTD structure", value: "ICH M4 eCTD" },
    ],
    primaryCta: {
      label: "Scope a CDMO partnership",
      href: "/contact?source=industries-cdmo-hero-scope",
      variant: "primary",
    },
    secondaryCta: {
      label: "Ask about Canadian scope addition",
      href: "/contact?source=industries-cdmo-hero-canadian",
      variant: "outline",
    },
  },
  painPoints: {
    eyebrow: "The pain",
    heading: "Three patterns we see across CDMO partnerships",
    lede: "CDMOs rarely lose a bid on capability. They lose it on scope gaps — a missing licence, an analytical window their bench cannot take on fast enough, or a regulatory authoring lift their team is not structured for.",
    items: [
      {
        id: "del-gap",
        label: "Canadian DEL gap",
        description:
          "A sponsor request or tender requires a Canadian establishment licence holder somewhere in the chain. Building a Canadian regulatory and quality footprint from scratch is a multi-year investment; losing the bid for want of one is a short-term revenue hit. Using a DEL-anchored partner is usually the right compromise.",
      },
      {
        id: "regulatory-bandwidth",
        label: "Regulatory authoring bandwidth",
        description:
          "The CDMO's regulatory team is sized for its core workflow — not for a sudden Module 3 authoring lift on a sponsor-driven scope change, or for a Canadian NDS that sits outside the team's usual filing geography. Extending an existing team usually beats standing up a parallel one.",
      },
      {
        id: "tech-transfer-coordination",
        label: "Tech transfer coordination",
        description:
          "Moving a product in or out of a CDMO site touches analytical methods, stability, CMC authoring and regulatory change control. Coordinating those streams across two organisations — CDMO and sponsor — is harder than the technical work itself. A third party that owns the bridging analytical and authoring record reduces the coordination surface.",
      },
    ],
  },
  offering: {
    eyebrow: "Our tailored offering",
    heading: "Three service trees, shaped for a CDMO partnership",
    lede: "The three service trees below are the ones a CDMO engagement draws from most often. The framing is complementary — we are not taking on your manufacturing; we are filling the gaps around it.",
    columns: [
      {
        id: "regulatory",
        label: "Regulatory services — DEL-anchored",
        description:
          "Canadian scope addition under our Health Canada Drug Establishment Licence: import-for-further-dose-form, release, distribution, and Canadian market authorization holding. Module 1 assembly to Health Canada's current regional specification. Regulatory-strategy support for cross-market scope decisions.",
        serviceHref: "/services/regulatory-services/health-canada-del",
        serviceLabel: "See Health Canada DEL support",
      },
      {
        id: "analytical",
        label: "Analytical services",
        description:
          "Method development and validation, release and stability testing, impurities work — sized to extend the CDMO's bench during a project peak, or to take on work outside the CDMO's core analytical platforms. Same quality record as the regulatory authoring side.",
        serviceHref: "/services/analytical-services",
        serviceLabel: "See analytical services",
      },
      {
        id: "pharmdev",
        label: "Pharmaceutical development — tech transfer",
        description:
          "Tech transfer support into or out of the CDMO's manufacturing site, with analytical bridging that keeps release specifications consistent across the transfer. The CDMO owns the manufacturing; we own the authoring and bridging record.",
        serviceHref: "/services/pharmaceutical-development",
        serviceLabel: "See pharmaceutical development",
      },
    ],
    closingNote:
      "The partnership shape is deliberate — Propharmex does not build manufacturing infrastructure that would compete with the CDMO's core business. We extend the regulatory and analytical surface around it.",
  },
  regulatory: {
    eyebrow: "Regulatory context",
    heading: "The frameworks a CDMO partnership runs against",
    lede: "Four public frameworks anchor most CDMO engagements — the cGMP baseline both sides operate under, the CTD structure any filing lands in, the DMF pathway where API supply is involved, and the Canadian establishment-licence surface we bring to the partnership.",
    topics: [
      {
        id: "cgmp-211",
        heading: "cGMP baseline — 21 CFR Part 211",
        body: "Both parties in a CDMO engagement operate to a cGMP baseline. 21 CFR Part 211 is the operative US text for finished pharmaceuticals; the corresponding ICH Q7 and agency-specific guidelines cover API manufacturing. Our analytical and CMC work is authored to reflect the Part 211 framework. As of 2026-04-23 the ecfr.gov version of Part 211 is the operative text.",
        status: "alignment",
        source: CFR_PART_211,
      },
      {
        id: "ctd-ich-m4",
        heading: "CTD structure — ICH M4",
        body: "Regulatory authoring we provide on a CDMO engagement — Module 2 summaries, Module 3 CMC content, Module 1 regional assembly — is shaped against ICH M4. The CDMO's sponsor receives a submission package that integrates cleanly with their existing dossier rather than a bolted-on module. As of 2026-04-23 the ICH M4 specification is the operative framework.",
        status: "alignment",
        source: ICH_M4_ECTD,
      },
      {
        id: "dmf-314-420",
        heading: "DMF-facing support — 21 CFR 314.420",
        body: "Where a CDMO partnership serves a generics sponsor with API sourced from a separate manufacturer, DMF Type II referencing under 21 CFR 314.420 usually enters the picture. Propharmex supports the authoring, referencing and letter-of-authorization handling on the DMF-facing side. As of 2026-04-23 the ecfr.gov version is the operative text.",
        status: "alignment",
        source: CFR_314_420_DMF,
      },
      {
        id: "del-anchor",
        heading: "Canadian establishment licence anchor",
        body: "Our Health Canada Drug Establishment Licence is listed on the Drug and Health Product Register and is the licensed surface from which Canadian-scope activity — import, release, distribution, market authorization holding — is exercised in a partnership. CDMOs using this surface avoid a 250 calendar-day licence buildout on their own Canadian footprint (Health Canada service standard, as of 2026-04-23).",
        status: "confirmed",
        source: HEALTH_CANADA_DEL_REGISTER,
      },
    ],
  },
  caseRail: {
    eyebrow: "Worked patterns",
    heading: "What CDMO partnerships look like on our desk",
    lede: "Named, permission-cleared case studies land with Prompt 14. The teasers below describe the pattern rather than a specific CDMO partner, consistent with our policy of using client and partner names only where permission is granted.",
    teasers: [
      {
        id: "canadian-scope-bid",
        service: "Canadian scope surface",
        title: "Adding Canadian DEL surface to a US CDMO's bid",
        body: "A US-primary contract manufacturer winning a tender that required a Canadian establishment-licence holder somewhere in the chain. Propharmex supplied our Health Canada DEL as the import, release and distribution surface; the CDMO retained all manufacturing and analytical work in the US.",
        status: "under-confirmation",
      },
      {
        id: "analytical-extension",
        service: "Analytical bench extension",
        title: "Analytical bench extension during a stability-campaign peak",
        body: "A CDMO's in-house analytical bench was at capacity during a multi-product stability campaign. Propharmex took on a subset of the release and stability panels under a bridging analytical protocol, with results authored into the CDMO's quality record rather than a standalone report.",
        status: "under-confirmation",
      },
      {
        id: "tech-transfer-support",
        service: "Tech transfer bridging",
        title: "Tech transfer out of a CDMO site into a sponsor-preferred site",
        body: "A tech transfer moved from a CDMO's platform site to a sponsor-preferred commercial site. Propharmex authored the bridging analytical and CMC narrative, ran comparability testing, and prepared the regulatory change-control filing. The CDMO and receiving site owned the process work.",
        status: "under-confirmation",
      },
    ],
    cta: {
      label: "Start a scoping conversation",
      href: "/contact?source=industries-cdmo-caserail",
      variant: "primary",
    },
  },
  faq: {
    eyebrow: "Frequently asked",
    heading: "What CDMO partners usually ask first",
    lede: "Partnership questions tend to be about scope and competition boundaries. The answers below are the ones that tend to determine whether the partnership is structured correctly.",
    items: [
      {
        id: "q-competition",
        question:
          "Are you going to compete with us on manufacturing scope inside the partnership?",
        answer:
          "No. Propharmex is not a commercial manufacturer. Our operating surface is regulatory, analytical and CMC authoring, plus the Canadian establishment licence for import, release and distribution scope. Manufacturing stays on the CDMO's side of the engagement; we are structured to complement that rather than to compete with it.",
      },
      {
        id: "q-del-scope",
        question:
          "What scope on our product can be exercised under your Canadian DEL?",
        answer:
          "Our Health Canada Drug Establishment Licence covers import, release, distribution and market authorization holding for scope that is added to it via a standard amendment process. The specific scope a partner product can exercise is dictated by the licence schedule and the product's own market authorization. We scope this case-by-case rather than by a generic answer.",
      },
      {
        id: "q-quality-systems",
        question:
          "How do our respective quality systems interoperate?",
        answer:
          "The CDMO's QMS owns manufacturing; Propharmex's QMS owns the regulatory-authoring and DEL-anchored activities. Engagement agreements spell out the quality-agreement boundaries. The sponsor sees one submission package and one release record, not two.",
      },
      {
        id: "q-confidentiality",
        question:
          "How is sponsor confidentiality handled when you sit between us and the end sponsor?",
        answer:
          "Sponsor confidentiality is governed by tripartite NDAs where needed and by the CDMO's primary contractual relationship with the sponsor. Propharmex's role is typically disclosed to the sponsor as a named subcontractor in the quality agreement; we do not engage the sponsor independently of the CDMO unless the partnership explicitly calls for it.",
      },
    ],
  },
  related: {
    eyebrow: "Adjacent reading",
    heading: "Service trees a CDMO partnership draws from",
    lede: "The industry page describes the partnership posture; the service pages describe the work itself. Start where your next scope decision sits.",
    links: [
      {
        id: "regulatory-del",
        label: "Health Canada DEL support",
        description:
          "DEL-anchored Canadian scope for import, release, distribution and market authorization holding.",
        href: "/services/regulatory-services/health-canada-del",
      },
      {
        id: "analytical",
        label: "Analytical services",
        description:
          "Method development, validation, release and stability testing — sized to extend a CDMO's bench during project peaks.",
        href: "/services/analytical-services",
      },
      {
        id: "pharmdev",
        label: "Pharmaceutical development",
        description:
          "Tech transfer and bridging analytical support into or out of a CDMO manufacturing site.",
        href: "/services/pharmaceutical-development",
      },
    ],
  },
  closing: {
    eyebrow: "Start a conversation",
    heading: "Scope a CDMO partnership with clear competitive boundaries",
    body: "Tell us where the gap is — a bid that requires a Canadian establishment licence holder, an analytical window the bench cannot cover, a tech transfer that needs a bridging authoring record — and we will shape a scope around the complement, not the overlap. Partnership terms are written so each side owns its part of the record cleanly.",
    primaryCta: {
      label: "Scope a CDMO partnership",
      href: "/contact?source=industries-cdmo-closing-scope",
      variant: "primary",
    },
    secondaryCta: {
      label: "Ask about Canadian scope addition",
      href: "/contact?source=industries-cdmo-closing-canadian",
      variant: "outline",
    },
    regulatoryNote: HEALTH_CANADA_DEL_REGISTER,
  },
};

/* -------------------------------------------------------------------------- */
/*  Leaf content — governments-and-ngos                                       */
/*                                                                            */
/*  Practice area under deliberate development. No case-study rail. All       */
/*  regulatory topics carry `alignment` status — this page does not claim a   */
/*  prequalification history Propharmex does not hold.                        */
/* -------------------------------------------------------------------------- */

const GOVERNMENTS_AND_NGOS: IndustryLeafContent = {
  slug: "governments-and-ngos",
  label: "Governments and NGOs",
  crumbLabel: "Governments and NGOs",
  metaTitle: "Governments and NGOs — Propharmex Industries",
  metaDescription:
    "A practice area in development: capability alignment for institutional procurement — WHO Prequalification, UNICEF Supply Division and Global Fund QA frameworks, supported by a Canadian DEL-anchored quality system.",
  ogTitle: "Governments and NGOs — Propharmex",
  ogDescription:
    "An institutional-procurement practice area we are actively developing — capability alignment toward WHO PQ, UNICEF SD and Global Fund frameworks.",
  hero: {
    eyebrow: "Industries · Governments and NGOs",
    headline: "Capability alignment for institutional procurement.",
    valueProp:
      "A practice area we are actively developing — our Canadian DEL-anchored quality system and authored analytical and CMC record are aligned to the documentation expectations of institutional buyers, without a prequalification history we do not yet hold.",
    lede: "Institutional buyers — WHO, UNICEF Supply Division, The Global Fund, national essential-medicines procurement programmes — evaluate vendors against published quality-assurance frameworks and prequalification procedures. Propharmex is developing this practice area deliberately. Our DEL-anchored quality system and our analytical and CMC record are aligned to the documentation and auditability expectations these frameworks ask for. We do not currently hold WHO Prequalification on a product; we are not on the UNICEF Supply Division medicines roster. This page describes the alignment rather than a history of awards.",
    stats: [
      { label: "Practice status", value: "In development" },
      { label: "QMS anchor", value: "Mississauga DEL (confirmed)" },
      { label: "Alignment frameworks", value: "WHO PQ · UNICEF SD · Global Fund" },
    ],
    primaryCta: {
      label: "Start a capability alignment conversation",
      href: "/contact?source=industries-gov-ngo-hero-scope",
      variant: "primary",
    },
    secondaryCta: {
      label: "Ask what we are not claiming",
      href: "/contact?source=industries-gov-ngo-hero-claims",
      variant: "outline",
    },
  },
  painPoints: {
    eyebrow: "The pain",
    heading: "Three patterns we hear from institutional procurement",
    lede: "Institutional buyers repeatedly describe three gaps between their documentation expectations and the vendor submissions they receive. These are the gaps the alignment conversation is built around.",
    items: [
      {
        id: "documentation-depth",
        label: "Tender-grade documentation depth",
        description:
          "Tender submissions commonly ask for a consolidated quality narrative — QMS description, site authority, analytical method validation, stability record, change-control history — stitched into a single package. Vendors who treat tender packaging as a copy-paste assembly from a standard dossier tend to miss the depth expected by evaluators experienced with WHO PQ and Global Fund QA review.",
      },
      {
        id: "qms-visibility",
        label: "QMS visibility across two geographies",
        description:
          "A vendor operating from multiple sites has to demonstrate that the quality system and the regulatory authority are consistent across them. Separate quality manuals and separate audit trails — even if they individually pass — are a flag for institutional evaluators. One QMS under one authority reduces the review surface.",
      },
      {
        id: "traceability",
        label: "Lot-level traceability and post-market commitments",
        description:
          "Institutional procurement commonly requires lot-level traceability, defined recall commitments, and participation in post-market reporting schemes (pharmacovigilance, product complaints). These expectations are most easily honoured when the quality system that authored the submission is the same one running release and distribution.",
      },
    ],
  },
  offering: {
    eyebrow: "Our capability alignment",
    heading: "Three service trees aligned to institutional expectations",
    lede: "These are the three service trees an institutional engagement would draw from. The framing below describes capability alignment — what the operating model already supports — not a record of awarded tenders, which we do not yet have.",
    columns: [
      {
        id: "analytical",
        label: "Analytical services",
        description:
          "Method development and validation to ICH Q2(R2), release and stability testing under ICH Q1A(R2), impurities work under ICH Q3A/B/D. The analytical record is authored with institutional-evaluation expectations in mind — traceable, reproducible, and audit-ready.",
        serviceHref: "/services/analytical-services",
        serviceLabel: "See analytical services",
      },
      {
        id: "regulatory",
        label: "Regulatory services",
        description:
          "Module 2 summaries and Module 3 CMC authoring to ICH M4, with Module 1 assembled to the target institutional stream's specification (WHO PQ Module 1 differs from Health Canada Module 1 differs from the EU). DEL-anchored Canadian regulatory authority supports the establishment side of the submission.",
        serviceHref: "/services/regulatory-services",
        serviceLabel: "See regulatory services",
      },
      {
        id: "pharmdev",
        label: "Pharmaceutical development",
        description:
          "Formulation and process development with development-phase stability and analytical bridging authored to the same standard as the commercial release record. Institutional buyers tend to read the development narrative closely as a read on engineering discipline.",
        serviceHref: "/services/pharmaceutical-development",
        serviceLabel: "See pharmaceutical development",
      },
    ],
    closingNote:
      "The alignment is real; the history is still being written. An institutional engagement with Propharmex today is a capability and documentation conversation, not a reference-check conversation.",
  },
  regulatory: {
    eyebrow: "Alignment frameworks",
    heading: "Public frameworks our operating model is aligned to",
    lede: "Four public frameworks define the institutional-procurement landscape Propharmex's operating model is aligned to. Each topic below is framed as an alignment claim — we describe our operating posture against the framework, without claiming a prequalification status we do not hold.",
    topics: [
      {
        id: "who-pq",
        heading: "WHO Prequalification — medicines stream",
        body: "The WHO Prequalification Programme evaluates medicines against WHO's medicines QA norms and makes them visible to UN procurement agencies and funded programmes. Propharmex's QMS, analytical record-keeping and manufacturing-site documentation are aligned to the expectations of this evaluation. We do not currently hold WHO PQ on a product; this is a capability claim, not a prequalification claim. As of 2026-04-23 the referenced programme page is the operative entry point.",
        status: "alignment",
        source: WHO_PREQUALIFICATION,
      },
      {
        id: "unicef-sd",
        heading: "UNICEF Supply Division — medicines procurement",
        body: "UNICEF Supply Division procures essential medicines against published product specifications and long-term-agreement processes. Our capability alignment is with the documentation and audit expectations published on the SD portal rather than a history of SD awards, which we do not yet have. As of 2026-04-23 the referenced programme page is the operative entry point.",
        status: "alignment",
        source: UNICEF_SUPPLY_DIVISION,
      },
      {
        id: "global-fund-qa",
        heading: "Global Fund QA Policy",
        body: "The Global Fund's Quality Assurance Policy for Pharmaceutical Products defines the QA categories acceptable for Global Fund–financed procurement. The policy describes the evidence chain expected — prequalification status, stringent regulatory authority authorization, or an alternative ERP-reviewed pathway. Propharmex's operating model is aligned to the evidence-chain expectations; a specific product's eligibility is a case-by-case conversation. As of 2026-04-23 the referenced policy is the operative document.",
        status: "alignment",
        source: GLOBAL_FUND_QA_POLICY,
      },
      {
        id: "del-context",
        heading: "Health Canada establishment licence — context",
        body: "Propharmex operates under a Health Canada Drug Establishment Licence held in Mississauga and listed on the Drug and Health Product Register. Licensed-establishment status under a stringent regulatory authority is context that some institutional frameworks weigh in their evidence chain (for example as one route within the Global Fund QA Policy). It is context for the engagement, not a claim of prequalification under any institutional programme.",
        status: "alignment",
        source: HEALTH_CANADA_DEL_REGISTER,
      },
    ],
  },
  faq: {
    eyebrow: "Frequently asked",
    heading: "Questions we expect an institutional buyer to ask",
    lede: "Institutional procurement asks careful questions because the downstream consequences of a wrong vendor are large. The answers below are the ones that most often determine whether a capability alignment conversation is worth continuing.",
    items: [
      {
        id: "q-pq-history",
        question:
          "Do you currently hold WHO Prequalification on any product?",
        answer:
          "No. Propharmex does not currently hold WHO Prequalification on a product, and this page does not imply otherwise. Our operating model is aligned to the QA norms WHO PQ evaluates against, and we are actively developing the practice area. Any formal PQ process would be initiated product-by-product with the sponsor owning the programme.",
      },
      {
        id: "q-long-term-agreements",
        question:
          "Are you on the UNICEF Supply Division or Global Fund approved-supplier lists?",
        answer:
          "No, not currently. Our operating model is aligned to the documentation and audit expectations these programmes publish, but we do not have a history of awarded long-term agreements or procurements under them. An institutional engagement today is a capability and documentation conversation rather than a reference-check conversation.",
      },
      {
        id: "q-canadian-stringent",
        question:
          "Does your Canadian establishment licence count as stringent regulatory authority status under the Global Fund QA Policy?",
        answer:
          "Health Canada is recognised as a stringent regulatory authority in several international QA frameworks, and product-specific market authorization under Health Canada is one of the evidence routes the Global Fund QA Policy describes. Whether a specific product qualifies under the policy is a case-by-case determination that depends on the product's authorisation and the Fund's current policy text (as of 2026-04-23). We are honest about this being a case-by-case question rather than a blanket yes.",
      },
      {
        id: "q-practice-development",
        question:
          "What does 'developing this practice area' actually mean for us as a buyer?",
        answer:
          "It means we are building toward institutional engagements with the operating model, the QMS and the manufacturing footprint already in place, but without a history of awarded tenders or prequalifications yet. A first engagement is therefore a deliberate collaboration — capability walk-throughs, documentation review against the target framework, and realistic scoping of what a first programme would look like. If that sort of first-of-kind work is not a fit for your timeline, we would rather say so early.",
      },
    ],
  },
  related: {
    eyebrow: "Adjacent reading",
    heading: "Service trees an institutional engagement would draw from",
    lede: "Institutional engagements would be composed from the same service trees that support our commercial work. The alignment story is that the work is the same; only the evaluator changes.",
    links: [
      {
        id: "analytical",
        label: "Analytical services",
        description:
          "Method development, validation, release and stability work authored to institutional-review standards.",
        href: "/services/analytical-services",
      },
      {
        id: "regulatory",
        label: "Regulatory services",
        description:
          "Module 2/3 authoring, regional Module 1 assembly for institutional streams, DEL-anchored Canadian regulatory authority.",
        href: "/services/regulatory-services",
      },
      {
        id: "pharmdev",
        label: "Pharmaceutical development",
        description:
          "Formulation and process development with the engineering discipline institutional evaluators read closely.",
        href: "/services/pharmaceutical-development",
      },
    ],
  },
  closing: {
    eyebrow: "Start a conversation",
    heading: "Talk to us about a first institutional engagement",
    body: "A capability alignment conversation is a better first step than a tender submission. Tell us which framework matters most — WHO PQ, UNICEF SD, Global Fund, or a national essential-medicines buyer — and we will walk through the documentation against that framework honestly, including the parts that still need to be built. The conversation is useful even if we conclude the timing is wrong for a first programme.",
    primaryCta: {
      label: "Start a capability alignment conversation",
      href: "/contact?source=industries-gov-ngo-closing-scope",
      variant: "primary",
    },
    secondaryCta: {
      label: "Ask what we are not claiming",
      href: "/contact?source=industries-gov-ngo-closing-claims",
      variant: "outline",
    },
    regulatoryNote: HEALTH_CANADA_DEL_REGISTER,
  },
};

/* -------------------------------------------------------------------------- */
/*  Leaf content — clinical-trial-sponsors                                    */
/* -------------------------------------------------------------------------- */

const CLINICAL_TRIAL_SPONSORS: IndustryLeafContent = {
  slug: "clinical-trial-sponsors",
  label: "Clinical trial sponsors",
  crumbLabel: "Clinical trial sponsors",
  metaTitle: "Clinical Trial Sponsors — Propharmex Industries",
  metaDescription:
    "Investigational supply, analytical release, and CTA/IND regulatory handling for sponsors running Canadian and multi-jurisdictional trials — DEL-anchored, ICH E6(R3) aligned.",
  ogTitle: "Clinical Trial Sponsors — Propharmex",
  ogDescription:
    "The Canadian-anchored operating model applied to clinical-trial operations: investigational supply executed by Propharmex, Canadian CTA handling under our Health Canada DEL.",
  hero: {
    eyebrow: "Industries · Clinical trial sponsors",
    headline:
      "Investigational supply and CTA handling, under one quality system.",
    valueProp:
      "Investigational product manufacturing coordination, analytical release, and Canadian Clinical Trial Application support — executed by Propharmex, filed and inspection-hosted under our Health Canada Drug Establishment Licence.",
    lede: "Clinical-trial sponsors live on two clocks: the protocol's enrolment schedule and the regulator's review queue. Propharmex's operating model shortens the distance between them — investigational-product CMC content authored and analytical release run by Propharmex; the regulatory team handles the Canadian Clinical Trial Application and the establishment-licence side of investigational supply. Everything runs under one QMS, so the record that supports release is the same record that supports the CTA.",
    stats: [
      { label: "GCP framework", value: "ICH E6(R3)" },
      { label: "CTD structure", value: "ICH M4 eCTD" },
      { label: "Canadian anchor", value: "Mississauga DEL (confirmed)" },
    ],
    primaryCta: {
      label: "Scope an investigational supply programme",
      href: "/contact?source=industries-trials-hero-scope",
      variant: "primary",
    },
    secondaryCta: {
      label: "Ask about Canadian CTA handling",
      href: "/contact?source=industries-trials-hero-cta",
      variant: "outline",
    },
  },
  painPoints: {
    eyebrow: "The pain",
    heading: "Three patterns we see across clinical-trial programmes",
    lede: "Investigational-supply programmes fail in predictable ways. The three patterns below are the ones that most often turn an enrolment plan into an enrolment delay.",
    items: [
      {
        id: "supply-timing",
        label: "Investigational supply timing against enrolment",
        description:
          "Kits need to arrive at sites before first-patient-in. Drug product release, labelling, packaging, stability-window planning and QP-like release review all sit on a critical path that compresses as the protocol finalises. Late release decisions cascade into enrolment slips that are difficult to recover.",
      },
      {
        id: "bioanalytical-readiness",
        label: "Bioanalytical method readiness for PK sampling",
        description:
          "Protocols that include PK sampling require a bioanalytical method validated to the target regulatory expectation before samples start arriving at the lab. Method development and validation that starts after first-patient-in produces either a delay or a re-assay risk no sponsor wants in a pivotal dataset.",
      },
      {
        id: "canadian-cta",
        label: "Canadian CTA handling alongside US or global submissions",
        description:
          "Sponsors running a global trial with Canadian sites need a Canadian Clinical Trial Application handled alongside the US IND or the ROW submissions. The filing itself is manageable; the operational establishment-licence question — who imports and releases the investigational product in Canada — is where programmes stall if it is not solved early.",
      },
    ],
  },
  offering: {
    eyebrow: "Our tailored offering",
    heading: "Three service trees, shaped for a trial sponsor's rhythm",
    lede: "The three service trees below are the ones clinical-trial programmes draw from most often. The detail pages describe the work; the industry page describes how the work fits a trial-sponsor's operating rhythm.",
    columns: [
      {
        id: "pharmdev-supplies",
        label: "Pharmaceutical development — investigational supplies",
        description:
          "Investigational product planning, clinical-trial-material manufacturing coordination, labelling and packaging oversight, and release against the protocol's requirements. Scope is shaped to match the trial's enrolment schedule rather than a generic release cadence.",
        serviceHref: "/services/pharmaceutical-development",
        serviceLabel: "See pharmaceutical development",
      },
      {
        id: "analytical",
        label: "Analytical services",
        description:
          "Bioanalytical method development and validation for PK sampling, release testing of investigational product, and in-use stability testing where protocols require it. Analytical records live in the same QMS the release decisions are authored against.",
        serviceHref: "/services/analytical-services",
        serviceLabel: "See analytical services",
      },
      {
        id: "regulatory",
        label: "Regulatory services — Canadian CTA",
        description:
          "Canadian Clinical Trial Application authoring and submission, coordination with the sponsor's US IND or global regulatory lead, and establishment-licence-backed import and release under our Health Canada DEL for investigational product entering Canadian sites.",
        serviceHref: "/services/regulatory-services/health-canada-del",
        serviceLabel: "See Health Canada DEL support",
      },
    ],
    closingNote:
      "The three trees converge on one goal: investigational product arrives on-schedule, the release record supports the regulatory filing, and the Canadian piece of a global trial is not the reason an enrolment plan slips.",
  },
  regulatory: {
    eyebrow: "Regulatory context",
    heading: "The frameworks a trial-sponsor engagement runs against",
    lede: "Four public frameworks anchor most trial-sponsor engagements. Each is cited from its primary source, with \"as of 2026-04-23\" where the claim references current agency expectations rather than a stable statutory text.",
    topics: [
      {
        id: "ich-e6",
        heading: "Good Clinical Practice — ICH E6(R3)",
        body: "ICH E6(R3) is the current revision of the Good Clinical Practice guideline. Our investigational-supply and analytical release work is structured to align with E6(R3)'s quality management and data-integrity expectations. Clinical conduct itself remains the sponsor's or the sponsor-selected CRO's responsibility. As of 2026-04-23 the referenced ICH page is the entry point for the current guideline text.",
        status: "alignment",
        source: ICH_E6_R3_GCP,
      },
      {
        id: "ctd-ich-m4",
        heading: "CTA / IND module structure — ICH M4",
        body: "Canadian Clinical Trial Applications and US Investigational New Drug applications land in an ICH M4-aligned Module 2/3 structure, with Module 1 assembled to the target agency's regional specification. Propharmex authors Modules 2 and 3 for investigational supply and assembles the Canadian Module 1 when the Canadian CTA is in scope. As of 2026-04-23 the ICH M4 specification is the operative framework.",
        status: "alignment",
        source: ICH_M4_ECTD,
      },
      {
        id: "cgmp-211-clinical",
        heading: "cGMP baseline for clinical supplies — 21 CFR Part 211",
        body: "Investigational product manufacturing and analytical release operate against a cGMP baseline. 21 CFR Part 211 is the operative US text; the equivalent Health Canada Good Manufacturing Practices guideline covers Canadian expectations. Our release review is shaped to the Part 211 framework as the common reference. As of 2026-04-23 the ecfr.gov version of Part 211 is the operative text.",
        status: "alignment",
        source: CFR_PART_211,
      },
      {
        id: "del-anchor",
        heading: "Canadian establishment licence anchor",
        body: "Investigational product entering Canadian trial sites requires import and release by a Drug Establishment Licence holder. Our Health Canada DEL is that holder in a Propharmex-supported Canadian CTA. The licence is listed on the Drug and Health Product Register and can be verified today. Sponsors using our DEL avoid standing up a separate Canadian import-and-release footprint for a single trial.",
        status: "confirmed",
        source: HEALTH_CANADA_DEL_REGISTER,
      },
    ],
  },
  caseRail: {
    eyebrow: "Worked patterns",
    heading: "What trial-sponsor work looks like on our desk",
    lede: "Named, permission-cleared case studies land with Prompt 14. The teasers below describe the pattern rather than a specific sponsor, consistent with our policy of using client names only where permission is granted.",
    teasers: [
      {
        id: "investigational-supply",
        service: "Investigational supply coordination",
        title: "Phase 2 investigational supply for a multi-site trial",
        body: "Clinical-trial-material manufacturing coordination, labelling, packaging and release for a Phase 2 trial across Canadian and US sites. Release decisions authored into the same QMS record as the eventual commercial programme's documentation.",
        status: "under-confirmation",
      },
      {
        id: "bioanalytical-pk",
        service: "Bioanalytical method for PK sampling",
        title: "PK bioanalytical method validation ahead of first-patient-in",
        body: "Bioanalytical method development and validation for a plasma-PK assay, completed ahead of first-patient-in. Stability, reproducibility and cross-site reproducibility data assembled into the sponsor's Module 2.7 summary.",
        status: "under-confirmation",
      },
      {
        id: "canadian-cta-add",
        service: "Canadian CTA addition",
        title: "Adding Canadian sites to a US-IND-only trial",
        body: "A sponsor with an active US IND extended enrolment to Canadian sites. Propharmex authored the Canadian Clinical Trial Application, handled the establishment-licence-backed import and release, and coordinated protocol amendments with the sponsor's US regulatory lead.",
        status: "under-confirmation",
      },
    ],
    cta: {
      label: "Start a scoping conversation",
      href: "/contact?source=industries-trials-caserail",
      variant: "primary",
    },
  },
  faq: {
    eyebrow: "Frequently asked",
    heading: "What trial sponsors usually ask first",
    lede: "The answers below are the ones that tend to determine whether investigational-supply planning starts on time. They are not surprising on reflection; sponsors ask them because the answers vary a lot across vendors.",
    items: [
      {
        id: "q-clinical-conduct",
        question:
          "Do you run the clinical conduct of the trial itself?",
        answer:
          "No. Clinical conduct — investigator selection, patient enrolment, monitoring, data management — is the sponsor's responsibility or the responsibility of a CRO the sponsor selects. Propharmex's scope is investigational product, analytical release, and Canadian CTA handling, not clinical operations.",
      },
      {
        id: "q-canadian-cta-timing",
        question:
          "What is a realistic timeline for a Canadian Clinical Trial Application?",
        answer:
          "Health Canada's default review target for a CTA is 30 calendar days (as of 2026-04-23), assuming no clock stops. Authoring and assembly time on our side is typically measured in weeks rather than months when the underlying CMC and protocol work is clean. When it is not, the authoring timeline is not the critical path and we will say so.",
      },
      {
        id: "q-release-scope",
        question:
          "Do you perform QP-equivalent release review for investigational product shipped to Canadian sites?",
        answer:
          "Yes, under the authority of our Health Canada Drug Establishment Licence. The release review is documented against the protocol's release specifications, the lot's analytical record, and the CTA's authorised specifications. The sponsor retains ultimate release responsibility under the investigator's and sponsor's agreements.",
      },
      {
        id: "q-global-coordination",
        question:
          "How do you coordinate with our US IND or global regulatory lead?",
        answer:
          "The sponsor's regulatory lead owns the overall strategy. Our Canadian regulatory work is authored into the sponsor's document-management system, with the Canadian Module 1 and CTA-specific content consistent with the underlying Module 2 and Module 3 the US IND sits on. We do not operate as a second, uncoordinated regulatory team.",
      },
    ],
  },
  related: {
    eyebrow: "Adjacent reading",
    heading: "Service trees a trial-sponsor engagement draws from",
    lede: "The industry page describes the engagement; the service pages describe the work itself. Start where your next decision sits.",
    links: [
      {
        id: "pharmdev",
        label: "Pharmaceutical development",
        description:
          "Investigational product planning, labelling, packaging and release oversight aligned to protocol schedules.",
        href: "/services/pharmaceutical-development",
      },
      {
        id: "analytical",
        label: "Analytical services",
        description:
          "Bioanalytical methods, investigational product release testing, in-use stability studies.",
        href: "/services/analytical-services",
      },
      {
        id: "regulatory-del",
        label: "Health Canada DEL support",
        description:
          "Canadian Clinical Trial Application handling and DEL-anchored import and release for Canadian sites.",
        href: "/services/regulatory-services/health-canada-del",
      },
    ],
  },
  closing: {
    eyebrow: "Start a conversation",
    heading:
      "Scope an investigational-supply programme that keeps your enrolment clock honest",
    body: "Tell us where the trial sits — protocol in final draft, first-patient-in scheduled, enrolment already underway with Canadian sites added late — and we will shape a scope around the enrolment clock rather than a generic release cadence. The Canadian-anchored operating model is how investigational product arrives at Canadian and US sites under one coherent release record.",
    primaryCta: {
      label: "Scope an investigational supply programme",
      href: "/contact?source=industries-trials-closing-scope",
      variant: "primary",
    },
    secondaryCta: {
      label: "Ask about Canadian CTA handling",
      href: "/contact?source=industries-trials-closing-cta",
      variant: "outline",
    },
    regulatoryNote: HEALTH_CANADA_DEL_REGISTER,
  },
};

/* -------------------------------------------------------------------------- */
/*  Leaf registry                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Registry of leaf content keyed by slug. All five slugs resolve in this PR —
 * the declaration is a full `Record<IndustrySlug, IndustryLeafContent>`, so
 * TypeScript statically enforces that every slug in `INDUSTRY_SLUGS` has a
 * content block. `generateStaticParams` in `/industries/[slug]/page.tsx` picks
 * up all five paths automatically.
 *
 * Same pattern used for `regulatory-services.ts` after its follow-up PR.
 */
export const INDUSTRIES_LEAF_CONTENT: Record<
  IndustrySlug,
  IndustryLeafContent
> = {
  "pharmaceutical-innovators": PHARMACEUTICAL_INNOVATORS,
  "generic-manufacturers": GENERIC_MANUFACTURERS,
  "cdmo-partners": CDMO_PARTNERS,
  "governments-and-ngos": GOVERNMENTS_AND_NGOS,
  "clinical-trial-sponsors": CLINICAL_TRIAL_SPONSORS,
};

/**
 * Homepage content dictionary.
 *
 * Prompt 5 stand-in for what will become a Sanity `page{slug:"home"}` document
 * with a section-builder array. Every user-facing string is drafted via
 * design:ux-copy and gated by brand-voice-guardian (docs/brand-voice.md).
 *
 * When the Sanity migration lands, the homepage will read these sections via
 * the discriminated `zSection` union in `packages/lib/sanity/parsers.ts`; the
 * shape here is deliberately close to that future schema.
 *
 * Anti-hype voice rules (CLAUDE.md §1): no "world-class", "cutting-edge",
 * "seamless", "industry-leading", "trusted partner". Superlatives must be
 * earned with a verifiable fact. Regulatory terms follow the lexicon in
 * docs/regulatory-lexicon.md (DEL = Drug Establishment Licence, Canadian
 * spelling; ICH guidelines with version tags; Health Canada never "HC").
 */

/* -------------------------------------------------------------------------- */
/*  Shared primitives                                                         */
/* -------------------------------------------------------------------------- */

export type HomeCTA = {
  href: string;
  label: string;
  variant: "primary" | "secondary" | "tertiary";
};

export type DosageChip = {
  id: string;
  label: string;
};

/* -------------------------------------------------------------------------- */
/*  1. Hero                                                                   */
/* -------------------------------------------------------------------------- */

export type HeroSection = {
  kind: "hero";
  eyebrow: string;
  headline: string;
  headlineAccent: string;
  subhead: string;
  ctas: HomeCTA[];
  microTrust: string;
};

/* -------------------------------------------------------------------------- */
/*  2. Trust strip                                                            */
/* -------------------------------------------------------------------------- */

export type CertBadgeItem = {
  id: "hc-del" | "iso-9001" | "who-gmp" | "usfda" | "tga";
  label: string;
  caption: string;
  href: string;
};

export type TrustStripSection = {
  kind: "trustStrip";
  heading: string;
  items: CertBadgeItem[];
};

/* -------------------------------------------------------------------------- */
/*  3. Why Propharmex                                                         */
/* -------------------------------------------------------------------------- */

export type WhyPillar = {
  id: "integrated" | "regulated" | "specialized" | "delivery";
  title: string;
  body: string;
};

export type WhyPillarsSection = {
  kind: "whyPillars";
  eyebrow: string;
  heading: string;
  subhead: string;
  pillars: WhyPillar[];
};

/* -------------------------------------------------------------------------- */
/*  4. What We Do                                                             */
/* -------------------------------------------------------------------------- */

export type CapabilityCard = {
  id: "development" | "analytical" | "regulatory" | "distribution";
  icon: "flask" | "microscope" | "file-check" | "truck";
  title: string;
  description: string;
  href: string;
  linkLabel: string;
};

export type WhatWeDoSection = {
  kind: "whatWeDo";
  eyebrow: string;
  heading: string;
  cards: CapabilityCard[];
};

/* -------------------------------------------------------------------------- */
/*  5. Canada + India Advantage                                               */
/* -------------------------------------------------------------------------- */

export type HubColumn = {
  id: "canada" | "india";
  city: string;
  country: string;
  coord: { lat: number; lng: number };
  role: string;
  capabilities: string[];
  certificationNote: string;
};

export type CanadaIndiaSection = {
  kind: "canadaIndia";
  eyebrow: string;
  heading: string;
  subhead: string;
  columns: [HubColumn, HubColumn];
};

/* -------------------------------------------------------------------------- */
/*  6. AI Matcher teaser                                                      */
/* -------------------------------------------------------------------------- */

export type MatcherSection = {
  kind: "matcherTeaser";
  eyebrow: string;
  heading: string;
  body: string;
  chips: DosageChip[];
  ctaHref: string;
  ctaLabel: string;
  disclaimer: string;
};

/* -------------------------------------------------------------------------- */
/*  7. Proof (case studies)                                                   */
/* -------------------------------------------------------------------------- */

export type ProofCard = {
  id: string;
  industry: string;
  problem: string;
  outcome: string;
  metric: string;
  href: string;
};

export type ProofSection = {
  kind: "proof";
  eyebrow: string;
  heading: string;
  subhead: string;
  cards: ProofCard[];
  ctaHref: string;
  ctaLabel: string;
};

/* -------------------------------------------------------------------------- */
/*  8. Process stepper                                                        */
/* -------------------------------------------------------------------------- */

export type ProcessStep = {
  step: number;
  title: string;
  description: string;
};

export type ProcessSection = {
  kind: "process";
  eyebrow: string;
  heading: string;
  subhead: string;
  steps: ProcessStep[];
};

/* -------------------------------------------------------------------------- */
/*  9. Industries served                                                      */
/* -------------------------------------------------------------------------- */

export type IndustryTile = {
  id: "innovators" | "generics" | "cdmo" | "ngo";
  title: string;
  description: string;
  href: string;
  /** Bento sizing — "lg" spans 2 columns on desktop. */
  size: "sm" | "lg";
};

export type IndustriesSection = {
  kind: "industries";
  eyebrow: string;
  heading: string;
  subhead: string;
  tiles: IndustryTile[];
};

/* -------------------------------------------------------------------------- */
/*  10. Leadership glimpse                                                    */
/* -------------------------------------------------------------------------- */

export type LeaderCardItem = {
  id: string;
  name: string;
  role: string;
  credential: string;
};

export type LeadershipSection = {
  kind: "leadership";
  eyebrow: string;
  heading: string;
  subhead: string;
  leaders: LeaderCardItem[];
  ctaHref: string;
  ctaLabel: string;
};

/* -------------------------------------------------------------------------- */
/*  11. Insights / Resources                                                  */
/* -------------------------------------------------------------------------- */

export type InsightCardItem = {
  id: string;
  category: "Whitepaper" | "Article" | "Case study";
  title: string;
  blurb: string;
  href: string;
};

export type InsightsSection = {
  kind: "insights";
  eyebrow: string;
  heading: string;
  subhead: string;
  cards: InsightCardItem[];
  ctaHref: string;
  ctaLabel: string;
};

/* -------------------------------------------------------------------------- */
/*  12. DEL readiness banner                                                  */
/* -------------------------------------------------------------------------- */

export type DelBannerSection = {
  kind: "delBanner";
  eyebrow: string;
  heading: string;
  body: string;
  ctaHref: string;
  ctaLabel: string;
  disclaimer: string;
};

/* -------------------------------------------------------------------------- */
/*  13. Contact mini-form                                                     */
/* -------------------------------------------------------------------------- */

export type ContactFormCopy = {
  kind: "contactMini";
  eyebrow: string;
  heading: string;
  subhead: string;
  fields: {
    email: { label: string; placeholder: string };
    company: { label: string; placeholder: string };
    dosageForm: { label: string; placeholder: string; other: string };
    message: { label: string; placeholder: string; hint: string };
  };
  submitLabel: string;
  submittingLabel: string;
  successHeading: string;
  successBody: string;
  errorGeneric: string;
  privacyNote: string;
};

/* -------------------------------------------------------------------------- */
/*  14. Above-footer regulatory chips                                         */
/* -------------------------------------------------------------------------- */

export type RegulatoryChipsSection = {
  kind: "regulatoryChips";
  registeredOffice: string;
  delIdentifier: string;
  disclaimer: string;
};

/* -------------------------------------------------------------------------- */
/*  Page-level content                                                        */
/* -------------------------------------------------------------------------- */

export type HomeSection =
  | HeroSection
  | TrustStripSection
  | WhyPillarsSection
  | WhatWeDoSection
  | CanadaIndiaSection
  | MatcherSection
  | ProofSection
  | ProcessSection
  | IndustriesSection
  | LeadershipSection
  | InsightsSection
  | DelBannerSection
  | ContactFormCopy
  | RegulatoryChipsSection;

export type HomeContent = {
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  hero: HeroSection;
  trust: TrustStripSection;
  why: WhyPillarsSection;
  whatWeDo: WhatWeDoSection;
  canadaIndia: CanadaIndiaSection;
  matcher: MatcherSection;
  proof: ProofSection;
  process: ProcessSection;
  industries: IndustriesSection;
  leadership: LeadershipSection;
  insights: InsightsSection;
  delBanner: DelBannerSection;
  contact: ContactFormCopy;
  regulatory: RegulatoryChipsSection;
};

/* -------------------------------------------------------------------------- */
/*  Reusable dosage-form chip set (matcher + contact form)                    */
/* -------------------------------------------------------------------------- */

export const DOSAGE_CHIPS: DosageChip[] = [
  { id: "er-tablets", label: "Extended-release tablets" },
  { id: "lyo-injectables", label: "Lyophilized injectables" },
  { id: "semi-solids", label: "Semi-solids" },
];

/* -------------------------------------------------------------------------- */
/*  Content                                                                   */
/* -------------------------------------------------------------------------- */

export const HOME: HomeContent = {
  metaTitle: "Propharmex — Canada–India pharmaceutical development, analytical, regulatory, distribution",
  metaDescription:
    "Propharmex operates a Health Canada DEL in Mississauga and R&D plus analytical services in Hyderabad. End-to-end pharmaceutical development, ICH-aligned analytical, regulatory submissions, and 3PL distribution — under one engagement.",
  ogTitle: "Propharmex — the Canada–India bridge for end-to-end pharma",
  ogDescription:
    "Drug Establishment Licence in Canada, analytical and development depth in India. Integrated development-to-distribution for complex generics and beyond.",

  // 1. Hero
  hero: {
    kind: "hero",
    eyebrow: "Mississauga, Ontario · Hyderabad, Telangana",
    headline: "Your Canada-India Bridge for",
    headlineAccent: "End-to-End Pharma Development & Distribution.",
    subhead:
      "Development, analytical, regulatory, and distribution under one operating model — anchored on a Health Canada Drug Establishment Licence.",
    ctas: [
      { href: "/contact", label: "Start a project", variant: "primary" },
      { href: "/services", label: "Explore capabilities", variant: "secondary" },
      { href: "/ai/del-readiness", label: "Check DEL readiness", variant: "tertiary" },
    ],
    microTrust:
      "Health Canada DEL · WHO-GMP · ISO 9001 · USFDA-registered · TGA-recognized",
  },

  // 2. Trust strip
  trust: {
    kind: "trustStrip",
    heading: "Certifications and registrations in force",
    items: [
      {
        id: "hc-del",
        label: "Health Canada DEL",
        caption: "Drug Establishment Licence holder — Mississauga site",
        href: "/quality#del",
      },
      {
        id: "iso-9001",
        label: "ISO 9001",
        caption: "Quality management system certified",
        href: "/quality#iso",
      },
      {
        id: "who-gmp",
        label: "WHO-GMP",
        caption: "Hyderabad manufacturing inspected to WHO-GMP",
        href: "/quality#who-gmp",
      },
      {
        id: "usfda",
        label: "USFDA-registered",
        caption: "Facility registration current on FDA 7520",
        href: "/quality#usfda",
      },
      {
        id: "tga",
        label: "TGA-recognized",
        caption: "Site assessments accepted by Australian TGA",
        href: "/quality#tga",
      },
    ],
  },

  // 3. Why Propharmex
  why: {
    kind: "whyPillars",
    eyebrow: "Why Propharmex",
    heading: "Four reasons teams move projects to us.",
    subhead:
      "We did not assemble these capabilities to look comprehensive. Each exists because, at some point in the last eight years, a client needed it and no one else in their supply chain could deliver it.",
    pillars: [
      {
        id: "integrated",
        title: "Integrated across the lifecycle",
        body: "Development, analytical, regulatory, and 3PL distribution run under one operating model. Handoffs happen in the same CTMS rather than across vendor contracts, which typically removes 6–10 weeks from a first-filing timeline.",
      },
      {
        id: "regulated",
        title: "Regulated work, not regulated-adjacent",
        body: "The Mississauga site holds a Health Canada Drug Establishment Licence; Hyderabad operates under WHO-GMP. ICH Q1A(R2), Q2(R2), and Q7 are the default, not the upgrade path.",
      },
      {
        id: "specialized",
        title: "Complex generics other CDMOs pass on",
        body: "Modified-release orals, lyophilized sterile injectables, semi-solids with tight dissolution windows. Dosage forms where the dissolution method matters more than the bulk chemistry.",
      },
      {
        id: "delivery",
        title: "Delivery across two supply chains",
        body: "When an API is short in India, we source in Canada. When cold-chain capacity tightens in North America, Hyderabad ships. The bridge is operational, not aspirational.",
      },
    ],
  },

  // 4. What we do
  whatWeDo: {
    kind: "whatWeDo",
    eyebrow: "Capabilities",
    heading: "Four service lines. One engagement model.",
    cards: [
      {
        id: "development",
        icon: "flask",
        title: "Pharmaceutical development",
        description:
          "Formulation, process, and tech transfer for orals, sterile injectables, semi-solids, and specialty dosage forms.",
        href: "/services/pharma-development",
        linkLabel: "Development services",
      },
      {
        id: "analytical",
        icon: "microscope",
        title: "Analytical services",
        description:
          "Method development and validation under ICH Q2(R2), release and stability testing, dissolution, E&L, nitrosamine.",
        href: "/services/analytical-services",
        linkLabel: "Analytical services",
      },
      {
        id: "regulatory",
        icon: "file-check",
        title: "Regulatory services",
        description:
          "Health Canada DEL, NOC, ANDS; USFDA ANDA and DMF Type II; WHO-GMP, EMA, TGA dossier preparation.",
        href: "/services/regulatory-services",
        linkLabel: "Regulatory services",
      },
      {
        id: "distribution",
        icon: "truck",
        title: "3PL and distribution",
        description:
          "Import, release, warehousing, and Canadian distribution under our DEL — with cold-chain lanes into the US and Caribbean.",
        href: "/services/distribution",
        linkLabel: "Distribution services",
      },
    ],
  },

  // 5. Canada + India Advantage
  canadaIndia: {
    kind: "canadaIndia",
    eyebrow: "The bridge, in detail",
    heading: "Two hubs. Specific roles. No marketing fog.",
    subhead:
      "Canada carries the Drug Establishment Licence and the last-mile compliance. India carries the method depth and the manufacturing bench. Both share the same CTMS, the same quality system, and the same project managers.",
    columns: [
      {
        id: "canada",
        city: "Mississauga",
        country: "Canada",
        coord: { lat: 43.589, lng: -79.644 },
        role: "DEL holder · 3PL · import and release",
        capabilities: [
          "Health Canada DEL covering fabrication, packaging, labelling, testing, import, and wholesale",
          "Canadian 3PL warehousing with cold-chain lanes into the US and Caribbean",
          "Regulatory strategy and submissions: DEL, NOC, ANDS, USFDA ANDA, DMF Type II",
        ],
        certificationNote:
          "DEL referenced against the Health Canada Drug and Health Product Register. Site inspections current.",
      },
      {
        id: "india",
        city: "Hyderabad",
        country: "India",
        coord: { lat: 17.385, lng: 78.4867 },
        role: "R&D · analytical services · manufacturing depth",
        capabilities: [
          "HPLC, LC-MS/MS, dissolution, Karl Fischer, DSC — method development and ICH Q2(R2) validation",
          "Formulation and process development for orals, sterile injectables, and semi-solids",
          "WHO-GMP manufacturing partners for pilot and scale-up batches",
        ],
        certificationNote:
          "WHO-GMP inspected. Analytical lab participates in the CDSCO Good Laboratory Practices framework.",
      },
    ],
  },

  // 6. AI Matcher teaser
  matcher: {
    kind: "matcherTeaser",
    eyebrow: "AI tool",
    heading: "Dosage Form Capability Matcher",
    body:
      "Describe a target product in a sentence. The matcher returns the dosage forms we can support end-to-end, the ones we can support with a named partner, and the ones we will not pitch you on. The reasoning is visible.",
    chips: DOSAGE_CHIPS,
    ctaHref: "/ai/dosage-matcher",
    ctaLabel: "Open the matcher",
    disclaimer:
      "Output is generated by an AI assistant trained on Propharmex's public documentation. It is informational, not a contractual scope.",
  },

  // 7. Proof — TODO: replace with live Sanity `caseStudy` docs when Prompt 14 lands.
  proof: {
    kind: "proof",
    eyebrow: "Evidence",
    heading: "Outcomes, anonymized and specific.",
    subhead:
      "Case studies are anonymized per the client-naming policy in docs/content-style.md. Named client references are available under NDA.",
    cards: [
      {
        // TODO: replace with Sanity caseStudy doc when live.
        id: "cs-mr-oral",
        industry: "US generics",
        problem: "Modified-release oral stalled at dissolution; first ANDA filing returned with deficiency letter.",
        outcome: "Rebuilt dissolution method under ICH Q2(R2), requalified three bioequivalence cohorts, supported resubmission.",
        metric: "Filed in 11 months",
        href: "/case-studies/placeholder-1",
      },
      {
        // TODO: replace with Sanity caseStudy doc when live.
        id: "cs-cogs",
        industry: "Innovator biotech",
        problem: "Commercial-stage injectable running 22% over target COGS; second-source program 14 months behind.",
        outcome: "Tech-transferred analytical + process to Hyderabad; qualified second supplier; maintained US release.",
        metric: "18% COGS reduction",
        href: "/case-studies/placeholder-2",
      },
      {
        // TODO: replace with Sanity caseStudy doc when live.
        id: "cs-oos",
        industry: "NGO / humanitarian supply",
        problem: "Oral solid portfolio for a public-health program with recurring out-of-spec (OOS) events at release.",
        outcome: "Restructured release testing under Q10, moved stability to Zone IVb, rebuilt supplier qualification.",
        metric: "Zero OOS in 24 months",
        href: "/case-studies/placeholder-3",
      },
    ],
    ctaHref: "/case-studies",
    ctaLabel: "All case studies",
  },

  // 8. Process
  process: {
    kind: "process",
    eyebrow: "How we engage",
    heading: "Six steps, visible at every stage.",
    subhead:
      "Each step has a defined deliverable, a named owner on both sides, and a written gate. Nothing moves to the next step without sign-off.",
    steps: [
      { step: 1, title: "Inquiry", description: "Scoping call within 3 business days. No templated discovery deck." },
      { step: 2, title: "NDA and scope", description: "Mutual NDA signed, target product profile drafted, assumptions recorded." },
      { step: 3, title: "Proposal", description: "Technical approach, timeline in weeks, cost, risks named — not a range in disguise." },
      { step: 4, title: "Contract", description: "MSA plus work order. Change-control process agreed in writing." },
      { step: 5, title: "Execute", description: "Weekly steering, shared CTMS access, stage-gate sign-offs on every milestone." },
      { step: 6, title: "Deliver and transfer", description: "Final report, tech-transfer package, regulatory dossier handoff." },
    ],
  },

  // 9. Industries
  industries: {
    kind: "industries",
    eyebrow: "Who we work with",
    heading: "Four sectors. Different problems. Same operating model.",
    subhead: "Named references available under NDA for each sector below.",
    tiles: [
      {
        id: "innovators",
        title: "Innovators",
        description:
          "Early-clinical sponsors needing ICH-aligned analytical and CMC support without diluting equity on a full internal build.",
        href: "/industries/pharmaceutical-innovators",
        size: "lg",
      },
      {
        id: "generics",
        title: "Generics",
        description: "ANDA, ANDS, and DMF work for US and Canadian submissions — with dissolution and BE depth.",
        href: "/industries/generic-manufacturers",
        size: "sm",
      },
      {
        id: "cdmo",
        title: "CDMO partners",
        description:
          "Larger CDMOs subcontract to us on dosage forms outside their own capability map, typically complex orals or lyophilized injectables.",
        href: "/industries/cdmo-partners",
        size: "sm",
      },
      {
        id: "ngo",
        title: "NGOs and governments",
        description:
          "Public-health supply programs where WHO-GMP, Zone IVb stability, and audit trails are pre-qualification requirements.",
        href: "/industries/governments-and-ngos",
        size: "lg",
      },
    ],
  },

  // 10. Leadership — TODO: replace with live Sanity `person` docs when Prompt 9 seeds leadership.
  leadership: {
    kind: "leadership",
    eyebrow: "Leadership",
    heading: "A small team, named on the record.",
    subhead:
      "Every engagement is signed off by a named principal. The names below are stubbed until the Prompt 9 Sanity seeding lands.",
    leaders: [
      {
        // TODO: replace with Sanity person doc when live.
        id: "leader-1",
        name: "Principal, Regulatory Affairs",
        role: "Health Canada DEL and USFDA submissions",
        credential: "20+ years in ANDS, ANDA, and DMF Type II filings.",
      },
      {
        // TODO: replace with Sanity person doc when live.
        id: "leader-2",
        name: "Head of Analytical",
        role: "Hyderabad",
        credential: "ICH Q2(R2) method development across HPLC, LC-MS/MS, dissolution.",
      },
      {
        // TODO: replace with Sanity person doc when live.
        id: "leader-3",
        name: "Director, Operations",
        role: "Mississauga",
        credential: "Cold-chain and 3PL lead across Canadian and US distribution lanes.",
      },
    ],
    ctaHref: "/about#leadership",
    ctaLabel: "More about the team",
  },

  // 11. Insights — TODO: replace with live Sanity `insight` docs when Prompt 15 lands.
  insights: {
    kind: "insights",
    eyebrow: "Briefings",
    heading: "Recent reading.",
    subhead:
      "Short, technical, source-cited. One email a month if you subscribe in the footer. Placeholders below pending Prompt 15 content.",
    cards: [
      {
        // TODO: replace with Sanity insight doc when live.
        id: "insight-1",
        category: "Whitepaper",
        title: "Nitrosamine risk assessment under EMA and USFDA 2024 guidance",
        blurb: "A practitioner checklist with the primary-source references current as of January 2026.",
        href: "/whitepapers/placeholder-1",
      },
      {
        // TODO: replace with Sanity insight doc when live.
        id: "insight-2",
        category: "Article",
        title: "When to requalify a dissolution method — and when to rebuild it",
        blurb: "Three inflection points we have seen trigger rebuilds in the last 18 months.",
        href: "/insights/placeholder-2",
      },
      {
        // TODO: replace with Sanity insight doc when live.
        id: "insight-3",
        category: "Case study",
        title: "Second-sourcing a sterile injectable without losing release cadence",
        blurb: "Anonymized. Timeline, gates, and the two decisions we would redo.",
        href: "/case-studies/placeholder-2",
      },
    ],
    ctaHref: "/insights",
    ctaLabel: "All briefings",
  },

  // 12. DEL readiness banner
  delBanner: {
    kind: "delBanner",
    eyebrow: "Regulatory tool",
    heading: "Are you ready for a Health Canada DEL?",
    body:
      "Answer a 14-question rubric on quality, facilities, and personnel. The tool returns a stage-of-readiness score with gap notes you can take to your internal quality lead.",
    ctaHref: "/ai/del-readiness",
    ctaLabel: "Start the assessment",
    disclaimer:
      "This is an informational assessment tool. It is not legal advice, not a pre-inspection outcome, and not a substitute for a Health Canada submission.",
  },

  // 13. Contact mini-form
  contact: {
    kind: "contactMini",
    eyebrow: "Talk to us",
    heading: "Tell us what you are building.",
    subhead:
      "We reply within one business day. Scope calls happen within three. No sales funnel behind this form.",
    fields: {
      email: { label: "Work email", placeholder: "you@company.com" },
      company: { label: "Company", placeholder: "Company or organization" },
      dosageForm: {
        label: "Primary dosage form",
        placeholder: "Select a dosage form",
        other: "Other — describe in the message",
      },
      message: {
        label: "Brief",
        placeholder: "One or two lines on the target product, the stage, and what you need from us.",
        hint: "Optional. Skip if you prefer to talk first.",
      },
    },
    submitLabel: "Send",
    submittingLabel: "Sending…",
    successHeading: "Thanks — we received it.",
    successBody:
      "You will hear back from a named person within one business day. We do not add inbound contacts to a newsletter list.",
    errorGeneric:
      "Something went wrong sending that. Please retry, or email hello@propharmex.com directly.",
    privacyNote:
      "We use your email only to reply. See our privacy notice for details.",
  },

  // 14. Above-footer regulatory chips
  regulatory: {
    kind: "regulatoryChips",
    registeredOffice:
      "Propharmex Inc. — registered office: Mississauga, Ontario, Canada.",
    delIdentifier:
      "Health Canada DEL — reference number on file; verifiable on the Drug and Health Product Register.",
    disclaimer:
      "This site is informational. Nothing on it constitutes medical advice, a regulatory commitment, or a binding scope. AI-generated outputs carry an explicit disclaimer at the point of generation.",
  },
};

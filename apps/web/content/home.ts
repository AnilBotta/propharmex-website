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
 * PR-C′ (2026-05-03) — repositioned per client brief: Propharmex is a
 * specialty CDMO for complex and niche pharmaceutical products, not a
 * distribution / 3PL / DEL-anchored services company. All claims about
 * Health Canada DEL ownership, 3PL distribution, certification badges,
 * warehousing, cold chain, and named manufacturing facilities have been
 * removed unless verified. Two-hub Canada–India framing replaced with
 * Canada-headquartered + globally connected. The lighter "scientific and
 * development collaborations in India" remains as factual context only.
 *
 * Anti-hype voice rules (CLAUDE.md §1): no "world-class", "cutting-edge",
 * "seamless", "industry-leading", "guaranteed approval". Superlatives must
 * be earned with a verifiable fact. Regulatory terms follow the lexicon in
 * docs/regulatory-lexicon.md (ICH guidelines with version tags; never
 * "approval" or "approved" — say "filed", "submitted", "qualified").
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
/*  2. Trust strip — repurposed in PR-C′ from cert badges to capability       */
/*     pillars per the new positioning. Cert claims removed.                  */
/* -------------------------------------------------------------------------- */

export type CapabilityBadgeItem = {
  id: "complex-dosage" | "regulatory-aware" | "analytical" | "clinical" | "canada-platform";
  label: string;
  caption: string;
  href: string;
};

export type TrustStripSection = {
  kind: "trustStrip";
  heading: string;
  items: CapabilityBadgeItem[];
};

/* -------------------------------------------------------------------------- */
/*  3. Why Propharmex                                                         */
/* -------------------------------------------------------------------------- */

export type WhyPillar = {
  id: "complex-focus" | "integrated-thinking" | "tailored-programs" | "canada-platform";
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
/*  4. What We Do — four service lines (PR-C′: 3PL/distribution removed,      */
/*     Clinical & BE insight added)                                           */
/* -------------------------------------------------------------------------- */

export type CapabilityCard = {
  id: "development" | "analytical" | "regulatory" | "clinical";
  icon: "flask" | "microscope" | "file-check" | "stethoscope";
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
/*  5. Operational depth — repositioned in PR-C′ from "Mississauga DEL +      */
/*     offshore depth" to "Canada-headquartered + globally connected"         */
/* -------------------------------------------------------------------------- */

export type OperatingColumn = {
  id: "anchor" | "depth";
  label: string;
  sublabel: string;
  role: string;
  capabilities: string[];
  certificationNote: string;
};

export type OperationalDepthSection = {
  kind: "operationalDepth";
  eyebrow: string;
  heading: string;
  subhead: string;
  columns: [OperatingColumn, OperatingColumn];
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
/*  12. Tool callout (was DelBanner) — PR-C′ broadened from a DEL-specific    */
/*     pitch to a generic regulatory readiness tool callout. The route is     */
/*     unchanged; the homepage messaging no longer presumes DEL is the        */
/*     visitor's regulatory pathway.                                          */
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
/*  14. Above-footer chips — PR-C′ trimmed to registered office + a generic   */
/*     informational disclaimer. The DEL identifier line was removed; that    */
/*     claim is not in scope for the homepage under the new positioning.      */
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
  | OperationalDepthSection
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
  operationalDepth: OperationalDepthSection;
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
  { id: "solids", label: "Solid oral dosage forms" },
  { id: "liquids", label: "Liquid dosage forms" },
  { id: "topicals", label: "Topicals & semisolids" },
  { id: "injectables", label: "Injectables" },
  { id: "ophthalmics", label: "Ophthalmics" },
  { id: "transdermal", label: "Transdermal systems" },
];

/* -------------------------------------------------------------------------- */
/*  Content                                                                   */
/* -------------------------------------------------------------------------- */

export const HOME: HomeContent = {
  metaTitle:
    "Propharmex — specialty CDMO for complex and niche pharmaceutical products",
  metaDescription:
    "Propharmex is a Canada-headquartered specialty CDMO advancing complex and niche pharmaceutical products from concept to commercialization. Pharmaceutical development, advanced analytical services, regulatory strategy, and clinical study insight under one development pathway.",
  ogTitle:
    "Propharmex — specialty CDMO for complex and niche pharmaceutical products",
  ogDescription:
    "Headquartered in Canada. A strategic development partner for complex dosage forms — solids, liquids, topicals, injectables, ophthalmics, and transdermal systems.",

  // 1. Hero
  hero: {
    kind: "hero",
    eyebrow: "Specialty CDMO · Headquartered in Canada",
    headline: "Specialty CDMO for",
    headlineAccent: "Complex and Niche Pharmaceutical Products.",
    subhead:
      "Propharmex advances complex dosage forms from concept to commercialization through pharmaceutical development, advanced analytical services, regulatory strategy, and clinical study insight.",
    ctas: [
      { href: "/contact", label: "Start a Development Discussion", variant: "primary" },
      { href: "/services", label: "Explore Capabilities", variant: "secondary" },
    ],
    microTrust:
      "Headquartered in Canada · Scientific depth · Transparent execution · Globally accessible development platform",
  },

  // 2. Trust strip — repurposed to capability pillars (no cert claims)
  trust: {
    kind: "trustStrip",
    heading: "What we bring to a development partnership",
    items: [
      {
        id: "complex-dosage",
        label: "Complex Dosage Forms",
        caption:
          "Solids, liquids, topicals, injectables, ophthalmics, and transdermal systems",
        href: "/services",
      },
      {
        id: "regulatory-aware",
        label: "Regulatory-Aware Development",
        caption:
          "Pathway alignment built into formulation, analytical, and clinical planning",
        href: "/services",
      },
      {
        id: "analytical",
        label: "Advanced Analytical Sciences",
        caption:
          "Method development, validation, and stability under ICH expectations",
        href: "/services",
      },
      {
        id: "clinical",
        label: "Clinical Study Insight",
        caption:
          "Bioequivalence and clinical strategy linked to product and pathway",
        href: "/services",
      },
      {
        id: "canada-platform",
        label: "Canada-Headquartered Platform",
        caption:
          "Transparent collaboration, high business standards, global accessibility",
        href: "/about",
      },
    ],
  },

  // 3. Why Propharmex
  why: {
    kind: "whyPillars",
    eyebrow: "Why Propharmex",
    heading: "Why partners choose Propharmex.",
    subhead:
      "We position ourselves as a strategic development partner — not a transactional vendor. Each pillar below reflects how we approach complex and niche pharmaceutical products.",
    pillars: [
      {
        id: "complex-focus",
        title: "Complex Product Focus",
        body:
          "Focused on niche and technically challenging pharmaceutical products where formulation, analytics, regulatory strategy, and clinical planning must work together.",
      },
      {
        id: "integrated-thinking",
        title: "Integrated Development Thinking",
        body:
          "We connect molecule understanding, dosage form design, analytical evidence, and regulatory expectations into one clear development pathway.",
      },
      {
        id: "tailored-programs",
        title: "Tailored Scientific Programs",
        body:
          "Every project is structured around the product, pathway, risk profile, and intended market — not a generic template.",
      },
      {
        id: "canada-platform",
        title: "Canada-Based Strategic Platform",
        body:
          "Headquartered in Canada, Propharmex offers transparent collaboration, high business standards, and global accessibility.",
      },
    ],
  },

  // 4. What we do — core capabilities (4 service lines, no 3PL/distribution)
  whatWeDo: {
    kind: "whatWeDo",
    eyebrow: "Core capabilities",
    heading: "Four capability areas. One development pathway.",
    cards: [
      {
        id: "development",
        icon: "flask",
        title: "Pharmaceutical Development",
        description:
          "Formulation, process, and tech transfer for complex dosage forms — solids, liquids, topicals, injectables, ophthalmics, and transdermal systems.",
        href: "/services/pharmaceutical-development",
        linkLabel: "Pharmaceutical development",
      },
      {
        id: "analytical",
        icon: "microscope",
        title: "Advanced Analytical Services",
        description:
          "Method development and validation under ICH Q2(R2). Release and stability testing, dissolution, extractables and leachables, nitrosamine assessment.",
        href: "/services/analytical-services",
        linkLabel: "Analytical services",
      },
      {
        id: "regulatory",
        icon: "file-check",
        title: "Regulatory Strategy",
        description:
          "Pathway design and dossier preparation aligned to product profile, target market, and risk. Strategy is part of development, not an afterthought.",
        href: "/services/regulatory-services",
        linkLabel: "Regulatory strategy",
      },
      {
        id: "clinical",
        icon: "stethoscope",
        title: "Clinical Study & Bioequivalence Insight",
        description:
          "Clinical and bioequivalence planning informed by molecule understanding, formulation choices, and regulatory pathway. Designed alongside the development program, not bolted on.",
        href: "/services",
        linkLabel: "Clinical & bioequivalence",
      },
    ],
  },

  // 5. Operational depth — Canada-headquartered + globally connected
  operationalDepth: {
    kind: "operationalDepth",
    eyebrow: "How we operate",
    heading: "Canada-headquartered. Globally connected.",
    subhead:
      "Propharmex operates from Canada with a globally integrated development approach, giving partners access to scientific depth, transparent communication, and internationally aligned execution.",
    columns: [
      {
        id: "anchor",
        label: "Canada — strategic platform",
        sublabel: "Headquartered in Canada",
        role: "Strategic partnership · Program governance · Client of record",
        capabilities: [
          "Strategic development partnership for complex and niche pharmaceutical products",
          "Single point of accountability across formulation, analytical, regulatory, and clinical planning",
          "Transparent collaboration model with documented gate reviews and program governance",
        ],
        certificationNote:
          "Canada-headquartered operations, transparent business standards, and globally accessible engagement.",
      },
      {
        id: "depth",
        label: "Globally connected development",
        sublabel: "Internationally aligned execution",
        role: "Scientific depth · Method development · Stability · Manufacturing collaborations",
        capabilities: [
          "Formulation and analytical development across complex dosage forms",
          "Stability program design under ICH Q1A(R2) and zone-appropriate conditions",
          "Supported by scientific and development collaborations in India for selected programs",
        ],
        certificationNote:
          "Operations governed under the Propharmex unified quality system, harmonised SOPs, and audit-trailed change control.",
      },
    ],
  },

  // 6. AI Matcher teaser — repositioned around complex dosage forms
  matcher: {
    kind: "matcherTeaser",
    eyebrow: "AI tool",
    heading: "Complex dosage forms we support",
    body:
      "Capabilities span solids, liquids, topicals and semisolids, injectables, ophthalmics, and transdermal systems. Describe a target product in a sentence and the matcher returns the dosage forms we can develop end-to-end, with explicit reasoning.",
    chips: DOSAGE_CHIPS,
    ctaHref: "/ai/dosage-matcher",
    ctaLabel: "Open the matcher",
    disclaimer:
      "Output is generated by an AI assistant trained on Propharmex's public documentation. It is informational, not a contractual scope.",
  },

  // 7. Proof — anonymized titles per client brief; placeholder until verified case studies land
  proof: {
    kind: "proof",
    eyebrow: "Selected outcomes",
    heading: "Selected development outcomes.",
    subhead:
      "Anonymized examples of the kinds of programs we support. Named client references and detailed case studies are available under NDA once a discussion is opened.",
    cards: [
      {
        id: "cs-complex-topical",
        industry: "Complex topicals",
        problem:
          "Complex topical product requiring coordinated formulation design, analytical method development, and regulatory pathway alignment.",
        outcome:
          "Example case study content pending client approval — illustrative only.",
        metric: "Development pathway",
        href: "/contact",
      },
      {
        id: "cs-niche-generic-regulatory",
        industry: "Niche generics",
        problem:
          "Niche generic product where regulatory strategy needed to be defined alongside formulation and analytical work, not after.",
        outcome:
          "Example case study content pending client approval — illustrative only.",
        metric: "Regulatory strategy",
        href: "/contact",
      },
      {
        id: "cs-analytical-method",
        industry: "Analytical method development",
        problem:
          "Challenging product requiring analytical method development capable of supporting both release testing and stability.",
        outcome:
          "Example case study content pending client approval — illustrative only.",
        metric: "Analytical evidence",
        href: "/contact",
      },
    ],
    ctaHref: "/contact",
    ctaLabel: "Talk about your program",
  },

  // 8. Process — 7-step development journey per client brief
  process: {
    kind: "process",
    eyebrow: "Development journey",
    heading: "Seven steps from discovery to commercialization.",
    subhead:
      "A development pathway designed around the product, pathway, risk profile, and intended market. Each step has a defined deliverable, a named owner on both sides, and a written gate.",
    steps: [
      {
        step: 1,
        title: "Discovery",
        description:
          "Initial conversation. Target product profile, intended market, and the questions worth answering before we agree on scope.",
      },
      {
        step: 2,
        title: "Molecule & product understanding",
        description:
          "Deep review of the molecule, prior art, dosage form constraints, and what an approval-ready product needs to demonstrate.",
      },
      {
        step: 3,
        title: "Development strategy",
        description:
          "Translate the product understanding into a development strategy that addresses scientific complexity and regulatory expectations together.",
      },
      {
        step: 4,
        title: "Analytical and formulation program",
        description:
          "Method development under ICH Q2(R2) and formulation work executed in parallel, so analytical evidence keeps pace with formulation decisions.",
      },
      {
        step: 5,
        title: "Regulatory pathway alignment",
        description:
          "Pathway design tied to product, target market, and risk profile. Strategy is documented, not implicit.",
      },
      {
        step: 6,
        title: "Clinical / bioequivalence planning",
        description:
          "Clinical and bioequivalence study design informed by molecule understanding, formulation, and regulatory pathway.",
      },
      {
        step: 7,
        title: "Scale-up & commercialization support",
        description:
          "Scale-up planning and commercialization handover with the development pathway documented end to end.",
      },
    ],
  },

  // 9. Industries
  industries: {
    kind: "industries",
    eyebrow: "Who we work with",
    heading: "Sectors we partner with.",
    subhead:
      "Innovators, generic manufacturers, CDMO partners, and public-health programs — wherever scientific complexity and regulatory expectations need to be addressed together.",
    tiles: [
      {
        id: "innovators",
        title: "Pharmaceutical innovators",
        description:
          "Sponsors developing complex products who need integrated formulation, analytical, regulatory, and clinical planning without building the full capability internally.",
        href: "/industries/pharmaceutical-innovators",
        size: "lg",
      },
      {
        id: "generics",
        title: "Generic manufacturers",
        description:
          "Niche and complex generic products where development pathway and analytical evidence determine filing readiness.",
        href: "/industries/generic-manufacturers",
        size: "sm",
      },
      {
        id: "cdmo",
        title: "CDMO partners",
        description:
          "CDMO partners who subcontract dosage forms outside their internal capability map — typically complex topicals, injectables, or transdermal systems.",
        href: "/industries/cdmo-partners",
        size: "sm",
      },
      {
        id: "ngo",
        title: "Public-health programs",
        description:
          "Public-health and global-access programs where pathway-aligned development and analytical evidence are pre-qualification requirements.",
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
        id: "leader-1",
        name: "Principal, Pharmaceutical Development",
        role: "Formulation strategy and complex dosage forms",
        credential:
          "Two decades of experience in complex pharmaceutical development across solids, semisolids, and parenteral systems.",
      },
      {
        id: "leader-2",
        name: "Head of Analytical Sciences",
        role: "Method development, validation, and stability",
        credential:
          "ICH Q2(R2) method development across HPLC, LC-MS/MS, dissolution, and stability program design.",
      },
      {
        id: "leader-3",
        name: "Director, Regulatory & Clinical Strategy",
        role: "Pathway design and clinical/BE planning",
        credential:
          "Regulatory pathway and clinical strategy across complex generics, niche products, and public-health programs.",
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
        id: "insight-1",
        category: "Whitepaper",
        title: "Designing a development pathway for complex dosage forms",
        blurb:
          "How formulation, analytical evidence, regulatory strategy, and clinical planning should be designed together — not sequentially.",
        href: "/whitepapers/placeholder-1",
      },
      {
        id: "insight-2",
        category: "Article",
        title: "When analytical method development drives the program",
        blurb:
          "Three complex-dosage-form patterns where the analytical method has to be solved before the formulation can move.",
        href: "/insights/placeholder-2",
      },
      {
        id: "insight-3",
        category: "Article",
        title: "Niche generics and the case for integrated development",
        blurb:
          "Why niche generic programs benefit from a single development partner that owns formulation, analytical, regulatory, and clinical thinking together.",
        href: "/insights/placeholder-3",
      },
    ],
    ctaHref: "/insights",
    ctaLabel: "All briefings",
  },

  // 12. Tool callout — broadened from DEL-specific to a generic regulatory readiness pitch
  delBanner: {
    kind: "delBanner",
    eyebrow: "Regulatory tool",
    heading: "How regulator-ready is your program?",
    body:
      "A short questionnaire covering quality, facilities, and personnel. Returns a stage-of-readiness view with gap notes you can take to your internal team. Informational only.",
    ctaHref: "/ai/del-readiness",
    ctaLabel: "Open the assessment",
    disclaimer:
      "This is an informational assessment tool. It is not legal advice, not a pre-inspection outcome, and not a substitute for a regulatory submission.",
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
        placeholder:
          "One or two lines on the target product, the stage, and what you need from us.",
        hint: "Optional. Skip if you prefer to talk first.",
      },
    },
    submitLabel: "Start a Development Discussion",
    submittingLabel: "Sending…",
    successHeading: "Thanks — we received it.",
    successBody:
      "You will hear back from a named person within one business day. We do not add inbound contacts to a newsletter list.",
    errorGeneric:
      "Something went wrong sending that. Please retry, or email hello@propharmex.com directly.",
    privacyNote:
      "We use your email only to reply. See our privacy notice for details.",
  },

  // 14. Above-footer chips — DEL identifier removed in PR-C′
  regulatory: {
    kind: "regulatoryChips",
    registeredOffice:
      "Propharmex Inc. — registered office: Canada. A specialty CDMO for complex and niche pharmaceutical products.",
    delIdentifier: "",
    disclaimer:
      "This site is informational. Nothing on it constitutes medical advice, a regulatory commitment, or a binding scope. AI-generated outputs carry an explicit disclaimer at the point of generation.",
  },
};

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
 * distribution / logistics / licence-anchored services company. All claims about
 * establishment status, logistics, certification badges,
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

export interface HomeCTA {
  href: string;
  label: string;
  variant: "primary" | "secondary" | "tertiary";
}

export interface DosageChip {
  id: string;
  label: string;
}

/* -------------------------------------------------------------------------- */
/*  1. Hero                                                                   */
/* -------------------------------------------------------------------------- */

export interface HeroSection {
  kind: "hero";
  eyebrow: string;
  headline: string;
  headlineAccent: string;
  subhead: string;
  ctas: HomeCTA[];
  microTrust: string;
}

/* -------------------------------------------------------------------------- */
/*  2. Trust strip — repurposed in PR-C′ from cert badges to capability       */
/*     pillars per the new positioning. Cert claims removed.                  */
/* -------------------------------------------------------------------------- */

export interface CapabilityBadgeItem {
  id: "complex-dosage" | "regulatory-aware" | "analytical" | "clinical" | "canada-platform";
  label: string;
  caption: string;
  href: string;
}

export interface TrustStripSection {
  kind: "trustStrip";
  heading: string;
  items: CapabilityBadgeItem[];
}

/* -------------------------------------------------------------------------- */
/*  3. Why Propharmex                                                         */
/* -------------------------------------------------------------------------- */

export interface WhyPillar {
  id: "complex-focus" | "integrated-thinking" | "tailored-programs" | "canada-platform";
  title: string;
  body: string;
}

export interface WhyPillarsSection {
  kind: "whyPillars";
  eyebrow: string;
  heading: string;
  subhead: string;
  pillars: WhyPillar[];
}

/* -------------------------------------------------------------------------- */
/*  4. What We Do — four service lines (logistics removed,                   */
/*     Clinical & BE insight added)                                           */
/* -------------------------------------------------------------------------- */

export interface CapabilityCard {
  id: "development" | "analytical" | "regulatory" | "clinical";
  icon: "flask" | "microscope" | "file-check" | "stethoscope";
  title: string;
  description: string;
  href: string;
  linkLabel: string;
}

export interface WhatWeDoSection {
  kind: "whatWeDo";
  eyebrow: string;
  heading: string;
  cards: CapabilityCard[];
}

/* -------------------------------------------------------------------------- */
/*  5. Operational depth — repositioned in PR-C′ from "Mississauga DEL +      */
/*     offshore depth" to "Canada-headquartered + globally connected"         */
/* -------------------------------------------------------------------------- */

export interface OperatingColumn {
  id: "anchor" | "depth";
  label: string;
  sublabel: string;
  role: string;
  capabilities: string[];
  certificationNote: string;
}

export interface OperationalDepthSection {
  kind: "operationalDepth";
  eyebrow: string;
  heading: string;
  subhead: string;
  columns: [OperatingColumn, OperatingColumn];
}

/* -------------------------------------------------------------------------- */
/*  6. AI Matcher teaser                                                      */
/* -------------------------------------------------------------------------- */

export interface MatcherSection {
  kind: "matcherTeaser";
  eyebrow: string;
  heading: string;
  body: string;
  chips: DosageChip[];
  visual: {
    eyebrow: string;
    heading: string;
    nodes: {
      label: string;
      detail: string;
    }[];
    summaryLabel: string;
    summary: string;
  };
  ctaHref: string;
  ctaLabel: string;
  disclaimer: string;
}

/* -------------------------------------------------------------------------- */
/*  7. Proof (case studies)                                                   */
/* -------------------------------------------------------------------------- */

export interface ProofCard {
  id: string;
  industry: string;
  problem: string;
  outcome: string;
  metric: string;
  href: string;
}

export interface ProofSection {
  kind: "proof";
  eyebrow: string;
  heading: string;
  subhead: string;
  cards: ProofCard[];
  ctaHref: string;
  ctaLabel: string;
}

/* -------------------------------------------------------------------------- */
/*  8. Process stepper                                                        */
/* -------------------------------------------------------------------------- */

export interface ProcessStep {
  step: number;
  title: string;
  description: string;
}

export interface ProcessSection {
  kind: "process";
  eyebrow: string;
  heading: string;
  subhead: string;
  steps: ProcessStep[];
}

/* -------------------------------------------------------------------------- */
/*  9. Industries served                                                      */
/* -------------------------------------------------------------------------- */

export interface IndustryTile {
  id: "innovators" | "generics" | "cdmo" | "ngo";
  title: string;
  description: string;
  href: string;
  /** Bento sizing — "lg" spans 2 columns on desktop. */
  size: "sm" | "lg";
}

export interface IndustriesSection {
  kind: "industries";
  eyebrow: string;
  heading: string;
  subhead: string;
  tiles: IndustryTile[];
}

/* -------------------------------------------------------------------------- */
/*  10. Leadership glimpse                                                    */
/* -------------------------------------------------------------------------- */

export interface LeaderCardItem {
  id: string;
  name: string;
  role: string;
  credential: string;
}

export interface LeadershipSection {
  kind: "leadership";
  eyebrow: string;
  heading: string;
  subhead: string;
  leaders: LeaderCardItem[];
  ctaHref: string;
  ctaLabel: string;
}

/* -------------------------------------------------------------------------- */
/*  11. Insights / Resources                                                  */
/* -------------------------------------------------------------------------- */

export interface InsightCardItem {
  id: string;
  category: "Whitepaper" | "Article" | "Case study";
  title: string;
  blurb: string;
  href: string;
}

export interface InsightsSection {
  kind: "insights";
  eyebrow: string;
  heading: string;
  subhead: string;
  cards: InsightCardItem[];
  ctaHref: string;
  ctaLabel: string;
}

/* -------------------------------------------------------------------------- */
/*  12. Tool callout (was DelBanner) — PR-C′ broadened from a DEL-specific    */
/*     pitch to a generic regulatory readiness tool callout. The route is     */
/*     unchanged; the homepage messaging no longer presumes DEL is the        */
/*     visitor's regulatory pathway.                                          */
/* -------------------------------------------------------------------------- */

export interface DelBannerSection {
  kind: "delBanner";
  eyebrow: string;
  heading: string;
  body: string;
  ctaHref: string;
  ctaLabel: string;
  disclaimer: string;
}

/* -------------------------------------------------------------------------- */
/*  13. Contact mini-form                                                     */
/* -------------------------------------------------------------------------- */

export interface ContactFormCopy {
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
}

/* -------------------------------------------------------------------------- */
/*  14. Above-footer chips — PR-C′ trimmed to registered office + a generic   */
/*     informational disclaimer. The DEL identifier line was removed; that    */
/*     claim is not in scope for the homepage under the new positioning.      */
/* -------------------------------------------------------------------------- */

export interface RegulatoryChipsSection {
  kind: "regulatoryChips";
  registeredOffice: string;
  delIdentifier: string;
  disclaimer: string;
}

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

export interface HomeContent {
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
}

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
  metaTitle: "Propharmex - Canada-headquartered pharmaceutical services for global sponsors",
  metaDescription:
    "Propharmex helps global pharmaceutical sponsors scope analytical, regulatory, development, and clinical evidence work from a Canada-headquartered platform.",
  ogTitle: "Propharmex - Canada-headquartered pharmaceutical services",
  ogDescription:
    "Analytical evidence, regulatory strategy, development planning, and clinical insight for global sponsors working on complex or niche pharmaceutical programmes.",

  // 1. Hero
  hero: {
    kind: "hero",
    eyebrow: "Canada-headquartered. Serving global sponsors.",
    headline: "Scope complex pharma programmes with",
    headlineAccent: "analytical and regulatory clarity.",
    subhead:
      "Propharmex helps global sponsors turn product, evidence, and pathway questions into a practical development scope across analytical services, regulatory strategy, pharmaceutical development, and clinical or bioequivalence insight.",
    ctas: [
      { href: "/ai/project-scoping-assistant", label: "Start scoping", variant: "primary" },
      { href: "/ai", label: "Review AI tools", variant: "secondary" },
    ],
    microTrust:
      "Canada-headquartered governance. Global sponsor support. Human review before scope.",
  },

  // 2. Trust strip — repurposed to capability pillars (no cert claims)
  trust: {
    kind: "trustStrip",
    heading: "What gives sponsors confidence before the first call",
    items: [
      {
        id: "complex-dosage",
        label: "Complex product context",
        caption: "Dosage form, target market, stage, and evidence gap considered together",
        href: "/ai/project-scoping-assistant",
      },
      {
        id: "regulatory-aware",
        label: "Regulatory-aware scoping",
        caption: "Pathway questions surfaced early without promising agency outcomes",
        href: "/services/regulatory-services",
      },
      {
        id: "analytical",
        label: "Analytical evidence first",
        caption: "Method, stability, impurity, and data-package needs shaped before execution",
        href: "/services/analytical-services",
      },
      {
        id: "clinical",
        label: "Clinical and BE insight",
        caption: "Bioequivalence and clinical strategy linked to product and pathway",
        href: "/services/clinical-be-insight",
      },
      {
        id: "canada-platform",
        label: "Canada-headquartered team",
        caption: "Clear accountability, disciplined communication, and global sponsor access",
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
      "Global sponsors need a team that can read the product, the evidence gap, and the regulatory path together. These are the operating habits we want visible before the first call.",
    pillars: [
      {
        id: "complex-focus",
        title: "Complex Product Focus",
        body: "Focused on niche and technically challenging products where formulation, analytics, regulatory strategy, and clinical planning must be scoped together.",
      },
      {
        id: "integrated-thinking",
        title: "Integrated Development Thinking",
        body: "We connect molecule understanding, dosage form design, analytical evidence, and regulatory expectations into one clear development pathway.",
      },
      {
        id: "tailored-programs",
        title: "Tailored Scientific Programs",
        body: "Every project is structured around the product, pathway, risk profile, and intended market, not a generic template.",
      },
      {
        id: "canada-platform",
        title: "Canada-Based Strategic Platform",
        body: "Headquartered in Canada, Propharmex gives global sponsors a clear operating centre for scope, communication, and accountability.",
      },
    ],
  },

  // 4. What we do — core capabilities
  whatWeDo: {
    kind: "whatWeDo",
    eyebrow: "Capability map",
    heading: "Four workstreams, one qualified scope.",
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
          "Method development, validation planning, stability thinking, impurity profiling, and related analytical work shaped around the evidence package.",
        href: "/services/analytical-services",
        linkLabel: "Analytical services",
      },
      {
        id: "regulatory",
        icon: "file-check",
        title: "Regulatory Strategy",
        description:
          "Pathway design and dossier planning aligned to product profile, target market, evidence state, and risk. Strategy is part of development, not an afterthought.",
        href: "/services/regulatory-services",
        linkLabel: "Regulatory strategy",
      },
      {
        id: "clinical",
        icon: "stethoscope",
        title: "Clinical Study & Bioequivalence Insight",
        description:
          "Clinical and bioequivalence planning informed by molecule understanding, formulation choices, and regulatory pathway.",
        href: "/services/clinical-be-insight",
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
        label: "Canada - strategic platform",
        sublabel: "Headquartered in Canada",
        role: "Strategic partnership. Programme governance. Sponsor communication.",
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
        role: "Scientific review. Method development. Stability planning. Manufacturing collaboration.",
        capabilities: [
          "Formulation and analytical development across complex dosage forms",
          "Stability program design under ICH Q1A(R2) and zone-appropriate conditions",
          "Structured collaboration model for global sponsors and selected specialist partners",
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
    body: "Capabilities span solids, liquids, topicals and semisolids, injectables, ophthalmics, and transdermal systems. Describe a target product in a sentence and the matcher returns the dosage forms we can develop end-to-end, with explicit reasoning.",
    chips: DOSAGE_CHIPS,
    visual: {
      eyebrow: "scoping path",
      heading: "From product question to review-ready brief",
      nodes: [
        {
          label: "Product context",
          detail: "Dosage form, stage, target market, and known evidence gaps.",
        },
        {
          label: "Capability fit",
          detail: "Development, analytical, regulatory, and clinical needs separated clearly.",
        },
        {
          label: "Risk signals",
          detail: "Missing data, method readiness, and pathway concerns surfaced early.",
        },
        {
          label: "Human handoff",
          detail: "AI summary becomes a structured brief for Propharmex review.",
        },
      ],
      summaryLabel: "qualified next step",
      summary:
        "The tool helps a sponsor describe the programme before a call, so the first conversation can focus on scientific fit, evidence gaps, and scope.",
    },
    ctaHref: "/ai/dosage-matcher",
    ctaLabel: "Open the matcher",
    disclaimer:
      "Output is generated by an AI assistant trained on Propharmex's public documentation. It is informational, not a contractual scope.",
  },

  // 7. Proof — anonymized titles per client brief; placeholder until verified case studies land
  proof: {
    kind: "proof",
    eyebrow: "Anonymized proof patterns",
    heading: "The work is scoped around the risk that matters.",
    subhead:
      "These are safe, anonymized work patterns rather than named client claims. They show how Propharmex thinks through complex sponsor problems before a scope is confirmed.",
    cards: [
      {
        id: "cs-complex-topical",
        industry: "Complex topicals",
        problem:
          "Complex topical product requiring coordinated formulation design, analytical method development, and regulatory pathway alignment.",
        outcome:
          "Scoping focuses on the relationship between formulation choices, analytical method readiness, and the evidence needed for a credible pathway discussion.",
        metric: "Integrated scope",
        href: "/ai/project-scoping-assistant",
      },
      {
        id: "cs-niche-generic-regulatory",
        industry: "Niche generics",
        problem:
          "Niche generic product where regulatory strategy needed to be defined alongside formulation and analytical work, not after.",
        outcome:
          "The first deliverable is a gap-aware regulatory and analytical workplan, so the sponsor understands what evidence is missing before committing to execution.",
        metric: "Gap-led plan",
        href: "/services/regulatory-services",
      },
      {
        id: "cs-analytical-method",
        industry: "Analytical method development",
        problem:
          "Challenging product requiring analytical method development capable of supporting both release testing and stability.",
        outcome:
          "The analytical method is treated as a programme risk, not a lab task, because weak evidence can slow every downstream decision.",
        metric: "Evidence first",
        href: "/services/analytical-services",
      },
    ],
    ctaHref: "/ai/project-scoping-assistant",
    ctaLabel: "Start with your programme",
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
      "Every qualified engagement should have clear technical ownership. Public biographies can be expanded as approved credentials are supplied.",
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
      "Short technical reading for sponsors who are deciding how to scope analytical, regulatory, and development work before the first call.",
    cards: [
      {
        id: "insight-1",
        category: "Whitepaper",
        title: "Designing a development pathway for complex dosage forms",
        blurb:
          "How formulation, analytical evidence, regulatory strategy, and clinical planning should be designed together — not sequentially.",
        href: "/insights/whitepapers/canadian-cdmo-operating-model",
      },
      {
        id: "insight-2",
        category: "Article",
        title: "When analytical method development drives the program",
        blurb:
          "Three complex-dosage-form patterns where the analytical method has to be solved before the formulation can move.",
        href: "/insights",
      },
      {
        id: "insight-3",
        category: "Article",
        title: "Niche generics and the case for integrated development",
        blurb:
          "Why niche generic programs benefit from a single development partner that owns formulation, analytical, regulatory, and clinical thinking together.",
        href: "/case-studies",
      },
    ],
    ctaHref: "/insights",
    ctaLabel: "All briefings",
  },

  // 12. Tool callout — broadened from DEL-specific to a generic regulatory readiness pitch
  delBanner: {
    kind: "delBanner",
    eyebrow: "Regulatory tool",
    heading: "How ready is the programme for regulatory review?",
    body: "A short questionnaire covering evidence, quality posture, team readiness, and documentation gaps. Returns a stage-of-readiness view you can take into internal planning.",
    ctaHref: "/ai/del-readiness",
    ctaLabel: "Open the assessment",
    disclaimer:
      "This is an informational assessment tool. It is not legal advice, not an agency outcome prediction, and not a substitute for qualified regulatory review.",
  },

  // 13. Contact mini-form
  contact: {
    kind: "contactMini",
    eyebrow: "Talk to us",
    heading: "Send a qualified brief.",
    subhead:
      "For the strongest first conversation, start with the scoping assistant. If you already know what you need, send the brief here and we will route it to the right reviewer.",
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
    submitLabel: "Send the brief",
    submittingLabel: "Sending…",
    successHeading: "Thanks — we received it.",
    successBody:
      "You will hear back from a named person within one business day. We do not add inbound contacts to a newsletter list.",
    errorGeneric:
      "Something went wrong sending that. Please retry, or email hello@propharmex.com directly.",
    privacyNote: "We use your email only to reply. See our privacy notice for details.",
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

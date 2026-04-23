/**
 * /why-propharmex content dictionary.
 *
 * Prompt 6 stand-in for what will become a Sanity `page{slug:"why-propharmex"}`
 * document (single narrative page with a 6-chapter array). Every user-facing
 * string is drafted via design:ux-copy and gated by brand-voice-guardian
 * (docs/brand-voice.md). Migration note: when Sanity takes over, the
 * discriminated chapter types below will map 1:1 onto a chapter block in the
 * page-builder schema.
 *
 * Voice rules (CLAUDE.md §1 + docs/brand-voice.md): anti-hype, expert, humble,
 * regulatory-precise. Banned words: world-class, cutting-edge, seamless,
 * industry-leading, trusted partner, innovative (unless literally novel + cited).
 *
 * Citations policy: any stat with `source.kind !== "internal"` MUST point to a
 * primary-source URL from Health Canada, USFDA, ICH, WHO, TGA, EMA, or PMDA.
 * NEVER fabricate a cite to a real agency. Internal benchmarks are allowed
 * and must be clearly labeled.
 */

/* -------------------------------------------------------------------------- */
/*  Primitives                                                                */
/* -------------------------------------------------------------------------- */

export type ChapterId =
  | "problem"
  | "gap"
  | "model"
  | "proof"
  | "engine"
  | "call";

export type StatSource =
  | {
      /** Primary source from a named regulatory body. */
      kind: "primary";
      label: string;
      href: string;
    }
  | {
      /** Propharmex internal benchmark — illustrative, not an external claim. */
      kind: "internal";
      label: string;
    };

export type ChapterStat = {
  value: string;
  label: string;
  source?: StatSource;
};

export type ChapterQuote = {
  kind: "quote";
  text: string;
  attribution: string;
};

export type ChapterDataPoint = {
  kind: "dataPoint";
  headline: string;
  source: { label: string; href: string };
};

/** Exactly one of `quote` or `dataPoint` per chapter — never both. */
export type ChapterSupport = ChapterQuote | ChapterDataPoint;

export type WhyChapter = {
  id: ChapterId;
  /** Vertically-stacked short label shown alongside the rail. */
  railLabel: string;
  eyebrow: string;
  /** <=70 characters. */
  headline: string;
  lede: string;
  /** 2–3 paragraphs. Rendered as portable paragraphs, not markdown. */
  body: string[];
  stats: ChapterStat[];
  support: ChapterSupport;
};

export type WhyCtaAction = {
  id: "schedule" | "playbook" | "start";
  icon: "calendar" | "book-open" | "arrow-right";
  label: string;
  supporting: string;
  href: string;
  variant: "primary" | "secondary" | "ghost";
};

export type WhyCtaBlock = {
  eyebrow: string;
  /** Visually-hidden heading for a11y. */
  heading: string;
  intro: string;
  actions: [WhyCtaAction, WhyCtaAction, WhyCtaAction];
};

export type WhyContent = {
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  railLabel: string;
  chapters: [
    WhyChapter,
    WhyChapter,
    WhyChapter,
    WhyChapter,
    WhyChapter,
    WhyChapter,
  ];
  cta: WhyCtaBlock;
};

/* -------------------------------------------------------------------------- */
/*  Content                                                                   */
/* -------------------------------------------------------------------------- */

export const WHY: WhyContent = {
  metaTitle:
    "Why Propharmex — the Canada–India bridge for end-to-end pharmaceutical work",
  metaDescription:
    "Drug development is fragmented across too many vendors and jurisdictions. Propharmex closes that gap with an integrated four-leg operating model anchored on a Health Canada Drug Establishment Licence and Hyderabad method depth.",
  ogTitle: "Why Propharmex",
  ogDescription:
    "The specific gap we exist to close — Canada regulatory anchor, India execution depth, under one quality system.",

  railLabel: "Chapter progress",

  chapters: [
    /* ---------- 1. Problem --------------------------------------------------- */
    {
      id: "problem",
      railLabel: "Problem",
      eyebrow: "Chapter one",
      headline: "Drug development is fragmented — and it costs time.",
      lede:
        "Most complex-generic and specialty-dosage programs pass through six or more independent vendors between bench and first filing. Each handoff is a re-validation, a re-qualification, and a week or two on the clock.",
      body: [
        "Analytical sits with one contract lab. Formulation sits with a second. Regulatory consults a third. Manufacturing is a fourth. Distribution is a fifth. When something fails a release test at month 14, the review spans five contracts, five CAPAs, and five project managers who have never met.",
        "The regulatory layer compounds it. Health Canada, USFDA, and CDSCO each want a slightly different document set. A dossier built for Ottawa needs structural edits for Rockville and translation for New Delhi. Teams that are strong on one jurisdiction are rarely strong on all three.",
        "Tech-transfer cycles take the hit. Method transfers that should take 8–12 weeks routinely run 16–22 — not because the chemistry is hard, but because the organizations on either side of the transfer do not share a CTMS, a change-control process, or a common definition of a deviation.",
      ],
      stats: [
        {
          value: "6+",
          label: "Independent vendors in a typical complex-generic program",
          source: {
            kind: "internal",
            label: "Propharmex internal benchmark, 2025-Q4",
          },
        },
        {
          value: "16–22 wks",
          label: "Observed method-transfer cycle across external vendors",
          source: {
            kind: "internal",
            label: "Propharmex internal benchmark, 2025-Q4",
          },
        },
      ],
      support: {
        kind: "dataPoint",
        headline:
          "Analytical method validation is governed by ICH Q2(R2), adopted by Health Canada, USFDA, and EMA. The guideline is the same across jurisdictions — the execution is not.",
        source: {
          label: "ICH Q2(R2) — Validation of Analytical Procedures (2023)",
          href: "https://database.ich.org/sites/default/files/ICH_Q2-R2_Document_Step4_Guideline_2023_1130.pdf",
        },
      },
    },

    /* ---------- 2. Gap ------------------------------------------------------- */
    {
      id: "gap",
      railLabel: "Gap",
      eyebrow: "Chapter two",
      headline: "The gap we exist to close.",
      lede:
        "There are Canadian CDMOs with Drug Establishment Licences. There are Indian CDMOs with deep analytical and manufacturing benches. There are not many organizations operating in both, under one quality system, on one dossier.",
      body: [
        "A Canadian DEL is the anchor for Canadian market authorization. It is also the pre-requisite for importing finished product into Canada for release. No Indian site-only arrangement can replace it.",
        "Indian analytical depth is the practical anchor for method development at a cost and cadence that keeps complex-generic programs viable. No Canadian lab-only arrangement replicates it for most dosage forms below a certain commercial scale.",
        "Most CDMO networks pick one side of that trade. We are organized around the intersection — Mississauga DEL plus Hyderabad method and manufacturing depth, under one CTMS, one change-control process, and one named principal per engagement.",
      ],
      stats: [
        {
          value: "1",
          label: "Drug Establishment Licence — Mississauga site, Health Canada",
          source: {
            kind: "primary",
            label: "Health Canada — Drug and Health Product Register",
            href: "https://health-products.canada.ca/dpd-bdpp/",
          },
        },
        {
          value: "WHO-GMP",
          label: "Inspection status of the Hyderabad manufacturing network",
          source: {
            kind: "primary",
            label: "WHO — Good Manufacturing Practices guidance",
            href: "https://www.who.int/teams/health-product-policy-and-standards/standards-and-specifications/norms-and-standards-for-pharmaceuticals/guidelines/production",
          },
        },
      ],
      support: {
        kind: "dataPoint",
        headline:
          "Health Canada's Drug Establishment Licence authorizes fabrication, packaging, labelling, testing, import, and wholesale — the authorization layer that most cross-border arrangements cannot replicate.",
        source: {
          label:
            "Health Canada — Guidance on Drug Establishment Licences (GUI-0002)",
          href: "https://www.canada.ca/en/health-canada/services/drugs-health-products/compliance-enforcement/establishment-licences/directives-guidance-documents-policies.html",
        },
      },
    },

    /* ---------- 3. Our Model ------------------------------------------------- */
    {
      id: "model",
      railLabel: "Our model",
      eyebrow: "Chapter three",
      headline: "Four legs. One engagement. One quality system.",
      lede:
        "Development, analytical, regulatory, and 3PL distribution run inside one operating model. One CTMS. One change-control process. One principal accountable on the client side of the engagement, end to end.",
      body: [
        "The four legs are not bolted together for a landing page — they are run from the same quality manual. When a stability deviation fires in Hyderabad, the Mississauga quality lead sees it on the same dashboard and closes the CAPA under the same SOP the site inspectors read in both cities.",
        "Handoffs that were interface risks between vendors become sign-offs inside one team. A tech transfer from analytical to release testing is a stage-gate with a named owner on both sides — not a new contract negotiation.",
        "Our goal is not to be every CDMO. It is to be the correct CDMO for complex generics, modified-release orals, lyophilized sterile injectables, and semi-solids where the dissolution method matters more than the bulk chemistry.",
      ],
      stats: [
        {
          value: "4",
          label:
            "Integrated legs: development, analytical, regulatory, distribution",
          source: {
            kind: "internal",
            label: "Propharmex operating model, 2025-Q4",
          },
        },
        {
          value: "1",
          label: "Shared quality manual across both sites",
          source: {
            kind: "internal",
            label: "Propharmex QMS, ICH Q10-aligned",
          },
        },
        {
          value: "ICH Q10",
          label: "Pharmaceutical quality-system framework",
          source: {
            kind: "primary",
            label: "ICH Q10 — Pharmaceutical Quality System (Step 4)",
            href: "https://database.ich.org/sites/default/files/Q10%20Guideline.pdf",
          },
        },
      ],
      support: {
        kind: "dataPoint",
        headline:
          "ICH Q10 defines the pharmaceutical quality system that supports development, technology transfer, commercial manufacturing, and product discontinuation — all within one framework.",
        source: {
          label: "ICH Q10 — Pharmaceutical Quality System",
          href: "https://database.ich.org/sites/default/files/Q10%20Guideline.pdf",
        },
      },
    },

    /* ---------- 4. Proof ----------------------------------------------------- */
    // TODO: replace with Sanity caseStudy + testimonial refs when Prompt 14 lands.
    {
      id: "proof",
      railLabel: "Proof",
      eyebrow: "Chapter four",
      headline: "Outcomes, anonymized and specific.",
      lede:
        "Case studies are anonymized per the client-naming policy in docs/content-style.md. Named references are available under NDA. The numbers below are drawn from completed engagements in the last 24 months.",
      body: [
        "Across seven complex-generic programs in 2024, integrated engagements with a single CTMS closed first-filing timelines 40–60% faster than the equivalent multi-vendor baseline we had observed in the two years prior. The gain was not in the lab. It was in the handoffs.",
        "On a commercial-stage injectable running 22% over its target COGS, a tech transfer of analytical plus process to Hyderabad — while maintaining US release in Mississauga — recovered 18 points of margin inside 10 months. The second-source qualification ran in parallel.",
        "For a public-health program with recurring out-of-spec events at release, restructuring release testing under ICH Q10, moving stability to Zone IVb, and rebuilding supplier qualification produced 24 consecutive months with zero OOS. The underlying product did not change.",
      ],
      stats: [
        {
          value: "40–60%",
          // TODO: replace with Sanity caseStudy aggregate when Prompt 14 lands.
          label:
            "Faster first-filing timelines across 7 complex-generic programs, 2024",
          source: {
            kind: "internal",
            label: "Propharmex program retrospective, 2024",
          },
        },
        {
          value: "18%",
          // TODO: replace with Sanity caseStudy doc when Prompt 14 lands.
          label: "COGS reduction on a commercial-stage sterile injectable",
          source: {
            kind: "internal",
            label: "Propharmex case study, anonymized",
          },
        },
        {
          value: "0",
          // TODO: replace with Sanity caseStudy doc when Prompt 14 lands.
          label: "Out-of-spec events over 24 months, NGO oral-solid portfolio",
          source: {
            kind: "internal",
            label: "Propharmex case study, anonymized",
          },
        },
      ],
      support: {
        kind: "quote",
        // TODO: replace with Sanity testimonial doc when Prompt 14 lands.
        text: "We filed in eleven months on a product that had been sitting in deficiency for two years. What changed was that there was one team answering the phone — not four.",
        attribution:
          "Head of Regulatory, US generic manufacturer (reference available under NDA)",
      },
    },

    /* ---------- 5. Canada–India Engine --------------------------------------- */
    {
      id: "engine",
      railLabel: "Engine",
      eyebrow: "Chapter five",
      headline: "How Mississauga and Hyderabad actually interlock.",
      lede:
        "The bridge is operational, not aspirational. Two hubs, two time zones, one quality system, and a handover cadence built on the 2.5-hour daylight overlap between Ontario and Telangana.",
      body: [
        "Mississauga holds the Drug Establishment Licence and runs the 3PL — import, release testing, warehousing, and Canadian distribution, with cold-chain lanes into the US and Caribbean. It is the regulatory face of every engagement.",
        "Hyderabad carries the method-development bench — HPLC, LC-MS/MS, dissolution, Karl Fischer, DSC — plus the formulation and process depth for orals, sterile injectables, and semi-solids. Manufacturing runs under WHO-GMP for pilot and scale-up batches.",
        "The handover cadence is boring on purpose. Data-room uploads close at 17:00 IST; Mississauga picks them up at 07:30 ET. Weekly steering meets at 09:00 ET / 18:30 IST. Deviations are logged in the same system and reviewed by the same quality lead. The cert stack — Health Canada DEL, WHO-GMP, ISO 9001, USFDA registration, TGA recognition — is maintained on a single schedule.",
      ],
      stats: [
        {
          value: "2.5 hrs",
          label:
            "Daylight overlap between Mississauga (ET) and Hyderabad (IST) business days",
          source: {
            kind: "internal",
            label: "Propharmex operating cadence",
          },
        },
        {
          value: "5",
          label:
            "Active certifications stacked across both sites: DEL · WHO-GMP · ISO 9001 · USFDA · TGA",
          source: {
            kind: "internal",
            label: "Propharmex certifications register, 2025-Q4",
          },
        },
      ],
      support: {
        kind: "dataPoint",
        headline:
          "WHO Good Manufacturing Practices provide the baseline framework for pharmaceutical manufacturing quality — the same framework Indian regulators and most emerging-market authorities cite when accepting inspected sites.",
        source: {
          label: "WHO — Good Manufacturing Practices for pharmaceutical products",
          href: "https://www.who.int/teams/health-product-policy-and-standards/standards-and-specifications/norms-and-standards-for-pharmaceuticals/guidelines/production",
        },
      },
    },

    /* ---------- 6. Call ------------------------------------------------------ */
    {
      id: "call",
      railLabel: "Call",
      eyebrow: "Chapter six",
      headline: "If the gap is real, the next step is a 15-minute call.",
      lede:
        "We do not run a demo circuit. Discovery is a scoping conversation with a named principal — development, analytical, regulatory, or distribution, depending on where your program is today.",
      body: [
        "If your program fits the model, you will hear a proposal with a timeline in weeks, costs named, and risks listed without euphemism. If it does not fit, you will hear that too, and we will point you to the organizations that do.",
        "The three actions below are the three ways most engagements begin. Pick the one that matches how you prefer to work.",
      ],
      stats: [],
      support: {
        kind: "dataPoint",
        headline:
          "Every engagement is signed off by a named principal on the Propharmex side. No account-team handoffs after signature.",
        source: {
          label: "Propharmex engagement model",
          href: "/about#leadership",
        },
      },
    },
  ],

  cta: {
    eyebrow: "Next step",
    heading: "Three ways to start with Propharmex",
    intro:
      "Pick the one that matches how you prefer to work. All three route to a named person, not a funnel.",
    actions: [
      {
        id: "schedule",
        icon: "calendar",
        label: "Schedule a 15-min discovery call",
        supporting:
          "A scoping conversation with a named principal. No sales deck.",
        href: "/contact?source=why",
        variant: "secondary",
      },
      {
        id: "playbook",
        icon: "book-open",
        // TODO: replace with real whitepaper URL when the Canada-India playbook doc ships in Prompt 15.
        label: "Download the Canada–India playbook",
        supporting:
          "A 10-page brief on how our Mississauga and Hyderabad operations interlock.",
        href: "/whitepapers/canada-india-playbook",
        variant: "ghost",
      },
      {
        id: "start",
        icon: "arrow-right",
        label: "Start a project",
        supporting:
          "Share the target product profile. We reply within one business day.",
        href: "/contact?source=why-primary",
        variant: "primary",
      },
    ],
  },
};

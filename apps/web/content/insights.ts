/**
 * Content dictionary for /insights (hub), /insights/[slug] (article detail),
 * and /insights/whitepapers/[slug] (gated whitepaper detail) — Prompt 15.
 *
 * Positioning (CLAUDE.md §1): Propharmex is a Canada-anchored pharmaceutical
 * services company with operating hubs in Mississauga, Ontario and Hyderabad,
 * Telangana, serving drug developers globally. The Insights surface is the
 * editorial layer that backs that positioning with regulatory primers,
 * analytical pillar pieces, and CDMO-strategy long-form. There is no "bridge"
 * service offering and no article frames the firm as one.
 *
 * Seed content (3 articles + 1 whitepaper) anchors three of the five pillars
 * defined in docs/seo-playbook.md:
 *
 *  - del-at-a-glance-foreign-sponsor-primer — Pillar 1 (Health Canada DEL)
 *  - ich-q2-r2-method-validation-2024       — Pillar 2 (Analytical services)
 *  - inside-a-two-hub-cdmo                  — Pillar 3 (CDMO strategy)
 *  - two-hub-operating-model (whitepaper)   — Pillar 3 (CDMO strategy, gated)
 *
 * The other two pillars (Formulation, Global market entry) seed in the
 * editorial calendar built at Prompt 23. Article #4 onward enters as Sanity
 * `insight` documents once the dataset migration ships at Prompt 22.
 *
 * Authoring pattern: bodies are typed `ArticleBlock[]` arrays — a thin TS
 * union over the equivalent Portable Text shape. Migration to Sanity is a
 * one-time transformer per block type (commit 22.x), not a rewrite. The
 * shape mirrors the `insight` and `whitepaper` Sanity schemas at the field
 * level so editors see the same surface when the dataset is seeded.
 *
 * Author convention: bylines are Propharmex editorial groups, not individuals,
 * until named bylines are confirmed. This avoids attributing regulatory
 * positions to specific people without a separate review pass.
 *
 * Claim-status convention (docs/regulatory-lexicon.md §26–39): every
 * regulatory or numeric claim that appears in a body block is anchored to a
 * primary-source URL via the `callout` block's `source` field, with an
 * "as of [date]" stamp matching the canonical date used across
 * regulatory-services.ts, analytical-services.ts, industries.ts, and
 * case-studies.ts (2026-04-23).
 */

import type { FacilityCta, FacilitySource } from "./facilities";

/* -------------------------------------------------------------------------- */
/*  Shared primitives                                                         */
/* -------------------------------------------------------------------------- */

export type InsightCta = FacilityCta;
export type InsightSource = FacilitySource;

/* -------------------------------------------------------------------------- */
/*  Filter taxonomy                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Hub filter pills. The `case-study` option routes the user to the
 * /case-studies hub rather than filtering inline — case studies are their own
 * canonical surface and we do not duplicate them under /insights. Filter
 * label copy is conservative ("Articles", not "Insights") to keep the
 * top-level eyebrow on /insights from sounding redundant against itself.
 */
export const INSIGHT_FILTERS = [
  { id: "all", label: "All" },
  { id: "article", label: "Articles" },
  { id: "whitepaper", label: "Whitepapers" },
  { id: "regulatory-update", label: "Regulatory updates" },
  { id: "case-study", label: "Case studies" },
] as const;
export type InsightFilter = (typeof INSIGHT_FILTERS)[number]["id"];

/**
 * Editorial pillar — mirrors docs/seo-playbook.md cluster taxonomy.
 * Used for grouping in the hub grid, related-reads selection, and the
 * eyebrow on each article hero.
 */
export const INSIGHT_PILLARS = [
  { id: "health-canada-del", label: "Health Canada DEL" },
  { id: "analytical-services", label: "Analytical services" },
  { id: "cdmo-strategy", label: "CDMO strategy" },
  { id: "formulation", label: "Formulation" },
  { id: "global-market-entry", label: "Global market entry" },
] as const;
export type InsightPillar = (typeof INSIGHT_PILLARS)[number]["id"];

/* -------------------------------------------------------------------------- */
/*  Article body block union                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Body block discriminated union. Every block type maps to a Portable Text
 * equivalent (block, image, or custom block) for the future Sanity migration.
 *
 *  - `p`           → block style "normal"
 *  - `h2` / `h3`   → block styles "h2" / "h3", with stable id used by the ToC
 *  - `ul` / `ol`   → block lists "bullet" / "number"
 *  - `blockquote`  → block style "blockquote"
 *  - `callout`     → custom Portable Text block `calloutBlock` (Sanity migration)
 *  - `figure`      → image block; `svgId` references an inline SVG component
 *                    rendered by the article body renderer until image assets
 *                    are uploaded to Sanity. No raster placeholders.
 *  - `pullquote`   → custom Portable Text block `pullquoteBlock`
 *  - `inline-cta`  → custom Portable Text block `inlineCtaBlock`
 */
export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string; id: string }
  | { type: "h3"; text: string; id: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "blockquote"; text: string; cite?: string }
  | {
      type: "callout";
      tone: "info" | "regulatory" | "caveat";
      heading?: string;
      body: string;
      source?: InsightSource;
    }
  | { type: "figure"; svgId: string; alt: string; caption?: string }
  | { type: "pullquote"; text: string; attribution?: string }
  | {
      type: "inline-cta";
      eyebrow: string;
      heading: string;
      body: string;
      cta: InsightCta;
    };

/* -------------------------------------------------------------------------- */
/*  Author                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Author record. Until named bylines are confirmed by the user, the seed
 * articles are attributed to editorial groups within Propharmex. The shape
 * matches the Sanity `person` document partial used on insight detail pages.
 */
export type ArticleAuthor = {
  id: string;
  name: string;
  role: string;
  bio: string;
};

export const INSIGHT_AUTHORS: Record<string, ArticleAuthor> = {
  "regulatory-practice": {
    id: "regulatory-practice",
    name: "Propharmex Regulatory Practice",
    role: "Mississauga · Health Canada DEL",
    bio: "Regulatory affairs, DEL operations, and Canadian filing strategy from the Mississauga site. Group authorship reflects internal review by named regulatory leads; individual bylines available on request.",
  },
  "analytical-bench": {
    id: "analytical-bench",
    name: "Propharmex Analytical Bench",
    role: "Hyderabad · Method development and validation",
    bio: "Analytical method development, validation, and stability under WHO-GMP from the Hyderabad analytical bench. Group authorship reflects internal review by named scientific leads; individual bylines available on request.",
  },
  editorial: {
    id: "editorial",
    name: "Propharmex Editorial",
    role: "Two-hub operating model",
    bio: "Editorial group covering CDMO strategy, the Canada-anchored two-hub operating model, and cross-pillar topics that span both sites. Reviewed by regulatory and analytical practice leads before publication.",
  },
};

/* -------------------------------------------------------------------------- */
/*  Article                                                                   */
/* -------------------------------------------------------------------------- */

export const ARTICLE_SLUGS = [
  "del-at-a-glance-foreign-sponsor-primer",
  "ich-q2-r2-method-validation-2024",
  "inside-a-two-hub-cdmo",
] as const;
export type ArticleSlug = (typeof ARTICLE_SLUGS)[number];

export type ArticleContent = {
  slug: ArticleSlug;
  pillar: InsightPillar;
  articleType: "article";
  /** ISO date string (YYYY-MM-DD). Sets `datePublished` on Article JSON-LD. */
  publishedAt: string;
  readingMinutes: number;
  title: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  hero: { eyebrow: string; lede: string };
  author: ArticleAuthor;
  tags: string[];
  /** Body authored as discriminated blocks; rendered by `<ArticleBody />`. */
  body: ArticleBlock[];
  /** Slugs of related reads — typically 2–3 from the same or adjacent pillar. */
  related: ArticleSlug[];
  /** Primary service the article maps to — used for the in-body CTA target. */
  primaryServiceLink: { label: string; href: string };
};

/* -------------------------------------------------------------------------- */
/*  Whitepaper                                                                */
/* -------------------------------------------------------------------------- */

export const WHITEPAPER_SLUGS = ["two-hub-operating-model"] as const;
export type WhitepaperSlug = (typeof WHITEPAPER_SLUGS)[number];

export type WhitepaperFormField =
  | "fullName"
  | "email"
  | "company"
  | "role"
  | "country"
  | "useCase";

export type WhitepaperContent = {
  slug: WhitepaperSlug;
  pillar: InsightPillar;
  articleType: "whitepaper";
  publishedAt: string;
  pages: number;
  title: string;
  summary: string;
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  hero: { eyebrow: string; lede: string };
  /** Bullets shown on the landing page describing what's inside. */
  insideBullets: string[];
  /** Page-level table of contents shown on the landing page. */
  contents: { id: string; label: string; pages: string }[];
  /** Form fields required for download (matches Sanity whitepaper.formFields). */
  formFields: WhitepaperFormField[];
  /** Path to the rendered PDF asset, relative to /public. */
  pdfPath: string;
  /** Disclaimer line shown above the form. */
  formDisclaimer: string;
  /** Author group attribution shown on the landing page. */
  author: ArticleAuthor;
};

/* -------------------------------------------------------------------------- */
/*  Hub                                                                       */
/* -------------------------------------------------------------------------- */

export type InsightsHubContent = {
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  hero: {
    eyebrow: string;
    headline: string;
    lede: string;
  };
  filterCopy: {
    eyebrow: string;
    heading: string;
    lede: string;
    /** Empty-state copy when a filter combination has no results. */
    emptyStateTitle: string;
    emptyStateBody: string;
    /** Suffix on the result count: "1 article" vs "2 articles". */
    resultCountSingular: string;
    resultCountPlural: string;
    /** Note shown beside the case-studies filter pill explaining the cross-link. */
    caseStudiesNote: string;
  };
  closing: {
    eyebrow: string;
    heading: string;
    body: string;
    primaryCta: InsightCta;
    secondaryCta: InsightCta;
  };
};

/* -------------------------------------------------------------------------- */
/*  Aggregate                                                                 */
/* -------------------------------------------------------------------------- */

export type InsightsContent = {
  hub: InsightsHubContent;
  articles: ArticleContent[];
  whitepapers: WhitepaperContent[];
};

/* -------------------------------------------------------------------------- */
/*  Constant — INSIGHTS                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Body blocks for the three seed articles are authored in commits 4–6 of the
 * Prompt 15 PR. This commit ships the dictionary scaffold (types, filter
 * taxonomy, author records, and frontmatter) plus the whitepaper landing-page
 * frontmatter. Bodies arrive with a brand-voice-guardian PASS gate per
 * commit; the `body: []` arrays below are intentional placeholders that will
 * not pass typecheck under the article detail page (commit 3) until they are
 * filled. The hub grid (commit 2) is content-complete from this commit
 * onward because it only reads frontmatter.
 */

export const INSIGHTS: InsightsContent = {
  hub: {
    metaTitle: "Insights — Propharmex regulatory and analytical briefings",
    metaDescription:
      "Short technical briefings from the Propharmex regulatory practice and analytical bench: Health Canada DEL, ICH method validation, and two-hub CDMO operating notes. About one per month.",
    ogTitle: "Insights — Propharmex",
    ogDescription:
      "Regulatory and analytical briefings from a Canada-anchored two-hub CDMO. Health Canada DEL, ICH, analytical method validation, and CDMO strategy.",
    hero: {
      eyebrow: "Editorial",
      headline: "Briefings from the regulatory practice and analytical bench",
      lede: "Plain-language primers on Health Canada DEL, ICH guidelines, and the operating model behind a Canadian DEL site running alongside an Indian analytical and development bench. About one new piece per month. No marketing fog.",
    },
    filterCopy: {
      eyebrow: "Filter",
      heading: "Browse by format",
      lede: "Articles are short technical primers (5–10 minutes). Whitepapers are gated long-form (15–25 minutes). Regulatory updates flag changes to ICH, Health Canada, or USFDA guidance that affect a current or upcoming filing. Case studies live on their own surface and the pill links there.",
      emptyStateTitle: "Nothing here yet under that filter.",
      emptyStateBody:
        "We publish about once a month. Clear the filter to see the full list, or check back — the editorial calendar is filling out through 2026.",
      resultCountSingular: "piece",
      resultCountPlural: "pieces",
      caseStudiesNote:
        "Case studies are anonymized client work and live at /case-studies.",
    },
    closing: {
      eyebrow: "Subscribe or talk to us",
      heading: "One email a month, no marketing.",
      body: "If a Health Canada filing, an ICH method validation question, or a two-hub tech-transfer scope is on your roadmap, we are usually 24 hours from a written reply.",
      primaryCta: {
        label: "Talk to the team",
        href: "/contact?source=insights",
        variant: "primary",
      },
      secondaryCta: {
        label: "Subscribe to the digest",
        href: "/contact?source=insights-subscribe",
        variant: "secondary",
      },
    },
  },

  articles: [
    /* --------------------------------------------------------------------- */
    /*  1 — Health Canada DEL primer                                         */
    /* --------------------------------------------------------------------- */
    {
      slug: "del-at-a-glance-foreign-sponsor-primer",
      pillar: "health-canada-del",
      articleType: "article",
      publishedAt: "2026-04-26",
      readingMinutes: 8,
      title:
        "The Drug Establishment Licence at a glance: what every foreign sponsor should know before filing",
      excerpt:
        "GUI-0002 in plain language. What a Drug Establishment Licence actually authorizes, the three application errors we see most often, and where the Health Canada service standard sits as of April 2026.",
      metaTitle:
        "Drug Establishment Licence (DEL) primer for foreign sponsors — Propharmex",
      metaDescription:
        "Plain-language primer on Health Canada's Drug Establishment Licence (DEL) under GUI-0002 — what it authorizes, the three most common application errors, and the current service standard.",
      ogTitle:
        "DEL at a glance: a foreign-sponsor primer on Health Canada's Drug Establishment Licence",
      ogDescription:
        "What GUI-0002 actually requires, where applications most often stumble, and what the Health Canada service standard looks like in 2026.",
      hero: {
        eyebrow: "Health Canada DEL · Primer",
        lede: "If you are a US, EU, or APAC sponsor preparing your first Drug Establishment Licence application, three things tend to surprise you. This is the version of GUI-0002 we wish we had read earlier.",
      },
      author: INSIGHT_AUTHORS["regulatory-practice"]!,
      tags: [
        "Health Canada",
        "DEL",
        "GUI-0002",
        "Foreign sponsors",
        "Regulatory affairs",
      ],
      body: [
        {
          type: "p",
          text: "A Drug Establishment Licence (DEL) is the Canadian authorization required to fabricate, package, label, test, import, distribute, or wholesale a drug. It is issued by Health Canada's Regulatory Operations and Enforcement Branch under the Food and Drug Regulations. For a foreign sponsor planning to enter the Canadian market — by direct importation, by tech transfer to a Canadian site, or by partnering with a Canadian establishment — the DEL is the prerequisite that gates almost every downstream activity.",
        },
        {
          type: "p",
          text: "If you arrive at a DEL application with a working knowledge of US FDA establishment registration or EU MIA authorizations, the operating model will be familiar. The detail will not. What follows is the version of GUI-0002 we wish we had read earlier — what the licence authorizes, the three errors that most often delay first-time applications, and where the Health Canada service standard sits today.",
        },

        {
          type: "h2",
          text: "What a Drug Establishment Licence authorizes",
          id: "what-a-del-authorizes",
        },
        {
          type: "p",
          text: "GUI-0002 is the operating manual for DEL applications. It scopes the activity classes the licence can cover, the categories of drugs in scope (pharmaceuticals, biologics, radiopharmaceuticals, and Schedule C/D drugs), and the evidence required for each activity-site-category triple. The licence is site-specific: each physical building where a regulated activity takes place is licensed separately, and the activities listed on the licence determine what the site is legally permitted to do.",
        },
        {
          type: "callout",
          tone: "regulatory",
          heading: "Primary source",
          body: "GUI-0002 — Guide to drug establishment licences and drug establishment licensing fees — is the canonical Health Canada document for DEL applications. Read it against your draft site master file before you start filling forms.",
          source: {
            kind: "primary",
            label:
              "Health Canada GUI-0002 (as of 2026-04-23)",
            href: "https://www.canada.ca/en/health-canada/services/drugs-health-products/compliance-enforcement/establishment-licences/guidance-document.html",
          },
        },
        {
          type: "p",
          text: "Activity classes commonly listed on a DEL include fabrication, packaging and labelling, testing, importation, distribution, and wholesaling. Each carries its own evidence expectations. A site licensed for fabrication has a higher GMP evidence bar than one licensed only for distribution. The activity scope is among the most consequential decisions in the application — it determines the inspection footprint, the GMP evidence package, and the renewal cadence.",
        },
        {
          type: "ul",
          items: [
            "Fabrication and packaging require a full GMP evidence package and trigger an on-site Health Canada inspection.",
            "Importation requires evidence that each foreign site supplying drugs into Canada operates under acceptable GMP — typically through a Health Canada inspection of the foreign site, a recognized foreign authority's inspection, or an applicable Mutual Recognition Agreement.",
            "Distribution and wholesaling have lighter evidence expectations than fabrication but still require a quality system, a recall procedure, and complaints handling per Division 2 of the Food and Drug Regulations.",
          ],
        },

        {
          type: "h2",
          text: "The three application errors we see most often",
          id: "common-application-errors",
        },
        {
          type: "p",
          text: "Across DEL applications we have prepared, audited, or supported as Canadian agent, three categories of issue account for most pre-licence requests for additional information from Health Canada. Each is avoidable with a careful read of GUI-0002 against your draft site master file.",
        },

        {
          type: "h3",
          text: "Activity-class scoping mistakes",
          id: "scoping-mistakes",
        },
        {
          type: "p",
          text: "First-time applicants frequently apply for either too narrow or too broad an activity scope. Too narrow — applying only for distribution when the site also conducts incoming raw-material testing — forces an amendment within months and a re-inspection. Too broad — applying for fabrication on a site that lacks the QA infrastructure for it — invites either deficiencies or a request to withdraw and refile. The right scope is the smallest one that covers your actual operating activities for the next 24 months, plus any planned activity that has signed-off project documentation.",
        },

        {
          type: "h3",
          text: "Foreign-site evidence package mismatches",
          id: "foreign-site-evidence",
        },
        {
          type: "p",
          text: "Where drugs are imported into Canada, GUI-0002 requires evidence that each foreign manufacturing site operates under acceptable GMP. Mismatches happen when the evidence on file is older than the look-back window, when a renewal certificate is on a different legal entity than the drug-licence holder, or when the foreign site's listed scope no longer matches the activity being imported. Each mismatch is its own request for additional information, and they tend to surface late in the review.",
        },

        {
          type: "h3",
          text: "Site master file gaps",
          id: "site-master-file-gaps",
        },
        {
          type: "p",
          text: "The site master file is the most-reviewed document in a DEL application. Common gaps: stale equipment qualification status, an organizational chart that does not match the current QMS, missing or out-of-date HVAC qualification documents, and SOPs referenced in the SMF that the inspector cannot locate on first request. The SMF is read literally — every cross-reference must resolve to a current, controlled document.",
        },
        {
          type: "callout",
          tone: "info",
          body: "If you are planning a first DEL application in 2026, build the site master file at least three months before the planned filing date and run a mock inspection against it. The errors above are easier to fix in the dry run than in a live request for additional information.",
        },

        {
          type: "inline-cta",
          eyebrow: "Talk to the regulatory practice",
          heading: "Planning a first-time DEL application?",
          body: "We hold a DEL at our Mississauga site and act as Canadian agent for foreign sponsors entering the Canadian market. A 30-minute call clarifies activity-class scoping, evidence-package strategy, and timing before you commit to a filing date.",
          cta: {
            label: "Schedule a regulatory call",
            href: "/contact?source=insights-del-primer",
            variant: "primary",
          },
        },

        {
          type: "h2",
          text: "Where the service standard sits as of April 2026",
          id: "service-standard-2026",
        },
        {
          type: "p",
          text: "Health Canada publishes service standards for DEL applications and amendments on its public website, broken out by application type (new licence, amendment, annual licence review). For new licences, the published target captures complete-to-decision elapsed time and is updated periodically. Actual elapsed time for any individual application varies with the activity classes requested, the inspection footprint, and the quality of the application.",
        },
        {
          type: "callout",
          tone: "regulatory",
          body: "Service standards are targets, not commitments. A request for additional information mid-review pauses the clock; a deficient site master file or unresolved foreign-site evidence package can extend an application well beyond the published target.",
          source: {
            kind: "primary",
            label:
              "Health Canada Drug Establishment Licence service standards (as of 2026-04-23)",
            href: "https://www.canada.ca/en/health-canada/services/drugs-health-products/compliance-enforcement/establishment-licences/service-standards.html",
          },
        },

        {
          type: "h2",
          text: "If you are starting an application this quarter",
          id: "starting-an-application",
        },
        {
          type: "p",
          text: "Three practical recommendations for sponsors filing a first DEL application in the next 90 days:",
        },
        {
          type: "ol",
          items: [
            "Lock the activity scope before you draft the site master file. Resolving scoping ambiguity after the SMF is drafted is roughly twice the work.",
            "Confirm every foreign-site evidence reference is current, on the right legal entity, and within the required look-back window. A single mismatch can stall the entire application.",
            "Plan a mock inspection three to four weeks before submission. Either an internal cross-functional walk-through or an external regulatory consultant — the goal is finding the gaps before the inspector does.",
          ],
        },
        {
          type: "p",
          text: "DEL applications are operational-discipline projects, not transformational ones. Every gap a Health Canada reviewer or inspector finds is a gap that existed before the application was filed; the document review is the surface that exposes it. The applications that go through cleanly are the ones where the SMF is the artifact of the actual quality system on the day of filing — not a document written for the regulator.",
        },

        {
          type: "callout",
          tone: "caveat",
          heading: "Disclaimer",
          body: "This article is informational and does not constitute regulatory advice. Specific filings, timelines, and outcomes depend on facts not visible from public information. For advice tailored to your facility, your activities, and your filing strategy, contact our regulatory practice or a qualified Canadian regulatory professional.",
        },
      ],
      related: ["inside-a-two-hub-cdmo", "ich-q2-r2-method-validation-2024"],
      primaryServiceLink: {
        label: "Regulatory services",
        href: "/services/regulatory-services",
      },
    },

    /* --------------------------------------------------------------------- */
    /*  2 — ICH Q2(R2) analytical primer                                     */
    /* --------------------------------------------------------------------- */
    {
      slug: "ich-q2-r2-method-validation-2024",
      pillar: "analytical-services",
      articleType: "article",
      publishedAt: "2026-04-26",
      readingMinutes: 9,
      title:
        "ICH Q2(R2) and what it changed for method validation in 2024",
      excerpt:
        "ICH Q2 was revised in 2023 and adopted into regional guidance through 2024. A practical walkthrough of what changed, what it means for validation packages already in flight, and where the Q14-aligned analytical procedure development guidance fits beside it.",
      metaTitle:
        "ICH Q2(R2) method validation: what changed in 2024 — Propharmex",
      metaDescription:
        "What ICH Q2(R2) actually changed for analytical method validation, how to update an in-flight validation package, and how it interacts with Q14 analytical procedure development.",
      ogTitle:
        "ICH Q2(R2): a practical method-validation walkthrough",
      ogDescription:
        "The 2023 revision in plain language, with the in-flight validation packages most likely to need an addendum.",
      hero: {
        eyebrow: "Analytical services · ICH",
        lede: "ICH Q2(R2) is a tighter, more lifecycle-aware document than its predecessor. Most validation packages already in flight do not need a redo — but a small subset do, and that distinction matters.",
      },
      author: INSIGHT_AUTHORS["analytical-bench"]!,
      tags: [
        "ICH",
        "Q2(R2)",
        "Method validation",
        "Q14",
        "Analytical services",
      ],
      body: [
        {
          type: "p",
          text: "ICH Q2(R2) — Validation of Analytical Procedures — was adopted by the ICH Assembly in November 2023 and has been brought into force across the major regulatory regions through 2024. It replaces Q2(R1), which had stood since 2005. The revision is tighter, more lifecycle-aware, and — critically — explicitly linked to the new ICH Q14 guideline on analytical procedure development.",
        },
        {
          type: "p",
          text: "If you have a validation package already in flight, the question is not whether to read Q2(R2). It is whether you need to amend, addendum, or simply annotate. The honest answer for most packages: less work than the version jump suggests, but not zero. What follows is a practical walkthrough of what changed, what stayed the same, and how to read your in-flight package against the new text.",
        },

        {
          type: "h2",
          text: "What ICH Q2(R2) actually says",
          id: "what-q2-r2-says",
        },
        {
          type: "p",
          text: "Q2(R2) keeps the structural framework that made Q2(R1) the reference document for analytical method validation: validation characteristics (specificity, accuracy, precision, detection and quantitation limits, linearity, range, robustness), method types (identification, impurities, assay, dissolution), and the matrix that maps which characteristics apply to which method type. The revision rewrites how those characteristics are described and tightens what the validation package must demonstrate.",
        },
        {
          type: "callout",
          tone: "regulatory",
          heading: "Primary source",
          body: "ICH Q2(R2) — Validation of Analytical Procedures — was adopted at Step 4 of the ICH process on 14 November 2023. The full guideline text is published on the ICH website and is the canonical reference for any current validation package.",
          source: {
            kind: "primary",
            label: "ICH Q2(R2) (as of 2026-04-23)",
            href: "https://www.ich.org/page/quality-guidelines",
          },
        },

        {
          type: "h2",
          text: "What changed from Q2(R1) to Q2(R2)",
          id: "what-changed",
        },
        {
          type: "p",
          text: "Three changes matter for in-flight validation packages:",
        },

        {
          type: "h3",
          text: "Lifecycle framing instead of point-in-time validation",
          id: "lifecycle-framing",
        },
        {
          type: "p",
          text: "Q2(R1) treated validation as an event — the package demonstrating the method was fit for purpose at the moment of submission. Q2(R2) reframes validation as one stage of a method lifecycle that includes development (Q14), validation (Q2(R2)), and ongoing performance verification. The text is more explicit that the validation package supports the method as defined and that the method may evolve through controlled change.",
        },
        {
          type: "p",
          text: "For a package already at the protocol stage, this is mostly a documentation and language change. The same tests, the same acceptance criteria. The change is in how the package is contextualized — validation evidence at this point in the method's lifecycle, not a one-time stamp.",
        },

        {
          type: "h3",
          text: "Tighter language on robustness and acceptance criteria",
          id: "robustness-and-acceptance",
        },
        {
          type: "p",
          text: "Q2(R2) is more direct that acceptance criteria for each validation characteristic must be predefined in the protocol, justified by the method's intended use, and linked to product specifications where applicable. Robustness in particular is described in more concrete terms — what factors should be deliberately varied, how the result should be evaluated, and how robustness study findings feed back into the analytical procedure description.",
        },

        {
          type: "h3",
          text: "Explicit linkage to ICH Q14",
          id: "linkage-to-q14",
        },
        {
          type: "p",
          text: "Q14 — Analytical Procedure Development — was adopted alongside Q2(R2) and codifies the development side of the method lifecycle. Q14 is not retroactive: a method developed before 2024 does not need to be redeveloped under Q14. But for new methods, Q14 sets the expectation that development decisions, control strategy, and the analytical procedure description itself are documented in a way that supports the eventual validation package and ongoing performance verification.",
        },
        {
          type: "callout",
          tone: "info",
          body: "If your method was developed and validated under Q2(R1) and is in an active filing, you generally do not need to redo the work to comply with Q2(R2). Most regulatory regions have transitional provisions — confirm the specific position of your filing region before assuming.",
        },

        {
          type: "h2",
          text: "How Q14 fits beside Q2(R2)",
          id: "q14-beside-q2",
        },
        {
          type: "p",
          text: "Q14 and Q2(R2) are companion documents. Q14 governs how the method is developed, characterized, and described; Q2(R2) governs how the validation evidence is structured. The dividing line: if a question is about choices made during development — selectivity rationale, control strategy, analytical target profile — it lives in Q14. If a question is about evidence — precision data, accuracy spike-recovery, robustness factor effects — it lives in Q2(R2).",
        },
        {
          type: "p",
          text: "For a sponsor with multiple methods in development, the practical implication is that development records have to be structured well enough to support both deliverables. The analytical procedure description, the control strategy, and the validation protocol should reference each other consistently, with no gap between development decisions and validation evidence.",
        },

        {
          type: "h2",
          text: "Validation packages already in flight: do you need to redo work?",
          id: "in-flight-packages",
        },
        {
          type: "p",
          text: "Three categories of in-flight package, with different answers:",
        },
        {
          type: "ul",
          items: [
            "Package fully drafted under Q2(R1), already submitted and under review — typically no rework. Regional regulators have transitional provisions; if the dossier was accepted under Q2(R1), it is reviewed under Q2(R1) absent a specific deficiency.",
            "Package drafted under Q2(R1) but not yet submitted, target submission late 2025 onward — a focused addendum is usually enough. Re-confirm acceptance criteria are documented per Q2(R2) language; tighten the robustness section if the original protocol was thin there; reframe the package within the method lifecycle.",
            "New method, development starting in 2025 or later — develop under Q14, validate under Q2(R2). The two documents together are the design intent.",
          ],
        },
        {
          type: "p",
          text: "The category that most often catches sponsors out is the second one — packages that were structurally complete under Q2(R1) but had a thin robustness section or implicit acceptance-criteria justification. The Q2(R2) text makes those gaps more visible to a reviewer than they were before.",
        },

        {
          type: "inline-cta",
          eyebrow: "Talk to the analytical bench",
          heading: "Validation package needs a Q2(R2) addendum?",
          body: "Our Hyderabad analytical bench audits in-flight validation packages against Q2(R2) language and drafts the addendum or robustness rework where needed. A 30-minute call surfaces the scope before any work starts.",
          cta: {
            label: "Schedule an analytical review",
            href: "/contact?source=insights-q2-r2",
            variant: "primary",
          },
        },

        {
          type: "h2",
          text: "Practical recommendations for analytical teams",
          id: "practical-recommendations",
        },
        {
          type: "ol",
          items: [
            "Read Q2(R2) once end-to-end before reading any in-flight protocol against it. The reframed structure is easier to absorb in the abstract before applying.",
            "Audit the robustness section of every protocol drafted before mid-2024. Q2(R2) is more explicit on what robustness must demonstrate; thin sections are the most common deficiency we see.",
            "Document acceptance-criteria justification — the chain from product specification to validation acceptance criterion — explicitly. Implicit justification was tolerated under Q2(R1); Q2(R2) reads more strictly.",
            "For new methods, treat Q14 development records and the Q2(R2) validation protocol as one coherent document set. Cross-reference them deliberately.",
          ],
        },
        {
          type: "p",
          text: "Q2(R2) is not a disruptive revision. It is a disciplined one. The validation work that was good under Q2(R1) is still good; the gaps that were tolerated are now more visible. Most teams do not need to redo methods. They need to read their existing packages with the new text in hand and decide whether the gaps justify a focused addendum or a quiet annotation.",
        },

        {
          type: "blockquote",
          text: "The hardest part of Q2(R2) is not the science. It is unwinding the habit of reading method validation as an event rather than a stage in a lifecycle.",
          cite: "Propharmex Analytical Bench",
        },

        {
          type: "callout",
          tone: "caveat",
          heading: "Disclaimer",
          body: "This article is informational and does not constitute regulatory advice. Specific filings, regional positions, and acceptance criteria depend on the dossier, the regulator, and the molecule. For advice tailored to your validation package and filing strategy, contact our analytical practice or a qualified regulatory professional.",
        },
      ],
      related: ["del-at-a-glance-foreign-sponsor-primer", "inside-a-two-hub-cdmo"],
      primaryServiceLink: {
        label: "Analytical services",
        href: "/services/analytical-services",
      },
    },

    /* --------------------------------------------------------------------- */
    /*  3 — Two-hub CDMO operating model                                     */
    /* --------------------------------------------------------------------- */
    {
      slug: "inside-a-two-hub-cdmo",
      pillar: "cdmo-strategy",
      articleType: "article",
      publishedAt: "2026-04-26",
      readingMinutes: 10,
      title:
        "Inside a two-hub CDMO: how a Canadian DEL site and an Indian analytical bench operate under one quality system",
      excerpt:
        "How a Canada-anchored two-hub operating model actually functions day-to-day for global sponsors. Data flow, batch record chain-of-custody, QP release path, and where the operational seams are.",
      metaTitle:
        "Inside a two-hub CDMO: Mississauga DEL site + Hyderabad analytical bench — Propharmex",
      metaDescription:
        "How a Canadian DEL site and an Indian analytical and development bench operate under one quality system day-to-day. Data flow, QP release path, and operational discipline.",
      ogTitle:
        "Inside a two-hub CDMO: how the operating model actually works",
      ogDescription:
        "A Canada-anchored two-hub operating model in practice — Mississauga DEL site, Hyderabad analytical bench, one quality system, global sponsors.",
      hero: {
        eyebrow: "CDMO strategy · Operating model",
        lede: "Two operating hubs, one quality system, global clients. Here is what that actually looks like across a real engagement — without the marketing.",
      },
      author: INSIGHT_AUTHORS.editorial!,
      tags: [
        "CDMO strategy",
        "Two-hub",
        "Quality systems",
        "Tech transfer",
        "Operations",
      ],
      body: [
        {
          type: "p",
          text: "Propharmex operates from two hubs: Mississauga, Ontario, where we hold a Health Canada Drug Establishment Licence and run 3PL distribution, and Hyderabad, Telangana, where we run pharmaceutical development and analytical services. Our clients are drug developers globally — US generic sponsors, EU innovators, multilateral procurement agencies, and a handful of NGO programs. There is no bridge service offering between the two countries. The two-hub structure is how the company operates, not a productized intermediary role.",
        },
        {
          type: "p",
          text: "That distinction matters more than it seems. A bridge framing implies the value is in the routing — moving work between Canada and India for some structural advantage. The actual value is the operational discipline of running a Canadian DEL site and an Indian analytical bench under one quality system, for a client base that does not particularly care which side of the world the work happens on. They care that it lands on time, lands clean, and lands in a form their regulator accepts.",
        },
        {
          type: "p",
          text: "What follows is what that actually looks like, week to week, for a real engagement.",
        },

        {
          type: "h2",
          text: "What lives at each hub",
          id: "what-lives-at-each-hub",
        },

        {
          type: "h3",
          text: "Mississauga: regulatory authority and release",
          id: "mississauga-hub",
        },
        {
          type: "p",
          text: "The Mississauga site is the regulatory anchor. It holds a Health Canada Drug Establishment Licence and operates the Canadian-side quality, regulatory, and release functions: QP release where required, Canadian agent representation for foreign sponsors, primary point of contact with Health Canada, and 3PL distribution into the Canadian market. The site's quality system is the master quality system for the firm — not a regional copy.",
        },
        {
          type: "callout",
          tone: "regulatory",
          heading: "Primary source",
          body: "Propharmex's Drug Establishment Licence at the Mississauga site is verifiable through the Health Canada Drug Product Database. The DEL determines what activities the site is authorized to perform; it does not constitute a regulatory approval of any product the site handles.",
          source: {
            kind: "primary",
            label:
              "Health Canada Drug Product Database (as of 2026-04-23)",
            href: "https://health-products.canada.ca/dpd-bdpp/",
          },
        },

        {
          type: "h3",
          text: "Hyderabad: development bench and analytical depth",
          id: "hyderabad-hub",
        },
        {
          type: "p",
          text: "The Hyderabad site is the development and analytical hub. It runs formulation development across oral solids, oral liquids, sterile injectables, and topicals; analytical method development and validation; stability programs across ICH and WHO climatic zones; and tech-transfer execution into manufacturing partners. The site operates under WHO-GMP, with capability for sponsor or regulatory audits at standard cadence.",
        },
        {
          type: "p",
          text: "The development bench in Hyderabad runs continuously, not episodically. A sponsor engagement does not stand up a project team from scratch — it is allocated to a development pod with formulation, analytical, and regulatory representation already configured. That continuity is the depth.",
        },

        {
          type: "h2",
          text: "How a typical engagement flows across both",
          id: "engagement-flow",
        },
        {
          type: "p",
          text: "A representative engagement — say, a US generic sponsor planning a Canadian and US filing on a sterile injectable — moves across both sites in a defined sequence:",
        },
        {
          type: "ol",
          items: [
            "Scope and quality plan finalized at Mississauga, with a Canadian Quality Agreement that sets data ownership, audit rights, and release path.",
            "Formulation and analytical work executed at Hyderabad: formulation studies, method development, validation under ICH Q2(R2), stability initiated under appropriate climatic zone.",
            "Tech-transfer package authored at Hyderabad, reviewed against the Canadian quality system at Mississauga, frozen for execution.",
            "Manufacturing executed at the designated commercial site (sometimes Mississauga, more often a contracted manufacturer); Hyderabad runs release testing on a cross-validated method; Mississauga performs Canadian release for any Canadian-bound product.",
            "Filing authored cross-site — analytical and CMC sections drafted in Hyderabad with US/Canadian regulatory editorial in Mississauga, then submitted by the sponsor or by Propharmex as Canadian agent.",
          ],
        },
        {
          type: "p",
          text: "What this sequence is not is a hand-off chain. It is a single project under one PMO, with two execution sites that interact through a shared QMS, daily stand-ups during active phases, and a single project record visible to the sponsor.",
        },

        {
          type: "h2",
          text: "One quality system, two sites",
          id: "one-quality-system",
        },
        {
          type: "p",
          text: "The structural commitment behind the two-hub model is a single QMS — the Mississauga master quality system, with Hyderabad operating as a controlled secondary site under that system. SOPs are versioned centrally; deviations and CAPAs are tracked in a single ledger with site-of-occurrence tagging; document control is single-source-of-truth; data integrity controls (ALCOA+) apply equally at both sites.",
        },
        {
          type: "callout",
          tone: "info",
          heading: "What this means in practice",
          body: "When a sponsor's auditor or a regulator requests a document, the answer is the same regardless of which site executed the work — because the document control system is the same. There is no site-A-said, site-B-said reconciliation work.",
        },
        {
          type: "p",
          text: "The pharmaceutical quality system framework we operate against is consistent with ICH Q10. Q10 does not prescribe how a multi-site CDMO should be structured; it does set the expectation that the quality system covers the product lifecycle across whatever organizational structure the firm chooses. Our choice is a single master system rather than two parallel systems linked by a quality agreement.",
        },

        {
          type: "h2",
          text: "Where the operational seams are",
          id: "operational-seams",
        },
        {
          type: "p",
          text: "Honest about the seams: the two-hub model is not friction-free. The places it has to work hardest are the same places any multi-site operation has to work hardest, just with a longer flight time when an in-person resolution is needed.",
        },
        {
          type: "ul",
          items: [
            "Time-zone overlap is roughly 90 minutes between Mississauga and Hyderabad on a standard business day. Active-phase projects use that window for stand-ups; everything else runs asynchronously with documented hand-offs.",
            "Sample shipment for analytical work crosses customs in both directions. Cold-chain integrity, courier qualification, and lead-time buffers are first-class operational concerns, not afterthoughts.",
            "Regulatory editorial split — analytical and CMC content drafted in Hyderabad, regional editorial finalized in Mississauga — needs disciplined version control. We use a single dossier-staging environment to avoid email-attachment drift.",
          ],
        },
        {
          type: "p",
          text: "These seams are not features. They are the cost of running two sites instead of one. The reason to absorb that cost is the depth and authority that comes from each side — and for the right sponsors and the right work, the math works.",
        },

        {
          type: "inline-cta",
          eyebrow: "Talk to the team",
          heading: "Evaluating a two-hub CDMO partner?",
          body: "If you are scoping a CDMO engagement that needs Canadian regulatory authority and Indian analytical depth under one quality system, a 30-minute call clarifies fit before either side spends real time on a proposal.",
          cta: {
            label: "Schedule a discovery call",
            href: "/contact?source=insights-two-hub",
            variant: "primary",
          },
        },

        {
          type: "h2",
          text: "When this model is the right answer (and when it isn't)",
          id: "when-its-the-right-answer",
        },
        {
          type: "p",
          text: "The two-hub model fits a specific sponsor profile. It is the right answer for sponsors who need Canadian regulatory authority (DEL holder, Canadian agent, Health Canada relationship) and analytical or development depth in the same engagement, with global filing reach. It is the right answer for sponsors who would otherwise be running a multi-vendor program — one Canadian regulatory consultant, one Indian analytical lab, a separate Canadian 3PL — and want the consolidation.",
        },
        {
          type: "p",
          text: "It is not the right answer for sponsors who need single-site, single-region work where neither geography matters. A US-only sterile-injectable manufacturer with no Canadian filing intent does not benefit from a Canadian DEL, and we will say so. The honest answer to the question is what gets the engagement off to a clean start; the alternative is a misfit project that either party regrets six months in.",
        },

        {
          type: "blockquote",
          text: "The two-hub model is operational, not aspirational. The Mississauga DEL site does what a Canadian DEL site does. The Hyderabad analytical bench does what an Indian analytical bench does. The work between them is the boring, disciplined kind that does not show up on a marketing page.",
          cite: "Propharmex Editorial",
        },

        {
          type: "callout",
          tone: "caveat",
          heading: "Disclaimer",
          body: "This article describes our current operating model and is informational only. Specific engagement scope, regulatory pathways, and timelines depend on the sponsor, the molecule, and the filing strategy. For advice tailored to your program, contact our team or a qualified regulatory professional.",
        },
      ],
      related: [
        "del-at-a-glance-foreign-sponsor-primer",
        "ich-q2-r2-method-validation-2024",
      ],
      primaryServiceLink: {
        label: "Why Propharmex",
        href: "/why-propharmex",
      },
    },
  ],

  whitepapers: [
    /* --------------------------------------------------------------------- */
    /*  WP 1 — The two-hub operating model                                   */
    /* --------------------------------------------------------------------- */
    {
      slug: "two-hub-operating-model",
      pillar: "cdmo-strategy",
      articleType: "whitepaper",
      publishedAt: "2026-04-26",
      pages: 4,
      title: "The two-hub operating model",
      summary:
        "A field guide for innovator and generic sponsors evaluating CDMO partners that operate a Canadian DEL site and an Indian analytical and development bench under one quality system. Canada-anchored, two operating hubs, global clients.",
      metaTitle:
        "Whitepaper — The two-hub operating model | Propharmex",
      metaDescription:
        "Field guide on operating a Canadian DEL site (Mississauga) and an Indian analytical and development bench (Hyderabad) under one quality system, for global drug developers.",
      ogTitle: "Whitepaper: The two-hub operating model",
      ogDescription:
        "Canadian regulatory authority, Indian analytical depth, one quality system. A field guide for sponsors evaluating CDMO partners.",
      hero: {
        eyebrow: "Whitepaper · CDMO strategy",
        lede: "The full operating model in 4 pages — why this structure exists, what each hub does, and how a real engagement flows across them. Free download for verified business contacts.",
      },
      insideBullets: [
        "What a Canadian DEL site under Health Canada Drug Establishment Licence actually authorizes — and what it does not.",
        "How the Hyderabad analytical and development bench operates under WHO-GMP, and the development workflows that live there.",
        "How a typical engagement flows across both sites — data, batch records, release path, audit cadence.",
        "Decision checklist for choosing a two-hub CDMO over a single-site or franchised-network alternative.",
      ],
      contents: [
        { id: "executive-summary", label: "Executive summary", pages: "1" },
        {
          id: "mississauga-hub",
          label: "The Mississauga hub: DEL, release, regulator relationships",
          pages: "1",
        },
        {
          id: "hyderabad-hub",
          label: "The Hyderabad hub: analytical depth, development bench",
          pages: "1",
        },
        {
          id: "decision-framework",
          label: "Decision framework + checklist",
          pages: "1",
        },
      ],
      formFields: ["fullName", "email", "company", "role", "country", "useCase"],
      pdfPath: "/downloads/two-hub-operating-model.pdf",
      formDisclaimer:
        "We use this contact information to send the download and a single follow-up. We do not sell or share contact lists. Full privacy notice at /legal/privacy.",
      author: INSIGHT_AUTHORS.editorial!,
    },
  ],
};

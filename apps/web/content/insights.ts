/**
 * Content dictionary for /insights (hub), /insights/[slug] (article detail),
 * and /insights/whitepapers/[slug] (gated whitepaper detail) — Prompt 15.
 *
 * Positioning: Propharmex is a Canada-headquartered pharmaceutical
 * services company serving drug developers globally. The Insights surface is
 * the editorial layer that
 * backs that positioning with regulatory primers, analytical pillar pieces,
 * and CDMO-strategy long-form. There is no "bridge" service offering and no
 * article frames the firm as one.
 *
 * Seed content (1 article + 1 whitepaper) anchors one of the four pillars
 * (the licence-specific pillar was retired alongside related seed articles
 * that were incompatible with the current
 * specialty-CDMO positioning):
 *
 *  - ich-q2-r2-method-validation-2024            — Analytical services pillar
 *  - canadian-cdmo-operating-model (whitepaper)  — CDMO strategy pillar (gated, retired URL surface)
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
export interface ArticleAuthor {
  id: string;
  name: string;
  role: string;
  bio: string;
}

export const INSIGHT_AUTHORS = {
  "regulatory-practice": {
    id: "regulatory-practice",
    name: "Propharmex Regulatory Practice",
    role: "Regulatory strategy and submissions",
    bio: "Regulatory strategy, CMC dossier authoring, and submission support across Health Canada, USFDA, EMA, and other regulators on behalf of client programs. Group authorship reflects internal review by named regulatory leads; individual bylines available on request.",
  },
  "analytical-bench": {
    id: "analytical-bench",
    name: "Propharmex Analytical Bench",
    role: "Method development and validation",
    bio: "Analytical method development, validation, and stability work from the Propharmex analytical bench, structured around ICH Q2(R2) and ICH Q1A(R2). Group authorship reflects internal review by named scientific leads; individual bylines available on request.",
  },
  editorial: {
    id: "editorial",
    name: "Propharmex Editorial",
    role: "CDMO strategy and operating model",
    bio: "Editorial group covering specialty-CDMO strategy, the Propharmex operating model, and cross-pillar topics. Reviewed by regulatory and analytical practice leads before publication.",
  },
} satisfies Record<string, ArticleAuthor>;

/* -------------------------------------------------------------------------- */
/*  Article                                                                   */
/* -------------------------------------------------------------------------- */

export const ARTICLE_SLUGS = ["ich-q2-r2-method-validation-2024"] as const;
export type ArticleSlug = (typeof ARTICLE_SLUGS)[number];

export interface ArticleContent {
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
}

/* -------------------------------------------------------------------------- */
/*  Whitepaper                                                                */
/* -------------------------------------------------------------------------- */

/**
 * Whitepaper slugs.
 *
 * Empty as of PR-D2c3' — the only seeded whitepaper ("The Canadian CDMO
 * operating model") was retired with the specialty-CDMO repositioning. Its
 * URL surface is 301'd to /insights/whitepapers via apps/web/next.config.ts
 * (added in PR-D1'); INSIGHTS.whitepapers was emptied in PR-D2c2'; this PR
 * closes the architectural surface (Zod enum, type narrowing, sitemap
 * entries, static-params generator).
 *
 * `WhitepaperSlug` resolves to `never` while the array is empty. The
 * downstream `Record<WhitepaperSlug, WhitepaperContent>` becomes
 * `Record<never, WhitepaperContent> = {}`, which is correct: there is
 * literally no valid whitepaper slug today.
 *
 * When client-approved whitepaper content lands, add the new slug here and
 * the cascade re-engages: sitemap entry generates, page handler accepts the
 * slug, API route validates against the union.
 */
export const WHITEPAPER_SLUGS = [] as const;
export type WhitepaperSlug = (typeof WHITEPAPER_SLUGS)[number];

export type WhitepaperFormField = "fullName" | "email" | "company" | "role" | "country" | "useCase";

export interface WhitepaperContent {
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
}

/* -------------------------------------------------------------------------- */
/*  Hub                                                                       */
/* -------------------------------------------------------------------------- */

export interface InsightsHubContent {
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
}

/* -------------------------------------------------------------------------- */
/*  Aggregate                                                                 */
/* -------------------------------------------------------------------------- */

export interface InsightsContent {
  hub: InsightsHubContent;
  articles: ArticleContent[];
  whitepapers: WhitepaperContent[];
}

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
      "Short technical briefings from the Propharmex regulatory practice and analytical bench — ICH method validation, regulatory pathways across multiple geographies, and specialty-CDMO operating notes. About one per month.",
    ogTitle: "Insights — Propharmex",
    ogDescription:
      "Regulatory and analytical briefings from a specialty CDMO. ICH guidelines, analytical method validation, and CDMO strategy.",
    hero: {
      eyebrow: "Editorial",
      headline: "Briefings from the regulatory practice and analytical bench",
      lede: "Plain-language primers on ICH guidelines, regulatory pathways, analytical method validation, and the operating model behind a Canada-headquartered pharmaceutical services company. About one new piece per month. No marketing fog.",
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
      caseStudiesNote: "Case studies are anonymized client work and live at /case-studies.",
    },
    closing: {
      eyebrow: "Subscribe or talk to us",
      heading: "One email a month, no marketing.",
      body: "If a Health Canada filing, an ICH method validation question, or a tech-transfer scope is on your roadmap, we are usually 24 hours from a written reply.",
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
    /*  1 — ICH Q2(R2) analytical primer                                     */
    /*                                                                       */
    /*  Note: a licence-specific primer article was                          */
    /*  removed in PR-D2c2' (specialty-CDMO repositioning). The URL surface  */
    /*  is 301'd to /insights via apps/web/next.config.ts.                   */
    /* --------------------------------------------------------------------- */
    {
      slug: "ich-q2-r2-method-validation-2024",
      pillar: "analytical-services",
      articleType: "article",
      publishedAt: "2026-04-26",
      readingMinutes: 9,
      title: "ICH Q2(R2) and what it changed for method validation in 2024",
      excerpt:
        "ICH Q2 was revised in 2023 and adopted into regional guidance through 2024. A practical walkthrough of what changed, what it means for validation packages already in flight, and where the Q14-aligned analytical procedure development guidance fits beside it.",
      metaTitle: "ICH Q2(R2) method validation: what changed in 2024 — Propharmex",
      metaDescription:
        "What ICH Q2(R2) actually changed for analytical method validation, how to update an in-flight validation package, and how it interacts with Q14 analytical procedure development.",
      ogTitle: "ICH Q2(R2): a practical method-validation walkthrough",
      ogDescription:
        "The 2023 revision in plain language, with the in-flight validation packages most likely to need an addendum.",
      hero: {
        eyebrow: "Analytical services · ICH",
        lede: "ICH Q2(R2) is a tighter, more lifecycle-aware document than its predecessor. Most validation packages already in flight do not need a redo — but a small subset do, and that distinction matters.",
      },
      author: INSIGHT_AUTHORS["analytical-bench"],
      tags: ["ICH", "Q2(R2)", "Method validation", "Q14", "Analytical services"],
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
          body: "Our analytical bench audits in-flight validation packages against Q2(R2) language and drafts the addendum or robustness rework where needed. A 30-minute call surfaces the scope before any work starts.",
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
      related: [],
      primaryServiceLink: {
        label: "Analytical services",
        href: "/services/analytical-services",
      },
    },

    /* --------------------------------------------------------------------- */
    /*  Note: an "Inside our operating model" article was removed in         */
    /*  PR-D2c2' (specialty-CDMO repositioning). Its body was anchored to    */
    /*  licence/logistics framing and was incompatible with the current      */
    /*  positioning. The URL surface is 301'd to /insights via               */
    /*  apps/web/next.config.ts.                                             */
    /* --------------------------------------------------------------------- */
  ],

  // The "Canadian CDMO operating model" whitepaper was retired in
  // PR-D2c2'. Its content used licence/logistics framing incompatible with
  // CDMO positioning. The /insights/whitepapers/canonical-cdmo-operating-
  // model URL surface and the /downloads/canadian-cdmo-operating-model.pdf
  // direct asset path are both 301'd to /insights/whitepapers via
  // apps/web/next.config.ts (added in PR-D1'). The API route at
  // /api/whitepaper-download already returns 404 when a slug is not
  // present in INSIGHTS.whitepapers (see route.ts).
  //
  // PR-D2c3' will further prune `WHITEPAPER_SLUGS`, the static-route
  // generator, and the Zod enum in the API route. Until then, the empty
  // array below stops the /insights hub from rendering a stale card.
  whitepapers: [],
};

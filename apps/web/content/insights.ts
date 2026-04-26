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
      // TODO(commit 4) — body authored via pharma-regulatory-writer (strict mode) + brand-voice-guardian PASS.
      body: [],
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
      // TODO(commit 5) — body authored via pharma-ghostwriter + pharma-regulatory-writer + brand-voice-guardian PASS.
      body: [],
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
      // TODO(commit 6) — body authored via pharma-ghostwriter + brand-voice-guardian PASS.
      body: [],
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

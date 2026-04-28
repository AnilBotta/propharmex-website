/**
 * File-content RAG sources for the CDMO Concierge (Prompt 18 PR-A).
 *
 * The site's content corpus lives in `apps/web/content/*.ts` as typed exports
 * (this is the pre-Sanity-migration shape — Prompt 22 will swap the upstream
 * to GROQ fetches, at which point this file is replaced by `rag-sources.ts`
 * pointing at the Sanity client without touching any consumer).
 *
 * Lives in `apps/web/lib/` (not `packages/lib/rag/`) because it imports the
 * app's content modules directly — the lib package shouldn't have inverted
 * imports back into the consuming app.
 *
 * Each `IngestSource` here emits `Chunk[]` for one content module. The
 * convention is:
 *   - One section per top-level export key (hero, lifecycle, faq, etc.)
 *   - For modules with arrays of items (insights articles, case studies,
 *     industry leaves, service leaves), each item becomes its own section
 *     keyed by slug or label.
 *   - String fields under 20 chars are dropped — they are labels, not
 *     content, and would dilute retrieval.
 *   - URL/slug-shaped strings are dropped.
 *
 * Source URLs are the page paths a citation should link to. They match the
 * URL surface declared by the site's app router.
 */
import { rag } from "@propharmex/lib";

import { ABOUT, LEADERSHIP_PAGE } from "../content/about";
import { ANALYTICAL_HUB, ANALYTICAL_LEAF_CONTENT } from "../content/analytical-services";
import { CASE_STUDIES_HUB, CASE_STUDIES } from "../content/case-studies";
import { FACILITIES_CONTENT, FACILITY_DETAILS } from "../content/facilities";
import { HOME } from "../content/home";
import { INDUSTRIES_HUB, INDUSTRIES_LEAF_CONTENT } from "../content/industries";
import { INSIGHTS } from "../content/insights";
import { PHARM_DEV_HUB, DOSAGE_FORM_CONTENT } from "../content/pharmaceutical-development";
import { PROCESS } from "../content/process";
import { QUALITY } from "../content/quality";
import { REGULATORY_HUB, REGULATORY_LEAF_CONTENT } from "../content/regulatory-services";
import { FACILITIES as FACILITY_ADDRESSES } from "../content/site-nav";
import { WHY } from "../content/why";

type Chunk = rag.Chunk;
type ContentType = rag.ContentType;
type IngestSource = rag.IngestSource;

const { chunkSection } = rag;

/* -------------------------------------------------------------------------- */
/*  Generic helpers                                                            */
/* -------------------------------------------------------------------------- */

const MIN_STRING_LEN = 20;
const URL_OR_SLUG_RE = /^(\/|https?:|[a-z0-9][a-z0-9-]*$)/i;

function collectStrings(value: unknown, keyHint?: string): string[] {
  if (value == null) return [];
  if (typeof value === "string") {
    if (value.length < MIN_STRING_LEN) return [];
    if (URL_OR_SLUG_RE.test(value)) return [];
    if (keyHint && /^(href|url|id|slug|src|alt|icon|status)$/i.test(keyHint)) return [];
    return [value];
  }
  if (Array.isArray(value)) {
    return value.flatMap((v) => collectStrings(v, keyHint));
  }
  if (typeof value === "object") {
    return Object.entries(value as Record<string, unknown>).flatMap(([k, v]) =>
      collectStrings(v, k),
    );
  }
  return [];
}

function sectionChunks(opts: {
  value: unknown;
  section: string;
  sourceUrl: string;
  sourceTitle: string;
  contentType: ContentType;
}): Chunk[] {
  const strings = collectStrings(opts.value);
  if (strings.length === 0) return [];
  const text = strings.join("\n\n");
  return chunkSection({
    text,
    sourceUrl: opts.sourceUrl,
    sourceTitle: opts.sourceTitle,
    section: opts.section,
    contentType: opts.contentType,
  });
}

function walkTopLevel(opts: {
  module: Record<string, unknown>;
  sourceUrl: string;
  sourceTitle: string;
  contentType: ContentType;
  skip?: string[];
}): Chunk[] {
  const skip = new Set([
    "metaTitle",
    "metaDescription",
    "ogTitle",
    "ogDescription",
    "breadcrumb",
    "schemaContext",
    ...(opts.skip ?? []),
  ]);
  const out: Chunk[] = [];
  for (const [key, value] of Object.entries(opts.module)) {
    if (skip.has(key)) continue;
    out.push(
      ...sectionChunks({
        value,
        section: humanise(key),
        sourceUrl: opts.sourceUrl,
        sourceTitle: opts.sourceTitle,
        contentType: opts.contentType,
      }),
    );
  }
  return out;
}

function humanise(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (c) => c.toUpperCase());
}

/* -------------------------------------------------------------------------- */
/*  Per-module sources                                                         */
/* -------------------------------------------------------------------------- */

const homeSource: IngestSource = {
  label: "home",
  extract: () =>
    walkTopLevel({
      module: HOME as unknown as Record<string, unknown>,
      sourceUrl: "/",
      sourceTitle: "Propharmex — homepage",
      contentType: "page",
    }),
};

const whySource: IngestSource = {
  label: "why-propharmex",
  extract: () => {
    const out: Chunk[] = [];
    for (const chapter of WHY.chapters) {
      out.push(
        ...sectionChunks({
          value: chapter,
          section: `Why Propharmex — ${chapter.railLabel}`,
          sourceUrl: "/why-propharmex",
          sourceTitle: "Why Propharmex",
          contentType: "page",
        }),
      );
    }
    if (WHY.cta) {
      out.push(
        ...sectionChunks({
          value: WHY.cta,
          section: "Why Propharmex — Talk to us",
          sourceUrl: "/why-propharmex",
          sourceTitle: "Why Propharmex",
          contentType: "page",
        }),
      );
    }
    return out;
  },
};

const aboutSource: IngestSource = {
  label: "about",
  extract: () => {
    const out: Chunk[] = [];
    out.push(
      ...walkTopLevel({
        module: ABOUT as unknown as Record<string, unknown>,
        sourceUrl: "/about",
        sourceTitle: "About Propharmex",
        contentType: "page",
      }),
    );
    out.push(
      ...walkTopLevel({
        module: LEADERSHIP_PAGE as unknown as Record<string, unknown>,
        sourceUrl: "/about/leadership",
        sourceTitle: "Leadership",
        contentType: "page",
      }),
    );
    return out;
  },
};

const facilitiesSource: IngestSource = {
  label: "facilities",
  extract: () => {
    const out: Chunk[] = [];
    out.push(
      ...walkTopLevel({
        module: FACILITIES_CONTENT as unknown as Record<string, unknown>,
        sourceUrl: "/facilities",
        sourceTitle: "Facilities",
        contentType: "facility",
      }),
    );
    for (const [code, detail] of Object.entries(FACILITY_DETAILS)) {
      if (!detail) continue;
      const codeLower = code.toLowerCase();
      const slug =
        codeLower === "mississauga"
          ? "mississauga-canada"
          : codeLower === "hyderabad"
            ? "hyderabad-india"
            : codeLower;
      out.push(
        ...walkTopLevel({
          module: detail as unknown as Record<string, unknown>,
          sourceUrl: `/facilities/${slug}`,
          sourceTitle: `Facility — ${(detail as unknown as { name?: string }).name ?? code}`,
          contentType: "facility",
        }),
      );
    }
    out.push(
      ...sectionChunks({
        value: FACILITY_ADDRESSES,
        section: "Facility addresses",
        sourceUrl: "/facilities",
        sourceTitle: "Facilities",
        contentType: "facility",
      }),
    );
    return out;
  },
};

const qualitySource: IngestSource = {
  label: "quality-compliance",
  extract: () =>
    walkTopLevel({
      module: QUALITY as unknown as Record<string, unknown>,
      sourceUrl: "/quality-compliance",
      sourceTitle: "Quality and compliance",
      contentType: "quality",
    }),
};

const processSource: IngestSource = {
  label: "our-process",
  extract: () =>
    walkTopLevel({
      module: PROCESS as unknown as Record<string, unknown>,
      sourceUrl: "/our-process",
      sourceTitle: "Our process",
      contentType: "process",
    }),
};

// NOTE: contactSource removed pending PR #25 merge. apps/web/content/contact.ts
// doesn't exist on main yet (it's part of feat/prompt-17-contact). Once that
// PR merges and PR-A is rebased, add it back as:
//
//   const contactSource: IngestSource = {
//     label: "contact",
//     extract: () => walkTopLevel({
//       module: CONTACT as unknown as Record<string, unknown>,
//       sourceUrl: "/contact",
//       sourceTitle: "Contact",
//       contentType: "page",
//       skip: ["form", "cal"],
//     }),
//   };
//
// The contact page's addresses are already covered by facilitiesSource via
// the FACILITIES site-nav export, so the corpus loses minimal coverage.

const analyticalSource: IngestSource = {
  label: "analytical-services",
  extract: () => {
    const out: Chunk[] = [];
    out.push(
      ...walkTopLevel({
        module: ANALYTICAL_HUB as unknown as Record<string, unknown>,
        sourceUrl: "/services/analytical-services",
        sourceTitle: "Analytical services",
        contentType: "service",
      }),
    );
    for (const [slug, leaf] of Object.entries(ANALYTICAL_LEAF_CONTENT)) {
      if (!leaf) continue;
      out.push(
        ...walkTopLevel({
          module: leaf as unknown as Record<string, unknown>,
          sourceUrl: `/services/analytical-services/${slug}`,
          sourceTitle: `Analytical services — ${(leaf as unknown as { label: string }).label}`,
          contentType: "service",
        }),
      );
    }
    return out;
  },
};

const pharmDevSource: IngestSource = {
  label: "pharmaceutical-development",
  extract: () => {
    const out: Chunk[] = [];
    out.push(
      ...walkTopLevel({
        module: PHARM_DEV_HUB as unknown as Record<string, unknown>,
        sourceUrl: "/services/pharmaceutical-development",
        sourceTitle: "Pharmaceutical development",
        contentType: "service",
      }),
    );
    for (const [slug, leaf] of Object.entries(DOSAGE_FORM_CONTENT)) {
      if (!leaf) continue;
      out.push(
        ...walkTopLevel({
          module: leaf as unknown as Record<string, unknown>,
          sourceUrl: `/services/pharmaceutical-development/${slug}`,
          sourceTitle: `Pharmaceutical development — ${(leaf as unknown as { label: string }).label}`,
          contentType: "service",
        }),
      );
    }
    return out;
  },
};

const regulatorySource: IngestSource = {
  label: "regulatory-services",
  extract: () => {
    const out: Chunk[] = [];
    out.push(
      ...walkTopLevel({
        module: REGULATORY_HUB as unknown as Record<string, unknown>,
        sourceUrl: "/services/regulatory-services",
        sourceTitle: "Regulatory services",
        contentType: "service",
      }),
    );
    for (const [slug, leaf] of Object.entries(REGULATORY_LEAF_CONTENT)) {
      if (!leaf) continue;
      out.push(
        ...walkTopLevel({
          module: leaf as unknown as Record<string, unknown>,
          sourceUrl: `/services/regulatory-services/${slug}`,
          sourceTitle: `Regulatory services — ${(leaf as unknown as { label: string }).label}`,
          contentType: "service",
        }),
      );
    }
    return out;
  },
};

const industriesSource: IngestSource = {
  label: "industries",
  extract: () => {
    const out: Chunk[] = [];
    out.push(
      ...walkTopLevel({
        module: INDUSTRIES_HUB as unknown as Record<string, unknown>,
        sourceUrl: "/industries",
        sourceTitle: "Industries",
        contentType: "industry",
      }),
    );
    for (const [slug, leaf] of Object.entries(INDUSTRIES_LEAF_CONTENT)) {
      if (!leaf) continue;
      out.push(
        ...walkTopLevel({
          module: leaf as unknown as Record<string, unknown>,
          sourceUrl: `/industries/${slug}`,
          sourceTitle: `Industries — ${(leaf as unknown as { label: string }).label}`,
          contentType: "industry",
        }),
      );
    }
    return out;
  },
};

const caseStudiesSource: IngestSource = {
  label: "case-studies",
  extract: () => {
    const out: Chunk[] = [];
    out.push(
      ...walkTopLevel({
        module: CASE_STUDIES_HUB as unknown as Record<string, unknown>,
        sourceUrl: "/case-studies",
        sourceTitle: "Case studies",
        contentType: "case-study",
      }),
    );
    for (const [slug, study] of Object.entries(CASE_STUDIES)) {
      if (!study) continue;
      out.push(
        ...walkTopLevel({
          module: study as unknown as Record<string, unknown>,
          sourceUrl: `/case-studies/${slug}`,
          sourceTitle: `Case study — ${(study as unknown as { headline?: string }).headline ?? slug}`,
          contentType: "case-study",
        }),
      );
    }
    return out;
  },
};

const insightsSource: IngestSource = {
  label: "insights",
  extract: () => {
    const out: Chunk[] = [];
    out.push(
      ...walkTopLevel({
        module: INSIGHTS.hub as unknown as Record<string, unknown>,
        sourceUrl: "/insights",
        sourceTitle: "Insights",
        contentType: "insight",
      }),
    );
    for (const article of INSIGHTS.articles) {
      out.push(
        ...walkTopLevel({
          module: article as unknown as Record<string, unknown>,
          sourceUrl: `/insights/${article.slug}`,
          sourceTitle: `Insight — ${article.title}`,
          contentType: "insight",
          skip: ["tags", "publishedAt", "readingMinutes"],
        }),
      );
    }
    for (const wp of INSIGHTS.whitepapers) {
      out.push(
        ...walkTopLevel({
          module: wp as unknown as Record<string, unknown>,
          sourceUrl: `/insights/whitepapers/${wp.slug}`,
          sourceTitle: `Whitepaper — ${wp.title}`,
          contentType: "insight",
          skip: ["formFields", "pdfPath", "pages", "publishedAt"],
        }),
      );
    }
    return out;
  },
};

/* -------------------------------------------------------------------------- */
/*  Aggregate                                                                   */
/* -------------------------------------------------------------------------- */

export const FILE_CONTENT_SOURCES: IngestSource[] = [
  homeSource,
  whySource,
  aboutSource,
  facilitiesSource,
  qualitySource,
  processSource,
  analyticalSource,
  pharmDevSource,
  regulatorySource,
  industriesSource,
  caseStudiesSource,
  insightsSource,
];

export function extractAllFileContent(): Chunk[] {
  return FILE_CONTENT_SOURCES.flatMap((s) => s.extract());
}

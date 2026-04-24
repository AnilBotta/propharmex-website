/**
 * /case-studies/[slug] — case-study detail route.
 *
 * Prompt 14 deliverable. Three seed slugs declared in `CASE_STUDY_SLUGS`
 * resolve to full PASR write-ups via the `CASE_STUDIES` registry
 * (a `Record<CaseStudySlug, CaseStudyContent>`). `generateStaticParams`
 * prerenders all three paths as SSG.
 *
 * - RSC page. ISR 300s.
 * - Emits Article + WebPage + BreadcrumbList JSON-LD referencing the root
 *   layout's Organization + WebSite @ids.
 * - Unknown slugs fall through to Next.js' built-in notFound handler as a
 *   defensive net against slug / registry drift.
 * - The related-cases rail is seeded with the other two slugs — the
 *   component itself null-renders on an empty array, so adding or
 *   removing studies never breaks the layout.
 *
 * Anonymization, claim-status, and primary-source rules are enforced
 * upstream in `content/case-studies.ts`. This file is a composition
 * shell only — no user-facing copy lives here.
 */
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { env, jsonLdGraph } from "@propharmex/lib";

import { DetailClosing } from "../../../components/case-studies/DetailClosing";
import { MetricHero } from "../../../components/case-studies/MetricHero";
import { PasrSection } from "../../../components/case-studies/PasrSection";
import { RegulatoryOutcome } from "../../../components/case-studies/RegulatoryOutcome";
import { RelatedCases } from "../../../components/case-studies/RelatedCases";
import { RelatedServices } from "../../../components/case-studies/RelatedServices";
import { SnapshotBar } from "../../../components/case-studies/SnapshotBar";
import { TimelineViz } from "../../../components/case-studies/TimelineViz";
import { JsonLd } from "../../../components/site/JsonLd";
import {
  CASE_STUDIES,
  CASE_STUDY_SLUGS,
  type CaseStudyContent,
  type CaseStudySlug,
} from "../../../content/case-studies";

export const revalidate = 300;

const HUB_PATH = "/case-studies";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return Object.keys(CASE_STUDIES).map((slug) => ({ slug }));
}

function isKnownSlug(slug: string): slug is CaseStudySlug {
  return (CASE_STUDY_SLUGS as readonly string[]).includes(slug);
}

function resolveContent(slug: string): CaseStudyContent | null {
  if (!isKnownSlug(slug)) return null;
  return CASE_STUDIES[slug] ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const content = resolveContent(slug);
  if (!content) {
    return {
      title: "Case study — Propharmex",
      robots: { index: false, follow: false },
    };
  }
  const path = `${HUB_PATH}/${content.slug}`;
  return {
    title: { absolute: content.metaTitle },
    description: content.metaDescription,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      title: content.ogTitle,
      description: content.ogDescription,
      url: path,
    },
    twitter: {
      card: "summary_large_image",
      title: content.ogTitle,
      description: content.ogDescription,
    },
  };
}

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const content = resolveContent(slug);
  if (!content) notFound();

  const siteUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const pageJsonLd = buildDetailJsonLd(siteUrl, content);

  const relatedCards = CASE_STUDY_SLUGS.filter((s) => s !== content.slug).map(
    (s) => CASE_STUDIES[s].summary,
  );

  return (
    <>
      <MetricHero
        crumbLabel={content.crumbLabel}
        label={content.label}
        heroLede={content.heroLede}
        metric={content.metric}
        client={content.client}
      />
      <SnapshotBar rows={content.snapshot} />
      <PasrSection
        id="problem"
        headingId="cs-detail-problem-heading"
        content={content.problem}
        tone="surface"
      />
      <PasrSection
        id="approach"
        headingId="cs-detail-approach-heading"
        content={content.approach}
        tone="muted"
      />
      <PasrSection
        id="solution"
        headingId="cs-detail-solution-heading"
        content={content.solution}
        tone="surface"
      />
      <PasrSection
        id="result"
        headingId="cs-detail-result-heading"
        content={content.result}
        tone="muted"
      />
      <TimelineViz content={content.timeline} />
      <RegulatoryOutcome content={content.regulatory} />
      <RelatedServices content={content.related} />
      <RelatedCases
        eyebrow="More evidence"
        heading="Other engagement patterns"
        lede="Adjacent case studies — different dosage forms, different regulatory geographies, same operating discipline."
        cards={relatedCards}
      />
      <DetailClosing content={content.closing} />

      <JsonLd id={`cs-detail-${content.slug}-jsonld`} data={pageJsonLd} />
    </>
  );
}

/**
 * Build the per-detail JSON-LD graph:
 *
 *  - Article — the study itself. `mainEntityOfPage` + `isPartOf` both point
 *    into the root layout's `#website`; the author is the Propharmex
 *    Organization. Keywords mirror the card taxonomy so search engines can
 *    cluster studies by dosage form + region + industry.
 *  - WebPage — the containing page, `about` the Article.
 *  - BreadcrumbList — Home → Case studies → this study.
 */
function buildDetailJsonLd(siteUrl: string, content: CaseStudyContent) {
  const pageUrl = `${siteUrl}${HUB_PATH}/${content.slug}`;

  const article = {
    "@type": "Article",
    "@id": `${pageUrl}#article`,
    headline: content.label,
    description: content.metaDescription,
    mainEntityOfPage: { "@id": `${pageUrl}#webpage` },
    isPartOf: { "@id": `${siteUrl}#website` },
    author: { "@id": `${siteUrl}#organization` },
    publisher: { "@id": `${siteUrl}#organization` },
    inLanguage: "en-CA",
    about: [content.summary.industry, content.summary.dosageForm].join(", "),
    keywords: [
      content.summary.industry,
      content.summary.dosageForm,
      content.summary.region,
      ...content.summary.services,
    ].join(", "),
    url: pageUrl,
  };

  const webpage = {
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: content.metaTitle,
    description: content.metaDescription,
    isPartOf: { "@id": `${siteUrl}#website` },
    about: { "@id": `${pageUrl}#article` },
    inLanguage: "en-CA",
  };

  const breadcrumb = {
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Case studies",
        item: `${siteUrl}${HUB_PATH}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: content.crumbLabel,
        item: pageUrl,
      },
    ],
  };

  return jsonLdGraph([article, webpage, breadcrumb]);
}

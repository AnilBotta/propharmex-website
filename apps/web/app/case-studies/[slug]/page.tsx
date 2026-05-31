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
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { articleDetailJsonLd, env } from "@propharmex/lib";

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
  CASE_STUDY_PLACEHOLDER_SLUGS,
  CASE_STUDY_SLUGS,
  type CaseStudyContent,
  type CaseStudySlug,
} from "../../../content/case-studies";

export const revalidate = 300;

const HUB_PATH = "/case-studies";

interface Params { slug: string }

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

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
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

export default async function CaseStudyDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const content = resolveContent(slug);
  if (!content) notFound();

  const siteUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const pageJsonLd = articleDetailJsonLd({
    siteUrl,
    path: `${HUB_PATH}/${content.slug}`,
    headline: content.label,
    pageName: content.metaTitle,
    description: content.metaDescription,
    inLanguage: "en-CA",
    about: [content.summary.industry, content.summary.dosageForm].join(", "),
    keywords: [
      content.summary.industry,
      content.summary.dosageForm,
      content.summary.region,
      ...content.summary.services,
    ].join(", "),
    breadcrumbTrail: [
      { name: "Case studies", path: HUB_PATH },
      { name: content.crumbLabel, path: `${HUB_PATH}/${content.slug}` },
    ],
  });

  // Per PR-D2c2', placeholder slugs short-circuit to a "verified content
  // pending review" section. The underlying registry block is not
  // rendered while the slug is in CASE_STUDY_PLACEHOLDER_SLUGS. JSON-LD
  // is still emitted so crawlers see the article shell.
  if (CASE_STUDY_PLACEHOLDER_SLUGS.has(content.slug)) {
    return (
      <>
        <PlaceholderSection content={content} />
        <JsonLd id={`cs-detail-${content.slug}-jsonld`} data={pageJsonLd} />
      </>
    );
  }

  const relatedCards = CASE_STUDY_SLUGS.filter(
    (s) => s !== content.slug && !CASE_STUDY_PLACEHOLDER_SLUGS.has(s)
  ).map((s) => CASE_STUDIES[s].summary);

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
 * Placeholder section for case-study slugs that are in placeholder mode.
 * Renders a single "verified content pending review" card. The slug stays
 * routable (so any inbound links from elsewhere on the site or external
 * sources do not 404), but no metric or narrative content is surfaced.
 */
function PlaceholderSection({ content }: { content: CaseStudyContent }) {
  return (
    <section
      aria-labelledby="cs-placeholder-heading"
      className="border-b border-[var(--color-border)] bg-[var(--color-surface)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
          Case study · {content.crumbLabel}
        </p>
        <h1
          id="cs-placeholder-heading"
          className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl"
        >
          Verified content pending review.
        </h1>
        <p className="mt-5 text-base leading-relaxed text-[var(--color-slate-800)]">
          Our anonymized worked-pattern case studies are being prepared with the engagement clients
          before publication. We do not publish metric-bearing outcomes on the marketing site until
          the engagement client has signed off on the version released here.
        </p>
        <p className="mt-3 text-base leading-relaxed text-[var(--color-slate-800)]">
          Named references and engagement summaries are available to qualified partners under NDA
          today. If a similar program is on your roadmap, we are usually a working day from a
          written reply.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3 text-sm">
          <Link
            href="/contact?source=case-studies-placeholder"
            className="inline-flex items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary-600)] px-5 py-2.5 font-semibold text-[var(--color-on-primary)] transition-colors hover:bg-[var(--color-primary-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2"
          >
            Talk to us about a similar program
          </Link>
          <Link
            href={HUB_PATH}
            className="inline-flex items-center justify-center rounded-[var(--radius-md)] px-3 py-2.5 font-semibold text-[var(--color-fg)] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
          >
            Back to case studies
          </Link>
        </div>
      </div>
    </section>
  );
}

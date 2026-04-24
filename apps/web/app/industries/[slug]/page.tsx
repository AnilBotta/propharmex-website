/**
 * /industries/[slug] — industry leaf route.
 *
 * Prompt 13 deliverable. All five industry slugs declared in
 * `INDUSTRY_SLUGS` resolve to leaf content after the Prompt 13 follow-up PR
 * (PR B). `INDUSTRIES_LEAF_CONTENT` is a full `Record<IndustrySlug,
 * IndustryLeafContent>` so `generateStaticParams` below prerenders all five
 * paths as SSG.
 *
 * - RSC page. ISR 300s.
 * - Emits WebPage + Service + FAQPage + BreadcrumbList JSON-LD referencing
 *   the root layout's Organization + WebSite @ids.
 * - Unknown slugs fall through to Next.js' built-in notFound handler — the
 *   guard stays in place as a defensive net in case the registry and the
 *   slug union drift.
 * - The `governments-and-ngos` leaf ships without a `caseRail`; the route
 *   renders `<CaseStudyRail>` conditionally on its presence.
 */
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { env, jsonLdGraph } from "@propharmex/lib";

import { CaseStudyRail } from "../../../components/industries/CaseStudyRail";
import { IndustryFaq } from "../../../components/industries/IndustryFaq";
import { LeafClosing } from "../../../components/industries/LeafClosing";
import { LeafHero } from "../../../components/industries/LeafHero";
import { PainPoints } from "../../../components/industries/PainPoints";
import { RegulatoryContext } from "../../../components/industries/RegulatoryContext";
import { RelatedServices } from "../../../components/industries/RelatedServices";
import { TailoredOffering } from "../../../components/industries/TailoredOffering";
import { JsonLd } from "../../../components/site/JsonLd";
import {
  INDUSTRIES_LEAF_CONTENT,
  INDUSTRY_SLUGS,
  type IndustryLeafContent,
  type IndustrySlug,
} from "../../../content/industries";

export const revalidate = 300;

const HUB_PATH = "/industries";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return Object.keys(INDUSTRIES_LEAF_CONTENT).map((slug) => ({ slug }));
}

function resolveContent(slug: string): IndustryLeafContent | null {
  if (!isKnownSlug(slug)) return null;
  return INDUSTRIES_LEAF_CONTENT[slug] ?? null;
}

function isKnownSlug(slug: string): slug is IndustrySlug {
  return (INDUSTRY_SLUGS as readonly string[]).includes(slug);
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
      title: "Industry — Propharmex",
      robots: { index: false, follow: false },
    };
  }
  const path = `${HUB_PATH}/${content.slug}`;
  return {
    title: { absolute: content.metaTitle },
    description: content.metaDescription,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
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

export default async function IndustryLeafPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const content = resolveContent(slug);
  if (!content) notFound();

  const siteUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const pageJsonLd = buildLeafJsonLd(siteUrl, content);

  return (
    <>
      <LeafHero content={content.hero} />
      <PainPoints content={content.painPoints} />
      <TailoredOffering content={content.offering} />
      <RegulatoryContext content={content.regulatory} />
      {content.caseRail ? (
        <CaseStudyRail content={content.caseRail} />
      ) : null}
      <IndustryFaq content={content.faq} />
      <RelatedServices content={content.related} />
      <LeafClosing content={content.closing} />

      <JsonLd id={`ind-leaf-${content.slug}-jsonld`} data={pageJsonLd} />
    </>
  );
}

function buildLeafJsonLd(siteUrl: string, content: IndustryLeafContent) {
  const pageUrl = `${siteUrl}${HUB_PATH}/${content.slug}`;

  const service = {
    "@type": "Service",
    "@id": `${pageUrl}#service`,
    name: content.label,
    description: content.metaDescription,
    provider: { "@id": `${siteUrl}#organization` },
    serviceType: "Pharmaceutical services — industry-specific engagements",
    category: content.label,
    areaServed: ["Canada", "United States", "India"],
    url: pageUrl,
  };

  const webpage = {
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: content.metaTitle,
    description: content.metaDescription,
    isPartOf: { "@id": `${siteUrl}#website` },
    about: { "@id": `${pageUrl}#service` },
    inLanguage: "en-CA",
  };

  const faqPage = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: content.faq.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  const breadcrumb = {
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Industries",
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

  return jsonLdGraph([service, webpage, faqPage, breadcrumb]);
}

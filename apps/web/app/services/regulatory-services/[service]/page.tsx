/**
 * /services/regulatory-services/[service] — regulatory sub-service leaf route.
 *
 * Prompt 12 deliverable. This PR ships `/health-canada-del-licensing` from
 * the regulatory-services content dictionary. The other four slugs declared
 * in `REGULATORY_SERVICE_SLUGS` are listed on the hub as "shipping-next" and
 * resolve to `notFound()` until the follow-up PR publishes their content.
 *
 * - RSC page. ISR 300s.
 * - Emits WebPage + Service + FAQPage + BreadcrumbList JSON-LD referencing
 *   the root layout's Organization + WebSite @ids.
 * - Unknown slugs fall through to Next.js' built-in notFound handler, which
 *   the site's 404 page renders.
 */
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { env, jsonLdGraph } from "@propharmex/lib";

import { ChallengesList } from "../../../../components/regulatory/ChallengesList";
import { DelCaseStudyFeature } from "../../../../components/regulatory/DelCaseStudyFeature";
import { DelChecklistDownload } from "../../../../components/regulatory/DelChecklistDownload";
import { DelExplainer } from "../../../../components/regulatory/DelExplainer";
import { DelReadinessEmbed } from "../../../../components/regulatory/DelReadinessEmbed";
import { DelTimeline } from "../../../../components/regulatory/DelTimeline";
import { FaqAccordion } from "../../../../components/regulatory/FaqAccordion";
import { LeafClosing } from "../../../../components/regulatory/LeafClosing";
import { LeafHero } from "../../../../components/regulatory/LeafHero";
import { RelatedServices } from "../../../../components/regulatory/RelatedServices";
import { ThreePlDelCombo } from "../../../../components/regulatory/ThreePlDelCombo";
import { JsonLd } from "../../../../components/site/JsonLd";
import {
  REGULATORY_LEAF_CONTENT,
  REGULATORY_SERVICE_SLUGS,
  type RegulatoryLeafContent,
  type RegulatoryServiceSlug,
} from "../../../../content/regulatory-services";

export const revalidate = 300;

const HUB_PATH = "/services/regulatory-services";

type Params = { service: string };

export function generateStaticParams(): Params[] {
  return Object.keys(REGULATORY_LEAF_CONTENT).map((slug) => ({ service: slug }));
}

function resolveContent(slug: string): RegulatoryLeafContent | null {
  if (!isKnownSlug(slug)) return null;
  return REGULATORY_LEAF_CONTENT[slug] ?? null;
}

function isKnownSlug(slug: string): slug is RegulatoryServiceSlug {
  return (REGULATORY_SERVICE_SLUGS as readonly string[]).includes(slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { service } = await params;
  const content = resolveContent(service);
  if (!content) {
    return {
      title: "Regulatory service — Propharmex",
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

export default async function RegulatoryServiceLeafPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { service } = await params;
  const content = resolveContent(service);
  if (!content) notFound();

  const siteUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const pageJsonLd = buildLeafJsonLd(siteUrl, content);

  return (
    <>
      <LeafHero content={content.hero} />
      <DelExplainer content={content.explainer} />
      <ThreePlDelCombo content={content.threePlDelCombo} />
      <DelTimeline content={content.timeline} />
      <ChallengesList content={content.challenges} />
      <DelReadinessEmbed content={content.readinessEmbed} />
      <DelCaseStudyFeature content={content.caseStudyFeature} />
      <DelChecklistDownload content={content.checklistDownload} />
      <FaqAccordion content={content.faq} />
      <RelatedServices content={content.related} />
      <LeafClosing content={content.closing} />

      <JsonLd id={`rs-leaf-${content.slug}-jsonld`} data={pageJsonLd} />
    </>
  );
}

function buildLeafJsonLd(siteUrl: string, content: RegulatoryLeafContent) {
  const pageUrl = `${siteUrl}${HUB_PATH}/${content.slug}`;

  const service = {
    "@type": "Service",
    "@id": `${pageUrl}#service`,
    name: content.label,
    description: content.metaDescription,
    provider: { "@id": `${siteUrl}#organization` },
    serviceType: "Pharmaceutical regulatory affairs services",
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
        name: "Services",
        item: `${siteUrl}/services`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Regulatory Services",
        item: `${siteUrl}${HUB_PATH}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: content.crumbLabel,
        item: pageUrl,
      },
    ],
  };

  return jsonLdGraph([service, webpage, faqPage, breadcrumb]);
}

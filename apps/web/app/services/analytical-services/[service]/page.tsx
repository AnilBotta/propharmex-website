/**
 * /services/analytical-services/[service] — analytical sub-service leaf route.
 *
 * Prompt 11 deliverable. This PR ships `/method-development` from the
 * analytical-services content dictionary. The other six slugs declared in
 * `ANALYTICAL_SERVICE_SLUGS` are listed on the hub as "shipping-next" and
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

import { ChallengesList } from "../../../../components/analytical/ChallengesList";
import { FaqAccordion } from "../../../../components/analytical/FaqAccordion";
import { InstrumentInventory } from "../../../../components/analytical/InstrumentInventory";
import { LeafClosing } from "../../../../components/analytical/LeafClosing";
import { LeafHero } from "../../../../components/analytical/LeafHero";
import { OutcomeMetric } from "../../../../components/analytical/OutcomeMetric";
import { ProcessStepper } from "../../../../components/analytical/ProcessStepper";
import { RelatedServices } from "../../../../components/analytical/RelatedServices";
import { ScopingQuestions } from "../../../../components/analytical/ScopingQuestions";
import { JsonLd } from "../../../../components/site/JsonLd";
import {
  ANALYTICAL_LEAF_CONTENT,
  ANALYTICAL_SERVICE_SLUGS,
  type AnalyticalLeafContent,
  type AnalyticalServiceSlug,
} from "../../../../content/analytical-services";

export const revalidate = 300;

const HUB_PATH = "/services/analytical-services";

type Params = { service: string };

export function generateStaticParams(): Params[] {
  return Object.keys(ANALYTICAL_LEAF_CONTENT).map((slug) => ({ service: slug }));
}

function resolveContent(slug: string): AnalyticalLeafContent | null {
  if (!isKnownSlug(slug)) return null;
  return ANALYTICAL_LEAF_CONTENT[slug] ?? null;
}

function isKnownSlug(slug: string): slug is AnalyticalServiceSlug {
  return (ANALYTICAL_SERVICE_SLUGS as readonly string[]).includes(slug);
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
      title: "Analytical service — Propharmex",
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

export default async function AnalyticalServiceLeafPage({
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
      <ChallengesList content={content.challenges} />
      <ProcessStepper content={content.process} />
      <InstrumentInventory content={content.inventory} />
      <OutcomeMetric content={content.outcome} />
      <ScopingQuestions content={content.scoping} />
      <FaqAccordion content={content.faq} />
      <RelatedServices content={content.related} />
      <LeafClosing content={content.closing} />

      <JsonLd id={`as-leaf-${content.slug}-jsonld`} data={pageJsonLd} />
    </>
  );
}

function buildLeafJsonLd(siteUrl: string, content: AnalyticalLeafContent) {
  const pageUrl = `${siteUrl}${HUB_PATH}/${content.slug}`;

  const service = {
    "@type": "Service",
    "@id": `${pageUrl}#service`,
    name: content.label,
    description: content.metaDescription,
    provider: { "@id": `${siteUrl}#organization` },
    serviceType: "Pharmaceutical analytical services",
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
        name: "Analytical Services",
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

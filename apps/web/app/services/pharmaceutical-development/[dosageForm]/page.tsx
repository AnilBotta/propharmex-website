/**
 * /services/pharmaceutical-development/[dosageForm] — dosage-form leaf route.
 *
 * Prompt 10 deliverable. This PR ships `/solid-oral-dosage` from the
 * pharmaceutical-development content dictionary. The other six slugs declared
 * in `DOSAGE_FORM_SLUGS` are wired through `generateStaticParams` but resolve
 * to `notFound()` until the follow-up PR publishes their content.
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

import { ChallengesList } from "../../../../components/pharmdev/ChallengesList";
import { EquipmentChips } from "../../../../components/pharmdev/EquipmentChips";
import { FaqAccordion } from "../../../../components/pharmdev/FaqAccordion";
import { LeafClosing } from "../../../../components/pharmdev/LeafClosing";
import { LeafHero } from "../../../../components/pharmdev/LeafHero";
import { OutcomeMetric } from "../../../../components/pharmdev/OutcomeMetric";
import { ProcessStepper } from "../../../../components/pharmdev/ProcessStepper";
import { RelatedServices } from "../../../../components/pharmdev/RelatedServices";
import { SelfCheckBlock } from "../../../../components/pharmdev/SelfCheckBlock";
import { JsonLd } from "../../../../components/site/JsonLd";
import {
  DOSAGE_FORM_CONTENT,
  DOSAGE_FORM_SLUGS,
  type DosageFormContent,
  type DosageFormSlug,
} from "../../../../content/pharmaceutical-development";

export const revalidate = 300;

const HUB_PATH = "/services/pharmaceutical-development";

type Params = { dosageForm: string };

export function generateStaticParams(): Params[] {
  return Object.keys(DOSAGE_FORM_CONTENT).map((slug) => ({ dosageForm: slug }));
}

function resolveContent(slug: string): DosageFormContent | null {
  if (!isKnownSlug(slug)) return null;
  return DOSAGE_FORM_CONTENT[slug] ?? null;
}

function isKnownSlug(slug: string): slug is DosageFormSlug {
  return (DOSAGE_FORM_SLUGS as readonly string[]).includes(slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { dosageForm } = await params;
  const content = resolveContent(dosageForm);
  if (!content) {
    return {
      title: "Dosage form — Propharmex",
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

export default async function DosageFormLeafPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { dosageForm } = await params;
  const content = resolveContent(dosageForm);
  if (!content) notFound();

  const siteUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const pageJsonLd = buildLeafJsonLd(siteUrl, content);

  return (
    <>
      <LeafHero content={content.hero} />
      <ChallengesList content={content.challenges} />
      <ProcessStepper content={content.process} />
      <EquipmentChips content={content.equipment} />
      <OutcomeMetric content={content.outcome} />
      <SelfCheckBlock content={content.selfCheck} />
      <FaqAccordion content={content.faq} />
      <RelatedServices content={content.related} />
      <LeafClosing content={content.closing} />

      <JsonLd id={`pd-leaf-${content.slug}-jsonld`} data={pageJsonLd} />
    </>
  );
}

function buildLeafJsonLd(siteUrl: string, content: DosageFormContent) {
  const pageUrl = `${siteUrl}${HUB_PATH}/${content.slug}`;

  const service = {
    "@type": "Service",
    "@id": `${pageUrl}#service`,
    name: `${content.label} development`,
    description: content.metaDescription,
    provider: { "@id": `${siteUrl}#organization` },
    serviceType: "Pharmaceutical development",
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
        name: "Pharmaceutical Development",
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

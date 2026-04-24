/**
 * /case-studies — Case Studies hub.
 *
 * Prompt 14 deliverable. Content lives in apps/web/content/case-studies.ts
 * and will migrate to Sanity `caseStudy` documents in a follow-up prompt.
 *
 * - RSC page shell; `FilterableGrid` is a client island.
 * - ISR 300s.
 * - Emits CollectionPage + Service + ItemList + BreadcrumbList JSON-LD
 *   referencing the root layout's Organization + WebSite @ids.
 * - Dynamic detail pages live at `/case-studies/[slug]`.
 */
import type { Metadata } from "next";

import { env, jsonLdGraph } from "@propharmex/lib";

import { FilterableGrid } from "../../components/case-studies/FilterableGrid";
import { HubClosing } from "../../components/case-studies/HubClosing";
import { HubHero } from "../../components/case-studies/HubHero";
import { JsonLd } from "../../components/site/JsonLd";
import {
  CASE_STUDIES_HUB,
  CASE_STUDY_CARDS,
} from "../../content/case-studies";

export const revalidate = 300;

const HUB_PATH = "/case-studies";

export const metadata: Metadata = {
  title: { absolute: CASE_STUDIES_HUB.metaTitle },
  description: CASE_STUDIES_HUB.metaDescription,
  alternates: { canonical: HUB_PATH },
  openGraph: {
    type: "website",
    title: CASE_STUDIES_HUB.ogTitle,
    description: CASE_STUDIES_HUB.ogDescription,
    url: HUB_PATH,
  },
  twitter: {
    card: "summary_large_image",
    title: CASE_STUDIES_HUB.ogTitle,
    description: CASE_STUDIES_HUB.ogDescription,
  },
};

export default function CaseStudiesHubPage() {
  const siteUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const pageJsonLd = buildHubJsonLd(siteUrl);

  return (
    <>
      <HubHero content={CASE_STUDIES_HUB.hero} />
      <FilterableGrid
        cards={CASE_STUDY_CARDS}
        copy={CASE_STUDIES_HUB.filterCopy}
      />
      <HubClosing content={CASE_STUDIES_HUB.closing} />

      <JsonLd id="cs-hub-jsonld" data={pageJsonLd} />
    </>
  );
}

function buildHubJsonLd(siteUrl: string) {
  const pageUrl = `${siteUrl}${HUB_PATH}`;

  const service = {
    "@type": "Service",
    "@id": `${pageUrl}#service`,
    name: "Case studies",
    description: CASE_STUDIES_HUB.metaDescription,
    provider: { "@id": `${siteUrl}#organization` },
    serviceType:
      "Pharmaceutical services — worked-pattern case studies across generics, innovators, and NGO supply",
    areaServed: ["Canada", "United States", "India"],
    url: pageUrl,
  };

  const collectionPage = {
    "@type": "CollectionPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: CASE_STUDIES_HUB.metaTitle,
    description: CASE_STUDIES_HUB.metaDescription,
    isPartOf: { "@id": `${siteUrl}#website` },
    about: { "@id": `${pageUrl}#service` },
    inLanguage: "en-CA",
  };

  const itemList = {
    "@type": "ItemList",
    "@id": `${pageUrl}#itemlist`,
    itemListElement: CASE_STUDY_CARDS.map((card, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: card.title,
      url: `${pageUrl}/${card.slug}`,
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
        name: "Case studies",
        item: pageUrl,
      },
    ],
  };

  return jsonLdGraph([service, collectionPage, itemList, breadcrumb]);
}

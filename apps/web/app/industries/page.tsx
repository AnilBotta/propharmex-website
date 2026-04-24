/**
 * /industries — Industries We Serve hub.
 *
 * Prompt 13 deliverable. Content lives in apps/web/content/industries.ts and
 * will migrate to Sanity `industry` documents in a follow-up prompt.
 *
 * - RSC page. ISR 300s.
 * - Emits CollectionPage + Service + ItemList + BreadcrumbList JSON-LD
 *   referencing the root layout's Organization + WebSite @ids.
 * - Dynamic leaves live at `/industries/[slug]`.
 */
import type { Metadata } from "next";

import { env, jsonLdGraph } from "@propharmex/lib";

import { HubClosing } from "../../components/industries/HubClosing";
import { HubHero } from "../../components/industries/HubHero";
import { HubPosture } from "../../components/industries/HubPosture";
import { IndustryMatrix } from "../../components/industries/IndustryMatrix";
import { JsonLd } from "../../components/site/JsonLd";
import { INDUSTRIES_HUB } from "../../content/industries";

export const revalidate = 300;

const HUB_PATH = "/industries";

export const metadata: Metadata = {
  title: { absolute: INDUSTRIES_HUB.metaTitle },
  description: INDUSTRIES_HUB.metaDescription,
  alternates: { canonical: HUB_PATH },
  openGraph: {
    type: "website",
    title: INDUSTRIES_HUB.ogTitle,
    description: INDUSTRIES_HUB.ogDescription,
    url: HUB_PATH,
  },
  twitter: {
    card: "summary_large_image",
    title: INDUSTRIES_HUB.ogTitle,
    description: INDUSTRIES_HUB.ogDescription,
  },
};

export default function IndustriesHubPage() {
  const siteUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const pageJsonLd = buildHubJsonLd(siteUrl);

  return (
    <>
      <HubHero content={INDUSTRIES_HUB.hero} />
      <IndustryMatrix content={INDUSTRIES_HUB.matrix} />
      <HubPosture content={INDUSTRIES_HUB.posture} />
      <HubClosing content={INDUSTRIES_HUB.closing} />

      <JsonLd id="ind-hub-jsonld" data={pageJsonLd} />
    </>
  );
}

function buildHubJsonLd(siteUrl: string) {
  const pageUrl = `${siteUrl}${HUB_PATH}`;

  const service = {
    "@type": "Service",
    "@id": `${pageUrl}#service`,
    name: "Industries served",
    description: INDUSTRIES_HUB.metaDescription,
    provider: { "@id": `${siteUrl}#organization` },
    serviceType: "Pharmaceutical services — industry-specific engagements",
    areaServed: ["Canada", "United States", "India"],
    url: pageUrl,
  };

  const collectionPage = {
    "@type": "CollectionPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: INDUSTRIES_HUB.metaTitle,
    description: INDUSTRIES_HUB.metaDescription,
    isPartOf: { "@id": `${siteUrl}#website` },
    about: { "@id": `${pageUrl}#service` },
    inLanguage: "en-CA",
  };

  const itemList = {
    "@type": "ItemList",
    "@id": `${pageUrl}#itemlist`,
    itemListElement: INDUSTRIES_HUB.matrix.industries.map((summary, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: summary.label,
      url: `${pageUrl}/${summary.slug}`,
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
        item: pageUrl,
      },
    ],
  };

  return jsonLdGraph([service, collectionPage, itemList, breadcrumb]);
}

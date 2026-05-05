/**
 * /services/clinical-be-insight — Clinical & BE Insight pillar hub.
 *
 * Fourth capability pillar named in the brand brief and referenced in
 * about.ts and why.ts. Scope: BE strategy + clinical-regulatory consulting
 * (insight + design work, not running trials).
 *
 * - RSC page. ISR 300s.
 * - PR-J' (CapabilityMatrix prop generalization) made the shared
 *   <CapabilityMatrix> reusable across pillars. This page now renders the
 *   shared component with a 2-col layout for its 4 cards instead of the
 *   dedicated clinical/ServicesMatrix.tsx (deleted in PR-J').
 * - Emits CollectionPage + Service + ItemList(4) + BreadcrumbList JSON-LD;
 *   explicit canonical so search engines see this as the canonical
 *   pillar URL (parallel to /services/pharmaceutical-development).
 */
import type { Metadata } from "next";

import { env, jsonLdGraph } from "@propharmex/lib";

import { JsonLd } from "../../../components/site/JsonLd";
import { CapabilityMatrix } from "../../../components/site/hub/CapabilityMatrix";
import { HubClosing } from "../../../components/site/hub/HubClosing";
import { HubHero } from "../../../components/site/hub/HubHero";
import { CLINICAL_HUB } from "../../../content/clinical-be-insight";

export const revalidate = 300;

const HUB_PATH = "/services/clinical-be-insight";

export const metadata: Metadata = {
  title: { absolute: CLINICAL_HUB.metaTitle },
  description: CLINICAL_HUB.metaDescription,
  alternates: { canonical: HUB_PATH },
  openGraph: {
    type: "website",
    title: CLINICAL_HUB.ogTitle,
    description: CLINICAL_HUB.ogDescription,
    url: HUB_PATH,
  },
  twitter: {
    card: "summary_large_image",
    title: CLINICAL_HUB.ogTitle,
    description: CLINICAL_HUB.ogDescription,
  },
};

export default function ClinicalBeInsightHubPage() {
  const siteUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const pageJsonLd = buildHubJsonLd(siteUrl);

  return (
    <>
      <HubHero content={CLINICAL_HUB.hero} />
      <CapabilityMatrix
        content={CLINICAL_HUB.matrix}
        hrefBase="/services/clinical-be-insight"
        sectionId="services"
        headingId="cli-hub-services-heading"
        gridLabel="Clinical and BE insight services"
        gridCols={2}
      />
      <HubClosing content={CLINICAL_HUB.closing} />

      <JsonLd id="cli-hub-jsonld" data={pageJsonLd} />
    </>
  );
}

function buildHubJsonLd(siteUrl: string) {
  const pageUrl = `${siteUrl}${HUB_PATH}`;

  const service = {
    "@type": "Service",
    "@id": `${pageUrl}#service`,
    name: "Clinical and BE Insight",
    description: CLINICAL_HUB.metaDescription,
    provider: { "@id": `${siteUrl}#organization` },
    serviceType: "Clinical and bioequivalence consulting",
    areaServed: ["Canada", "United States", "India"],
    url: pageUrl,
  };

  const collectionPage = {
    "@type": "CollectionPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: CLINICAL_HUB.metaTitle,
    description: CLINICAL_HUB.metaDescription,
    isPartOf: { "@id": `${siteUrl}#website` },
    about: { "@id": `${pageUrl}#service` },
    inLanguage: "en-CA",
  };

  const itemList = {
    "@type": "ItemList",
    "@id": `${pageUrl}#itemlist`,
    itemListElement: CLINICAL_HUB.matrix.forms.map((service, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: service.label,
      url: `${pageUrl}/${service.slug}`,
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
        name: "Capabilities",
        item: `${siteUrl}/services`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Clinical and BE Insight",
        item: pageUrl,
      },
    ],
  };

  return jsonLdGraph([service, collectionPage, itemList, breadcrumb]);
}

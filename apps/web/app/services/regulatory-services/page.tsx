/**
 * /services/regulatory-services — Regulatory Services hub.
 *
 * Prompt 12 deliverable. Content lives in
 * apps/web/content/regulatory-services.ts and will migrate to Sanity
 * `service` documents in Prompt 4 (hub) / Prompt 12-follow-up (leaves).
 *
 * - RSC page. ISR 300s.
 * - Emits CollectionPage + Service + ItemList + BreadcrumbList JSON-LD
 *   referencing the root layout's Organization + WebSite @ids.
 * - The dynamic leaf route is `/services/regulatory-services/[service]`;
 *   explicit routes here take priority over the site-wide catch-all at
 *   /services/[...slug].
 */
import type { Metadata } from "next";

import { env, jsonLdGraph } from "@propharmex/lib";

import { CaseStudyRail } from "../../../components/regulatory/CaseStudyRail";
import { HubClosing } from "../../../components/regulatory/HubClosing";
import { HubHero } from "../../../components/regulatory/HubHero";
import { RegulatoryPosture } from "../../../components/regulatory/RegulatoryPosture";
import { ServiceMatrix } from "../../../components/regulatory/ServiceMatrix";
import { SubmissionLifecycle } from "../../../components/regulatory/SubmissionLifecycle";
import { JsonLd } from "../../../components/site/JsonLd";
import { REGULATORY_HUB } from "../../../content/regulatory-services";

export const revalidate = 300;

const HUB_PATH = "/services/regulatory-services";

export const metadata: Metadata = {
  title: { absolute: REGULATORY_HUB.metaTitle },
  description: REGULATORY_HUB.metaDescription,
  alternates: { canonical: HUB_PATH },
  openGraph: {
    type: "website",
    title: REGULATORY_HUB.ogTitle,
    description: REGULATORY_HUB.ogDescription,
    url: HUB_PATH,
  },
  twitter: {
    card: "summary_large_image",
    title: REGULATORY_HUB.ogTitle,
    description: REGULATORY_HUB.ogDescription,
  },
};

export default function RegulatoryServicesHubPage() {
  const siteUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const pageJsonLd = buildHubJsonLd(siteUrl);

  return (
    <>
      <HubHero content={REGULATORY_HUB.hero} />
      <ServiceMatrix content={REGULATORY_HUB.serviceMatrix} />
      <RegulatoryPosture content={REGULATORY_HUB.posture} />
      <SubmissionLifecycle content={REGULATORY_HUB.lifecycle} />
      <CaseStudyRail content={REGULATORY_HUB.caseRail} />
      <HubClosing content={REGULATORY_HUB.closing} />

      <JsonLd id="rs-hub-jsonld" data={pageJsonLd} />
    </>
  );
}

function buildHubJsonLd(siteUrl: string) {
  const pageUrl = `${siteUrl}${HUB_PATH}`;

  const service = {
    "@type": "Service",
    "@id": `${pageUrl}#service`,
    name: "Regulatory Services",
    description: REGULATORY_HUB.metaDescription,
    provider: { "@id": `${siteUrl}#organization` },
    serviceType: "Pharmaceutical regulatory affairs services",
    areaServed: ["Canada", "United States", "India"],
    url: pageUrl,
  };

  const collectionPage = {
    "@type": "CollectionPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: REGULATORY_HUB.metaTitle,
    description: REGULATORY_HUB.metaDescription,
    isPartOf: { "@id": `${siteUrl}#website` },
    about: { "@id": `${pageUrl}#service` },
    inLanguage: "en-CA",
  };

  const itemList = {
    "@type": "ItemList",
    "@id": `${pageUrl}#itemlist`,
    itemListElement: REGULATORY_HUB.serviceMatrix.services.map(
      (summary, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: summary.label,
        url: `${pageUrl}/${summary.slug}`,
      }),
    ),
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
        item: pageUrl,
      },
    ],
  };

  return jsonLdGraph([service, collectionPage, itemList, breadcrumb]);
}

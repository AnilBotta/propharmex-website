/**
 * /services/analytical-services — Analytical Services hub.
 *
 * Prompt 11 deliverable. Content lives in
 * apps/web/content/analytical-services.ts and will migrate to Sanity
 * `service` documents in Prompt 4 (hub) / Prompt 11-follow-up (leaves).
 *
 * - RSC page. ISR 300s.
 * - Emits CollectionPage + Service + ItemList + BreadcrumbList JSON-LD
 *   referencing the root layout's Organization + WebSite @ids.
 * - The dynamic leaf route is `/services/analytical-services/[service]`;
 *   explicit routes here take priority over the site-wide catch-all at
 *   /services/[...slug].
 */
import type { Metadata } from "next";

import { env, jsonLdGraph } from "@propharmex/lib";

import { CaseStudyRail } from "../../../components/analytical/CaseStudyRail";
import { HubClosing } from "../../../components/analytical/HubClosing";
import { HubHero } from "../../../components/analytical/HubHero";
import { MethodLifecycle } from "../../../components/analytical/MethodLifecycle";
import { ServiceMatrix } from "../../../components/analytical/ServiceMatrix";
import { JsonLd } from "../../../components/site/JsonLd";
import { ANALYTICAL_HUB } from "../../../content/analytical-services";

export const revalidate = 300;

const HUB_PATH = "/services/analytical-services";

export const metadata: Metadata = {
  title: { absolute: ANALYTICAL_HUB.metaTitle },
  description: ANALYTICAL_HUB.metaDescription,
  alternates: { canonical: HUB_PATH },
  openGraph: {
    type: "website",
    title: ANALYTICAL_HUB.ogTitle,
    description: ANALYTICAL_HUB.ogDescription,
    url: HUB_PATH,
  },
  twitter: {
    card: "summary_large_image",
    title: ANALYTICAL_HUB.ogTitle,
    description: ANALYTICAL_HUB.ogDescription,
  },
};

export default function AnalyticalServicesHubPage() {
  const siteUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const pageJsonLd = buildHubJsonLd(siteUrl);

  return (
    <>
      <HubHero content={ANALYTICAL_HUB.hero} />
      <ServiceMatrix content={ANALYTICAL_HUB.serviceMatrix} />
      <MethodLifecycle content={ANALYTICAL_HUB.lifecycle} />
      <CaseStudyRail content={ANALYTICAL_HUB.caseRail} />
      <HubClosing content={ANALYTICAL_HUB.closing} />

      <JsonLd id="as-hub-jsonld" data={pageJsonLd} />
    </>
  );
}

function buildHubJsonLd(siteUrl: string) {
  const pageUrl = `${siteUrl}${HUB_PATH}`;

  const service = {
    "@type": "Service",
    "@id": `${pageUrl}#service`,
    name: "Analytical Services",
    description: ANALYTICAL_HUB.metaDescription,
    provider: { "@id": `${siteUrl}#organization` },
    serviceType: "Pharmaceutical analytical services",
    areaServed: ["Canada", "United States", "India"],
    url: pageUrl,
  };

  const collectionPage = {
    "@type": "CollectionPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: ANALYTICAL_HUB.metaTitle,
    description: ANALYTICAL_HUB.metaDescription,
    isPartOf: { "@id": `${siteUrl}#website` },
    about: { "@id": `${pageUrl}#service` },
    inLanguage: "en-CA",
  };

  const itemList = {
    "@type": "ItemList",
    "@id": `${pageUrl}#itemlist`,
    itemListElement: ANALYTICAL_HUB.serviceMatrix.services.map(
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
        name: "Analytical Services",
        item: pageUrl,
      },
    ],
  };

  return jsonLdGraph([service, collectionPage, itemList, breadcrumb]);
}

/**
 * /services/pharmaceutical-development — Pharmaceutical Development hub.
 *
 * Prompt 10 deliverable. Content lives in
 * apps/web/content/pharmaceutical-development.ts and will migrate to Sanity
 * `service` documents in Prompt 4 (hub) / Prompt 10-follow-up (leaves).
 *
 * - RSC page. ISR 300s.
 * - Emits CollectionPage + Service + ItemList + BreadcrumbList JSON-LD
 *   referencing the root layout's Organization + WebSite @ids.
 * - The dynamic leaf route is `/services/pharmaceutical-development/
 *   [dosageForm]`; explicit routes here take priority over the site-wide
 *   catch-all at /services/[...slug].
 */
import type { Metadata } from "next";

import { env, jsonLdGraph } from "@propharmex/lib";

import { CapabilityMatrix } from "../../../components/pharmdev/CapabilityMatrix";
import { CaseStudyRail } from "../../../components/pharmdev/CaseStudyRail";
import { HubClosing } from "../../../components/pharmdev/HubClosing";
import { HubHero } from "../../../components/pharmdev/HubHero";
import { Lifecycle } from "../../../components/pharmdev/Lifecycle";
import { JsonLd } from "../../../components/site/JsonLd";
import { PHARM_DEV_HUB } from "../../../content/pharmaceutical-development";

export const revalidate = 300;

const HUB_PATH = "/services/pharmaceutical-development";

export const metadata: Metadata = {
  title: { absolute: PHARM_DEV_HUB.metaTitle },
  description: PHARM_DEV_HUB.metaDescription,
  alternates: { canonical: HUB_PATH },
  openGraph: {
    type: "website",
    title: PHARM_DEV_HUB.ogTitle,
    description: PHARM_DEV_HUB.ogDescription,
    url: HUB_PATH,
  },
  twitter: {
    card: "summary_large_image",
    title: PHARM_DEV_HUB.ogTitle,
    description: PHARM_DEV_HUB.ogDescription,
  },
};

export default function PharmaceuticalDevelopmentHubPage() {
  const siteUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const pageJsonLd = buildHubJsonLd(siteUrl);

  return (
    <>
      <HubHero content={PHARM_DEV_HUB.hero} />
      <CapabilityMatrix content={PHARM_DEV_HUB.capabilityMatrix} />
      <Lifecycle content={PHARM_DEV_HUB.lifecycle} />
      <CaseStudyRail content={PHARM_DEV_HUB.caseRail} />
      <HubClosing content={PHARM_DEV_HUB.closing} />

      <JsonLd id="pd-hub-jsonld" data={pageJsonLd} />
    </>
  );
}

function buildHubJsonLd(siteUrl: string) {
  const pageUrl = `${siteUrl}${HUB_PATH}`;

  const service = {
    "@type": "Service",
    "@id": `${pageUrl}#service`,
    name: "Pharmaceutical Development",
    description: PHARM_DEV_HUB.metaDescription,
    provider: { "@id": `${siteUrl}#organization` },
    serviceType: "Pharmaceutical development",
    areaServed: ["Canada", "United States", "India"],
    url: pageUrl,
  };

  const collectionPage = {
    "@type": "CollectionPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: PHARM_DEV_HUB.metaTitle,
    description: PHARM_DEV_HUB.metaDescription,
    isPartOf: { "@id": `${siteUrl}#website` },
    about: { "@id": `${pageUrl}#service` },
    inLanguage: "en-CA",
  };

  const itemList = {
    "@type": "ItemList",
    "@id": `${pageUrl}#itemlist`,
    itemListElement: PHARM_DEV_HUB.capabilityMatrix.forms.map((form, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: form.label,
      url: `${pageUrl}/${form.slug}`,
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
        item: pageUrl,
      },
    ],
  };

  return jsonLdGraph([service, collectionPage, itemList, breadcrumb]);
}

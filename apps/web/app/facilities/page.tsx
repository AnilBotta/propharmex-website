/**
 * /facilities — Propharmex facility index.
 *
 * Prompt 9 deliverable. Content lives in apps/web/content/facilities.ts and
 * will migrate to Sanity `facility` documents in Prompt 4 (already scaffolded
 * — the schemas consume the shape below almost 1:1).
 *
 * - RSC page. ISR 300s.
 * - Emits CollectionPage + ItemList + BreadcrumbList JSON-LD referencing the
 *   root layout's Organization + WebSite @ids. Each `Place` entry carries
 *   city-level geo only — per safe-defaults posture on Prompt 9 we do not
 *   publish street-level coordinates on the marketing site.
 * - Site-wide `robots: { index: false, follow: false }` (from root layout)
 *   remains in force until Prompt 27.
 */
import type { Metadata } from "next";

import { env, jsonLdGraph } from "@propharmex/lib";

import { ComparisonTable } from "../../components/facilities/ComparisonTable";
import { FacilityCarousel } from "../../components/facilities/FacilityCarousel";
import { FacilityMap } from "../../components/facilities/FacilityMap";
import { IndexClosing } from "../../components/facilities/IndexClosing";
import { IndexHero } from "../../components/facilities/IndexHero";
import { JsonLd } from "../../components/site/JsonLd";
import {
  FACILITIES_CONTENT,
  FACILITY_HYDERABAD,
  FACILITY_MISSISSAUGA,
} from "../../content/facilities";

export const revalidate = 300;

export const metadata: Metadata = {
  title: { absolute: FACILITIES_CONTENT.metaTitle },
  description: FACILITIES_CONTENT.metaDescription,
  alternates: { canonical: "/facilities" },
  openGraph: {
    type: "website",
    title: FACILITIES_CONTENT.ogTitle,
    description: FACILITIES_CONTENT.ogDescription,
    url: "/facilities",
  },
  twitter: {
    card: "summary_large_image",
    title: FACILITIES_CONTENT.ogTitle,
    description: FACILITIES_CONTENT.ogDescription,
  },
};

export default function FacilitiesIndexPage() {
  const siteUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const pageJsonLd = buildFacilitiesIndexJsonLd(siteUrl);

  return (
    <>
      <IndexHero content={FACILITIES_CONTENT.hero} />
      <FacilityMap content={FACILITIES_CONTENT.map} />
      <ComparisonTable content={FACILITIES_CONTENT.comparison} />
      <FacilityCarousel content={FACILITIES_CONTENT.carousel} />
      <IndexClosing content={FACILITIES_CONTENT.closing} />

      <JsonLd id="facilities-jsonld" data={pageJsonLd} />
    </>
  );
}

function buildFacilitiesIndexJsonLd(siteUrl: string) {
  const collectionPage = {
    "@type": "CollectionPage",
    "@id": `${siteUrl}/facilities#webpage`,
    url: `${siteUrl}/facilities`,
    name: FACILITIES_CONTENT.metaTitle,
    description: FACILITIES_CONTENT.metaDescription,
    isPartOf: { "@id": `${siteUrl}#website` },
    about: { "@id": `${siteUrl}#organization` },
    inLanguage: "en-CA",
  };

  const itemList = {
    "@type": "ItemList",
    "@id": `${siteUrl}/facilities#itemlist`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        item: {
          "@type": "Place",
          "@id": `${siteUrl}/facilities/${FACILITY_MISSISSAUGA.slug}#place`,
          name: `Propharmex ${FACILITY_MISSISSAUGA.city}`,
          url: `${siteUrl}/facilities/${FACILITY_MISSISSAUGA.slug}`,
          address: {
            "@type": "PostalAddress",
            addressLocality: FACILITY_MISSISSAUGA.city,
            addressRegion: FACILITY_MISSISSAUGA.region,
            addressCountry: FACILITY_MISSISSAUGA.countryCode,
          },
        },
      },
      {
        "@type": "ListItem",
        position: 2,
        item: {
          "@type": "Place",
          "@id": `${siteUrl}/facilities/${FACILITY_HYDERABAD.slug}#place`,
          name: `Propharmex ${FACILITY_HYDERABAD.city}`,
          url: `${siteUrl}/facilities/${FACILITY_HYDERABAD.slug}`,
          address: {
            "@type": "PostalAddress",
            addressLocality: FACILITY_HYDERABAD.city,
            addressRegion: FACILITY_HYDERABAD.region,
            addressCountry: FACILITY_HYDERABAD.countryCode,
          },
        },
      },
    ],
  };

  const breadcrumb = {
    "@type": "BreadcrumbList",
    "@id": `${siteUrl}/facilities#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Facilities",
        item: `${siteUrl}/facilities`,
      },
    ],
  };

  return jsonLdGraph([collectionPage, itemList, breadcrumb]);
}

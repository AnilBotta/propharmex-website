/**
 * /facilities/hyderabad-india — Propharmex India detail page.
 *
 * Prompt 9 deliverable. No warehouse map — Hyderabad is not a primary
 * distribution site; the warehouse schematic is only shown on the Mississauga
 * detail page.
 *
 * - RSC page. ISR 300s.
 * - Emits Place + BreadcrumbList JSON-LD. City-level address only per the
 *   safe-defaults posture on Prompt 9.
 */
import type { Metadata } from "next";

import { env, jsonLdGraph } from "@propharmex/lib";

import { CapabilityMatrix } from "../../../components/facilities/CapabilityMatrix";
import { ColdChainSpec } from "../../../components/facilities/ColdChainSpec";
import { EquipmentList } from "../../../components/facilities/EquipmentList";
import { Hero } from "../../../components/facilities/Hero";
import { PhotoGallery } from "../../../components/facilities/PhotoGallery";
import { VisitCta } from "../../../components/facilities/VisitCta";
import { JsonLd } from "../../../components/site/JsonLd";
import { FACILITY_HYDERABAD } from "../../../content/facilities";

export const revalidate = 300;

export const metadata: Metadata = {
  title: { absolute: FACILITY_HYDERABAD.metaTitle },
  description: FACILITY_HYDERABAD.metaDescription,
  alternates: { canonical: `/facilities/${FACILITY_HYDERABAD.slug}` },
  openGraph: {
    type: "website",
    title: FACILITY_HYDERABAD.ogTitle,
    description: FACILITY_HYDERABAD.ogDescription,
    url: `/facilities/${FACILITY_HYDERABAD.slug}`,
  },
  twitter: {
    card: "summary_large_image",
    title: FACILITY_HYDERABAD.ogTitle,
    description: FACILITY_HYDERABAD.ogDescription,
  },
};

export default function HyderabadFacilityPage() {
  const siteUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const pageJsonLd = buildHyderabadJsonLd(siteUrl);
  const facility = FACILITY_HYDERABAD;

  return (
    <>
      <Hero content={facility.hero} />
      <CapabilityMatrix content={facility.capabilities} />
      <EquipmentList content={facility.equipment} />
      <ColdChainSpec content={facility.coldChain} />
      <PhotoGallery content={facility.gallery} />
      <VisitCta content={facility.visit} />

      <JsonLd id="facility-hyd-jsonld" data={pageJsonLd} />
    </>
  );
}

function buildHyderabadJsonLd(siteUrl: string) {
  const f = FACILITY_HYDERABAD;
  const pageUrl = `${siteUrl}/facilities/${f.slug}`;

  const place = {
    "@type": "Place",
    "@id": `${pageUrl}#place`,
    url: pageUrl,
    name: `Propharmex ${f.city}`,
    description: f.metaDescription,
    isPartOf: { "@id": `${siteUrl}#website` },
    containedInPlace: { "@id": `${siteUrl}#organization` },
    address: {
      "@type": "PostalAddress",
      addressLocality: f.city,
      addressRegion: f.region,
      addressCountry: f.countryCode,
    },
    inLanguage: "en-CA",
  };

  const breadcrumb = {
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Facilities",
        item: `${siteUrl}/facilities`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${f.city}, ${f.country}`,
        item: pageUrl,
      },
    ],
  };

  return jsonLdGraph([place, breadcrumb]);
}

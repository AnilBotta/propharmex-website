/**
 * /facilities/mississauga-canada — Propharmex Canada detail page.
 *
 * Prompt 9 deliverable. Consumes the shared FacilityDetail shape — when
 * Prompt 4's Sanity `facility` document ships, this file becomes a thin RSC
 * that fetches the document by slug.
 *
 * - RSC page. ISR 300s.
 * - Emits Place + BreadcrumbList JSON-LD. City-level address only per the
 *   safe-defaults posture on Prompt 9.
 * - Site-wide `robots: { index: false, follow: false }` (from root layout)
 *   remains in force until Prompt 27.
 */
import type { Metadata } from "next";

import { env, jsonLdGraph } from "@propharmex/lib";

import { CapabilityMatrix } from "../../../components/facilities/CapabilityMatrix";
import { ColdChainSpec } from "../../../components/facilities/ColdChainSpec";
import { EquipmentList } from "../../../components/facilities/EquipmentList";
import { Hero } from "../../../components/facilities/Hero";
import { PhotoGallery } from "../../../components/facilities/PhotoGallery";
import { VisitCta } from "../../../components/facilities/VisitCta";
import { WarehouseMap } from "../../../components/facilities/WarehouseMap";
import { JsonLd } from "../../../components/site/JsonLd";
import { FACILITY_MISSISSAUGA } from "../../../content/facilities";

export const revalidate = 300;

export const metadata: Metadata = {
  title: { absolute: FACILITY_MISSISSAUGA.metaTitle },
  description: FACILITY_MISSISSAUGA.metaDescription,
  alternates: { canonical: `/facilities/${FACILITY_MISSISSAUGA.slug}` },
  openGraph: {
    type: "website",
    title: FACILITY_MISSISSAUGA.ogTitle,
    description: FACILITY_MISSISSAUGA.ogDescription,
    url: `/facilities/${FACILITY_MISSISSAUGA.slug}`,
  },
  twitter: {
    card: "summary_large_image",
    title: FACILITY_MISSISSAUGA.ogTitle,
    description: FACILITY_MISSISSAUGA.ogDescription,
  },
};

export default function MississaugaFacilityPage() {
  const siteUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const pageJsonLd = buildMississaugaJsonLd(siteUrl);
  const facility = FACILITY_MISSISSAUGA;

  return (
    <>
      <Hero content={facility.hero} />
      <CapabilityMatrix content={facility.capabilities} />
      <EquipmentList content={facility.equipment} />
      <ColdChainSpec content={facility.coldChain} />
      {facility.warehouseMap ? (
        <WarehouseMap content={facility.warehouseMap} />
      ) : null}
      <PhotoGallery content={facility.gallery} />
      <VisitCta content={facility.visit} />

      <JsonLd id="facility-miss-jsonld" data={pageJsonLd} />
    </>
  );
}

function buildMississaugaJsonLd(siteUrl: string) {
  const f = FACILITY_MISSISSAUGA;
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

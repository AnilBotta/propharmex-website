/**
 * /quality-compliance — Propharmex quality posture.
 *
 * Prompt 8 deliverable. Content lives in apps/web/content/quality.ts and will
 * migrate to a Sanity `page{slug:"quality-compliance"}` document plus a
 * `certification` + `regulator` + `policyDocument` collection.
 *
 * - RSC page. ISR 300s.
 * - Emits AboutPage + BreadcrumbList JSON-LD referencing the root layout's
 *   Organization + WebSite @ids.
 * - Per-certification Person-style structured data is intentionally NOT emitted
 *   here — marketing should not be the source of truth for cert records. The
 *   Drug Product Database is. Primary-source links throughout the UI handle
 *   verification.
 * - Site-wide `robots: { index: false, follow: false }` (from root layout)
 *   remains in force until Prompt 27 flips the site to indexed.
 */
import type { Metadata } from "next";

import { env, jsonLdGraph } from "@propharmex/lib";

import { AuditHistory } from "../../components/quality/AuditHistory";
import { CertificationWall } from "../../components/quality/CertificationWall";
import { DelStoryTeaser } from "../../components/quality/DelStoryTeaser";
import { DownloadCenter } from "../../components/quality/DownloadCenter";
import { Hero } from "../../components/quality/Hero";
import { QmsArchitecture } from "../../components/quality/QmsArchitecture";
import { RegulatoryBodies } from "../../components/quality/RegulatoryBodies";
import { JsonLd } from "../../components/site/JsonLd";
import { QUALITY } from "../../content/quality";
import { regionalizeQuality } from "../../content/quality-region";
import { getServerRegion } from "../../lib/region-server";

export const revalidate = 300;

export const metadata: Metadata = {
  title: { absolute: QUALITY.metaTitle },
  description: QUALITY.metaDescription,
  alternates: { canonical: "/quality-compliance" },
  openGraph: {
    type: "website",
    title: QUALITY.ogTitle,
    description: QUALITY.ogDescription,
    url: "/quality-compliance",
  },
  twitter: {
    card: "summary_large_image",
    title: QUALITY.ogTitle,
    description: QUALITY.ogDescription,
  },
};

export default async function QualityCompliancePage() {
  const siteUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const pageJsonLd = buildQualityJsonLd(siteUrl);
  const region = await getServerRegion();
  const quality = regionalizeQuality(region);

  return (
    <>
      <Hero content={quality.hero} />
      <CertificationWall content={quality.certifications} />
      <QmsArchitecture content={quality.qms} />
      <RegulatoryBodies content={quality.regulators} />
      <AuditHistory content={quality.audit} />
      <DelStoryTeaser content={quality.del} />
      <DownloadCenter content={quality.downloads} />

      <JsonLd id="quality-jsonld" data={pageJsonLd} />
    </>
  );
}

function buildQualityJsonLd(siteUrl: string) {
  const aboutPage = {
    "@type": "AboutPage",
    "@id": `${siteUrl}/quality-compliance#webpage`,
    url: `${siteUrl}/quality-compliance`,
    name: QUALITY.metaTitle,
    description: QUALITY.metaDescription,
    isPartOf: { "@id": `${siteUrl}#website` },
    about: { "@id": `${siteUrl}#organization` },
    inLanguage: "en-CA",
  };

  const breadcrumb = {
    "@type": "BreadcrumbList",
    "@id": `${siteUrl}/quality-compliance#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Quality & Compliance",
        item: `${siteUrl}/quality-compliance`,
      },
    ],
  };

  return jsonLdGraph([aboutPage, breadcrumb]);
}

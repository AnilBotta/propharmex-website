/**
 * /contact — Contact page (Prompt 17).
 *
 * RSC page shell. ISR 300s.
 *
 * JSON-LD posture: the root layout's site-wide graph already emits
 * Organization + WebSite + LocalBusiness × 2 (Mississauga, Hyderabad)
 * via buildSiteJsonLd. This page therefore only emits ContactPage +
 * BreadcrumbList nodes and references the existing #organization,
 * #website, and #location-mississauga / #location-hyderabad @ids by
 * URL anchor — no duplicate facility nodes.
 *
 * Content lives in apps/web/content/contact.ts and will migrate to a
 * Sanity contactPage singleton at Prompt 22. Hub addresses read from
 * apps/web/content/site-nav.ts (FACILITIES) — single source of truth.
 *
 * The InquiryForm (commit 3) and CalBookingPanel (commit 4) wire into
 * this page in their respective commits. This commit ships the hero +
 * dual address cards + JSON-LD and replaces the Prompt-5 placeholder.
 */
import type { Metadata } from "next";

import { env, jsonLdGraph } from "@propharmex/lib";
import { prioritizeByRegion, type Region } from "@propharmex/lib/region";

import { CalBookingPanel } from "../../components/contact/CalBookingPanel";
import { ContactAddressCards } from "../../components/contact/ContactAddressCards";
import { ContactHero } from "../../components/contact/ContactHero";
import { InquiryForm } from "../../components/contact/InquiryForm";
import { JsonLd } from "../../components/site/JsonLd";
import { CONTACT } from "../../content/contact";
import { FACILITIES, type FacilityAddress } from "../../content/site-nav";
import { getServerRegion } from "../../lib/region-server";

/**
 * Per-region facility priority. Mississauga first for CA / US / GLOBAL
 * (DEL anchor + sponsor-of-record); Hyderabad first for IN visitors
 * (the development centre is in Hyderabad). Both facilities are always
 * shown; only the order changes.
 */
const FACILITY_PRIORITY: Record<Region, readonly FacilityAddress["code"][]> = {
  CA: ["MISSISSAUGA", "HYDERABAD"],
  US: ["MISSISSAUGA", "HYDERABAD"],
  IN: ["HYDERABAD", "MISSISSAUGA"],
  GLOBAL: ["MISSISSAUGA", "HYDERABAD"],
};

const FALLBACK_EMAIL = "hello@propharmex.com";

export const revalidate = 300;

const PAGE_PATH = "/contact";

export const metadata: Metadata = {
  title: { absolute: CONTACT.metaTitle },
  description: CONTACT.metaDescription,
  alternates: { canonical: PAGE_PATH },
  openGraph: {
    type: "website",
    title: CONTACT.ogTitle,
    description: CONTACT.ogDescription,
    url: PAGE_PATH,
  },
  twitter: {
    card: "summary_large_image",
    title: CONTACT.ogTitle,
    description: CONTACT.ogDescription,
  },
};

export default async function ContactPage() {
  const siteUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const pageJsonLd = buildContactPageJsonLd(siteUrl);
  const region = await getServerRegion();
  const facilities = prioritizeByRegion(
    FACILITIES,
    (f) => f.code,
    FACILITY_PRIORITY,
    region,
  );

  return (
    <>
      <ContactHero content={CONTACT.hero} />
      <ContactAddressCards content={CONTACT.addresses} facilities={facilities} />
      <InquiryForm content={CONTACT.form} />
      <CalBookingPanel
        content={CONTACT.cal}
        calLink={env.CAL_LINK}
        fallbackEmail={FALLBACK_EMAIL}
      />

      <JsonLd id="contact-page-jsonld" data={pageJsonLd} />
    </>
  );
}

/**
 * Build the page-level JSON-LD graph:
 *  - ContactPage — references the root #organization as `mainEntity` and
 *    points at the two existing #location-* facility nodes via
 *    `relatedLink` so Google + AI engines can connect this page to the
 *    hubs without duplicate LocalBusiness emission.
 *  - BreadcrumbList — Home → Contact.
 */
function buildContactPageJsonLd(siteUrl: string) {
  const pageUrl = `${siteUrl}${PAGE_PATH}`;

  const facilityRefs = FACILITIES.map((f) => ({
    "@id": `${siteUrl}#location-${f.code.toLowerCase()}`,
  }));

  const contactPage = {
    "@type": "ContactPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: CONTACT.metaTitle,
    description: CONTACT.metaDescription,
    isPartOf: { "@id": `${siteUrl}#website` },
    inLanguage: "en-CA",
    publisher: { "@id": `${siteUrl}#organization` },
    mainEntity: { "@id": `${siteUrl}#organization` },
    about: facilityRefs,
  };

  const breadcrumb = {
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`,
    itemListElement: CONTACT.breadcrumb.map((crumb, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: crumb.label,
      item: `${siteUrl}${crumb.href}`,
    })),
  };

  return jsonLdGraph([contactPage, breadcrumb]);
}

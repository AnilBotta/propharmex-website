/**
 * Site-wide JSON-LD graph builder.
 *
 * Emits:
 *  - Organization (Propharmex)
 *  - WebSite
 *  - LocalBusiness × 2 (Mississauga + Hyderabad)
 *
 * Page-specific nodes (Service, Article, FAQ, Breadcrumb, Person) are emitted
 * by the page itself using the `pharma-schema-markup` skill templates.
 */
import {
  jsonLdGraph,
  localBusinessJsonLd,
  organizationJsonLd,
  webSiteJsonLd,
} from "@propharmex/lib";

import { FACILITIES } from "../../content/site-nav";

export function buildSiteJsonLd(siteUrl: string) {
  const cleanUrl = siteUrl.replace(/\/$/, "");

  const org = organizationJsonLd({
    name: "Propharmex",
    legalName: "Propharmex Inc.",
    url: cleanUrl,
    logoUrl: `${cleanUrl}/brand/propharmex-logo.svg`,
    description:
      "Canada–India bridge for pharmaceutical development, analytical services, Health Canada DEL regulatory affairs, and distribution.",
  });

  const website = webSiteJsonLd({
    url: cleanUrl,
    name: "Propharmex",
  });

  const locations = FACILITIES.map((f) =>
    localBusinessJsonLd({
      id: f.code.toLowerCase(),
      name: f.name,
      parentOrgUrl: cleanUrl,
      email: f.email,
      telephone: f.phone,
      description: f.role,
      address: {
        streetAddress: f.streetLines.filter((l) => !l.startsWith("—")).join(", ") || undefined,
        addressLocality: f.city,
        addressRegion: f.region,
        postalCode: f.postalCode || undefined,
        addressCountry: f.countryCode,
      },
    }),
  );

  return jsonLdGraph([org, website, ...locations]);
}

/**
 * Site-wide JSON-LD graph builder.
 *
 * Emits:
 *  - Organization (Propharmex)
 *  - WebSite
 *  - LocalBusiness (Mississauga headquarters)
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
      "Canada-headquartered pharmaceutical services partner for global sponsors. Analytical services, regulatory strategy, pharmaceutical development, and clinical and BE insight.",
  });

  const website = webSiteJsonLd({
    url: cleanUrl,
    name: "Propharmex",
  });

  const locations = FACILITIES.filter((f) => f.countryCode === "CA").map((f) =>
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
    })
  );

  return jsonLdGraph([org, website, ...locations]);
}

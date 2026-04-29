import { describe, expect, it } from "vitest";

import {
  SCHEMA_CONTEXT,
  articleJsonLd,
  breadcrumbListJsonLd,
  combineJsonLd,
  faqPageJsonLd,
  jsonLdGraph,
  localBusinessJsonLd,
  organizationJsonLd,
  personJsonLd,
  serviceJsonLd,
  webPageJsonLd,
  webSiteJsonLd,
} from "./schema-org";

describe("schema-org builders", () => {
  it("emits Organization with @id and drops undefined fields", () => {
    const org = organizationJsonLd({
      name: "Propharmex",
      url: "https://example.com/",
    });
    expect(org["@context"]).toBe(SCHEMA_CONTEXT);
    expect(org["@type"]).toBe("Organization");
    expect(org["@id"]).toBe("https://example.com#organization");
    expect(Object.keys(org)).not.toContain("logo");
    expect(Object.keys(org)).not.toContain("sameAs");
  });

  it("LocalBusiness references the parent Organization", () => {
    const loc = localBusinessJsonLd({
      id: "mississauga",
      name: "Propharmex Canada",
      parentOrgUrl: "https://example.com",
      address: {
        addressLocality: "Mississauga",
        addressRegion: "ON",
        addressCountry: "CA",
      },
    });
    expect(loc["@type"]).toBe("LocalBusiness");
    expect(loc["@id"]).toBe("https://example.com#location-mississauga");
    expect(loc.parentOrganization).toEqual({
      "@id": "https://example.com#organization",
    });
    const addr = loc.address as Record<string, unknown>;
    expect(addr["@type"]).toBe("PostalAddress");
    expect(addr.addressLocality).toBe("Mississauga");
  });

  it("WebSite includes SearchAction only when template provided", () => {
    const bare = webSiteJsonLd({
      url: "https://example.com",
      name: "Propharmex",
    });
    expect(bare.potentialAction).toBeUndefined();

    const withSearch = webSiteJsonLd({
      url: "https://example.com",
      name: "Propharmex",
      searchUrlTemplate: "https://example.com/search?q={search_term_string}",
    });
    expect(withSearch.potentialAction).toBeDefined();
  });

  it("graph wrapper strips per-node @context", () => {
    const graph = jsonLdGraph([
      organizationJsonLd({ name: "P", url: "https://x.test" }),
      webSiteJsonLd({ name: "P", url: "https://x.test" }),
    ]);
    expect(graph["@context"]).toBe(SCHEMA_CONTEXT);
    const nodes = graph["@graph"] as Record<string, unknown>[];
    expect(nodes).toHaveLength(2);
    for (const n of nodes) {
      expect(n["@context"]).toBeUndefined();
    }
  });

  it("BreadcrumbList prepends Home and orders positions from 1", () => {
    const crumbs = breadcrumbListJsonLd({
      siteUrl: "https://example.com",
      trail: [
        { name: "Insights", path: "/insights" },
        { name: "DEL primer", path: "/insights/del-primer" },
      ],
    });
    expect(crumbs["@type"]).toBe("BreadcrumbList");
    const items = crumbs.itemListElement as Record<string, unknown>[];
    expect(items).toHaveLength(3);
    expect(items[0]).toMatchObject({ position: 1, name: "Home" });
    expect(items[2]).toMatchObject({
      position: 3,
      name: "DEL primer",
      item: "https://example.com/insights/del-primer",
    });
  });

  it("WebPage references site graph and inlines breadcrumb", () => {
    const breadcrumb = breadcrumbListJsonLd({
      siteUrl: "https://example.com",
      trail: [{ name: "Insights", path: "/insights" }],
    });
    const page = webPageJsonLd({
      siteUrl: "https://example.com",
      path: "/insights",
      name: "Insights",
      description: "Editorial",
      datePublished: "2026-01-02",
      breadcrumb,
    });
    expect(page["@id"]).toBe("https://example.com/insights#webpage");
    expect(page.isPartOf).toEqual({ "@id": "https://example.com#website" });
    expect(page.breadcrumb).toBe(breadcrumb);
    expect(page.dateModified).toBe("2026-01-02");
  });

  it("FAQPage emits Question/Answer pairs", () => {
    const faq = faqPageJsonLd({
      items: [
        { question: "What is DEL?", answer: "Drug Establishment Licence." },
      ],
    });
    expect(faq["@type"]).toBe("FAQPage");
    const main = faq.mainEntity as Record<string, unknown>[];
    expect(main).toHaveLength(1);
    expect(main[0]).toMatchObject({
      "@type": "Question",
      name: "What is DEL?",
    });
    expect((main[0]?.acceptedAnswer as Record<string, unknown>).text).toBe(
      "Drug Establishment Licence.",
    );
  });

  it("Person infers worksFor from siteUrl", () => {
    const person = personJsonLd({
      name: "Jane Doe",
      jobTitle: "Head of Regulatory",
      siteUrl: "https://example.com",
      path: "/about/leadership/jane-doe",
      sameAs: ["https://www.linkedin.com/in/janedoe"],
    });
    expect(person["@id"]).toBe(
      "https://example.com/about/leadership/jane-doe#person",
    );
    expect(person.worksFor).toEqual({
      "@id": "https://example.com#organization",
    });
  });

  it("Article links to webpage + organization and defaults Article type", () => {
    const article = articleJsonLd({
      siteUrl: "https://example.com/",
      path: "/insights/del-primer",
      headline: "DEL primer",
      datePublished: "2026-04-26",
      author: { name: "Editorial", jobTitle: "Regulatory practice" },
      keywords: ["DEL", "Health Canada"],
      articleSection: "Health Canada DEL",
    });
    expect(article["@type"]).toBe("Article");
    expect(article["@id"]).toBe(
      "https://example.com/insights/del-primer#article",
    );
    expect(article.publisher).toEqual({
      "@id": "https://example.com#organization",
    });
    expect(article.mainEntityOfPage).toEqual({
      "@id": "https://example.com/insights/del-primer#webpage",
    });
    expect(article.dateModified).toBe("2026-04-26");
    expect(article.author).toHaveLength(1);
  });

  it("Service emits hasOfferCatalog only when offerings provided", () => {
    const bare = serviceJsonLd({
      siteUrl: "https://example.com",
      path: "/services/regulatory-services/del-licensing",
      name: "DEL licensing",
      description: "End-to-end DEL applications.",
    });
    expect(bare.hasOfferCatalog).toBeUndefined();

    const withOffers = serviceJsonLd({
      siteUrl: "https://example.com",
      path: "/services/regulatory-services/del-licensing",
      name: "DEL licensing",
      description: "End-to-end DEL applications.",
      serviceType: "Regulatory affairs",
      areaServed: ["Canada"],
      offerCatalog: ["Application drafting", "GMP audit prep"],
    });
    expect(withOffers.provider).toEqual({
      "@id": "https://example.com#organization",
    });
    const offerCatalog = withOffers.hasOfferCatalog as Record<string, unknown>;
    expect(offerCatalog["@type"]).toBe("OfferCatalog");
    expect(
      offerCatalog.itemListElement as Record<string, unknown>[],
    ).toHaveLength(2);
  });

  it("combineJsonLd is an alias for jsonLdGraph", () => {
    expect(combineJsonLd).toBe(jsonLdGraph);
  });
});

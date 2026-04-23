import { describe, expect, it } from "vitest";

import {
  SCHEMA_CONTEXT,
  jsonLdGraph,
  localBusinessJsonLd,
  organizationJsonLd,
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
});

/**
 * schema.org JSON-LD builders.
 *
 * Thin, typed helpers for the structured-data nodes we emit on every page.
 * The full `pharma-schema-markup` skill is the author of the page-type
 * templates (Service, Article, FAQ, Breadcrumb, Person, LocalBusiness); this
 * module is the shared primitive layer those templates and `apps/web`
 * components both consume.
 *
 * Rules:
 *  - Return plain JSON-serializable objects. Never include JSX.
 *  - Every field is optional at the caller level — we drop undefined keys so
 *    validators don't choke on null properties.
 *  - `@context` is always `https://schema.org`. Do not hardcode the URL
 *    anywhere else.
 */

export const SCHEMA_CONTEXT = "https://schema.org" as const;

type JsonLd = Record<string, unknown>;

function clean<T extends JsonLd>(obj: T): T {
  const out: JsonLd = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null) continue;
    if (Array.isArray(v) && v.length === 0) continue;
    out[k] = v;
  }
  return out as T;
}

/* -------------------------------------------------------------------------- */
/*  Organization                                                              */
/* -------------------------------------------------------------------------- */

export interface OrganizationInput {
  name: string;
  url: string;
  logoUrl?: string;
  sameAs?: string[];
  description?: string;
  founded?: string;
  legalName?: string;
}

export function organizationJsonLd(input: OrganizationInput): JsonLd {
  return clean({
    "@context": SCHEMA_CONTEXT,
    "@type": "Organization",
    "@id": `${input.url.replace(/\/$/, "")}#organization`,
    name: input.name,
    legalName: input.legalName,
    url: input.url,
    logo: input.logoUrl,
    description: input.description,
    foundingDate: input.founded,
    sameAs: input.sameAs,
  });
}

/* -------------------------------------------------------------------------- */
/*  LocalBusiness (one entry per facility)                                    */
/* -------------------------------------------------------------------------- */

export interface PostalAddressInput {
  streetAddress?: string;
  addressLocality: string;
  addressRegion?: string;
  postalCode?: string;
  addressCountry: string;
}

export interface LocalBusinessInput {
  id: string;
  name: string;
  parentOrgUrl: string;
  url?: string;
  telephone?: string;
  email?: string;
  address: PostalAddressInput;
  areaServed?: string[];
  description?: string;
}

export function localBusinessJsonLd(input: LocalBusinessInput): JsonLd {
  const base = input.parentOrgUrl.replace(/\/$/, "");
  return clean({
    "@context": SCHEMA_CONTEXT,
    "@type": "LocalBusiness",
    "@id": `${base}#location-${input.id}`,
    name: input.name,
    url: input.url ?? input.parentOrgUrl,
    telephone: input.telephone,
    email: input.email,
    description: input.description,
    areaServed: input.areaServed,
    parentOrganization: { "@id": `${base}#organization` },
    address: clean({
      "@type": "PostalAddress",
      ...input.address,
    }),
  });
}

/* -------------------------------------------------------------------------- */
/*  Graph wrapper                                                             */
/* -------------------------------------------------------------------------- */

export function jsonLdGraph(nodes: JsonLd[]): JsonLd {
  return {
    "@context": SCHEMA_CONTEXT,
    "@graph": nodes.map((n) => {
      // Strip per-node @context now that the graph owns it.
      const { "@context": _ctx, ...rest } = n;
      return rest;
    }),
  };
}

/* -------------------------------------------------------------------------- */
/*  Website + SearchAction                                                    */
/* -------------------------------------------------------------------------- */

export interface WebSiteInput {
  url: string;
  name: string;
  searchUrlTemplate?: string;
}

export function webSiteJsonLd(input: WebSiteInput): JsonLd {
  const base = input.url.replace(/\/$/, "");
  return clean({
    "@context": SCHEMA_CONTEXT,
    "@type": "WebSite",
    "@id": `${base}#website`,
    url: input.url,
    name: input.name,
    publisher: { "@id": `${base}#organization` },
    potentialAction: input.searchUrlTemplate
      ? clean({
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: input.searchUrlTemplate,
          },
          "query-input": "required name=search_term_string",
        })
      : undefined,
  });
}

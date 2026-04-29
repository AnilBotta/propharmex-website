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

/* -------------------------------------------------------------------------- */
/*  Breadcrumb                                                                */
/* -------------------------------------------------------------------------- */

export interface BreadcrumbTrailItem {
  /** Human-readable label, e.g. "Insights". */
  name: string;
  /** Path from site root, with leading slash, e.g. "/insights/del-primer". */
  path: string;
}

export interface BreadcrumbListInput {
  /** Site root, e.g. "https://propharmex.com". Trailing slash is tolerated. */
  siteUrl: string;
  /** Ordered crumbs from root to current page. Don't include "Home" — added implicitly. */
  trail: BreadcrumbTrailItem[];
}

/**
 * Emit a BreadcrumbList. Always inserts an implicit "Home" crumb at position 1
 * so callers don't repeat themselves on every page.
 */
export function breadcrumbListJsonLd(input: BreadcrumbListInput): JsonLd {
  const base = input.siteUrl.replace(/\/$/, "");
  const items = [{ name: "Home", path: "/" }, ...input.trail].map(
    (item, index) =>
      clean({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: `${base}${item.path === "/" ? "" : item.path}` || base,
      }),
  );
  return clean({
    "@context": SCHEMA_CONTEXT,
    "@type": "BreadcrumbList",
    itemListElement: items,
  });
}

/* -------------------------------------------------------------------------- */
/*  WebPage                                                                   */
/* -------------------------------------------------------------------------- */

export interface WebPageInput {
  siteUrl: string;
  /** Path with leading slash. */
  path: string;
  name: string;
  description?: string;
  /** ISO date string. */
  datePublished?: string;
  /** ISO date string. Defaults to datePublished. */
  dateModified?: string;
  /** Inline a BreadcrumbList by passing its node. */
  breadcrumb?: JsonLd;
}

export function webPageJsonLd(input: WebPageInput): JsonLd {
  const base = input.siteUrl.replace(/\/$/, "");
  const url = `${base}${input.path}`;
  return clean({
    "@context": SCHEMA_CONTEXT,
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: input.name,
    description: input.description,
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    isPartOf: { "@id": `${base}#website` },
    breadcrumb: input.breadcrumb,
  });
}

/* -------------------------------------------------------------------------- */
/*  FAQPage                                                                   */
/* -------------------------------------------------------------------------- */

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqPageInput {
  /** Optional `@id` so other nodes (WebPage) can reference it. */
  id?: string;
  items: FaqItem[];
}

export function faqPageJsonLd(input: FaqPageInput): JsonLd {
  return clean({
    "@context": SCHEMA_CONTEXT,
    "@type": "FAQPage",
    "@id": input.id,
    mainEntity: input.items.map((item) =>
      clean({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      }),
    ),
  });
}

/* -------------------------------------------------------------------------- */
/*  Person                                                                    */
/* -------------------------------------------------------------------------- */

export interface PersonInput {
  name: string;
  jobTitle?: string;
  url?: string;
  image?: string;
  /** Used for `@id` if provided; otherwise the node is inline-only. */
  siteUrl?: string;
  /** Slug-fragment path under siteUrl, e.g. "/about/leadership/jane-doe". */
  path?: string;
  /** External profile links — LinkedIn, Crunchbase, ORCID, etc. */
  sameAs?: string[];
  /** Affiliation; defaults to the site Organization when siteUrl is provided. */
  affiliation?: JsonLd;
  description?: string;
}

export function personJsonLd(input: PersonInput): JsonLd {
  const base = input.siteUrl?.replace(/\/$/, "");
  const id =
    base && input.path ? `${base}${input.path}#person` : undefined;
  const affiliation =
    input.affiliation ??
    (base ? { "@id": `${base}#organization` } : undefined);
  return clean({
    "@context": SCHEMA_CONTEXT,
    "@type": "Person",
    "@id": id,
    name: input.name,
    jobTitle: input.jobTitle,
    description: input.description,
    image: input.image,
    url: input.url,
    sameAs: input.sameAs,
    worksFor: affiliation,
    affiliation,
  });
}

/* -------------------------------------------------------------------------- */
/*  Article                                                                   */
/* -------------------------------------------------------------------------- */

export type ArticleSchemaType =
  | "Article"
  | "NewsArticle"
  | "TechArticle"
  | "ScholarlyArticle";

export interface ArticleAuthor {
  name: string;
  jobTitle?: string;
  url?: string;
}

export interface ArticleInput {
  type?: ArticleSchemaType;
  siteUrl: string;
  /** Path with leading slash. */
  path: string;
  headline: string;
  description?: string;
  /** ISO date string. */
  datePublished: string;
  dateModified?: string;
  author: ArticleAuthor | ArticleAuthor[];
  /** Image URL — should be 1200×630 or equivalent for SERP eligibility. */
  imageUrl?: string;
  /** Free-form keywords — usually the article's tag list. */
  keywords?: string[];
  /** Section/pillar label (e.g. "Health Canada DEL"). */
  articleSection?: string;
  inLanguage?: string;
}

export function articleJsonLd(input: ArticleInput): JsonLd {
  const base = input.siteUrl.replace(/\/$/, "");
  const url = `${base}${input.path}`;
  const authors = Array.isArray(input.author) ? input.author : [input.author];
  return clean({
    "@context": SCHEMA_CONTEXT,
    "@type": input.type ?? "Article",
    "@id": `${url}#article`,
    headline: input.headline,
    description: input.description,
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    inLanguage: input.inLanguage ?? "en",
    image: input.imageUrl,
    keywords: input.keywords,
    articleSection: input.articleSection,
    author: authors.map((a) =>
      clean({
        "@type": "Person",
        name: a.name,
        jobTitle: a.jobTitle,
        url: a.url,
      }),
    ),
    publisher: { "@id": `${base}#organization` },
    isPartOf: { "@id": `${base}#website` },
    mainEntityOfPage: { "@id": `${url}#webpage` },
  });
}

/* -------------------------------------------------------------------------- */
/*  Service                                                                   */
/* -------------------------------------------------------------------------- */

export interface ServiceInput {
  siteUrl: string;
  /** Path with leading slash. */
  path: string;
  name: string;
  description: string;
  /** Free-form service category — typically the pillar label. */
  serviceType?: string;
  /** Geography served (e.g. ["Canada", "United States"]). */
  areaServed?: string[];
  /** Bulleted list of offerings — drives `hasOfferCatalog`. */
  offerCatalog?: string[];
}

export function serviceJsonLd(input: ServiceInput): JsonLd {
  const base = input.siteUrl.replace(/\/$/, "");
  const url = `${base}${input.path}`;
  return clean({
    "@context": SCHEMA_CONTEXT,
    "@type": "Service",
    "@id": `${url}#service`,
    name: input.name,
    description: input.description,
    serviceType: input.serviceType,
    areaServed: input.areaServed,
    provider: { "@id": `${base}#organization` },
    url,
    hasOfferCatalog: input.offerCatalog?.length
      ? clean({
          "@type": "OfferCatalog",
          name: input.name,
          itemListElement: input.offerCatalog.map((offering, index) =>
            clean({
              "@type": "Offer",
              position: index + 1,
              itemOffered: { "@type": "Service", name: offering },
            }),
          ),
        })
      : undefined,
  });
}

/* -------------------------------------------------------------------------- */
/*  Aliases                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * `combineJsonLd` is the canonical name from the pharma-schema-markup skill
 * spec. `jsonLdGraph` is the historical export and stays for back-compat.
 */
export const combineJsonLd = jsonLdGraph;

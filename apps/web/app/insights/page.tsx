/**
 * /insights — Insights hub.
 *
 * Prompt 15 deliverable. Content lives in apps/web/content/insights.ts and
 * will migrate to Sanity `insight` + `whitepaper` documents at Prompt 22.
 *
 * - RSC page shell; `FilterableGrid` is a client island.
 * - ISR 300s.
 * - Emits CollectionPage + ItemList + BreadcrumbList JSON-LD referencing the
 *   root layout's Organization + WebSite @ids.
 * - Article detail pages live at `/insights/[slug]`.
 * - Whitepaper detail pages live at `/insights/whitepapers/[slug]`.
 */
import type { Metadata } from "next";

import { env, jsonLdGraph } from "@propharmex/lib";

import { FilterableGrid } from "../../components/insights/FilterableGrid";
import { HubClosing } from "../../components/insights/HubClosing";
import { HubHero } from "../../components/insights/HubHero";
import { JsonLd } from "../../components/site/JsonLd";
import { INSIGHTS } from "../../content/insights";

// Insights hub revalidates more aggressively than other content pages — the
// editorial team publishes here most frequently and we want fresh listings
// on the hub within ~1 minute of a Sanity update (Prompt 25 spec).
export const revalidate = 60;

const HUB_PATH = "/insights";

export const metadata: Metadata = {
  title: { absolute: INSIGHTS.hub.metaTitle },
  description: INSIGHTS.hub.metaDescription,
  alternates: { canonical: HUB_PATH },
  openGraph: {
    type: "website",
    title: INSIGHTS.hub.ogTitle,
    description: INSIGHTS.hub.ogDescription,
    url: HUB_PATH,
  },
  twitter: {
    card: "summary_large_image",
    title: INSIGHTS.hub.ogTitle,
    description: INSIGHTS.hub.ogDescription,
  },
};

export default function InsightsHubPage() {
  const siteUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const pageJsonLd = buildHubJsonLd(siteUrl);

  return (
    <>
      <HubHero content={INSIGHTS.hub.hero} />
      <FilterableGrid
        articles={INSIGHTS.articles}
        whitepapers={INSIGHTS.whitepapers}
        copy={INSIGHTS.hub.filterCopy}
      />
      <HubClosing content={INSIGHTS.hub.closing} />

      <JsonLd id="ins-hub-jsonld" data={pageJsonLd} />
    </>
  );
}

function buildHubJsonLd(siteUrl: string) {
  const pageUrl = `${siteUrl}${HUB_PATH}`;

  const articleListItems = INSIGHTS.articles.map((article, idx) => ({
    "@type": "ListItem",
    position: idx + 1,
    name: article.title,
    url: `${pageUrl}/${article.slug}`,
  }));

  const whitepaperListItems = INSIGHTS.whitepapers.map((wp, idx) => ({
    "@type": "ListItem",
    position: INSIGHTS.articles.length + idx + 1,
    name: wp.title,
    url: `${pageUrl}/whitepapers/${wp.slug}`,
  }));

  const collectionPage = {
    "@type": "CollectionPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: INSIGHTS.hub.metaTitle,
    description: INSIGHTS.hub.metaDescription,
    isPartOf: { "@id": `${siteUrl}#website` },
    inLanguage: "en-CA",
    publisher: { "@id": `${siteUrl}#organization` },
  };

  const itemList = {
    "@type": "ItemList",
    "@id": `${pageUrl}#itemlist`,
    itemListElement: [...articleListItems, ...whitepaperListItems],
  };

  const breadcrumb = {
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Insights",
        item: pageUrl,
      },
    ],
  };

  return jsonLdGraph([collectionPage, itemList, breadcrumb]);
}

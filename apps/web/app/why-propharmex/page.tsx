/**
 * /why-propharmex — narrative single-page story, 6 chapters.
 *
 * Prompt 6 deliverable. Content lives in `apps/web/content/why.ts` and will
 * migrate to Sanity `page{slug:"why-propharmex"}` alongside the homepage.
 *
 * - RSC page. ISR 300s.
 * - Emits a page-level JSON-LD graph (WebPage + BreadcrumbList) referencing
 *   the root layout's Organization + WebSite @ids.
 * - ChapterRail is a client island mounted once; each ChapterSection renders
 *   its body + stats + support callout through a single client reveal island.
 * - Site-wide `robots: { index: false, follow: false }` (from root layout)
 *   remains in force until Prompt 27 flips the site to indexed.
 */
import type { Metadata } from "next";

import { env, jsonLdGraph } from "@propharmex/lib";

import { JsonLd } from "../../components/site/JsonLd";
import { ChapterRail } from "../../components/why/ChapterRail";
import { ChapterSection } from "../../components/why/ChapterSection";
import { DenseCta } from "../../components/why/DenseCta";
import { WHY } from "../../content/why";

export const revalidate = 300;

export const metadata: Metadata = {
  title: { absolute: WHY.metaTitle },
  description: WHY.metaDescription,
  alternates: { canonical: "/why-propharmex" },
  openGraph: {
    type: "article",
    title: WHY.ogTitle,
    description: WHY.ogDescription,
    url: "/why-propharmex",
  },
  twitter: {
    card: "summary_large_image",
    title: WHY.ogTitle,
    description: WHY.ogDescription,
  },
};

export default function WhyPropharmexPage() {
  const siteUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const pageJsonLd = buildWhyJsonLd(siteUrl);
  const total = WHY.chapters.length;

  return (
    <>
      <ChapterRail chapters={WHY.chapters} ariaLabel={WHY.railLabel} />

      {WHY.chapters.map((chapter, index) => (
        <ChapterSection
          key={chapter.id}
          chapter={chapter}
          index={index}
          total={total}
        />
      ))}

      <DenseCta content={WHY.cta} />

      <JsonLd id="why-jsonld" data={pageJsonLd} />
    </>
  );
}

function buildWhyJsonLd(siteUrl: string) {
  const webPage = {
    "@type": "WebPage",
    "@id": `${siteUrl}/why-propharmex#webpage`,
    url: `${siteUrl}/why-propharmex`,
    name: WHY.metaTitle,
    description: WHY.metaDescription,
    isPartOf: { "@id": `${siteUrl}#website` },
    about: { "@id": `${siteUrl}#organization` },
    inLanguage: "en-CA",
  };

  const breadcrumb = {
    "@type": "BreadcrumbList",
    "@id": `${siteUrl}/why-propharmex#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${siteUrl}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Why Propharmex",
        item: `${siteUrl}/why-propharmex`,
      },
    ],
  };

  return jsonLdGraph([webPage, breadcrumb]);
}

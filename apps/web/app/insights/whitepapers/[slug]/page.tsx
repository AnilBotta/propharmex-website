/**
 * /insights/whitepapers/[slug] — whitepaper detail / gated download.
 *
 * Prompt 15 deliverable. Layout pairs the WhitepaperContents (what is inside
 * + ToC) on the left with the WhitepaperGateForm on the right at xl+; on
 * smaller screens the form stacks above the contents so mobile visitors
 * get to the download CTA without scrolling past it.
 *
 * - RSC page. ISR 300s.
 * - Emits Article + WebPage + BreadcrumbList JSON-LD referencing the root
 *   layout's Organization + WebSite @ids. (Whitepaper is modelled as an
 *   Article with `articleSection: "Whitepaper"` — schema.org has no
 *   dedicated "Whitepaper" type and Article is the closest semantic fit.)
 * - Unknown slugs fall through to Next.js' built-in notFound.
 * - The PDF asset itself is rendered at /downloads/[slug].pdf in commit 8.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { env, jsonLdGraph } from "@propharmex/lib";

import { WhitepaperContents } from "../../../../components/insights/WhitepaperContents";
import { WhitepaperGateForm } from "../../../../components/insights/WhitepaperGateForm";
import { WhitepaperHero } from "../../../../components/insights/WhitepaperHero";
import { JsonLd } from "../../../../components/site/JsonLd";
import {
  INSIGHTS,
  WHITEPAPER_SLUGS,
  type WhitepaperContent,
  type WhitepaperSlug,
} from "../../../../content/insights";

export const revalidate = 300;

const HUB_PATH = "/insights/whitepapers";

const WHITEPAPER_BY_SLUG: Record<WhitepaperSlug, WhitepaperContent> =
  Object.fromEntries(
    INSIGHTS.whitepapers.map((wp) => [wp.slug, wp]),
  ) as Record<WhitepaperSlug, WhitepaperContent>;

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return WHITEPAPER_SLUGS.map((slug) => ({ slug }));
}

function isKnownSlug(slug: string): slug is WhitepaperSlug {
  return (WHITEPAPER_SLUGS as readonly string[]).includes(slug);
}

function resolveContent(slug: string): WhitepaperContent | null {
  if (!isKnownSlug(slug)) return null;
  return WHITEPAPER_BY_SLUG[slug] ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const content = resolveContent(slug);
  if (!content) {
    return {
      title: "Whitepaper — Propharmex",
      robots: { index: false, follow: false },
    };
  }
  const path = `${HUB_PATH}/${content.slug}`;
  return {
    title: { absolute: content.metaTitle },
    description: content.metaDescription,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      title: content.ogTitle,
      description: content.ogDescription,
      url: path,
      publishedTime: `${content.publishedAt}T00:00:00Z`,
      authors: [content.author.name],
    },
    twitter: {
      card: "summary_large_image",
      title: content.ogTitle,
      description: content.ogDescription,
    },
  };
}

export default async function WhitepaperDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const content = resolveContent(slug);
  if (!content) notFound();

  const siteUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const pageJsonLd = buildDetailJsonLd(siteUrl, content);

  return (
    <>
      <WhitepaperHero content={content} />

      <section
        aria-label="Whitepaper contents and download form"
        className="border-b border-[var(--color-border)] bg-[var(--color-slate-50)] py-16 sm:py-20"
      >
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 sm:px-6 lg:px-8 xl:grid-cols-[1fr_440px]">
          <div className="order-2 xl:order-1">
            <WhitepaperContents content={content} />
          </div>
          <div className="order-1 xl:order-2">
            <WhitepaperGateForm content={content} />
          </div>
        </div>
      </section>

      <JsonLd id={`ins-wp-${content.slug}-jsonld`} data={pageJsonLd} />
    </>
  );
}

/**
 * Per-whitepaper JSON-LD graph:
 *
 *  - Article — schema.org has no "Whitepaper" type. Article with
 *    `articleSection: "Whitepaper"` is the closest semantic match. Author
 *    is rendered as a nested Organization (editorial group); publisher
 *    references the Propharmex Organization @id from the root layout.
 *  - WebPage — `about` the Article.
 *  - BreadcrumbList — Home → Insights → Whitepapers → this whitepaper.
 */
function buildDetailJsonLd(siteUrl: string, content: WhitepaperContent) {
  const pageUrl = `${siteUrl}${HUB_PATH}/${content.slug}`;

  const article = {
    "@type": "Article",
    "@id": `${pageUrl}#article`,
    headline: content.title,
    description: content.metaDescription,
    articleSection: "Whitepaper",
    mainEntityOfPage: { "@id": `${pageUrl}#webpage` },
    isPartOf: { "@id": `${siteUrl}#website` },
    author: {
      "@type": "Organization",
      name: content.author.name,
      description: content.author.role,
    },
    publisher: { "@id": `${siteUrl}#organization` },
    datePublished: `${content.publishedAt}T00:00:00Z`,
    inLanguage: "en-CA",
    url: pageUrl,
  };

  const webpage = {
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: content.metaTitle,
    description: content.metaDescription,
    isPartOf: { "@id": `${siteUrl}#website` },
    about: { "@id": `${pageUrl}#article` },
    inLanguage: "en-CA",
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
        item: `${siteUrl}/insights`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Whitepapers",
        item: `${siteUrl}${HUB_PATH}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: content.title,
        item: pageUrl,
      },
    ],
  };

  return jsonLdGraph([article, webpage, breadcrumb]);
}

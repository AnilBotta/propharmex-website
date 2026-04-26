/**
 * /insights/[slug] — article detail route.
 *
 * Prompt 15 deliverable. Three seed slugs declared in `ARTICLE_SLUGS` resolve
 * to article frontmatter via the `INSIGHTS.articles` array.
 * `generateStaticParams` prerenders all three paths as SSG.
 *
 * - RSC page. ISR 300s.
 * - Emits Article + WebPage + BreadcrumbList JSON-LD referencing the root
 *   layout's Organization + WebSite @ids.
 * - Unknown slugs fall through to Next.js' built-in notFound handler.
 * - Article bodies are authored in commits 4–6; until then the body
 *   renderer shows a "Body forthcoming" stub. The route, metadata, and
 *   JSON-LD are live from this commit onward.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { env, jsonLdGraph } from "@propharmex/lib";

import { ArticleBody } from "../../../components/insights/ArticleBody";
import { ArticleHero } from "../../../components/insights/ArticleHero";
import { ArticleToc } from "../../../components/insights/ArticleToc";
import { AuthorCard } from "../../../components/insights/AuthorCard";
import { RelatedReads } from "../../../components/insights/RelatedReads";
import { JsonLd } from "../../../components/site/JsonLd";
import {
  ARTICLE_SLUGS,
  INSIGHTS,
  type ArticleContent,
  type ArticleSlug,
} from "../../../content/insights";

export const revalidate = 300;

const HUB_PATH = "/insights";

const ARTICLE_BY_SLUG: Record<ArticleSlug, ArticleContent> = Object.fromEntries(
  INSIGHTS.articles.map((article) => [article.slug, article]),
) as Record<ArticleSlug, ArticleContent>;

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return ARTICLE_SLUGS.map((slug) => ({ slug }));
}

function isKnownSlug(slug: string): slug is ArticleSlug {
  return (ARTICLE_SLUGS as readonly string[]).includes(slug);
}

function resolveContent(slug: string): ArticleContent | null {
  if (!isKnownSlug(slug)) return null;
  return ARTICLE_BY_SLUG[slug] ?? null;
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
      title: "Insight — Propharmex",
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
      tags: content.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: content.ogTitle,
      description: content.ogDescription,
    },
  };
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const content = resolveContent(slug);
  if (!content) notFound();

  const siteUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const pageJsonLd = buildDetailJsonLd(siteUrl, content);

  const relatedArticles = content.related
    .map((s) => ARTICLE_BY_SLUG[s])
    .filter((a): a is ArticleContent => Boolean(a));

  return (
    <>
      <ArticleHero content={content} />

      <section
        aria-labelledby="ins-article-hero-heading"
        className="border-b border-[var(--color-border)] bg-[var(--color-bg)] py-12 sm:py-16"
      >
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:px-8 xl:grid-cols-[1fr_280px]">
          <div className="min-w-0 max-w-3xl xl:max-w-none">
            <ArticleBody content={content} />
            <div className="mt-12">
              <AuthorCard author={content.author} />
            </div>
          </div>
          <aside className="hidden xl:block">
            <ArticleToc blocks={content.body} />
          </aside>
        </div>
      </section>

      <RelatedReads articles={relatedArticles} />

      <JsonLd id={`ins-article-${content.slug}-jsonld`} data={pageJsonLd} />
    </>
  );
}

/**
 * Build the per-article JSON-LD graph:
 *
 *  - Article — the article itself. Author is the editorial group as a
 *    nested Organization-like node (since editorial-group bylines aren't
 *    Persons). Publisher is the Propharmex Organization. Keywords mirror
 *    the article tags.
 *  - WebPage — the containing page, `about` the Article.
 *  - BreadcrumbList — Home → Insights → this article.
 */
function buildDetailJsonLd(siteUrl: string, content: ArticleContent) {
  const pageUrl = `${siteUrl}${HUB_PATH}/${content.slug}`;

  const article = {
    "@type": "Article",
    "@id": `${pageUrl}#article`,
    headline: content.title,
    description: content.metaDescription,
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
    keywords: content.tags.join(", "),
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
        item: `${siteUrl}${HUB_PATH}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: content.title,
        item: pageUrl,
      },
    ],
  };

  return jsonLdGraph([article, webpage, breadcrumb]);
}

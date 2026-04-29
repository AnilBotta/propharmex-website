import { ImageResponse } from "next/og";

import {
  INSIGHTS,
  type ArticleContent,
  type ArticleSlug,
} from "../../../content/insights";

export const runtime = "edge";

export const alt = "Propharmex insight";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BRAND_PRIMARY = "#0E4C5A";
const BRAND_PRIMARY_700 = "#0A3742";
const BRAND_BG = "#FAFAF7";
const BRAND_FG = "#0F1417";
const BRAND_SLATE = "#4B5560";

const ARTICLE_BY_SLUG: Record<ArticleSlug, ArticleContent> = Object.fromEntries(
  INSIGHTS.articles.map((article) => [article.slug, article]),
) as Record<ArticleSlug, ArticleContent>;

export default async function ArticleOgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = ARTICLE_BY_SLUG[slug as ArticleSlug];
  const headline = article?.title ?? "Propharmex insight";
  const eyebrow = article?.hero.eyebrow ?? "Propharmex editorial";
  const author = article?.author.name ?? "Propharmex Editorial";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: BRAND_BG,
          backgroundImage: `linear-gradient(180deg, ${BRAND_BG} 0%, #F0EBE0 100%)`,
          padding: "64px 88px",
          fontFamily: "-apple-system, system-ui, 'Segoe UI', sans-serif",
          color: BRAND_FG,
          borderTop: `12px solid ${BRAND_PRIMARY}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              backgroundColor: BRAND_PRIMARY,
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: BRAND_BG,
              fontSize: "22px",
              fontWeight: 700,
              letterSpacing: "-0.04em",
            }}
          >
            P
          </div>
          <div
            style={{
              fontSize: "24px",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: BRAND_PRIMARY_700,
            }}
          >
            Propharmex · Insights
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              fontSize: "20px",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: BRAND_PRIMARY,
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              fontSize: "52px",
              fontWeight: 600,
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              color: BRAND_FG,
              maxWidth: "1024px",
            }}
          >
            {headline}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: BRAND_SLATE,
            fontSize: "20px",
          }}
        >
          <div>{author}</div>
          <div style={{ color: BRAND_PRIMARY_700, fontWeight: 600 }}>
            propharmex.com
          </div>
        </div>
      </div>
    ),
    size,
  );
}

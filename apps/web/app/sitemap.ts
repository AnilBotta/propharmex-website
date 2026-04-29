import type { MetadataRoute } from "next";
import { env } from "@propharmex/lib";

import { CASE_STUDY_SLUGS } from "../content/case-studies";
import { INDUSTRY_SLUGS } from "../content/industries";
import { ARTICLE_SLUGS, INSIGHTS, WHITEPAPER_SLUGS } from "../content/insights";
import { DOSAGE_FORM_CONTENT } from "../content/pharmaceutical-development";
import { ANALYTICAL_SERVICE_SLUGS } from "../content/analytical-services";
import { REGULATORY_SERVICE_SLUGS } from "../content/regulatory-services";

type Entry = MetadataRoute.Sitemap[number];
type ChangeFreq = NonNullable<Entry["changeFrequency"]>;

const SITE_URL = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
const BUILD_DATE = new Date();

function url(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function entry(
  path: string,
  priority: number,
  changeFrequency: ChangeFreq,
  lastModified: Date = BUILD_DATE,
): Entry {
  return { url: url(path), lastModified, changeFrequency, priority };
}

const STATIC_ENTRIES: Entry[] = [
  entry("/", 1.0, "weekly"),
  entry("/why-propharmex", 0.8, "monthly"),
  entry("/about", 0.8, "monthly"),
  entry("/about/leadership", 0.7, "monthly"),
  entry("/quality-compliance", 0.8, "monthly"),
  entry("/our-process", 0.7, "monthly"),
  entry("/facilities", 0.8, "monthly"),
  entry("/facilities/mississauga-canada", 0.8, "yearly"),
  entry("/facilities/hyderabad-india", 0.8, "yearly"),
  entry("/services/pharmaceutical-development", 0.9, "monthly"),
  entry("/services/analytical-services", 0.9, "monthly"),
  entry("/services/regulatory-services", 0.9, "monthly"),
  entry("/industries", 0.7, "monthly"),
  entry("/case-studies", 0.7, "weekly"),
  entry("/insights", 0.7, "weekly"),
  entry("/contact", 0.6, "yearly"),
  entry("/ai/project-scoping-assistant", 0.5, "monthly"),
  entry("/ai/del-readiness", 0.5, "monthly"),
  entry("/ai/dosage-matcher", 0.5, "monthly"),
];

// Routes deliberately excluded from the sitemap (and left noindex via their
// own page metadata):
//   /services            — placeholder PlaceholderPage, real entry points are
//                          the three pillar hubs below.
//   /services/[...slug]  — placeholder catch-all for legacy URLs.
//   /whitepapers/[slug]  — placeholder; canonical surface is
//                          /insights/whitepapers/[slug].
//   /studio-info         — operator-facing access info, not for indexing.

// Service leaves mirror the static content dictionaries that drive each
// route's generateStaticParams. Keep this in sync when new leaves ship.
const SERVICE_LEAF_ENTRIES: Entry[] = [
  ...Object.keys(DOSAGE_FORM_CONTENT).map((slug) =>
    entry(`/services/pharmaceutical-development/${slug}`, 0.8, "monthly"),
  ),
  ...ANALYTICAL_SERVICE_SLUGS.map((slug) =>
    entry(`/services/analytical-services/${slug}`, 0.8, "monthly"),
  ),
  ...REGULATORY_SERVICE_SLUGS.map((slug) =>
    entry(`/services/regulatory-services/${slug}`, 0.8, "monthly"),
  ),
];

const INDUSTRY_LEAF_ENTRIES: Entry[] = INDUSTRY_SLUGS.map((slug) =>
  entry(`/industries/${slug}`, 0.7, "monthly"),
);

const CASE_STUDY_ENTRIES: Entry[] = CASE_STUDY_SLUGS.map((slug) =>
  entry(`/case-studies/${slug}`, 0.7, "monthly"),
);

const ARTICLE_BY_SLUG = Object.fromEntries(
  INSIGHTS.articles.map((article) => [article.slug, article]),
);

const ARTICLE_ENTRIES: Entry[] = ARTICLE_SLUGS.map((slug) => {
  const article = ARTICLE_BY_SLUG[slug];
  const published = article?.publishedAt ? new Date(article.publishedAt) : BUILD_DATE;
  return entry(`/insights/${slug}`, 0.7, "monthly", published);
});

const WHITEPAPER_BY_SLUG = Object.fromEntries(
  INSIGHTS.whitepapers.map((wp) => [wp.slug, wp]),
);

const WHITEPAPER_ENTRIES: Entry[] = WHITEPAPER_SLUGS.map((slug) => {
  const wp = WHITEPAPER_BY_SLUG[slug];
  const published = wp?.publishedAt ? new Date(wp.publishedAt) : BUILD_DATE;
  return entry(`/insights/whitepapers/${slug}`, 0.7, "monthly", published);
});

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...STATIC_ENTRIES,
    ...SERVICE_LEAF_ENTRIES,
    ...INDUSTRY_LEAF_ENTRIES,
    ...CASE_STUDY_ENTRIES,
    ...ARTICLE_ENTRIES,
    ...WHITEPAPER_ENTRIES,
  ];
}

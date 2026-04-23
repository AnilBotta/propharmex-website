/**
 * /about — About Propharmex.
 *
 * Prompt 7 deliverable. Content lives in `apps/web/content/about.ts` and will
 * migrate to Sanity `page{slug:"about"}` + a `person` collection.
 *
 * - RSC page. ISR 300s.
 * - Emits a page-level JSON-LD graph (AboutPage + BreadcrumbList) referencing
 *   the root layout's Organization + WebSite @ids.
 * - Leadership preview is a client island that links into /about/leadership
 *   for the modal-detail experience.
 * - Site-wide `robots: { index: false, follow: false }` (from root layout)
 *   remains in force until Prompt 27 flips the site to indexed.
 */
import type { Metadata } from "next";

import { env, jsonLdGraph } from "@propharmex/lib";

import { CareersCta } from "../../components/about/CareersCta";
import { Culture } from "../../components/about/Culture";
import { Footprint } from "../../components/about/Footprint";
import { FoundingStory } from "../../components/about/FoundingStory";
import { LeadershipPreview } from "../../components/about/LeadershipPreview";
import { MissionVisionValues } from "../../components/about/MissionVisionValues";
import { Timeline } from "../../components/about/Timeline";
import { JsonLd } from "../../components/site/JsonLd";
import { ABOUT, LEADERS, LEADERSHIP_PAGE } from "../../content/about";

export const revalidate = 300;

export const metadata: Metadata = {
  title: { absolute: ABOUT.metaTitle },
  description: ABOUT.metaDescription,
  alternates: { canonical: "/about" },
  openGraph: {
    type: "website",
    title: ABOUT.ogTitle,
    description: ABOUT.ogDescription,
    url: "/about",
  },
  twitter: {
    card: "summary_large_image",
    title: ABOUT.ogTitle,
    description: ABOUT.ogDescription,
  },
};

export default function AboutPage() {
  const siteUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const pageJsonLd = buildAboutJsonLd(siteUrl);
  const previewLeaders = LEADERS.slice(0, 3);
  const stubBadgeLabel = previewLeaders.some((l) => l.stub)
    ? "Profile in preparation"
    : "";

  return (
    <>
      <FoundingStory content={ABOUT.founding} />
      <MissionVisionValues content={ABOUT.mvv} />
      <Timeline content={ABOUT.timeline} />
      <Footprint content={ABOUT.footprint} />
      <LeadershipPreview
        content={ABOUT.leadershipPreview}
        leaders={previewLeaders}
        stubBadgeLabel={stubBadgeLabel || LEADERSHIP_PAGE.stubNotice}
      />
      <Culture content={ABOUT.culture} />
      <CareersCta content={ABOUT.careers} />

      <JsonLd id="about-jsonld" data={pageJsonLd} />
    </>
  );
}

function buildAboutJsonLd(siteUrl: string) {
  const aboutPage = {
    "@type": "AboutPage",
    "@id": `${siteUrl}/about#webpage`,
    url: `${siteUrl}/about`,
    name: ABOUT.metaTitle,
    description: ABOUT.metaDescription,
    isPartOf: { "@id": `${siteUrl}#website` },
    about: { "@id": `${siteUrl}#organization` },
    inLanguage: "en-CA",
  };

  const breadcrumb = {
    "@type": "BreadcrumbList",
    "@id": `${siteUrl}/about#breadcrumb`,
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
        name: "About",
        item: `${siteUrl}/about`,
      },
    ],
  };

  return jsonLdGraph([aboutPage, breadcrumb]);
}

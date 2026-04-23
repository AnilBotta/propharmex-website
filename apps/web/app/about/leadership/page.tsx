/**
 * /about/leadership — Propharmex leadership team.
 *
 * Prompt 7 deliverable. Grid of person cards with a modal detail sheet for
 * each principal. Cards, grid, and modal are a single client island so the
 * hash-based deep-link logic (#<slug>) can drive the active modal.
 *
 * Leadership data is stubbed in `apps/web/content/about.ts` under option B —
 * every record carries `stub: true` and renders a "Profile in preparation"
 * badge until the founders supply vetted bios, credentials, and headshots.
 *
 * JSON-LD: emits AboutPage + BreadcrumbList + a Person node per leader. The
 * Person nodes are included even in stub mode so the schema stays consistent
 * across the live-data cutover.
 */
import type { Metadata } from "next";

import { env, jsonLdGraph } from "@propharmex/lib";

import { LeaderGrid } from "../../../components/about/LeaderGrid";
import { JsonLd } from "../../../components/site/JsonLd";
import { LEADERS, LEADERSHIP_PAGE } from "../../../content/about";

export const revalidate = 300;

export const metadata: Metadata = {
  title: { absolute: LEADERSHIP_PAGE.metaTitle },
  description: LEADERSHIP_PAGE.metaDescription,
  alternates: { canonical: "/about/leadership" },
  openGraph: {
    type: "website",
    title: LEADERSHIP_PAGE.metaTitle,
    description: LEADERSHIP_PAGE.metaDescription,
    url: "/about/leadership",
  },
};

export default function LeadershipPage() {
  const siteUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const jsonLd = buildLeadershipJsonLd(siteUrl);

  return (
    <>
      <section
        aria-labelledby="leadership-heading"
        className="border-b border-[var(--color-border)] bg-[var(--color-bg)] py-20 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <header className="max-w-3xl">
            <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
              Leadership
            </p>
            <h1
              id="leadership-heading"
              className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl lg:text-[clamp(2rem,3.2vw,2.75rem)] lg:leading-[1.1]"
            >
              {LEADERSHIP_PAGE.heading}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--color-slate-800)] sm:text-lg">
              {LEADERSHIP_PAGE.lede}
            </p>
          </header>

          <div className="mt-12">
            <LeaderGrid leaders={LEADERS} copy={LEADERSHIP_PAGE} />
          </div>
        </div>
      </section>

      <JsonLd id="leadership-jsonld" data={jsonLd} />
    </>
  );
}

function buildLeadershipJsonLd(siteUrl: string) {
  const aboutPage = {
    "@type": "AboutPage",
    "@id": `${siteUrl}/about/leadership#webpage`,
    url: `${siteUrl}/about/leadership`,
    name: LEADERSHIP_PAGE.metaTitle,
    description: LEADERSHIP_PAGE.metaDescription,
    isPartOf: { "@id": `${siteUrl}#website` },
    about: { "@id": `${siteUrl}#organization` },
    inLanguage: "en-CA",
  };

  const breadcrumb = {
    "@type": "BreadcrumbList",
    "@id": `${siteUrl}/about/leadership#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "About",
        item: `${siteUrl}/about`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Leadership",
        item: `${siteUrl}/about/leadership`,
      },
    ],
  };

  const people = LEADERS.map((leader) => ({
    "@type": "Person",
    "@id": `${siteUrl}/about/leadership#${leader.slug}`,
    name: leader.name,
    jobTitle: leader.role,
    description: leader.credential,
    worksFor: { "@id": `${siteUrl}#organization` },
    image: `${siteUrl}/brand/leadership/placeholder-headshot.svg`,
    ...(leader.linkedin ? { sameAs: [leader.linkedin] } : {}),
  }));

  return jsonLdGraph([aboutPage, breadcrumb, ...people]);
}

/**
 * /ai/dosage-matcher — Dosage Form Capability Matcher.
 *
 * Prompt 21 PR-A. Replaces the prior `PlaceholderPage` stub with the
 * full input form + AI matcher + side-by-side results surface.
 *
 * RSC shell: hero copy + JSON-LD live in this server component; the
 * matcher itself is a client component (`DosageFormMatcher`) because it
 * owns the tri-mode state machine and the stream parser.
 *
 * JSON-LD posture: the root layout already emits Organization +
 * WebSite + LocalBusiness × 2 via `buildSiteJsonLd`. This page only
 * emits WebPage + BreadcrumbList and references the existing
 * #organization @id.
 */
import type { Metadata } from "next";

import { env, jsonLdGraph } from "@propharmex/lib";

import { DosageFormMatcher } from "../../../components/dosage-matcher/Matcher";
import { JsonLd } from "../../../components/site/JsonLd";
import { DOSAGE_MATCHER } from "../../../content/dosage-matcher";

export const revalidate = 300;

const PAGE_PATH = "/ai/dosage-matcher";
const PAGE_TITLE = `${DOSAGE_MATCHER.hero.title} — Propharmex`;
const PAGE_DESCRIPTION = DOSAGE_MATCHER.hero.body;

export const metadata: Metadata = {
  title: { absolute: PAGE_TITLE },
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_PATH },
  openGraph: {
    type: "website",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_PATH,
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
};

export default function DosageMatcherPage() {
  const siteUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const pageJsonLd = buildPageJsonLd(siteUrl);

  return (
    <>
      <section className="bg-[var(--color-bg)] px-4 pb-6 pt-12 sm:px-6 lg:px-8 lg:pb-8 lg:pt-16">
        <div className="mx-auto max-w-5xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
            {DOSAGE_MATCHER.hero.eyebrow}
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl">
            {DOSAGE_MATCHER.hero.title}
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-[var(--color-slate-800)]">
            {DOSAGE_MATCHER.hero.body}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-[var(--color-muted)]">
            <span>{DOSAGE_MATCHER.intro.timeEstimate}</span>
            <span aria-hidden="true">·</span>
            <span>{DOSAGE_MATCHER.intro.privacyNote}</span>
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-bg)] px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <DosageFormMatcher />
        </div>
      </section>

      <JsonLd id="dosage-matcher-page-jsonld" data={pageJsonLd} />
    </>
  );
}

function buildPageJsonLd(siteUrl: string) {
  const pageUrl = `${siteUrl}${PAGE_PATH}`;

  const webPage = {
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    isPartOf: { "@id": `${siteUrl}#website` },
    inLanguage: "en-CA",
    publisher: { "@id": `${siteUrl}#organization` },
    about: { "@id": `${siteUrl}#organization` },
  };

  const breadcrumb = {
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "AI tools",
        item: `${siteUrl}/ai`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: DOSAGE_MATCHER.hero.title,
        item: pageUrl,
      },
    ],
  };

  return jsonLdGraph([webPage, breadcrumb]);
}

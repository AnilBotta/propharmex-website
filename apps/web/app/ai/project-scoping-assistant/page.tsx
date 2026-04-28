/**
 * /ai/project-scoping-assistant — Project Scoping Assistant page.
 *
 * Prompt 19 PR-A: ships the conversational intake + structured-output engine
 * with a fully editable preview card. The Submit + Download actions on the
 * card are intentionally disabled here and wired in PR-B.
 *
 * RSC shell: hero copy + JSON-LD live in the server component; the chat
 * surface itself is a client component (`ScopingSurface`) because it owns
 * the AI SDK `useChat` hook + edit state.
 *
 * JSON-LD posture: the root layout already emits Organization + WebSite +
 * LocalBusiness × 2 via `buildSiteJsonLd`. This page only emits WebPage +
 * BreadcrumbList and references the existing #organization @id.
 */
import type { Metadata } from "next";

import { env, jsonLdGraph } from "@propharmex/lib";

import { JsonLd } from "../../../components/site/JsonLd";
import { ScopingSurface } from "../../../components/scoping/ScopingSurface";
import { SCOPING } from "../../../content/scoping";

export const revalidate = 300;

const PAGE_PATH = "/ai/project-scoping-assistant";
const PAGE_TITLE = `${SCOPING.hero.title} — Propharmex`;
const PAGE_DESCRIPTION = SCOPING.hero.body;

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

export default function ProjectScopingAssistantPage() {
  const siteUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const pageJsonLd = buildPageJsonLd(siteUrl);

  return (
    <>
      <section className="bg-[var(--color-bg)] px-4 pb-6 pt-12 sm:px-6 lg:px-8 lg:pb-8 lg:pt-16">
        <div className="mx-auto max-w-6xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
            {SCOPING.hero.eyebrow}
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl">
            {SCOPING.hero.title}
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--color-slate-800)]">
            {SCOPING.hero.body}
          </p>
        </div>
      </section>

      <section className="bg-[var(--color-bg)] px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <ScopingSurface />
        </div>
      </section>

      <JsonLd id="scoping-page-jsonld" data={pageJsonLd} />
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
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${siteUrl}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "AI tools",
        item: `${siteUrl}/ai`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: SCOPING.hero.title,
        item: pageUrl,
      },
    ],
  };

  return jsonLdGraph([webPage, breadcrumb]);
}

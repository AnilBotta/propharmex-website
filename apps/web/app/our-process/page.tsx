/**
 * /our-process — Engagement model.
 *
 * Prompt 16 deliverable. Content lives in apps/web/content/process.ts and
 * will migrate to a Sanity processPhase collection at Prompt 22.
 *
 * - RSC page shell.
 * - ISR 300s.
 * - ProcessTimeline is the universal vertical layout that works on every
 *   viewport. The desktop horizontal scroll-pinned stepper (commit 3
 *   of this PR) layers on top for lg+ widths and the timeline becomes
 *   the responsive fallback / reduced-motion fallback.
 * - Emits HowTo + WebPage + BreadcrumbList JSON-LD referencing the root
 *   layout's Organization + WebSite @ids. HowTo with `tool`, `step`, and
 *   `timeRequired` per step is the closest schema.org fit for a defined
 *   engagement journey.
 */
import type { Metadata } from "next";

import { env, jsonLdGraph } from "@propharmex/lib";

import { JsonLd } from "../../components/site/JsonLd";
import { ProcessClosing } from "../../components/process/ProcessClosing";
import { ProcessHero } from "../../components/process/ProcessHero";
import { ProcessHorizontalStepper } from "../../components/process/ProcessHorizontalStepper";
import { ProcessTimeline } from "../../components/process/ProcessTimeline";
import { PROCESS } from "../../content/process";

export const revalidate = 300;

const PAGE_PATH = "/our-process";

export const metadata: Metadata = {
  title: { absolute: PROCESS.metaTitle },
  description: PROCESS.metaDescription,
  alternates: { canonical: PAGE_PATH },
  openGraph: {
    type: "website",
    title: PROCESS.ogTitle,
    description: PROCESS.ogDescription,
    url: PAGE_PATH,
  },
  twitter: {
    card: "summary_large_image",
    title: PROCESS.ogTitle,
    description: PROCESS.ogDescription,
  },
};

export default function OurProcessPage() {
  const siteUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const pageJsonLd = buildJsonLd(siteUrl);

  return (
    <>
      <ProcessHero content={PROCESS.hero} />
      {/* Vertical timeline — universal mobile/tablet layout, hidden on lg+. */}
      <ProcessTimeline phases={PROCESS.phases} className="lg:hidden" />
      {/* Horizontal scroll-pinned stepper — desktop only (lg+). Falls back to
          a horizontally-scrollable list under prefers-reduced-motion. */}
      <ProcessHorizontalStepper
        phases={PROCESS.phases}
        className="hidden lg:block"
      />
      <ProcessClosing content={PROCESS.closing} />

      <JsonLd id="proc-page-jsonld" data={pageJsonLd} />
    </>
  );
}

/**
 * Build the page-level JSON-LD graph:
 *
 *  - HowTo — six engagement phases as ordered steps. Each step has a name,
 *    description (the phase summary), and a `timeRequired` field reading
 *    the phase's typical timeline. schema.org `HowTo` is the closest
 *    pattern for a defined journey with discrete phases; AI answer
 *    engines (Perplexity, ChatGPT) read this format well for "how does
 *    [vendor] engage with clients?" queries.
 *  - WebPage — `about` the HowTo, `isPartOf` the WebSite.
 *  - BreadcrumbList — Home → Our process.
 */
function buildJsonLd(siteUrl: string) {
  const pageUrl = `${siteUrl}${PAGE_PATH}`;

  const howTo = {
    "@type": "HowTo",
    "@id": `${pageUrl}#howto`,
    name: "How Propharmex engages with clients",
    description: PROCESS.metaDescription,
    inLanguage: "en-CA",
    publisher: { "@id": `${siteUrl}#organization` },
    step: PROCESS.phases.map((phase, idx) => ({
      "@type": "HowToStep",
      position: idx + 1,
      name: phase.title,
      url: `${pageUrl}#phase-${phase.id}`,
      text: phase.summary,
    })),
  };

  const webpage = {
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: PROCESS.metaTitle,
    description: PROCESS.metaDescription,
    isPartOf: { "@id": `${siteUrl}#website` },
    about: { "@id": `${pageUrl}#howto` },
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
        name: "Our process",
        item: pageUrl,
      },
    ],
  };

  return jsonLdGraph([howTo, webpage, breadcrumb]);
}

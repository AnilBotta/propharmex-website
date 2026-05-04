/**
 * /dosage-forms — Dosage Forms index hub.
 *
 * PR-E' deliverable. Surfaces all seven dosage forms in one place, with
 * cards linking into the existing leaf pages under
 * /services/pharmaceutical-development/[slug]. The Solid oral leaf is live;
 * the other six are placeholders served by the same dynamic route.
 *
 * - RSC page. ISR 300s.
 * - Reuses <HubHero>, <CapabilityMatrix>, and <HubClosing> from
 *   apps/web/components/pharmdev/ via structural type aliases. No new
 *   components introduced; cross-namespace import noted as a future
 *   cleanup (move shared hub primitives into components/site/hub/).
 * - Emits CollectionPage + ItemList(7) + BreadcrumbList JSON-LD; explicit
 *   canonical so search engines do not see the hub as a duplicate of
 *   /services/pharmaceutical-development.
 */
import type { Metadata } from "next";

import { env, jsonLdGraph } from "@propharmex/lib";

import { CapabilityMatrix } from "../../components/site/hub/CapabilityMatrix";
import { HubClosing } from "../../components/site/hub/HubClosing";
import { HubHero } from "../../components/site/hub/HubHero";
import { JsonLd } from "../../components/site/JsonLd";
import { DOSAGE_FORMS_HUB } from "../../content/dosage-forms-hub";

export const revalidate = 300;

const HUB_PATH = "/dosage-forms";

export const metadata: Metadata = {
  title: { absolute: DOSAGE_FORMS_HUB.metaTitle },
  description: DOSAGE_FORMS_HUB.metaDescription,
  alternates: { canonical: HUB_PATH },
  openGraph: {
    type: "website",
    title: DOSAGE_FORMS_HUB.ogTitle,
    description: DOSAGE_FORMS_HUB.ogDescription,
    url: HUB_PATH,
  },
  twitter: {
    card: "summary_large_image",
    title: DOSAGE_FORMS_HUB.ogTitle,
    description: DOSAGE_FORMS_HUB.ogDescription,
  },
};

export default function DosageFormsHubPage() {
  const siteUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const pageJsonLd = buildHubJsonLd(siteUrl);

  return (
    <>
      <HubHero content={DOSAGE_FORMS_HUB.hero} />
      <CapabilityMatrix content={DOSAGE_FORMS_HUB.grid} />
      <HubClosing content={DOSAGE_FORMS_HUB.closing} />

      <JsonLd id="df-hub-jsonld" data={pageJsonLd} />
    </>
  );
}

function buildHubJsonLd(siteUrl: string) {
  const pageUrl = `${siteUrl}${HUB_PATH}`;

  const collectionPage = {
    "@type": "CollectionPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: DOSAGE_FORMS_HUB.metaTitle,
    description: DOSAGE_FORMS_HUB.metaDescription,
    isPartOf: { "@id": `${siteUrl}#website` },
    inLanguage: "en-CA",
  };

  const itemList = {
    "@type": "ItemList",
    "@id": `${pageUrl}#itemlist`,
    itemListElement: DOSAGE_FORMS_HUB.grid.forms.map((form, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: form.label,
      url: `${siteUrl}/services/pharmaceutical-development/${form.slug}`,
    })),
  };

  const breadcrumb = {
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Dosage Forms",
        item: pageUrl,
      },
    ],
  };

  return jsonLdGraph([collectionPage, itemList, breadcrumb]);
}

import type { Metadata } from "next";

import { env, jsonLdGraph } from "@propharmex/lib";

import { OperationalDepth } from "../components/home/OperationalDepth";
import { ContactMini } from "../components/home/ContactMini";
import { DelBanner } from "../components/home/DelBanner";
import { Hero } from "../components/home/Hero";
import { Industries } from "../components/home/Industries";
import { Insights } from "../components/home/Insights";
import { JsonLd } from "../components/site/JsonLd";
import { Leadership } from "../components/home/Leadership";
import { MatcherTeaser } from "../components/home/MatcherTeaser";
import { Process } from "../components/home/Process";
import { Proof } from "../components/home/Proof";
import { RegulatoryChips } from "../components/home/RegulatoryChips";
import { TrustStrip } from "../components/home/TrustStrip";
import { WhatWeDo } from "../components/home/WhatWeDo";
import { WhyPillars } from "../components/home/WhyPillars";
import { HOME } from "../content/home";

// ISR per architecture.md caching policy for the Home surface.
export const revalidate = 300;

export const metadata: Metadata = {
  title: { absolute: HOME.metaTitle },
  description: HOME.metaDescription,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title: HOME.ogTitle,
    description: HOME.ogDescription,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: HOME.ogTitle,
    description: HOME.ogDescription,
  },
};

export default async function HomePage() {
  const siteUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const pageJsonLd = buildHomeJsonLd(siteUrl);

  return (
    <>
      <Hero content={HOME.hero} />
      <TrustStrip content={HOME.trust} />
      <WhyPillars content={HOME.why} />
      <WhatWeDo content={HOME.whatWeDo} />
      <OperationalDepth content={HOME.operationalDepth} />
      <MatcherTeaser content={HOME.matcher} />
      <Proof content={HOME.proof} />
      <Process content={HOME.process} />
      <Industries content={HOME.industries} />
      <Leadership content={HOME.leadership} />
      <Insights content={HOME.insights} />
      <DelBanner content={HOME.delBanner} />
      <ContactMini content={HOME.contact} />
      <RegulatoryChips content={HOME.regulatory} />
      <JsonLd id="home-jsonld" data={pageJsonLd} />
    </>
  );
}

function buildHomeJsonLd(siteUrl: string) {
  const webPage = {
    "@type": "WebPage",
    "@id": `${siteUrl}/#webpage-home`,
    url: `${siteUrl}/`,
    name: HOME.metaTitle,
    description: HOME.metaDescription,
    isPartOf: { "@id": `${siteUrl}#website` },
    about: { "@id": `${siteUrl}#organization` },
    inLanguage: "en-CA",
  };

  const breadcrumb = {
    "@type": "BreadcrumbList",
    "@id": `${siteUrl}/#breadcrumb-home`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${siteUrl}/`,
      },
    ],
  };

  return jsonLdGraph([webPage, breadcrumb]);
}

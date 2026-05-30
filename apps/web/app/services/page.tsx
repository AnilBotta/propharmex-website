import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, ClipboardCheck, FileSearch, Microscope, Network } from "lucide-react";

import { Button } from "@propharmex/ui";
import { env, jsonLdGraph } from "@propharmex/lib";

import { JsonLd } from "../../components/site/JsonLd";
import { ScientificPathwayVisual } from "../../components/visuals/ScientificPathwayVisual";
import { SERVICES_OVERVIEW } from "../../content/services-overview";

export const revalidate = 300;

const PAGE_PATH = "/services";

export const metadata: Metadata = {
  title: { absolute: SERVICES_OVERVIEW.metaTitle },
  description: SERVICES_OVERVIEW.metaDescription,
  alternates: { canonical: PAGE_PATH },
  openGraph: {
    type: "website",
    title: SERVICES_OVERVIEW.metaTitle,
    description: SERVICES_OVERVIEW.metaDescription,
    url: PAGE_PATH,
  },
  twitter: {
    card: "summary_large_image",
    title: SERVICES_OVERVIEW.metaTitle,
    description: SERVICES_OVERVIEW.metaDescription,
  },
};

const SERVICE_ICON = {
  analytical: Microscope,
  regulatory: FileSearch,
  development: Network,
  clinical: ClipboardCheck,
} as const;

export default function ServicesPage() {
  const siteUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const pageJsonLd = buildServicesJsonLd(siteUrl);

  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="absolute inset-0 -z-10 opacity-70" aria-hidden="true">
          <div className="absolute left-1/2 top-8 h-64 w-[42rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,var(--color-blue-100),transparent_65%)]" />
          <div className="absolute right-8 top-24 h-56 w-56 rounded-full bg-[radial-gradient(circle,var(--color-green-100),transparent_68%)]" />
        </div>
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
              {SERVICES_OVERVIEW.hero.eyebrow}
            </p>
            <h1 className="mt-3 max-w-4xl font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-5xl">
              {SERVICES_OVERVIEW.hero.headline}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--color-slate-800)] sm:text-lg">
              {SERVICES_OVERVIEW.hero.lede}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href={SERVICES_OVERVIEW.hero.primaryCta.href}>
                  {SERVICES_OVERVIEW.hero.primaryCta.label}
                  <ArrowUpRight aria-hidden="true" size={18} />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href={SERVICES_OVERVIEW.hero.secondaryCta.href}>
                  {SERVICES_OVERVIEW.hero.secondaryCta.label}
                </Link>
              </Button>
            </div>
          </div>

          <ScientificPathwayVisual
            eyebrow="Molecule to scope"
            heading="A connected path from product uncertainty to a reviewed workstream."
            nodes={SERVICES_OVERVIEW.services.map((service) => ({
              label: service.title,
              detail: service.label,
            }))}
            summaryLabel="First useful output"
            summary="A qualified brief that gives the sponsor and Propharmex the same starting point before any scope is confirmed."
          />
        </div>
      </section>

      <section className="bg-[var(--color-slate-50)] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-5 md:grid-cols-2">
            {SERVICES_OVERVIEW.services.map((service) => {
              const Icon = SERVICE_ICON[service.id];
              return (
                <Link
                  key={service.id}
                  href={service.href}
                  className="group flex min-h-[280px] flex-col rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-sm)] transition hover:-translate-y-0.5 hover:border-[var(--color-primary-600)] hover:shadow-[var(--shadow-md)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="rounded-[var(--radius-full)] bg-[var(--color-primary-50)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--color-primary-700)]">
                      {service.label}
                    </span>
                    <span className="grid size-11 place-items-center rounded-[var(--radius-md)] bg-[var(--color-slate-50)] text-[var(--color-primary-700)]">
                      <Icon aria-hidden="true" size={21} />
                    </span>
                  </div>
                  <h2 className="mt-6 font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-[var(--color-fg)]">
                    {service.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--color-slate-800)]">
                    {service.body}
                  </p>
                  <p className="mt-5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] p-4 text-sm leading-relaxed text-[var(--color-slate-800)]">
                    {service.proof}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-medium text-[var(--color-primary-700)]">
                    {service.ctaLabel}
                    <ArrowUpRight
                      aria-hidden="true"
                      size={16}
                      className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-bg)] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
              {SERVICES_OVERVIEW.operatingModel.eyebrow}
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl">
              {SERVICES_OVERVIEW.operatingModel.heading}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[var(--color-slate-800)]">
              {SERVICES_OVERVIEW.operatingModel.lede}
            </p>
          </div>
          <div className="grid gap-4">
            {SERVICES_OVERVIEW.operatingModel.points.map((point, index) => (
              <div
                key={point.label}
                className="grid gap-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:grid-cols-[auto_1fr]"
              >
                <span className="grid size-11 place-items-center rounded-[var(--radius-full)] bg-[var(--color-primary-50)] font-[family-name:var(--font-mono)] text-sm font-semibold text-[var(--color-primary-700)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--color-fg)]">
                    {point.label}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--color-slate-800)]">
                    {point.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-primary-900)] px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/70">
              {SERVICES_OVERVIEW.closing.eyebrow}
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight sm:text-4xl">
              {SERVICES_OVERVIEW.closing.heading}
            </h2>
            <p className="text-white/78 mt-4 text-base leading-relaxed">
              {SERVICES_OVERVIEW.closing.body}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="bg-white text-[var(--color-primary-900)] hover:bg-[var(--color-slate-100)]"
            >
              <Link href={SERVICES_OVERVIEW.closing.primaryCta.href}>
                {SERVICES_OVERVIEW.closing.primaryCta.label}
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white/10"
            >
              <Link href={SERVICES_OVERVIEW.closing.secondaryCta.href}>
                {SERVICES_OVERVIEW.closing.secondaryCta.label}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <JsonLd id="services-overview-jsonld" data={pageJsonLd} />
    </>
  );
}

function buildServicesJsonLd(siteUrl: string) {
  const pageUrl = `${siteUrl}${PAGE_PATH}`;
  const collectionPage = {
    "@type": "CollectionPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: SERVICES_OVERVIEW.metaTitle,
    description: SERVICES_OVERVIEW.metaDescription,
    isPartOf: { "@id": `${siteUrl}#website` },
    inLanguage: "en-CA",
    publisher: { "@id": `${siteUrl}#organization` },
  };
  const itemList = {
    "@type": "ItemList",
    "@id": `${pageUrl}#services`,
    itemListElement: SERVICES_OVERVIEW.services.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: service.title,
      url: `${siteUrl}${service.href}`,
    })),
  };
  const breadcrumb = {
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
      { "@type": "ListItem", position: 2, name: "Services", item: pageUrl },
    ],
  };
  return jsonLdGraph([collectionPage, itemList, breadcrumb]);
}

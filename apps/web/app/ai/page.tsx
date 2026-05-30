import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, ClipboardList, FileCheck2, MessageSquareText, Pill } from "lucide-react";

import { Button } from "@propharmex/ui";
import { env, jsonLdGraph } from "@propharmex/lib";

import { JsonLd } from "../../components/site/JsonLd";
import { ScientificPathwayVisual } from "../../components/visuals/ScientificPathwayVisual";
import { AI_TOOLS } from "../../content/ai-tools";

export const revalidate = 300;

const PAGE_PATH = "/ai";

export const metadata: Metadata = {
  title: { absolute: AI_TOOLS.metaTitle },
  description: AI_TOOLS.metaDescription,
  alternates: { canonical: PAGE_PATH },
  openGraph: {
    type: "website",
    title: AI_TOOLS.metaTitle,
    description: AI_TOOLS.metaDescription,
    url: PAGE_PATH,
  },
  twitter: {
    card: "summary_large_image",
    title: AI_TOOLS.metaTitle,
    description: AI_TOOLS.metaDescription,
  },
};

const ICON = {
  scoping: ClipboardList,
  dosage: Pill,
  readiness: FileCheck2,
  concierge: MessageSquareText,
} as const;

export default function AiToolsPage() {
  const siteUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const pageJsonLd = buildAiToolsJsonLd(siteUrl);

  return (
    <>
      <section className="relative isolate overflow-hidden bg-[var(--color-bg)] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <div className="absolute left-[8%] top-10 h-72 w-72 rounded-full bg-[radial-gradient(circle,var(--color-blue-100),transparent_68%)]" />
          <div className="absolute right-[10%] top-20 h-80 w-80 rounded-full bg-[radial-gradient(circle,var(--color-green-100),transparent_70%)]" />
        </div>
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.85fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
              {AI_TOOLS.hero.eyebrow}
            </p>
            <h1 className="mt-3 max-w-4xl font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-5xl">
              {AI_TOOLS.hero.headline}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--color-slate-800)] sm:text-lg">
              {AI_TOOLS.hero.lede}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href={AI_TOOLS.hero.primaryCta.href}>
                  {AI_TOOLS.hero.primaryCta.label}
                  <ArrowUpRight aria-hidden="true" size={18} />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href={AI_TOOLS.hero.secondaryCta.href}>
                  {AI_TOOLS.hero.secondaryCta.label}
                </Link>
              </Button>
            </div>
          </div>
          <ScientificPathwayVisual
            eyebrow="Tool-led intake"
            heading="Better context before the first call."
            nodes={AI_TOOLS.tools.map((tool) => ({
              label: tool.title,
              detail: tool.eyebrow,
            }))}
            summaryLabel={AI_TOOLS.workflow.heading}
            summary={AI_TOOLS.workflow.lede}
            tone="ai"
          />
        </div>
      </section>

      <section className="bg-[var(--color-slate-50)] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-5 md:grid-cols-2">
            {AI_TOOLS.tools.map((tool) => {
              const ToolIcon = ICON[tool.id];
              return (
                <Link
                  key={tool.id}
                  href={tool.href}
                  className="group flex min-h-[320px] flex-col rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-sm)] transition hover:-translate-y-0.5 hover:border-[var(--color-primary-600)] hover:shadow-[var(--shadow-md)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--color-primary-700)]">
                        {tool.eyebrow}
                      </p>
                      <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-[var(--color-fg)]">
                        {tool.title}
                      </h2>
                    </div>
                    <span className="grid size-11 place-items-center rounded-[var(--radius-md)] bg-[var(--color-primary-50)] text-[var(--color-primary-700)]">
                      <ToolIcon aria-hidden="true" size={21} />
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-[var(--color-slate-800)]">
                    {tool.body}
                  </p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {tool.goodFor.map((item) => (
                      <li
                        key={item}
                        className="rounded-[var(--radius-full)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-1 text-xs text-[var(--color-slate-800)]"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-medium text-[var(--color-primary-700)]">
                    {tool.ctaLabel}
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
          <p className="mt-8 max-w-3xl text-xs leading-relaxed text-[var(--color-muted)]">
            {AI_TOOLS.disclaimer}
          </p>
        </div>
      </section>

      <JsonLd id="ai-tools-jsonld" data={pageJsonLd} />
    </>
  );
}

function buildAiToolsJsonLd(siteUrl: string) {
  const pageUrl = `${siteUrl}${PAGE_PATH}`;
  const webPage = {
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: AI_TOOLS.metaTitle,
    description: AI_TOOLS.metaDescription,
    isPartOf: { "@id": `${siteUrl}#website` },
    inLanguage: "en-CA",
    publisher: { "@id": `${siteUrl}#organization` },
  };
  const itemList = {
    "@type": "ItemList",
    "@id": `${pageUrl}#tools`,
    itemListElement: AI_TOOLS.tools.map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: tool.title,
      url: `${siteUrl}${tool.href}`,
    })),
  };
  const breadcrumb = {
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
      { "@type": "ListItem", position: 2, name: "AI tools", item: pageUrl },
    ],
  };
  return jsonLdGraph([webPage, itemList, breadcrumb]);
}

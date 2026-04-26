/**
 * IndustryMatrix — /industries hub 5-industry grid, RSC.
 *
 * Live cards wrap in a Link; shipping-next cards render as a muted disabled
 * affordance so no stale internal links exist. The flagship card carries a
 * "Flagship" pill — generic-manufacturers is the cleanest fit for the
 * Canada-anchored two-hub operating model.
 */
import type { FC } from "react";
import Link from "next/link";
import { ArrowUpRight, Clock, Star } from "lucide-react";

import type {
  IndustryMatrix as IndustryMatrixContent,
  IndustrySummary,
} from "../../content/industries";

import { SectionReveal } from "./SectionReveal";

const HUB_PATH = "/industries";

type Props = { content: IndustryMatrixContent };

export const IndustryMatrix: FC<Props> = ({ content }) => {
  return (
    <section
      id="industries"
      aria-labelledby="ind-hub-matrix-heading"
      className="scroll-mt-24 border-b border-[var(--color-border)] bg-[var(--color-slate-50)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
            {content.eyebrow}
          </p>
          <h2
            id="ind-hub-matrix-heading"
            className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl"
          >
            {content.heading}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[var(--color-slate-800)]">
            {content.lede}
          </p>
        </header>

        <SectionReveal className="mt-12">
          <ul
            className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
            aria-label="Industries served"
          >
            {content.industries.map((industry) => (
              <li key={industry.slug} className="list-none">
                <IndustryCard
                  industry={industry}
                  liveCopy={content.liveCopy}
                  shippingNextCopy={content.shippingNextCopy}
                  flagshipCopy={content.flagshipCopy}
                />
              </li>
            ))}
          </ul>
        </SectionReveal>
      </div>
    </section>
  );
};

function IndustryCard({
  industry,
  liveCopy,
  shippingNextCopy,
  flagshipCopy,
}: {
  industry: IndustrySummary;
  liveCopy: string;
  shippingNextCopy: string;
  flagshipCopy: string;
}) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          {industry.flagship ? (
            <span
              className="inline-flex items-center gap-1 self-start rounded-[var(--radius-full)] border border-[var(--color-primary-600)] bg-[var(--color-primary-50)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--color-primary-700)]"
              title={flagshipCopy}
            >
              <Star aria-hidden="true" size={11} />
              Flagship
            </span>
          ) : null}
          <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-[var(--color-fg)]">
            {industry.label}
          </h3>
        </div>
        {industry.leafStatus === "live" ? (
          <ArrowUpRight
            aria-hidden="true"
            size={16}
            className="mt-1 text-[var(--color-muted)] transition group-hover:text-[var(--color-primary-700)]"
          />
        ) : (
          <Clock
            aria-hidden="true"
            size={16}
            className="mt-1 text-[var(--color-muted)]"
          />
        )}
      </div>
      <p className="mt-2 text-sm leading-relaxed text-[var(--color-slate-800)]">
        {industry.blurb}
      </p>
      <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Highlights">
        {industry.highlights.map((highlight) => (
          <li
            key={highlight}
            className="inline-flex items-center rounded-[var(--radius-full)] border border-[var(--color-border)] bg-[var(--color-slate-50)] px-2 py-0.5 text-[11px] font-medium text-[var(--color-slate-800)]"
          >
            {highlight}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-muted)]">
        {industry.leafStatus === "live" ? liveCopy : shippingNextCopy}
      </p>
    </>
  );

  const flagshipBorder = industry.flagship
    ? "border-[var(--color-primary-600)]"
    : "border-[var(--color-border)]";

  if (industry.leafStatus === "live") {
    return (
      <Link
        href={`${HUB_PATH}/${industry.slug}`}
        className={`group flex h-full flex-col rounded-[var(--radius-lg)] border ${flagshipBorder} bg-[var(--color-surface)] p-5 transition hover:-translate-y-0.5 hover:border-[var(--color-primary-600)] hover:shadow-[var(--shadow-sm)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] motion-reduce:hover:translate-y-0 motion-reduce:transition-none`}
      >
        {body}
      </Link>
    );
  }

  return (
    <div
      aria-disabled="true"
      className="flex h-full flex-col rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-5 opacity-70"
    >
      {body}
    </div>
  );
}

/**
 * MetricHero — /case-studies/[slug] hero, RSC.
 *
 * Outcome-metric hero: eyebrow + headline + hero lede on the left,
 * oversized metric value + label on the right. LCP-safe — metric is
 * a static string literal from the content dictionary.
 */
import type { FC } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import type {
  CaseStudyClient,
  CaseStudyMetric,
} from "../../content/case-studies";

type Props = {
  crumbLabel: string;
  label: string;
  heroLede: string;
  metric: CaseStudyMetric;
  client: CaseStudyClient;
};

export const MetricHero: FC<Props> = ({
  crumbLabel,
  label,
  heroLede,
  metric,
  client,
}) => {
  return (
    <section
      aria-labelledby="cs-detail-hero-heading"
      className="border-b border-[var(--color-border)] bg-[var(--color-bg)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]">
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-1 transition hover:text-[var(--color-primary-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
          >
            <ChevronLeft size={12} aria-hidden="true" />
            Case studies
          </Link>
          <span aria-hidden="true" className="mx-2">
            /
          </span>
          <span className="text-[var(--color-slate-800)]">{crumbLabel}</span>
        </p>

        <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)] lg:items-start">
          <div>
            <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
              Case study
            </p>
            <h1
              id="cs-detail-hero-heading"
              className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl lg:text-[clamp(2rem,3.4vw,3rem)] lg:leading-[1.05]"
            >
              {label}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--color-slate-800)]">
              {heroLede}
            </p>
            <p className="mt-6 text-sm text-[var(--color-slate-800)]">
              <span className="font-semibold text-[var(--color-fg)]">
                Client:
              </span>{" "}
              {client.descriptor}.{" "}
              <span className="text-[var(--color-muted)]">
                {client.availabilityNote}
              </span>
            </p>
          </div>

          <aside
            aria-label="Outcome metric"
            className="rounded-[var(--radius-lg)] border border-[var(--color-primary-600)] bg-[var(--color-primary-50)] p-6"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
              Outcome
            </p>
            <p className="mt-3 font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-5xl">
              {metric.value}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-slate-800)]">
              {metric.label}
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
};

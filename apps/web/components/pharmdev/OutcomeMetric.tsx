/**
 * OutcomeMetric — leaf outcome-pattern block, RSC.
 *
 * Three-card programme-level outcome strip. Status line renders an
 * `under-confirmation` affordance — named case studies replace this block's
 * copy with permission-cleared client outcomes in Prompt 14.
 */
import type { FC } from "react";
import { FileText } from "lucide-react";

import type { DosageFormOutcome } from "../../content/pharmaceutical-development";

import { SectionReveal } from "./SectionReveal";

type Props = { content: DosageFormOutcome };

export const OutcomeMetric: FC<Props> = ({ content }) => {
  return (
    <section
      id="outcome"
      aria-labelledby="pd-leaf-outcome-heading"
      className="scroll-mt-24 border-b border-[var(--color-border)] bg-[var(--color-bg)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
            {content.eyebrow}
          </p>
          <h2
            id="pd-leaf-outcome-heading"
            className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl"
          >
            {content.heading}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[var(--color-slate-800)]">
            {content.lede}
          </p>
        </header>

        <SectionReveal className="mt-12">
          {/*
           * axe (definition-list rule) requires <div> children of <dl>
           * to contain ONLY a dt/dd pair — no sibling <p> or <span>.
           * The card has three pieces (label / value / context); to
           * preserve the dl semantics we nest both the value AND the
           * context paragraph inside <dd>, with the dd acting as a
           * block container rather than a single inline value.
           */}
          <dl
            className="grid grid-cols-1 gap-4 md:grid-cols-3"
            aria-label="Outcome pattern metrics"
          >
            {content.metrics.map((metric) => (
              <div
                key={metric.id}
                className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
              >
                <dt className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-muted)]">
                  {metric.label}
                </dt>
                <dd className="mt-2">
                  <span className="block font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--color-fg)]">
                    {metric.value}
                  </span>
                  <span className="mt-2 block text-sm leading-relaxed text-[var(--color-slate-800)]">
                    {metric.context}
                  </span>
                </dd>
              </div>
            ))}
          </dl>

          <p className="mt-6 inline-flex items-center gap-2 rounded-[var(--radius-full)] border border-[var(--color-border)] bg-[var(--color-slate-50)] px-3 py-1 text-[11px] font-medium text-[var(--color-muted)]">
            <FileText size={12} aria-hidden="true" />
            {content.statusCopy}
          </p>
        </SectionReveal>
      </div>
    </section>
  );
};

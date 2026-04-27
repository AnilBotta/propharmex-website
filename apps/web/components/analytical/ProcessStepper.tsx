/**
 * ProcessStepper — analytical leaf vertical process stepper, RSC.
 *
 * Numbered steps with per-step technical notes. Stages are executed by
 * Propharmex; site-of-execution is not surfaced on service pages
 * (see docs/positioning-canadian-anchor.md §5).
 */
import type { FC } from "react";

import type { AnalyticalProcess } from "../../content/analytical-services";

import { SectionReveal } from "./SectionReveal";

type Props = { content: AnalyticalProcess };

export const ProcessStepper: FC<Props> = ({ content }) => {
  return (
    <section
      id="process"
      aria-labelledby="as-leaf-process-heading"
      className="scroll-mt-24 border-b border-[var(--color-border)] bg-[var(--color-bg)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
            {content.eyebrow}
          </p>
          <h2
            id="as-leaf-process-heading"
            className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl"
          >
            {content.heading}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[var(--color-slate-800)]">
            {content.lede}
          </p>
        </header>

        <SectionReveal className="mt-12">
          <ol className="flex flex-col gap-4" aria-label="Process steps">
            {content.steps.map((step, idx) => (
              <li key={step.id} className="list-none">
                <article className="grid grid-cols-[auto_1fr] gap-5 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 md:p-6">
                  <span
                    aria-hidden="true"
                    className="grid size-10 shrink-0 place-items-center rounded-[var(--radius-full)] border border-[var(--color-primary-600)] bg-[var(--color-primary-50)] font-[family-name:var(--font-display)] text-sm font-semibold text-[var(--color-primary-700)]"
                  >
                    {idx + 1}
                  </span>
                  <div className="flex flex-col gap-3">
                    <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-[var(--color-fg)]">
                      {step.label}
                    </h3>
                    <p className="text-sm leading-relaxed text-[var(--color-slate-800)]">
                      {step.description}
                    </p>
                    <ul className="flex flex-wrap gap-1.5" aria-label="Step notes">
                      {step.notes.map((note) => (
                        <li
                          key={note}
                          className="inline-flex items-center rounded-[var(--radius-full)] border border-[var(--color-border)] bg-[var(--color-slate-50)] px-2 py-0.5 text-[11px] font-medium text-[var(--color-slate-800)]"
                        >
                          {note}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </li>
            ))}
          </ol>
        </SectionReveal>
      </div>
    </section>
  );
};

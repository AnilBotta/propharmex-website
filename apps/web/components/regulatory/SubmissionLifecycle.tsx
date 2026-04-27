/**
 * SubmissionLifecycle — regulatory-services hub 5-stage submission lifecycle, RSC.
 *
 * strategy → dossier → submission → inspection → lifecycle. Stages are executed
 * by Propharmex; site-of-execution is not surfaced on service pages
 * (see docs/positioning-canadian-anchor.md §5).
 */
import type { FC } from "react";

import type { SubmissionLifecycle as LifecycleContent } from "../../content/regulatory-services";

import { SectionReveal } from "./SectionReveal";

type Props = { content: LifecycleContent };

export const SubmissionLifecycle: FC<Props> = ({ content }) => {
  return (
    <section
      id="lifecycle"
      aria-labelledby="rs-hub-lifecycle-heading"
      className="scroll-mt-24 border-b border-[var(--color-border)] bg-[var(--color-slate-50)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
            {content.eyebrow}
          </p>
          <h2
            id="rs-hub-lifecycle-heading"
            className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl"
          >
            {content.heading}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[var(--color-slate-800)]">
            {content.lede}
          </p>
        </header>

        <SectionReveal className="mt-12">
          <ol
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5"
            aria-label="Submission lifecycle stages"
          >
            {content.stages.map((stage, idx) => (
              <li key={stage.id} className="list-none">
                <article className="flex h-full flex-col gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
                  <div className="flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="grid size-8 shrink-0 place-items-center rounded-[var(--radius-full)] border border-[var(--color-primary-600)] bg-[var(--color-primary-50)] font-[family-name:var(--font-display)] text-xs font-semibold text-[var(--color-primary-700)]"
                    >
                      {idx + 1}
                    </span>
                    <span className="font-[family-name:var(--font-display)] text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]">
                      Stage {idx + 1}
                    </span>
                  </div>
                  <h3 className="font-[family-name:var(--font-display)] text-base font-semibold tracking-tight text-[var(--color-fg)]">
                    {stage.label}
                  </h3>
                  <p className="text-sm leading-relaxed text-[var(--color-slate-800)]">
                    {stage.description}
                  </p>
                </article>
              </li>
            ))}
          </ol>

          <p className="mt-6 max-w-3xl text-xs leading-relaxed text-[var(--color-muted)]">
            {content.handoffNote}
          </p>
        </SectionReveal>
      </div>
    </section>
  );
};

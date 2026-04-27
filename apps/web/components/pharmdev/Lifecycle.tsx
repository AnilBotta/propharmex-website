/**
 * Lifecycle — hub programme-lifecycle diagram, RSC.
 *
 * Four-stage stepper rendered horizontally on lg+ viewports and as a vertical
 * list below. Stages are executed by Propharmex under a single QMS;
 * site-of-execution is not surfaced on service pages
 * (see docs/positioning-canadian-anchor.md §5).
 */
import type { FC } from "react";
import { ArrowRight } from "lucide-react";

import type { PharmDevLifecycle } from "../../content/pharmaceutical-development";

import { SectionReveal } from "./SectionReveal";

type Props = { content: PharmDevLifecycle };

export const Lifecycle: FC<Props> = ({ content }) => {
  return (
    <section
      id="lifecycle"
      aria-labelledby="pd-hub-lifecycle-heading"
      className="scroll-mt-24 border-b border-[var(--color-border)] bg-[var(--color-slate-50)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
            {content.eyebrow}
          </p>
          <h2
            id="pd-hub-lifecycle-heading"
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
            className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-5"
            aria-label="Programme lifecycle stages"
          >
            {content.stages.map((stage, idx) => (
              <li key={stage.id} className="relative list-none">
                <article className="flex h-full flex-col gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
                  <span className="font-[family-name:var(--font-display)] text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]">
                    Stage {idx + 1}
                  </span>
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-[var(--color-fg)]">
                    {stage.label}
                  </h3>
                  <p className="text-sm leading-relaxed text-[var(--color-slate-800)]">
                    {stage.description}
                  </p>
                </article>
                {idx < content.stages.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none hidden lg:block absolute top-1/2 -right-3 z-10 -translate-y-1/2 text-[var(--color-muted)]"
                  >
                    <ArrowRight size={18} />
                  </span>
                ) : null}
              </li>
            ))}
          </ol>

          <p className="mt-6 text-sm leading-relaxed text-[var(--color-muted)]">
            {content.handoffNote}
          </p>
        </SectionReveal>
      </div>
    </section>
  );
};

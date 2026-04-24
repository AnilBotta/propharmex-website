/**
 * TimelineViz — engagement timeline, RSC.
 *
 * Ordered vertical timeline; each phase has a period label, title, and body.
 * Deliberately vertical at every breakpoint — easier to scan than a
 * horizontal stepper, reads well on mobile, renders predictably inside
 * Playwright screenshots and Lighthouse captures.
 */
import type { FC } from "react";

import type { CaseStudyTimeline } from "../../content/case-studies";

import { SectionReveal } from "./SectionReveal";

type Props = { content: CaseStudyTimeline };

export const TimelineViz: FC<Props> = ({ content }) => {
  return (
    <section
      id="timeline"
      aria-labelledby="cs-detail-timeline-heading"
      className="scroll-mt-24 border-b border-[var(--color-border)] bg-[var(--color-bg)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
            {content.eyebrow}
          </p>
          <h2
            id="cs-detail-timeline-heading"
            className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl"
          >
            {content.heading}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[var(--color-slate-800)]">
            {content.lede}
          </p>
        </header>

        <SectionReveal className="mt-12">
          <ol className="relative list-none space-y-6 border-l border-[var(--color-border)] pl-6">
            {content.phases.map((phase, idx) => (
              <li key={phase.id} className="relative">
                <span
                  aria-hidden="true"
                  className="absolute -left-[33px] top-1 inline-flex h-6 w-6 items-center justify-center rounded-[var(--radius-full)] border border-[var(--color-primary-600)] bg-[var(--color-surface)] text-[11px] font-semibold text-[var(--color-primary-700)]"
                >
                  {idx + 1}
                </span>
                <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-muted)]">
                    {phase.period}
                  </p>
                  <h3 className="mt-1 font-[family-name:var(--font-display)] text-base font-semibold tracking-tight text-[var(--color-fg)]">
                    {phase.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-slate-800)]">
                    {phase.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-sm font-medium text-[var(--color-fg)]">
            {content.closingNote}
          </p>
        </SectionReveal>
      </div>
    </section>
  );
};

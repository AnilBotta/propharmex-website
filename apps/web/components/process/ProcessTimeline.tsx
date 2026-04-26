/**
 * ProcessTimeline — /our-process vertical timeline, RSC.
 *
 * Universal layout: works on every viewport. The desktop horizontal scroll-
 * pinned stepper (commit 3) layers on top for lg+ widths via responsive
 * visibility classes; this timeline remains the canonical mobile/tablet
 * view and the reduced-motion fallback.
 *
 * Structure: a left-side gutter holds a vertical connector line and the
 * numbered phase markers; the right side carries the phase card with
 * summary + four content blocks (what happens, what we need, what you
 * receive, typical timeline).
 *
 * Each phase has a stable id (`phase-{id}`) so the desktop stepper (commit
 * 3) can deep-link via hash anchors without owning the scroll target.
 */
import type { FC } from "react";
import { Clock } from "lucide-react";

import type { ProcessPhase } from "../../content/process";

import { SectionReveal } from "./SectionReveal";

type Props = {
  phases: ProcessPhase[];
  /** Allow the parent page to hide on lg+ when the desktop stepper renders. */
  className?: string;
};

export const ProcessTimeline: FC<Props> = ({ phases, className }) => {
  return (
    <section
      id="phases"
      aria-labelledby="proc-timeline-heading"
      className={`scroll-mt-24 border-b border-[var(--color-border)] bg-[var(--color-slate-50)] py-20 sm:py-24 ${className ?? ""}`}
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
            The journey
          </p>
          <h2
            id="proc-timeline-heading"
            className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl"
          >
            Six phases, defined inputs and outputs
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[var(--color-slate-800)]">
            Inquiry through delivery. Each phase is bounded — you know what
            you are putting in, what you are getting back, and roughly how
            long the phase will take.
          </p>
        </header>

        <ol
          className="relative mt-12 space-y-12"
          aria-label="Engagement phases"
        >
          {/* Connector line — sits under the markers, hidden when there is no following phase. */}
          <span
            aria-hidden="true"
            className="absolute left-[19px] top-2 bottom-12 w-px bg-[var(--color-border)] sm:left-[27px]"
          />

          {phases.map((phase) => (
            <li
              key={phase.id}
              id={`phase-${phase.id}`}
              className="relative scroll-mt-24"
            >
              <SectionReveal>
                <PhaseCard phase={phase} />
              </SectionReveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

/* -------------------------------------------------------------------------- */
/*  Phase card                                                                */
/* -------------------------------------------------------------------------- */

function PhaseCard({ phase }: { phase: ProcessPhase }) {
  return (
    <article className="grid grid-cols-[40px_1fr] gap-x-5 gap-y-1 sm:grid-cols-[56px_1fr] sm:gap-x-6">
      {/* Marker — number badge */}
      <div className="row-span-2 flex flex-col items-center">
        <span
          aria-hidden="true"
          className="grid size-10 place-items-center rounded-[var(--radius-full)] border border-[var(--color-primary-600)] bg-[var(--color-bg)] font-[family-name:var(--font-display)] text-sm font-semibold text-[var(--color-primary-700)] sm:size-14 sm:text-base"
        >
          {phase.number}
        </span>
      </div>

      {/* Header */}
      <header>
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
          {phase.label}
        </p>
        <h3 className="mt-1 font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-2xl">
          {phase.title}
        </h3>
        <p className="mt-2 text-base leading-relaxed text-[var(--color-slate-800)]">
          {phase.summary}
        </p>
      </header>

      {/* Body */}
      <div className="mt-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6">
        <PhaseSection title="What happens">
          <p className="text-sm leading-relaxed text-[var(--color-slate-800)]">
            {phase.whatHappens}
          </p>
        </PhaseSection>

        <hr className="my-5 border-[var(--color-border)]" />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <PhaseSection title="What we need from you">
            <ul
              className="space-y-2 text-sm leading-relaxed text-[var(--color-slate-800)]"
              aria-label={`${phase.title} — what we need from you`}
            >
              {phase.whatWeNeed.map((item, i) => (
                <li key={i} className="flex gap-2">
                  <span
                    aria-hidden="true"
                    className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[var(--color-primary-600)]"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </PhaseSection>
          <PhaseSection title="What you receive">
            <ul
              className="space-y-2 text-sm leading-relaxed text-[var(--color-slate-800)]"
              aria-label={`${phase.title} — what you receive`}
            >
              {phase.whatYouReceive.map((item, i) => (
                <li key={i} className="flex gap-2">
                  <span
                    aria-hidden="true"
                    className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[var(--color-fg)]"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </PhaseSection>
        </div>

        <hr className="my-5 border-[var(--color-border)]" />

        <p className="inline-flex items-center gap-2 rounded-[var(--radius-full)] border border-[var(--color-border)] bg-[var(--color-slate-50)] px-3 py-1 text-xs font-medium text-[var(--color-slate-800)]">
          <Clock aria-hidden="true" size={12} />
          <span className="font-semibold uppercase tracking-[0.06em] text-[var(--color-muted)]">
            Typical:
          </span>
          {phase.typicalTimeline}
        </p>
      </div>
    </article>
  );
}

function PhaseSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-muted)]">
        {title}
      </p>
      <div className="mt-2">{children}</div>
    </div>
  );
}

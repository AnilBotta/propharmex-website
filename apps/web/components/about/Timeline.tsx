/**
 * Timeline — RSC.
 *
 * Ordered list of structural milestones. Each event renders as a row with a
 * year, a color-coded kind tag, the title, body, and an optional primary
 * source link. The SectionReveal wrapper applies a single staggered fade/rise
 * for the full list as it enters the viewport.
 *
 * A11y: the visible list uses <ol> so screen readers announce chronological
 * position; `aria-label` on the <ol> identifies the list's purpose.
 */
import type { FC } from "react";

import type {
  AboutTimeline,
  AboutTimelineEvent,
  TimelineKind,
} from "../../content/about";

import { SectionReveal } from "./SectionReveal";

type Props = { content: AboutTimeline };

const KIND_LABEL: Record<TimelineKind, string> = {
  founding: "Founding",
  regulatory: "Regulatory",
  expansion: "Expansion",
  program: "Program",
};

const KIND_STYLE: Record<TimelineKind, string> = {
  founding:
    "bg-[var(--color-primary-50)] text-[var(--color-primary-700)] border-[var(--color-primary-600)]/20",
  regulatory:
    "bg-[var(--color-surface)] text-[var(--color-fg)] border-[var(--color-fg)]/20",
  expansion:
    "bg-[var(--color-slate-50)] text-[var(--color-slate-800)] border-[var(--color-border)]",
  program:
    "bg-[var(--color-primary-50)] text-[var(--color-primary-700)] border-[var(--color-primary-600)]/20",
};

export const Timeline: FC<Props> = ({ content }) => {
  return (
    <section
      id="timeline"
      aria-labelledby="about-timeline-heading"
      className="scroll-mt-24 border-b border-[var(--color-border)] bg-[var(--color-bg)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
            {content.eyebrow}
          </p>
          <h2
            id="about-timeline-heading"
            className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl"
          >
            {content.heading}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--color-slate-800)]">
            {content.lede}
          </p>
        </header>

        <SectionReveal className="mt-12">
          <ol
            aria-label="Propharmex milestones, oldest to newest"
            className="relative flex flex-col gap-10 border-l border-[var(--color-border)] pl-6 sm:pl-8"
          >
            {content.events.map((event) => (
              <TimelineRow key={`${event.year}-${event.title}`} event={event} />
            ))}
          </ol>
        </SectionReveal>
      </div>
    </section>
  );
};

const TimelineRow: FC<{ event: AboutTimelineEvent }> = ({ event }) => {
  const source = event.source;

  return (
    <li className="relative list-none">
      <span
        aria-hidden="true"
        className="absolute -left-[calc(1.5rem+5px)] top-1 size-2.5 rounded-full border border-[var(--color-primary-600)] bg-[var(--color-surface)] sm:-left-[calc(2rem+5px)]"
      />
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-[family-name:var(--font-mono)] text-sm font-medium tracking-[0.04em] text-[var(--color-primary-700)]">
            {event.year}
          </span>
          <span
            className={[
              "rounded-[var(--radius-full)] border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em]",
              KIND_STYLE[event.kind],
            ].join(" ")}
          >
            {KIND_LABEL[event.kind]}
          </span>
        </div>
        <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-[var(--color-fg)]">
          {event.title}
        </h3>
        <p className="text-sm leading-relaxed text-[var(--color-slate-800)]">
          {event.body}
        </p>
        {source.kind === "primary" ? (
          <p className="text-xs leading-snug text-[var(--color-muted)]">
            Source:{" "}
            <a
              href={source.href}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-[var(--color-primary-700)]"
            >
              {source.label}
            </a>
          </p>
        ) : (
          <p className="text-xs leading-snug text-[var(--color-muted)]">
            {source.label}
          </p>
        )}
      </div>
    </li>
  );
};

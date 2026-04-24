/**
 * DelTimeline — DEL leaf 6-step new-licence timeline, RSC.
 *
 * Vertical numbered timeline with owner chips (propharmex / health-canada /
 * both), typical-duration chips, and per-step primary-source anchors. Opens
 * with the 250-calendar-day service-standard callout and closes with the
 * Health Canada DEL register source.
 */
import type { FC } from "react";
import { Clock, ExternalLink, Landmark, Users2, Workflow } from "lucide-react";

import type {
  DelTimeline as TimelineContent,
  DelTimelineStep,
} from "../../content/regulatory-services";

import { SectionReveal } from "./SectionReveal";

type Props = { content: TimelineContent };

const OWNER_META: Record<
  DelTimelineStep["owner"],
  { label: string; tone: string; icon: typeof Workflow }
> = {
  propharmex: {
    label: "Propharmex",
    tone: "border-[var(--color-primary-600)] bg-[var(--color-primary-50)] text-[var(--color-primary-700)]",
    icon: Workflow,
  },
  "health-canada": {
    label: "Health Canada",
    tone: "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-fg)]",
    icon: Landmark,
  },
  both: {
    label: "Both",
    tone: "border-[var(--color-border)] bg-[var(--color-slate-50)] text-[var(--color-slate-800)]",
    icon: Users2,
  },
};

export const DelTimeline: FC<Props> = ({ content }) => {
  const source = content.source;
  return (
    <section
      id="del-timeline"
      aria-labelledby="rs-leaf-timeline-heading"
      className="scroll-mt-24 border-b border-[var(--color-border)] bg-[var(--color-slate-50)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
            {content.eyebrow}
          </p>
          <h2
            id="rs-leaf-timeline-heading"
            className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl"
          >
            {content.heading}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[var(--color-slate-800)]">
            {content.lede}
          </p>
        </header>

        <SectionReveal className="mt-10">
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-primary-600)] bg-[var(--color-primary-50)] p-5">
            <p className="text-sm leading-relaxed text-[var(--color-fg)]">
              <span className="font-semibold">Service standard —</span>{" "}
              {content.serviceStandardCopy}
            </p>
          </div>

          <ol className="mt-10 flex flex-col gap-4" aria-label="DEL timeline steps">
            {content.steps.map((step, idx) => {
              const meta = OWNER_META[step.owner];
              const OwnerIcon = meta.icon;
              return (
                <li key={step.id} className="list-none">
                  <article className="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:flex-row sm:gap-5 sm:p-6">
                    <span
                      aria-hidden="true"
                      className="grid size-9 shrink-0 place-items-center rounded-[var(--radius-full)] border border-[var(--color-primary-600)] bg-[var(--color-primary-50)] font-[family-name:var(--font-display)] text-sm font-semibold text-[var(--color-primary-700)]"
                    >
                      {idx + 1}
                    </span>
                    <div className="flex flex-1 flex-col gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-[family-name:var(--font-display)] text-base font-semibold tracking-tight text-[var(--color-fg)]">
                          {step.label}
                        </h3>
                        <span
                          className={`inline-flex items-center gap-1 rounded-[var(--radius-full)] border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] ${meta.tone}`}
                        >
                          <OwnerIcon aria-hidden="true" size={11} />
                          {meta.label}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-[var(--radius-full)] border border-[var(--color-border)] bg-[var(--color-slate-50)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-muted)]">
                          <Clock aria-hidden="true" size={11} />
                          {step.typicalDuration}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed text-[var(--color-slate-800)]">
                        {step.description}
                      </p>
                      {step.source ? (
                        <p className="text-xs leading-relaxed text-[var(--color-muted)]">
                          {step.source.kind === "primary" ? (
                            <a
                              href={step.source.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[var(--color-primary-700)] underline underline-offset-2"
                            >
                              {step.source.label}
                              <ExternalLink size={11} aria-hidden="true" />
                            </a>
                          ) : (
                            <span>{step.source.label}</span>
                          )}
                        </p>
                      ) : null}
                    </div>
                  </article>
                </li>
              );
            })}
          </ol>

          <p className="mt-8 text-xs leading-relaxed text-[var(--color-muted)]">
            {source.kind === "primary" ? (
              <a
                href={source.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[var(--color-primary-700)] underline underline-offset-2"
              >
                {source.label}
                <ExternalLink size={11} aria-hidden="true" />
              </a>
            ) : (
              <span>{source.label}</span>
            )}
          </p>
        </SectionReveal>
      </div>
    </section>
  );
};

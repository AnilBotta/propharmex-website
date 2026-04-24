/**
 * Lifecycle — hub programme-lifecycle diagram, RSC.
 *
 * Four-stage stepper with hub-ownership shorthand. Renders horizontally on
 * lg+ viewports and as a vertical list below. Ownership is the signal — both
 * hubs operate under a single QMS so the legend makes that explicit.
 */
import type { FC } from "react";
import { ArrowRight, Building2, Factory, Users } from "lucide-react";

import type {
  LifecycleStage,
  PharmDevLifecycle,
} from "../../content/pharmaceutical-development";

import { SectionReveal } from "./SectionReveal";

type Props = { content: PharmDevLifecycle };

const OWNER_META: Record<
  LifecycleStage["owner"],
  { label: string; tone: string; icon: typeof Building2 }
> = {
  hyderabad: {
    label: "Hyderabad",
    tone: "border-[var(--color-primary-600)] bg-[var(--color-primary-50)] text-[var(--color-primary-700)]",
    icon: Building2,
  },
  mississauga: {
    label: "Mississauga",
    tone: "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-fg)]",
    icon: Factory,
  },
  both: {
    label: "Both hubs",
    tone: "border-[var(--color-border)] bg-[var(--color-slate-50)] text-[var(--color-slate-800)]",
    icon: Users,
  },
};

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
            {content.stages.map((stage, idx) => {
              const meta = OWNER_META[stage.owner];
              const Icon = meta.icon;
              return (
                <li key={stage.id} className="relative list-none">
                  <article className="flex h-full flex-col gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-[family-name:var(--font-display)] text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]">
                        Stage {idx + 1}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 rounded-[var(--radius-full)] border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] ${meta.tone}`}
                      >
                        <Icon aria-hidden="true" size={11} />
                        {meta.label}
                      </span>
                    </div>
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
              );
            })}
          </ol>

          <dl className="mt-8 grid grid-cols-1 gap-3 text-xs text-[var(--color-muted)] sm:grid-cols-3">
            <div className="flex items-start gap-2">
              <Building2 size={14} className="mt-0.5 text-[var(--color-primary-700)]" aria-hidden="true" />
              <span>{content.ownerLegend.hyderabad}</span>
            </div>
            <div className="flex items-start gap-2">
              <Factory size={14} className="mt-0.5 text-[var(--color-fg)]" aria-hidden="true" />
              <span>{content.ownerLegend.mississauga}</span>
            </div>
            <div className="flex items-start gap-2">
              <Users size={14} className="mt-0.5" aria-hidden="true" />
              <span>{content.ownerLegend.both}</span>
            </div>
          </dl>

          <p className="mt-6 text-sm leading-relaxed text-[var(--color-muted)]">
            {content.handoffNote}
          </p>
        </SectionReveal>
      </div>
    </section>
  );
};

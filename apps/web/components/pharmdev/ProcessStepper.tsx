/**
 * ProcessStepper — leaf tailored process stepper, RSC.
 *
 * Vertical stepper with ownership shorthand + per-step technical notes.
 * Ownership pills mirror the hub Lifecycle component for visual continuity.
 */
import type { FC } from "react";
import { Building2, Factory, Users } from "lucide-react";

import type {
  DosageFormProcess,
  ProcessStep,
} from "../../content/pharmaceutical-development";

import { SectionReveal } from "./SectionReveal";

type Props = { content: DosageFormProcess };

const OWNER_META: Record<
  ProcessStep["owner"],
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

export const ProcessStepper: FC<Props> = ({ content }) => {
  return (
    <section
      id="process"
      aria-labelledby="pd-leaf-process-heading"
      className="scroll-mt-24 border-b border-[var(--color-border)] bg-[var(--color-bg)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
            {content.eyebrow}
          </p>
          <h2
            id="pd-leaf-process-heading"
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
            {content.steps.map((step, idx) => {
              const meta = OWNER_META[step.owner];
              const Icon = meta.icon;
              return (
                <li key={step.id} className="list-none">
                  <article className="grid grid-cols-[auto_1fr] gap-5 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 md:p-6">
                    <span
                      aria-hidden="true"
                      className="grid size-10 shrink-0 place-items-center rounded-[var(--radius-full)] border border-[var(--color-primary-600)] bg-[var(--color-primary-50)] font-[family-name:var(--font-display)] text-sm font-semibold text-[var(--color-primary-700)]"
                    >
                      {idx + 1}
                    </span>
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-[var(--color-fg)]">
                          {step.label}
                        </h3>
                        <span
                          className={`inline-flex items-center gap-1 rounded-[var(--radius-full)] border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] ${meta.tone}`}
                        >
                          <Icon aria-hidden="true" size={11} />
                          {meta.label}
                        </span>
                      </div>
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
        </SectionReveal>
      </div>
    </section>
  );
};

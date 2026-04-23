/**
 * CapabilityMatrix — /facilities/[site] detail, RSC.
 *
 * Grid of capability cards tagged primary (executed here) or secondary
 * (supported in partnership with the other hub). Tier is the signal — the
 * legend at the bottom makes it explicit without demoting either status.
 */
import type { FC } from "react";
import { CheckCircle2, Link2 } from "lucide-react";

import type { FacilityCapabilityMatrix } from "../../content/facilities";

import { SectionReveal } from "./SectionReveal";

type Props = { content: FacilityCapabilityMatrix };

export const CapabilityMatrix: FC<Props> = ({ content }) => {
  return (
    <section
      id="capabilities"
      aria-labelledby="facility-capabilities-heading"
      className="scroll-mt-24 border-b border-[var(--color-border)] bg-[var(--color-bg)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
            {content.eyebrow}
          </p>
          <h2
            id="facility-capabilities-heading"
            className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl"
          >
            {content.heading}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[var(--color-slate-800)]">
            {content.lede}
          </p>
        </header>

        <SectionReveal className="mt-12">
          <ul
            className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
            aria-label="Capabilities"
          >
            {content.capabilities.map((cap) => {
              const isPrimary = cap.tier === "primary";
              const Icon = isPrimary ? CheckCircle2 : Link2;
              return (
                <li key={cap.id} className="list-none">
                  <article
                    className={`flex h-full flex-col gap-3 rounded-[var(--radius-lg)] border p-5 ${
                      isPrimary
                        ? "border-[var(--color-primary-600)] bg-[var(--color-surface)]"
                        : "border-[var(--color-border)] bg-[var(--color-slate-50)]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        className={`grid size-8 shrink-0 place-items-center rounded-[var(--radius-md)] ${
                          isPrimary
                            ? "bg-[var(--color-primary-50)] text-[var(--color-primary-700)]"
                            : "bg-[var(--color-slate-100)] text-[var(--color-muted)]"
                        }`}
                      >
                        <Icon size={16} />
                      </span>
                      <span
                        className={`inline-flex items-center rounded-[var(--radius-full)] border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] ${
                          isPrimary
                            ? "border-[var(--color-primary-600)] bg-[var(--color-primary-50)] text-[var(--color-primary-700)]"
                            : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)]"
                        }`}
                      >
                        {isPrimary ? "Primary" : "Secondary"}
                      </span>
                    </div>
                    <h3 className="font-[family-name:var(--font-display)] text-base font-semibold tracking-tight text-[var(--color-fg)]">
                      {cap.label}
                    </h3>
                    <p className="text-sm leading-relaxed text-[var(--color-slate-800)]">
                      {cap.description}
                    </p>
                  </article>
                </li>
              );
            })}
          </ul>

          <dl className="mt-8 grid grid-cols-1 gap-3 text-xs text-[var(--color-muted)] sm:grid-cols-2">
            <div className="flex items-start gap-2">
              <CheckCircle2 size={14} className="mt-0.5 text-[var(--color-primary-700)]" aria-hidden="true" />
              <span>{content.legendPrimary}</span>
            </div>
            <div className="flex items-start gap-2">
              <Link2 size={14} className="mt-0.5" aria-hidden="true" />
              <span>{content.legendSecondary}</span>
            </div>
          </dl>
        </SectionReveal>
      </div>
    </section>
  );
};

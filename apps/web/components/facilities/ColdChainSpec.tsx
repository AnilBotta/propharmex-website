/**
 * ColdChainSpec — /facilities/[site] detail, RSC.
 *
 * Temperature-zone spec grid with primary-source framework reference. The
 * zone list is site-specific — Mississauga includes a controlled-substance
 * vault; Hyderabad includes ICH zone II and zone IVb stability conditions
 * rather than a frozen distribution zone.
 */
import type { FC } from "react";
import { ExternalLink, Thermometer } from "lucide-react";

import type { FacilityColdChainSpec } from "../../content/facilities";

import { SectionReveal } from "./SectionReveal";

type Props = { content: FacilityColdChainSpec };

export const ColdChainSpec: FC<Props> = ({ content }) => {
  return (
    <section
      id="cold-chain"
      aria-labelledby="facility-cold-chain-heading"
      className="scroll-mt-24 border-b border-[var(--color-border)] bg-[var(--color-bg)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
            {content.eyebrow}
          </p>
          <h2
            id="facility-cold-chain-heading"
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
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
            aria-label="Cold-chain zones"
          >
            {content.zones.map((zone) => (
              <li key={zone.id} className="list-none">
                <article className="flex h-full flex-col gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6">
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="grid size-10 shrink-0 place-items-center rounded-[var(--radius-md)] bg-[var(--color-primary-50)] text-[var(--color-primary-700)]"
                    >
                      <Thermometer size={18} />
                    </span>
                    <div>
                      <h3 className="font-[family-name:var(--font-display)] text-base font-semibold tracking-tight text-[var(--color-fg)]">
                        {zone.label}
                      </h3>
                      <p className="font-mono text-xs text-[var(--color-muted)]">
                        {zone.range}
                      </p>
                    </div>
                  </div>
                  <dl className="grid grid-cols-1 gap-2 text-sm">
                    <div>
                      <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-muted)]">
                        Uses
                      </dt>
                      <dd className="mt-1 text-[var(--color-slate-800)]">{zone.uses}</dd>
                    </div>
                    <div>
                      <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-muted)]">
                        Monitoring
                      </dt>
                      <dd className="mt-1 text-[var(--color-slate-800)]">
                        {zone.monitoring}
                      </dd>
                    </div>
                  </dl>
                </article>
              </li>
            ))}
          </ul>

          <p className="mt-6 text-xs text-[var(--color-muted)]">
            {content.reference.kind === "primary" ? (
              <a
                href={content.reference.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[var(--color-primary-700)] underline underline-offset-2"
              >
                {content.reference.label}
                <ExternalLink size={12} aria-hidden="true" />
              </a>
            ) : (
              content.reference.label
            )}
          </p>
        </SectionReveal>
      </div>
    </section>
  );
};

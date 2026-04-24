/**
 * HubPosture — /industries operating-posture card row, RSC.
 *
 * Three cards describing how industry engagements are shaped regardless of
 * which lens the sponsor lands on. No claim-status pills — the posture is
 * behavioural, not licensure.
 */
import type { FC } from "react";

import type { IndustryPosture } from "../../content/industries";

import { SectionReveal } from "./SectionReveal";

type Props = { content: IndustryPosture };

export const HubPosture: FC<Props> = ({ content }) => {
  return (
    <section
      id="posture"
      aria-labelledby="ind-hub-posture-heading"
      className="scroll-mt-24 border-b border-[var(--color-border)] bg-[var(--color-bg)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
            {content.eyebrow}
          </p>
          <h2
            id="ind-hub-posture-heading"
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
            className="grid grid-cols-1 gap-4 md:grid-cols-3"
            aria-label="Engagement posture"
          >
            {content.cards.map((card) => (
              <li key={card.id} className="list-none">
                <article className="flex h-full flex-col gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
                  <h3 className="font-[family-name:var(--font-display)] text-base font-semibold tracking-tight text-[var(--color-fg)]">
                    {card.label}
                  </h3>
                  <p className="text-sm leading-relaxed text-[var(--color-slate-800)]">
                    {card.description}
                  </p>
                </article>
              </li>
            ))}
          </ul>
        </SectionReveal>
      </div>
    </section>
  );
};

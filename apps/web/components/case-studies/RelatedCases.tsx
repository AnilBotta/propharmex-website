/**
 * RelatedCases — other case studies rail at the bottom of a detail page, RSC.
 *
 * Reuses the same `CaseCard` that powers the hub grid. Filters the current
 * slug out and renders whatever else is in the registry (up to a max).
 */
import type { FC } from "react";

import type { CaseStudyCardSummary } from "../../content/case-studies";

import { CaseCard } from "./CaseCard";
import { SectionReveal } from "./SectionReveal";

type Props = {
  eyebrow: string;
  heading: string;
  lede: string;
  cards: CaseStudyCardSummary[];
};

export const RelatedCases: FC<Props> = ({ eyebrow, heading, lede, cards }) => {
  if (cards.length === 0) return null;
  return (
    <section
      id="related-cases"
      aria-labelledby="cs-detail-related-cases-heading"
      className="scroll-mt-24 border-b border-[var(--color-border)] bg-[var(--color-slate-50)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
            {eyebrow}
          </p>
          <h2
            id="cs-detail-related-cases-heading"
            className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl"
          >
            {heading}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[var(--color-slate-800)]">
            {lede}
          </p>
        </header>

        <SectionReveal className="mt-10">
          <ul
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
            aria-label="Other case studies"
          >
            {cards.map((card) => (
              <li key={card.slug} className="list-none">
                <CaseCard card={card} />
              </li>
            ))}
          </ul>
        </SectionReveal>
      </div>
    </section>
  );
};

/**
 * Culture — RSC.
 *
 * Four principle cards laid out in a 2x2 grid on md+, single column on mobile.
 * The principles are intentionally short — they read as operating norms, not
 * marketing copy.
 */
import type { FC } from "react";

import type { AboutCulture } from "../../content/about";

import { SectionReveal } from "./SectionReveal";

type Props = { content: AboutCulture };

export const Culture: FC<Props> = ({ content }) => {
  return (
    <section
      id="culture"
      aria-labelledby="about-culture-heading"
      className="scroll-mt-24 border-b border-[var(--color-border)] bg-[var(--color-slate-50)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
            {content.eyebrow}
          </p>
          <h2
            id="about-culture-heading"
            className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl"
          >
            {content.heading}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--color-slate-800)]">
            {content.lede}
          </p>
        </header>

        <SectionReveal className="mt-10">
          <ul className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {content.principles.map((principle) => (
              <li
                key={principle.id}
                className="list-none rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
              >
                <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-[var(--color-fg)]">
                  {principle.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-slate-800)]">
                  {principle.body}
                </p>
              </li>
            ))}
          </ul>
        </SectionReveal>
      </div>
    </section>
  );
};

/**
 * PainPoints — industry leaf 3-column pain card row, RSC.
 *
 * Prompt 13: "Each page answers: their pain, our tailored offering, ..."
 * PainPoints is the first column triad.
 */
import type { FC } from "react";
import { AlertCircle } from "lucide-react";

import type { IndustryPainPoints } from "../../content/industries";

import { SectionReveal } from "./SectionReveal";

type Props = { content: IndustryPainPoints };

export const PainPoints: FC<Props> = ({ content }) => {
  return (
    <section
      id="pain"
      aria-labelledby="ind-leaf-pain-heading"
      className="scroll-mt-24 border-b border-[var(--color-border)] bg-[var(--color-bg)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
            {content.eyebrow}
          </p>
          <h2
            id="ind-leaf-pain-heading"
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
            aria-label="Pain points"
          >
            {content.items.map((item) => (
              <li key={item.id} className="list-none">
                <article className="flex h-full flex-col gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
                  <span
                    aria-hidden="true"
                    className="grid size-8 shrink-0 place-items-center rounded-[var(--radius-md)] bg-[var(--color-primary-50)] text-[var(--color-primary-700)]"
                  >
                    <AlertCircle size={16} />
                  </span>
                  <h3 className="font-[family-name:var(--font-display)] text-base font-semibold tracking-tight text-[var(--color-fg)]">
                    {item.label}
                  </h3>
                  <p className="text-sm leading-relaxed text-[var(--color-slate-800)]">
                    {item.description}
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

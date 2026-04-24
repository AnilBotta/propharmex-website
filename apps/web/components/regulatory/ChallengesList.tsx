/**
 * ChallengesList — regulatory leaf "common pitfalls" block, RSC.
 */
import type { FC } from "react";
import { AlertCircle } from "lucide-react";

import type { RegulatoryChallenges } from "../../content/regulatory-services";

import { SectionReveal } from "./SectionReveal";

type Props = { content: RegulatoryChallenges };

export const ChallengesList: FC<Props> = ({ content }) => {
  return (
    <section
      id="challenges"
      aria-labelledby="rs-leaf-challenges-heading"
      className="scroll-mt-24 border-b border-[var(--color-border)] bg-[var(--color-bg)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
            {content.eyebrow}
          </p>
          <h2
            id="rs-leaf-challenges-heading"
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
            aria-label="Common pitfalls"
          >
            {content.items.map((item) => (
              <li key={item.id} className="list-none">
                <article className="flex h-full gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
                  <span
                    aria-hidden="true"
                    className="grid size-8 shrink-0 place-items-center rounded-[var(--radius-md)] bg-[var(--color-primary-50)] text-[var(--color-primary-700)]"
                  >
                    <AlertCircle size={16} />
                  </span>
                  <div className="flex flex-col gap-1.5">
                    <h3 className="font-[family-name:var(--font-display)] text-base font-semibold tracking-tight text-[var(--color-fg)]">
                      {item.label}
                    </h3>
                    <p className="text-sm leading-relaxed text-[var(--color-slate-800)]">
                      {item.description}
                    </p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </SectionReveal>
      </div>
    </section>
  );
};

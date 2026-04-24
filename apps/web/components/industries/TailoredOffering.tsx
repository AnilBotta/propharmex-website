/**
 * TailoredOffering — industry leaf 3-column offering block, RSC.
 *
 * Each column maps the industry pain to a shipped service-tree leaf.
 * Columns are rendered as cards with an outbound arrow to the service page.
 */
import type { FC } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { IndustryTailoredOffering } from "../../content/industries";

import { SectionReveal } from "./SectionReveal";

type Props = { content: IndustryTailoredOffering };

export const TailoredOffering: FC<Props> = ({ content }) => {
  return (
    <section
      id="offering"
      aria-labelledby="ind-leaf-offering-heading"
      className="scroll-mt-24 border-b border-[var(--color-border)] bg-[var(--color-slate-50)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
            {content.eyebrow}
          </p>
          <h2
            id="ind-leaf-offering-heading"
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
            aria-label="Tailored offering"
          >
            {content.columns.map((column) => (
              <li key={column.id} className="list-none">
                <Link
                  href={column.serviceHref}
                  className="group flex h-full flex-col gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition hover:-translate-y-0.5 hover:border-[var(--color-primary-600)] hover:shadow-[var(--shadow-sm)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] motion-reduce:hover:translate-y-0 motion-reduce:transition-none"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-[family-name:var(--font-display)] text-base font-semibold tracking-tight text-[var(--color-fg)]">
                      {column.label}
                    </h3>
                    <ArrowUpRight
                      aria-hidden="true"
                      size={16}
                      className="mt-1 text-[var(--color-muted)] transition group-hover:text-[var(--color-primary-700)]"
                    />
                  </div>
                  <p className="text-sm leading-relaxed text-[var(--color-slate-800)]">
                    {column.description}
                  </p>
                  <p className="mt-auto text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-primary-700)]">
                    {column.serviceLabel}
                  </p>
                </Link>
              </li>
            ))}
          </ul>

          <p className="mt-8 max-w-3xl text-sm italic leading-relaxed text-[var(--color-slate-800)]">
            {content.closingNote}
          </p>
        </SectionReveal>
      </div>
    </section>
  );
};

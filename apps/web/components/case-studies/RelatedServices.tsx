/**
 * RelatedServices — detail-page cross-links into the service tree, RSC.
 */
import type { FC } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { CaseStudyRelatedServices as CaseStudyRelatedServicesContent } from "../../content/case-studies";

import { SectionReveal } from "./SectionReveal";

type Props = { content: CaseStudyRelatedServicesContent };

export const RelatedServices: FC<Props> = ({ content }) => {
  return (
    <section
      id="related-services"
      aria-labelledby="cs-detail-related-heading"
      className="scroll-mt-24 border-b border-[var(--color-border)] bg-[var(--color-bg)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
            {content.eyebrow}
          </p>
          <h2
            id="cs-detail-related-heading"
            className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl"
          >
            {content.heading}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[var(--color-slate-800)]">
            {content.lede}
          </p>
        </header>

        <SectionReveal className="mt-10">
          <ul
            className="grid grid-cols-1 gap-4 md:grid-cols-3"
            aria-label="Related services"
          >
            {content.links.map((link) => (
              <li key={link.id} className="list-none">
                <Link
                  href={link.href}
                  className="group flex h-full flex-col gap-2 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition hover:-translate-y-0.5 hover:border-[var(--color-primary-600)] hover:shadow-[var(--shadow-sm)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] motion-reduce:hover:translate-y-0 motion-reduce:transition-none"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-[family-name:var(--font-display)] text-base font-semibold tracking-tight text-[var(--color-fg)]">
                      {link.label}
                    </h3>
                    <ArrowUpRight
                      aria-hidden="true"
                      size={16}
                      className="text-[var(--color-muted)] transition group-hover:text-[var(--color-primary-700)]"
                    />
                  </div>
                  <p className="text-sm leading-relaxed text-[var(--color-slate-800)]">
                    {link.description}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </SectionReveal>
      </div>
    </section>
  );
};

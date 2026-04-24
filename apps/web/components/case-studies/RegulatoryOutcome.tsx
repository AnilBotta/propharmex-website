/**
 * RegulatoryOutcome — filings + service-standard context, RSC.
 *
 * Mirrors the /industries RegulatoryContext pattern but uses filing-centric
 * copy instead of topic-centric copy. Every filing carries a primary-source
 * reference (ICH / 21 CFR / WHO PQ) or an internal-documentation fallback.
 */
import type { FC } from "react";
import { ExternalLink } from "lucide-react";

import type { CaseStudyRegulatoryOutcome as CaseStudyRegulatoryOutcomeContent } from "../../content/case-studies";

import { SectionReveal } from "./SectionReveal";

type Props = { content: CaseStudyRegulatoryOutcomeContent };

export const RegulatoryOutcome: FC<Props> = ({ content }) => {
  return (
    <section
      id="regulatory-outcome"
      aria-labelledby="cs-detail-regulatory-heading"
      className="scroll-mt-24 border-b border-[var(--color-border)] bg-[var(--color-slate-50)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
            {content.eyebrow}
          </p>
          <h2
            id="cs-detail-regulatory-heading"
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
            aria-label="Filings"
          >
            {content.filings.map((filing) => (
              <li key={filing.id} className="list-none">
                <article className="flex h-full flex-col gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-primary-700)]">
                    {filing.label}
                  </p>
                  <p className="text-sm leading-relaxed text-[var(--color-slate-800)]">
                    {filing.detail}
                  </p>
                  {filing.source ? (
                    <p className="mt-auto text-xs leading-relaxed">
                      {filing.source.kind === "primary" ? (
                        <a
                          href={filing.source.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[var(--color-primary-700)] underline underline-offset-2"
                        >
                          {filing.source.label}
                          <ExternalLink size={11} aria-hidden="true" />
                        </a>
                      ) : (
                        <span className="text-[var(--color-muted)]">
                          {filing.source.label}
                        </span>
                      )}
                    </p>
                  ) : null}
                </article>
              </li>
            ))}
          </ul>
          <p className="mt-8 max-w-3xl text-sm leading-relaxed text-[var(--color-slate-800)]">
            {content.closingNote}
          </p>
        </SectionReveal>
      </div>
    </section>
  );
};

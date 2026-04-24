/**
 * CaseStudyRail — analytical-services hub worked-examples rail, RSC.
 *
 * Three anonymized teasers, each with an `under-confirmation` pill. Named,
 * permission-cleared case studies land with Prompt 14.
 */
import type { FC } from "react";
import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";

import { Button } from "@propharmex/ui";

import type { AnalyticalCaseRail as CaseRailContent } from "../../content/analytical-services";

import { SectionReveal } from "./SectionReveal";

type Props = { content: CaseRailContent };

export const CaseStudyRail: FC<Props> = ({ content }) => {
  return (
    <section
      id="case-rail"
      aria-labelledby="as-hub-caserail-heading"
      className="scroll-mt-24 border-b border-[var(--color-border)] bg-[var(--color-slate-50)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
            {content.eyebrow}
          </p>
          <h2
            id="as-hub-caserail-heading"
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
            aria-label="Worked examples"
          >
            {content.teasers.map((teaser) => (
              <li key={teaser.id} className="list-none">
                <article className="flex h-full flex-col gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-primary-700)]">
                    {teaser.service}
                  </p>
                  <h3 className="font-[family-name:var(--font-display)] text-base font-semibold tracking-tight text-[var(--color-fg)]">
                    {teaser.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[var(--color-slate-800)]">
                    {teaser.body}
                  </p>
                  <p className="mt-auto inline-flex items-center gap-2 rounded-[var(--radius-full)] border border-[var(--color-border)] bg-[var(--color-slate-50)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--color-muted)] self-start">
                    <FileText size={11} aria-hidden="true" />
                    Documentation on request
                  </p>
                </article>
              </li>
            ))}
          </ul>

          <div className="mt-10">
            <Button asChild variant={content.cta.variant} size="lg">
              <Link href={content.cta.href}>
                {content.cta.label}
                <ArrowRight aria-hidden="true" size={16} />
              </Link>
            </Button>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
};

/**
 * DelCaseStudyFeature — DEL leaf anonymized pattern-of-work feature, RSC.
 *
 * Single large card. Named, permission-cleared case studies land with
 * Prompt 14; until then the pattern is described and the status pill is
 * `under-confirmation`.
 */
import type { FC } from "react";
import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";

import { Button } from "@propharmex/ui";

import type { DelCaseStudyFeature as CaseStudyContent } from "../../content/regulatory-services";

import { SectionReveal } from "./SectionReveal";

type Props = { content: CaseStudyContent };

export const DelCaseStudyFeature: FC<Props> = ({ content }) => {
  return (
    <section
      id="del-case-study"
      aria-labelledby="rs-leaf-case-heading"
      className="scroll-mt-24 border-b border-[var(--color-border)] bg-[var(--color-bg)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionReveal>
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-xs)] sm:p-10">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
                {content.eyebrow}
              </p>
              <span className="inline-flex items-center gap-1 rounded-[var(--radius-full)] border border-[var(--color-border)] bg-[var(--color-slate-50)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--color-muted)]">
                <FileText aria-hidden="true" size={11} />
                Under confirmation
              </span>
            </div>
            <h2
              id="rs-leaf-case-heading"
              className="mt-3 font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-3xl"
            >
              {content.heading}
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-[var(--color-slate-800)]">
              {content.body}
            </p>
            <div className="mt-8">
              <Button asChild variant={content.cta.variant} size="lg">
                <Link href={content.cta.href}>
                  {content.cta.label}
                  <ArrowRight aria-hidden="true" size={16} />
                </Link>
              </Button>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
};

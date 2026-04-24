/**
 * ScopingQuestions — analytical leaf "is this right for you?" block, RSC.
 *
 * Same scannable pattern as the pharmdev self-check, except the CTA routes
 * to /contact (no matching AI Matcher for analytical services) so the first
 * call can open on context rather than a blank page.
 */
import type { FC } from "react";
import Link from "next/link";
import { ArrowRight, HelpCircle } from "lucide-react";

import { Button } from "@propharmex/ui";

import type { AnalyticalScopingQuestions as ScopingContent } from "../../content/analytical-services";

import { SectionReveal } from "./SectionReveal";

type Props = { content: ScopingContent };

export const ScopingQuestions: FC<Props> = ({ content }) => {
  return (
    <section
      id="scoping"
      aria-labelledby="as-leaf-scoping-heading"
      className="scroll-mt-24 border-b border-[var(--color-border)] bg-[var(--color-slate-50)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
            {content.eyebrow}
          </p>
          <h2
            id="as-leaf-scoping-heading"
            className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl"
          >
            {content.heading}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[var(--color-slate-800)]">
            {content.lede}
          </p>
        </header>

        <SectionReveal className="mt-12">
          <ol className="flex flex-col gap-4" aria-label="Scoping questions">
            {content.questions.map((question, idx) => (
              <li key={question.id} className="list-none">
                <article className="grid grid-cols-[auto_1fr] gap-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
                  <span
                    aria-hidden="true"
                    className="grid size-9 shrink-0 place-items-center rounded-[var(--radius-full)] border border-[var(--color-primary-600)] bg-[var(--color-primary-50)] font-[family-name:var(--font-display)] text-sm font-semibold text-[var(--color-primary-700)]"
                  >
                    {idx + 1}
                  </span>
                  <div className="flex flex-col gap-1.5">
                    <h3 className="font-[family-name:var(--font-display)] text-base font-semibold tracking-tight text-[var(--color-fg)]">
                      {question.prompt}
                    </h3>
                    <p className="inline-flex items-start gap-1.5 text-sm leading-relaxed text-[var(--color-muted)]">
                      <HelpCircle size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
                      <span>{question.helper}</span>
                    </p>
                  </div>
                </article>
              </li>
            ))}
          </ol>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild variant={content.cta.variant} size="lg">
              <Link href={content.cta.href}>
                {content.cta.label}
                <ArrowRight aria-hidden="true" size={16} />
              </Link>
            </Button>
          </div>

          <p className="mt-6 max-w-3xl text-xs leading-relaxed text-[var(--color-muted)]">
            {content.disclaimer}
          </p>
        </SectionReveal>
      </div>
    </section>
  );
};

/**
 * DelChecklistDownload — DEL leaf gated-download card, RSC.
 *
 * The PDF artifact is produced through the Prompt 15 whitepaper/pdf pipeline.
 * Until then, the CTA routes to /contact so the covering note can be scoped
 * to the requester's programme.
 */
import type { FC } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Download } from "lucide-react";

import { Button } from "@propharmex/ui";

import type { DelChecklistDownload as ChecklistContent } from "../../content/regulatory-services";

import { SectionReveal } from "./SectionReveal";

type Props = { content: ChecklistContent };

export const DelChecklistDownload: FC<Props> = ({ content }) => {
  return (
    <section
      id="del-checklist"
      aria-labelledby="rs-leaf-checklist-heading"
      className="scroll-mt-24 border-b border-[var(--color-border)] bg-[var(--color-slate-50)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionReveal>
          <div className="grid grid-cols-1 gap-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-xs)] sm:p-10 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
                  {content.eyebrow}
                </p>
                <span className="inline-flex items-center gap-1 rounded-[var(--radius-full)] border border-[var(--color-border)] bg-[var(--color-slate-50)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--color-muted)]">
                  <Download aria-hidden="true" size={11} />
                  PDF on request
                </span>
              </div>
              <h2
                id="rs-leaf-checklist-heading"
                className="mt-3 font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-3xl"
              >
                {content.heading}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[var(--color-slate-800)]">
                {content.lede}
              </p>
              <div className="mt-6">
                <Button asChild variant={content.cta.variant} size="lg">
                  <Link href={content.cta.href}>
                    {content.cta.label}
                    <ArrowRight aria-hidden="true" size={16} />
                  </Link>
                </Button>
              </div>
              <p className="mt-6 text-xs leading-relaxed text-[var(--color-muted)]">
                {content.disclaimer}
              </p>
            </div>
            <ul
              className="flex flex-col gap-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-slate-50)] p-5"
              aria-label="Checklist domains"
            >
              {content.bullets.map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2
                    aria-hidden="true"
                    size={15}
                    className="mt-0.5 shrink-0 text-[var(--color-primary-700)]"
                  />
                  <span className="text-sm leading-relaxed text-[var(--color-slate-800)]">
                    {bullet}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
};

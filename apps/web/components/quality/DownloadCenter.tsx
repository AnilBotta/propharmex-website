/**
 * DownloadCenter — /quality-compliance, RSC.
 *
 * Three policy-document cards. Per Prompt 8 quickest-path, each card routes to
 * /contact with a source tag rather than serving an open PDF — the revision in
 * a reviewer's hands must always match the current SOP set, and the document
 * release log is attached at send time.
 */
import type { FC } from "react";
import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";

import { Button } from "@propharmex/ui";

import type { QualityDownloads } from "../../content/quality";

import { SectionReveal } from "./SectionReveal";

type Props = { content: QualityDownloads };

export const DownloadCenter: FC<Props> = ({ content }) => {
  return (
    <section
      id="downloads"
      aria-labelledby="quality-downloads-heading"
      className="scroll-mt-24 bg-[var(--color-bg)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
            {content.eyebrow}
          </p>
          <h2
            id="quality-downloads-heading"
            className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl"
          >
            {content.heading}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[var(--color-slate-800)]">
            {content.lede}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)]">
            {content.requestNotice}
          </p>
        </header>

        <SectionReveal className="mt-12">
          <ul
            className="grid grid-cols-1 gap-5 md:grid-cols-3"
            aria-label="Policy documents available on request"
          >
            {content.docs.map((doc) => (
              <li key={doc.id} className="list-none">
                <article className="flex h-full flex-col gap-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="grid size-10 shrink-0 place-items-center rounded-[var(--radius-md)] bg-[var(--color-primary-50)] text-[var(--color-primary-700)]"
                    >
                      <FileText size={18} />
                    </span>
                    <span className="inline-flex items-center rounded-[var(--radius-full)] border border-[var(--color-border)] bg-[var(--color-slate-50)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--color-muted)]">
                      {doc.framework}
                    </span>
                  </div>
                  <h3 className="font-[family-name:var(--font-display)] text-base font-semibold tracking-tight text-[var(--color-fg)]">
                    {doc.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[var(--color-slate-800)]">
                    {doc.body}
                  </p>
                  <Button
                    asChild
                    variant={doc.action.variant}
                    size="sm"
                    className="mt-auto self-start"
                  >
                    <Link href={doc.action.href}>
                      {doc.action.label}
                      <ArrowRight aria-hidden="true" size={14} />
                    </Link>
                  </Button>
                </article>
              </li>
            ))}
          </ul>
        </SectionReveal>
      </div>
    </section>
  );
};

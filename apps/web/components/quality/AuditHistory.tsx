/**
 * AuditHistory — /quality-compliance, RSC.
 *
 * Two-pane layout:
 *  - NDA request panel (primary CTA) — explicitly acknowledges that no
 *    inspection outcomes are published on the marketing site.
 *  - Educational primer on 483, GUI-0002, and EU GMP / PIC/S classification
 *    so a procurement reviewer understands what they will receive under NDA.
 *
 * We do NOT claim zero-483 or any inspection result here. Adding such claims
 * without a confirmed primary-source trail is a CLAUDE.md §10 stop-and-ask.
 */
import type { FC } from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink, FileLock2 } from "lucide-react";

import { Button } from "@propharmex/ui";

import type { QualityAudit } from "../../content/quality";

import { SectionReveal } from "./SectionReveal";

type Props = { content: QualityAudit };

export const AuditHistory: FC<Props> = ({ content }) => {
  return (
    <section
      id="audit-history"
      aria-labelledby="quality-audit-heading"
      className="scroll-mt-24 border-b border-[var(--color-border)] bg-[var(--color-bg)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
            {content.eyebrow}
          </p>
          <h2
            id="quality-audit-heading"
            className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl"
          >
            {content.heading}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[var(--color-slate-800)]">
            {content.lede}
          </p>
        </header>

        <SectionReveal className="mt-12">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <aside
              aria-labelledby="nda-panel-heading"
              className="lg:col-span-5"
            >
              <div className="flex h-full flex-col gap-4 rounded-[var(--radius-lg)] border border-[var(--color-primary-600)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-xs)] sm:p-7">
                <div className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="grid size-10 shrink-0 place-items-center rounded-[var(--radius-md)] bg-[var(--color-primary-50)] text-[var(--color-primary-700)]"
                  >
                    <FileLock2 size={20} />
                  </span>
                  <h3
                    id="nda-panel-heading"
                    className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-[var(--color-fg)]"
                  >
                    {content.ndaPanel.heading}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-[var(--color-slate-800)]">
                  {content.ndaPanel.body}
                </p>
                <Button
                  asChild
                  variant={content.ndaPanel.action.variant}
                  size="lg"
                  className="mt-auto"
                >
                  <Link href={content.ndaPanel.action.href}>
                    {content.ndaPanel.action.label}
                    <ArrowRight aria-hidden="true" size={16} />
                  </Link>
                </Button>
              </div>
            </aside>

            <div className="lg:col-span-7">
              <ul className="flex flex-col gap-4" aria-label="Inspection primer">
                {content.primer.map((p) => (
                  <li
                    key={p.label}
                    className="list-none rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
                  >
                    <h4 className="font-[family-name:var(--font-display)] text-sm font-semibold tracking-tight text-[var(--color-fg)]">
                      {p.label}
                    </h4>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--color-slate-800)]">
                      {p.body}
                    </p>
                    {p.reference.kind === "primary" ? (
                      <a
                        href={p.reference.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-1 text-xs text-[var(--color-primary-700)] underline underline-offset-2"
                      >
                        {p.reference.label}
                        <ExternalLink size={12} aria-hidden="true" />
                      </a>
                    ) : (
                      <p className="mt-3 text-xs text-[var(--color-muted)]">
                        {p.reference.label}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
};

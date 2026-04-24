/**
 * PasrSection — single Problem / Approach / Solution / Result block, RSC.
 *
 * Shared render for all four PASR sections. Tone alternation (surface / slate-50
 * background) is driven by the `tone` prop — the route composes them in order.
 */
import type { FC } from "react";
import { ExternalLink } from "lucide-react";

import type { CaseStudyPasrBlock } from "../../content/case-studies";

import { SectionReveal } from "./SectionReveal";

type Props = {
  /** DOM id for deep-linking + scroll-mt anchor. */
  id: string;
  /** Heading id for aria-labelledby. */
  headingId: string;
  content: CaseStudyPasrBlock;
  tone: "surface" | "muted";
};

export const PasrSection: FC<Props> = ({ id, headingId, content, tone }) => {
  const bgClass =
    tone === "muted" ? "bg-[var(--color-slate-50)]" : "bg-[var(--color-bg)]";

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={`scroll-mt-24 border-b border-[var(--color-border)] ${bgClass} py-20 sm:py-24`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
            {content.eyebrow}
          </p>
          <h2
            id={headingId}
            className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl"
          >
            {content.heading}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[var(--color-slate-800)]">
            {content.lede}
          </p>
        </header>

        <SectionReveal className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <ul className="list-none space-y-3" aria-label={content.eyebrow}>
            {content.bullets.map((bullet, idx) => (
              <li
                key={idx}
                className="flex gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-sm leading-relaxed text-[var(--color-slate-800)]"
              >
                <span
                  aria-hidden="true"
                  className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-[var(--radius-full)] bg-[var(--color-primary-50)] text-[11px] font-semibold text-[var(--color-primary-700)]"
                >
                  {idx + 1}
                </span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>

          {content.callout ? (
            <aside
              aria-label="Section callout"
              className="h-fit rounded-[var(--radius-lg)] border border-[var(--color-primary-600)] bg-[var(--color-primary-50)] p-6"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-primary-700)]">
                Key anchor
              </p>
              <p className="mt-3 font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-[var(--color-fg)]">
                {content.callout.value}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-slate-800)]">
                {content.callout.label}
              </p>
              {content.callout.source ? (
                <p className="mt-4 text-xs leading-relaxed">
                  {content.callout.source.kind === "primary" ? (
                    <a
                      href={content.callout.source.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[var(--color-primary-700)] underline underline-offset-2"
                    >
                      {content.callout.source.label}
                      <ExternalLink size={11} aria-hidden="true" />
                    </a>
                  ) : (
                    <span className="text-[var(--color-muted)]">
                      {content.callout.source.label}
                    </span>
                  )}
                </p>
              ) : null}
            </aside>
          ) : null}
        </SectionReveal>
      </div>
    </section>
  );
};

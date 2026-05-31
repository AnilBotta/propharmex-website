/**
 * CapabilityMatrix — shared hub capability grid, RSC.
 *
 * Renders an ordered card grid for any hub pillar — dosage forms,
 * service families, etc. `live` cards link to the leaf detail page (built
 * by joining `hrefBase` + `card.slug`); cards whose leaf is `shipping-next`
 * render as a muted disabled affordance.
 *
 * Generalized in PR-J' from the original pharm-dev-only version (PR-H'
 * hoisted from `components/pharmdev/`). Now requires explicit prop wiring
 * for href base, section id, heading id, grid aria-label, and grid column
 * count — every consumer page passes the values that fit its pillar.
 *
 * Today's consumers (PR-J'+):
 * - /services/pharmaceutical-development → 7 dosage forms, 3-col grid,
 *   hrefBase `/services/pharmaceutical-development`
 * - /dosage-forms → 7 dosage forms (same shape, same hrefBase, same grid)
 */
import type { FC } from "react";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

import type { PharmDevCapabilityMatrix } from "../../../content/pharmaceutical-development";

import { SectionReveal } from "./SectionReveal";

interface Props {
  content: PharmDevCapabilityMatrix;
  /** URL prefix joined with each card's slug to build the leaf link. */
  hrefBase: string;
  /** DOM id on the wrapping <section>; powers in-page deep-links. */
  sectionId: string;
  /** DOM id on the heading; the section's `aria-labelledby` references it. */
  headingId: string;
  /** Accessible name for the card grid `<ul>`. */
  gridLabel: string;
  /** Column count on lg+ viewports. Defaults to 3 (matches pharm-dev hub). */
  gridCols?: 2 | 3;
}

export const CapabilityMatrix: FC<Props> = ({
  content,
  hrefBase,
  sectionId,
  headingId,
  gridLabel,
  gridCols = 3,
}) => {
  const lgGridClass = gridCols === 2 ? "lg:grid-cols-2" : "lg:grid-cols-3";
  return (
    <section
      id={sectionId}
      aria-labelledby={headingId}
      className="scroll-mt-24 border-b border-[var(--color-border)] bg-[var(--color-bg)] py-20 sm:py-24"
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

        <SectionReveal className="mt-12">
          <ul
            className={`grid grid-cols-1 gap-5 md:grid-cols-2 ${lgGridClass}`}
            aria-label={gridLabel}
          >
            {content.forms.map((form) => {
              const isLive = form.leafStatus === "live";
              const href = `${hrefBase}/${form.slug}`;
              const cardClasses = `flex h-full flex-col gap-3 rounded-[var(--radius-lg)] border p-5 ${
                isLive
                  ? "border-[var(--color-primary-600)] bg-[var(--color-surface)]"
                  : "border-[var(--color-border)] bg-[var(--color-slate-50)]"
              }`;

              const body = (
                <article className={cardClasses}>
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-[var(--radius-full)] border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] ${
                        isLive
                          ? "border-[var(--color-primary-600)] bg-[var(--color-primary-50)] text-[var(--color-primary-700)]"
                          : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)]"
                      }`}
                    >
                      {isLive ? (
                        <>
                          <ArrowRight aria-hidden="true" size={11} />
                          {content.liveCopy}
                        </>
                      ) : (
                        <>
                          <Clock aria-hidden="true" size={11} />
                          {content.shippingNextCopy}
                        </>
                      )}
                    </span>
                  </div>
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-[var(--color-fg)]">
                    {form.label}
                  </h3>
                  <p className="text-sm leading-relaxed text-[var(--color-slate-800)]">
                    {form.blurb}
                  </p>
                  <ul className="mt-auto flex flex-wrap gap-1.5 pt-2" aria-label="Highlights">
                    {form.highlights.map((chip) => (
                      <li
                        key={chip}
                        className="inline-flex items-center rounded-[var(--radius-full)] border border-[var(--color-border)] bg-[var(--color-slate-50)] px-2 py-0.5 text-[11px] font-medium text-[var(--color-slate-800)]"
                      >
                        {chip}
                      </li>
                    ))}
                  </ul>
                </article>
              );

              return (
                <li key={form.slug} className="list-none">
                  {isLive ? (
                    <Link
                      href={href}
                      className="block rounded-[var(--radius-lg)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-sm)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                    >
                      {body}
                    </Link>
                  ) : (
                    <div aria-disabled="true">{body}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </SectionReveal>
      </div>
    </section>
  );
};

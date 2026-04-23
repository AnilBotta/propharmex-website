/**
 * ComparisonTable — /facilities, RSC.
 *
 * Two-hub side-by-side comparison for procurement/quality reviewers. Rendered
 * as a semantic table on ≥md viewports and as a stacked card list below.
 * Primary-source footnotes use FacilitySource; internal-only claims render as
 * muted copy with no outbound link (matches Prompt 8's three-tier convention).
 */
import type { FC } from "react";
import { ExternalLink } from "lucide-react";

import type { FacilitiesComparison } from "../../content/facilities";

import { SectionReveal } from "./SectionReveal";

type Props = { content: FacilitiesComparison };

export const ComparisonTable: FC<Props> = ({ content }) => {
  return (
    <section
      id="compare"
      aria-labelledby="facilities-compare-heading"
      className="scroll-mt-24 border-b border-[var(--color-border)] bg-[var(--color-bg)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
            {content.eyebrow}
          </p>
          <h2
            id="facilities-compare-heading"
            className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl"
          >
            {content.heading}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[var(--color-slate-800)]">
            {content.lede}
          </p>
        </header>

        <SectionReveal className="mt-12">
          {/* Desktop + tablet: semantic table */}
          <div className="hidden overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] md:block">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-[var(--color-slate-50)] text-xs uppercase tracking-[0.08em] text-[var(--color-muted)]">
                <tr>
                  <th scope="col" className="px-5 py-3 font-semibold">
                    Dimension
                  </th>
                  <th scope="col" className="px-5 py-3 font-semibold">
                    Mississauga, Canada
                  </th>
                  <th scope="col" className="px-5 py-3 font-semibold">
                    Hyderabad, India
                  </th>
                </tr>
              </thead>
              <tbody>
                {content.rows.map((row, idx) => (
                  <tr
                    key={row.label}
                    className={
                      idx % 2 === 0
                        ? "bg-[var(--color-surface)]"
                        : "bg-[var(--color-slate-50)]"
                    }
                  >
                    <th
                      scope="row"
                      className="align-top px-5 py-4 font-[family-name:var(--font-display)] text-sm font-semibold tracking-tight text-[var(--color-fg)]"
                    >
                      {row.label}
                      {row.note ? (
                        <span className="mt-2 block">
                          {row.note.kind === "primary" ? (
                            <a
                              href={row.note.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--color-primary-700)] underline underline-offset-2"
                            >
                              {row.note.label}
                              <ExternalLink size={11} aria-hidden="true" />
                            </a>
                          ) : (
                            <span className="text-[11px] text-[var(--color-muted)]">
                              {row.note.label}
                            </span>
                          )}
                        </span>
                      ) : null}
                    </th>
                    <td className="align-top px-5 py-4 text-[var(--color-slate-800)]">
                      {row.mississauga}
                    </td>
                    <td className="align-top px-5 py-4 text-[var(--color-slate-800)]">
                      {row.hyderabad}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile: stacked cards */}
          <ul className="flex flex-col gap-4 md:hidden" aria-label="Comparison">
            {content.rows.map((row) => (
              <li
                key={row.label}
                className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
              >
                <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.1em] text-[var(--color-muted)]">
                  {row.label}
                </p>
                <dl className="mt-3 flex flex-col gap-3 text-sm leading-relaxed">
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--color-primary-700)]">
                      Mississauga
                    </dt>
                    <dd className="mt-1 text-[var(--color-slate-800)]">
                      {row.mississauga}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--color-primary-700)]">
                      Hyderabad
                    </dt>
                    <dd className="mt-1 text-[var(--color-slate-800)]">
                      {row.hyderabad}
                    </dd>
                  </div>
                </dl>
                {row.note ? (
                  <p className="mt-3">
                    {row.note.kind === "primary" ? (
                      <a
                        href={row.note.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--color-primary-700)] underline underline-offset-2"
                      >
                        {row.note.label}
                        <ExternalLink size={11} aria-hidden="true" />
                      </a>
                    ) : (
                      <span className="text-[11px] text-[var(--color-muted)]">
                        {row.note.label}
                      </span>
                    )}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </SectionReveal>
      </div>
    </section>
  );
};

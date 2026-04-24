/**
 * SnapshotBar — detail page snapshot row, RSC.
 *
 * High-signal context bar — 4–5 labelled rows rendered as a `<dl>`.
 */
import type { FC } from "react";

import type { CaseStudySnapshotRow } from "../../content/case-studies";

type Props = { rows: CaseStudySnapshotRow[] };

export const SnapshotBar: FC<Props> = ({ rows }) => {
  return (
    <section
      aria-labelledby="cs-detail-snapshot-heading"
      className="border-b border-[var(--color-border)] bg-[var(--color-slate-50)] py-10"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 id="cs-detail-snapshot-heading" className="sr-only">
          Engagement snapshot
        </h2>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {rows.map((row) => (
            <div key={row.id}>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-muted)]">
                {row.label}
              </dt>
              <dd className="mt-1 text-sm font-medium text-[var(--color-fg)]">
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};

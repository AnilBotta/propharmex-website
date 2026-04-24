/**
 * CaseCard — grid + related rail card, RSC.
 *
 * Single render path shared between the hub filterable grid and the
 * related-cases rail on the detail page.
 */
import type { FC } from "react";
import Link from "next/link";
import { ArrowUpRight, FileText } from "lucide-react";

import type { CaseStudyCardSummary } from "../../content/case-studies";
import {
  CASE_INDUSTRY_FILTERS,
  CASE_DOSAGE_FORM_FILTERS,
  CASE_REGION_FILTERS,
} from "../../content/case-studies";

const INDUSTRY_LABEL_BY_ID = Object.fromEntries(
  CASE_INDUSTRY_FILTERS.map((f) => [f.id, f.label]),
);
const DOSAGE_LABEL_BY_ID = Object.fromEntries(
  CASE_DOSAGE_FORM_FILTERS.map((f) => [f.id, f.label]),
);
const REGION_LABEL_BY_ID = Object.fromEntries(
  CASE_REGION_FILTERS.map((f) => [f.id, f.label]),
);

type Props = {
  card: CaseStudyCardSummary;
  /** Optional documentation-availability note shown at the card foot. */
  documentationNote?: string;
};

export const CaseCard: FC<Props> = ({ card, documentationNote }) => {
  const href = `/case-studies/${card.slug}`;
  return (
    <Link
      href={href}
      className="group flex h-full flex-col rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition hover:-translate-y-0.5 hover:border-[var(--color-primary-600)] hover:shadow-[var(--shadow-sm)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] motion-reduce:hover:translate-y-0 motion-reduce:transition-none"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-primary-700)]">
          {INDUSTRY_LABEL_BY_ID[card.industry]}
        </p>
        <ArrowUpRight
          aria-hidden="true"
          size={16}
          className="mt-0.5 text-[var(--color-muted)] transition group-hover:text-[var(--color-primary-700)]"
        />
      </div>

      <h3 className="mt-2 font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-[var(--color-fg)]">
        {card.title}
      </h3>

      <p className="mt-2 text-sm leading-relaxed text-[var(--color-slate-800)]">
        {card.teaser}
      </p>

      <dl className="mt-4 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-slate-50)] px-3 py-2">
        <dt className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--color-muted)]">
          Outcome
        </dt>
        <dd className="mt-1 font-[family-name:var(--font-display)] text-base font-semibold text-[var(--color-fg)]">
          {card.metricValue}
        </dd>
        <dd className="text-xs leading-snug text-[var(--color-slate-800)]">
          {card.metricLabel}
        </dd>
      </dl>

      <ul
        className="mt-4 flex flex-wrap gap-1.5"
        aria-label="Case study taxonomy"
      >
        <li className="inline-flex items-center rounded-[var(--radius-full)] border border-[var(--color-border)] bg-[var(--color-slate-50)] px-2 py-0.5 text-[11px] font-medium text-[var(--color-slate-800)]">
          {DOSAGE_LABEL_BY_ID[card.dosageForm]}
        </li>
        <li className="inline-flex items-center rounded-[var(--radius-full)] border border-[var(--color-border)] bg-[var(--color-slate-50)] px-2 py-0.5 text-[11px] font-medium text-[var(--color-slate-800)]">
          {REGION_LABEL_BY_ID[card.region]}
        </li>
      </ul>

      <p className="mt-4 text-[11px] font-medium text-[var(--color-muted)]">
        Client: {card.client}
      </p>

      {documentationNote ? (
        <p className="mt-auto inline-flex items-center gap-2 rounded-[var(--radius-full)] border border-[var(--color-border)] bg-[var(--color-slate-50)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--color-muted)] self-start">
          <FileText size={11} aria-hidden="true" />
          {documentationNote}
        </p>
      ) : null}
    </Link>
  );
};

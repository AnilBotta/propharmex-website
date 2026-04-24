"use client";

/**
 * InstrumentInventory — analytical leaf sortable instrument table.
 *
 * Client island because the table is sortable by technique (per Prompt 11 spec).
 * Semantic <table> with ARIA sort attributes; header buttons toggle between
 * ascending, descending, and unsorted (insertion order from the content file).
 *
 * Mobile: horizontal scroll inside a rounded wrapper. Row minimum height and
 * keep-together styling preserved so scan-reading stays easy.
 */
import { useMemo, useState, type FC } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUp, ArrowRight, ArrowUpDown } from "lucide-react";

import { Button } from "@propharmex/ui";

import type {
  AnalyticalInstrumentInventory,
  InstrumentRow,
} from "../../content/analytical-services";

import { SectionReveal } from "./SectionReveal";

type Props = { content: AnalyticalInstrumentInventory };

type SortDirection = "asc" | "desc" | null;

export const InstrumentInventory: FC<Props> = ({ content }) => {
  const [direction, setDirection] = useState<SortDirection>(null);

  const sortedRows = useMemo(() => {
    if (direction === null) return content.rows;
    const copy = [...content.rows];
    copy.sort((a, b) => {
      const cmp = a.technique.localeCompare(b.technique, "en", {
        sensitivity: "base",
      });
      return direction === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [content.rows, direction]);

  function cycleSort() {
    setDirection((prev) => {
      if (prev === null) return "asc";
      if (prev === "asc") return "desc";
      return null;
    });
  }

  const ariaSort =
    direction === "asc"
      ? "ascending"
      : direction === "desc"
        ? "descending"
        : "none";

  return (
    <section
      id="inventory"
      aria-labelledby="as-leaf-inventory-heading"
      className="scroll-mt-24 border-b border-[var(--color-border)] bg-[var(--color-slate-50)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
            {content.eyebrow}
          </p>
          <h2
            id="as-leaf-inventory-heading"
            className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl"
          >
            {content.heading}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[var(--color-slate-800)]">
            {content.lede}
          </p>
        </header>

        <SectionReveal className="mt-12">
          <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-xs)]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <caption className="sr-only">
                  Representative instrument inventory, sortable by technique.
                </caption>
                <thead className="border-b border-[var(--color-border)] bg-[var(--color-slate-50)] text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-muted)]">
                  <tr>
                    <th scope="col" className="px-4 py-3">
                      Instrument
                    </th>
                    <th scope="col" aria-sort={ariaSort} className="px-4 py-3">
                      <button
                        type="button"
                        onClick={cycleSort}
                        className="inline-flex items-center gap-1 rounded-[var(--radius-xs)] px-1 py-0.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-muted)] hover:text-[var(--color-primary-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
                        aria-label={`Sort by technique (${direction ?? "unsorted"})`}
                      >
                        Technique
                        <SortIndicator direction={direction} />
                      </button>
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Application
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Qualification
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Location
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)] text-[var(--color-slate-800)]">
                  {sortedRows.map((row) => (
                    <TableRow key={row.id} row={row} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p className="mt-6 text-xs leading-relaxed text-[var(--color-muted)]">
            {content.representativeNote}
          </p>

          <div className="mt-8">
            <Button asChild variant={content.cta.variant} size="lg">
              <Link href={content.cta.href}>
                {content.cta.label}
                <ArrowRight aria-hidden="true" size={16} />
              </Link>
            </Button>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
};

function TableRow({ row }: { row: InstrumentRow }) {
  return (
    <tr className="align-top">
      <td className="px-4 py-3 font-medium text-[var(--color-fg)]">
        {row.instrument}
      </td>
      <td className="px-4 py-3">
        <span className="inline-flex items-center rounded-[var(--radius-full)] border border-[var(--color-border)] bg-[var(--color-slate-50)] px-2 py-0.5 text-[11px] font-semibold text-[var(--color-slate-800)]">
          {row.technique}
        </span>
      </td>
      <td className="px-4 py-3">{row.application}</td>
      <td className="px-4 py-3">{row.qualification}</td>
      <td className="px-4 py-3 whitespace-nowrap">{row.location}</td>
    </tr>
  );
}

function SortIndicator({ direction }: { direction: SortDirection }) {
  if (direction === "asc") return <ArrowUp size={11} aria-hidden="true" />;
  if (direction === "desc") return <ArrowDown size={11} aria-hidden="true" />;
  return <ArrowUpDown size={11} aria-hidden="true" />;
}

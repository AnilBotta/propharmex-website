/**
 * EquipmentList — /facilities/[site] detail, RSC.
 *
 * Representative equipment grid. The full validated inventory with
 * qualification dates is deliberately NOT published here (per CLAUDE.md §10
 * precedent set by Prompt 8's AuditHistory) — the CTA routes to /contact for
 * the current record.
 *
 * The richer sortable instrument inventory lives on the analytical sub-pages
 * in Prompt 11.
 */
import type { FC } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@propharmex/ui";

import type { FacilityEquipmentList } from "../../content/facilities";

import { SectionReveal } from "./SectionReveal";

type Props = { content: FacilityEquipmentList };

export const EquipmentList: FC<Props> = ({ content }) => {
  return (
    <section
      id="equipment"
      aria-labelledby="facility-equipment-heading"
      className="scroll-mt-24 border-b border-[var(--color-border)] bg-[var(--color-slate-50)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
            {content.eyebrow}
          </p>
          <h2
            id="facility-equipment-heading"
            className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl"
          >
            {content.heading}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[var(--color-slate-800)]">
            {content.lede}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)]">
            {content.representativeNote}
          </p>
        </header>

        <SectionReveal className="mt-12">
          <ul
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            aria-label="Representative equipment"
          >
            {content.items.map((item) => (
              <li key={item.id} className="list-none">
                <article className="flex h-full flex-col gap-2 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
                  <span className="inline-flex w-fit items-center rounded-[var(--radius-full)] border border-[var(--color-border)] bg-[var(--color-slate-50)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--color-muted)]">
                    {item.category}
                  </span>
                  <h3 className="font-[family-name:var(--font-display)] text-base font-semibold tracking-tight text-[var(--color-fg)]">
                    {item.label}
                  </h3>
                  <p className="text-sm leading-relaxed text-[var(--color-slate-800)]">
                    {item.detail}
                  </p>
                </article>
              </li>
            ))}
          </ul>

          <div className="mt-10">
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

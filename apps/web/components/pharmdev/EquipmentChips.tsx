/**
 * EquipmentChips — leaf equipment & techniques chip groups, RSC.
 *
 * Scannable chip clusters grouped by category. Same "representative list,
 * validated inventory on request" posture as the facilities EquipmentList.
 */
import type { FC } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@propharmex/ui";

import type { DosageFormEquipment } from "../../content/pharmaceutical-development";

import { SectionReveal } from "./SectionReveal";

type Props = { content: DosageFormEquipment };

export const EquipmentChips: FC<Props> = ({ content }) => {
  return (
    <section
      id="equipment"
      aria-labelledby="pd-leaf-equipment-heading"
      className="scroll-mt-24 border-b border-[var(--color-border)] bg-[var(--color-slate-50)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
            {content.eyebrow}
          </p>
          <h2
            id="pd-leaf-equipment-heading"
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
          <ul className="flex flex-col gap-6" aria-label="Equipment categories">
            {content.groups.map((group) => (
              <li key={group.id} className="list-none">
                <article className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
                  <h3 className="font-[family-name:var(--font-display)] text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]">
                    {group.category}
                  </h3>
                  <ul
                    className="mt-3 flex flex-wrap gap-2"
                    aria-label={`${group.category} equipment`}
                  >
                    {group.chips.map((chip) => (
                      <li
                        key={chip}
                        className="inline-flex items-center rounded-[var(--radius-full)] border border-[var(--color-border)] bg-[var(--color-slate-50)] px-3 py-1 text-[12px] font-medium text-[var(--color-slate-800)]"
                      >
                        {chip}
                      </li>
                    ))}
                  </ul>
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

/**
 * WarehouseMap — /facilities/mississauga-canada detail only, RSC.
 *
 * Schematic 3×2 zone grid. We do NOT render a real floor plan on the public
 * site — that sits in the pre-visit briefing pack under NDA. This component
 * shows only the zoning logic (inbound / storage / outbound separation) and
 * the temperature-zone footprint.
 */
import type { FC } from "react";

import type {
  FacilityWarehouseMap,
  WarehouseZone,
} from "../../content/facilities";

import { SectionReveal } from "./SectionReveal";

type Props = { content: FacilityWarehouseMap };

const TONE_CLASS: Record<WarehouseZone["tone"], string> = {
  neutral:
    "border-[var(--color-border)] bg-[var(--color-slate-50)] text-[var(--color-slate-800)]",
  cool:
    "border-[var(--color-primary-600)] bg-[var(--color-primary-50)] text-[var(--color-primary-700)]",
  cold:
    "border-[var(--color-primary-700)] bg-[var(--color-primary-100)] text-[var(--color-primary-700)]",
  secure:
    "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-fg)]",
  warm:
    "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-slate-800)]",
};

const TONE_SWATCH: Record<WarehouseZone["tone"], string> = {
  neutral: "bg-[var(--color-slate-200)]",
  cool: "bg-[var(--color-primary-300)]",
  cold: "bg-[var(--color-primary-600)]",
  secure: "bg-[var(--color-fg)]",
  warm: "bg-[var(--color-primary-100)]",
};

const GRID_CLASS: Record<string, string> = {
  "1-1": "col-start-1 row-start-1",
  "2-1": "col-start-2 row-start-1",
  "3-1": "col-start-3 row-start-1",
  "1-2": "col-start-1 row-start-2",
  "2-2": "col-start-2 row-start-2",
  "3-2": "col-start-3 row-start-2",
};

export const WarehouseMap: FC<Props> = ({ content }) => {
  return (
    <section
      id="warehouse"
      aria-labelledby="facility-warehouse-heading"
      className="scroll-mt-24 border-b border-[var(--color-border)] bg-[var(--color-slate-50)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
            {content.eyebrow}
          </p>
          <h2
            id="facility-warehouse-heading"
            className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl"
          >
            {content.heading}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[var(--color-slate-800)]">
            {content.lede}
          </p>
        </header>

        <SectionReveal className="mt-12">
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8">
            <div className="grid grid-cols-3 grid-rows-2 gap-3 sm:gap-4">
              {content.zones.map((zone) => {
                const grid = GRID_CLASS[`${zone.grid.col}-${zone.grid.row}`];
                return (
                  <div
                    key={zone.id}
                    className={`${grid} flex flex-col justify-between rounded-[var(--radius-md)] border p-4 text-sm ${TONE_CLASS[zone.tone]}`}
                  >
                    <p className="font-[family-name:var(--font-display)] text-sm font-semibold tracking-tight">
                      {zone.label}
                    </p>
                    <p className="mt-2 text-[11px] leading-relaxed opacity-80">
                      {zone.subLabel}
                    </p>
                  </div>
                );
              })}
            </div>

            <dl className="mt-6 grid grid-cols-1 gap-2 text-xs text-[var(--color-muted)] sm:grid-cols-2 lg:grid-cols-3">
              {content.legend.map((entry) => (
                <div key={entry.tone} className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className={`size-3 shrink-0 rounded-sm ${TONE_SWATCH[entry.tone]}`}
                  />
                  <span>{entry.label}</span>
                </div>
              ))}
            </dl>

            <p className="mt-5 text-xs leading-relaxed text-[var(--color-muted)]">
              {content.schematicNote}
            </p>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
};

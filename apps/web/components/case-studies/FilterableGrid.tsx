"use client";

/**
 * FilterableGrid — /case-studies hub filterable card grid, client island.
 *
 * Single-select dropdowns per taxonomy (industry, service, dosage form, region).
 * Filters stack (AND). "All" restores the full list. "Clear filters" resets
 * every selector to "All" in one click.
 *
 * Accessibility:
 *  - Each selector is a labelled `<select>` native control — keyboard and
 *    assistive-tech support comes for free.
 *  - The result list uses `aria-live="polite"` so screen readers announce
 *    the new count after a filter change.
 *  - The empty state is inside the same live region, so the "no matches"
 *    message is announced without a page reload.
 */
import { useMemo, useState } from "react";
import type { FC } from "react";

import {
  CASE_DOSAGE_FORM_FILTERS,
  CASE_INDUSTRY_FILTERS,
  CASE_REGION_FILTERS,
  CASE_SERVICE_FILTERS,
  type CaseDosageForm,
  type CaseIndustry,
  type CaseRegion,
  type CaseService,
  type CaseStudyCardSummary,
  type CaseStudyHubFilterCopy,
} from "../../content/case-studies";

import { CaseCard } from "./CaseCard";

type AnyIndustry = CaseIndustry | "all";
type AnyService = CaseService | "all";
type AnyDosageForm = CaseDosageForm | "all";
type AnyRegion = CaseRegion | "all";

type Props = {
  cards: CaseStudyCardSummary[];
  copy: CaseStudyHubFilterCopy;
};

export const FilterableGrid: FC<Props> = ({ cards, copy }) => {
  const [industry, setIndustry] = useState<AnyIndustry>("all");
  const [service, setService] = useState<AnyService>("all");
  const [dosageForm, setDosageForm] = useState<AnyDosageForm>("all");
  const [region, setRegion] = useState<AnyRegion>("all");

  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      if (industry !== "all" && card.industry !== industry) return false;
      if (service !== "all" && !card.services.includes(service)) return false;
      if (dosageForm !== "all" && card.dosageForm !== dosageForm) return false;
      if (region !== "all" && card.region !== region) return false;
      return true;
    });
  }, [cards, industry, service, dosageForm, region]);

  const hasActiveFilter =
    industry !== "all" ||
    service !== "all" ||
    dosageForm !== "all" ||
    region !== "all";

  const countSuffix =
    filteredCards.length === 1 ? copy.resultCountSingular : copy.resultCountPlural;

  function resetFilters() {
    setIndustry("all");
    setService("all");
    setDosageForm("all");
    setRegion("all");
  }

  return (
    <section
      id="filterable"
      aria-labelledby="cs-hub-filter-heading"
      className="scroll-mt-24 border-b border-[var(--color-border)] bg-[var(--color-slate-50)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
            {copy.eyebrow}
          </p>
          <h2
            id="cs-hub-filter-heading"
            className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl"
          >
            {copy.heading}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[var(--color-slate-800)]">
            {copy.lede}
          </p>
        </header>

        <div
          className="mt-10 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
          role="group"
          aria-labelledby="cs-hub-filter-heading"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <FilterSelect
              id="f-industry"
              label={copy.industryLabel}
              allLabel={copy.allOptionLabel}
              value={industry}
              onChange={(v) => setIndustry(v as AnyIndustry)}
              options={CASE_INDUSTRY_FILTERS}
            />
            <FilterSelect
              id="f-service"
              label={copy.serviceLabel}
              allLabel={copy.allOptionLabel}
              value={service}
              onChange={(v) => setService(v as AnyService)}
              options={CASE_SERVICE_FILTERS}
            />
            <FilterSelect
              id="f-dosage"
              label={copy.dosageFormLabel}
              allLabel={copy.allOptionLabel}
              value={dosageForm}
              onChange={(v) => setDosageForm(v as AnyDosageForm)}
              options={CASE_DOSAGE_FORM_FILTERS}
            />
            <FilterSelect
              id="f-region"
              label={copy.regionLabel}
              allLabel={copy.allOptionLabel}
              value={region}
              onChange={(v) => setRegion(v as AnyRegion)}
              options={CASE_REGION_FILTERS}
            />
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p
              aria-live="polite"
              className="text-sm text-[var(--color-slate-800)]"
            >
              <span className="font-semibold text-[var(--color-fg)]">
                {filteredCards.length}
              </span>{" "}
              {countSuffix}
            </p>
            {hasActiveFilter ? (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-xs font-medium text-[var(--color-fg)] transition hover:border-[var(--color-primary-600)] hover:text-[var(--color-primary-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
              >
                {copy.clearFiltersLabel}
              </button>
            ) : null}
          </div>
        </div>

        <div className="mt-10" aria-live="polite">
          {filteredCards.length > 0 ? (
            <ul
              className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
              aria-label="Case study results"
            >
              {filteredCards.map((card) => (
                <li key={card.slug} className="list-none">
                  <CaseCard
                    card={card}
                    documentationNote="Documentation on request"
                  />
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center">
              <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--color-fg)]">
                {copy.emptyStateTitle}
              </h3>
              <p className="mt-2 text-sm text-[var(--color-slate-800)]">
                {copy.emptyStateBody}
              </p>
            </div>
          )}
        </div>

        <p className="mt-8 text-xs leading-relaxed text-[var(--color-muted)]">
          {copy.documentationNote}
        </p>
      </div>
    </section>
  );
};

type FilterOption = { id: string; label: string };

type FilterSelectProps = {
  id: string;
  label: string;
  allLabel: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly FilterOption[];
};

function FilterSelect({
  id,
  label,
  allLabel,
  value,
  onChange,
  options,
}: FilterSelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-muted)]"
      >
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-fg)] transition hover:border-[var(--color-primary-600)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
      >
        <option value="all">{allLabel}</option>
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

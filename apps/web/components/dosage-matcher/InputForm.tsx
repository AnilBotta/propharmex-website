"use client";

/**
 * Input form for the Dosage Form Capability Matcher.
 *
 * Two paths in one form (per Prompt 21 spec): a free-text description
 * and an optional set of structured filters. The user can submit with
 * either, both, or neither — but at least one must be filled. The
 * orchestrator surfaces an inline error when both are empty.
 *
 * Accessibility: labelled controls, real `<select>` and `<textarea>`,
 * placeholder + help text. The submit button announces "Matching…"
 * while the request is in flight.
 */
import {
  API_TYPES,
  DEVELOPMENT_STAGES,
  PATIENT_POPULATIONS,
  RELEASE_PROFILES,
  type ApiType,
  type DevelopmentStage,
  type MatcherInput,
  type PatientPopulation,
  type ReleaseProfile,
} from "@propharmex/lib/dosage-matcher";

import { DOSAGE_MATCHER } from "../../content/dosage-matcher";

interface Props {
  value: MatcherInput;
  onChange: (next: MatcherInput) => void;
  onSubmit: () => void;
  errorMessage?: string | null;
  submitting: boolean;
}

export function InputForm({
  value,
  onChange,
  onSubmit,
  errorMessage,
  submitting,
}: Props) {
  function setDescription(next: string) {
    onChange({ ...value, description: next || undefined });
  }
  function setFilter<K extends keyof NonNullable<MatcherInput["filters"]>>(
    key: K,
    next: NonNullable<MatcherInput["filters"]>[K] | undefined,
  ) {
    const filters = { ...(value.filters ?? {}) };
    if (next === undefined || next === "" || next === null) {
      delete filters[key];
    } else {
      filters[key] = next;
    }
    onChange({
      ...value,
      filters: Object.keys(filters).length > 0 ? filters : undefined,
    });
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (submitting) return;
        onSubmit();
      }}
      className="flex flex-col gap-6"
    >
      {/* Free-text description */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="dm-description"
          className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-muted)]"
        >
          {DOSAGE_MATCHER.form.descriptionLabel}
        </label>
        <textarea
          id="dm-description"
          value={value.description ?? ""}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          maxLength={2000}
          placeholder={DOSAGE_MATCHER.form.descriptionPlaceholder}
          disabled={submitting}
          className="resize-none rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm leading-relaxed text-[var(--color-fg)] placeholder:text-[var(--color-muted)] focus-visible:border-[var(--color-primary-700)] focus-visible:outline-none disabled:opacity-60"
        />
        <p className="text-[11px] text-[var(--color-muted)]">
          {DOSAGE_MATCHER.form.descriptionHelp}
        </p>
      </div>

      {/* Filters */}
      <fieldset className="flex flex-col gap-4">
        <legend className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-muted)]">
          {DOSAGE_MATCHER.form.filtersLabel}
        </legend>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SelectField
            id="dm-api-type"
            label={DOSAGE_MATCHER.form.filterLabels.apiType}
            value={value.filters?.apiType ?? ""}
            disabled={submitting}
            onChange={(v) =>
              setFilter("apiType", v ? (v as ApiType) : undefined)
            }
            options={API_TYPES.map((id) => ({
              id,
              label: DOSAGE_MATCHER.humanize.apiType[id],
            }))}
          />

          <div className="flex flex-col gap-1">
            <label
              htmlFor="dm-indication"
              className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-muted)]"
            >
              {DOSAGE_MATCHER.form.filterLabels.indicationArea}
            </label>
            <input
              id="dm-indication"
              type="text"
              maxLength={120}
              value={value.filters?.indicationArea ?? ""}
              onChange={(e) =>
                setFilter("indicationArea", e.target.value || undefined)
              }
              placeholder={DOSAGE_MATCHER.form.indicationPlaceholder}
              disabled={submitting}
              className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-fg)] placeholder:text-[var(--color-muted)] focus-visible:border-[var(--color-primary-700)] focus-visible:outline-none disabled:opacity-60"
            />
          </div>

          <SelectField
            id="dm-release-profile"
            label={DOSAGE_MATCHER.form.filterLabels.releaseProfile}
            value={value.filters?.releaseProfile ?? ""}
            disabled={submitting}
            onChange={(v) =>
              setFilter("releaseProfile", v ? (v as ReleaseProfile) : undefined)
            }
            options={RELEASE_PROFILES.map((id) => ({
              id,
              label: DOSAGE_MATCHER.humanize.releaseProfile[id],
            }))}
          />

          <SelectField
            id="dm-patient-pop"
            label={DOSAGE_MATCHER.form.filterLabels.patientPopulation}
            value={value.filters?.patientPopulation ?? ""}
            disabled={submitting}
            onChange={(v) =>
              setFilter(
                "patientPopulation",
                v ? (v as PatientPopulation) : undefined,
              )
            }
            options={PATIENT_POPULATIONS.map((id) => ({
              id,
              label: DOSAGE_MATCHER.humanize.patientPopulation[id],
            }))}
          />

          <SelectField
            id="dm-dev-stage"
            label={DOSAGE_MATCHER.form.filterLabels.developmentStage}
            value={value.filters?.developmentStage ?? ""}
            disabled={submitting}
            onChange={(v) =>
              setFilter(
                "developmentStage",
                v ? (v as DevelopmentStage) : undefined,
              )
            }
            options={DEVELOPMENT_STAGES.map((id) => ({
              id,
              label: DOSAGE_MATCHER.humanize.developmentStage[id],
            }))}
          />
        </div>
      </fieldset>

      {/* Error + submit */}
      {errorMessage ? (
        <p
          role="alert"
          className="rounded-[var(--radius-md)] border border-[var(--color-danger)] bg-[color-mix(in_oklab,var(--color-danger)_10%,transparent)] px-3 py-2 text-sm text-[var(--color-danger)]"
        >
          {errorMessage}
        </p>
      ) : null}

      <div className="flex items-center justify-end gap-3 border-t border-[var(--color-border)] pt-4">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-1.5 rounded-[var(--radius-md)] bg-[var(--color-primary-700)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-primary-800)] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-1"
        >
          {submitting
            ? DOSAGE_MATCHER.form.submittingLabel
            : DOSAGE_MATCHER.form.submitLabel}
        </button>
      </div>
    </form>
  );
}

/* -------------------------------------------------------------------------- */
/*  Small select wrapper                                                       */
/* -------------------------------------------------------------------------- */

function SelectField({
  id,
  label,
  value,
  disabled,
  onChange,
  options,
}: {
  id: string;
  label: string;
  value: string;
  disabled: boolean;
  onChange: (v: string) => void;
  options: readonly { id: string; label: string }[];
}) {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={id}
        className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-muted)]"
      >
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-fg)] focus-visible:border-[var(--color-primary-700)] focus-visible:outline-none disabled:opacity-60"
      >
        <option value="">{DOSAGE_MATCHER.form.selectAny}</option>
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

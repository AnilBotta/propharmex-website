"use client";

/**
 * Single rubric question rendered as a radio group.
 *
 * Accessibility: real <fieldset> + <legend>, real radio inputs, label
 * associations via `htmlFor` so a screen reader announces the prompt as
 * the group label and each option as a labelled choice. The Next button
 * lives in the parent (Assessment) so the form keeps a single tab order.
 *
 * Branching is handled by the parent (it filters the question list before
 * passing one in here). This component is dumb — it just renders the
 * current question and emits the user's pick.
 */
import type { RubricQuestion } from "@propharmex/lib/del-readiness";

import { DEL_READINESS } from "../../content/del-readiness";

interface Props {
  question: RubricQuestion;
  /** Currently-selected option id, if any. */
  value: string | undefined;
  /** Step indices for the progress label (1-based). */
  stepIndex: number;
  totalSteps: number;
  /** Inline error to show under the group when validation fails. */
  errorMessage?: string | null;
  onChange: (optionId: string) => void;
}

export function QuestionStep({
  question,
  value,
  stepIndex,
  totalSteps,
  errorMessage,
  onChange,
}: Props) {
  return (
    <fieldset className="flex flex-col gap-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-muted)]">
        {DEL_READINESS.form.progressLabel(stepIndex, totalSteps)}
      </p>
      <legend className="font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight text-[var(--color-fg)]">
        {question.prompt}
      </legend>
      {question.helpText ? (
        <p className="-mt-2 text-sm leading-relaxed text-[var(--color-slate-800)]">
          {question.helpText}
        </p>
      ) : null}

      <div
        role="radiogroup"
        aria-label={DEL_READINESS.form.radioGroupAriaLabel}
        className="flex flex-col gap-2"
      >
        {question.options.map((opt) => {
          const id = `${question.id}__${opt.id}`;
          const checked = value === opt.id;
          return (
            <label
              key={opt.id}
              htmlFor={id}
              className={`flex cursor-pointer items-start gap-3 rounded-[var(--radius-md)] border px-4 py-3 text-sm leading-relaxed transition focus-within:ring-2 focus-within:ring-[var(--color-ring)] ${
                checked
                  ? "border-[var(--color-primary-700)] bg-[var(--color-primary-50)] text-[var(--color-fg)]"
                  : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-fg)] hover:border-[var(--color-primary-700)]"
              }`}
            >
              <input
                id={id}
                type="radio"
                name={question.id}
                value={opt.id}
                checked={checked}
                onChange={() => onChange(opt.id)}
                className="mt-0.5 size-4 shrink-0 accent-[var(--color-primary-700)]"
              />
              <span>{opt.label}</span>
            </label>
          );
        })}
      </div>

      {errorMessage ? (
        <p
          role="alert"
          className="text-sm font-medium text-[var(--color-danger)]"
        >
          {errorMessage}
        </p>
      ) : null}
    </fieldset>
  );
}

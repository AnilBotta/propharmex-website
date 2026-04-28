"use client";

/**
 * Results screen shown after the assessment is synthesized.
 *
 * Renders three blocks:
 *   1. Overall score gauge + traffic-light pill
 *   2. Per-category breakdown (label → score → traffic light)
 *   3. Gaps list + prioritized remediation list (from the model)
 *
 * Action footer: "Book a DEL consultation" (PR-A points at /contact;
 * PR-B swaps in a Cal.com embed) + "Download report" (disabled in PR-A,
 * wired in PR-B) + "Re-take" (resets the form).
 */
import { Calendar, Download, RefreshCw } from "lucide-react";

import type {
  Assessment,
  Rubric,
} from "@propharmex/lib/del-readiness";

import { DEL_READINESS } from "../../content/del-readiness";

import { TrafficLightPill } from "./TrafficLight";

interface Props {
  assessment: Assessment;
  rubric: Rubric;
  onRetake: () => void;
}

export function ResultsScreen({ assessment, rubric, onRetake }: Props) {
  const categoryLabel = (id: string) =>
    rubric.categories.find((c) => c.id === id)?.label ?? id;

  return (
    <div className="flex flex-col gap-8">
      {/* Disclaimer banner — always at the top of the results. */}
      <div
        role="note"
        className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm leading-relaxed text-[var(--color-slate-800)]"
      >
        {DEL_READINESS.disclaimer}
      </div>

      {/* Overall score */}
      <section
        aria-labelledby="del-results-overall"
        className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8"
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
          {DEL_READINESS.results.eyebrow}
        </p>
        <div className="mt-3 flex flex-wrap items-end gap-4">
          <div>
            <p
              id="del-results-overall"
              className="text-sm font-medium text-[var(--color-muted)]"
            >
              {DEL_READINESS.results.overallLabel}
            </p>
            <p className="font-[family-name:var(--font-display)] text-5xl font-semibold tracking-tight text-[var(--color-fg)]">
              {assessment.score}
              <span className="text-2xl font-normal text-[var(--color-muted)]">
                {" "}
                {DEL_READINESS.results.overallSuffix}
              </span>
            </p>
          </div>
          <TrafficLightPill level={assessment.trafficLight} />
        </div>
        <ScoreBar score={assessment.score} level={assessment.trafficLight} />
      </section>

      {/* Per-category */}
      <section aria-labelledby="del-results-categories">
        <h2
          id="del-results-categories"
          className="font-[family-name:var(--font-display)] text-base font-semibold tracking-tight text-[var(--color-fg)]"
        >
          {DEL_READINESS.results.categoriesHeading}
        </h2>
        <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {assessment.categoryScores.map((cs) => (
            <li
              key={cs.category}
              className="flex items-center justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-[var(--color-fg)]">
                  {categoryLabel(cs.category)}
                </p>
                <p className="mt-0.5 text-[11px] uppercase tracking-[0.08em] text-[var(--color-muted)]">
                  {cs.score} / 100
                </p>
              </div>
              <TrafficLightPill level={cs.trafficLight} size="sm" />
            </li>
          ))}
        </ul>
      </section>

      {/* Gaps */}
      <section aria-labelledby="del-results-gaps">
        <h2
          id="del-results-gaps"
          className="font-[family-name:var(--font-display)] text-base font-semibold tracking-tight text-[var(--color-fg)]"
        >
          {DEL_READINESS.results.gapsHeading}
        </h2>
        {assessment.gaps.length === 0 ? (
          <p className="mt-3 text-sm leading-relaxed text-[var(--color-slate-800)]">
            {DEL_READINESS.results.gapsEmptyBody}
          </p>
        ) : (
          <ul className="mt-4 flex flex-col gap-3">
            {assessment.gaps.map((g, i) => (
              <li
                key={i}
                className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-sm font-semibold text-[var(--color-fg)]">
                    {g.headline}
                  </p>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--color-muted)]">
                    {categoryLabel(g.category)}
                  </span>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-[var(--color-slate-800)]">
                  {g.description}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Remediation */}
      <section aria-labelledby="del-results-remediation">
        <h2
          id="del-results-remediation"
          className="font-[family-name:var(--font-display)] text-base font-semibold tracking-tight text-[var(--color-fg)]"
        >
          {DEL_READINESS.results.remediationHeading}
        </h2>
        {assessment.remediation.length === 0 ? (
          <p className="mt-3 text-sm leading-relaxed text-[var(--color-slate-800)]">
            {DEL_READINESS.results.remediationEmptyBody}
          </p>
        ) : (
          <ol className="mt-4 flex flex-col gap-3">
            {assessment.remediation.map((r, i) => (
              <li
                key={i}
                className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-sm font-semibold text-[var(--color-fg)]">
                    <span className="mr-2 inline-flex size-5 items-center justify-center rounded-[var(--radius-full)] bg-[var(--color-primary-700)] text-[10px] font-bold text-white">
                      {r.priority}
                    </span>
                    {r.action}
                  </p>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--color-muted)]">
                    {DEL_READINESS.results.effortLabel[r.effort]}
                  </span>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-[var(--color-slate-800)]">
                  {r.rationale}
                </p>
              </li>
            ))}
          </ol>
        )}
      </section>

      {/* Actions */}
      <footer className="flex flex-wrap items-center gap-3 border-t border-[var(--color-border)] pt-6">
        <a
          href={DEL_READINESS.results.actions.bookConsultation.href}
          className="inline-flex items-center gap-1.5 rounded-[var(--radius-md)] bg-[var(--color-primary-700)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-primary-800)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-1"
        >
          <Calendar aria-hidden="true" size={14} />
          {DEL_READINESS.results.actions.bookConsultation.label}
        </a>
        <button
          type="button"
          disabled
          title={DEL_READINESS.results.actions.downloadReport.pendingLabel}
          aria-label={DEL_READINESS.results.actions.downloadReport.pendingLabel}
          className="inline-flex items-center gap-1.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-medium text-[var(--color-muted)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Download aria-hidden="true" size={14} />
          {DEL_READINESS.results.actions.downloadReport.label}
        </button>
        <button
          type="button"
          onClick={onRetake}
          className="inline-flex items-center gap-1.5 rounded-[var(--radius-md)] px-4 py-2 text-sm font-medium text-[var(--color-primary-700)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
        >
          <RefreshCw aria-hidden="true" size={14} />
          {DEL_READINESS.results.actions.retake.label}
        </button>
      </footer>
    </div>
  );
}

/**
 * Linear score bar — visual cue paired with the numeric score. Width
 * tracks `score`, colour tracks `level` (mirroring TrafficLightPill).
 */
function ScoreBar({
  score,
  level,
}: {
  score: number;
  level: "green" | "yellow" | "red";
}) {
  const fill =
    level === "green"
      ? "bg-[var(--color-success)]"
      : level === "yellow"
        ? "bg-[var(--color-warn)]"
        : "bg-[var(--color-danger)]";
  return (
    <div className="mt-4 h-2 w-full overflow-hidden rounded-[var(--radius-full)] bg-[var(--color-slate-100)]">
      <div
        className={`h-full transition-[width] duration-500 ${fill}`}
        style={{ width: `${Math.max(0, Math.min(100, score))}%` }}
      />
    </div>
  );
}

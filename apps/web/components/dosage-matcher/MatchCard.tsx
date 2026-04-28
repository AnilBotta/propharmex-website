"use client";

/**
 * Single dosage-form recommendation card.
 *
 * Used inside the side-by-side `MatchResults` layout. Renders:
 *   - Dosage form name + fitTier pill (high/medium/low)
 *   - Capability coverage % bar (deterministic, server-computed)
 *   - Rationale paragraph
 *   - Mismatch flags (warning list, if any)
 *   - Suggested next steps
 *   - Case studies the model recalled (or the empty fallback)
 *
 * No client-side fetching — the card consumes a fully-built
 * `EnrichedMatch` from the parent.
 */
import { AlertTriangle, ArrowRight } from "lucide-react";

import type { EnrichedMatch, FitTier } from "@propharmex/lib/dosage-matcher";

import { DOSAGE_MATCHER } from "../../content/dosage-matcher";

interface Props {
  match: EnrichedMatch;
  rank: number;
}

export function MatchCard({ match, rank }: Props) {
  return (
    <article className="flex h-full flex-col rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      {/* Header */}
      <header className="border-b border-[var(--color-border)] pb-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]">
          #{rank}
        </p>
        <div className="mt-1 flex items-start justify-between gap-3">
          <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-[var(--color-fg)]">
            {DOSAGE_MATCHER.humanize.dosageForm[match.dosageForm]}
          </h3>
          <FitTierPill tier={match.fitTier} />
        </div>
        <CoverageBar pct={match.capabilityCoveragePct} tier={match.fitTier} />
      </header>

      {/* Rationale */}
      <section className="mt-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-muted)]">
          {DOSAGE_MATCHER.results.rationaleLabel}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-[var(--color-slate-800)]">
          {match.rationale}
        </p>
      </section>

      {/* Capabilities split */}
      <section className="mt-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-muted)]">
          {DOSAGE_MATCHER.results.coverageLabel}
        </p>
        <ul className="mt-1 flex flex-wrap gap-1">
          {match.capabilitiesCovered.map((c) => (
            <li
              key={`yes-${c}`}
              className="rounded-[var(--radius-full)] border border-[var(--color-success)] bg-[color-mix(in_oklab,var(--color-success)_10%,transparent)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-success)]"
            >
              {DOSAGE_MATCHER.humanize.capability[c]}
            </li>
          ))}
          {match.capabilitiesMissing.map((c) => (
            <li
              key={`no-${c}`}
              className="rounded-[var(--radius-full)] border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-muted)] line-through decoration-[var(--color-muted)]/40"
            >
              {DOSAGE_MATCHER.humanize.capability[c]}
            </li>
          ))}
        </ul>
      </section>

      {/* Mismatch flags */}
      {match.mismatchFlags.length > 0 ? (
        <section className="mt-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-warn)]">
            {DOSAGE_MATCHER.results.mismatchHeading}
          </p>
          <ul className="mt-1 flex flex-col gap-1.5">
            {match.mismatchFlags.map((flag, i) => (
              <li
                key={i}
                className="flex items-start gap-1.5 text-sm leading-relaxed text-[var(--color-slate-800)]"
              >
                <AlertTriangle
                  aria-hidden="true"
                  size={12}
                  className="mt-1 shrink-0 text-[var(--color-warn)]"
                />
                <span>{flag}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* Suggested next steps */}
      <section className="mt-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-muted)]">
          {DOSAGE_MATCHER.results.nextStepsHeading}
        </p>
        <ul className="mt-1 flex flex-col gap-1.5">
          {match.suggestedNextSteps.map((step, i) => (
            <li
              key={i}
              className="flex items-start gap-1.5 text-sm leading-relaxed text-[var(--color-fg)]"
            >
              <ArrowRight
                aria-hidden="true"
                size={12}
                className="mt-1 shrink-0 text-[var(--color-primary-700)]"
              />
              <span>{step}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Case studies (model-recalled, free-text titles) */}
      {match.relevantCaseStudyTitles.length > 0 ? (
        <section className="mt-4 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-muted)]">
            {DOSAGE_MATCHER.results.caseStudiesHeading}
          </p>
          <ul className="mt-1 flex flex-col gap-1">
            {match.relevantCaseStudyTitles.map((title, i) => (
              <li
                key={i}
                className="text-[13px] italic leading-snug text-[var(--color-muted)]"
              >
                {title}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function FitTierPill({ tier }: { tier: FitTier }) {
  const cls =
    tier === "high"
      ? "border-[var(--color-success)] bg-[color-mix(in_oklab,var(--color-success)_12%,transparent)] text-[var(--color-success)]"
      : tier === "medium"
        ? "border-[var(--color-warn)] bg-[color-mix(in_oklab,var(--color-warn)_12%,transparent)] text-[var(--color-warn)]"
        : "border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-muted)]";
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-[var(--radius-full)] border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] ${cls}`}
    >
      {DOSAGE_MATCHER.results.fitTierLabels[tier]}
    </span>
  );
}

function CoverageBar({ pct, tier }: { pct: number; tier: FitTier }) {
  const fill =
    tier === "high"
      ? "bg-[var(--color-success)]"
      : tier === "medium"
        ? "bg-[var(--color-warn)]"
        : "bg-[var(--color-muted)]";
  return (
    <div className="mt-3 flex items-center gap-3">
      <div className="h-1.5 flex-1 overflow-hidden rounded-[var(--radius-full)] bg-[var(--color-slate-100)]">
        <div
          className={`h-full transition-[width] duration-500 ${fill}`}
          style={{ width: `${Math.max(0, Math.min(100, pct))}%` }}
        />
      </div>
      <span className="text-[11px] font-semibold tabular-nums text-[var(--color-fg)]">
        {pct}%
      </span>
    </div>
  );
}

"use client";

/**
 * Side-by-side results screen for the Dosage Form Capability Matcher.
 *
 * Layout (per Prompt 21 spec — "side-by-side comparison view"):
 *   - Inferred-requirements summary block at the top
 *   - Up to 3 `MatchCard`s in a responsive grid:
 *       lg: 3 columns side-by-side
 *       md: 2 columns
 *       sm: stacked
 *   - Action footer: "Talk to a scientist" + "Run another match"
 *
 * Empty state renders when the model didn't return any matches — points
 * the user straight at the contact form per the escape-hatch guardrail.
 */
import { ArrowUpRight, Download, RefreshCw } from "lucide-react";

import type { Recommendation } from "@propharmex/lib/dosage-matcher";

import { DOSAGE_MATCHER } from "../../content/dosage-matcher";

import { MatchCard } from "./MatchCard";

interface Props {
  recommendation: Recommendation | null;
  onRestart: () => void;
  onConsultationClick: () => void;
  onDownloadPdf: () => void;
  downloading: boolean;
}

export function MatchResults({
  recommendation,
  onRestart,
  onConsultationClick,
  onDownloadPdf,
  downloading,
}: Props) {
  // Empty / failure state.
  if (!recommendation || recommendation.matches.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <DisclaimerBanner />
        <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] bg-[var(--color-bg)] px-6 py-12 text-center">
          <h2 className="font-[family-name:var(--font-display)] text-base font-semibold tracking-tight text-[var(--color-fg)]">
            {DOSAGE_MATCHER.results.emptyHeading}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[var(--color-slate-800)]">
            {DOSAGE_MATCHER.results.emptyBody}
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <ConsultationCta onClick={onConsultationClick} />
            <RestartButton onClick={onRestart} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <DisclaimerBanner />

      {/* Inferred requirements */}
      <section
        aria-labelledby="dm-inferred"
        className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6"
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
          {DOSAGE_MATCHER.results.eyebrow}
        </p>
        <h2
          id="dm-inferred"
          className="mt-2 font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-[var(--color-fg)]"
        >
          {DOSAGE_MATCHER.results.inferredHeading}
        </h2>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-muted)]">
              {DOSAGE_MATCHER.results.requiredCapabilitiesLabel}
            </p>
            <ul className="mt-1.5 flex flex-wrap gap-1">
              {recommendation.inferredRequirements.capabilities.map((c) => (
                <li
                  key={c}
                  className="rounded-[var(--radius-full)] border border-[var(--color-primary-700)] bg-[var(--color-primary-50)] px-2 py-0.5 text-[11px] font-medium text-[var(--color-primary-700)]"
                >
                  {DOSAGE_MATCHER.humanize.capability[c]}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-muted)]">
              {DOSAGE_MATCHER.results.considerationsLabel}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-slate-800)]">
              {recommendation.inferredRequirements.dosageFormConsiderations}
            </p>
          </div>
        </div>
      </section>

      {/* Side-by-side matches */}
      <section aria-labelledby="dm-matches">
        <h2
          id="dm-matches"
          className="font-[family-name:var(--font-display)] text-base font-semibold tracking-tight text-[var(--color-fg)]"
        >
          {DOSAGE_MATCHER.results.matchesHeading}
        </h2>
        <ul
          className={`mt-4 grid grid-cols-1 gap-4 ${
            recommendation.matches.length >= 3
              ? "lg:grid-cols-3"
              : recommendation.matches.length === 2
                ? "lg:grid-cols-2"
                : "lg:grid-cols-1 lg:max-w-2xl"
          }`}
        >
          {recommendation.matches.map((m, i) => (
            <li key={`${m.dosageForm}-${i}`} className="list-none">
              <MatchCard match={m} rank={i + 1} />
            </li>
          ))}
        </ul>
      </section>

      {/* Action footer */}
      <footer className="flex flex-wrap items-center gap-3 border-t border-[var(--color-border)] pt-6">
        <ConsultationCta onClick={onConsultationClick} />
        <DownloadPdfButton
          onClick={onDownloadPdf}
          downloading={downloading}
        />
        <RestartButton onClick={onRestart} />
      </footer>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Sub-components                                                             */
/* -------------------------------------------------------------------------- */

function DisclaimerBanner() {
  return (
    <div
      role="note"
      className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm leading-relaxed text-[var(--color-slate-800)]"
    >
      {DOSAGE_MATCHER.disclaimer}
    </div>
  );
}

function ConsultationCta({ onClick }: { onClick: () => void }) {
  return (
    <a
      href={DOSAGE_MATCHER.results.actions.bookConsultation.href}
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-[var(--radius-md)] bg-[var(--color-primary-700)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-primary-800)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-1"
    >
      {DOSAGE_MATCHER.results.actions.bookConsultation.label}
      <ArrowUpRight aria-hidden="true" size={14} />
    </a>
  );
}

function DownloadPdfButton({
  onClick,
  downloading,
}: {
  onClick: () => void;
  downloading: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={downloading}
      aria-label={DOSAGE_MATCHER.results.actions.downloadPdf.label}
      className="inline-flex items-center gap-1.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-medium text-[var(--color-fg)] hover:border-[var(--color-primary-700)] hover:text-[var(--color-primary-700)] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
    >
      <Download aria-hidden="true" size={14} />
      {downloading
        ? DOSAGE_MATCHER.results.actions.downloadPdf.renderingLabel
        : DOSAGE_MATCHER.results.actions.downloadPdf.label}
    </button>
  );
}

function RestartButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-[var(--radius-md)] px-4 py-2 text-sm font-medium text-[var(--color-primary-700)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
    >
      <RefreshCw aria-hidden="true" size={14} />
      {DOSAGE_MATCHER.results.actions.restart.label}
    </button>
  );
}

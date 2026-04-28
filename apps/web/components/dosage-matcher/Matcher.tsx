"use client";

/**
 * DosageFormMatcher — top-level orchestrator for the matcher page.
 *
 * Tri-mode state machine: "input" → "submitting" → "results". Same
 * shape as the DEL Readiness Assessment, with three differences:
 *
 *   1. The intake is a single-step form (description + optional
 *      filters), not multi-step. No branching.
 *   2. The annotation payload carries the full `Recommendation`
 *      directly (already enriched server-side with deterministic
 *      capability coverage). No tool-call frame parsing needed.
 *   3. "See a sample" loads `SAMPLE_MATCHER_RECOMMENDATION` directly
 *      and skips the model entirely — same affordance as the
 *      Scoping Assistant.
 *
 * Hand-rolled AI-SDK data-stream parser (frame `8:` only — no `useChat`)
 * because this isn't a chat surface.
 */
import { useEffect, useState } from "react";
import { ArrowUpRight, Sparkles } from "lucide-react";

import {
  SAMPLE_MATCHER_INPUT,
  SAMPLE_MATCHER_RECOMMENDATION,
  type MatcherInput,
  type Recommendation,
} from "@propharmex/lib/dosage-matcher";

import { DOSAGE_MATCHER } from "../../content/dosage-matcher";

import { InputForm } from "./InputForm";
import { MatchResults } from "./MatchResults";
import {
  trackDosageMatcherConsultationClicked,
  trackDosageMatcherMatched,
  trackDosageMatcherOpened,
  trackDosageMatcherPdfDownloaded,
  trackDosageMatcherRestart,
  trackDosageMatcherSampleLoaded,
  trackDosageMatcherSubmitted,
} from "./telemetry";

type Phase = "input" | "submitting" | "results";

interface RecommendationAnnotation {
  type: "dosage-matcher.recommendation";
  rubricVersion: string;
  /** Null when the model didn't produce a recommendation. */
  recommendation: Recommendation | null;
  disclaimer?: string;
}

function isRecommendationAnnotation(v: unknown): v is RecommendationAnnotation {
  if (typeof v !== "object" || v === null) return false;
  const o = v as Record<string, unknown>;
  return o.type === "dosage-matcher.recommendation";
}

export function DosageFormMatcher() {
  const [phase, setPhase] = useState<Phase>("input");
  const [input, setInput] = useState<MatcherInput>({});
  const [recommendation, setRecommendation] = useState<Recommendation | null>(
    null,
  );
  const [validationError, setValidationError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  // Page-mount telemetry (fire once).
  useEffect(() => {
    trackDosageMatcherOpened();
  }, []);

  function loadSample() {
    setInput(SAMPLE_MATCHER_INPUT);
    setRecommendation(SAMPLE_MATCHER_RECOMMENDATION);
    setValidationError(null);
    setServerError(null);
    setPhase("results");
    trackDosageMatcherSampleLoaded();
  }

  function restart() {
    trackDosageMatcherRestart();
    setInput({});
    setRecommendation(null);
    setValidationError(null);
    setServerError(null);
    setPhase("input");
  }

  function consultationClicked() {
    trackDosageMatcherConsultationClicked();
  }

  async function downloadPdf() {
    if (!recommendation || downloading) return;
    setDownloading(true);
    try {
      const res = await fetch("/api/ai/dosage-matcher/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recommendation,
          input,
          referrer:
            typeof document !== "undefined"
              ? document.referrer || undefined
              : undefined,
        }),
      });
      if (!res.ok) {
        // eslint-disable-next-line no-console
        console.error("[dosage-matcher] pdf download failed:", res.status);
        return;
      }
      const blob = await res.blob();
      const today = new Date().toISOString().slice(0, 10);
      const filename = `propharmex-dosage-matcher-${today}.pdf`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      trackDosageMatcherPdfDownloaded({
        bytes: blob.size,
        matchCount: recommendation.matches.length,
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("[dosage-matcher] pdf download error:", err);
    } finally {
      setDownloading(false);
    }
  }

  async function submit() {
    const hasDescription =
      typeof input.description === "string" && input.description.trim().length > 0;
    const hasFilters =
      input.filters !== undefined &&
      Object.values(input.filters).some(
        (v) => v != null && v !== "" && v !== undefined,
      );
    if (!hasDescription && !hasFilters) {
      setValidationError(DOSAGE_MATCHER.form.emptyError);
      return;
    }
    setValidationError(null);

    setPhase("submitting");
    setServerError(null);
    const filterCount = input.filters
      ? Object.values(input.filters).filter(
          (v) => v != null && v !== "" && v !== undefined,
        ).length
      : 0;
    trackDosageMatcherSubmitted({
      hasDescription:
        typeof input.description === "string" &&
        input.description.trim().length > 0,
      filterCount,
    });
    try {
      const res = await fetch("/api/ai/dosage-matcher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });

      if (res.status === 503) {
        setServerError(DOSAGE_MATCHER.errors.unconfigured);
        setPhase("input");
        return;
      }
      if (res.status === 429) {
        setServerError(DOSAGE_MATCHER.errors.rateLimited);
        setPhase("input");
        return;
      }
      if (!res.ok || !res.body) {
        setServerError(DOSAGE_MATCHER.errors.streamFailed);
        setPhase("input");
        return;
      }

      const built = await parseRecommendationStream(res.body);
      // built is null when the stream ended without an annotation.
      // built.recommendation is null when the model declined to match.
      // Both render the empty-results screen — the user sees the
      // explanation + the contact CTA in either case.
      const finalRec = built?.recommendation ?? null;
      setRecommendation(finalRec);
      setPhase("results");

      const topMatch = finalRec?.matches[0];
      trackDosageMatcherMatched({
        matchCount: finalRec?.matches.length ?? 0,
        topFitTier: topMatch?.fitTier ?? "none",
        topCoveragePct: topMatch?.capabilityCoveragePct ?? 0,
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("[dosage-matcher] submit error:", err);
      setServerError(DOSAGE_MATCHER.errors.generic);
      setPhase("input");
    }
  }

  if (phase === "results") {
    return (
      <MatchResults
        recommendation={recommendation}
        onRestart={restart}
        onConsultationClick={consultationClicked}
        onDownloadPdf={() => {
          void downloadPdf();
        }}
        downloading={downloading}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div
        role="note"
        className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm leading-relaxed text-[var(--color-slate-800)]"
      >
        {DOSAGE_MATCHER.disclaimer}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={loadSample}
          disabled={phase === "submitting"}
          className="inline-flex items-center gap-1.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-sm font-medium text-[var(--color-primary-700)] hover:border-[var(--color-primary-700)] hover:bg-[var(--color-primary-50)] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
        >
          <Sparkles aria-hidden="true" size={14} />
          {DOSAGE_MATCHER.intro.sampleCtaLabel}
        </button>
        <a
          href={DOSAGE_MATCHER.escapeHatch.href}
          className="inline-flex items-center gap-0.5 whitespace-nowrap text-[12px] font-medium text-[var(--color-primary-700)] hover:underline"
        >
          {DOSAGE_MATCHER.escapeHatch.label}
          <ArrowUpRight aria-hidden="true" size={12} />
        </a>
      </div>

      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-8">
        <InputForm
          value={input}
          onChange={setInput}
          onSubmit={() => {
            void submit();
          }}
          errorMessage={validationError ?? serverError}
          submitting={phase === "submitting"}
        />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Stream parser                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Parse the AI SDK data-stream protocol — only the message-annotation
 * frame (`8:`). We don't render streamed text on this surface; the
 * "Matching…" submit-button label suffices.
 *
 * Object-state pattern around the closure mutation so TS strict
 * narrows correctly after the read loop (same gotcha encountered in
 * DEL Readiness's stream parser).
 */
async function parseRecommendationStream(
  body: ReadableStream<Uint8Array>,
): Promise<RecommendationAnnotation | null> {
  const state: { anno: RecommendationAnnotation | null } = { anno: null };

  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let nl = buffer.indexOf("\n");
    while (nl !== -1) {
      const line = buffer.slice(0, nl);
      buffer = buffer.slice(nl + 1);
      processLine(line);
      nl = buffer.indexOf("\n");
    }
  }
  if (buffer.length > 0) processLine(buffer);

  function processLine(rawLine: string) {
    if (!rawLine || rawLine.length < 2) return;
    const colon = rawLine.indexOf(":");
    if (colon < 0) return;
    const type = rawLine.slice(0, colon);
    if (type !== "8") return;
    const payload = rawLine.slice(colon + 1);
    try {
      const parsed = JSON.parse(payload) as unknown;
      if (Array.isArray(parsed)) {
        for (const a of parsed) {
          if (isRecommendationAnnotation(a)) state.anno = a;
        }
      } else if (isRecommendationAnnotation(parsed)) {
        state.anno = parsed;
      }
    } catch {
      /* ignore malformed annotation frame */
    }
  }

  return state.anno;
}

"use client";

/**
 * DEL Readiness Assessment — multi-step form orchestrator.
 *
 * State machine, three modes:
 *
 *   "intake"  — multi-step form. The user moves through visible questions
 *               one at a time. Branching is evaluated client-side via the
 *               rubric's `showWhen` predicates against current answers.
 *               Back/Next navigate. Submit becomes available on the last
 *               visible question.
 *
 *   "submitting" — POST to /api/ai/del-readiness, parse the streamed tool
 *               call args + the deterministic-score annotation, build the
 *               final Assessment.
 *
 *   "results" — render <ResultsScreen /> with the assembled Assessment.
 *               "Re-take" returns to "intake" with answers cleared.
 *
 * The route uses the AI SDK data-stream protocol (frame `9:` for
 * tool-call results, frame `8:` for message annotations). We read both
 * client-side without `useChat` because this isn't a chat — it's a
 * single one-shot synthesis. Parsing the stream by hand keeps the surface
 * minimal and avoids dragging in the chat wrapper for nothing.
 */
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";

import {
  DEFAULT_RUBRIC,
  type AnswerMap,
  type Assessment,
  type AssessmentRecommendation,
  type CategoryScore,
  type Rubric,
  type RubricQuestion,
  type TrafficLight,
} from "@propharmex/lib/del-readiness";

import { DEL_READINESS } from "../../content/del-readiness";

import { QuestionStep } from "./QuestionStep";
import { ResultsScreen } from "./ResultsScreen";

type Phase = "intake" | "submitting" | "results";

/** Filter the rubric down to questions whose `showWhen` predicate is satisfied. */
function visibleQuestions(rubric: Rubric, answers: AnswerMap): RubricQuestion[] {
  return rubric.questions.filter((q) => {
    if (!q.showWhen) return true;
    const dep = answers[q.showWhen.questionId];
    if (!dep) return false;
    return q.showWhen.equalsAny.includes(dep);
  });
}

interface ScoreAnnotation {
  type: "del-readiness.score";
  rubricVersion: string;
  score: number;
  trafficLight: TrafficLight;
  categoryScores: CategoryScore[];
  disclaimer?: string;
}

function isScoreAnnotation(v: unknown): v is ScoreAnnotation {
  if (typeof v !== "object" || v === null) return false;
  const o = v as Record<string, unknown>;
  return (
    o.type === "del-readiness.score" &&
    typeof o.score === "number" &&
    Array.isArray(o.categoryScores)
  );
}

export function DelReadinessAssessment() {
  const rubric = DEFAULT_RUBRIC;

  const [answers, setAnswers] = useState<AnswerMap>({});
  const [stepIndex, setStepIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("intake");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [assessment, setAssessment] = useState<Assessment | null>(null);

  const visible = useMemo(() => visibleQuestions(rubric, answers), [
    rubric,
    answers,
  ]);
  const currentQuestion = visible[stepIndex];
  const isLast = stepIndex === visible.length - 1;
  const totalSteps = visible.length;

  function pickOption(optionId: string) {
    if (!currentQuestion) return;
    setValidationError(null);
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionId }));
  }

  function goBack() {
    setValidationError(null);
    setStepIndex((i) => Math.max(0, i - 1));
  }

  function goNext() {
    if (!currentQuestion) return;
    if (!answers[currentQuestion.id]) {
      setValidationError(DEL_READINESS.form.answerRequired);
      return;
    }
    setValidationError(null);
    // Branching may have changed which questions come after the current
    // one. Recompute visibility before stepping forward.
    const nextVisible = visibleQuestions(rubric, answers);
    const nextIdx = Math.min(stepIndex + 1, nextVisible.length - 1);
    setStepIndex(nextIdx);
  }

  async function submit() {
    if (!currentQuestion) return;
    if (!answers[currentQuestion.id]) {
      setValidationError(DEL_READINESS.form.answerRequired);
      return;
    }

    // Drop answers to questions that are no longer visible — branching
    // may have invalidated them when an earlier answer changed.
    const nextVisible = visibleQuestions(rubric, answers);
    const visibleIds = new Set(nextVisible.map((q) => q.id));
    const cleaned: AnswerMap = {};
    for (const [k, v] of Object.entries(answers)) {
      if (visibleIds.has(k)) cleaned[k] = v;
    }

    setPhase("submitting");
    setServerError(null);
    try {
      const res = await fetch("/api/ai/del-readiness", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: cleaned }),
      });

      if (res.status === 503) {
        setServerError(DEL_READINESS.errors.unconfigured);
        setPhase("intake");
        return;
      }
      if (res.status === 429) {
        setServerError(DEL_READINESS.errors.rateLimited);
        setPhase("intake");
        return;
      }
      if (!res.ok || !res.body) {
        setServerError(DEL_READINESS.errors.streamFailed);
        setPhase("intake");
        return;
      }

      const built = await parseAssessmentStream(res.body);
      if (!built) {
        setServerError(DEL_READINESS.errors.streamFailed);
        setPhase("intake");
        return;
      }
      setAssessment(built);
      setPhase("results");
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("[del-readiness] submit error:", err);
      setServerError(DEL_READINESS.errors.generic);
      setPhase("intake");
    }
  }

  function retake() {
    setAnswers({});
    setStepIndex(0);
    setAssessment(null);
    setServerError(null);
    setValidationError(null);
    setPhase("intake");
  }

  /* -- Render branches ------------------------------------------------ */

  if (phase === "results" && assessment) {
    return <ResultsScreen assessment={assessment} rubric={rubric} onRetake={retake} />;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Persistent disclaimer banner */}
      <div
        role="note"
        className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm leading-relaxed text-[var(--color-slate-800)]"
      >
        {DEL_READINESS.disclaimer}
      </div>

      {/* Step container */}
      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8">
        {currentQuestion ? (
          <QuestionStep
            question={currentQuestion}
            value={answers[currentQuestion.id]}
            stepIndex={stepIndex + 1}
            totalSteps={totalSteps}
            errorMessage={validationError}
            onChange={pickOption}
          />
        ) : null}

        {serverError ? (
          <p
            role="alert"
            className="mt-4 rounded-[var(--radius-md)] border border-[var(--color-danger)] bg-[color-mix(in_oklab,var(--color-danger)_10%,transparent)] px-3 py-2 text-sm text-[var(--color-danger)]"
          >
            {serverError}
          </p>
        ) : null}

        {/* Nav row */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-border)] pt-6">
          <button
            type="button"
            onClick={goBack}
            disabled={stepIndex === 0 || phase === "submitting"}
            className="inline-flex items-center gap-1.5 rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-fg)] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
          >
            <ArrowLeft aria-hidden="true" size={14} />
            {DEL_READINESS.form.backLabel}
          </button>

          <a
            href={DEL_READINESS.escapeHatch.href}
            className="inline-flex items-center gap-0.5 whitespace-nowrap text-[11px] font-medium text-[var(--color-primary-700)] hover:underline"
          >
            {DEL_READINESS.escapeHatch.label}
            <ArrowUpRight aria-hidden="true" size={11} />
          </a>

          {isLast ? (
            <button
              type="button"
              onClick={submit}
              disabled={phase === "submitting"}
              className="inline-flex items-center gap-1.5 rounded-[var(--radius-md)] bg-[var(--color-primary-700)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-primary-800)] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-1"
            >
              {phase === "submitting"
                ? DEL_READINESS.form.submittingLabel
                : DEL_READINESS.form.submitLabel}
            </button>
          ) : (
            <button
              type="button"
              onClick={goNext}
              className="inline-flex items-center gap-1.5 rounded-[var(--radius-md)] bg-[var(--color-primary-700)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-primary-800)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-1"
            >
              {DEL_READINESS.form.nextLabel}
              <ArrowRight aria-hidden="true" size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Stream parser                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Parse the AI SDK data-stream protocol — only the two frame types we
 * care about:
 *
 *   `9:{ "toolCallId", "toolName", "args" }`   — tool call args (after
 *                                                 server-side validation)
 *   `8:[{ "type": "del-readiness.score", ... }]` — message annotation
 *
 * Other frames (text deltas, finish, etc.) are ignored. We don't show
 * any streamed text on this surface — the "submitting" label suffices.
 */
async function parseAssessmentStream(
  body: ReadableStream<Uint8Array>,
): Promise<Assessment | null> {
  // Object-state pattern. TS strict can't narrow `let X: T | null = null`
  // when X is reassigned inside a closure (control-flow analysis stops at
  // the closure boundary, so X stays `never` after the post-loop null
  // check). Property access on a single state object narrows correctly.
  const state: {
    recommendation: AssessmentRecommendation | null;
    scoreAnno: ScoreAnnotation | null;
  } = { recommendation: null, scoreAnno: null };

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
    const payload = rawLine.slice(colon + 1);
    if (type === "9") {
      // Tool call frame.
      try {
        const parsed = JSON.parse(payload) as {
          toolName?: string;
          args?: unknown;
        };
        if (parsed.toolName === "recommend" && parsed.args) {
          state.recommendation = parsed.args as AssessmentRecommendation;
        }
      } catch {
        /* ignore malformed frame */
      }
    } else if (type === "8") {
      // Message annotation frame.
      try {
        const parsed = JSON.parse(payload) as unknown;
        if (Array.isArray(parsed)) {
          for (const a of parsed) {
            if (isScoreAnnotation(a)) state.scoreAnno = a;
          }
        } else if (isScoreAnnotation(parsed)) {
          state.scoreAnno = parsed;
        }
      } catch {
        /* ignore */
      }
    }
  }

  const score = state.scoreAnno;
  if (!score) return null;
  const recommendation = state.recommendation;

  // Build the final Assessment. If the model's `recommend` tool call is
  // missing (network blip, model declined), fall back to empty arrays —
  // the score + traffic-light still render and the user sees the empty
  // gap copy with the consultation CTA.
  return {
    rubricVersion: score.rubricVersion,
    score: score.score,
    trafficLight: score.trafficLight,
    categoryScores: score.categoryScores,
    gaps: recommendation?.gaps ?? [],
    remediation: recommendation
      ? [...recommendation.remediation].sort((a, b) => a.priority - b.priority)
      : [],
  };
}

/**
 * PostHog telemetry for the DEL Readiness Assessment.
 *
 * Mirrors `apps/web/components/scoping/telemetry.ts` and
 * `apps/web/components/concierge/telemetry.ts` exactly — same
 * short-circuit pattern when the singleton hasn't loaded.
 *
 * Privacy: counts and categorical fields only — never raw answers, never
 * model output text.
 *
 * Events:
 *   - del_readiness.opened             page mount
 *   - del_readiness.question_answered  user picked an option
 *   - del_readiness.submitted          submitted form (may not have
 *                                       received the model response yet)
 *   - del_readiness.scored             assessment streamed back cleanly
 *   - del_readiness.consultation_clicked  "Book a DEL consultation" click
 *   - del_readiness.pdf_downloaded     PDF download succeeded
 *   - del_readiness.retake             user clicked Re-take
 */
import posthog from "posthog-js";

type LoadedPostHog = typeof posthog & { __loaded?: boolean };

function isLoaded(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean((posthog as LoadedPostHog).__loaded);
}

function capture(event: string, props?: Record<string, unknown>): void {
  if (!isLoaded()) return;
  posthog.capture(event, props);
}

export function trackDelReadinessOpened(): void {
  capture("del_readiness.opened");
}

export function trackDelReadinessQuestionAnswered(props: {
  /** The category id of the question being answered. */
  category: string;
  /** Step index (1-based) at the moment of answering. */
  stepIndex: number;
}): void {
  capture("del_readiness.question_answered", props);
}

export function trackDelReadinessSubmitted(props: {
  answeredCount: number;
}): void {
  capture("del_readiness.submitted", props);
}

export function trackDelReadinessScored(props: {
  score: number;
  trafficLight: "green" | "yellow" | "red";
  gapCount: number;
  remediationCount: number;
}): void {
  capture("del_readiness.scored", props);
}

export function trackDelReadinessConsultationClicked(props?: {
  hasCalLink: boolean;
}): void {
  capture("del_readiness.consultation_clicked", props);
}

export function trackDelReadinessPdfDownloaded(props: {
  bytes: number;
  score: number;
  trafficLight: "green" | "yellow" | "red";
}): void {
  capture("del_readiness.pdf_downloaded", props);
}

export function trackDelReadinessRetake(): void {
  capture("del_readiness.retake");
}

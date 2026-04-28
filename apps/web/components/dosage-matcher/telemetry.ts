/**
 * PostHog telemetry for the Dosage Form Capability Matcher.
 *
 * Mirrors the scoping / del-readiness / concierge telemetry helpers
 * exactly — same short-circuit pattern when the singleton hasn't loaded.
 *
 * Privacy: counts and categorical fields only. Never the user's
 * description text, never raw model output.
 *
 * Events:
 *   - dosage_matcher.opened                 page mount
 *   - dosage_matcher.sample_loaded          "See a sample" click
 *   - dosage_matcher.submitted              user submitted the input form
 *   - dosage_matcher.matched                recommendation streamed back
 *   - dosage_matcher.consultation_clicked   "Talk to a scientist" click
 *   - dosage_matcher.pdf_downloaded         PDF download succeeded
 *   - dosage_matcher.restart                "Run another match" click
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

export function trackDosageMatcherOpened(): void {
  capture("dosage_matcher.opened");
}

export function trackDosageMatcherSampleLoaded(): void {
  capture("dosage_matcher.sample_loaded");
}

export function trackDosageMatcherSubmitted(props: {
  hasDescription: boolean;
  filterCount: number;
}): void {
  capture("dosage_matcher.submitted", props);
}

export function trackDosageMatcherMatched(props: {
  matchCount: number;
  topFitTier: "high" | "medium" | "low" | "none";
  topCoveragePct: number;
}): void {
  capture("dosage_matcher.matched", props);
}

export function trackDosageMatcherConsultationClicked(): void {
  capture("dosage_matcher.consultation_clicked");
}

export function trackDosageMatcherPdfDownloaded(props: {
  bytes: number;
  matchCount: number;
}): void {
  capture("dosage_matcher.pdf_downloaded", props);
}

export function trackDosageMatcherRestart(): void {
  capture("dosage_matcher.restart");
}

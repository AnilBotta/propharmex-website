/**
 * PostHog telemetry helpers for the Project Scoping Assistant.
 *
 * Mirrors `apps/web/components/concierge/telemetry.ts` exactly — same
 * short-circuit pattern when the singleton hasn't loaded (no env key in dev
 * / CI). The bounded event taxonomy here will fold into Prompt 24's final
 * dashboard.
 *
 * Privacy: NEVER include user message text in props. Counts, scopes, and
 * categorical fields only.
 *
 * Events:
 *   - scoping.opened              page mount
 *   - scoping.message_sent        user submitted a chat turn (composer or chip)
 *   - scoping.sample_loaded       user clicked "See a sample"
 *   - scoping.scope_generated     proposeScope tool call resolved
 *   - scoping.scope_edited        user edited a section in the preview card
 *   - scoping.submitted           submit-to-BD succeeded
 *   - scoping.pdf_downloaded      PDF download succeeded
 *   - scoping.escape_clicked      "Talk to a scientist" anchor clicked
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

export function trackScopingOpened(): void {
  capture("scoping.opened");
}

export function trackScopingMessageSent(props: {
  source: "composer" | "suggestion-chip";
  /** Length bucket only — never the message text. */
  lengthBucket: "xs" | "s" | "m" | "l" | "xl";
}): void {
  capture("scoping.message_sent", props);
}

export function trackScopingSampleLoaded(): void {
  capture("scoping.sample_loaded");
}

export function trackScopingScopeGenerated(props: {
  serviceCount: number;
  phaseCount: number;
  riskCount: number;
}): void {
  capture("scoping.scope_generated", props);
}

export function trackScopingScopeEdited(props: {
  /** Which section was edited. */
  section:
    | "objectives"
    | "dosageForms"
    | "developmentStage"
    | "deliverables"
    | "assumptions"
    | "recommendedServices";
}): void {
  capture("scoping.scope_edited", props);
}

export function trackScopingSubmitted(props: {
  queued: boolean;
  serviceCount: number;
  phaseCount: number;
}): void {
  capture("scoping.submitted", props);
}

export function trackScopingPdfDownloaded(props: {
  bytes: number;
  serviceCount: number;
  phaseCount: number;
}): void {
  capture("scoping.pdf_downloaded", props);
}

export function trackScopingEscapeClicked(): void {
  capture("scoping.escape_clicked");
}

/**
 * Reused from the Concierge — duplicated rather than imported so the two
 * surfaces stay independent. Cheap to keep in sync.
 */
export function bucketMessageLength(
  len: number,
): "xs" | "s" | "m" | "l" | "xl" {
  if (len < 20) return "xs";
  if (len < 60) return "s";
  if (len < 200) return "m";
  if (len < 600) return "l";
  return "xl";
}

/**
 * PostHog telemetry helpers for the CDMO Concierge.
 *
 * `posthog-js` is initialized once in `components/site/Analytics.tsx` (mounted
 * by the root layout) when `NEXT_PUBLIC_POSTHOG_KEY` is set. These helpers
 * just call `posthog.capture(...)` — they short-circuit when the singleton
 * has not been loaded (no env key in dev / CI) so calls are safe everywhere.
 *
 * Event taxonomy (Prompt 18 PR-C — finalized in Prompt 24):
 *   - concierge.opened           bubble launcher clicked open
 *   - concierge.closed           bubble launcher clicked closed (or ESC)
 *   - concierge.message_sent     user submitted a message via composer or chip
 *   - concierge.message_received assistant stream finished cleanly
 *   - concierge.feedback         user clicked thumbs up or down
 *   - concierge.escape_clicked   "Talk to a human" anchor clicked
 *
 * Privacy: NEVER include user message text in props. Counts, scopes, and
 * categorical fields only.
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

export function trackConciergeOpened(props?: { source?: "bubble" | "keyboard" }): void {
  capture("concierge.opened", props);
}

export function trackConciergeClosed(props?: { reason?: "x-button" | "escape" | "toggle" }): void {
  capture("concierge.closed", props);
}

export function trackConciergeMessageSent(props: {
  source: "composer" | "suggestion-chip";
  /** Length bucket only — never the message text. */
  lengthBucket: "xs" | "s" | "m" | "l" | "xl";
}): void {
  capture("concierge.message_sent", props);
}

export function trackConciergeMessageReceived(props: {
  /** Number of citation sources attached to the assistant message. */
  citationCount: number;
}): void {
  capture("concierge.message_received", props);
}

export function trackConciergeFeedback(props: { vote: "up" | "down" }): void {
  capture("concierge.feedback", props);
}

export function trackConciergeEscapeClicked(): void {
  capture("concierge.escape_clicked");
}

/**
 * Helper for the composer: turn a message length into a coarse bucket so we
 * can analyze message-size distribution without storing content.
 */
export function bucketMessageLength(len: number): "xs" | "s" | "m" | "l" | "xl" {
  if (len < 20) return "xs";
  if (len < 60) return "s";
  if (len < 200) return "m";
  if (len < 600) return "l";
  return "xl";
}

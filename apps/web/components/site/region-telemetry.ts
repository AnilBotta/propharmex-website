/**
 * Region-personalization PostHog telemetry (Prompt 22 PR-A).
 *
 * Three events:
 *
 *   region.detected           Fired once per session when the cookie
 *                             was set by the middleware (i.e. first
 *                             visit). Source = "middleware". Lets us
 *                             measure detection accuracy by comparing
 *                             with the eventual user override rate.
 *
 *   region.changed            Fired when the user picks a different
 *                             region in the switcher. Source =
 *                             "switcher" or "banner".
 *
 *   region.banner_dismissed   Fired when the user dismisses the
 *                             detection banner without changing
 *                             region (i.e. accepts the detection).
 *
 * Privacy: the region code is the only payload. We do NOT send the
 * detected country or any geo fingerprint — PostHog can derive that
 * from its own IP-based geo if needed.
 */
import posthog from "posthog-js";

import type { Region } from "@propharmex/lib/region";

type LoadedPostHog = typeof posthog & { __loaded?: boolean };

function isLoaded(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean((posthog as LoadedPostHog).__loaded);
}

function capture(event: string, props?: Record<string, unknown>): void {
  if (!isLoaded()) return;
  posthog.capture(event, props);
}

export function trackRegionDetected(props: { region: Region }): void {
  capture("region.detected", props);
}

export function trackRegionChanged(props: {
  region: Region;
  source: "switcher" | "banner";
}): void {
  capture("region.changed", props);
}

export function trackRegionBannerDismissed(props: { region: Region }): void {
  capture("region.banner_dismissed", props);
}

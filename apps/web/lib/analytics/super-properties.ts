"use client";

/**
 * Register PostHog super-properties on the user's first authenticated
 * load of the page (after `posthog.init`). Super-properties are merged
 * into every subsequent `posthog.capture(...)` call automatically.
 *
 * Three super-properties (Prompt 24 spec, region property removed
 * with the personalization layer):
 *
 *   referrer_group    coarse traffic-source bucket from `document.referrer`.
 *   device_class      mobile / tablet / desktop, derived from UA + touch.
 *   first_touch_utm   the user's first-touch UTM record (object) — pinned
 *                     to localStorage on first visit and never overwritten.
 *
 * Strict-mode safety: this is called inside an effect that fires once per
 * mount. The PostHog SDK is idempotent on duplicate `register()` calls
 * with the same payload, so React 19 dev double-mount is harmless.
 *
 * Privacy: no PII. The full referrer URL is never sent — only the coarse
 * group. UTM values are user-supplied marketing strings, never identifiers.
 */
import posthog from "posthog-js";

import { classifyDevice } from "./device";
import { classifyReferrer } from "./referrer";
import { resolveFirstTouchUtm } from "./utm";

type LoadedPostHog = typeof posthog & { __loaded?: boolean };

function isLoaded(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean((posthog as LoadedPostHog).__loaded);
}

export function registerSuperProperties(): void {
  if (typeof window === "undefined") return;
  if (!isLoaded()) return;

  const referrer =
    typeof document !== "undefined" ? document.referrer : undefined;
  const siteHost =
    typeof window.location !== "undefined" ? window.location.host : "";
  const referrerGroup = classifyReferrer(referrer, siteHost);

  const ua =
    typeof navigator !== "undefined" ? navigator.userAgent : undefined;
  const platform =
    typeof navigator !== "undefined" ? navigator.platform : undefined;
  const maxTouchPoints =
    typeof navigator !== "undefined" ? navigator.maxTouchPoints : undefined;
  const deviceClass = classifyDevice(ua, {
    platform: platform ?? undefined,
    maxTouchPoints: maxTouchPoints ?? undefined,
  });

  const currentUrl =
    typeof window.location !== "undefined" ? window.location.href : "";
  const firstTouchUtm =
    typeof window.localStorage !== "undefined"
      ? resolveFirstTouchUtm({
          storage: window.localStorage,
          currentUrl,
        })
      : {};

  posthog.register({
    referrer_group: referrerGroup,
    device_class: deviceClass,
    first_touch_utm: firstTouchUtm,
  });
}

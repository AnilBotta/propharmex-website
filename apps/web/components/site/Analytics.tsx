"use client";

/**
 * Analytics loader.
 *
 * Plausible: server-side via a script tag with `data-domain`. Loaded with
 * `strategy="afterInteractive"` to avoid blocking LCP.
 * PostHog: lazy client init through `posthog-js`. Autocapture is DISABLED —
 * we track a bounded event taxonomy (see docs/analytics-taxonomy.md).
 * Immediately after init we register three super-properties
 * (referrer_group, device_class, first_touch_utm) so every subsequent
 * capture carries them without per-call boilerplate. The region
 * super-property was retired when the personalization layer was removed.
 *
 * Both are no-ops when their env vars are unset so dev and preview builds
 * don't spam fake telemetry.
 */
import { useEffect } from "react";
import Script from "next/script";
import posthog from "posthog-js";

import { registerSuperProperties } from "../../lib/analytics";

type Props = {
  plausibleDomain?: string;
  posthogKey?: string;
  posthogHost?: string;
};

export function Analytics({ plausibleDomain, posthogKey, posthogHost }: Props) {
  useEffect(() => {
    if (!posthogKey) return;
    if ((posthog as unknown as { __loaded?: boolean }).__loaded) {
      // Re-register super-props on subsequent mounts so values stay fresh
      // when the user returns with new UTM params.
      registerSuperProperties();
      return;
    }
    posthog.init(posthogKey, {
      api_host: posthogHost ?? "https://us.i.posthog.com",
      capture_pageview: true,
      autocapture: false,
      persistence: "localStorage+cookie",
      person_profiles: "identified_only",
      disable_session_recording: true,
      loaded: () => {
        // Register super-properties once the SDK reports it's ready so
        // the very first auto-captured pageview already carries them.
        registerSuperProperties();
      },
    });
  }, [posthogKey, posthogHost]);

  return (
    <>
      {plausibleDomain ? (
        <Script
          strategy="afterInteractive"
          src="https://plausible.io/js/script.js"
          data-domain={plausibleDomain}
        />
      ) : null}
    </>
  );
}

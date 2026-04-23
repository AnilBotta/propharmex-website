"use client";

/**
 * Analytics loader.
 *
 * Plausible: server-side via a script tag with `data-domain`. Loaded with
 * `strategy="afterInteractive"` to avoid blocking LCP.
 * PostHog: lazy client init through `posthog-js`. Autocapture is DISABLED —
 * we track a bounded event taxonomy instead (Prompt 24 finalizes the list).
 *
 * Both are no-ops when their env vars are unset so dev and preview builds
 * don't spam fake telemetry.
 */
import { useEffect } from "react";
import Script from "next/script";
import posthog from "posthog-js";

type Props = {
  plausibleDomain?: string;
  posthogKey?: string;
  posthogHost?: string;
};

export function Analytics({ plausibleDomain, posthogKey, posthogHost }: Props) {
  useEffect(() => {
    if (!posthogKey) return;
    if ((posthog as unknown as { __loaded?: boolean }).__loaded) return;
    posthog.init(posthogKey, {
      api_host: posthogHost ?? "https://us.i.posthog.com",
      capture_pageview: true,
      autocapture: false,
      persistence: "localStorage+cookie",
      person_profiles: "identified_only",
      disable_session_recording: true,
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

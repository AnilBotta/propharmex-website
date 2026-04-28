/**
 * Content dictionary for the region personalization surfaces (Prompt 22
 * PR-A): the detection banner copy, the switcher labels, and the
 * "Change" / "Dismiss" microcopy.
 *
 * Voice: anti-hype, plain language. The banner is a privacy-respecting
 * notice ("we made an inference; here's how to change it"), not a
 * marketing surface.
 */

import type { Region } from "@propharmex/lib/region";

export const REGION_COPY = {
  switcher: {
    triggerAriaLabel: "Choose your region",
    optionAriaLabel: (label: string) => `Show ${label} services first`,
  },
  banner: {
    /**
     * Banner heading + body. The detected region label is interpolated
     * into the body via the helper below.
     */
    heading: "Showing your region first",
    bodyTemplate: (regionLabel: string) =>
      `We detected you're in ${regionLabel} and put ${regionLabel}-relevant services and certifications at the top. You can change this anytime.`,
    /** Region-specific addendum that names the cert that's surfaced first. */
    certNote: {
      CA: "Health Canada DEL is shown first.",
      US: "USFDA cGMP and ANDA references are shown first.",
      IN: "CDSCO references are shown first.",
      GLOBAL: "WHO-GMP and EMA references are shown first.",
    } as const satisfies Record<Region, string>,
    changeLabel: "Change",
    dismissLabel: "Got it",
    /** Aria label for the dismiss button. */
    dismissAriaLabel: "Dismiss this notice",
  },
  errors: {
    /** Inline message when /api/region 4xx/5xx's. Banner stays visible. */
    saveFailed: "Couldn't save that — please try again.",
  },
} as const;

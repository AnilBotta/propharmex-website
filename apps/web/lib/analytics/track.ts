"use client";

/**
 * Generic PostHog `track()` wrapper used by the new event-instrumentation
 * surfaces introduced in Prompt 24 (hero CTA, service cards, contact form,
 * whitepaper download).
 *
 * The four AI tools and the region middleware retain their existing
 * namespaced telemetry helpers (`concierge.*`, `scoping.*`,
 * `del_readiness.*`, `dosage_matcher.*`, `region.*`) — those were already
 * shipped under Prompts 18–22 and are not duplicated here.
 *
 * This module short-circuits when `posthog-js` has not been initialized
 * (no `NEXT_PUBLIC_POSTHOG_KEY` in dev / preview / CI), so calls are safe
 * to sprinkle anywhere on the client.
 */
import posthog from "posthog-js";

type LoadedPostHog = typeof posthog & { __loaded?: boolean };

function isLoaded(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean((posthog as LoadedPostHog).__loaded);
}

/** Fire-and-forget capture. No-ops when PostHog isn't loaded. */
export function track(event: string, props?: Record<string, unknown>): void {
  if (!isLoaded()) return;
  posthog.capture(event, props);
}

/* -------------------------------------------------------------------------- */
/*  Bounded event taxonomy — typed wrappers                                   */
/*                                                                            */
/*  Spec source: Claude_Code_Prompts_Propharmex_Rebuild.md, Prompt 24.        */
/*  Documented end-to-end in docs/analytics-taxonomy.md.                      */
/* -------------------------------------------------------------------------- */

/** Hero CTA click on any landing-style page. `variant` is the button kind. */
export function trackHeroCtaClick(props: {
  /** Page identifier — `home`, `contact`, `services`, etc. */
  page: string;
  /** Visual variant — `primary | secondary | ghost`. */
  variant: "primary" | "secondary" | "ghost";
  /** Destination href so we can analyze CTA-to-conversion paths. */
  href: string;
  /** Visible label text (after voice-guardian) — short, never PII. */
  label: string;
}): void {
  track("hero_cta_click", props);
}

/** A service / capability card click on the homepage or `/services` hub. */
export function trackServiceCardClick(props: {
  /** Surface where the card was clicked — `home-what-we-do`, `services-hub`. */
  surface: string;
  /** Service slug or pillar id (e.g. `pharmaceutical-development`). */
  serviceId: string;
  /** Destination href. */
  href: string;
}): void {
  track("service_card_click", props);
}

/**
 * Generic form-submit event. Per the Prompt 24 spec we also fire a
 * surface-specific event (`contact_submit`, `whitepaper_download`) so the
 * Lead-funnel dashboard can pivot either way.
 */
export function trackFormSubmit(props: {
  /** Form identifier — `contact`, `whitepaper`, `inquiry-mini`. */
  form: string;
  /** Optional sub-classifier — e.g. service interest on the contact form. */
  category?: string;
  /** Whether the server-side delivery (Resend, etc.) was queued. */
  queued?: boolean;
}): void {
  track("form_submit", props);
}

/** Specific contact-form submit event mirroring `form_submit`. */
export function trackContactSubmit(props: {
  /** Service interest selected on the form (or `unspecified`). */
  service: string;
  /** Region selected on the form (or `unspecified`). */
  region: string;
  /** Whether the server-side flow queued an email. */
  queued?: boolean;
}): void {
  track("contact_submit", props);
}

/** Specific whitepaper-download submit event mirroring `form_submit`. */
export function trackWhitepaperDownload(props: {
  /** Whitepaper slug. */
  slug: string;
  /** Whether the gated email was queued by the backend. */
  queued: boolean;
}): void {
  track("whitepaper_download", props);
}

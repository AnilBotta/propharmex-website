/**
 * Sentry client-side init (Prompt 25 PR-A).
 *
 * Loaded by Next.js automatically on the browser bundle. Sentry only
 * activates when `NEXT_PUBLIC_SENTRY_DSN` is set — dev / preview / CI
 * without a DSN pay zero overhead.
 *
 * Privacy posture (mirrors the server + edge configs):
 *   - PII redaction via `redactSentryEvent` in `beforeSend`.
 *   - `sendDefaultPii: false` — Sentry never auto-attaches IP / cookies.
 *   - Session replay is DISABLED — same rationale as PostHog session
 *     recording. We capture errors, not full session footage.
 *   - No `tracePropagationTargets` for third parties — distributed
 *     traces never leave our origin.
 *
 * Sample rate: 100% in dev, 25% in preview, 10% in production. Adjust
 * via the `tracesSampleRate` constant if the volume becomes a budget
 * concern.
 */
import * as Sentry from "@sentry/nextjs";

import { redactSentryEvent } from "./lib/sentry-redact";

const DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

const SAMPLE_RATE_BY_ENV: Record<string, number> = {
  production: 0.1,
  preview: 0.25,
  development: 1.0,
};

if (DSN) {
  const env = process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "development";
  Sentry.init({
    dsn: DSN,
    environment: env,
    enabled: true,
    tracesSampleRate: SAMPLE_RATE_BY_ENV[env] ?? 0.1,
    sendDefaultPii: false,
    // Session replay off — privacy + bundle-size win.
    replaysOnErrorSampleRate: 0,
    replaysSessionSampleRate: 0,
    integrations: [],
    beforeSend: (event) => redactSentryEvent(event),
    beforeBreadcrumb: (breadcrumb) => {
      // Drop fetch/xhr breadcrumbs that target the contact / whitepaper
      // endpoints — their bodies carry PII even before our beforeSend
      // has a chance to scrub the parent event.
      if (
        breadcrumb.category === "fetch" ||
        breadcrumb.category === "xhr"
      ) {
        const url =
          typeof breadcrumb.data?.url === "string" ? breadcrumb.data.url : "";
        if (
          url.includes("/api/contact") ||
          url.includes("/api/whitepaper-download") ||
          url.includes("/api/newsletter")
        ) {
          return null;
        }
      }
      return breadcrumb;
    },
  });
}

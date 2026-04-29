/**
 * Sentry server-side (Node.js runtime) init (Prompt 25 PR-A).
 *
 * Imported by `instrumentation.ts` when `NEXT_RUNTIME === "nodejs"`.
 * Captures errors from Node-runtime API routes (`/api/contact`,
 * `/api/whitepaper-download`, `/api/newsletter`, the AI tool PDF + submit
 * endpoints).
 *
 * Privacy: redaction via `redactSentryEvent`, plus sendDefaultPii=false.
 * Sentry's autoSessionTracking is left on (no PII implication; tracks
 * release health by counting healthy vs crashed sessions).
 */
import * as Sentry from "@sentry/nextjs";

import { redactSentryEvent } from "./lib/sentry-redact";

const DSN = process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN;

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
    tracesSampleRate: SAMPLE_RATE_BY_ENV[env] ?? 0.1,
    sendDefaultPii: false,
    integrations: [],
    beforeSend: (event) => redactSentryEvent(event),
  });
}

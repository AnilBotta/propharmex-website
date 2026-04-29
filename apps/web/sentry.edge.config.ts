/**
 * Sentry edge-runtime init (Prompt 25 PR-A).
 *
 * Imported by `instrumentation.ts` when `NEXT_RUNTIME === "edge"`.
 * Captures errors from edge-runtime API routes — `/api/health`,
 * `/api/csp-report`, `/api/region`, and the chat AI streaming endpoints.
 *
 * Edge runtime has a constrained subset of Node — no `process.cwd`, no
 * filesystem, no Buffer. The `@sentry/nextjs` package handles the
 * difference internally; we just import the same module and trust the
 * SDK's runtime detection.
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

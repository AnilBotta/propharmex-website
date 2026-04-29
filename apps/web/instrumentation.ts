/**
 * Next.js 15 instrumentation hook — Sentry init dispatch.
 *
 * Next 15 calls `register()` once per server runtime at boot. We use the
 * `NEXT_RUNTIME` env (set by Next at build / runtime) to pick the right
 * Sentry config. Client-side init lives in `sentry.client.config.ts`
 * which is loaded automatically by Next's Sentry integration.
 *
 * `onRequestError` is a Next 15 file-convention hook that fires for
 * errors thrown inside server components / route handlers / metadata
 * functions before they bubble to the default error boundary. We
 * re-export Sentry's pre-built `captureRequestError` so the SDK gets
 * the full `request` + `context` envelope (route path, router kind,
 * render type) rather than a synthesized one.
 */
import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

export const onRequestError = Sentry.captureRequestError;

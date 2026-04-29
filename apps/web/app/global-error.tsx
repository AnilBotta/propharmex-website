"use client";

/**
 * Global error boundary — renders only when the root layout itself throws.
 * Next.js requires its own <html>/<body> here because the shell is absent.
 *
 * Sentry capture (Prompt 25 PR-A): unhandled errors at the root level
 * are forwarded to Sentry via `captureException`. The SDK no-ops when
 * `NEXT_PUBLIC_SENTRY_DSN` is unset, so dev / preview without Sentry
 * env still log to the structured logger only.
 */
import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { log } from "@propharmex/lib";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
    log.error("app.root_error", {
      digest: error.digest,
      name: error.name,
      message: error.message,
    });
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#FAFAF7",
          color: "#0E4C5A",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif",
          padding: "24px",
        }}
      >
        <main style={{ maxWidth: 560, textAlign: "center" }}>
          <p
            style={{
              fontSize: 12,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontWeight: 600,
              color: "#A23B3B",
              marginBottom: 16,
            }}
          >
            Critical error
          </p>
          <h1
            style={{
              fontSize: 32,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              marginBottom: 16,
            }}
          >
            Propharmex is temporarily unavailable.
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: "#334" }}>
            Please retry in a moment or reach us at{" "}
            <a
              href="mailto:hello@propharmex.com"
              style={{ color: "#0E4C5A", textDecoration: "underline" }}
            >
              hello@propharmex.com
            </a>
            .
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 24,
              padding: "10px 20px",
              borderRadius: 12,
              background: "#0E4C5A",
              color: "#FAFAF7",
              border: "none",
              fontSize: 15,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}

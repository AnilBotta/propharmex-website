"use client";

/**
 * Segment error boundary.
 *
 * Renders for runtime failures in any page under the root segment. We show
 * a neutral apology, a retry button, and keep the header and footer so the
 * user can navigate away.
 *
 * Sentry capture (Prompt 25 PR-A) is wired alongside the structured-log
 * emit so Axiom + Sentry both see the same digest. Sentry no-ops when
 * `NEXT_PUBLIC_SENTRY_DSN` is unset.
 */
import { useEffect } from "react";
import Link from "next/link";
import * as Sentry from "@sentry/nextjs";
import { Button, Callout } from "@propharmex/ui";
import { log } from "@propharmex/lib";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
    log.error("app.segment_error", {
      digest: error.digest,
      name: error.name,
      message: error.message,
    });
  }, [error]);

  return (
    <section className="mx-auto flex max-w-2xl flex-col items-start gap-6 px-6 py-24 sm:py-32">
      <p className="font-[family-name:var(--font-display)] text-sm font-semibold uppercase tracking-[0.08em] text-[var(--color-danger)]">
        Something went wrong
      </p>
      <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight sm:text-5xl">
        The page hit an unexpected error.
      </h1>
      <p className="text-base leading-relaxed text-[var(--color-slate-700)]">
        Our engineering team has been notified. Try again, head back to the
        homepage, or contact us if the issue persists.
      </p>
      {error.digest && (
        <Callout tone="regulatory" title="Error reference">
          <code className="font-[family-name:var(--font-mono)] text-xs">
            {error.digest}
          </code>
          <p className="mt-1 text-xs">
            Please include this reference if you contact us about the issue.
          </p>
        </Callout>
      )}
      <div className="flex flex-wrap gap-3">
        <Button variant="primary" size="md" onClick={reset}>
          Try again
        </Button>
        <Button asChild variant="secondary" size="md">
          <Link href="/">Return home</Link>
        </Button>
        <Button asChild variant="secondary" size="md">
          <Link href="/contact">Contact us</Link>
        </Button>
      </div>
    </section>
  );
}

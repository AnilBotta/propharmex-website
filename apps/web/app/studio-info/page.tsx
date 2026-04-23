/**
 * `/studio-info` — static info panel pointing editors at the Sanity Studio.
 *
 * The Studio is shipped as a separate workspace (`apps/studio`) and deployed
 * to `studio.propharmex.com` (prod) or `http://localhost:3333` (local dev).
 * Embedding the Studio inside the Next app adds build weight and couples the
 * two deployments; this info page gives editors a clean, branded landing
 * without compromising the web bundle.
 *
 * Copy is intentionally terse and should be reviewed by `brand-voice-guardian`
 * before any edits (CLAUDE.md §4.3).
 */
import type { Metadata } from "next";
import Link from "next/link";

import { env } from "@propharmex/lib";

export const metadata: Metadata = {
  title: "Studio access",
  description: "How to reach the Propharmex Sanity Studio.",
  robots: { index: false, follow: false },
};

const PROD_STUDIO_URL = "https://studio.propharmex.com";
const DEV_STUDIO_URL = "http://localhost:3333";

export default function StudioInfoPage() {
  const isDev = env.NODE_ENV !== "production";
  const studioUrl = isDev ? DEV_STUDIO_URL : PROD_STUDIO_URL;

  return (
    <section className="mx-auto w-full max-w-2xl px-6 py-24">
      <p className="mb-3 text-xs uppercase tracking-[0.18em] text-neutral-500">
        Editorial
      </p>
      <h1 className="mb-4 text-3xl font-semibold tracking-tight text-neutral-900">
        Sanity Studio runs separately.
      </h1>
      <p className="mb-8 text-base leading-relaxed text-neutral-700">
        The Propharmex Studio is a distinct workspace. It is not embedded in
        the public site, so editors can deploy Studio schema changes
        independently of the web app.
      </p>

      <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
        <dl className="space-y-4">
          <div>
            <dt className="text-xs uppercase tracking-[0.14em] text-neutral-500">
              Production
            </dt>
            <dd className="mt-1">
              <Link
                href={PROD_STUDIO_URL}
                className="text-sm font-medium text-neutral-900 underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-600"
              >
                {PROD_STUDIO_URL}
              </Link>
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.14em] text-neutral-500">
              Local development
            </dt>
            <dd className="mt-1 space-y-1">
              <code className="block rounded bg-white px-2 py-1 font-mono text-xs text-neutral-800 ring-1 ring-neutral-200">
                pnpm --filter studio dev
              </code>
              <Link
                href={DEV_STUDIO_URL}
                className="text-sm font-medium text-neutral-900 underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-600"
              >
                {DEV_STUDIO_URL}
              </Link>
            </dd>
          </div>
        </dl>
      </div>

      {isDev ? (
        <p className="mt-6 text-sm text-neutral-600">
          You are in a development build. The link above targets the locally
          running Studio.
        </p>
      ) : null}

      <p className="mt-8 text-sm text-neutral-600">
        Need access?{" "}
        <Link
          href="mailto:hello@propharmex.com"
          className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-600"
        >
          Request an invite
        </Link>
        .
      </p>

      <p className="sr-only">Studio URL for this environment: {studioUrl}</p>
    </section>
  );
}

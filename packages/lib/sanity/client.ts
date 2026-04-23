/**
 * Sanity clients — published + preview.
 *
 * Two clients:
 *  - `publishedClient` — perspective `published`, `useCdn: true`, no token required.
 *  - `previewClient`   — perspective `previewDrafts`, `useCdn: false`, reads
 *    `SANITY_API_READ_TOKEN`. Throws at fetch time (not import time) if token is
 *    missing so that unit tests that don't touch preview continue to work.
 *
 * Guards against missing `NEXT_PUBLIC_SANITY_PROJECT_ID`: we export stub clients
 * that throw with a friendly message the first time `.fetch()` is called. This
 * keeps `import` side-effect free so a misconfigured dev env doesn't break code
 * paths that never touch Sanity.
 */
import { createClient, type SanityClient } from "@sanity/client";
import { env } from "../env";

const API_VERSION_FALLBACK = "2025-01-01";

function buildStub(reason: string): SanityClient {
  const stub: Record<string, unknown> = {};
  const throwIt = () => {
    throw new Error(`[sanity] ${reason}`);
  };
  const handler: ProxyHandler<Record<string, unknown>> = {
    get(_target, prop) {
      if (prop === "then") return undefined; // don't look like a thenable
      if (prop === Symbol.toPrimitive) return () => "[sanity-stub-client]";
      return throwIt;
    },
  };
  return new Proxy(stub, handler) as unknown as SanityClient;
}

const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = env.NEXT_PUBLIC_SANITY_API_VERSION || API_VERSION_FALLBACK;

export const publishedClient: SanityClient = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
      perspective: "published",
      stega: false,
    })
  : buildStub(
      "Sanity not configured — set NEXT_PUBLIC_SANITY_PROJECT_ID in your environment to use publishedClient."
    );

export const previewClient: SanityClient = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
      perspective: "previewDrafts",
      token: env.SANITY_API_READ_TOKEN,
      stega: false,
      ignoreBrowserTokenWarning: true,
    })
  : buildStub(
      "Sanity not configured — set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_READ_TOKEN to use previewClient."
    );

/**
 * Pick the correct client for the current render mode.
 * In draft / preview mode (`preview=true`), drafts are resolved.
 */
export function getClient(preview = false): SanityClient {
  return preview ? previewClient : publishedClient;
}

export const sanityConfig = Object.freeze({
  projectId,
  dataset,
  apiVersion,
}) as Readonly<{
  projectId: string | undefined;
  dataset: string;
  apiVersion: string;
}>;

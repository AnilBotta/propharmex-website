/**
 * Typed Sanity fetch wrapper.
 *
 * Every read from Sanity goes through `sanityFetch` so that:
 *   1. We pick the right client based on `preview`.
 *   2. Next.js ISR caching + tag-based invalidation happen by default.
 *   3. The GROQ result is parsed through a Zod schema and any drift between
 *      Studio + code fails loud, at the boundary, with a useful message.
 *
 * Tag convention (consumed by `/api/revalidate` in a later prompt):
 *   - `sanity:<docType>`             — invalidate every doc of a type.
 *   - `sanity:<docType>:<slug>`      — invalidate a single doc.
 *   - `sanity:all`                   — nuke the whole content cache.
 */
import type { z } from "zod";
import { getClient } from "./client";

const DEFAULT_REVALIDATE_SECONDS = 300; // 5 minutes

export interface SanityFetchOptions<TSchema extends z.ZodTypeAny> {
  query: string;
  params?: Record<string, unknown>;
  parser: TSchema;
  tags?: string[];
  preview?: boolean;
  /** Identifier used only in error messages. */
  queryName?: string;
  /** Override Next.js ISR seconds. Ignored in preview. */
  revalidate?: number | false;
}

/**
 * Run a GROQ query, validate with Zod, return typed data.
 * Throws a descriptive error on parse failure that includes the query name.
 */
export async function sanityFetch<TSchema extends z.ZodTypeAny>(
  opts: SanityFetchOptions<TSchema>
): Promise<z.infer<TSchema>> {
  const {
    query,
    params = {},
    parser,
    tags,
    preview = false,
    queryName = "anonymous",
    revalidate,
  } = opts;

  const client = getClient(preview);

  // In preview we never cache — drafts must always be fresh. In published mode
  // we let Next.js ISR hold the result for `revalidate` seconds (default 5 min)
  // and invalidate via `tags`.
  const nextOptions: { revalidate?: number | false; tags?: string[] } = preview
    ? { revalidate: 0 }
    : {
        revalidate:
          revalidate === undefined ? DEFAULT_REVALIDATE_SECONDS : revalidate,
        tags,
      };

  let raw: unknown;
  try {
    // `next` is honored by `@sanity/client` when running under Next.js and
    // silently ignored elsewhere (plain Node scripts). The option is not part
    // of `@sanity/client`'s published type — cast via `unknown` so strict TS
    // doesn't reject the shape.
    const fetchOptions = {
      next: nextOptions,
      perspective: preview ? "previewDrafts" : "published",
      useCdn: !preview,
    } as unknown as Parameters<typeof client.fetch>[2];
    raw = await client.fetch(query, params, fetchOptions);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(
      `[sanityFetch:${queryName}] GROQ fetch failed: ${message}`
    );
  }

  const result = parser.safeParse(raw);
  if (!result.success) {
    const issues = result.error.issues
      .slice(0, 8)
      .map(
        (i) =>
          `  • ${i.path.join(".") || "<root>"}: ${i.message} (code=${i.code})`
      )
      .join("\n");
    throw new Error(
      `[sanityFetch:${queryName}] Zod parse failed:\n${issues}\n(see parser in packages/lib/sanity/parsers.ts)`
    );
  }

  return result.data;
}

/**
 * Build a canonical cache tag for a doc type, optionally scoped to a slug.
 * Mirror of the logic used by the webhook-driven revalidator.
 */
export function sanityTag(docType: string, slug?: string): string {
  return slug ? `sanity:${docType}:${slug}` : `sanity:${docType}`;
}

/**
 * Read the `px-region` cookie set by the Prompt 22 region middleware.
 *
 * Used as a PostHog super-property — every event carries the user's
 * resolved region (auto-detected or user-overridden) so dashboards can
 * segment by region without joining against another data source.
 *
 * Server-rendered region context is also available via
 * `apps/web/lib/region-server.ts`, but on the client we read directly
 * from `document.cookie` to avoid threading the value through React
 * context just for analytics initialization.
 */

import {
  REGION_COOKIE,
  RegionSchema,
  type Region,
} from "@propharmex/lib/region";

/**
 * Parse a single named cookie value out of a `Cookie:` header string.
 *
 * Accepts the raw `document.cookie` value. Returns the decoded value or
 * `undefined` if the cookie is not present.
 *
 * Exposed for unit-testing without `document`.
 */
export function readCookieFromHeader(
  cookieHeader: string,
  name: string,
): string | undefined {
  if (!cookieHeader) return undefined;
  const pairs = cookieHeader.split(";");
  for (const pair of pairs) {
    const idx = pair.indexOf("=");
    if (idx < 0) continue;
    const key = pair.slice(0, idx).trim();
    if (key !== name) continue;
    const value = pair.slice(idx + 1).trim();
    try {
      return decodeURIComponent(value);
    } catch {
      return value;
    }
  }
  return undefined;
}

/**
 * Read the region cookie and validate it. Returns `undefined` if the
 * cookie is missing or carries a value not in the canonical region set.
 */
export function readRegionFromCookie(
  cookieHeader: string,
): Region | undefined {
  const raw = readCookieFromHeader(cookieHeader, REGION_COOKIE);
  if (!raw) return undefined;
  const parsed = RegionSchema.safeParse(raw);
  return parsed.success ? parsed.data : undefined;
}

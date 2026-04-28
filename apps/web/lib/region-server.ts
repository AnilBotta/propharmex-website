/**
 * Server-side region helpers (Prompt 22 PR-A).
 *
 * `getServerRegion()` reads the `px-region` cookie set by the Edge
 * middleware. Falls back to GLOBAL when the cookie is absent (which
 * shouldn't happen in production — the middleware sets it on every
 * unmatched request — but is possible during prerender, on test
 * fixtures, or on the very first request before the middleware has
 * populated the response cookies).
 *
 * Use from RSC pages, layout, and server actions. Client components
 * should consume the region via `RegionContext` instead so the value
 * stays consistent across navigation without a server roundtrip.
 */
import "server-only";
import { cookies } from "next/headers";

import {
  REGION_BANNER_DISMISSED_COOKIE,
  REGION_COOKIE,
  RegionSchema,
  type Region,
} from "@propharmex/lib/region";

export async function getServerRegion(): Promise<Region> {
  const store = await cookies();
  const value = store.get(REGION_COOKIE)?.value;
  const parsed = RegionSchema.safeParse(value);
  return parsed.success ? parsed.data : "GLOBAL";
}

/**
 * True when the user has not yet dismissed (or interacted with) the
 * detection banner. The layout consumes this to decide whether to
 * mount `<RegionDetectionBanner />`.
 */
export async function shouldShowRegionBanner(): Promise<boolean> {
  const store = await cookies();
  return store.get(REGION_BANNER_DISMISSED_COOKIE)?.value !== "1";
}

/**
 * Edge middleware — region detection (Prompt 22 PR-A).
 *
 * Runs on every public-facing request. Sole job: ensure the visitor has
 * a `px-region` cookie set to one of our four canonical region codes
 * (CA / US / IN / GLOBAL). Three paths:
 *
 *   1. Cookie already set + valid → pass through unchanged.
 *   2. Legacy cookie (`propharmex-region`) present → migrate it to
 *      `px-region` so the existing visitor doesn't see the detection
 *      banner. Old cookie is left for the user to clear at their
 *      browser's leisure; we just stop reading from it.
 *   3. No cookie → read Vercel's `x-vercel-ip-country` header, map to
 *      a region, set the cookie. The detection banner is still shown
 *      on first render (gated by the absence of
 *      `px-region-banner-dismissed` — that cookie is set by either
 *      Dismiss or any explicit override).
 *
 * The cookie is NOT HttpOnly because the client RegionSwitcher reads
 * it directly to keep the trigger label in sync without an extra
 * round-trip. Secure + SameSite=Lax + 6-month max-age is the right
 * envelope for a non-sensitive personalization preference.
 *
 * Matcher excludes API routes, Next internals, and static assets so
 * the middleware doesn't run on every chunk request.
 */
import { NextResponse, type NextRequest } from "next/server";

import {
  countryToRegion,
  LEGACY_REGION_COOKIE,
  migrateLegacyRegion,
  REGION_COOKIE,
  REGION_COOKIE_MAX_AGE_SECONDS,
  RegionSchema,
  type Region,
} from "@propharmex/lib/region";

export const config = {
  /**
   * Run on real page requests only. Skip the API surface (rate-limited
   * elsewhere; the geo header still propagates), Next internals, and
   * static assets so we don't burn middleware invocations on every
   * chunk.
   */
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|brand|downloads|fonts|images).*)",
  ],
};

export function middleware(req: NextRequest) {
  const existing = req.cookies.get(REGION_COOKIE)?.value;
  const parsed = RegionSchema.safeParse(existing);
  if (parsed.success) {
    return NextResponse.next();
  }

  // Legacy migration — read the pre-Prompt-22 cookie if present.
  const legacy = req.cookies.get(LEGACY_REGION_COOKIE)?.value;
  const migrated = migrateLegacyRegion(legacy);
  const detected: Region =
    migrated ?? countryToRegion(req.headers.get("x-vercel-ip-country"));

  const res = NextResponse.next();
  res.cookies.set(REGION_COOKIE, detected, {
    path: "/",
    maxAge: REGION_COOKIE_MAX_AGE_SECONDS,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}

/**
 * /api/region — Set the `px-region` cookie + the banner-dismissed flag.
 *
 * Prompt 22 PR-A. Edge runtime — this is a tiny endpoint that just
 * writes cookies; no DB, no model. Two body shapes:
 *
 *   { region: Region }       → set/override px-region; also marks the
 *                              banner as dismissed (any explicit choice
 *                              counts as "the user has interacted with
 *                              the banner").
 *
 *   { dismissBanner: true }  → set only the banner-dismissed flag. Used
 *                              by the banner's "Dismiss" button when
 *                              the user is fine with the detected
 *                              region but doesn't want to see the
 *                              banner again.
 *
 * Response: 204 No Content with the cookies set. The client can fire
 * its own PostHog event after the response resolves — we don't fire
 * server-side because PostHog identity hasn't been established at
 * this point.
 */
import { NextResponse } from "next/server";
import { z } from "zod";

import {
  REGION_BANNER_DISMISSED_COOKIE,
  REGION_COOKIE,
  REGION_COOKIE_MAX_AGE_SECONDS,
  RegionSchema,
} from "@propharmex/lib/region";
import { log } from "@propharmex/lib";

export const runtime = "edge";

const BodySchema = z.union([
  z.object({ region: RegionSchema }),
  z.object({ dismissBanner: z.literal(true) }),
]);

export async function POST(req: Request) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const parsed = BodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request shape." },
      { status: 400 },
    );
  }

  const res = new NextResponse(null, { status: 204 });
  const isProd = process.env.NODE_ENV === "production";

  // Banner-dismissed cookie is set on every successful POST so the user
  // never sees the banner again from this browser.
  res.cookies.set(REGION_BANNER_DISMISSED_COOKIE, "1", {
    path: "/",
    maxAge: REGION_COOKIE_MAX_AGE_SECONDS,
    sameSite: "lax",
    secure: isProd,
  });

  if ("region" in parsed.data) {
    res.cookies.set(REGION_COOKIE, parsed.data.region, {
      path: "/",
      maxAge: REGION_COOKIE_MAX_AGE_SECONDS,
      sameSite: "lax",
      secure: isProd,
    });
    log.info("region.changed", { region: parsed.data.region });
  } else {
    log.info("region.banner_dismissed", {});
  }

  return res;
}

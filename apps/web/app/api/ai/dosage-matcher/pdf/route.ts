/**
 * /api/ai/dosage-matcher/pdf — Render a Dosage Form match as a branded PDF.
 *
 * Prompt 21 PR-B. Node runtime — same shape as
 * /api/ai/del-readiness/pdf and /api/ai/scoping/pdf.
 *
 * Flow:
 *   1. Validate body (Zod). 400 on shape failure.
 *   2. Per-IP rate limit (10 req / 5 min).
 *   3. Render the comparison via `renderDosageMatcherPdf`.
 *   4. Persist to dosage_matcher_sessions with status='pdf_only'.
 *      Best-effort — failure does NOT fail the response.
 *   5. Stream bytes back as application/pdf.
 *
 * Same TS-strict ArrayBuffer copy pattern as the other PDF routes —
 * pdf-lib's Uint8Array<ArrayBufferLike> isn't directly assignable to
 * BodyInit's BufferSource branch under strict mode.
 */
import { NextResponse } from "next/server";
import { z } from "zod";

import {
  dosageMatcher,
  getRateLimiter,
  log,
  supabase,
} from "@propharmex/lib";

export const runtime = "nodejs";

/* -------------------------------------------------------------------------- */
/*  Schema                                                                     */
/* -------------------------------------------------------------------------- */

const BodySchema = z.object({
  recommendation: dosageMatcher.RecommendationSchema,
  /** Original user input — persisted alongside for retroactive analysis. */
  input: dosageMatcher.MatcherInputSchema.optional(),
  region: z.string().max(40).optional(),
  referrer: z.string().max(500).optional(),
});

/* -------------------------------------------------------------------------- */
/*  Constants                                                                  */
/* -------------------------------------------------------------------------- */

const RATE_LIMIT_TOKENS = 10;
const RATE_LIMIT_WINDOW = "5 m" as const;

const pdfRateLimiter = getRateLimiter("dosage-matcher:pdf:ip", {
  tokens: RATE_LIMIT_TOKENS,
  window: RATE_LIMIT_WINDOW,
});

/* -------------------------------------------------------------------------- */
/*  Handler                                                                    */
/* -------------------------------------------------------------------------- */

export async function POST(req: Request) {
  // 1) Rate limit per IP.
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anon";
  const rl = await pdfRateLimiter.limit(ip);
  if (!rl.success) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((rl.reset - Date.now()) / 1000),
    );
    log.warn("dosage-matcher.pdf.rate_limited", { ip, retryAfterSeconds });
    return NextResponse.json(
      { error: "Too many downloads. Please wait a minute and try again." },
      {
        status: 429,
        headers: { "Retry-After": String(retryAfterSeconds) },
      },
    );
  }

  // 2) Parse + validate.
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const parsed = BodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid recommendation payload." },
      { status: 400 },
    );
  }
  const { recommendation, input, region, referrer } = parsed.data;

  // 3) Render the PDF.
  let bytes: Uint8Array;
  try {
    bytes = await dosageMatcher.renderDosageMatcherPdf(recommendation);
  } catch (err) {
    log.error("dosage-matcher.pdf.render_error", {
      message: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json(
      { error: "We couldn't render the PDF. Please try again." },
      { status: 500 },
    );
  }

  // 4) Persist (best-effort — never blocks the download).
  const sb = supabase.getServerSupabase();
  if (sb) {
    const { error } = await sb.from("dosage_matcher_sessions").insert({
      status: "pdf_only",
      recommendation,
      input: input ?? {},
      region: region ?? null,
      referrer: referrer ?? null,
    });
    if (error) {
      log.warn("dosage-matcher.pdf.persist_error", { message: error.message });
    }
  }

  log.info("dosage-matcher.pdf.ok", {
    region: region ?? "unspecified",
    bytes: bytes.byteLength,
    matchCount: recommendation.matches.length,
    topFitTier: recommendation.matches[0]?.fitTier ?? "none",
  });

  // 5) Stream the bytes.
  const today = new Date().toISOString().slice(0, 10);
  const filename = `propharmex-dosage-matcher-${today}.pdf`;
  const ab = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(ab).set(bytes);

  return new Response(ab, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": String(bytes.byteLength),
      "Cache-Control": "no-store",
    },
  });
}

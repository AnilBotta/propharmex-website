/**
 * /api/ai/del-readiness/pdf — Render a finalized DEL Readiness Assessment
 * as a branded PDF.
 *
 * Prompt 20 PR-B. Node runtime (pdf-lib's `save()` returns a Uint8Array;
 * Node lets us stream the buffer without the Edge body-size cap).
 *
 * Flow:
 *   1. Validate body (Zod). 400 on shape failure.
 *   2. Per-IP rate limit (10 req / 5 min — generous since users may
 *      regenerate after a re-take).
 *   3. Render via `renderDelReadinessPdf(assessment, rubric)`. The
 *      rubric is loaded server-side from `DEFAULT_RUBRIC` so the route
 *      never trusts a client-supplied rubric.
 *   4. Persist to del_readiness_sessions with status='pdf_only'.
 *      Best-effort — failure does NOT fail the response.
 *   5. Stream bytes back as application/pdf.
 *
 * Same TS-strict ArrayBuffer copy pattern as scoping/pdf — pdf-lib's
 * Uint8Array<ArrayBufferLike> isn't directly assignable to BodyInit's
 * BufferSource branch under strict mode.
 */
import { NextResponse } from "next/server";
import { z } from "zod";

import {
  delReadiness,
  getRateLimiter,
  log,
  supabase,
} from "@propharmex/lib";
import { renderDelReadinessPdf } from "@propharmex/lib/del-readiness/pdf";

export const runtime = "nodejs";

/* -------------------------------------------------------------------------- */
/*  Schema                                                                     */
/* -------------------------------------------------------------------------- */

const BodySchema = z.object({
  assessment: delReadiness.AssessmentSchema,
  /** Original answers — persisted alongside the assessment for retroactive analysis. */
  answers: delReadiness.AnswerMapSchema,
  region: z.string().max(40).optional(),
  referrer: z.string().max(500).optional(),
});

/* -------------------------------------------------------------------------- */
/*  Constants                                                                  */
/* -------------------------------------------------------------------------- */

const RATE_LIMIT_TOKENS = 10;
const RATE_LIMIT_WINDOW = "5 m" as const;

const pdfRateLimiter = getRateLimiter("del-readiness:pdf:ip", {
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
    log.warn("del-readiness.pdf.rate_limited", { ip, retryAfterSeconds });
    return NextResponse.json(
      { error: "Too many downloads. Please wait a minute and try again." },
      {
        status: 429,
        headers: { "Retry-After": String(retryAfterSeconds) },
      },
    );
  }

  // 2) Parse + validate body.
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const parsed = BodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid assessment payload." },
      { status: 400 },
    );
  }
  const { assessment, answers, region, referrer } = parsed.data;

  // 3) Render the PDF. Rubric is server-side — never trust a
  // client-supplied rubric for PDF rendering.
  const rubric = delReadiness.DEFAULT_RUBRIC;
  let bytes: Uint8Array;
  try {
    bytes = await renderDelReadinessPdf(assessment, rubric);
  } catch (err) {
    log.error("del-readiness.pdf.render_error", {
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
    const { error } = await sb.from("del_readiness_sessions").insert({
      status: "pdf_only",
      assessment,
      answers,
      rubric_version: assessment.rubricVersion,
      region: region ?? null,
      referrer: referrer ?? null,
    });
    if (error) {
      log.warn("del-readiness.pdf.persist_error", { message: error.message });
    }
  }

  log.info("del-readiness.pdf.ok", {
    region: region ?? "unspecified",
    bytes: bytes.byteLength,
    score: assessment.score,
    trafficLight: assessment.trafficLight,
    gapCount: assessment.gaps.length,
    remediationCount: assessment.remediation.length,
  });

  // 5) Stream the bytes. Filename includes the date for client-side
  // organization. `attachment` makes the browser download rather than
  // render inline — which is right for a personalized artifact.
  const today = new Date().toISOString().slice(0, 10);
  const filename = `propharmex-del-readiness-${today}.pdf`;
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

/**
 * /api/ai/scoping/pdf — Render a finalized scope as a branded PDF.
 *
 * Prompt 19 PR-B. Node runtime (pdf-lib's `PDFDocument.save` returns a
 * `Uint8Array` — works under both runtimes, but keeping it on Node lets us
 * stream large buffers without the Edge body-size cap).
 *
 * Flow:
 *   1. Validate body (Zod). 400 on shape failure.
 *   2. Per-IP rate limit (10 req / 5 min — generous since users may
 *      regenerate after edits).
 *   3. Render the scope via `renderScopePdf`. Returns `Uint8Array`.
 *   4. Persist to scoping_sessions with status='pdf_only'. Best-effort —
 *      failure does NOT fail the response; the user still gets the PDF.
 *   5. Stream the bytes back with `Content-Type: application/pdf` and a
 *      `Content-Disposition: attachment; filename=...`.
 *
 * The PDF carries the mandatory disclaimer in its footer (see
 * packages/lib/scoping/pdf.ts). Re-asserted by the route headers via
 * `Cache-Control: no-store` so an intermediary doesn't serve a stale copy
 * to a different user — these are personalized artifacts.
 */
import { NextResponse } from "next/server";
import { z } from "zod";

import {
  getRateLimiter,
  log,
  scoping,
  supabase,
} from "@propharmex/lib";

export const runtime = "nodejs";

/* -------------------------------------------------------------------------- */
/*  Schema                                                                     */
/* -------------------------------------------------------------------------- */

const TranscriptMessageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string().max(8000),
});

const BodySchema = z.object({
  scope: scoping.ScopeSummarySchema,
  transcript: z.array(TranscriptMessageSchema).max(40).optional(),
  region: z.string().max(40).optional(),
  referrer: z.string().max(500).optional(),
});

/* -------------------------------------------------------------------------- */
/*  Constants                                                                  */
/* -------------------------------------------------------------------------- */

const RATE_LIMIT_TOKENS = 10;
const RATE_LIMIT_WINDOW = "5 m" as const;

const pdfRateLimiter = getRateLimiter("scoping:pdf:ip", {
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
    log.warn("scoping.pdf.rate_limited", { ip, retryAfterSeconds });
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
      { error: "Invalid scope payload." },
      { status: 400 },
    );
  }
  const { scope, transcript, region, referrer } = parsed.data;

  // 3) Render the PDF.
  let bytes: Uint8Array;
  try {
    bytes = await scoping.renderScopePdf(scope);
  } catch (err) {
    log.error("scoping.pdf.render_error", {
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
    const { error } = await sb.from("scoping_sessions").insert({
      status: "pdf_only",
      scope_summary: scope,
      transcript: transcript ?? [],
      region: region ?? null,
      referrer: referrer ?? null,
    });
    if (error) {
      log.warn("scoping.pdf.persist_error", { message: error.message });
    }
  }

  log.info("scoping.pdf.ok", {
    region: region ?? "unspecified",
    bytes: bytes.byteLength,
    serviceCount: scope.recommendedServices.length,
    phaseCount: scope.phases.length,
  });

  // 5) Stream the bytes. Filename includes the date for client-side
  // organization. `attachment` makes the browser download rather than
  // render inline — which is right for a personalized artifact.
  //
  // pdf-lib's `save()` returns `Uint8Array<ArrayBufferLike>`, which TS
  // refuses to narrow to a non-shared ArrayBuffer (could in theory be
  // SharedArrayBuffer). Copy into a freshly allocated ArrayBuffer whose
  // type is unambiguous, then hand that to the Response constructor.
  const today = new Date().toISOString().slice(0, 10);
  const filename = `propharmex-scope-${today}.pdf`;
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

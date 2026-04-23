/**
 * Sanity → Next on-demand revalidation webhook.
 *
 * Sanity sends a POST with a JSON body describing the changed document and a
 * `sanity-webhook-signature` header in the form:
 *
 *     t=<unix-timestamp>,v1=<hex-hmac-sha256>
 *
 * where the HMAC is computed over `"${t}.${rawBody}"` using the shared
 * `SANITY_WEBHOOK_SECRET`. We verify with `crypto.timingSafeEqual` and, on
 * success, call `revalidateTag` for the document type and slug tags used
 * throughout the GROQ layer in `packages/lib/sanity/*`.
 *
 * Security (CLAUDE.md §4.5 + §10):
 *   - Never log the raw body or the signature.
 *   - On failure return a generic 401.
 *   - Runtime: nodejs — `node:crypto` is required for HMAC.
 */
import crypto from "node:crypto";

import { NextResponse, type NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { z } from "zod";

import { env, log } from "@propharmex/lib";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BodySchema = z.object({
  _id: z.string().min(1),
  _type: z.string().min(1),
  slug: z
    .object({
      current: z.string().min(1).optional(),
    })
    .partial()
    .optional(),
});

interface ParsedSignature {
  timestamp: string;
  v1: string;
}

/** Parse `t=<ts>,v1=<digest>` into its fields. Returns null on malformed input. */
function parseSignatureHeader(header: string | null): ParsedSignature | null {
  if (!header) return null;
  const parts = header.split(",").map((p) => p.trim());
  let timestamp: string | undefined;
  let v1: string | undefined;
  for (const part of parts) {
    const [k, ...rest] = part.split("=");
    const v = rest.join("=");
    if (k === "t") timestamp = v;
    else if (k === "v1") v1 = v;
  }
  if (!timestamp || !v1) return null;
  return { timestamp, v1 };
}

/** Constant-time comparison of two hex digests of equal length. */
function safeHexEqual(a: string, b: string): boolean {
  if (typeof a !== "string" || typeof b !== "string") return false;
  if (a.length !== b.length) return false;
  try {
    const bufA = Buffer.from(a, "hex");
    const bufB = Buffer.from(b, "hex");
    if (bufA.length !== bufB.length || bufA.length === 0) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const secret = env.SANITY_WEBHOOK_SECRET;
  if (!secret) {
    log.warn("revalidate.webhook_secret_not_configured");
    return NextResponse.json(
      { error: "Webhook not configured." },
      { status: 501 },
    );
  }

  const signatureHeader = req.headers.get("sanity-webhook-signature");
  const parsedSig = parseSignatureHeader(signatureHeader);
  if (!parsedSig) {
    log.warn("revalidate.signature_missing_or_malformed");
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  // Read raw body for HMAC. Must read once; re-parse as JSON below.
  const rawBody = await req.text();

  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${parsedSig.timestamp}.${rawBody}`)
    .digest("hex");

  if (!safeHexEqual(expected, parsedSig.v1)) {
    log.warn("revalidate.signature_mismatch");
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let json: unknown;
  try {
    json = JSON.parse(rawBody);
  } catch {
    log.warn("revalidate.invalid_json");
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 },
    );
  }

  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) {
    log.warn("revalidate.invalid_payload");
    return NextResponse.json(
      { error: "Invalid payload shape." },
      { status: 400 },
    );
  }

  const { _type, slug } = parsed.data;
  const tags: string[] = [`sanity:${_type}`];
  if (slug?.current) {
    tags.push(`sanity:${_type}:${slug.current}`);
  }

  for (const tag of tags) {
    revalidateTag(tag);
  }

  log.info("revalidate.ok", { type: _type, tagCount: tags.length });

  return NextResponse.json({ revalidated: true, tags }, { status: 200 });
}

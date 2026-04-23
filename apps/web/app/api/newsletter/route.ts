/**
 * Newsletter signup — double-opt-in via Resend.
 *
 * Pipeline:
 *  1. Zod-validate the payload (email, consent).
 *  2. If Turnstile is configured, verify the token server-side.
 *  3. Add contact to Resend audience with `unsubscribed: true` so Resend
 *     triggers its own confirmation email. (Phase 7 wires a custom
 *     confirmation flow with a Propharmex-branded template.)
 *  4. Return 202 on success. On configuration gaps, return 202 with a
 *     flag so the UI still shows "check your inbox" — dev does not leak.
 *
 * Rate limiting: Upstash wrapper lands in Prompt 25. For now the endpoint
 * fails closed on malformed input and returns generic errors upward.
 *
 * Runtime: Node — Resend SDK needs it. Rate-limited AI routes run Edge.
 */
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

import { env, log } from "@propharmex/lib";

export const runtime = "nodejs";

const BodySchema = z.object({
  email: z.string().email().max(254),
  consent: z.literal(true),
  turnstileToken: z.string().optional(),
});

async function verifyTurnstile(token: string, ip: string | null) {
  if (!env.TURNSTILE_SECRET_KEY) return true; // not configured → skip
  const form = new URLSearchParams({
    secret: env.TURNSTILE_SECRET_KEY,
    response: token,
  });
  if (ip) form.set("remoteip", ip);
  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    { method: "POST", body: form },
  );
  if (!res.ok) return false;
  const data = (await res.json()) as { success?: boolean };
  return !!data.success;
}

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 },
    );
  }

  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please provide a valid email and confirm consent." },
      { status: 400 },
    );
  }
  const { email, turnstileToken } = parsed.data;

  // Turnstile (optional in dev)
  if (env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && turnstileToken) {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
    const ok = await verifyTurnstile(turnstileToken, ip);
    if (!ok) {
      return NextResponse.json(
        { error: "Bot verification failed. Please retry." },
        { status: 403 },
      );
    }
  }

  // Resend
  if (!env.RESEND_API_KEY || !env.RESEND_NEWSLETTER_AUDIENCE_ID) {
    log.warn("newsletter.not_configured", { email: redact(email) });
    // Preserve the UX so QA is unblocked; queue flag surfaces in observability.
    return NextResponse.json(
      { ok: true, queued: false },
      { status: 202 },
    );
  }

  try {
    const resend = new Resend(env.RESEND_API_KEY);
    await resend.contacts.create({
      email,
      audienceId: env.RESEND_NEWSLETTER_AUDIENCE_ID,
      unsubscribed: true, // forces Resend confirmation flow
    });
    log.info("newsletter.signup_queued", { email: redact(email) });
    return NextResponse.json({ ok: true, queued: true }, { status: 202 });
  } catch (err) {
    log.error("newsletter.signup_error", {
      email: redact(email),
      message: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json(
      { error: "We couldn't process that subscription. Please try again." },
      { status: 502 },
    );
  }
}

/** Redact the local part of an email for log output. */
function redact(email: string) {
  const [user, domain] = email.split("@");
  if (!domain) return "***";
  const visible = user?.slice(0, 2) ?? "";
  return `${visible}***@${domain}`;
}

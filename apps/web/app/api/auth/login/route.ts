/**
 * /api/auth/login — Send a Supabase magic-link to an allowlisted email.
 *
 * Why server-side: Supabase's `signInWithOtp` can be called from the
 * browser, but we want the allowlist gate to happen BEFORE the email is
 * dispatched. Calling from the server lets us reject non-allowlisted
 * emails without leaking which addresses are valid (we still 202).
 *
 * The Supabase project handles email delivery via its own SMTP
 * (default sender works without any custom Resend domain config — the
 * dev-tier sender is rate-limited to a few emails/hour, which is fine
 * for a small BD team). Customize the email template + SMTP later via
 * the Supabase dashboard.
 */
import { NextResponse } from "next/server";
import { z } from "zod";

import { env, getRateLimiter, log } from "@propharmex/lib";

import {
  createSupabaseServerClient,
  isAllowedEmail,
} from "../../../../lib/supabase-auth/server";

export const runtime = "nodejs";

const BodySchema = z.object({
  email: z.string().email().max(254),
});

const loginRateLimiter = getRateLimiter("auth:login:ip", {
  tokens: 3,
  window: "1 h",
});

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anon";
  const rl = await loginRateLimiter.limit(ip);
  if (!rl.success) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((rl.reset - Date.now()) / 1000),
    );
    log.warn("auth.login.rate_limited", { ip, retryAfterSeconds });
    return NextResponse.json(
      { error: "Too many attempts. Try again in an hour." },
      { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } },
    );
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const parsed = BodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }
  const email = parsed.data.email.trim().toLowerCase();
  const emailDomain = email.split("@")[1] ?? "unknown";

  // Always 202 — never reveal which emails are allowlisted.
  if (!isAllowedEmail(email)) {
    log.info("auth.login.not_allowlisted", { emailDomain });
    return NextResponse.json({ ok: true }, { status: 202 });
  }

  let supabase;
  try {
    supabase = await createSupabaseServerClient();
  } catch (err) {
    log.error("auth.login.client_unavailable", {
      message: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json({ ok: true }, { status: 202 });
  }

  const siteUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const redirectTo = `${siteUrl}/api/auth/confirm`;

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirectTo,
      // Don't auto-create users — only allowlisted emails allowed in.
      // (The user is created on first verify if Supabase Auth is set to
      // allow signup. To prevent random sign-ups, set "Enable Sign Up"
      // to OFF in the Supabase dashboard and pre-create the allowlisted
      // users. The allowlist check above is the primary gate either way.)
      shouldCreateUser: true,
    },
  });

  if (error) {
    log.error("auth.login.supabase_error", {
      emailDomain,
      message: error.message,
    });
    // Don't expose Supabase errors to the user — they could leak
    // existence info. Log it; respond 202.
    return NextResponse.json({ ok: true }, { status: 202 });
  }

  log.info("auth.login.sent", { emailDomain });
  return NextResponse.json({ ok: true, queued: true }, { status: 202 });
}

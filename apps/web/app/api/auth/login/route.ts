/**
 * /api/auth/login — Email + password sign-in via Supabase Auth.
 *
 * The user creates their Supabase account in the Supabase dashboard
 * (Authentication → Users → Add user → "Create new user" with a password).
 * Then they sign in here with the same email + password — no email
 * confirmation round-trip needed.
 *
 * Allowlist gate: even if a Supabase user exists, sign-in is rejected
 * unless their email is in DASHBOARD_ALLOWED_EMAILS. This is the same
 * env-var gate used by getDashboardUserEmail() so removing an email
 * from the allowlist locks the user out everywhere.
 */
import { NextResponse } from "next/server";
import { z } from "zod";

import { getRateLimiter, log } from "@propharmex/lib";

import {
  createSupabaseServerClient,
  isAllowedEmail,
} from "../../../../lib/supabase-auth/server";

export const runtime = "nodejs";

const BodySchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(6).max(256),
});

const loginRateLimiter = getRateLimiter("auth:login:ip", {
  tokens: 10,
  window: "15 m",
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
      { error: "Too many attempts. Try again in a few minutes." },
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
      { error: "Email and password (≥ 6 chars) are required." },
      { status: 400 },
    );
  }
  const email = parsed.data.email.trim().toLowerCase();
  const emailDomain = email.split("@")[1] ?? "unknown";

  // Reject non-allowlisted emails before hitting Supabase. Use the same
  // generic error message as a credential failure so we don't leak which
  // emails are allowlisted.
  if (!isAllowedEmail(email)) {
    log.info("auth.login.not_allowlisted", { emailDomain });
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 },
    );
  }

  let supabase;
  try {
    supabase = await createSupabaseServerClient();
  } catch (err) {
    log.error("auth.login.client_unavailable", {
      message: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json(
      { error: "Sign-in is temporarily unavailable. Please retry." },
      { status: 503 },
    );
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: parsed.data.password,
  });

  if (error || !data.user) {
    log.warn("auth.login.failed", {
      emailDomain,
      message: error?.message ?? "no_user",
    });
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 },
    );
  }

  log.info("auth.login.ok", { emailDomain });
  return NextResponse.json({ ok: true }, { status: 200 });
}

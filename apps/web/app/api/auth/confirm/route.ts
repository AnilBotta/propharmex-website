/**
 * /api/auth/confirm — Email-link landing handler for Supabase Auth.
 *
 * Two flows currently route through here:
 *   - type=recovery → password reset (Send password recovery in dashboard)
 *   - type=email/magiclink → legacy magic-link sign-in (kept so old emails
 *     from PR #76 still resolve cleanly even though /api/auth/login now
 *     uses signInWithPassword)
 *
 * Supabase email templates should send the user to:
 *   {{ .SiteURL }}/api/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/dashboard/reset-password
 *
 * We exchange the token_hash for a session via supabase.auth.verifyOtp,
 * which sets the auth cookies via the @supabase/ssr cookie adapter.
 * Then we redirect to `next` (defaulting to /dashboard, except for
 * recovery which defaults to /dashboard/reset-password).
 *
 * Allowlist re-enforcement: applied for non-recovery types. For recovery
 * we let the user reach the reset page even if they're no longer in the
 * allowlist — the actual sign-in via /api/auth/login still gates them
 * out, so a stale recovery cannot grant access.
 */
import { NextResponse } from "next/server";

import { log } from "@propharmex/lib";

import {
  createSupabaseServerClient,
  isAllowedEmail,
} from "../../../../lib/supabase-auth/server";

export const runtime = "nodejs";

type SupportedOtpType = "email" | "magiclink" | "recovery" | "invite" | "signup";

const SUPPORTED_TYPES = new Set<SupportedOtpType>([
  "email",
  "magiclink",
  "recovery",
  "invite",
  "signup",
]);

export async function GET(req: Request) {
  const url = new URL(req.url);
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type");
  const next = url.searchParams.get("next") ?? "";

  if (!tokenHash || !type || !SUPPORTED_TYPES.has(type as SupportedOtpType)) {
    return NextResponse.redirect(loginUrl(req, "missing"), 303);
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.verifyOtp({
    type: type as SupportedOtpType,
    token_hash: tokenHash,
  });

  if (error || !data.user?.email) {
    log.warn("auth.confirm.verify_failed", {
      type,
      message: error?.message ?? "no_user",
    });
    return NextResponse.redirect(loginUrl(req, "invalid"), 303);
  }

  // Allowlist check — skip for recovery (the user is allowed to reset
  // their password even if they were just removed from the allowlist;
  // they still won't be able to sign in afterward).
  if (type !== "recovery" && !isAllowedEmail(data.user.email)) {
    await supabase.auth.signOut();
    log.warn("auth.confirm.not_allowlisted", {
      type,
      emailDomain: data.user.email.split("@")[1] ?? "unknown",
    });
    return NextResponse.redirect(loginUrl(req, "not_allowed"), 303);
  }

  log.info("auth.confirm.ok", {
    type,
    emailDomain: data.user.email.split("@")[1] ?? "unknown",
  });

  // Default landing depends on type.
  const defaultNext =
    type === "recovery" ? "/dashboard/reset-password" : "/dashboard";
  const safeNext =
    next && next.startsWith("/") && !next.startsWith("//")
      ? next
      : defaultNext;
  return NextResponse.redirect(new URL(safeNext, req.url), 303);
}

function loginUrl(req: Request, reason: string): URL {
  const url = new URL("/dashboard/login", req.url);
  url.searchParams.set("error", reason);
  return url;
}

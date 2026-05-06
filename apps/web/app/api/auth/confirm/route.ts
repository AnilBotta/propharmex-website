/**
 * /api/auth/confirm — Magic-link landing page handler.
 *
 * Supabase email templates send the user to:
 *   https://propharmex.com/api/auth/confirm?token_hash=<hash>&type=email&next=/dashboard
 *
 * We exchange the token_hash for a session via supabase.auth.verifyOtp,
 * which sets the auth cookies (sb-*-access-token + sb-*-refresh-token)
 * via the cookie adapter wired in lib/supabase-auth/server.ts. Then we
 * redirect to `next` (defaulting to /dashboard).
 *
 * Allowlist re-check: even if Supabase issues a session for an email
 * that's no longer in DASHBOARD_ALLOWED_EMAILS, getDashboardUserEmail()
 * (called by every dashboard page + API route) will reject it. To force
 * an immediate logout for removed users, also revoke their session here.
 */
import { NextResponse } from "next/server";

import { log } from "@propharmex/lib";

import {
  createSupabaseServerClient,
  isAllowedEmail,
} from "../../../../lib/supabase-auth/server";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type");
  const next = url.searchParams.get("next") || "/dashboard";

  if (!tokenHash || !type) {
    return NextResponse.redirect(loginUrl(req, "missing"), 303);
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.verifyOtp({
    type: type as "email" | "magiclink",
    token_hash: tokenHash,
  });

  if (error || !data.user?.email) {
    log.warn("auth.confirm.verify_failed", {
      message: error?.message ?? "no_user",
    });
    return NextResponse.redirect(loginUrl(req, "invalid"), 303);
  }

  // Re-enforce allowlist post-verify. If the user got here with a valid
  // token but the env-var allowlist no longer includes them, sign them
  // out immediately and bounce.
  if (!isAllowedEmail(data.user.email)) {
    await supabase.auth.signOut();
    log.warn("auth.confirm.not_allowlisted", {
      emailDomain: data.user.email.split("@")[1] ?? "unknown",
    });
    return NextResponse.redirect(loginUrl(req, "not_allowed"), 303);
  }

  log.info("auth.confirm.ok", {
    emailDomain: data.user.email.split("@")[1] ?? "unknown",
  });

  // `next` is a server-validated path. Reject anything that looks like
  // an open redirect (must start with `/` and not `//`).
  const safeNext = next.startsWith("/") && !next.startsWith("//")
    ? next
    : "/dashboard";
  return NextResponse.redirect(new URL(safeNext, req.url), 303);
}

function loginUrl(req: Request, reason: string): URL {
  const url = new URL("/dashboard/login", req.url);
  url.searchParams.set("error", reason);
  return url;
}

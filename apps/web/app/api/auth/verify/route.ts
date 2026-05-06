/**
 * Legacy verify endpoint — superseded by /api/auth/confirm (Supabase
 * Auth flow). Kept as a redirect so any pre-existing magic links from
 * the prior homegrown flow don't 404; they'll bounce to the login form
 * instead.
 */
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL("/dashboard/login", req.url);
  url.searchParams.set("error", "expired");
  return NextResponse.redirect(url, 303);
}

export async function POST(req: Request) {
  return GET(req);
}

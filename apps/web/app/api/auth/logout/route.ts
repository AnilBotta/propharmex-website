/**
 * /api/auth/logout — sign out via Supabase.
 *
 * Supabase clears its own auth cookies via the SSR cookie adapter wired
 * in lib/supabase-auth/server.ts. Subsequent requests fail
 * `getDashboardUserEmail()` and bounce to /dashboard/login.
 */
import { NextResponse } from "next/server";

import { log } from "@propharmex/lib";

import { createSupabaseServerClient } from "../../../../lib/supabase-auth/server";

export const runtime = "nodejs";

export async function POST() {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    log.warn("auth.logout.error", { message: error.message });
  } else {
    log.info("auth.logout.ok");
  }
  return NextResponse.json({ ok: true }, { status: 200 });
}

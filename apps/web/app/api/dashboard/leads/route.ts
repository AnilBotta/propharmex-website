/**
 * /api/dashboard/leads — list leads (auth-gated via Supabase session).
 *
 * GET  ?source=&status=&limit=&offset=
 * Returns: { leads: LeadRow[], total: number, kpis, session }.
 */
import { NextResponse } from "next/server";

import { supabase } from "@propharmex/lib";

import { getDashboardUserEmail } from "../../../../lib/supabase-auth/server";

export const runtime = "nodejs";

const MAX_LIMIT = 200;
const DEFAULT_LIMIT = 50;

export async function GET(req: Request) {
  const sessionEmail = await getDashboardUserEmail();
  if (!sessionEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sb = supabase.getServerSupabase();
  if (!sb) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 503 },
    );
  }

  const url = new URL(req.url);
  const source = url.searchParams.get("source");
  const status = url.searchParams.get("status");
  const limit = clamp(
    Number.parseInt(url.searchParams.get("limit") ?? "", 10) || DEFAULT_LIMIT,
    1,
    MAX_LIMIT,
  );
  const offset = Math.max(
    Number.parseInt(url.searchParams.get("offset") ?? "", 10) || 0,
    0,
  );

  let query = sb
    .from("leads")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (source) query = query.eq("source", source);
  if (status) query = query.eq("status", status);

  const { data, error, count } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const sevenDaysAgo = new Date(
    Date.now() - 7 * 24 * 60 * 60 * 1000,
  ).toISOString();
  const [{ count: weekCount }, { count: hotCount }, conversionStats] =
    await Promise.all([
      sb
        .from("leads")
        .select("*", { count: "exact", head: true })
        .gte("created_at", sevenDaysAgo),
      sb
        .from("lead_intelligence")
        .select("*", { count: "exact", head: true })
        .eq("intent_band", "hot"),
      sb.from("leads").select("status").then((r) => r),
    ]);

  let total = 0;
  let won = 0;
  if (Array.isArray(conversionStats.data)) {
    total = conversionStats.data.length;
    won = conversionStats.data.filter(
      (r: { status: string }) => r.status === "won",
    ).length;
  }
  const conversionPct = total > 0 ? Math.round((won / total) * 1000) / 10 : 0;

  return NextResponse.json(
    {
      leads: data ?? [],
      total: count ?? 0,
      kpis: {
        thisWeek: weekCount ?? 0,
        hotLeads: hotCount ?? 0,
        conversionPct,
        wonCount: won,
        totalAllTime: total,
      },
      session: { email: sessionEmail },
    },
    { status: 200 },
  );
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

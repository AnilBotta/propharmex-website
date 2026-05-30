/**
 * /api/dashboard/funnel — AI tool funnel rollup (PR-N3).
 *
 * Auth-gated (Supabase session).
 */
import { NextResponse } from "next/server";

import { supabase } from "@propharmex/lib";

import { getDashboardUserEmail } from "../../../../lib/supabase-auth/server";

export const runtime = "nodejs";

interface ToolFunnel {
  id: "scoping" | "del_readiness" | "dosage_matcher" | "concierge";
  label: string;
  runs: number;
  leads: number;
  won: number;
}

export async function GET() {
  const sessionEmail = await getDashboardUserEmail();
  if (!sessionEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const sb = supabase.getServerSupabase();
  if (!sb) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const [{ count: scopingRuns }, { count: delRuns }, { count: dmRuns }, { data: leadsRows }] =
    await Promise.all([
      sb.from("scoping_sessions").select("*", { count: "exact", head: true }),
      sb.from("del_readiness_sessions").select("*", { count: "exact", head: true }),
      sb.from("dosage_matcher_sessions").select("*", { count: "exact", head: true }),
      sb.from("leads").select("source, status"),
    ]);

  const leadCountBy = (source: string) =>
    Array.isArray(leadsRows)
      ? leadsRows.filter((r: { source: string }) => r.source === source).length
      : 0;
  const wonCountBy = (source: string) =>
    Array.isArray(leadsRows)
      ? leadsRows.filter(
          (r: { source: string; status: string }) => r.source === source && r.status === "won"
        ).length
      : 0;

  const tools: ToolFunnel[] = [
    {
      id: "scoping",
      label: "Project Scoping AI",
      runs: scopingRuns ?? 0,
      leads: leadCountBy("scoping"),
      won: wonCountBy("scoping"),
    },
    {
      id: "del_readiness",
      label: "Regulatory readiness",
      runs: delRuns ?? 0,
      leads: leadCountBy("del_readiness"),
      won: wonCountBy("del_readiness"),
    },
    {
      id: "dosage_matcher",
      label: "Dosage Matcher",
      runs: dmRuns ?? 0,
      leads: leadCountBy("dosage_matcher"),
      won: wonCountBy("dosage_matcher"),
    },
    {
      id: "concierge",
      label: "Concierge Chat",
      runs: leadCountBy("concierge"),
      leads: leadCountBy("concierge"),
      won: wonCountBy("concierge"),
    },
  ];

  return NextResponse.json({ tools });
}

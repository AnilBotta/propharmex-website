import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { supabase } from "@propharmex/lib";

import { getDashboardUserEmail } from "../../../lib/supabase-auth/server";

export const metadata: Metadata = {
  title: "AI Funnel · Propharmex Console",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

interface ToolStat {
  id: string;
  label: string;
  runs: number;
  leads: number;
  won: number;
}

export default async function FunnelPage() {
  const sessionEmail = await getDashboardUserEmail();
  if (!sessionEmail) redirect("/dashboard/login");

  const sb = supabase.getServerSupabase();
  let tools: ToolStat[] = [];
  if (sb) {
    const [{ count: scopingRuns }, { count: delRuns }, { count: dmRuns }, { data: leadsRows }] =
      await Promise.all([
        sb.from("scoping_sessions").select("*", { count: "exact", head: true }),
        sb.from("del_readiness_sessions").select("*", { count: "exact", head: true }),
        sb.from("dosage_matcher_sessions").select("*", { count: "exact", head: true }),
        sb.from("leads").select("source, status"),
      ]);
    const by = (s: string, status?: string) =>
      Array.isArray(leadsRows)
        ? leadsRows.filter(
            (r: { source: string; status: string }) =>
              r.source === s && (status ? r.status === status : true)
          ).length
        : 0;

    tools = [
      {
        id: "scoping",
        label: "Project Scoping AI",
        runs: scopingRuns ?? 0,
        leads: by("scoping"),
        won: by("scoping", "won"),
      },
      {
        id: "del_readiness",
        label: "Regulatory readiness",
        runs: delRuns ?? 0,
        leads: by("del_readiness"),
        won: by("del_readiness", "won"),
      },
      {
        id: "dosage_matcher",
        label: "Dosage Matcher",
        runs: dmRuns ?? 0,
        leads: by("dosage_matcher"),
        won: by("dosage_matcher", "won"),
      },
      {
        id: "concierge",
        label: "Concierge Chat",
        runs: by("concierge"),
        leads: by("concierge"),
        won: by("concierge", "won"),
      },
    ];
  }

  const totalRuns = tools.reduce((s, t) => s + t.runs, 0);
  const totalLeads = tools.reduce((s, t) => s + t.leads, 0);
  const totalWon = tools.reduce((s, t) => s + t.won, 0);

  return (
    <main className="px-6 py-6">
      <header className="mb-5">
        <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">AI tool funnel</h1>
        <p className="mt-1 text-[13px] text-slate-500">
          How each AI tool turns into a real engagement. Refresh weekly to see the trend.
        </p>
      </header>

      {/* Aggregate */}
      <section className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <AggCell label="Total AI runs" value={totalRuns.toString()} />
        <AggCell
          label="Leads from AI tools"
          value={totalLeads.toString()}
          sub={
            totalRuns > 0 ? `${Math.round((totalLeads / totalRuns) * 100)}% conversion` : undefined
          }
        />
        <AggCell
          label="Won deals"
          value={totalWon.toString()}
          sub={
            totalLeads > 0 ? `${Math.round((totalWon / totalLeads) * 100)}% close rate` : undefined
          }
        />
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {tools.map((tool) => (
          <article
            key={tool.id}
            className="rounded-lg border border-[color:var(--color-border)] bg-white p-4"
          >
            <h3 className="text-[14px] font-semibold text-slate-800">{tool.label}</h3>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <Metric label="Runs" value={tool.runs} />
              <Metric label="Leads" value={tool.leads} accent="#1E9BD8" />
              <Metric label="Won" value={tool.won} accent="#1F7A2C" />
            </div>
            {tool.runs > 0 ? (
              <p className="mt-3 text-[12px] text-slate-500">
                {Math.round((tool.leads / tool.runs) * 100)}% of runs convert ·{" "}
                {tool.leads > 0
                  ? `${Math.round((tool.won / tool.leads) * 100)}% of leads close`
                  : "no closes yet"}
              </p>
            ) : (
              <p className="mt-3 text-[12px] text-slate-400">No runs recorded yet.</p>
            )}
          </article>
        ))}
      </section>
    </main>
  );
}

function AggCell({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <article className="rounded-lg border border-[color:var(--color-border)] bg-white p-4">
      <span className="text-[10px] font-semibold tracking-[0.1em] text-slate-500">{label}</span>
      <div className="mt-1 font-mono text-[28px] font-semibold leading-tight tracking-tight text-slate-900">
        {value}
      </div>
      {sub ? <div className="mt-1 text-[12px] text-slate-500">{sub}</div> : null}
    </article>
  );
}

function Metric({ label, value, accent }: { label: string; value: number; accent?: string }) {
  return (
    <div>
      <div className="text-[10px] font-semibold tracking-[0.06em] text-slate-400">{label}</div>
      <div className="font-mono text-[18px] font-semibold" style={{ color: accent ?? undefined }}>
        {value}
      </div>
    </div>
  );
}

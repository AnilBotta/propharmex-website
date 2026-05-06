"use client";

import { useState } from "react";

import type { LeadRow } from "@propharmex/lib/leads/types";

import { ActivityFeed, type ActivityItem } from "./components/ActivityFeed";
import { KpiCard } from "./components/KpiCard";
import { LeadSourcesCard, type SourceShare } from "./components/LeadSourcesCard";
import { LeadTable } from "./components/LeadTable";
import { Placeholder } from "./components/Placeholder";
import { LeadDrawer } from "./LeadDrawer";

interface Kpis {
  newLeads7d: { value: number; deltaPct: number; spark: number[] };
  qualifiedOpen: { value: number; deltaPct: number; spark: number[] };
  avgResponseHours: { value: number; deltaPct: number; spark: number[] };
  hotOpen: { value: number; subtext: string };
  topSourceLabel: string;
}

export function DashboardShell({
  initialLeads,
  kpis,
  sources,
  activity,
}: {
  initialLeads: LeadRow[];
  kpis: Kpis;
  sources: SourceShare[];
  activity: ActivityItem[];
}) {
  const [leads, setLeads] = useState<LeadRow[]>(initialLeads);
  const [openLeadId, setOpenLeadId] = useState<string | null>(null);

  function handleLeadUpdate(updated: LeadRow) {
    setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
  }

  return (
    <main className="px-6 py-6">
      {/* Page header */}
      <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">
            Lead intake & active programs
          </h1>
          <p className="mt-1 text-[13px] text-slate-500">
            All form submissions from propharmex.com flow into this view.
            Triage, route, and convert.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled
            className="cursor-not-allowed rounded-md border border-[color:var(--color-border)] bg-white px-2.5 py-1.5 text-[12px] text-slate-700"
          >
            Last 30 days
          </button>
          <button
            type="button"
            disabled
            className="cursor-not-allowed rounded-md border border-[color:var(--color-border)] bg-white px-2.5 py-1.5 text-[12px] text-slate-700"
          >
            Export
          </button>
          <button
            type="button"
            disabled
            className="cursor-not-allowed rounded-md bg-accent-500 px-3 py-1.5 text-[12px] font-medium text-white opacity-90"
          >
            + Quick capture
          </button>
        </div>
      </header>

      {/* KPI strip */}
      <section className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="NEW LEADS · 7D"
          value={kpis.newLeads7d.value.toString()}
          delta={
            kpis.newLeads7d.deltaPct === 0
              ? undefined
              : { pct: kpis.newLeads7d.deltaPct, positive: kpis.newLeads7d.deltaPct > 0 }
          }
          spark={{ data: kpis.newLeads7d.spark, color: "#1E9BD8" }}
          subtext={`${kpis.topSourceLabel} leading source`}
          dot="#F47B20"
        />
        <KpiCard
          label="QUALIFIED · OPEN"
          value={kpis.qualifiedOpen.value.toString()}
          delta={
            kpis.qualifiedOpen.deltaPct === 0
              ? undefined
              : { pct: kpis.qualifiedOpen.deltaPct, positive: kpis.qualifiedOpen.deltaPct > 0 }
          }
          spark={{ data: kpis.qualifiedOpen.spark, color: "#3DB54A" }}
          subtext={`${kpis.qualifiedOpen.value} in active outreach`}
          dot="#3DB54A"
        />
        <KpiCard
          label="AVG. RESPONSE TIME"
          value={`${kpis.avgResponseHours.value.toFixed(1)}h`}
          delta={
            kpis.avgResponseHours.deltaPct === 0
              ? undefined
              : {
                  pct: kpis.avgResponseHours.deltaPct,
                  positive: kpis.avgResponseHours.deltaPct < 0,
                }
          }
          spark={{ data: kpis.avgResponseHours.spark, color: "#3DB54A" }}
          subtext="Target: under 4h"
        />
        <KpiCard
          label="HOT LEADS · OPEN"
          value={kpis.hotOpen.value.toString()}
          subtext={kpis.hotOpen.subtext}
          dot="#F47B20"
        />
      </section>

      {/* Main two-col: lead intake (60%) + sources (40%) */}
      <section className="mb-5 grid grid-cols-1 gap-4 lg:grid-cols-[3fr_2fr]">
        <LeadTable leads={leads} onOpenLead={setOpenLeadId} />
        <LeadSourcesCard shares={sources} />
      </section>

      {/* Pipeline + Inspections placeholders + Activity feed (3-col grid) */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-[3fr_2fr]">
        <div className="flex flex-col gap-4">
          <Placeholder
            title="Project pipeline"
            count="0 active"
            body="Five-stage Kanban view (Discovery → Scoping & NDA → Execution → QA Review → Delivered) with deal owner avatars and gating flags."
          />
          <Placeholder
            title="Inspections & gates · this week"
            body="Per-track schedule for Health Canada / USFDA / TGA-WHO-PQ / Internal QA / Stability — synced to a forthcoming inspections data model."
          />
        </div>
        <ActivityFeed items={activity} />
      </section>

      {openLeadId ? (
        <LeadDrawer
          leadId={openLeadId}
          onClose={() => setOpenLeadId(null)}
          onUpdate={handleLeadUpdate}
        />
      ) : null}
    </main>
  );
}

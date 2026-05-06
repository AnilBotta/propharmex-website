import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { supabase } from "@propharmex/lib";

import { getDashboardUserEmail } from "../../lib/supabase-auth/server";
import {
  LEAD_SOURCES,
  type LeadRow,
  type LeadSource,
} from "@propharmex/lib/leads/types";

import { DashboardShell } from "./DashboardShell";
import type { ActivityItem } from "./components/ActivityFeed";
import type { SourceShare } from "./components/LeadSourcesCard";
import { SOURCE_LABEL } from "./components/Pills";
import type { ProjectRow } from "./components/ProjectPipeline";
import type { InspectionEventRow } from "./components/InspectionsGrid";

export const metadata: Metadata = {
  title: "Lead intake · Propharmex Console",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function DashboardHome() {
  const sessionEmail = await getDashboardUserEmail();
  if (!sessionEmail) {
    redirect("/dashboard/login");
  }

  const sb = supabase.getServerSupabase();

  let leads: LeadRow[] = [];
  let allLeads: LeadRow[] = [];
  let activity: ActivityItem[] = [];
  let hotOpenCount = 0;
  let projects: ProjectRow[] = [];
  let inspectionEvents: InspectionEventRow[] = [];
  const { weekStart, weekEnd } = currentWeekRange();

  if (sb) {
    const [
      { data: leadRows },
      { data: allLeadRows },
      { data: noteRows },
      { count: hotCount },
      { data: projectRows },
    ] = await Promise.all([
      sb
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50),
      sb
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500),
      sb
        .from("lead_notes")
        .select("id, lead_id, author_email, body, kind, created_at")
        .order("created_at", { ascending: false })
        .limit(20),
      sb
        .from("lead_intelligence")
        .select("*", { count: "exact", head: true })
        .eq("intent_band", "hot"),
      sb
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200),
    ]);

    leads = (leadRows ?? []) as LeadRow[];
    allLeads = (allLeadRows ?? []) as LeadRow[];
    hotOpenCount = hotCount ?? 0;
    projects = (projectRows ?? []) as ProjectRow[];

    activity = buildActivity(leads, noteRows ?? []);

    // Fetch this week's inspection events. Separate query so the dashboard
    // still renders if the inspection_events table doesn't exist yet
    // (migration 0009 not applied).
    const { data: eventRows } = await sb
      .from("inspection_events")
      .select("*")
      .gte("event_date", weekStart)
      .lte("event_date", weekEnd)
      .order("event_date", { ascending: true });
    inspectionEvents = (eventRows ?? []) as InspectionEventRow[];
  }

  const kpis = computeKpis(allLeads, hotOpenCount);
  const sources = computeSourceShares(allLeads);

  return (
    <DashboardShell
      initialLeads={leads}
      kpis={kpis}
      sources={sources}
      activity={activity}
      initialProjects={projects}
      initialInspectionEvents={inspectionEvents}
      inspectionsWeekStart={weekStart}
    />
  );
}

/** Returns the Monday/Sunday ISO dates of the current ISO week (UTC). */
function currentWeekRange(): { weekStart: string; weekEnd: string } {
  const now = new Date();
  const day = now.getUTCDay(); // 0 = Sun, 1 = Mon
  const offset = (day + 6) % 7;
  const monday = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() - offset,
    ),
  );
  const sunday = new Date(monday);
  sunday.setUTCDate(monday.getUTCDate() + 6);
  return {
    weekStart: monday.toISOString().slice(0, 10),
    weekEnd: sunday.toISOString().slice(0, 10),
  };
}

/* -------------------------------------------------------------------------- */
/*  KPI computation — pure functions over the lead set                         */
/* -------------------------------------------------------------------------- */

function computeKpis(
  allLeads: LeadRow[],
  hotOpenCount: number,
): {
  newLeads7d: { value: number; deltaPct: number; spark: number[] };
  qualifiedOpen: { value: number; deltaPct: number; spark: number[] };
  avgResponseHours: { value: number; deltaPct: number; spark: number[] };
  hotOpen: { value: number; subtext: string };
  topSourceLabel: string;
} {
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  // 7-day daily bucket of new-lead counts (oldest → newest).
  const last7Buckets = new Array(7).fill(0);
  let last7Total = 0;
  let prev7Total = 0;
  for (const lead of allLeads) {
    const ts = new Date(lead.created_at).getTime();
    const ageDays = Math.floor((now - ts) / dayMs);
    if (ageDays >= 0 && ageDays < 7) {
      last7Buckets[6 - ageDays] += 1;
      last7Total += 1;
    } else if (ageDays >= 7 && ageDays < 14) {
      prev7Total += 1;
    }
  }

  // Avg response time (hours) for contacted leads in the last 30 days
  // vs the prior 30 days, plus a weekly spark over the last 8 weeks.
  const responseSpark = new Array(8).fill(0).map(() => ({ sum: 0, n: 0 }));
  let last30RespSum = 0;
  let last30RespN = 0;
  let prev30RespSum = 0;
  let prev30RespN = 0;
  for (const lead of allLeads) {
    if (!lead.contacted_at) continue;
    const created = new Date(lead.created_at).getTime();
    const contacted = new Date(lead.contacted_at).getTime();
    const respHours = Math.max(0, (contacted - created) / 3_600_000);
    const ageDays = Math.floor((now - contacted) / dayMs);
    if (ageDays >= 0 && ageDays < 30) {
      last30RespSum += respHours;
      last30RespN += 1;
    } else if (ageDays >= 30 && ageDays < 60) {
      prev30RespSum += respHours;
      prev30RespN += 1;
    }
    const weekIdx = Math.floor(ageDays / 7);
    if (weekIdx >= 0 && weekIdx < 8) {
      responseSpark[7 - weekIdx]!.sum += respHours;
      responseSpark[7 - weekIdx]!.n += 1;
    }
  }
  const last30AvgResp = last30RespN > 0 ? last30RespSum / last30RespN : 0;
  const prev30AvgResp = prev30RespN > 0 ? prev30RespSum / prev30RespN : 0;
  const respDelta =
    prev30AvgResp > 0
      ? Math.round(((last30AvgResp - prev30AvgResp) / prev30AvgResp) * 100)
      : 0;

  // Qualified-open: leads in 'contacted' status, not yet won/lost.
  const qualifiedOpen = allLeads.filter((l) => l.status === "contacted").length;
  // 7-day daily bucket of contacted_at within last 7 days.
  const qualifiedSpark = new Array(7).fill(0);
  let qualifiedLast7 = 0;
  let qualifiedPrev7 = 0;
  for (const lead of allLeads) {
    if (!lead.contacted_at) continue;
    const ts = new Date(lead.contacted_at).getTime();
    const ageDays = Math.floor((now - ts) / dayMs);
    if (ageDays >= 0 && ageDays < 7) {
      qualifiedSpark[6 - ageDays] += 1;
      qualifiedLast7 += 1;
    } else if (ageDays >= 7 && ageDays < 14) {
      qualifiedPrev7 += 1;
    }
  }

  const newDelta =
    prev7Total > 0
      ? Math.round(((last7Total - prev7Total) / prev7Total) * 100)
      : 0;
  const qualifiedDelta =
    qualifiedPrev7 > 0
      ? Math.round(
          ((qualifiedLast7 - qualifiedPrev7) / qualifiedPrev7) * 100,
        )
      : 0;

  // Top source label
  const topSourceLabel = topSource(allLeads);

  return {
    newLeads7d: {
      value: last7Total,
      deltaPct: newDelta,
      spark: last7Buckets,
    },
    qualifiedOpen: {
      value: qualifiedOpen,
      deltaPct: qualifiedDelta,
      spark: qualifiedSpark,
    },
    avgResponseHours: {
      value: last30AvgResp,
      deltaPct: respDelta,
      spark: responseSpark.map((b) => (b.n > 0 ? b.sum / b.n : 0)),
    },
    hotOpen: {
      value: hotOpenCount,
      subtext:
        hotOpenCount === 0
          ? "No hot AI briefs yet"
          : `${hotOpenCount} hot brief${hotOpenCount === 1 ? "" : "s"} in queue`,
    },
    topSourceLabel,
  };
}

function topSource(leads: LeadRow[]): string {
  if (leads.length === 0) return "—";
  const counts: Partial<Record<LeadSource, number>> = {};
  for (const l of leads) {
    counts[l.source] = (counts[l.source] ?? 0) + 1;
  }
  const top = (Object.entries(counts) as [LeadSource, number][]).sort(
    (a, b) => b[1] - a[1],
  )[0];
  return top ? SOURCE_LABEL[top[0]] : "—";
}

function computeSourceShares(leads: LeadRow[]): SourceShare[] {
  const dayMs = 24 * 60 * 60 * 1000;
  const since = Date.now() - 30 * dayMs;
  const counts = new Map<LeadSource, number>();
  for (const l of leads) {
    const ts = new Date(l.created_at).getTime();
    if (ts < since) continue;
    counts.set(l.source, (counts.get(l.source) ?? 0) + 1);
  }
  const total = Array.from(counts.values()).reduce((s, n) => s + n, 0);
  if (total === 0) {
    return [];
  }
  return LEAD_SOURCES.map((source) => ({
    source,
    count: counts.get(source) ?? 0,
    pct: ((counts.get(source) ?? 0) / total) * 100,
  })).filter((s) => s.count > 0);
}

interface RawNote {
  id: string;
  lead_id: string;
  author_email: string;
  body: string;
  kind: string;
  created_at: string;
}

function buildActivity(leads: LeadRow[], notes: RawNote[]): ActivityItem[] {
  const leadMap = new Map(leads.map((l) => [l.id, l]));
  const items: ActivityItem[] = [];

  for (const lead of leads.slice(0, 10)) {
    items.push({
      id: `lead-${lead.id}`,
      kind: "lead_received",
      email: lead.email,
      name: lead.contact_name,
      body: `submitted via ${SOURCE_LABEL[lead.source]}${lead.company ? ` for ${lead.company}` : ""}`,
      source: lead.source,
      timestamp: lead.created_at,
    });
  }
  for (const note of notes) {
    const lead = leadMap.get(note.lead_id);
    items.push({
      id: `note-${note.id}`,
      kind: note.kind === "status_change" ? "status_change" : "note",
      email: note.author_email,
      name: null,
      body:
        note.kind === "status_change"
          ? `moved ${lead?.contact_name ?? lead?.email ?? "lead"}: ${note.body}`
          : `noted on ${lead?.contact_name ?? lead?.email ?? "lead"}: ${note.body.slice(0, 80)}`,
      tag: note.kind === "status_change" ? "Pipeline" : "Note",
      timestamp: note.created_at,
    });
  }
  return items
    .sort((a, b) => +new Date(b.timestamp) - +new Date(a.timestamp))
    .slice(0, 12);
}

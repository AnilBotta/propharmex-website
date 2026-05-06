"use client";

import { useMemo, useState } from "react";

import {
  LEAD_SOURCES,
  type LeadRow,
  type LeadSource,
} from "@propharmex/lib/leads/types";

import { AddLeadModal } from "./AddLeadModal";
import { LeadAvatar } from "./LeadAvatar";
import { SOURCE_LABEL, SourcePill, StatusPill } from "./Pills";

type Tab = "all" | "new" | "qualified" | LeadSource;

const TABS: { id: Tab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "new", label: "New" },
  { id: "qualified", label: "Qualified" },
  { id: "contact", label: "From hero" },
  { id: "del_readiness", label: "DEL tool" },
  { id: "newsletter", label: "Newsletter" },
];

interface LeadTableProps {
  leads: LeadRow[];
  onOpenLead: (id: string) => void;
  onLeadCreated: (lead: LeadRow) => void;
}

export function LeadTable({ leads, onOpenLead, onLeadCreated }: LeadTableProps) {
  const [tab, setTab] = useState<Tab>("all");
  const [search, setSearch] = useState("");
  const [exporting, setExporting] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  async function handleExport() {
    if (exporting) return;
    setExporting(true);
    try {
      // Forward the active source/status filters to the server so the CSV
      // matches what's currently visible in the table. The free-text
      // search is client-only and isn't sent to the server.
      const params = new URLSearchParams();
      if (tab === "new") params.set("status", "new");
      else if (tab === "qualified") params.set("status", "contacted");
      else if (tab !== "all") params.set("source", tab);
      const qs = params.toString();
      const res = await fetch(
        `/api/dashboard/leads/export${qs ? `?${qs}` : ""}`,
      );
      if (!res.ok) {
        // eslint-disable-next-line no-alert
        alert("Export failed. Please retry.");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download =
        res.headers
          .get("content-disposition")
          ?.match(/filename="?([^"]+)"?/)?.[1] ??
        `propharmex-leads-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  }

  const visible = useMemo(() => {
    return leads.filter((lead) => {
      if (tab === "new" && lead.status !== "new") return false;
      if (tab === "qualified" && lead.status !== "contacted") return false;
      if (
        tab !== "all" &&
        tab !== "new" &&
        tab !== "qualified" &&
        lead.source !== tab
      ) {
        return false;
      }
      if (search.trim().length > 0) {
        const q = search.trim().toLowerCase();
        const haystack = [
          lead.email,
          lead.contact_name,
          lead.company,
          lead.role,
          lead.message,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [leads, tab, search]);

  return (
    <section className="overflow-hidden rounded-lg border border-[color:var(--color-border)] bg-white">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[color:var(--color-border)] px-4 py-3">
        <h2 className="text-[15px] font-semibold text-slate-800">
          Lead intake
        </h2>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
          {visible.length}
        </span>
        <div className="ml-auto flex items-center gap-2">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter…"
            aria-label="Filter leads"
            className="h-7 w-40 rounded-md border border-[color:var(--color-border)] bg-white px-2 text-[12px] text-slate-700 placeholder:text-slate-400"
          />
          <button
            type="button"
            onClick={handleExport}
            disabled={exporting || leads.length === 0}
            className="rounded-md border border-[color:var(--color-border)] bg-white px-2 py-1 text-[12px] text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
          >
            {exporting ? "Exporting…" : "Export CSV"}
          </button>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="rounded-md bg-primary-600 px-2.5 py-1 text-[12px] font-medium text-white hover:bg-primary-700"
          >
            + Add lead
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div
        role="tablist"
        aria-label="Lead filters"
        className="flex gap-1 border-b border-[color:var(--color-border)] px-3 py-2 overflow-x-auto"
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`shrink-0 rounded-md px-2.5 py-1 text-[12px] font-medium transition-colors ${
              tab === t.id
                ? "bg-slate-100 text-slate-900"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {t.label}
            {t.id === "all" ? (
              <span className="ml-1 text-[11px] text-slate-400">
                {leads.length}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="text-left text-[10px] font-semibold tracking-[0.06em] text-slate-400">
              <th className="px-4 py-2.5">ID</th>
              <th className="px-4 py-2.5">LEAD</th>
              <th className="px-4 py-2.5">COMPANY</th>
              <th className="px-4 py-2.5">SOURCE</th>
              <th className="px-4 py-2.5">INTEREST</th>
              <th className="px-4 py-2.5">STAT</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-12 text-center text-slate-400"
                >
                  No leads match this filter yet. New form submissions appear
                  here in real time.
                </td>
              </tr>
            ) : (
              visible.map((lead) => (
                <tr
                  key={lead.id}
                  onClick={() => onOpenLead(lead.id)}
                  className="cursor-pointer border-t border-[color:var(--color-border)] hover:bg-slate-50"
                >
                  <td className="px-4 py-3 font-mono text-[11px] text-slate-500">
                    LD-{shortId(lead.id)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <LeadAvatar
                        name={lead.contact_name}
                        email={lead.email}
                      />
                      <div className="min-w-0">
                        <div className="truncate font-medium text-slate-800">
                          {lead.contact_name || "—"}
                        </div>
                        <div className="truncate text-[11px] text-slate-500">
                          {lead.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="leading-tight">
                      <div className="truncate text-slate-800">
                        {lead.company || "—"}
                      </div>
                      {lead.ip_country ? (
                        <div className="text-[10px] uppercase tracking-wide text-slate-400">
                          {lead.ip_country}
                        </div>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <SourcePill source={lead.source} />
                  </td>
                  <td className="max-w-[180px] truncate px-4 py-3 text-slate-700">
                    {lead.dosage_form ||
                      lead.service ||
                      lead.message?.slice(0, 60) ||
                      "—"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill status={lead.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showAddModal ? (
        <AddLeadModal
          onClose={() => setShowAddModal(false)}
          onCreated={(lead) => {
            setShowAddModal(false);
            onLeadCreated(lead);
          }}
        />
      ) : null}
    </section>
  );
}

function shortId(uuid: string): string {
  // Stable 4-char display ID derived from the uuid.
  return uuid.replace(/-/g, "").slice(0, 4).toUpperCase();
}

// Re-export for the page to use in source-share computations.
export { LEAD_SOURCES, SOURCE_LABEL };

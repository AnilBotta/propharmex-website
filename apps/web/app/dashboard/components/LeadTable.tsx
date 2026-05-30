"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { LEAD_SOURCES, type LeadRow, type LeadSource } from "@propharmex/lib/leads/types";

import { AddLeadModal } from "./AddLeadModal";
import { LeadAvatar } from "./LeadAvatar";
import { SOURCE_LABEL, SourcePill, StatusPill } from "./Pills";

type Tab = "all" | "new" | "qualified" | LeadSource;

const TABS: { id: Tab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "new", label: "New" },
  { id: "qualified", label: "Qualified" },
  { id: "contact", label: "From hero" },
  { id: "del_readiness", label: "Readiness tool" },
  { id: "newsletter", label: "Newsletter" },
];

interface LeadTableProps {
  leads: LeadRow[];
  onOpenLead: (id: string) => void;
  onLeadCreated: (lead: LeadRow) => void;
  onLeadDeleted: (id: string) => void;
}

export function LeadTable({ leads, onOpenLead, onLeadCreated, onLeadDeleted }: LeadTableProps) {
  const [tab, setTab] = useState<Tab>("all");
  const [search, setSearch] = useState("");
  const [exporting, setExporting] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [openMenuLeadId, setOpenMenuLeadId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<LeadRow | null>(null);

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
      const res = await fetch(`/api/dashboard/leads/export${qs ? `?${qs}` : ""}`);
      if (!res.ok) {
        alert("Export failed. Please retry.");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download =
        res.headers.get("content-disposition")?.match(/filename="?([^"]+)"?/)?.[1] ??
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
      if (tab !== "all" && tab !== "new" && tab !== "qualified" && lead.source !== tab) {
        return false;
      }
      if (search.trim().length > 0) {
        const q = search.trim().toLowerCase();
        const haystack = [lead.email, lead.contact_name, lead.company, lead.role, lead.message]
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
        <h2 className="text-[15px] font-semibold text-slate-800">Lead intake</h2>
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
            className="bg-primary-600 hover:bg-primary-700 rounded-md px-2.5 py-1 text-[12px] font-medium text-white"
          >
            + Add lead
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div
        role="tablist"
        aria-label="Lead filters"
        className="flex gap-1 overflow-x-auto border-b border-[color:var(--color-border)] px-3 py-2"
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`shrink-0 rounded-md px-2.5 py-1 text-[12px] font-medium transition-colors ${
              tab === t.id ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {t.label}
            {t.id === "all" ? (
              <span className="ml-1 text-[11px] text-slate-400">{leads.length}</span>
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
              <th className="w-10 px-2 py-2.5 text-right" aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                  No leads match this filter yet. New form submissions appear here in real time.
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
                      <LeadAvatar name={lead.contact_name} email={lead.email} />
                      <div className="min-w-0">
                        <div className="truncate font-medium text-slate-800">
                          {lead.contact_name || "—"}
                        </div>
                        <div className="truncate text-[11px] text-slate-500">{lead.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="leading-tight">
                      <div className="truncate text-slate-800">{lead.company || "—"}</div>
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
                    {lead.dosage_form || lead.service || lead.message?.slice(0, 60) || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill status={lead.status} />
                  </td>
                  <td className="relative w-10 px-2 py-3 text-right">
                    <RowActions
                      lead={lead}
                      isOpen={openMenuLeadId === lead.id}
                      onToggle={(e) => {
                        e.stopPropagation();
                        setOpenMenuLeadId((prev) => (prev === lead.id ? null : lead.id));
                      }}
                      onClose={() => setOpenMenuLeadId(null)}
                      onDeleteClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuLeadId(null);
                        setConfirmDelete(lead);
                      }}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {confirmDelete ? (
        <DeleteLeadDialog
          lead={confirmDelete}
          onClose={() => setConfirmDelete(null)}
          onDeleted={(id) => {
            setConfirmDelete(null);
            onLeadDeleted(id);
          }}
        />
      ) : null}

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

function RowActions({
  lead,
  isOpen,
  onToggle,
  onClose,
  onDeleteClick,
}: {
  lead: LeadRow;
  isOpen: boolean;
  onToggle: (e: React.MouseEvent) => void;
  onClose: () => void;
  onDeleteClick: (e: React.MouseEvent) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    function onDocClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) onClose();
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  return (
    <div ref={containerRef} className="inline-block">
      <button
        type="button"
        onClick={onToggle}
        aria-label={`Lead actions for ${lead.email}`}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className="grid h-7 w-7 place-items-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
      >
        <span aria-hidden className="text-[16px] leading-none">
          ⋯
        </span>
      </button>
      {isOpen ? (
        <div
          role="menu"
          className="absolute right-2 top-9 z-20 min-w-[140px] rounded-md border border-[color:var(--color-border)] bg-white py-1 shadow-md"
        >
          <button
            type="button"
            role="menuitem"
            onClick={onDeleteClick}
            className="block w-full px-3 py-1.5 text-left text-[12px] text-red-600 hover:bg-red-50"
          >
            Delete lead
          </button>
        </div>
      ) : null}
    </div>
  );
}

function DeleteLeadDialog({
  lead,
  onClose,
  onDeleted,
}: {
  lead: LeadRow;
  onClose: () => void;
  onDeleted: (id: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/dashboard/leads/${lead.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setError(body.error ?? `Delete failed (${res.status}).`);
        return;
      }
      onDeleted(lead.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 px-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-lead-title"
        className="w-full max-w-sm rounded-lg border border-[color:var(--color-border)] bg-white p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="delete-lead-title" className="text-[15px] font-semibold text-slate-900">
          Delete this lead?
        </h2>
        <p className="mt-2 text-[13px] leading-snug text-slate-600">
          {lead.contact_name || lead.email}
          {lead.company ? <> · {lead.company}</> : null}
        </p>
        <p className="mt-2 text-[12px] leading-snug text-slate-500">
          This permanently removes the lead and any AI brief or notes attached to it. Linked
          projects stay but lose the lead reference. This cannot be undone.
        </p>
        {error ? (
          <p
            role="alert"
            className="mt-3 rounded-md border border-red-200 bg-red-50 px-2 py-1.5 text-[12px] text-red-700"
          >
            {error}
          </p>
        ) : null}
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="rounded-md border border-[color:var(--color-border)] bg-white px-3 py-1.5 text-[12px] text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={busy}
            className="rounded-md bg-red-600 px-3 py-1.5 text-[12px] font-medium text-white hover:bg-red-700 disabled:opacity-60"
          >
            {busy ? "Deleting…" : "Delete lead"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Re-export for the page to use in source-share computations.
export { LEAD_SOURCES, SOURCE_LABEL };

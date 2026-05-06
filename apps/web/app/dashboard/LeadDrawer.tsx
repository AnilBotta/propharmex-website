"use client";

import { useEffect, useState } from "react";

import {
  LEAD_STATUSES,
  type LeadNoteRow,
  type LeadRow,
  type LeadStatus,
} from "@propharmex/lib/leads/types";

import { LeadAvatar } from "./components/LeadAvatar";
import { SourcePill, StatusPill } from "./components/Pills";

interface IntelligenceRow {
  lead_id: string;
  summary: string;
  intent_score: number;
  intent_band: "hot" | "warm" | "cold";
  draft_reply: string;
  rationale: string | null;
  model: string;
  generated_at: string;
}

interface LeadDetail {
  lead: LeadRow;
  notes: LeadNoteRow[];
  intelligence: IntelligenceRow | null;
}

export function LeadDrawer({
  leadId,
  onClose,
  onUpdate,
}: {
  leadId: string;
  onClose: () => void;
  onUpdate: (lead: LeadRow) => void;
}) {
  const [detail, setDetail] = useState<LeadDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [genLoading, setGenLoading] = useState(false);
  const [noteDraft, setNoteDraft] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/dashboard/leads/${leadId}`);
        if (!res.ok) {
          setError("Failed to load lead");
          setLoading(false);
          return;
        }
        const data = (await res.json()) as LeadDetail;
        if (!cancelled) {
          setDetail(data);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setError("Network error");
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [leadId]);

  async function handleStatusChange(status: LeadStatus) {
    if (!detail) return;
    const res = await fetch(`/api/dashboard/leads/${leadId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) return;
    const refreshed = (await fetch(`/api/dashboard/leads/${leadId}`).then((r) =>
      r.json(),
    )) as LeadDetail;
    setDetail(refreshed);
    onUpdate(refreshed.lead);
  }

  async function handleAddNote() {
    if (noteDraft.trim().length === 0) return;
    const res = await fetch(`/api/dashboard/leads/${leadId}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: noteDraft.trim() }),
    });
    if (!res.ok) return;
    setNoteDraft("");
    const refreshed = (await fetch(`/api/dashboard/leads/${leadId}`).then((r) =>
      r.json(),
    )) as LeadDetail;
    setDetail(refreshed);
  }

  async function handleGenerateAi() {
    setGenLoading(true);
    try {
      const res = await fetch("/api/ai/lead-intelligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId }),
      });
      if (res.ok) {
        const refreshed = (await fetch(`/api/dashboard/leads/${leadId}`).then(
          (r) => r.json(),
        )) as LeadDetail;
        setDetail(refreshed);
      }
    } finally {
      setGenLoading(false);
    }
  }

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text).catch(() => {
      // silent
    });
  }

  function buildMailto(): string {
    if (!detail) return "#";
    const subject = `Re: Propharmex inquiry — ${detail.lead.company ?? detail.lead.email}`;
    const body = detail.intelligence?.draft_reply ?? "";
    return `mailto:${encodeURIComponent(detail.lead.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-slate-900/40"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Lead detail"
        className="fixed inset-y-0 right-0 z-50 w-full max-w-[560px] overflow-y-auto bg-white shadow-xl"
      >
        <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[15px] font-semibold text-slate-800">
              Lead detail
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="grid h-7 w-7 place-items-center rounded-md text-slate-500 hover:bg-slate-100"
            >
              <span aria-hidden className="text-lg leading-none">
                ×
              </span>
            </button>
          </div>

          {loading ? (
            <p className="text-[13px] text-slate-500">Loading…</p>
          ) : error ? (
            <p role="alert" className="text-[13px] text-[color:var(--color-danger)]">
              {error}
            </p>
          ) : detail ? (
            <>
              {/* Identity */}
              <section className="mb-5 flex items-start gap-3">
                <LeadAvatar
                  name={detail.lead.contact_name}
                  email={detail.lead.email}
                  size={44}
                />
                <div className="min-w-0">
                  <h3 className="text-[18px] font-semibold text-slate-900">
                    {detail.lead.contact_name || "Anonymous"}
                  </h3>
                  <div className="mt-0.5 truncate text-[13px] text-slate-600">
                    {[detail.lead.role, detail.lead.company]
                      .filter(Boolean)
                      .join(" · ")}
                  </div>
                  <div className="text-[12px] text-slate-500">
                    {detail.lead.email}
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <SourcePill source={detail.lead.source} />
                    <StatusPill status={detail.lead.status} />
                    <span className="text-[11px] text-slate-400">
                      {new Date(detail.lead.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
              </section>

              {/* AI brief */}
              <section className="mb-5 rounded-lg border border-[color:var(--color-border)] bg-slate-50 p-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <h4 className="text-[13px] font-semibold text-slate-800">
                    AI brief
                  </h4>
                  {detail.intelligence ? (
                    <IntentBadge
                      band={detail.intelligence.intent_band}
                      score={detail.intelligence.intent_score}
                    />
                  ) : null}
                </div>
                {detail.intelligence ? (
                  <>
                    <p className="text-[14px] text-slate-700">
                      {detail.intelligence.summary}
                    </p>
                    {detail.intelligence.rationale ? (
                      <p className="mt-2 text-[12px] italic text-slate-500">
                        {detail.intelligence.rationale}
                      </p>
                    ) : null}
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={handleGenerateAi}
                    disabled={genLoading}
                    className="rounded-md bg-primary-600 px-3 py-1.5 text-[12px] font-medium text-white disabled:opacity-60"
                  >
                    {genLoading ? "Generating…" : "Generate AI brief"}
                  </button>
                )}
              </section>

              {/* Suggested reply */}
              {detail.intelligence?.draft_reply ? (
                <section className="mb-5">
                  <h4 className="mb-2 text-[13px] font-semibold text-slate-800">
                    Suggested reply
                  </h4>
                  <pre className="whitespace-pre-wrap rounded-md bg-slate-50 p-3 font-sans text-[13px] text-slate-700">
                    {detail.intelligence.draft_reply}
                  </pre>
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopy(detail.intelligence!.draft_reply)}
                      className="rounded-md border border-[color:var(--color-border)] bg-white px-3 py-1 text-[12px] text-slate-700 hover:bg-slate-50"
                    >
                      Copy
                    </button>
                    <a
                      href={buildMailto()}
                      className="inline-block rounded-md bg-primary-600 px-3 py-1 text-[12px] font-medium text-white"
                    >
                      Open in mail
                    </a>
                  </div>
                </section>
              ) : null}

              {/* Original message */}
              {detail.lead.message ? (
                <section className="mb-5">
                  <h4 className="mb-2 text-[13px] font-semibold text-slate-800">
                    Original message
                  </h4>
                  <blockquote className="border-l-2 border-primary-200 pl-3 text-[13px] text-slate-700 whitespace-pre-wrap">
                    {detail.lead.message}
                  </blockquote>
                </section>
              ) : null}

              {/* Status */}
              <section className="mb-5">
                <h4 className="mb-2 text-[13px] font-semibold text-slate-800">
                  Status
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {LEAD_STATUSES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleStatusChange(s)}
                      className={`rounded-md px-3 py-1 text-[12px] capitalize ${
                        detail.lead.status === s
                          ? "bg-primary-600 text-white"
                          : "border border-[color:var(--color-border)] bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </section>

              {/* Notes */}
              <section>
                <h4 className="mb-2 text-[13px] font-semibold text-slate-800">
                  Notes ({detail.notes.length})
                </h4>
                <div className="mb-2 flex flex-col gap-1.5">
                  {detail.notes.map((n) => (
                    <div
                      key={n.id}
                      className={`rounded-md p-2 text-[12px] ${
                        n.kind === "status_change"
                          ? "bg-slate-50"
                          : "bg-accent-50"
                      }`}
                    >
                      <div className="text-[10px] text-slate-500">
                        {n.kind === "status_change" ? "↺ " : ""}
                        {n.author_email} · {timeAgo(n.created_at)}
                      </div>
                      <div className="text-slate-700">{n.body}</div>
                    </div>
                  ))}
                </div>
                <textarea
                  value={noteDraft}
                  onChange={(e) => setNoteDraft(e.target.value)}
                  placeholder="Add a note (BD-internal)…"
                  rows={2}
                  className="w-full resize-y rounded-md border border-[color:var(--color-border)] px-2 py-1.5 text-[12px] text-slate-700"
                />
                <button
                  type="button"
                  onClick={handleAddNote}
                  disabled={noteDraft.trim().length === 0}
                  className="mt-2 rounded-md border border-[color:var(--color-border)] bg-white px-3 py-1 text-[12px] text-slate-700 disabled:opacity-50 hover:bg-slate-50"
                >
                  Add note
                </button>
              </section>
            </>
          ) : null}
        </div>
      </aside>
    </>
  );
}

function IntentBadge({
  band,
  score,
}: {
  band: "hot" | "warm" | "cold";
  score: number;
}) {
  const styles = {
    hot: { bg: "#FCE6D4", fg: "#9B4A0A", emoji: "🔥" },
    warm: { bg: "#FFF3CC", fg: "#A47707", emoji: "◐" },
    cold: { bg: "#ECEEF5", fg: "#3A4061", emoji: "◯" },
  }[band];
  return (
    <span
      className="rounded-md px-2 py-0.5 text-[11px] font-semibold"
      style={{ background: styles.bg, color: styles.fg }}
    >
      {styles.emoji} {band.toUpperCase()} · {score}
    </span>
  );
}

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const m = Math.floor(ms / 60_000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

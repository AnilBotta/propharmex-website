"use client";

import { useEffect, useMemo, useState } from "react";

export type InspectionTrack =
  | "health_canada"
  | "usfda"
  | "tga_who_pq"
  | "internal_qa"
  | "stability";

export type InspectionStatus =
  | "scheduled"
  | "in_progress"
  | "done"
  | "cancelled";

export interface InspectionEventRow {
  id: string;
  track: InspectionTrack;
  title: string;
  subtitle: string | null;
  event_date: string;
  status: InspectionStatus;
  notes: string | null;
  related_project_id: string | null;
  created_at: string;
  updated_at: string;
}

const TRACK_ORDER: InspectionTrack[] = [
  "health_canada",
  "usfda",
  "tga_who_pq",
  "internal_qa",
  "stability",
];

const TRACK_LABEL: Record<InspectionTrack, { name: string; sub: string; accent: string; bg: string }> = {
  health_canada: {
    name: "Health Canada",
    sub: "GMP inspection",
    accent: "#1F7A2C",
    bg: "rgba(61,181,74,0.08)",
  },
  usfda: {
    name: "USFDA",
    sub: "DMF Type II",
    accent: "#0E5E86",
    bg: "rgba(30,155,216,0.08)",
  },
  tga_who_pq: {
    name: "TGA / WHO-PQ",
    sub: "Audit prep",
    accent: "#5B2A8A",
    bg: "rgba(124,58,237,0.08)",
  },
  internal_qa: {
    name: "Internal QA",
    sub: "Gates & CAPA",
    accent: "#9B4A0A",
    bg: "rgba(244,123,32,0.08)",
  },
  stability: {
    name: "Stability",
    sub: "Pull points",
    accent: "#3A4061",
    bg: "rgba(107,112,144,0.08)",
  },
};

const DAY_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export function InspectionsGrid({
  initialEvents,
  initialStartDate,
}: {
  initialEvents: InspectionEventRow[];
  initialStartDate: string;
}) {
  const [weekStart, setWeekStart] = useState<string>(initialStartDate);
  const [events, setEvents] = useState<InspectionEventRow[]>(initialEvents);
  const [loading, setLoading] = useState(false);
  const [creatingFor, setCreatingFor] = useState<{
    track: InspectionTrack;
    date: string;
  } | null>(null);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftSubtitle, setDraftSubtitle] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const days = useMemo(() => buildWeek(weekStart), [weekStart]);
  const weekEnd = days[6]?.iso ?? weekStart;

  // Refetch when the week changes (skip initial since SSR provides it).
  useEffect(() => {
    if (weekStart === initialStartDate) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      const res = await fetch(
        `/api/dashboard/inspections?startDate=${weekStart}&endDate=${weekEnd}`,
      );
      if (!res.ok) {
        setLoading(false);
        return;
      }
      const json = (await res.json()) as { events: InspectionEventRow[] };
      if (!cancelled) {
        setEvents(json.events);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [weekStart, weekEnd, initialStartDate]);

  const grouped = useMemo(() => {
    const map = new Map<string, InspectionEventRow[]>();
    for (const e of events) {
      const key = `${e.track}|${e.event_date}`;
      const list = map.get(key) ?? [];
      list.push(e);
      map.set(key, list);
    }
    return map;
  }, [events]);

  function shiftWeek(deltaDays: number) {
    setWeekStart((prev) => addDays(prev, deltaDays));
  }
  function goToday() {
    setWeekStart(currentMondayIso());
  }

  async function handleCreate() {
    if (!creatingFor || !draftTitle.trim() || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/dashboard/inspections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          track: creatingFor.track,
          title: draftTitle.trim(),
          subtitle: draftSubtitle.trim() || undefined,
          eventDate: creatingFor.date,
        }),
      });
      if (!res.ok) {
        // eslint-disable-next-line no-alert
        alert("Couldn't add the event. Please retry.");
        setSubmitting(false);
        return;
      }
      const { event } = (await res.json()) as { event: InspectionEventRow };
      setEvents((prev) => [...prev, event]);
      setCreatingFor(null);
      setDraftTitle("");
      setDraftSubtitle("");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(eventId: string) {
    // eslint-disable-next-line no-alert
    if (!window.confirm("Remove this event?")) return;
    const original = events;
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
    const res = await fetch(`/api/dashboard/inspections/${eventId}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      setEvents(original);
      // eslint-disable-next-line no-alert
      alert("Failed to remove. Reverted.");
    }
  }

  return (
    <section className="rounded-lg border border-[color:var(--color-border)] bg-white">
      {/* Header */}
      <header className="flex flex-wrap items-center gap-2 border-b border-[color:var(--color-border)] px-4 py-3">
        <h2 className="text-[15px] font-semibold text-slate-800">
          Inspections &amp; gates
        </h2>
        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
          {formatRangeLabel(weekStart, weekEnd)}
        </span>
        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => shiftWeek(-7)}
            aria-label="Previous week"
            className="grid h-7 w-7 place-items-center rounded-md border border-[color:var(--color-border)] bg-white text-slate-600 hover:bg-slate-50"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={goToday}
            className="rounded-md border border-[color:var(--color-border)] bg-white px-2.5 py-1 text-[12px] font-medium text-slate-700 hover:bg-slate-50"
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => shiftWeek(7)}
            aria-label="Next week"
            className="grid h-7 w-7 place-items-center rounded-md border border-[color:var(--color-border)] bg-white text-slate-600 hover:bg-slate-50"
          >
            ›
          </button>
        </div>
      </header>

      {/* Grid */}
      <div className="overflow-x-auto p-2">
        <div className="grid min-w-[860px] grid-cols-[140px_repeat(7,minmax(0,1fr))] gap-px bg-[color:var(--color-border)] text-[11px]">
          {/* Column headers */}
          <div className="bg-white px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
            Track
          </div>
          {days.map((d) => (
            <div
              key={d.iso}
              className={`bg-white px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wide ${
                d.isToday ? "text-primary-700" : "text-slate-500"
              }`}
            >
              {d.short} {d.dayOfMonth}
            </div>
          ))}

          {/* Rows */}
          {TRACK_ORDER.map((track) => {
            const meta = TRACK_LABEL[track];
            return (
              <FragmentRow key={track}>
                {/* Track label cell */}
                <div className="bg-white px-2 py-2 leading-tight">
                  <div
                    className="text-[12px] font-semibold"
                    style={{ color: meta.accent }}
                  >
                    {meta.name}
                  </div>
                  <div className="text-[10px] text-slate-500">{meta.sub}</div>
                </div>

                {/* Day cells */}
                {days.map((d) => {
                  const cellEvents = grouped.get(`${track}|${d.iso}`) ?? [];
                  const isCreating =
                    creatingFor?.track === track &&
                    creatingFor.date === d.iso;
                  return (
                    <div
                      key={`${track}-${d.iso}`}
                      className={`group relative min-h-[64px] bg-white p-1.5 ${
                        d.isToday ? "ring-1 ring-primary-200 ring-inset" : ""
                      }`}
                    >
                      <div className="flex flex-col gap-1">
                        {cellEvents.map((e) => (
                          <EventChip
                            key={e.id}
                            event={e}
                            track={track}
                            onDelete={() => handleDelete(e.id)}
                          />
                        ))}

                        {isCreating ? (
                          <div className="rounded-sm bg-slate-50 p-1.5">
                            <input
                              type="text"
                              autoFocus
                              value={draftTitle}
                              onChange={(e) => setDraftTitle(e.target.value)}
                              placeholder="Event title…"
                              className="mb-1 w-full rounded-sm border border-[color:var(--color-border)] px-1.5 py-0.5 text-[11px]"
                            />
                            <input
                              type="text"
                              value={draftSubtitle}
                              onChange={(e) => setDraftSubtitle(e.target.value)}
                              placeholder="Subtitle (optional)"
                              className="mb-1 w-full rounded-sm border border-[color:var(--color-border)] px-1.5 py-0.5 text-[11px]"
                            />
                            <div className="flex gap-1">
                              <button
                                type="button"
                                onClick={handleCreate}
                                disabled={
                                  submitting || draftTitle.trim().length < 2
                                }
                                className="flex-1 rounded-sm bg-primary-600 px-1.5 py-0.5 text-[10px] font-medium text-white disabled:opacity-50"
                              >
                                {submitting ? "…" : "Save"}
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setCreatingFor(null);
                                  setDraftTitle("");
                                  setDraftSubtitle("");
                                }}
                                className="rounded-sm border border-[color:var(--color-border)] bg-white px-1.5 py-0.5 text-[10px] text-slate-600"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setCreatingFor({ track, date: d.iso });
                              setDraftTitle("");
                              setDraftSubtitle("");
                            }}
                            className="rounded-sm border border-dashed border-transparent px-1 py-0.5 text-left text-[10px] text-slate-300 transition-colors hover:border-slate-300 hover:text-slate-500"
                          >
                            + Add
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </FragmentRow>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="border-t border-[color:var(--color-border)] px-4 py-2 text-[11px] text-slate-400">
          Loading…
        </div>
      ) : null}
    </section>
  );
}

function FragmentRow({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function EventChip({
  event,
  track,
  onDelete,
}: {
  event: InspectionEventRow;
  track: InspectionTrack;
  onDelete: () => void;
}) {
  const meta = TRACK_LABEL[track];
  const dim = event.status === "done" || event.status === "cancelled";

  return (
    <div
      className={`group/chip relative rounded-sm px-1.5 py-1 leading-tight ${
        dim ? "opacity-50 line-through" : ""
      }`}
      style={{ background: meta.bg }}
    >
      <div
        className="text-[11px] font-semibold"
        style={{ color: meta.accent }}
      >
        {event.title}
      </div>
      {event.subtitle ? (
        <div className="text-[10px] text-slate-500">{event.subtitle}</div>
      ) : null}
      <button
        type="button"
        onClick={onDelete}
        aria-label={`Remove ${event.title}`}
        className="absolute right-0.5 top-0.5 hidden h-4 w-4 place-items-center rounded-full bg-white/70 text-[9px] text-slate-500 hover:bg-white hover:text-[color:var(--color-danger)] group-hover/chip:grid"
      >
        ×
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Date helpers — pure UTC to avoid TZ drift on client/server mismatch        */
/* -------------------------------------------------------------------------- */

function buildWeek(startIso: string) {
  const start = parseIso(startIso);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setUTCDate(start.getUTCDate() + i);
    const iso = d.toISOString().slice(0, 10);
    return {
      iso,
      short: DAY_SHORT[i],
      dayOfMonth: d.getUTCDate(),
      isToday: iso === todayIso(),
    };
  });
}

function addDays(iso: string, delta: number): string {
  const d = parseIso(iso);
  d.setUTCDate(d.getUTCDate() + delta);
  return d.toISOString().slice(0, 10);
}

function parseIso(iso: string): Date {
  const [y, m, day] = iso.split("-").map(Number);
  return new Date(Date.UTC(y!, (m ?? 1) - 1, day ?? 1));
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function currentMondayIso(): string {
  const now = new Date();
  const day = now.getUTCDay();
  const offset = (day + 6) % 7;
  const monday = new Date(now);
  monday.setUTCDate(now.getUTCDate() - offset);
  return monday.toISOString().slice(0, 10);
}

function formatRangeLabel(startIso: string, endIso: string): string {
  const a = parseIso(startIso);
  const b = parseIso(endIso);
  const month = (d: Date) =>
    d.toLocaleDateString(undefined, { month: "short", timeZone: "UTC" });
  const day = (d: Date) =>
    d.toLocaleDateString(undefined, { day: "numeric", timeZone: "UTC" });
  if (a.getUTCMonth() === b.getUTCMonth()) {
    return `${month(a)} ${day(a)} – ${day(b)}`;
  }
  return `${month(a)} ${day(a)} – ${month(b)} ${day(b)}`;
}

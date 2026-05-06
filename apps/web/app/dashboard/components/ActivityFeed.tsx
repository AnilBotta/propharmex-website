import type { LeadSource } from "@propharmex/lib/leads/types";

import { LeadAvatar } from "./LeadAvatar";
import { SourcePill } from "./Pills";

export interface ActivityItem {
  id: string;
  kind: "lead_received" | "status_change" | "note";
  email: string;
  name: string | null;
  body: string;
  source?: LeadSource;
  tag?: string;
  timestamp: string;
}

export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  return (
    <section className="rounded-lg border border-[color:var(--color-border)] bg-white">
      <header className="flex items-center justify-between gap-2 border-b border-[color:var(--color-border)] px-4 py-3">
        <h2 className="text-[15px] font-semibold text-slate-800">
          Activity feed
        </h2>
        <span className="rounded-md border border-[color:var(--color-border)] px-2 py-1 text-[11px] text-slate-500">
          All sources
        </span>
      </header>
      {items.length === 0 ? (
        <div className="px-4 py-12 text-center text-[13px] text-slate-400">
          Nothing yet. Form submissions and dashboard actions will appear here.
        </div>
      ) : (
        <ul>
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-start gap-3 border-b border-[color:var(--color-border)] px-4 py-3 last:border-0"
            >
              <LeadAvatar name={item.name} email={item.email} size={28} />
              <div className="min-w-0 flex-1 leading-tight">
                <div className="text-[13px] text-slate-700">
                  <span className="font-medium text-slate-800">
                    {item.name || item.email.split("@")[0]}
                  </span>{" "}
                  <span className="text-slate-600">{item.body}</span>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  {item.source ? <SourcePill source={item.source} /> : null}
                  {item.tag && !item.source ? (
                    <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
                      {item.tag}
                    </span>
                  ) : null}
                </div>
              </div>
              <span className="shrink-0 text-[11px] text-slate-400">
                {timeAgoShort(item.timestamp)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function timeAgoShort(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const m = Math.floor(ms / 60_000);
  if (m < 1) return "now";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return `${d}d`;
}

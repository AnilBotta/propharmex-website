import type { LeadSource } from "@propharmex/lib/leads/types";

import { SOURCE_COLOR, SOURCE_LABEL } from "./Pills";

export interface SourceShare {
  source: LeadSource;
  count: number;
  pct: number;
}

export function LeadSourcesCard({ shares }: { shares: SourceShare[] }) {
  const total = shares.reduce((s, x) => s + x.count, 0);
  const ordered = [...shares].sort((a, b) => b.count - a.count);

  return (
    <section className="rounded-lg border border-[color:var(--color-border)] bg-white">
      <header className="flex items-center justify-between gap-2 border-b border-[color:var(--color-border)] px-4 py-3">
        <h2 className="text-[15px] font-semibold text-slate-800">
          Lead sources <span className="text-[12px] font-normal text-slate-500">· 30d</span>
        </h2>
        <span className="rounded-md border border-[color:var(--color-border)] px-2 py-1 text-[11px] text-slate-500">
          Last 30 days
        </span>
      </header>

      {total === 0 ? (
        <div className="px-4 py-12 text-center text-[13px] text-slate-400">
          No leads captured yet.
        </div>
      ) : (
        <>
          {/* Stacked horizontal bar */}
          <div className="px-4 pt-4">
            <div
              className="flex h-2 w-full overflow-hidden rounded-full"
              role="img"
              aria-label="Lead source distribution"
            >
              {ordered.map((share) => (
                <div
                  key={share.source}
                  style={{
                    width: `${share.pct}%`,
                    background: SOURCE_COLOR[share.source].dot,
                  }}
                  title={`${SOURCE_LABEL[share.source]} ${share.pct.toFixed(1)}%`}
                />
              ))}
            </div>
          </div>

          {/* Legend */}
          <ul className="px-4 pb-4 pt-3 text-[13px]">
            {ordered.map((share) => (
              <li
                key={share.source}
                className="flex items-center justify-between border-b border-[color:var(--color-border)] py-2 last:border-0"
              >
                <span className="flex items-center gap-2 text-slate-700">
                  <span
                    aria-hidden
                    className="inline-block h-2.5 w-2.5 rounded-sm"
                    style={{ background: SOURCE_COLOR[share.source].dot }}
                  />
                  {SOURCE_LABEL[share.source]}
                </span>
                <span className="font-mono text-[12px] text-slate-500">
                  {share.pct.toFixed(0)}%
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

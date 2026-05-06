import { Sparkline } from "./Sparkline";

export interface KpiCardProps {
  label: string;
  value: string;
  subtext?: string;
  delta?: { pct: number; positive: boolean };
  spark?: { data: number[]; color: string };
  /** Bullet color shown next to the subtext. */
  dot?: string;
}

export function KpiCard({
  label,
  value,
  subtext,
  delta,
  spark,
  dot,
}: KpiCardProps) {
  return (
    <article className="rounded-lg border border-[color:var(--color-border)] bg-white p-4">
      <header className="flex items-start justify-between gap-2">
        <span className="text-[10px] font-semibold tracking-[0.1em] text-slate-500">
          {label}
        </span>
        {delta ? (
          <span
            className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
              delta.positive
                ? "bg-green-100 text-green-700"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {delta.positive ? "+" : ""}
            {delta.pct}%
          </span>
        ) : null}
      </header>
      <div className="mt-1 flex items-end justify-between gap-2">
        <span className="font-mono text-[28px] font-semibold leading-tight tracking-tight text-slate-900">
          {value}
        </span>
        {spark ? <Sparkline data={spark.data} color={spark.color} /> : null}
      </div>
      {subtext ? (
        <div className="mt-2 flex items-center gap-1.5 text-[12px] text-slate-500">
          {dot ? (
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: dot }}
            />
          ) : null}
          <span>{subtext}</span>
        </div>
      ) : null}
    </article>
  );
}

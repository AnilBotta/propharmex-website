import * as React from "react";
import { cn } from "../utils";

export interface StatProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Short label above the number — e.g. "DEL applications filed". */
  label: string;
  /** Primary numeric or short string — e.g. "11", "< 2%". Rendered in JetBrains Mono. */
  value: string;
  /** Optional qualifying suffix — e.g. "weeks", "approved". */
  suffix?: string;
  /** Optional footnote — e.g. "As of 2025-Q4". */
  footnote?: string;
}

export const Stat = React.forwardRef<HTMLDivElement, StatProps>(
  ({ className, label, value, suffix, footnote, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col gap-1", className)}
      {...props}
    >
      <span className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--color-muted)]">
        {label}
      </span>
      <span className="flex items-baseline gap-1.5">
        <span className="font-[family-name:var(--font-mono)] text-4xl font-semibold tabular-nums text-[var(--color-primary-700)]">
          {value}
        </span>
        {suffix ? (
          <span className="font-[family-name:var(--font-body)] text-base text-[var(--color-muted)]">
            {suffix}
          </span>
        ) : null}
      </span>
      {footnote ? (
        <span className="text-xs text-[var(--color-muted)]">{footnote}</span>
      ) : null}
    </div>
  )
);
Stat.displayName = "Stat";

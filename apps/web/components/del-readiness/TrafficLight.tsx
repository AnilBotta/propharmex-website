"use client";

/**
 * Traffic-light pill — single source of truth for the colour mapping used
 * on the results screen and the per-category breakdown.
 *
 * Tokens come from `packages/config/design-tokens.css`:
 *   green  → --color-success
 *   yellow → --color-warn
 *   red    → --color-danger
 */
import type { TrafficLight as TrafficLightT } from "@propharmex/lib/del-readiness";

import { DEL_READINESS } from "../../content/del-readiness";

interface Props {
  level: TrafficLightT;
  size?: "sm" | "md";
}

export function TrafficLightPill({ level, size = "md" }: Props) {
  const label = DEL_READINESS.results.trafficLightLabels[level];
  const cls =
    level === "green"
      ? "border-[var(--color-success)] bg-[color-mix(in_oklab,var(--color-success)_12%,transparent)] text-[var(--color-success)]"
      : level === "yellow"
        ? "border-[var(--color-warn)] bg-[color-mix(in_oklab,var(--color-warn)_12%,transparent)] text-[var(--color-warn)]"
        : "border-[var(--color-danger)] bg-[color-mix(in_oklab,var(--color-danger)_12%,transparent)] text-[var(--color-danger)]";
  const padding =
    size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-[11px]";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-[var(--radius-full)] border font-semibold uppercase tracking-[0.06em] ${padding} ${cls}`}
    >
      <span
        aria-hidden="true"
        className={
          level === "green"
            ? "size-1.5 rounded-full bg-[var(--color-success)]"
            : level === "yellow"
              ? "size-1.5 rounded-full bg-[var(--color-warn)]"
              : "size-1.5 rounded-full bg-[var(--color-danger)]"
        }
      />
      {label}
    </span>
  );
}

"use client";

/**
 * Region switcher (Prompt 22 PR-A).
 *
 * Refactored from the Phase-3 cookie-writer to consume `RegionContext`.
 * The provider owns:
 *   - the source of truth (`region`)
 *   - the POST to /api/region
 *   - the telemetry firing
 *   - the page reload that re-renders server components
 *
 * This component is now just a controlled select. Two visual variants
 * carried forward from the prior implementation: `"header"` (compact,
 * for the desktop nav) and `"footer"` (slightly wider, used in the
 * mobile sheet).
 *
 * The `initial` prop from the prior signature is gone — initial value
 * is owned by `<RegionProvider initialRegion={...}>` in the layout.
 * Header.tsx still passes `initialRegion` for now during the
 * transition; that prop is plumbed into the provider, not into this
 * component.
 */
import { Globe2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@propharmex/ui";

import { REGION_DESCRIPTORS, type Region } from "@propharmex/lib/region";

import { REGION_COPY } from "../../content/region";

import { useRegion } from "./RegionContext";

interface Props {
  className?: string;
  variant?: "header" | "footer";
}

export function RegionSwitcher({ className, variant = "header" }: Props) {
  const { region, setRegion, pending } = useRegion();

  return (
    <div className={className}>
      <Select
        value={region}
        onValueChange={(next) => {
          void setRegion(next as Region, { source: "switcher" });
        }}
        disabled={pending}
      >
        <SelectTrigger
          aria-label={REGION_COPY.switcher.triggerAriaLabel}
          className={
            variant === "header"
              ? "min-w-[120px] gap-2 text-sm"
              : "min-w-[132px] gap-2"
          }
        >
          <Globe2 aria-hidden="true" className="size-4" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {REGION_DESCRIPTORS.map((d) => (
            <SelectItem
              key={d.code}
              value={d.code}
              textValue={d.label}
              aria-label={REGION_COPY.switcher.optionAriaLabel(d.label)}
            >
              {d.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

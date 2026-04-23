"use client";

/**
 * Region switcher.
 *
 * Phase-3 behavior: client-side preference stored in a `propharmex-region`
 * cookie so server components can read it on the next request. Prompt 22
 * replaces the storage layer with middleware-based geo-personalization and
 * per-region content variants from Sanity.
 */
import { useCallback, useEffect, useState } from "react";
import { Globe2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@propharmex/ui";

import { REGIONS, type Region } from "../../content/site-nav";

const COOKIE_NAME = "propharmex-region";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 180; // ~6 months

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=")[1] ?? "") : undefined;
}

function writeCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

type Props = {
  /** Initial region hydrated from cookies on the server. */
  initial?: Region;
  className?: string;
  variant?: "header" | "footer";
};

export function RegionSwitcher({ initial, className, variant = "header" }: Props) {
  const [region, setRegion] = useState<Region>(initial ?? "GLOBAL");

  useEffect(() => {
    const stored = readCookie(COOKIE_NAME);
    if (stored && REGIONS.some((r) => r.code === stored)) {
      setRegion(stored as Region);
    }
  }, []);

  const onChange = useCallback((next: string) => {
    setRegion(next as Region);
    writeCookie(COOKIE_NAME, next);
    // Soft refresh so server components can re-read the cookie.
    if (typeof window !== "undefined") window.location.reload();
  }, []);

  return (
    <div className={className}>
      <Select value={region} onValueChange={onChange}>
        <SelectTrigger
          aria-label="Select your region"
          className={
            variant === "header"
              ? "h-9 min-w-[120px] gap-2 text-sm"
              : "min-w-[132px] gap-2"
          }
        >
          <Globe2 aria-hidden="true" className="size-4" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {REGIONS.map((r) => (
            <SelectItem key={r.code} value={r.code} textValue={r.label}>
              {r.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

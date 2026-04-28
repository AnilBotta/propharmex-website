"use client";

/**
 * RegionContext — client-side source of truth for the current region.
 *
 * Initial value comes from the server via `getServerRegion()` (read by
 * the root layout and passed in as `initialRegion`). The provider
 * exposes `region` + `setRegion` to client surfaces.
 *
 * `setRegion` does three things:
 *   1. Update local state so the switcher reflects the change without
 *      a round-trip.
 *   2. POST to /api/region so the cookie is updated server-side.
 *   3. Hard-reload the page so server components re-render with the
 *      new region. (A soft `router.refresh()` would re-run the layout,
 *      but a hard reload also resets any client state that depended
 *      on the old region — much simpler than threading invalidation
 *      through every consumer in PR-A.)
 *
 * PR-B will wire region-aware copy into the hero, cert emphasis,
 * CTAs, and contact-office order. This module supplies the read API
 * for those.
 */
import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

import type { Region } from "@propharmex/lib/region";

import { trackRegionChanged } from "./region-telemetry";

interface RegionContextValue {
  region: Region;
  setRegion: (
    next: Region,
    opts?: { source?: "switcher" | "banner" },
  ) => Promise<void>;
  pending: boolean;
}

const RegionCtx = createContext<RegionContextValue | null>(null);

interface ProviderProps {
  initialRegion: Region;
  children: ReactNode;
}

export function RegionProvider({ initialRegion, children }: ProviderProps) {
  const [region, setRegionState] = useState<Region>(initialRegion);
  const [pending, setPending] = useState(false);

  const setRegion = useCallback(
    async (next: Region, opts?: { source?: "switcher" | "banner" }) => {
      if (next === region) return;
      setPending(true);
      try {
        const res = await fetch("/api/region", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ region: next }),
        });
        if (!res.ok) {
          // eslint-disable-next-line no-console
          console.error("[region] save failed:", res.status);
          return;
        }
        setRegionState(next);
        trackRegionChanged({
          region: next,
          source: opts?.source ?? "switcher",
        });
        // Hard refresh so server components re-render with the new
        // region cookie. PR-B's region-aware surfaces depend on this.
        if (typeof window !== "undefined") window.location.reload();
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("[region] save error:", err);
      } finally {
        setPending(false);
      }
    },
    [region],
  );

  return (
    <RegionCtx.Provider value={{ region, setRegion, pending }}>
      {children}
    </RegionCtx.Provider>
  );
}

/**
 * Hook for client surfaces that need to read or change the region.
 * Throws when used outside `<RegionProvider>` so misuse fails fast in
 * dev rather than silently defaulting.
 */
export function useRegion(): RegionContextValue {
  const ctx = useContext(RegionCtx);
  if (!ctx) {
    throw new Error("useRegion must be used inside a <RegionProvider>");
  }
  return ctx;
}

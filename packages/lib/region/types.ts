/**
 * Region personalization types (Prompt 22 PR-A).
 *
 * Four regions tracked across the site:
 *
 *   CA      → Canadian visitors. DEL anchor + Health Canada cert emphasis.
 *   US      → US-based visitors. USFDA cert emphasis (cGMP, ANDA, DMF).
 *   IN      → Indian visitors. CDSCO references first.
 *   GLOBAL  → everyone else. WHO-GMP / EMA / TGA / PMDA references.
 *
 * The cookie name is `px-region` and stores one of those four codes
 * (uppercase). Middleware sets it on first visit from the Vercel geo
 * header `x-vercel-ip-country`; the user can override it via the header
 * switcher (writes through `/api/region`).
 *
 * The legacy cookie name `propharmex-region` (Phase 3) used a 3-region
 * enum without `US`. The middleware reads the legacy cookie if present
 * and migrates it to the new name + new enum so existing visitors
 * don't see a banner or lose their override.
 */
import { z } from "zod";

export const REGION_CODES = ["CA", "US", "IN", "GLOBAL"] as const;
export const RegionSchema = z.enum(REGION_CODES);
export type Region = z.infer<typeof RegionSchema>;

/** The cookie name set + read by Prompt 22 PR-A. */
export const REGION_COOKIE = "px-region";

/** The pre-Prompt-22 cookie name. Read for migration only. */
export const LEGACY_REGION_COOKIE = "propharmex-region";

/**
 * Cookie used to record that the user has dismissed (or interacted with)
 * the detection banner. When absent, the banner is shown on next render.
 */
export const REGION_BANNER_DISMISSED_COOKIE = "px-region-banner-dismissed";

/** Cookie max-age — 6 months matches the prior implementation. */
export const REGION_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 180;

export interface RegionDescriptor {
  code: Region;
  /** Long display label (used in the switcher options). */
  label: string;
  /** 2-3 char short label (used in the switcher trigger / banner). */
  shortLabel: string;
  /** One-sentence description used in dropdown options + banner. */
  description: string;
  /** Cert anchor displayed first in region-aware cert emphasis. */
  primaryCertAnchor: string;
}

export const REGION_DESCRIPTORS: RegionDescriptor[] = [
  {
    code: "CA",
    label: "Canada",
    shortLabel: "CA",
    description: "Health Canada DEL, ANDS, and Canadian market focus.",
    primaryCertAnchor: "Health Canada DEL",
  },
  {
    code: "US",
    label: "United States",
    shortLabel: "US",
    description: "USFDA cGMP, ANDA, and DMF references first.",
    primaryCertAnchor: "USFDA cGMP",
  },
  {
    code: "IN",
    label: "India",
    shortLabel: "IN",
    description: "CDSCO references and Hyderabad development depth.",
    primaryCertAnchor: "CDSCO",
  },
  {
    code: "GLOBAL",
    label: "Global",
    shortLabel: "GL",
    description: "WHO-GMP, EMA, TGA, and PMDA submissions.",
    primaryCertAnchor: "WHO-GMP",
  },
];

/** Single source of truth for the GLOBAL fallback descriptor. */
const GLOBAL_DESCRIPTOR: RegionDescriptor = {
  code: "GLOBAL",
  label: "Global",
  shortLabel: "GL",
  description: "WHO-GMP, EMA, TGA, and PMDA submissions.",
  primaryCertAnchor: "WHO-GMP",
};

/**
 * Look up the descriptor for a region code. Falls back to GLOBAL if the
 * code is malformed — defensive for cases where a stale cookie or stale
 * client-stored value reaches a renderer.
 */
export function getRegionDescriptor(code: string | undefined): RegionDescriptor {
  const found = REGION_DESCRIPTORS.find((r) => r.code === code);
  return found ?? GLOBAL_DESCRIPTOR;
}

/**
 * Migrate a value read from the legacy cookie (`propharmex-region`,
 * 3-region enum without US) to the new 4-region enum. Returns null when
 * the value isn't recognizable.
 */
export function migrateLegacyRegion(value: string | undefined): Region | null {
  if (!value) return null;
  if (value === "CA" || value === "US" || value === "IN" || value === "GLOBAL") {
    return value;
  }
  return null;
}

/**
 * ISO-3166-1 alpha-2 country code → Propharmex region mapping.
 *
 * Used by the Edge middleware to translate Vercel's `x-vercel-ip-country`
 * header into one of our four canonical region buckets. Each country
 * maps to exactly one region — the GLOBAL fallback is implicit (any
 * code not in the table).
 *
 * Three explicit regions; everything else lands in GLOBAL:
 *   CA → Canada
 *   US → United States
 *   IN → India
 *
 * If we want to expand (e.g. adding an EU bucket), this table is the
 * first place to grow.
 */
import type { Region } from "./types";

const COUNTRY_TO_REGION: Record<string, Region> = {
  CA: "CA",
  US: "US",
  IN: "IN",
};

/**
 * Map a 2-letter ISO country code to a Propharmex region. Returns
 * GLOBAL when:
 *   - the code isn't in `COUNTRY_TO_REGION`
 *   - the input is undefined (Vercel didn't supply a geo header — e.g.
 *     localhost, preview without the header configured)
 *   - the input is malformed (not 2 chars, lowercase, etc.)
 */
export function countryToRegion(country: string | undefined | null): Region {
  if (typeof country !== "string") return "GLOBAL";
  const normalized = country.trim().toUpperCase();
  if (normalized.length !== 2) return "GLOBAL";
  return COUNTRY_TO_REGION[normalized] ?? "GLOBAL";
}

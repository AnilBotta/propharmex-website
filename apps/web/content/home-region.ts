/**
 * Region-aware overrides for the homepage (Prompt 22 PR-B).
 *
 * Wraps the base `HOME` content in `home.ts` and returns a per-region
 * tuned variant for the surfaces that benefit from personalization:
 *
 *   - Hero subhead — region-specific framing of the operating model
 *   - Hero microtrust — cert line reordered by region
 *   - Trust strip — cert badges sorted by region's primary anchor
 *
 * Surfaces NOT touched here:
 *   - Hero headline / accent / CTAs — same across regions for v1.
 *     Promise-of-the-page doesn't change with region; only the framing
 *     does. Easy to add per-region CTA microcopy later if data warrants.
 *   - Why / What we do / Process — region-neutral by design.
 *   - DelBanner — Canada-anchored regardless of viewer (it's the
 *     headline cert). Stays as-is.
 *
 * The base `HOME` export is unchanged. SSG, RSC, and tests can still
 * import `HOME` directly when they don't need region awareness.
 */
import { prioritizeByRegion, pickRegionVariant, type Region } from "@propharmex/lib/region";

import { HOME, type HomeContent } from "./home";

/**
 * Per-region cert priority for the trust strip. Each region's primary
 * cert anchor sits at index 0; the rest follow in a sensible order.
 *
 * Priorities deliberately match the `RegionDescriptor.primaryCertAnchor`
 * values in `@propharmex/lib/region/types.ts` (DEL for CA, USFDA for
 * US, etc.). When that file changes, this table should change with it.
 */
const TRUST_CERT_PRIORITY: Record<Region, readonly HomeContent["trust"]["items"][number]["id"][]> = {
  CA: ["hc-del", "iso-9001", "who-gmp", "usfda", "tga"],
  US: ["usfda", "iso-9001", "hc-del", "who-gmp", "tga"],
  IN: ["iso-9001", "hc-del", "who-gmp", "usfda", "tga"],
  GLOBAL: ["who-gmp", "iso-9001", "hc-del", "usfda", "tga"],
};

/**
 * Region-tuned hero subhead. Same length and voice as the base; just
 * leads with the cert anchor that matters most to the visitor.
 */
const HERO_SUBHEAD_VARIANTS: Partial<Record<Region, string>> = {
  CA: "Development, analytical, regulatory, and distribution under one operating model — anchored on a Health Canada Drug Establishment Licence in Mississauga.",
  US: "Canadian sponsor-of-record under our Health Canada DEL, with USFDA-aligned analytical and regulatory packages for ANDA and DMF programmes.",
  IN: "An Indian development centre under one QMS with our Mississauga DEL site — for sponsors filing in Canada with the depth they need offshore.",
  // GLOBAL falls back to the base subhead.
};

/**
 * Region-tuned microtrust line. Reorders the same cert tokens as the
 * base; doesn't introduce certs the base doesn't claim.
 */
const HERO_MICROTRUST_VARIANTS: Partial<Record<Region, string>> = {
  CA: "Health Canada DEL · ISO 9001 · WHO-GMP · USFDA-registered · TGA-recognized",
  US: "USFDA-registered · ISO 9001 · Health Canada DEL · WHO-GMP · TGA-recognized",
  IN: "ISO 9001 · Health Canada DEL · WHO-GMP · USFDA-registered · TGA-recognized",
  // GLOBAL falls back to the base microtrust (which already leads with WHO-GMP context implicitly).
};

/**
 * Build a region-tuned `HomeContent` from the base. Pure — no I/O,
 * safe to call from RSC pages.
 */
export function regionalizeHome(region: Region): HomeContent {
  const heroSubhead = pickRegionVariant(
    HERO_SUBHEAD_VARIANTS,
    region,
    HOME.hero.subhead,
  );
  const heroMicrotrust = pickRegionVariant(
    HERO_MICROTRUST_VARIANTS,
    region,
    HOME.hero.microTrust,
  );
  const sortedTrustItems = prioritizeByRegion(
    HOME.trust.items,
    (item) => item.id,
    TRUST_CERT_PRIORITY,
    region,
  );

  return {
    ...HOME,
    hero: {
      ...HOME.hero,
      subhead: heroSubhead,
      microTrust: heroMicrotrust,
    },
    trust: {
      ...HOME.trust,
      items: sortedTrustItems,
    },
  };
}

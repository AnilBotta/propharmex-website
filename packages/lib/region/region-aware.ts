/**
 * Region-aware sorting + selection helpers (Prompt 22 PR-B).
 *
 * The infrastructure layer (PR-A) wired the read API. This file is the
 * shared utility that consumers — homepage, /quality, /contact —
 * reach for to reorder a list according to the current region's
 * priority hierarchy.
 *
 * Two concrete helpers:
 *
 *   `prioritizeByRegion(items, getKey, priority)` — stable sort that
 *     puts items whose `getKey()` matches the region's first priority
 *     before its second, etc. Items not in the priority list keep
 *     their original relative order at the tail.
 *
 *   `pickRegionVariant(variants, region, fallback)` — picks the
 *     region-specific variant from a partial map, falling back to
 *     `fallback` when the region key is absent. Used for hero copy +
 *     microcopy.
 */
import type { Region } from "./types";

/**
 * Generic stable region-prioritization sort.
 *
 * @param items     Source array — not mutated; a new array is returned.
 * @param getKey    Extract the key from an item that should match an
 *                  entry in the priority list (e.g. cert id, facility
 *                  region code).
 * @param priority  Per-region map of priority orders. Keys earlier in
 *                  the array sort first. Items whose key isn't in the
 *                  list keep their original relative order at the tail.
 * @param region    Current region — selects which priority order to use.
 */
export function prioritizeByRegion<T, K extends string>(
  items: T[],
  getKey: (item: T) => K,
  priority: Record<Region, readonly K[]>,
  region: Region,
): T[] {
  const order = priority[region];
  const indexOf = new Map<K, number>();
  order.forEach((k, i) => indexOf.set(k, i));

  return [...items]
    .map((item, originalIndex) => {
      // `Map.get` is `K | undefined`. Use `??` to fall back to the
      // sentinel for missing keys — equivalent to the prior
      // `has`+`get!` pattern but without a non-null assertion (which
      // CI's @typescript-eslint/no-non-null-assertion rejects).
      const rank = indexOf.get(getKey(item)) ?? Number.POSITIVE_INFINITY;
      return { item, originalIndex, rank };
    })
    .sort((a, b) => {
      if (a.rank !== b.rank) return a.rank - b.rank;
      return a.originalIndex - b.originalIndex;
    })
    .map((entry) => entry.item);
}

/**
 * Pick a region-specific variant from a partial map. Use for short
 * region-tuned copy (hero subhead, microtrust line, page lede) that
 * wouldn't justify a full content tree per region.
 *
 * Example:
 *   const subhead = pickRegionVariant(
 *     {
 *       CA: "Anchored on a Health Canada DEL...",
 *       US: "Canadian sponsor-of-record under our DEL, with USFDA-aligned analytical and regulatory packages.",
 *     },
 *     region,
 *     "Development, analytical, regulatory, and distribution under one operating model.",
 *   );
 */
export function pickRegionVariant<T>(
  variants: Partial<Record<Region, T>>,
  region: Region,
  fallback: T,
): T {
  return variants[region] ?? fallback;
}

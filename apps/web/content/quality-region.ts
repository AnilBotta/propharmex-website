/**
 * Region-aware overrides for the /quality-compliance page (Prompt 22 PR-B).
 *
 * Reorders the certification wall items so the visitor's primary cert
 * anchor sits first. Everything else stays in its original relative
 * order — this isn't a content variant, it's a priority cue.
 *
 * Other quality sections (QMS architecture, regulatory bodies, audit
 * history, DEL story teaser, downloads) are NOT touched. The DEL story
 * is Canada-anchored regardless of viewer (it's the strongest cert
 * Propharmex holds).
 */
import { prioritizeByRegion, type Region } from "@propharmex/lib/region";

import { QUALITY, type QualityContent } from "./quality";

/**
 * Per-region cert priority for the /quality-compliance certification
 * wall. Items not in a region's list keep their original relative
 * order at the tail.
 *
 * IDs match `apps/web/content/quality.ts::certifications.items[].id`.
 * Don't rename without updating both.
 */
const QUALITY_CERT_PRIORITY: Record<Region, readonly string[]> = {
  CA: [
    "health-canada-del",
    "who-gmp",
    "usfda-registration",
    "tga-recognition",
    "ich-q10-alignment",
  ],
  US: [
    "usfda-registration",
    "ich-q10-alignment",
    "ich-q2-alignment",
    "ich-q1a-alignment",
    "health-canada-del",
    "who-gmp",
  ],
  IN: [
    "who-gmp",
    "ich-q10-alignment",
    "ich-q2-alignment",
    "ich-q1a-alignment",
    "health-canada-del",
  ],
  GLOBAL: [
    "who-gmp",
    "ich-q10-alignment",
    "health-canada-del",
    "usfda-registration",
    "tga-recognition",
  ],
};

/**
 * Build a region-tuned `QualityContent` from the base. Pure — safe to
 * call from RSC pages.
 */
export function regionalizeQuality(region: Region): QualityContent {
  const sortedCerts = prioritizeByRegion(
    QUALITY.certifications.items,
    (item) => item.id,
    QUALITY_CERT_PRIORITY,
    region,
  );

  return {
    ...QUALITY,
    certifications: {
      ...QUALITY.certifications,
      items: sortedCerts,
    },
  };
}

/**
 * Deterministic capability-coverage computation for the Dosage Form
 * Matcher (Prompt 21 PR-A).
 *
 * Why deterministic: the model emits a qualitative `fitTier`
 * (high/medium/low) which is the right shape for a fuzzy therapeutic
 * judgement. The numeric coverage % alongside it answers a different,
 * objective question: "of the capabilities Propharmex thinks this
 * programme needs, how many do we actually offer for this dosage form?"
 * That number must be reproducible; we own the math.
 *
 * Algorithm:
 *   1. Take the model's `inferredRequirements.capabilities` (its best
 *      read of what the programme needs).
 *   2. Look up the dosage form's `SopCapability` entry.
 *   3. Coverage % = round(intersection size / inferred-required size * 100).
 *      0% when the form isn't in our SOP list.
 *
 * Edge cases:
 *   - Empty inferred requirements → 0% (the model failed; we don't
 *     pretend coverage).
 *   - Required capabilities that aren't in our enum at all (shouldn't
 *     happen — the schema constrains the model, but defensively we
 *     intersect rather than subtract).
 */
import type {
  Capability,
  EnrichedMatch,
  ModelMatch,
  ModelRecommendation,
  Recommendation,
  SopCapability,
} from "./types";

import { DEFAULT_SOP_CAPABILITIES, findSopCapability } from "./sopCapabilities";

export interface CoverageResult {
  capabilityCoveragePct: number;
  capabilitiesCovered: Capability[];
  capabilitiesMissing: Capability[];
}

/**
 * Compute the coverage % + per-capability split for a single dosage
 * form against a set of inferred requirements.
 */
export function computeCoverage(
  dosageForm: ModelMatch["dosageForm"],
  requiredCapabilities: Capability[],
  sopList: SopCapability[] = DEFAULT_SOP_CAPABILITIES,
): CoverageResult {
  const sop = findSopCapability(dosageForm, sopList);
  if (!sop || requiredCapabilities.length === 0) {
    return {
      capabilityCoveragePct: 0,
      capabilitiesCovered: [],
      capabilitiesMissing: [...requiredCapabilities],
    };
  }
  const supported = new Set<Capability>(sop.capabilities);
  const covered: Capability[] = [];
  const missing: Capability[] = [];
  // Dedupe required first so a model that double-emits a capability
  // doesn't skew the percentage. Order preserved for display.
  const seen = new Set<Capability>();
  for (const cap of requiredCapabilities) {
    if (seen.has(cap)) continue;
    seen.add(cap);
    if (supported.has(cap)) covered.push(cap);
    else missing.push(cap);
  }
  const total = covered.length + missing.length;
  const pct = total === 0 ? 0 : Math.round((covered.length / total) * 100);
  return {
    capabilityCoveragePct: pct,
    capabilitiesCovered: covered,
    capabilitiesMissing: missing,
  };
}

/**
 * Enrich a `ModelRecommendation` with per-match coverage % and produce
 * the final `Recommendation` payload sent to the client. Match ordering
 * is preserved — the model's qualitative ranking takes precedence over
 * the deterministic %.
 */
export function enrichRecommendation(
  rec: ModelRecommendation,
  sopList: SopCapability[] = DEFAULT_SOP_CAPABILITIES,
): Recommendation {
  const required = rec.inferredRequirements.capabilities;
  const enriched: EnrichedMatch[] = rec.matches.map((m) => {
    const cov = computeCoverage(m.dosageForm, required, sopList);
    return {
      ...m,
      capabilityCoveragePct: cov.capabilityCoveragePct,
      capabilitiesCovered: cov.capabilitiesCovered,
      capabilitiesMissing: cov.capabilitiesMissing,
    };
  });
  return {
    inferredRequirements: rec.inferredRequirements,
    matches: enriched,
  };
}

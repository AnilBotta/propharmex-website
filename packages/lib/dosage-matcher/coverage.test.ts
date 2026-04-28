import { describe, expect, it } from "vitest";

import { computeCoverage, enrichRecommendation } from "./coverage";
import { SAMPLE_MATCHER_RECOMMENDATION } from "./sample";
import { DEFAULT_SOP_CAPABILITIES, findSopCapability } from "./sopCapabilities";
import type { Capability, ModelRecommendation } from "./types";

const FULL_REQS: Capability[] = [
  "formulation",
  "analytical",
  "stability",
  "regulatory-us",
  "regulatory-ca",
];

describe("computeCoverage", () => {
  it("returns 100% when the SOP covers every required capability", () => {
    const r = computeCoverage("oral-solid", FULL_REQS);
    expect(r.capabilityCoveragePct).toBe(100);
    expect(r.capabilitiesMissing).toEqual([]);
    expect(r.capabilitiesCovered.length).toBe(FULL_REQS.length);
  });

  it("returns a partial % when the SOP covers some requirements", () => {
    // Inhalation only supports analytical in the fallback list.
    const r = computeCoverage("inhalation", FULL_REQS);
    expect(r.capabilityCoveragePct).toBe(20); // 1 / 5
    expect(r.capabilitiesCovered).toEqual(["analytical"]);
    expect(r.capabilitiesMissing).toEqual([
      "formulation",
      "stability",
      "regulatory-us",
      "regulatory-ca",
    ]);
  });

  it("returns 0% when the dosage form isn't in the SOP list", () => {
    // Force a missing form by passing an empty SOP list.
    const r = computeCoverage("oral-solid", FULL_REQS, []);
    expect(r.capabilityCoveragePct).toBe(0);
    expect(r.capabilitiesCovered).toEqual([]);
    expect(r.capabilitiesMissing).toEqual(FULL_REQS);
  });

  it("returns 0% when no requirements are inferred", () => {
    const r = computeCoverage("oral-solid", []);
    expect(r.capabilityCoveragePct).toBe(0);
    expect(r.capabilitiesCovered).toEqual([]);
  });

  it("dedupes repeated requirements before scoring", () => {
    const r = computeCoverage(
      "oral-solid",
      ["analytical", "analytical", "stability"] as Capability[],
    );
    // After dedup: analytical, stability — both covered → 100%.
    expect(r.capabilityCoveragePct).toBe(100);
    expect(r.capabilitiesCovered).toEqual(["analytical", "stability"]);
  });
});

describe("enrichRecommendation", () => {
  it("appends coverage to every match and preserves order", () => {
    const modelRec: ModelRecommendation = {
      inferredRequirements: {
        capabilities: FULL_REQS,
        dosageFormConsiderations:
          "Sample considerations for the test fixture only.",
      },
      matches: [
        {
          dosageForm: "oral-solid",
          fitTier: "high",
          rationale:
            "Oral solid is the most direct path for this archetype — high fit.",
          mismatchFlags: [],
          relevantCaseStudyTitles: [],
          suggestedNextSteps: ["Confirm API profile"],
        },
        {
          dosageForm: "inhalation",
          fitTier: "low",
          rationale:
            "Inhalation is a partner-supported path; low fit for this programme.",
          mismatchFlags: ["Manufacturing not in-house"],
          relevantCaseStudyTitles: [],
          suggestedNextSteps: ["Confirm partner availability"],
        },
      ],
    };
    const enriched = enrichRecommendation(modelRec);
    expect(enriched.matches[0]?.dosageForm).toBe("oral-solid");
    expect(enriched.matches[0]?.capabilityCoveragePct).toBe(100);
    expect(enriched.matches[1]?.dosageForm).toBe("inhalation");
    expect(enriched.matches[1]?.capabilityCoveragePct).toBe(20);
  });

  it("the canned sample passes the schema and has plausible coverage", () => {
    expect(SAMPLE_MATCHER_RECOMMENDATION.matches.length).toBeGreaterThan(0);
    for (const m of SAMPLE_MATCHER_RECOMMENDATION.matches) {
      expect(m.capabilityCoveragePct).toBeGreaterThanOrEqual(0);
      expect(m.capabilityCoveragePct).toBeLessThanOrEqual(100);
    }
  });
});

describe("findSopCapability", () => {
  it("returns the right entry for a known dosage form", () => {
    const sop = findSopCapability("oral-solid");
    expect(sop?.dosageForm).toBe("oral-solid");
    expect(sop?.capabilities).toContain("formulation");
  });

  it("returns undefined when the form isn't in the list", () => {
    const sop = findSopCapability("oral-solid", []);
    expect(sop).toBeUndefined();
  });

  it("the default SOP list covers every dosage-form enum value", () => {
    const formsInList = new Set(DEFAULT_SOP_CAPABILITIES.map((s) => s.dosageForm));
    // 13 dosage forms; sanity check that every one has an entry.
    expect(formsInList.size).toBe(13);
  });
});

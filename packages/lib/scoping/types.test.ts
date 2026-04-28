import { describe, expect, it } from "vitest";

import { SAMPLE_SCOPE } from "./sample";
import {
  PhaseSchema,
  ScopeSummarySchema,
  ServicePillarSchema,
  TimelineRangeSchema,
} from "./types";

describe("ScopeSummarySchema", () => {
  it("accepts the canonical sample", () => {
    const result = ScopeSummarySchema.safeParse(SAMPLE_SCOPE);
    expect(result.success).toBe(true);
  });

  it("requires at least one dosage form", () => {
    const result = ScopeSummarySchema.safeParse({
      ...SAMPLE_SCOPE,
      dosageForms: [],
    });
    expect(result.success).toBe(false);
  });

  it("requires at least one phase", () => {
    const result = ScopeSummarySchema.safeParse({
      ...SAMPLE_SCOPE,
      phases: [],
    });
    expect(result.success).toBe(false);
  });

  it("requires at least one recommended service", () => {
    const result = ScopeSummarySchema.safeParse({
      ...SAMPLE_SCOPE,
      recommendedServices: [],
    });
    expect(result.success).toBe(false);
  });
});

describe("ServicePillarSchema", () => {
  it("accepts canonical pillars", () => {
    for (const pillar of [
      "development",
      "analytical",
      "regulatory",
      "distribution",
      "quality",
    ]) {
      expect(ServicePillarSchema.safeParse(pillar).success).toBe(true);
    }
  });

  it("rejects unknown pillars", () => {
    expect(ServicePillarSchema.safeParse("marketing").success).toBe(false);
    expect(ServicePillarSchema.safeParse("commercial").success).toBe(false);
  });
});

describe("PhaseSchema", () => {
  it("rejects negative durationWeeks", () => {
    const result = PhaseSchema.safeParse({
      name: "Onboarding",
      durationWeeks: -2,
      milestones: ["Kickoff"],
    });
    expect(result.success).toBe(false);
  });

  it("rejects zero durationWeeks", () => {
    const result = PhaseSchema.safeParse({
      name: "Onboarding",
      durationWeeks: 0,
      milestones: ["Kickoff"],
    });
    expect(result.success).toBe(false);
  });

  it("requires at least one milestone", () => {
    const result = PhaseSchema.safeParse({
      name: "Onboarding",
      durationWeeks: 4,
      milestones: [],
    });
    expect(result.success).toBe(false);
  });
});

describe("TimelineRangeSchema", () => {
  it("accepts a valid range", () => {
    expect(TimelineRangeSchema.safeParse({ min: 4, max: 12 }).success).toBe(true);
  });

  it("accepts min === max", () => {
    expect(TimelineRangeSchema.safeParse({ min: 8, max: 8 }).success).toBe(true);
  });

  it("rejects min > max", () => {
    const result = TimelineRangeSchema.safeParse({ min: 20, max: 4 });
    expect(result.success).toBe(false);
  });
});

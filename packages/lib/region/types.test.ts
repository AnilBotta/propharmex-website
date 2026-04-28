import { describe, expect, it } from "vitest";

import { countryToRegion } from "./country-map";
import {
  getRegionDescriptor,
  migrateLegacyRegion,
  REGION_CODES,
  REGION_DESCRIPTORS,
  RegionSchema,
} from "./types";

describe("RegionSchema", () => {
  it("accepts the four canonical codes", () => {
    for (const code of REGION_CODES) {
      expect(RegionSchema.safeParse(code).success).toBe(true);
    }
  });

  it("rejects unknown codes", () => {
    expect(RegionSchema.safeParse("EU").success).toBe(false);
    expect(RegionSchema.safeParse("ca").success).toBe(false);
    expect(RegionSchema.safeParse("").success).toBe(false);
    expect(RegionSchema.safeParse(undefined).success).toBe(false);
  });
});

describe("REGION_DESCRIPTORS", () => {
  it("has one descriptor per code", () => {
    expect(REGION_DESCRIPTORS).toHaveLength(REGION_CODES.length);
    const codes = new Set(REGION_DESCRIPTORS.map((d) => d.code));
    for (const code of REGION_CODES) {
      expect(codes.has(code)).toBe(true);
    }
  });
});

describe("getRegionDescriptor", () => {
  it("returns the matching descriptor for a known code", () => {
    expect(getRegionDescriptor("CA").code).toBe("CA");
    expect(getRegionDescriptor("US").code).toBe("US");
  });

  it("falls back to GLOBAL for unknown / undefined input", () => {
    expect(getRegionDescriptor(undefined).code).toBe("GLOBAL");
    expect(getRegionDescriptor("EU").code).toBe("GLOBAL");
    expect(getRegionDescriptor("").code).toBe("GLOBAL");
  });
});

describe("migrateLegacyRegion", () => {
  it("returns the value when it's already a valid Region", () => {
    expect(migrateLegacyRegion("CA")).toBe("CA");
    expect(migrateLegacyRegion("IN")).toBe("IN");
    expect(migrateLegacyRegion("GLOBAL")).toBe("GLOBAL");
    // US is new, but if a legacy cookie somehow has it, accept it.
    expect(migrateLegacyRegion("US")).toBe("US");
  });

  it("returns null for empty / unknown input", () => {
    expect(migrateLegacyRegion(undefined)).toBeNull();
    expect(migrateLegacyRegion("")).toBeNull();
    expect(migrateLegacyRegion("eu")).toBeNull();
    expect(migrateLegacyRegion("ca")).toBeNull(); // case-sensitive
  });
});

describe("countryToRegion", () => {
  it("maps the three explicit countries to their regions", () => {
    expect(countryToRegion("CA")).toBe("CA");
    expect(countryToRegion("US")).toBe("US");
    expect(countryToRegion("IN")).toBe("IN");
  });

  it("normalizes case + whitespace before mapping", () => {
    expect(countryToRegion("ca")).toBe("CA");
    expect(countryToRegion("  us  ")).toBe("US");
    expect(countryToRegion("In")).toBe("IN");
  });

  it("falls back to GLOBAL for everything else", () => {
    expect(countryToRegion("GB")).toBe("GLOBAL");
    expect(countryToRegion("DE")).toBe("GLOBAL");
    expect(countryToRegion("XX")).toBe("GLOBAL");
  });

  it("falls back to GLOBAL for missing / malformed input", () => {
    expect(countryToRegion(undefined)).toBe("GLOBAL");
    expect(countryToRegion(null)).toBe("GLOBAL");
    expect(countryToRegion("")).toBe("GLOBAL");
    expect(countryToRegion("USA")).toBe("GLOBAL"); // 3 chars
    expect(countryToRegion("U")).toBe("GLOBAL");
  });
});

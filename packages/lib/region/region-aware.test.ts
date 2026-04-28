import { describe, expect, it } from "vitest";

import { pickRegionVariant, prioritizeByRegion } from "./region-aware";
import type { Region } from "./types";

const PRIORITY: Record<Region, readonly string[]> = {
  CA: ["hc-del", "iso-9001", "who-gmp", "usfda", "tga"],
  US: ["usfda", "iso-9001", "hc-del", "who-gmp", "tga"],
  IN: ["iso-9001", "hc-del", "who-gmp", "usfda", "tga"],
  GLOBAL: ["who-gmp", "iso-9001", "hc-del", "usfda", "tga"],
};

interface Cert {
  id: string;
  label: string;
}

const SOURCE: Cert[] = [
  { id: "hc-del", label: "Health Canada DEL" },
  { id: "iso-9001", label: "ISO 9001" },
  { id: "who-gmp", label: "WHO-GMP" },
  { id: "usfda", label: "USFDA-registered" },
  { id: "tga", label: "TGA-recognized" },
];

describe("prioritizeByRegion", () => {
  it("orders the source array by the region's priority list (CA)", () => {
    const sorted = prioritizeByRegion(SOURCE, (c) => c.id, PRIORITY, "CA");
    expect(sorted.map((c) => c.id)).toEqual([
      "hc-del",
      "iso-9001",
      "who-gmp",
      "usfda",
      "tga",
    ]);
  });

  it("orders by the US priority — USFDA first", () => {
    const sorted = prioritizeByRegion(SOURCE, (c) => c.id, PRIORITY, "US");
    expect(sorted[0]?.id).toBe("usfda");
  });

  it("places items NOT in the priority list at the tail with stable ordering", () => {
    const extra: Cert[] = [
      ...SOURCE,
      { id: "edqm", label: "EDQM" },
      { id: "pmda", label: "PMDA" },
    ];
    const sorted = prioritizeByRegion(extra, (c) => c.id, PRIORITY, "CA");
    // Last two slots should be edqm then pmda (their original relative order).
    expect(sorted[5]?.id).toBe("edqm");
    expect(sorted[6]?.id).toBe("pmda");
  });

  it("does not mutate the input", () => {
    const before = SOURCE.map((c) => c.id);
    prioritizeByRegion(SOURCE, (c) => c.id, PRIORITY, "GLOBAL");
    expect(SOURCE.map((c) => c.id)).toEqual(before);
  });
});

describe("pickRegionVariant", () => {
  it("returns the region-specific variant when present", () => {
    const out = pickRegionVariant(
      { CA: "Canadian copy", US: "US copy" },
      "US",
      "fallback",
    );
    expect(out).toBe("US copy");
  });

  it("returns the fallback when the region key is absent", () => {
    const out = pickRegionVariant(
      { CA: "Canadian copy" },
      "IN",
      "fallback",
    );
    expect(out).toBe("fallback");
  });

  it("falls back when the variant map is empty", () => {
    const out = pickRegionVariant({}, "GLOBAL", "fallback");
    expect(out).toBe("fallback");
  });
});

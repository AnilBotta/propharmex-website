import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const staticHomeSections = [
  "Hero.tsx",
  "TrustStrip.tsx",
  "WhyPillars.tsx",
  "WhatWeDo.tsx",
  "OperationalDepth.tsx",
  "MatcherTeaser.tsx",
  "Proof.tsx",
  "Process.tsx",
  "Industries.tsx",
  "Leadership.tsx",
  "Insights.tsx",
  "DelBanner.tsx",
] as const;

function readSection(fileName: string) {
  return readFileSync(join(process.cwd(), "components/home", fileName), "utf8");
}

describe("static homepage section bundle boundary", () => {
  it("keeps non-interactive sections out of the homepage client bundle", () => {
    for (const fileName of staticHomeSections) {
      const source = readSection(fileName);

      expect(source, fileName).not.toMatch(/^"use client";/);
      expect(source, fileName).not.toContain("framer-motion");
      expect(source, fileName).not.toContain("useReducedMotion");
    }
  });
});

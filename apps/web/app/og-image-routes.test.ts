import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const APP_DIR = join(process.cwd(), "app");

const requiredOgRoutes = [
  "case-studies/[slug]/opengraph-image.tsx",
  "industries/[slug]/opengraph-image.tsx",
  "services/analytical-services/[service]/opengraph-image.tsx",
  "services/pharmaceutical-development/[dosageForm]/opengraph-image.tsx",
  "services/regulatory-services/[service]/opengraph-image.tsx",
  "ai/del-readiness/opengraph-image.tsx",
  "ai/dosage-matcher/opengraph-image.tsx",
  "ai/project-scoping-assistant/opengraph-image.tsx",
] as const;

describe("per-route Open Graph image coverage", () => {
  it.each(requiredOgRoutes)("%s exists", (routePath) => {
    expect(existsSync(join(APP_DIR, routePath))).toBe(true);
  });
});

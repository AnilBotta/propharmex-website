import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const appRoot = process.cwd();
const repoRoot = path.resolve(appRoot, "../..");

function readRepoFile(relativePath: string) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

describe("launch polish contract", () => {
  it("keeps Clinical and BE-adjacent sample-analysis language off public analytical copy", () => {
    const analyticalCopy = readRepoFile("apps/web/content/analytical-services.ts");

    expect(analyticalCopy).not.toMatch(new RegExp("Clinical-study sample " + "analysis", "i"));
    const cro = "C" + "RO";
    expect(analyticalCopy).not.toMatch(new RegExp(`${cro} collaboration`, "i"));
    expect(analyticalCopy).not.toMatch(new RegExp(`collaborating accredited ${cro}`, "i"));
    expect(analyticalCopy).not.toMatch(
      new RegExp("regulated-" + "study sample " + "analysis", "i")
    );
    expect(analyticalCopy).not.toMatch(new RegExp(`study samples run at the ${cro}`, "i"));
  });

  it("does not list shipped form and Turnstile polish as pending launch work", () => {
    const launchDocs = [
      readRepoFile("docs/handoff.md"),
      readRepoFile("docs/launch-checklist.md"),
      readRepoFile("docs/accessibility-conformance.md"),
    ].join("\n");

    expect(launchDocs).not.toMatch(/currently form-level errors only/i);
    expect(launchDocs).not.toMatch(/Defer Cloudflare Turnstile until first form focus/i);
    expect(launchDocs).not.toMatch(/currently surface a global form-level error/i);
    expect(launchDocs).not.toMatch(/Per-field validation refactor planned/i);
  });

  it("scans current insight routes in the axe smoke list", () => {
    const axeRunner = readRepoFile("apps/web/scripts/run-axe-scan.mjs");

    expect(axeRunner).toContain("/insights/ich-q2-r2-method-validation-2024");
    expect(axeRunner).not.toContain("/insights/" + "del-at-a-glance-" + "foreign-sponsor-primer");
  });

  it("does not send current launch QA or homepage content to retired whitepaper slugs", () => {
    const checkedSurfaces = [
      readRepoFile("apps/web/content/home.ts"),
      readRepoFile("docs/accessibility-at-test-plan.md"),
      readRepoFile("scripts/generate-qa-matrix.py"),
    ].join("\n");

    expect(checkedSurfaces).not.toContain(
      "/insights/whitepapers/" + "canadian-cdmo-operating-model"
    );
    expect(checkedSurfaces).toContain("/insights/ich-q2-r2-method-validation-2024");
  });

  it("keeps forced-colors and 44px small-button targets in the design layer", () => {
    const tokens = readRepoFile("packages/config/design-tokens.css");
    const button = readRepoFile("packages/ui/components/Button.tsx");

    expect(tokens).toMatch(/@media\s*\(forced-colors:\s*active\)/);
    expect(button).toContain('sm: "h-11 px-3 text-sm"');
    expect(button).not.toContain("md:h-9");
  });
});

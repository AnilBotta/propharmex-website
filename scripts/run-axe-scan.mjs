#!/usr/bin/env node
/**
 * axe-core scan runner (Prompt 26 PR-B fixup).
 *
 * Replaces the @axe-core/cli approach which silently failed on the
 * GitHub-hosted runner because chromedriver wasn't on PATH. We use
 * @axe-core/playwright instead since Playwright bundles its own
 * Chromium (installed via `playwright install --with-deps chromium`
 * earlier in the workflow).
 *
 * Walks the URL list, runs axe against each page, writes a JSON
 * report to .axe-reports/. The companion gate script
 * `scripts/check-axe-violations.mjs` filters those reports for
 * serious + critical violations.
 *
 * Configurable via env:
 *   AXE_BASE_URL   default http://localhost:3000
 *   AXE_REPORTS    default .axe-reports
 *
 * Exit codes:
 *   0  — every URL scanned cleanly (axe ran; reports written)
 *   1  — one or more URLs failed to load or axe threw
 */
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import { chromium } from "@playwright/test";
import AxeBuilderModule from "@axe-core/playwright";

// @axe-core/playwright is published as CJS; ESM default-import lands the
// constructor on `.default`.
const AxeBuilder = AxeBuilderModule.default ?? AxeBuilderModule;

const BASE_URL = process.env.AXE_BASE_URL ?? "http://localhost:3000";
const REPORTS_DIR = process.env.AXE_REPORTS ?? ".axe-reports";

const URLS = [
  "/",
  "/why-propharmex",
  "/quality-compliance",
  "/services/pharmaceutical-development",
  "/services/pharmaceutical-development/solid-oral-dosage",
  "/insights",
  "/insights/del-at-a-glance-foreign-sponsor-primer",
  "/case-studies",
  "/contact",
  "/ai/del-readiness",
  "/accessibility",
];

/** Convert a URL path to a stable filename. `/` -> `root`. */
function nameForPath(p) {
  if (p === "/" || p === "") return "root";
  return p.replace(/^\//, "").replace(/\//g, "_");
}

async function main() {
  await fs.mkdir(REPORTS_DIR, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({
    // Match Lighthouse's mobile viewport so axe sees the same layout
    // the audit gate scores against.
    viewport: { width: 412, height: 823 },
    userAgent:
      "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36",
  });

  let failures = 0;

  for (const urlPath of URLS) {
    const fullUrl = `${BASE_URL}${urlPath}`;
    const name = nameForPath(urlPath);
    const reportPath = path.join(REPORTS_DIR, `${name}.json`);

    console.log(`::group::axe ${fullUrl}`);
    const page = await context.newPage();

    try {
      await page.goto(fullUrl, { waitUntil: "domcontentloaded", timeout: 30_000 });
      // Give client islands (Framer Motion, Concierge bubble, AI tool
      // hydration) a beat to mount before axe scans.
      await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {
        // networkidle can take longer than the budget on routes with
        // long-lived SSE/iframe connections (Cal.com); fall through and
        // scan against whatever has rendered so far.
      });

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      // Wrap the result with the URL so the gate script can attribute
      // findings without relying on filename parsing.
      const report = {
        url: fullUrl,
        timestamp: new Date().toISOString(),
        violations: results.violations,
        passes: results.passes.map((p) => ({ id: p.id })),
        incomplete: results.incomplete,
        inapplicable: results.inapplicable.map((i) => ({ id: i.id })),
      };

      await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

      const counts = results.violations.reduce(
        (acc, v) => {
          acc[v.impact ?? "unknown"] = (acc[v.impact ?? "unknown"] ?? 0) + 1;
          return acc;
        },
        {},
      );
      const summary = Object.entries(counts)
        .map(([k, v]) => `${k}=${v}`)
        .join(" ")
        || "clean";
      console.log(`  ${urlPath}  →  ${summary}`);
    } catch (err) {
      failures += 1;
      console.error(
        `::error::axe scan failed for ${fullUrl}: ${err?.message ?? err}`,
      );
    } finally {
      await page.close();
      console.log("::endgroup::");
    }
  }

  await context.close();
  await browser.close();

  if (failures > 0) {
    console.error(`✗ ${failures} URL(s) failed to scan.`);
    process.exit(1);
  }
  console.log(`✓ Scanned ${URLS.length} URLs. Reports in ${REPORTS_DIR}/.`);
}

await main();

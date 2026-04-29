#!/usr/bin/env node
/**
 * axe-core violation gate (Prompt 26 PR-B).
 *
 * Walks `.axe-reports/*.json` (each one written by `@axe-core/cli`),
 * filters for violations of impact `serious` or `critical`, and exits
 * non-zero if any are found. `minor` and `moderate` violations are
 * surfaced as warnings but do not block CI — they're tracked in the
 * accessibility-conformance.md known-limitations table.
 *
 * Stdlib-only Node (matches the bundle-budget script convention from
 * Prompt 25 PR-B).
 *
 * Exit codes:
 *   0 — no serious/critical violations across any report
 *   1 — at least one serious/critical violation
 *   2 — could not read any reports (treat as gate failure)
 *
 * The `@axe-core/cli` JSON output format is a top-level array of one
 * object per URL (or a single object when invoked with one URL); each
 * has a `violations` array of `{ id, impact, help, nodes[] }`.
 */
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const BLOCKING_IMPACTS = new Set(["serious", "critical"]);

async function main() {
  const dir = process.argv[2] ?? ".axe-reports";
  let entries;
  try {
    entries = await fs.readdir(dir);
  } catch (err) {
    console.error(`✗ Could not read ${dir}: ${err.message}`);
    process.exit(2);
  }

  const reportFiles = entries.filter((f) => f.endsWith(".json"));
  if (reportFiles.length === 0) {
    console.error(`✗ No .json reports found in ${dir}.`);
    process.exit(2);
  }

  let blocking = 0;
  let nonBlocking = 0;
  const blockingDetails = [];

  for (const file of reportFiles) {
    const fullPath = path.join(dir, file);
    let raw;
    try {
      raw = await fs.readFile(fullPath, "utf8");
    } catch (err) {
      console.error(`✗ Could not read ${fullPath}: ${err.message}`);
      process.exit(2);
    }

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      console.error(`✗ ${file} is not valid JSON: ${err.message}`);
      process.exit(2);
    }

    // axe-core/cli emits an array even for a single URL. Treat both shapes.
    const reports = Array.isArray(parsed) ? parsed : [parsed];

    for (const report of reports) {
      const url = report?.url ?? file;
      const violations = Array.isArray(report?.violations)
        ? report.violations
        : [];

      for (const v of violations) {
        const nodeCount = Array.isArray(v.nodes) ? v.nodes.length : 0;
        if (BLOCKING_IMPACTS.has(v.impact)) {
          blocking += 1;
          blockingDetails.push({
            url,
            id: v.id,
            impact: v.impact,
            help: v.help,
            nodeCount,
          });
        } else {
          nonBlocking += 1;
        }
      }
    }
  }

  console.log(`axe-core gate — reports scanned: ${reportFiles.length}`);
  console.log(`  blocking (serious + critical): ${blocking}`);
  console.log(`  non-blocking (minor + moderate): ${nonBlocking}`);
  console.log("");

  if (blocking === 0) {
    console.log("✓ No serious or critical violations.");
    if (nonBlocking > 0) {
      console.log(
        `  ${nonBlocking} non-blocking finding(s) — review the uploaded axe-reports artifact.`,
      );
    }
    process.exit(0);
  }

  console.error("✗ Blocking violations:");
  for (const v of blockingDetails) {
    console.error(
      `  [${v.impact}] ${v.id} — ${v.help} (${v.nodeCount} node(s)) on ${v.url}`,
    );
  }
  console.error("");
  console.error(
    "Fix or document. See docs/accessibility-conformance.md and docs/accessibility-at-test-plan.md.",
  );
  process.exit(1);
}

await main();

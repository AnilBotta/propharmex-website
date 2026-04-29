#!/usr/bin/env node
/**
 * Bundle-size budget gate (Prompt 25 PR-B).
 *
 * Parses the route-size table that `next build` prints to stdout,
 * extracts the "First Load JS" column for every route, and exits 1 if
 * any route's First Load JS exceeds the 150 KB budget on mobile.
 *
 * Usage:
 *   pnpm --filter web build 2>&1 | tee build.log
 *   node scripts/check-bundle-budget.mjs build.log
 *
 * The script can also read from stdin if no file is given:
 *   pnpm --filter web build 2>&1 | node scripts/check-bundle-budget.mjs
 *
 * Threshold can be overridden via `BUNDLE_BUDGET_KB` env var. Default:
 * 150 (matching the Prompt 25 spec). Lighthouse budget-guard skill
 * surfaces the same number — they should stay in sync.
 *
 * Output (failure):
 *   ✗ /ai/del-readiness          161.2 kB   (over by 11.2 kB)
 *   ✗ /insights/[slug]           158.0 kB   (over by 8.0 kB)
 *   1 route is at or under budget; 2 over.
 *
 * Exit codes:
 *   0  — every route at or under budget
 *   1  — at least one route over budget (CI-failing)
 *   2  — no route table found in input (broken build, treat as failure)
 *
 * No npm deps — runs with stock Node 20 stdlib only.
 */
import fs from "node:fs/promises";
import process from "node:process";

const BUDGET_KB = Number.parseFloat(process.env.BUNDLE_BUDGET_KB ?? "150");
const BUDGET_BYTES = BUDGET_KB * 1024;

/* -------------------------------------------------------------------------- */
/*  Input                                                                     */
/* -------------------------------------------------------------------------- */

async function readInput() {
  const fileArg = process.argv[2];
  if (fileArg) return fs.readFile(fileArg, "utf8");

  // No file given — read from stdin.
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
}

/* -------------------------------------------------------------------------- */
/*  Parsing                                                                   */
/* -------------------------------------------------------------------------- */

const ANSI_RE = /\x1b\[[0-9;]*m/g;
const SIZE_RE = /(\d+(?:\.\d+)?)\s*(B|kB|MB)/g;

/** Strip ANSI color escapes so the parser sees plain text. */
function stripAnsi(s) {
  return s.replace(ANSI_RE, "");
}

/** Convert a "12.4 kB" / "950 B" / "1.2 MB" string to bytes. */
function toBytes(value, unit) {
  const n = Number.parseFloat(value);
  switch (unit) {
    case "B":
      return n;
    case "kB":
      return n * 1024;
    case "MB":
      return n * 1024 * 1024;
    default:
      return Number.NaN;
  }
}

/** Format a byte count for human display. */
function fmtKb(bytes) {
  return `${(bytes / 1024).toFixed(1)} kB`;
}

/**
 * Identify route lines in the Next 15 build output.
 *
 * The table looks like:
 *
 *   Route (app)                                     Size     First Load JS
 *   ┌ ○ /                                          1.45 kB         95.2 kB
 *   ├ ○ /_not-found                                 990 B          82.4 kB
 *   ├ ƒ /api/ai/concierge                          0 B                0 B
 *   └ ○ /sitemap.xml                              1.23 kB         86.7 kB
 *   + First Load JS shared by all                  81.6 kB
 *
 * Route lines:
 *   - Start with a tree-drawing char (┌├└) followed by space + a status
 *     glyph (○ ● ƒ ◐) and another space, then the route path.
 *   - Always contain at least two SIZE_RE matches (Size, First Load JS).
 *   - The "+ First Load JS shared by all" trailer line has only one
 *     size match — easy to filter out.
 *
 * This parser is intentionally tolerant: if Next's table format drifts
 * we should fall through to the "no route table found" failure mode
 * rather than silently passing budget.
 */
function parseRoutes(raw) {
  const text = stripAnsi(raw);
  const routes = [];

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trimEnd();
    if (!line) continue;

    // Must look like a route table row.
    const match = line.match(
      /^[\s]*[┌├└][\s]+[○●ƒ◐◑][\s]+(\S.*?)\s+\d/u,
    );
    if (!match) continue;

    const route = match[1].trim();
    if (!route) continue;

    // Collect all size tokens on the line; the LAST one is First Load JS.
    const sizes = [...line.matchAll(SIZE_RE)];
    if (sizes.length < 2) continue;
    const last = sizes[sizes.length - 1];
    const bytes = toBytes(last[1], last[2]);
    if (Number.isNaN(bytes)) continue;

    routes.push({ route, firstLoadBytes: bytes });
  }

  return routes;
}

/* -------------------------------------------------------------------------- */
/*  Reporting                                                                 */
/* -------------------------------------------------------------------------- */

function report(routes) {
  if (routes.length === 0) {
    console.error(
      "✗ No route table found in build output. Was `next build` actually run?",
    );
    process.exit(2);
  }

  const overBudget = routes.filter((r) => r.firstLoadBytes > BUDGET_BYTES);

  // Always print the worst offenders so you can see how close the next
  // route is to going over budget — even on a passing build.
  const sorted = [...routes].sort(
    (a, b) => b.firstLoadBytes - a.firstLoadBytes,
  );

  const top = sorted.slice(0, 5);
  console.log(`Bundle budget: ${BUDGET_KB} kB First-Load JS per route`);
  console.log(`Routes scanned: ${routes.length}`);
  console.log("");
  console.log("Top 5 by First-Load JS:");
  for (const r of top) {
    const marker = r.firstLoadBytes > BUDGET_BYTES ? "✗" : "✓";
    console.log(
      `  ${marker} ${r.route.padEnd(50)} ${fmtKb(r.firstLoadBytes)}`,
    );
  }
  console.log("");

  if (overBudget.length === 0) {
    console.log(`✓ All ${routes.length} routes at or under budget.`);
    process.exit(0);
  }

  console.error(
    `✗ ${overBudget.length} route(s) over the ${BUDGET_KB} kB budget:`,
  );
  for (const r of overBudget) {
    const overBy = r.firstLoadBytes - BUDGET_BYTES;
    console.error(
      `  ${r.route.padEnd(50)} ${fmtKb(r.firstLoadBytes)}   (over by ${fmtKb(overBy)})`,
    );
  }
  console.error("");
  console.error(
    "See docs/runbook.md §12 (Bundle-size budget) and the lighthouse-budget-guard skill",
  );
  console.error("for remediation guidance (lazy-load, dynamic import, code-split).");
  process.exit(1);
}

/* -------------------------------------------------------------------------- */
/*  Main                                                                      */
/* -------------------------------------------------------------------------- */

const raw = await readInput();
const routes = parseRoutes(raw);
report(routes);

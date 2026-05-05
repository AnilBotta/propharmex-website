#!/usr/bin/env node
/**
 * cf-purge-cache — purge the Cloudflare edge cache for the Propharmex zone.
 *
 * Wraps the Cloudflare API endpoint:
 *   POST https://api.cloudflare.com/client/v4/zones/:zone_id/purge_cache
 *
 * Reads two env vars:
 *   - CF_API_TOKEN  — zone-scoped token with Cache Purge:Edit permission
 *   - CF_ZONE_ID    — zone id from the Cloudflare dashboard overview
 *
 * Usage:
 *   node scripts/cf-purge-cache.mjs                    # purge everything
 *   node scripts/cf-purge-cache.mjs <url1> <url2> ...  # purge specific URLs
 *
 * Examples:
 *   # post-deploy full purge:
 *   node scripts/cf-purge-cache.mjs
 *
 *   # surgical purge of a content correction:
 *   node scripts/cf-purge-cache.mjs https://propharmex.com/about https://propharmex.com/why-propharmex
 *
 * Wire into a Vercel deploy hook (Project Settings → Git → Deploy Hooks)
 * if you want automatic post-deploy purges. Otherwise invoke manually
 * after high-priority deploys per docs/runbook.md §15.1.
 *
 * Node 20 stdlib only — no dependencies. Same posture as
 * scripts/check-bundle-budget.mjs.
 */

const CF_API_BASE = "https://api.cloudflare.com/client/v4";

function fail(msg) {
  console.error(`✗ ${msg}`);
  process.exit(1);
}

function readEnv() {
  const token = process.env.CF_API_TOKEN;
  const zone = process.env.CF_ZONE_ID;
  if (!token) {
    fail(
      "CF_API_TOKEN is unset. Create a zone-scoped token with Cache Purge:Edit at " +
        "https://dash.cloudflare.com/profile/api-tokens",
    );
  }
  if (!zone) {
    fail(
      "CF_ZONE_ID is unset. Find it on the Cloudflare dashboard zone-overview page (right sidebar).",
    );
  }
  return { token, zone };
}

async function purge(zone, token, body) {
  const res = await fetch(`${CF_API_BASE}/zones/${zone}/purge_cache`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  let parsed;
  try {
    parsed = await res.json();
  } catch {
    parsed = null;
  }

  if (!res.ok || !parsed || parsed.success !== true) {
    const detail = parsed?.errors
      ? parsed.errors.map((e) => `${e.code}: ${e.message}`).join("; ")
      : `HTTP ${res.status} ${res.statusText}`;
    fail(`Cloudflare purge failed — ${detail}`);
  }

  return parsed;
}

async function main() {
  const { token, zone } = readEnv();
  const args = process.argv.slice(2);

  let body;
  let summary;
  if (args.length === 0) {
    body = { purge_everything: true };
    summary = "purge_everything";
  } else {
    body = { files: args };
    summary = `${args.length} URL(s)`;
  }

  console.log(`→ Cloudflare purge: ${summary} (zone ${zone.slice(0, 8)}…)`);
  const result = await purge(zone, token, body);
  console.log(`✓ Purge id: ${result.result?.id ?? "(no id)"} — Cloudflare confirmed success.`);
  console.log(
    "  Note: edge propagation typically completes in <30 s; up to 5 min worst-case during peak load.",
  );
}

main().catch((err) => {
  fail(err instanceof Error ? err.message : String(err));
});

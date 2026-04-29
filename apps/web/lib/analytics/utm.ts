/**
 * First-touch UTM persistence.
 *
 * On the user's *first* visit (no UTM record in localStorage) we capture
 * any UTM parameters from the URL and pin them as a super-property. On
 * subsequent visits the original first-touch values are preserved — a
 * later UTM visit does NOT overwrite first-touch. This matches the
 * standard "first-touch attribution" model used by sales / marketing
 * funnel analysis.
 *
 * Storage: localStorage key `px:first-touch-utm`. Single JSON blob with
 * the five canonical UTM keys + a captured-at timestamp. We do not store
 * any other URL params so this can't accidentally leak PII via custom
 * tracking strings on partner links.
 *
 * Privacy note: UTM values are user-supplied marketing tags, never user
 * identifiers. They're safe to attach to events.
 */

const STORAGE_KEY = "px:first-touch-utm";

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

type UtmKey = (typeof UTM_KEYS)[number];

export type FirstTouchUtm = Partial<Record<UtmKey, string>> & {
  captured_at?: string;
};

function readStorage(storage: Storage): FirstTouchUtm | null {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    const record = parsed as Record<string, unknown>;
    const out: FirstTouchUtm = {};
    for (const key of UTM_KEYS) {
      const v = record[key];
      if (typeof v === "string" && v.length > 0) out[key] = v;
    }
    if (typeof record.captured_at === "string") {
      out.captured_at = record.captured_at;
    }
    return Object.keys(out).length > 0 ? out : null;
  } catch {
    return null;
  }
}

function writeStorage(storage: Storage, value: FirstTouchUtm): void {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Quota / disabled localStorage — silently skip. UTM is best-effort.
  }
}

/** Extract whitelisted UTM params from a URL string. */
export function parseUtmFromUrl(url: string): FirstTouchUtm {
  const out: FirstTouchUtm = {};
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return out;
  }
  for (const key of UTM_KEYS) {
    const v = parsed.searchParams.get(key);
    if (v && v.trim().length > 0) {
      out[key] = v.slice(0, 200); // hard cap to keep payload tight
    }
  }
  return out;
}

/**
 * Resolve first-touch UTM values, persisting them on first call.
 *
 * Returns the previously-captured set if one exists; otherwise reads the
 * current URL, persists it (even if empty — we still want a marker so the
 * "no UTM" case is treated identically to "ever-set UTM"), and returns it.
 *
 * The injected `storage` and `currentUrl` are explicit dependencies so the
 * function can be unit-tested without a browser.
 */
export function resolveFirstTouchUtm(opts: {
  storage: Storage;
  currentUrl: string;
  now?: () => Date;
}): FirstTouchUtm {
  const existing = readStorage(opts.storage);
  if (existing) return existing;

  const captured = parseUtmFromUrl(opts.currentUrl);
  const stamped: FirstTouchUtm = {
    ...captured,
    captured_at: (opts.now?.() ?? new Date()).toISOString(),
  };
  writeStorage(opts.storage, stamped);
  return stamped;
}

/** Test-only: clear the first-touch record. Not exported via barrel. */
export function clearFirstTouchUtm(storage: Storage): void {
  try {
    storage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

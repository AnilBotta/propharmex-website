import { describe, expect, it } from "vitest";

import {
  clearFirstTouchUtm,
  parseUtmFromUrl,
  resolveFirstTouchUtm,
} from "./utm";

/** Minimal in-memory `Storage` implementation for unit tests. */
function memoryStorage(): Storage {
  const store = new Map<string, string>();
  return {
    getItem: (k) => store.get(k) ?? null,
    setItem: (k, v) => {
      store.set(k, String(v));
    },
    removeItem: (k) => {
      store.delete(k);
    },
    clear: () => {
      store.clear();
    },
    key: (i) => Array.from(store.keys())[i] ?? null,
    get length() {
      return store.size;
    },
  } as Storage;
}

describe("parseUtmFromUrl", () => {
  it("returns the five canonical UTM params when present", () => {
    const got = parseUtmFromUrl(
      "https://propharmex.com/?utm_source=linkedin&utm_medium=social&utm_campaign=q1&utm_term=cdmo&utm_content=hero",
    );
    expect(got).toEqual({
      utm_source: "linkedin",
      utm_medium: "social",
      utm_campaign: "q1",
      utm_term: "cdmo",
      utm_content: "hero",
    });
  });

  it("ignores other query params", () => {
    const got = parseUtmFromUrl(
      "https://propharmex.com/?utm_source=newsletter&internal_tracking=secret",
    );
    expect(got).toEqual({ utm_source: "newsletter" });
  });

  it("returns empty object on malformed URLs", () => {
    expect(parseUtmFromUrl("not-a-url")).toEqual({});
  });

  it("caps absurdly long UTM values at 200 chars", () => {
    const long = "x".repeat(500);
    const got = parseUtmFromUrl(`https://propharmex.com/?utm_source=${long}`);
    expect(got.utm_source?.length).toBe(200);
  });
});

describe("resolveFirstTouchUtm", () => {
  it("captures and persists UTM on first call", () => {
    const storage = memoryStorage();
    const result = resolveFirstTouchUtm({
      storage,
      currentUrl:
        "https://propharmex.com/?utm_source=google&utm_medium=cpc",
      now: () => new Date("2026-04-29T00:00:00Z"),
    });
    expect(result.utm_source).toBe("google");
    expect(result.utm_medium).toBe("cpc");
    expect(result.captured_at).toBe("2026-04-29T00:00:00.000Z");
  });

  it("preserves first-touch values on subsequent calls (later visits never overwrite)", () => {
    const storage = memoryStorage();
    resolveFirstTouchUtm({
      storage,
      currentUrl: "https://propharmex.com/?utm_source=linkedin",
    });
    const second = resolveFirstTouchUtm({
      storage,
      currentUrl: "https://propharmex.com/?utm_source=google&utm_medium=cpc",
    });
    expect(second.utm_source).toBe("linkedin");
    expect(second.utm_medium).toBeUndefined();
  });

  it("clearFirstTouchUtm allows the next visit to re-pin", () => {
    const storage = memoryStorage();
    resolveFirstTouchUtm({
      storage,
      currentUrl: "https://propharmex.com/?utm_source=linkedin",
    });
    clearFirstTouchUtm(storage);
    const next = resolveFirstTouchUtm({
      storage,
      currentUrl: "https://propharmex.com/?utm_source=google",
    });
    expect(next.utm_source).toBe("google");
  });
});

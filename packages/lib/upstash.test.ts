import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { __resetRateLimiterCacheForTests, getRateLimiter } from "./upstash";

const ORIGINAL_ENV = { ...process.env };

beforeEach(() => {
  __resetRateLimiterCacheForTests();
  vi.resetModules();
});

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
});

describe("getRateLimiter — no-op fallback", () => {
  it("returns success: true when Upstash env vars are unset", async () => {
    // env.ts is loaded lazily through `getRateLimiter`. With no Upstash vars
    // set during the test run, the helper returns the no-op limiter.
    const limiter = getRateLimiter("concierge:test", { tokens: 1, window: "1 s" });
    const r1 = await limiter.limit("anon");
    const r2 = await limiter.limit("anon");
    const r3 = await limiter.limit("anon");
    expect(r1.success).toBe(true);
    expect(r2.success).toBe(true);
    expect(r3.success).toBe(true);
    expect(r1.limit).toBe(Number.POSITIVE_INFINITY);
  });

  it("caches the limiter so repeated calls return the same instance", () => {
    const a = getRateLimiter("scope-a", { tokens: 5, window: "1 m" });
    const b = getRateLimiter("scope-a", { tokens: 5, window: "1 m" });
    expect(a).toBe(b);
  });

  it("the no-op limiter is shared across scopes (stateless, safe to share)", () => {
    // When Upstash env is unset, every scope falls back to the same no-op
    // limiter. That's fine — it's stateless and always returns success.
    // This documents the behavior so a future change that introduces real
    // limiters per scope (with Upstash configured) doesn't accidentally
    // break this assumption.
    const a = getRateLimiter("scope-a", { tokens: 5, window: "1 m" });
    const b = getRateLimiter("scope-b", { tokens: 5, window: "1 m" });
    expect(a).toBe(b);
  });
});

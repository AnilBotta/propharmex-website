/**
 * Upstash rate-limit helper.
 *
 * Wraps `@upstash/ratelimit` + `@upstash/redis` with a no-op fallback so dev
 * environments and CI runs without Upstash credentials still work — every
 * caller can rely on `getRateLimiter(...).limit(key)` returning a
 * `RateLimitResult` shape regardless of whether Upstash is configured.
 *
 * Used from /api/ai/concierge (Prompt 18 PR-C) and any future AI endpoint.
 *
 * Env vars (validated by `packages/lib/env.ts`):
 *   - UPSTASH_REDIS_REST_URL
 *   - UPSTASH_REDIS_REST_TOKEN
 */
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

import { env } from "./env";

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  /** Unix-ms timestamp at which the window resets. */
  reset: number;
}

export interface RateLimiter {
  limit(key: string): Promise<RateLimitResult>;
}

export interface RateLimiterOptions {
  /** Number of allowed requests per window. Default: 10. */
  tokens?: number;
  /** Sliding-window duration. Default: "1 m". */
  window?: `${number} ${"s" | "m" | "h" | "d"}`;
}

/**
 * Cache instances per `(scope, tokens, window)` so calling `getRateLimiter`
 * from a hot path (Edge route handler) doesn't allocate a new client per
 * request. The Upstash client is stateless HTTP, so a singleton is safe.
 */
const cache = new Map<string, RateLimiter>();

const NOOP_LIMIT_RESULT: RateLimitResult = {
  success: true,
  limit: Number.POSITIVE_INFINITY,
  remaining: Number.POSITIVE_INFINITY,
  reset: 0,
};

const noopLimiter: RateLimiter = {
  async limit() {
    return NOOP_LIMIT_RESULT;
  },
};

export function getRateLimiter(
  scope: string,
  opts: RateLimiterOptions = {},
): RateLimiter {
  const tokens = opts.tokens ?? 10;
  const window = opts.window ?? "1 m";
  const cacheKey = `${scope}::${tokens}::${window}`;

  const cached = cache.get(cacheKey);
  if (cached) return cached;

  if (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN) {
    cache.set(cacheKey, noopLimiter);
    return noopLimiter;
  }

  const redis = new Redis({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN,
  });

  const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(tokens, window),
    prefix: `propharmex:${scope}`,
    analytics: false,
  });

  const limiter: RateLimiter = {
    async limit(key: string) {
      const result = await ratelimit.limit(key);
      return {
        success: result.success,
        limit: result.limit,
        remaining: result.remaining,
        reset: result.reset,
      };
    },
  };

  cache.set(cacheKey, limiter);
  return limiter;
}

/**
 * Test-only helper to clear the singleton cache between specs. Not exported
 * from the package index — only the colocated test imports it.
 */
export function __resetRateLimiterCacheForTests(): void {
  cache.clear();
}

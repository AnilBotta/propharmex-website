/**
 * Centralized, Zod-validated environment loader.
 *
 * Every workspace reads env vars through this module — never `process.env.X` directly.
 * Missing required vars throw at import time in production; in dev they warn and
 * return `undefined` so `pnpm dev` boots even before all keys are supplied.
 *
 * See CLAUDE.md §9 for the full spec.
 */
import { z } from "zod";

const isProd = process.env.NODE_ENV === "production";

const optionalUrl = z.string().url().optional();
const optionalNonEmpty = z.string().min(1).optional();

/* -------------------------------------------------------------------------- */
/*  Schema                                                                    */
/* -------------------------------------------------------------------------- */

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),

  // Sanity (Phase 3)
  NEXT_PUBLIC_SANITY_PROJECT_ID: optionalNonEmpty,
  NEXT_PUBLIC_SANITY_DATASET: z.string().default("production"),
  NEXT_PUBLIC_SANITY_API_VERSION: z.string().default("2025-01-01"),
  SANITY_API_READ_TOKEN: optionalNonEmpty,
  SANITY_API_WRITE_TOKEN: optionalNonEmpty,
  SANITY_WEBHOOK_SECRET: optionalNonEmpty,
  SANITY_PREVIEW_SECRET: optionalNonEmpty,

  // Supabase (Phase 3 + RAG Phase 7)
  NEXT_PUBLIC_SUPABASE_URL: optionalUrl,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: optionalNonEmpty,
  SUPABASE_SERVICE_ROLE_KEY: optionalNonEmpty,
  DATABASE_URL: optionalNonEmpty,

  // AI (Phase 7)
  ANTHROPIC_API_KEY: optionalNonEmpty,
  OPENAI_API_KEY: optionalNonEmpty,

  // Resend (Phase 7)
  RESEND_API_KEY: optionalNonEmpty,
  RESEND_FROM_EMAIL: optionalNonEmpty,
  RESEND_CONTACT_TO_EMAIL: optionalNonEmpty,
  RESEND_NEWSLETTER_AUDIENCE_ID: optionalNonEmpty,

  // Cal.com (Phase 7)
  CAL_LINK: optionalNonEmpty,
  CAL_EVENT_TYPE_ID: optionalNonEmpty,

  // Analytics (Phase 8)
  NEXT_PUBLIC_PLAUSIBLE_DOMAIN: optionalNonEmpty,
  NEXT_PUBLIC_POSTHOG_KEY: optionalNonEmpty,
  NEXT_PUBLIC_POSTHOG_HOST: z.string().url().default("https://us.i.posthog.com"),

  // Bot / rate (Phase 7)
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: optionalNonEmpty,
  TURNSTILE_SECRET_KEY: optionalNonEmpty,
  UPSTASH_REDIS_REST_URL: optionalUrl,
  UPSTASH_REDIS_REST_TOKEN: optionalNonEmpty,

  // Observability (Phase 9)
  NEXT_PUBLIC_SENTRY_DSN: optionalNonEmpty,
  SENTRY_AUTH_TOKEN: optionalNonEmpty,
  SENTRY_ORG: optionalNonEmpty,
  SENTRY_PROJECT: optionalNonEmpty,
  AXIOM_TOKEN: optionalNonEmpty,
  AXIOM_DATASET: optionalNonEmpty,
});

export type Env = z.infer<typeof EnvSchema>;

/* -------------------------------------------------------------------------- */
/*  Parse                                                                     */
/* -------------------------------------------------------------------------- */

// CI pipelines and `.env` files routinely inject variables as empty strings
// (e.g. `NEXT_PUBLIC_SANITY_PROJECT_ID:` with nothing after the colon).
// Treat empty strings as "not set" so `.optional()` vars don't trip `.min(1)`.
const rawEnv: Record<string, string | undefined> = {};
for (const [k, v] of Object.entries(process.env)) {
  rawEnv[k] = typeof v === "string" && v.length === 0 ? undefined : v;
}

const parsed = EnvSchema.safeParse(rawEnv);

if (!parsed.success) {
  // Collect required-but-missing vars that should hard-fail in prod.
  const errors = parsed.error.flatten().fieldErrors;
  const message = `Invalid environment variables: ${JSON.stringify(errors, null, 2)}`;

  if (isProd) {
    throw new Error(message);
  } else {
    // In dev/test, warn but keep going with defaults so Prompt 2+ can iterate.
    console.warn(`[env] ${message}`);
  }
}

export const env: Env = parsed.success ? parsed.data : (EnvSchema.parse({}) as Env);

/* -------------------------------------------------------------------------- */
/*  Guard helpers                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Assert at call-site that a specific env var is present.
 * Use at the entry-point of a feature that genuinely depends on the var
 * (e.g., `assertEnv("ANTHROPIC_API_KEY")` inside an AI route handler).
 */
export function assertEnv<K extends keyof Env>(key: K): NonNullable<Env[K]> {
  const value = env[key];
  if (value === undefined || value === null || value === "") {
    throw new Error(
      `Missing required env var: ${String(key)}. See .env.example or CLAUDE.md §9.`
    );
  }
  return value as NonNullable<Env[K]>;
}

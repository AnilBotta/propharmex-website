/**
 * Server-side Supabase client (service-role).
 *
 * Used by:
 *   - apps/web/scripts/ingest-content.mjs (RAG ingestion CLI)
 *   - packages/lib/rag/retrieve.ts (chat endpoint retrieval)
 *
 * Never import this from a client component or a public route — service-role
 * bypasses RLS. RLS-protected access from the browser uses the anon key
 * (separate client, not built here yet).
 *
 * Returns null when env keys are missing so callers can fall through gracefully
 * (CI without secrets passes; the chat endpoint serves a "being provisioned"
 * message instead of crashing).
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { env } from "../env";

let cached: SupabaseClient | null | undefined;

export function getServerSupabase(): SupabaseClient | null {
  if (cached !== undefined) return cached;

  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    cached = null;
    return null;
  }

  cached = createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
  return cached;
}

/**
 * Like getServerSupabase but throws when the client can't be constructed.
 * Use in scripts/jobs where running without a client is a programming error
 * (the ingest CLI uses this — running without keys is intent-breaking).
 */
export function requireServerSupabase(): SupabaseClient {
  const client = getServerSupabase();
  if (!client) {
    throw new Error(
      "Supabase server client unavailable — set NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in .env.local",
    );
  }
  return client;
}

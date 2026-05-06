"use client";

/**
 * Browser-side Supabase auth client for the /dashboard login form.
 * Used only on the client to call `supabase.auth.signOut()` from the
 * sign-out button. The actual sign-in flow goes through the server
 * route `/api/auth/login` so the email allowlist is enforced before
 * any email is dispatched.
 */
import { createBrowserClient } from "@supabase/ssr";

let cached: ReturnType<typeof createBrowserClient> | undefined;

export function getSupabaseBrowserClient() {
  if (cached) return cached;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error(
      "Supabase browser client unavailable — NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY missing",
    );
  }
  cached = createBrowserClient(url, anonKey);
  return cached;
}

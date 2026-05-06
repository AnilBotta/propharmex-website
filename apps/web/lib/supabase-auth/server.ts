/**
 * Server-side Supabase auth client for /dashboard.
 *
 * Wraps `@supabase/ssr` createServerClient with Next 15's async cookies API.
 * This is the AUTH client (uses anon key + user session cookies); it is
 * separate from `@propharmex/lib/supabase` which is the SERVICE-ROLE client
 * used for backend writes that bypass RLS.
 *
 * Usage in a server component / route handler:
 *   const supabase = await createSupabaseServerClient();
 *   const { data: { user } } = await supabase.auth.getUser();
 */
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

import { env } from "@propharmex/lib";

interface CookieToSet {
  name: string;
  value: string;
  options: CookieOptions;
}

export async function createSupabaseServerClient() {
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error(
      "Supabase auth client unavailable — set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local",
    );
  }
  const cookieStore = await cookies();
  return createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          // In Server Components, setAll is a no-op (cookies are read-only
          // in that context). Route handlers and middleware get a working
          // setAll. The library accepts the no-op gracefully.
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Server Component context — ignore.
          }
        },
      },
    },
  );
}

/**
 * Resolve the currently logged-in user, with allowlist enforcement.
 * Returns the email if the user is authenticated AND in
 * DASHBOARD_ALLOWED_EMAILS. Returns null otherwise.
 *
 * Tip: pages should call this and `redirect("/dashboard/login")` on null.
 */
export async function getDashboardUserEmail(): Promise<string | null> {
  let supabase;
  try {
    supabase = await createSupabaseServerClient();
  } catch {
    return null;
  }
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user?.email) return null;
  if (!isAllowedEmail(user.email)) return null;
  return user.email;
}

/**
 * Comma-separated env-var allowlist. Returns false when the env is unset
 * (fail closed).
 */
export function isAllowedEmail(email: string): boolean {
  const list = env.DASHBOARD_ALLOWED_EMAILS;
  if (!list) return false;
  const target = email.trim().toLowerCase();
  return list
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
    .includes(target);
}

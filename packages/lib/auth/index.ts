/**
 * Deprecated — replaced by Supabase Auth.
 *
 * The dashboard's auth flow now uses Supabase's email magic link
 * (`signInWithOtp`) plus the `@supabase/ssr` cookie adapter. Server-side
 * access checks live at:
 *   apps/web/lib/supabase-auth/server.ts → getDashboardUserEmail()
 *
 * This module is kept as an empty stub so any stale import would surface
 * as a runtime error rather than a silent regression. The legacy
 * `auth_sessions` table introduced in 0006_auth_sessions.sql is no
 * longer written to or read; a follow-up migration can drop it cleanly.
 */
export const DEPRECATED =
  "Use `getDashboardUserEmail()` from apps/web/lib/supabase-auth/server.ts instead.";

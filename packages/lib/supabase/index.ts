/**
 * @propharmex/lib/supabase — Supabase client public exports.
 *
 * Server-side clients only at this layer. Browser-side anon clients are added
 * here when a feature actually needs them (no current consumer).
 */
export { getServerSupabase, requireServerSupabase } from "./server";

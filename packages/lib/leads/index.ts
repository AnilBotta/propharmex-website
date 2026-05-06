/**
 * Lead capture helper — single write path used by every form/API surface
 * that captures contact info on the marketing site.
 *
 * Why centralized:
 *  - One place to denormalize `email_domain` from `email`.
 *  - One place to log structured events (PII-redacted).
 *  - One place to evolve the schema (e.g., add UTM fields) without touching
 *    every API route.
 *
 * Best-effort posture: if Supabase isn't configured (CI without secrets, dev
 * without `.env.local`), `getServerSupabase()` returns null and this helper
 * logs a warning + returns `{ persisted: false }` instead of throwing. The
 * caller treats lead-DB writes as a side effect, not a load-bearing step
 * (Resend send is the load-bearing step today). This mirrors the pattern in
 * `apps/web/app/api/ai/scoping/submit/route.ts`.
 */
import { getServerSupabase } from "../supabase/server";
import { log } from "../log";

import { LeadInsertSchema, type LeadInsert } from "./types";

export * from "./types";

export interface InsertLeadResult {
  persisted: boolean;
  /** Returned when persisted = true. */
  id?: string;
}

/**
 * Persist a lead to public.leads. Returns synchronously-resolvable result.
 * Never throws — errors are logged via `log.error` and surface as
 * `{ persisted: false }`.
 */
export async function insertLead(input: LeadInsert): Promise<InsertLeadResult> {
  // Validate at the boundary so a bad call from a route doesn't poison the
  // table. Zod errors here = developer bug, not user input bug.
  const parsed = LeadInsertSchema.safeParse(input);
  if (!parsed.success) {
    log.error("leads.insert.invalid_input", {
      source: input.source,
      issues: parsed.error.issues.map((i) => ({
        path: i.path.join("."),
        code: i.code,
      })),
    });
    return { persisted: false };
  }
  const data = parsed.data;

  const sb = getServerSupabase();
  if (!sb) {
    log.warn("leads.insert.supabase_unavailable", {
      source: data.source,
      emailDomain: emailDomain(data.email),
    });
    return { persisted: false };
  }

  const row = {
    source: data.source,
    email: data.email,
    email_domain: emailDomain(data.email),
    contact_name: data.contactName ?? null,
    company: data.company ?? null,
    role: data.role ?? null,
    region: data.region ?? null,
    service: data.service ?? null,
    dosage_form: data.dosageForm ?? null,
    stage: data.stage ?? null,
    message: data.message ?? null,
    payload: data.payload ?? {},
    utm_source: data.utmSource ?? null,
    utm_medium: data.utmMedium ?? null,
    utm_campaign: data.utmCampaign ?? null,
    referrer: data.referrer ?? null,
    ip_country: data.ipCountry ?? null,
    posthog_distinct_id: data.posthogDistinctId ?? null,
  };

  const { data: inserted, error } = await sb
    .from("leads")
    .insert(row)
    .select("id")
    .single();

  if (error) {
    log.error("leads.insert.db_error", {
      source: data.source,
      emailDomain: emailDomain(data.email),
      message: error.message,
    });
    return { persisted: false };
  }

  log.info("leads.insert.ok", {
    source: data.source,
    emailDomain: emailDomain(data.email),
    region: data.region ?? "unspecified",
    hasMessage: typeof data.message === "string" && data.message.length > 0,
  });

  return { persisted: true, id: inserted.id as string };
}

/**
 * Extract attribution fields from a `Request`. Pure helper so routes don't
 * each reimplement the same header / referer / UTM parsing.
 *
 * Pass the request and (optionally) a parsed body that may contain UTM /
 * posthog fields. The returned object is shaped to merge directly into a
 * `LeadInsert`.
 */
export function extractAttribution(
  req: Request,
  bodyExtras?: {
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    referrer?: string;
    posthogDistinctId?: string;
  },
): Pick<
  LeadInsert,
  | "utmSource"
  | "utmMedium"
  | "utmCampaign"
  | "referrer"
  | "ipCountry"
  | "posthogDistinctId"
> {
  const headerCountry = req.headers.get("x-vercel-ip-country") ?? undefined;
  const ipCountry =
    headerCountry && /^[A-Z]{2}$/.test(headerCountry) ? headerCountry : undefined;
  const headerReferer = req.headers.get("referer") ?? undefined;

  return {
    utmSource: trim(bodyExtras?.utmSource, 120),
    utmMedium: trim(bodyExtras?.utmMedium, 120),
    utmCampaign: trim(bodyExtras?.utmCampaign, 120),
    referrer: trim(bodyExtras?.referrer ?? headerReferer, 500),
    ipCountry,
    posthogDistinctId: trim(bodyExtras?.posthogDistinctId, 120),
  };
}

function emailDomain(value: string): string {
  const at = value.lastIndexOf("@");
  return at >= 0 ? value.slice(at + 1).toLowerCase() : "unknown";
}

function trim(value: string | undefined, max: number): string | undefined {
  if (!value) return undefined;
  const t = value.trim();
  if (t.length === 0) return undefined;
  return t.length > max ? t.slice(0, max) : t;
}

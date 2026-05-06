/**
 * Lead capture types — shared across the website (`/api/*` writers) and
 * the dashboard (`/api/dashboard/leads` reader).
 *
 * The schema mirrors public.leads in supabase/migrations/0005_leads.sql.
 * Keep both in sync; the table check constraints are the source of truth.
 */
import { z } from "zod";

export const LEAD_SOURCES = [
  "contact",
  "whitepaper",
  "newsletter",
  "scoping",
  "del_readiness",
  "dosage_matcher",
  "concierge",
] as const;

export type LeadSource = (typeof LEAD_SOURCES)[number];

export const LEAD_STATUSES = ["new", "contacted", "won", "lost"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const LEAD_NOTE_KINDS = [
  "note",
  "status_change",
  "email_sent",
  "email_drafted",
] as const;
export type LeadNoteKind = (typeof LEAD_NOTE_KINDS)[number];

/**
 * Input shape for `insertLead()`. Every field other than `source` and `email`
 * is optional — surfaces capture different subsets of fields.
 */
export const LeadInsertSchema = z.object({
  source: z.enum(LEAD_SOURCES),
  email: z.string().email().max(254),
  contactName: z.string().max(200).optional(),
  company: z.string().max(200).optional(),
  role: z.string().max(80).optional(),
  region: z.string().max(40).optional(),
  service: z.string().max(80).optional(),
  dosageForm: z.string().max(80).optional(),
  stage: z.string().max(80).optional(),
  message: z.string().max(8000).optional(),
  /** Source-specific structured blob — scope summary, whitepaper slug, etc. */
  payload: z.record(z.unknown()).optional(),
  /** Attribution — read from request headers / referer / UTM params. */
  utmSource: z.string().max(120).optional(),
  utmMedium: z.string().max(120).optional(),
  utmCampaign: z.string().max(120).optional(),
  referrer: z.string().max(500).optional(),
  ipCountry: z.string().length(2).optional(),
  posthogDistinctId: z.string().max(120).optional(),
});

export type LeadInsert = z.infer<typeof LeadInsertSchema>;

export interface LeadRow {
  id: string;
  source: LeadSource;
  status: LeadStatus;
  email: string;
  email_domain: string;
  contact_name: string | null;
  company: string | null;
  role: string | null;
  region: string | null;
  service: string | null;
  dosage_form: string | null;
  stage: string | null;
  message: string | null;
  payload: Record<string, unknown>;
  owner_email: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  referrer: string | null;
  ip_country: string | null;
  posthog_distinct_id: string | null;
  created_at: string;
  contacted_at: string | null;
  closed_at: string | null;
  updated_at: string;
}

export interface LeadNoteRow {
  id: string;
  lead_id: string;
  author_email: string;
  body: string;
  kind: LeadNoteKind;
  created_at: string;
}

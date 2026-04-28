/**
 * Strongly-typed scope summary for the Project Scoping Assistant (Prompt 19).
 *
 * `ScopeSummarySchema` is the single source of truth — it serves three masters:
 *
 *   1. The AI SDK's `tool({ parameters })` definition in the route handler.
 *      The model is required to fill this exact shape via tool calling.
 *   2. The client-side preview card that renders the structured output and
 *      lets the user edit it inline before submitting.
 *   3. The Supabase `scoping_sessions.scope_summary jsonb` payload (PR-B).
 *
 * Keeping all three locked to one Zod schema means a model that hallucinates
 * a field the server can't validate fails fast at the route boundary, not in
 * the UI three steps later.
 */
import { z } from "zod";

/* -------------------------------------------------------------------------- */
/*  Enums                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Canonical Propharmex service pillars. Mirrors `pillarOptions` in
 * `apps/studio/schemas/documents/service.ts` — kept as a static literal here
 * (not a runtime Sanity query) so the Zod schema is statically verifiable
 * and the route stays Edge-runtime-safe.
 *
 * If a new pillar is added in Sanity, this list must be updated to match —
 * code review will catch the divergence.
 */
export const SERVICE_PILLARS = [
  "development",
  "analytical",
  "regulatory",
  "distribution",
  "quality",
] as const;

export const ServicePillarSchema = z.enum(SERVICE_PILLARS);
export type ServicePillar = z.infer<typeof ServicePillarSchema>;

/**
 * Coarse development stage. The user may sit anywhere on this axis depending
 * on whether they're a sponsor with a candidate molecule (preformulation) or
 * a sponsor with an approved product needing a Canadian distribution surface
 * (commercial).
 */
export const DEVELOPMENT_STAGES = [
  "preformulation",
  "formulation",
  "method-development",
  "stability",
  "clinical-supplies",
  "scaleup",
  "commercial",
] as const;

export const DevelopmentStageSchema = z.enum(DEVELOPMENT_STAGES);
export type DevelopmentStage = z.infer<typeof DevelopmentStageSchema>;

/* -------------------------------------------------------------------------- */
/*  Sub-shapes                                                                 */
/* -------------------------------------------------------------------------- */

export const RiskSchema = z.object({
  severity: z.enum(["low", "medium", "high"]),
  description: z.string().min(4).max(280),
});
export type Risk = z.infer<typeof RiskSchema>;

export const PhaseSchema = z.object({
  name: z.string().min(2).max(80),
  durationWeeks: z.number().int().min(1).max(260),
  milestones: z.array(z.string().min(2).max(160)).min(1).max(8),
});
export type Phase = z.infer<typeof PhaseSchema>;

export const TimelineRangeSchema = z
  .object({
    min: z.number().int().min(1).max(260),
    max: z.number().int().min(1).max(260),
  })
  .refine((v) => v.min <= v.max, {
    message: "ballparkTimelineWeeks.min must be <= max",
    path: ["min"],
  });
export type TimelineRange = z.infer<typeof TimelineRangeSchema>;

/* -------------------------------------------------------------------------- */
/*  ScopeSummary                                                               */
/* -------------------------------------------------------------------------- */

export const ScopeSummarySchema = z.object({
  /** One-paragraph plain-language objective of the engagement. */
  objectives: z.string().min(20).max(800),

  /**
   * Free-text array of dosage forms (oral solids, oral liquids, sterile
   * injectables, ophthalmics, topicals, etc.). Free-text rather than enum
   * because long-tail forms (intravesical, sublingual films, depot
   * implants) shouldn't fail validation just because we haven't enumerated
   * them yet.
   */
  dosageForms: z.array(z.string().min(2).max(80)).min(1).max(10),

  /** Coarse stage; informs deliverable and timeline shape. */
  developmentStage: DevelopmentStageSchema,

  /**
   * What Propharmex would deliver — e.g., "ICH-aligned stability protocol",
   * "method validation report", "DMF Module 3 sections". Plain-language.
   */
  deliverables: z.array(z.string().min(4).max(240)).min(1).max(12),

  /** Stated assumptions the rest of the scope rests on. */
  assumptions: z.array(z.string().min(4).max(240)).min(0).max(10),

  /** Risks with severity. Empty list is allowed for well-bounded scopes. */
  risks: z.array(RiskSchema).min(0).max(10),

  /** Phased plan with milestones. At least one phase. */
  phases: z.array(PhaseSchema).min(1).max(8),

  /** Ballpark timeline range in weeks. Must satisfy min <= max. */
  ballparkTimelineWeeks: TimelineRangeSchema,

  /** Recommended Propharmex service pillars. At least one. */
  recommendedServices: z.array(ServicePillarSchema).min(1).max(5),
});

export type ScopeSummary = z.infer<typeof ScopeSummarySchema>;

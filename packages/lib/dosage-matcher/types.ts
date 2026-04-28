/**
 * Type system for the Dosage Form Capability Matcher (Prompt 21).
 *
 * Three concept layers:
 *
 *   1. **Input** — what the user submits. Either a free-text description
 *      OR structured filters (API type, indication, release profile,
 *      patient population, development stage). Both paths are valid.
 *
 *   2. **SOP capability** — the canonical dosage-form × capability
 *      mapping that Propharmex publishes. Fields mirror
 *      `apps/studio/schemas/documents/sopCapability.ts` (the actual
 *      schema, not the drifted parser at `packages/lib/sanity/parsers.ts`
 *      — to be cleaned up in Prompt 22).
 *
 *   3. **Recommendation** — the structured output. Three-form list with
 *      qualitative tier + rationale from the model, plus deterministic
 *      capability-coverage % computed in `coverage.ts`.
 *
 * One Zod schema underpins all three so the tool-call args, the
 * server-side scorer, and the client preview never disagree on shape.
 */
import { z } from "zod";

/* -------------------------------------------------------------------------- */
/*  Enums (mirror apps/studio/schemas/documents/sopCapability.ts)              */
/* -------------------------------------------------------------------------- */

/**
 * The 13 dosage-form values from the Sanity schema. Hardcoded here as a
 * static const so the route is Edge-runtime-safe and the Zod schema is
 * statically verifiable. Keep in sync with `dosageFormOptions`.
 */
export const DOSAGE_FORMS = [
  "oral-solid",
  "oral-liquid",
  "topical",
  "injectable-lyo",
  "injectable-liquid",
  "ophthalmic",
  "inhalation",
  "transdermal",
  "suppository",
  "otic",
  "nasal",
  "soft-gel",
  "hard-cap",
] as const;

export const DosageFormSchema = z.enum(DOSAGE_FORMS);
export type DosageForm = z.infer<typeof DosageFormSchema>;

/**
 * The 10 Propharmex capability values. Mirror `capabilityOptions` in the
 * Sanity schema. Used both for the input filter (what the user wants
 * done) and for the output coverage check (what Propharmex offers per
 * dosage form).
 */
export const CAPABILITIES = [
  "formulation",
  "analytical",
  "stability",
  "process-validation",
  "scale-up",
  "regulatory-us",
  "regulatory-ca",
  "regulatory-eu",
  "regulatory-in",
  "commercial",
] as const;

export const CapabilitySchema = z.enum(CAPABILITIES);
export type Capability = z.infer<typeof CapabilitySchema>;

/* -------------------------------------------------------------------------- */
/*  Input filters (optional — the user can submit free text only)              */
/* -------------------------------------------------------------------------- */

export const RELEASE_PROFILES = [
  "immediate-release",
  "modified-release",
  "extended-release",
  "delayed-release",
  "controlled-release",
  "depot",
  "not-sure",
] as const;
export const ReleaseProfileSchema = z.enum(RELEASE_PROFILES);
export type ReleaseProfile = z.infer<typeof ReleaseProfileSchema>;

export const PATIENT_POPULATIONS = [
  "adult",
  "geriatric",
  "pediatric",
  "neonatal",
  "veterinary",
  "mixed",
] as const;
export const PatientPopulationSchema = z.enum(PATIENT_POPULATIONS);
export type PatientPopulation = z.infer<typeof PatientPopulationSchema>;

export const API_TYPES = [
  "small-molecule",
  "peptide",
  "biologic",
  "natural-product",
  "device-combination",
  "not-sure",
] as const;
export const ApiTypeSchema = z.enum(API_TYPES);
export type ApiType = z.infer<typeof ApiTypeSchema>;

export const DEVELOPMENT_STAGES = [
  "discovery",
  "preformulation",
  "formulation",
  "clinical",
  "scaleup",
  "commercial",
] as const;
export const DevelopmentStageSchema = z.enum(DEVELOPMENT_STAGES);
export type DevelopmentStage = z.infer<typeof DevelopmentStageSchema>;

export const MatcherInputSchema = z.object({
  /** Free-text description of the molecule / programme. */
  description: z.string().min(8).max(2000).optional(),
  /** Optional structured filters. Empty fields are ignored by the model. */
  filters: z
    .object({
      apiType: ApiTypeSchema.optional(),
      indicationArea: z.string().max(120).optional(),
      releaseProfile: ReleaseProfileSchema.optional(),
      patientPopulation: PatientPopulationSchema.optional(),
      developmentStage: DevelopmentStageSchema.optional(),
    })
    .optional(),
});
export type MatcherInput = z.infer<typeof MatcherInputSchema>;

/* -------------------------------------------------------------------------- */
/*  SOP capability                                                              */
/* -------------------------------------------------------------------------- */

export const SopCapabilitySchema = z.object({
  dosageForm: DosageFormSchema,
  /** What Propharmex can do for this dosage form. */
  capabilities: z.array(CapabilitySchema).min(1),
  /** Optional batch-size envelope. Surfaced in mismatch flags when the
      sponsor's volume sits outside it. */
  batchSizeMinKg: z.number().min(0).optional(),
  batchSizeMaxKg: z.number().min(0).optional(),
  /** Free-text notes shown to the model (and optionally surfaced in
      results). */
  notes: z.string().max(480).optional(),
});
export type SopCapability = z.infer<typeof SopCapabilitySchema>;

/* -------------------------------------------------------------------------- */
/*  Recommendation                                                              */
/* -------------------------------------------------------------------------- */

export const FitTierSchema = z.enum(["high", "medium", "low"]);
export type FitTier = z.infer<typeof FitTierSchema>;

/**
 * Per-form match the model emits. The deterministic coverage block is
 * appended server-side in `coverage.ts` before the payload reaches the
 * client.
 */
export const ModelMatchSchema = z.object({
  dosageForm: DosageFormSchema,
  fitTier: FitTierSchema,
  /** 1–3 sentences. Plain language, anti-hype. */
  rationale: z.string().min(20).max(720),
  /** Caveats the user should be aware of (e.g., "extreme cold-chain
      requirements may extend timeline"). */
  mismatchFlags: z.array(z.string().min(4).max(240)).max(6).default([]),
  /** Free-text titles the model recalls. Not authoritative — case
      studies are surfaced via the live Sanity-backed list separately
      in the UI. Capped to keep token use bounded. */
  relevantCaseStudyTitles: z
    .array(z.string().min(2).max(160))
    .max(4)
    .default([]),
  /** 1–4 short imperative bullets. */
  suggestedNextSteps: z.array(z.string().min(4).max(240)).min(1).max(4),
});
export type ModelMatch = z.infer<typeof ModelMatchSchema>;

/**
 * Recommendation payload the model fills via tool calling. The server
 * appends `capabilityCoveragePct`, `capabilitiesCovered`,
 * `capabilitiesMissing` to each match before sending to the client.
 */
export const ModelRecommendationSchema = z.object({
  /** What the model thinks the user needs to deliver this programme. */
  inferredRequirements: z.object({
    capabilities: z.array(CapabilitySchema).min(1).max(10),
    /** 1–3 sentence summary of the considerations driving the picks. */
    dosageFormConsiderations: z.string().min(20).max(720),
  }),
  /** Top 3 (sometimes 1–3) recommended dosage forms, sorted by fit. */
  matches: z.array(ModelMatchSchema).min(1).max(3),
});
export type ModelRecommendation = z.infer<typeof ModelRecommendationSchema>;

/**
 * Final per-match payload the client renders — model output enriched
 * with the deterministic capability coverage.
 */
export const EnrichedMatchSchema = ModelMatchSchema.extend({
  /** Deterministic % of inferred requirements that Propharmex's
      sopCapability for this dosage form covers. 0 when the form isn't
      in our sopCapability list. */
  capabilityCoveragePct: z.number().int().min(0).max(100),
  capabilitiesCovered: z.array(CapabilitySchema),
  capabilitiesMissing: z.array(CapabilitySchema),
});
export type EnrichedMatch = z.infer<typeof EnrichedMatchSchema>;

export const RecommendationSchema = z.object({
  inferredRequirements: ModelRecommendationSchema.shape.inferredRequirements,
  matches: z.array(EnrichedMatchSchema).min(1).max(3),
});
export type Recommendation = z.infer<typeof RecommendationSchema>;

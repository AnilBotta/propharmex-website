/**
 * Public surface of the dosage-matcher subpackage.
 *
 *   import { dosageMatcher } from "@propharmex/lib";
 *   dosageMatcher.MatcherInputSchema
 *   dosageMatcher.enrichRecommendation(rec)
 *
 * Or directly:
 *   import { DOSAGE_FORMS } from "@propharmex/lib/dosage-matcher";
 */
export {
  DOSAGE_FORMS,
  CAPABILITIES,
  RELEASE_PROFILES,
  PATIENT_POPULATIONS,
  API_TYPES,
  DEVELOPMENT_STAGES,
  DosageFormSchema,
  CapabilitySchema,
  ReleaseProfileSchema,
  PatientPopulationSchema,
  ApiTypeSchema,
  DevelopmentStageSchema,
  MatcherInputSchema,
  SopCapabilitySchema,
  FitTierSchema,
  ModelMatchSchema,
  ModelRecommendationSchema,
  EnrichedMatchSchema,
  RecommendationSchema,
  type DosageForm,
  type Capability,
  type ReleaseProfile,
  type PatientPopulation,
  type ApiType,
  type DevelopmentStage,
  type MatcherInput,
  type SopCapability,
  type FitTier,
  type ModelMatch,
  type ModelRecommendation,
  type EnrichedMatch,
  type Recommendation,
} from "./types";

export {
  DEFAULT_SOP_CAPABILITIES,
  findSopCapability,
} from "./sopCapabilities";

export {
  computeCoverage,
  enrichRecommendation,
  type CoverageResult,
} from "./coverage";

export {
  SAMPLE_MATCHER_INPUT,
  SAMPLE_MATCHER_RECOMMENDATION,
} from "./sample";

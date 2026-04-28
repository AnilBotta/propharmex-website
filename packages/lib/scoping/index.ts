/**
 * Public surface of the scoping subpackage. Imported as
 * `import * as scoping from "@propharmex/lib"` (via the namespace re-export
 * in the package barrel) or directly via `@propharmex/lib/scoping`.
 */
export {
  SERVICE_PILLARS,
  DEVELOPMENT_STAGES,
  ServicePillarSchema,
  DevelopmentStageSchema,
  RiskSchema,
  PhaseSchema,
  TimelineRangeSchema,
  ScopeSummarySchema,
  type ServicePillar,
  type DevelopmentStage,
  type Risk,
  type Phase,
  type TimelineRange,
  type ScopeSummary,
} from "./types";

export { SAMPLE_SCOPE } from "./sample";

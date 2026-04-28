/**
 * Hardcoded SOP capability fallback for the Dosage Form Matcher
 * (Prompt 21 PR-A).
 *
 * Why hardcoded for v1: the Sanity `sopCapability` document type exists
 * (`apps/studio/schemas/documents/sopCapability.ts`) but the
 * `packages/lib/sanity/parsers.ts` Zod parser is drifted — it expects
 * fields the schema doesn't have (`category`, `equipment`,
 * `applicableServices`). A focused Sanity-backed fetcher is deferred
 * until Prompt 22 cleans up that drift. Until then, this list ships the
 * tool with a complete, accurate dosage-form × capability mapping that
 * the regulatory lead has signed off on.
 *
 * Each entry mirrors the shape `apps/studio/schemas/documents/sopCapability.ts`
 * publishes — `dosageForm`, `capabilities[]`, optional batch-size
 * envelope, optional notes. Coverage scoring in `coverage.ts` uses these
 * `capabilities[]` arrays as the authoritative "what we offer per form"
 * mapping.
 *
 * Voice: terse, factual, anti-hype. Notes describe the operational
 * envelope, not a sales pitch.
 */
import type { SopCapability } from "./types";

export const DEFAULT_SOP_CAPABILITIES: SopCapability[] = [
  {
    dosageForm: "oral-solid",
    capabilities: [
      "formulation",
      "analytical",
      "stability",
      "process-validation",
      "scale-up",
      "regulatory-us",
      "regulatory-ca",
      "regulatory-eu",
      "commercial",
    ],
    batchSizeMinKg: 1,
    batchSizeMaxKg: 250,
    notes:
      "End-to-end programmes for immediate-release and modified-release tablets. Analytical method validation and 12-month stability run from Mississauga.",
  },
  {
    dosageForm: "hard-cap",
    capabilities: [
      "formulation",
      "analytical",
      "stability",
      "process-validation",
      "scale-up",
      "regulatory-us",
      "regulatory-ca",
      "regulatory-eu",
      "commercial",
    ],
    batchSizeMinKg: 1,
    batchSizeMaxKg: 200,
    notes:
      "Hard-shell capsule formulation, encapsulation, and validation. Suited for content uniformity-sensitive APIs and bead-loaded extended-release.",
  },
  {
    dosageForm: "soft-gel",
    capabilities: ["formulation", "analytical", "stability", "regulatory-us", "regulatory-ca"],
    notes:
      "Soft-gel development partnerships only. Manufacturing through a named third party; QA, analytical, and regulatory packages remain in scope.",
  },
  {
    dosageForm: "oral-liquid",
    capabilities: [
      "formulation",
      "analytical",
      "stability",
      "process-validation",
      "scale-up",
      "regulatory-us",
      "regulatory-ca",
    ],
    batchSizeMinKg: 5,
    batchSizeMaxKg: 500,
    notes:
      "Solutions, suspensions, and syrups. Includes preservative-effectiveness testing and microbial limits where required.",
  },
  {
    dosageForm: "topical",
    capabilities: [
      "formulation",
      "analytical",
      "stability",
      "regulatory-us",
      "regulatory-ca",
    ],
    batchSizeMinKg: 5,
    batchSizeMaxKg: 200,
    notes:
      "Creams, ointments, gels. In-vitro release testing on request. Sterile topicals are out of scope.",
  },
  {
    dosageForm: "ophthalmic",
    capabilities: ["formulation", "analytical", "stability", "regulatory-ca"],
    notes:
      "Ophthalmic development is partner-supported. Manufacturing requires a sterile fill-finish partner; we run the analytical and regulatory packages.",
  },
  {
    dosageForm: "injectable-liquid",
    capabilities: ["analytical", "stability", "regulatory-ca", "regulatory-us"],
    notes:
      "Injectable liquid analytical and regulatory work; aseptic fill-finish is out of scope and runs through a named CMO partner.",
  },
  {
    dosageForm: "injectable-lyo",
    capabilities: ["analytical", "stability", "regulatory-ca"],
    notes:
      "Lyophilised injectable analytical packages. Lyophilisation cycle development is via a named partner.",
  },
  {
    dosageForm: "transdermal",
    capabilities: ["formulation", "analytical"],
    notes:
      "Patch development feasibility only at present. Membrane and adhesive selection through a named development partner.",
  },
  {
    dosageForm: "inhalation",
    capabilities: ["analytical"],
    notes:
      "Inhalation analytical method support only. We do not develop or manufacture DPI/MDI products in-house.",
  },
  {
    dosageForm: "suppository",
    capabilities: ["formulation", "analytical", "stability"],
    batchSizeMinKg: 2,
    batchSizeMaxKg: 50,
    notes: "Lipophilic and hydrophilic bases. Stability through 24 months at 25 °C / 60% RH.",
  },
  {
    dosageForm: "nasal",
    capabilities: ["formulation", "analytical", "stability"],
    notes: "Aqueous nasal sprays and drops. Device selection through a named partner.",
  },
  {
    dosageForm: "otic",
    capabilities: ["formulation", "analytical", "stability"],
    notes: "Ear drops, suspensions. Stability + analytical packages developed end-to-end.",
  },
];

/**
 * Quick lookup helper. Returns `undefined` when the dosage form is not
 * in the capability list — the route handles that as zero coverage.
 */
export function findSopCapability(
  dosageForm: SopCapability["dosageForm"],
  list: SopCapability[] = DEFAULT_SOP_CAPABILITIES,
): SopCapability | undefined {
  return list.find((sc) => sc.dosageForm === dosageForm);
}

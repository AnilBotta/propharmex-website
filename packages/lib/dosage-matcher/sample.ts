/**
 * Pre-canned input + recommendation for the Dosage Form Matcher's
 * "See a sample" affordance (Prompt 21 PR-A).
 *
 * Loaded by the client without hitting the model — gives a first-time
 * visitor a concrete view of the deliverable shape before they invest
 * time describing their programme.
 *
 * Anonymized archetype: a US generic sponsor scoping a small-molecule
 * orally-administered programme with an ANDA destination. Voice is
 * anti-hype; numbers are operational ranges, not commitments.
 */
import { enrichRecommendation } from "./coverage";
import type { MatcherInput, ModelRecommendation, Recommendation } from "./types";

export const SAMPLE_MATCHER_INPUT: MatcherInput = {
  description:
    "Small-molecule API, BCS Class II, indicated for chronic adult dosing. Plan to file as a US ANDA with a Canadian sponsor-of-record. Need stability and method validation; want to evaluate immediate-release tablet vs. hard capsule before committing to a formulation track.",
  filters: {
    apiType: "small-molecule",
    indicationArea: "Cardiovascular",
    releaseProfile: "immediate-release",
    patientPopulation: "adult",
    developmentStage: "preformulation",
  },
};

const SAMPLE_MODEL_RECOMMENDATION: ModelRecommendation = {
  inferredRequirements: {
    capabilities: [
      "formulation",
      "analytical",
      "stability",
      "regulatory-us",
      "regulatory-ca",
    ],
    dosageFormConsiderations:
      "BCS Class II with adult chronic dosing favours immediate-release oral solids — tablets first, hard capsules as the close runner. Soft gels are viable when API solubility benefits from a lipid vehicle, but development partnership is required.",
  },
  matches: [
    {
      dosageForm: "oral-solid",
      fitTier: "high",
      rationale:
        "Immediate-release tablets are the most direct route for a BCS Class II small-molecule with chronic adult dosing. End-to-end coverage at Mississauga: formulation, analytical method validation, ICH stability, and ANDA-aligned regulatory filings.",
      mismatchFlags: [],
      relevantCaseStudyTitles: [
        "ANDA tablet programme with 12-month stability for a US generic sponsor",
      ],
      suggestedNextSteps: [
        "Confirm API physicochemical profile and solubility envelope",
        "Schedule a feasibility review covering excipient compatibility",
        "Request a Mississauga site visit during the development phase",
      ],
    },
    {
      dosageForm: "hard-cap",
      fitTier: "high",
      rationale:
        "Hard capsules are the close alternative when content uniformity is a concern or extended-release beads are on the roadmap. Same coverage envelope as oral solids in our Mississauga programme.",
      mismatchFlags: [
        "Bead-loaded extended-release adds a development phase compared to a straight tablet",
      ],
      relevantCaseStudyTitles: [],
      suggestedNextSteps: [
        "Run a content-uniformity feasibility study before locking the form decision",
      ],
    },
    {
      dosageForm: "soft-gel",
      fitTier: "low",
      rationale:
        "Worth keeping on the table only if API solubility argues for a lipid vehicle. Soft-gel manufacturing runs through a named partner; we own the analytical and regulatory packages.",
      mismatchFlags: [
        "Manufacturing partner introduction adds 4–8 weeks to the timeline",
        "Limited fit for chronic-dosing tablet programmes",
      ],
      relevantCaseStudyTitles: [],
      suggestedNextSteps: [
        "Compare oral-solid bioavailability data before opening soft-gel evaluation",
      ],
    },
  ],
};

export const SAMPLE_MATCHER_RECOMMENDATION: Recommendation =
  enrichRecommendation(SAMPLE_MODEL_RECOMMENDATION);

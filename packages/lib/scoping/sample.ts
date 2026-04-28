/**
 * Pre-canned `ScopeSummary` for the "See a sample" button on the
 * Project Scoping Assistant page (Prompt 19).
 *
 * Loaded by the client without hitting the model — gives a first-time
 * visitor a concrete view of the deliverable before they invest five
 * minutes in the conversational intake.
 *
 * Anonymized sponsor archetype: a US generic sponsor with a Health Canada
 * DEL gap, scoping a stability + analytical method-validation programme on
 * an oral solid. Anti-hype voice. No regulatory promise. Numbers are
 * service-standard ranges, not commitments.
 */
import type { ScopeSummary } from "./types";

export const SAMPLE_SCOPE: ScopeSummary = {
  objectives:
    "Stand up an ICH-aligned 12-month stability programme and complete analytical method validation for an oral solid (immediate-release tablet) that the sponsor plans to file as an ANDA with the US FDA. Health Canada DEL coverage is required so the Canadian sponsor-of-record sits with Propharmex.",
  dosageForms: ["Oral solid — immediate-release tablet"],
  developmentStage: "stability",
  deliverables: [
    "ICH Q1A(R2)-aligned stability protocol covering 25°C/60% RH and 40°C/75% RH",
    "Analytical method validation report (assay, content uniformity, dissolution, related substances)",
    "Reference standard qualification dossier",
    "DMF Module 3 sections covering S.4 control of drug substance and P.5 control of drug product",
    "Stability summary tables suitable for ANDA submission",
  ],
  assumptions: [
    "Sponsor supplies API and finished-product samples that meet inbound QC acceptance",
    "Reference standard is available in sufficient quantity for the validation campaign",
    "No reformulation work is required during the stability window",
    "Propharmex acts as Canadian sponsor-of-record under our Mississauga DEL",
  ],
  risks: [
    {
      severity: "medium",
      description:
        "If method robustness data shows higher-than-expected variability, the validation campaign may extend by 2–4 weeks.",
    },
    {
      severity: "low",
      description:
        "Stability storage conditions are dependent on the chamber availability window; minor scheduling variance possible.",
    },
    {
      severity: "high",
      description:
        "An adverse stability signal (e.g., out-of-trend impurity growth) would trigger an investigation that could materially shift the timeline.",
    },
  ],
  phases: [
    {
      name: "Onboarding + tech transfer",
      durationWeeks: 4,
      milestones: [
        "Two-way NDA + master services agreement signed",
        "API and finished-product samples received and inbound QC complete",
        "Method transfer kickoff with the sponsor's analytical team",
      ],
    },
    {
      name: "Method validation",
      durationWeeks: 10,
      milestones: [
        "Validation protocol approved by sponsor",
        "All five validation parameters complete (specificity, linearity, accuracy, precision, robustness)",
        "Validation report issued",
      ],
    },
    {
      name: "Stability programme — execution",
      durationWeeks: 52,
      milestones: [
        "T0 baseline analysis complete",
        "All scheduled pulls executed at month 1, 3, 6, 9, 12",
        "Interim stability summary at month 6",
        "Final stability report issued",
      ],
    },
    {
      name: "DMF section drafting + handoff",
      durationWeeks: 6,
      milestones: [
        "S.4 and P.5 draft sections issued for sponsor review",
        "Sponsor comments incorporated and final sections delivered",
      ],
    },
  ],
  ballparkTimelineWeeks: { min: 60, max: 72 },
  recommendedServices: ["analytical", "regulatory", "quality"],
};

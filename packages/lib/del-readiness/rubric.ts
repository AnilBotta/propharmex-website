/**
 * Default Health Canada DEL Readiness rubric (Prompt 20 PR-A).
 *
 * 13 questions across 7 categories — covers the substantive gates Health
 * Canada inspects against the Food and Drug Regulations Part C, Division
 * 1A, GUI-0001 (Canadian cGMP), and PIC/S PE 008 (Site Master File).
 *
 * Voice: anti-hype, regulatory-precise. We do NOT prescribe an outcome —
 * the answer wording is "documented", "in progress", "not yet" so the
 * user is grading themselves against a real-world capability spectrum,
 * not a binary "are you ready / no".
 *
 * Sourcing rules (CLAUDE.md §4.7): every question's regulatory anchor
 * lives in `docs/regulatory-lexicon.md`. If a question references a
 * specific guideline or regulation, the `helpText` names it for the user
 * — primary-source URLs are deferred to the results-screen disclaimer
 * + the PDF report (PR-B).
 *
 * Migration to Sanity: at Prompt 22 a `delReadinessRubric` document type
 * is added to the studio. The fetcher in `packages/lib/sanity/` will
 * project the same shape and fall back to this constant. No code change
 * needed at switchover.
 */
import type { Rubric } from "./types";

export const DEFAULT_RUBRIC: Rubric = {
  version: "2026-04-28",
  categories: [
    {
      id: "facility",
      label: "Facility",
      description:
        "Physical site: GMP-grade premises, qualified equipment, environmental controls.",
      weight: 20,
    },
    {
      id: "qms",
      label: "Quality management system",
      description:
        "Documented QMS aligned to GUI-0001 cGMP — change control, deviations, CAPA.",
      weight: 18,
    },
    {
      id: "personnel",
      label: "Personnel",
      description:
        "Designated Senior Person responsible for Quality plus qualified technical staff.",
      weight: 14,
    },
    {
      id: "site-master-file",
      label: "Site Master File",
      description:
        "PIC/S PE 008-aligned Site Master File describing the establishment's GMP-related activities.",
      weight: 12,
    },
    {
      id: "gdp",
      label: "Good Distribution Practices",
      description:
        "GDP-aligned distribution procedures and trained warehouse staff, per GUI-0069.",
      weight: 14,
    },
    {
      id: "import-export",
      label: "Import / export",
      description:
        "Import-of-record procedures, customs brokerage, and export documentation.",
      weight: 12,
    },
    {
      id: "cold-chain",
      label: "Cold chain",
      description:
        "Validated cold-chain SOPs and qualified equipment, where the product scope demands it.",
      weight: 10,
    },
  ],
  questions: [
    /* -- Facility ----------------------------------------------------- */
    {
      id: "facility.site",
      category: "facility",
      prompt:
        "Do you operate a Canadian site that holds (or is preparing to hold) a Health Canada DEL?",
      helpText:
        "The DEL is anchored to a physical Canadian establishment. Foreign sites cannot hold a DEL directly.",
      type: "single-choice",
      weight: 0.5,
      options: [
        {
          id: "yes-canadian-site",
          label: "Yes — Canadian site, DEL held or actively pursued",
          weight: 1,
        },
        {
          id: "planning-canadian-site",
          label: "Planning a Canadian site / sponsor-of-record arrangement",
          weight: 0.5,
        },
        {
          id: "foreign-only",
          label: "Foreign site only — no Canadian establishment",
          weight: 0,
        },
      ],
    },
    {
      id: "facility.gmp-qualification",
      category: "facility",
      prompt:
        "Has the facility undergone GMP qualification — premises, utilities, and equipment?",
      helpText:
        "Health Canada's GUI-0001 expects qualification packages for the establishment's GMP activities before a DEL is granted.",
      type: "single-choice",
      weight: 0.5,
      options: [
        {
          id: "fully-qualified",
          label: "Fully qualified, qualification packages on file",
          weight: 1,
        },
        {
          id: "in-progress",
          label: "Qualification in progress",
          weight: 0.5,
        },
        {
          id: "not-started",
          label: "Not started",
          weight: 0,
        },
      ],
    },

    /* -- QMS ---------------------------------------------------------- */
    {
      id: "qms.documented",
      category: "qms",
      prompt:
        "Is your Quality Management System documented to GUI-0001 cGMP expectations?",
      helpText:
        "GUI-0001 is Health Canada's interpretation document for Canadian cGMP. The QMS must address change control, deviations, CAPA, and document control at minimum.",
      type: "single-choice",
      weight: 0.55,
      options: [
        {
          id: "documented-and-audited",
          label: "Documented + internally audited within the last 12 months",
          weight: 1,
        },
        {
          id: "documented",
          label: "Documented but no recent internal audit",
          weight: 0.5,
        },
        {
          id: "not-documented",
          label: "Not yet documented",
          weight: 0,
        },
      ],
    },
    {
      id: "qms.deviation-capa",
      category: "qms",
      prompt:
        "Do you operate a deviation / CAPA system with a closure-rate target?",
      type: "single-choice",
      weight: 0.45,
      options: [
        { id: "yes-operational", label: "Yes — operational with KPIs", weight: 1 },
        { id: "drafted", label: "Drafted but not yet operational", weight: 0.5 },
        { id: "no-system", label: "No system in place", weight: 0 },
      ],
    },

    /* -- Personnel ---------------------------------------------------- */
    {
      id: "personnel.senior-person",
      category: "personnel",
      prompt:
        "Is there a named Senior Person responsible for Quality, per Part C, Division 1A?",
      helpText:
        "Division 1A requires a designated senior person who is responsible for the establishment's GMP compliance and quality decisions.",
      type: "single-choice",
      weight: 0.55,
      options: [
        { id: "yes-named", label: "Yes — named and active", weight: 1 },
        {
          id: "vacant",
          label: "Role defined but currently vacant",
          weight: 0.4,
        },
        {
          id: "not-defined",
          label: "Not yet defined",
          weight: 0,
        },
      ],
    },
    {
      id: "personnel.staffing",
      category: "personnel",
      prompt:
        "Are QA, QC, and production roles staffed with qualified personnel?",
      type: "single-choice",
      weight: 0.45,
      options: [
        { id: "fully-staffed", label: "Fully staffed", weight: 1 },
        {
          id: "partially-staffed",
          label: "Partially staffed — one or two key roles open",
          weight: 0.5,
        },
        { id: "minimally-staffed", label: "Minimally staffed", weight: 0 },
      ],
    },

    /* -- Site Master File -------------------------------------------- */
    {
      id: "smf.authored",
      category: "site-master-file",
      prompt:
        "Has a Site Master File (SMF) been authored to PIC/S PE 008 expectations?",
      helpText:
        "The SMF is a single document describing the establishment's GMP-related activities. Health Canada inspectors expect a current SMF on request.",
      type: "single-choice",
      weight: 1,
      options: [
        {
          id: "authored-current",
          label: "Authored and reviewed within the last 12 months",
          weight: 1,
        },
        {
          id: "drafted",
          label: "Drafted but not yet finalized",
          weight: 0.5,
        },
        { id: "not-authored", label: "Not authored", weight: 0 },
      ],
    },

    /* -- GDP ---------------------------------------------------------- */
    {
      id: "gdp.procedures",
      category: "gdp",
      prompt: "Do you have GDP-aligned distribution procedures in place?",
      helpText:
        "GUI-0069 is Health Canada's GDP guidance. Procedures must cover receiving, storage, picking, transport, and returns.",
      type: "single-choice",
      weight: 0.55,
      options: [
        {
          id: "yes-documented",
          label: "Yes — documented and in operational use",
          weight: 1,
        },
        { id: "drafted", label: "Drafted, not yet in use", weight: 0.5 },
        { id: "no-procedures", label: "No procedures yet", weight: 0 },
      ],
    },
    {
      id: "gdp.training",
      category: "gdp",
      prompt: "Are warehouse and distribution staff trained on GDP and GUI-0069?",
      type: "single-choice",
      weight: 0.45,
      options: [
        {
          id: "trained",
          label: "Trained — records on file",
          weight: 1,
        },
        { id: "training-in-progress", label: "Training in progress", weight: 0.5 },
        { id: "not-trained", label: "Not yet", weight: 0 },
      ],
    },

    /* -- Import / export --------------------------------------------- */
    {
      id: "import-export.scope",
      category: "import-export",
      prompt: "Will your DEL scope include drug importation into Canada?",
      type: "single-choice",
      weight: 0.4,
      options: [
        {
          id: "yes-routine",
          label: "Yes — routine importation expected",
          weight: 1,
        },
        {
          id: "yes-occasional",
          label: "Yes — occasional or single-shipment basis",
          weight: 1,
        },
        { id: "no-not-in-scope", label: "No — not in scope", weight: 1 },
      ],
    },
    {
      id: "import-export.procedures",
      category: "import-export",
      prompt:
        "Are customs brokerage, import-of-record, and inbound QA release procedures in place?",
      showWhen: {
        questionId: "import-export.scope",
        equalsAny: ["yes-routine", "yes-occasional"],
      },
      type: "single-choice",
      weight: 0.6,
      options: [
        {
          id: "yes-operational",
          label: "Yes — operational with broker engaged",
          weight: 1,
        },
        { id: "drafted", label: "Drafted but not yet operational", weight: 0.5 },
        { id: "not-yet", label: "Not yet", weight: 0 },
      ],
    },

    /* -- Cold chain --------------------------------------------------- */
    {
      id: "cold-chain.scope",
      category: "cold-chain",
      prompt: "Does your scope include cold-chain or refrigerated products?",
      helpText:
        "If the answer is no, the cold-chain category is treated as not applicable in scoring.",
      type: "single-choice",
      weight: 0.4,
      options: [
        { id: "yes-2-8", label: "Yes — 2–8 °C", weight: 1 },
        { id: "yes-frozen", label: "Yes — −20 °C or below", weight: 1 },
        { id: "no-not-in-scope", label: "No — not in scope", weight: 1 },
      ],
    },
    {
      id: "cold-chain.sops",
      category: "cold-chain",
      prompt: "Do you have validated cold-chain SOPs and qualified equipment?",
      showWhen: {
        questionId: "cold-chain.scope",
        equalsAny: ["yes-2-8", "yes-frozen"],
      },
      type: "single-choice",
      weight: 0.6,
      options: [
        {
          id: "yes-validated",
          label: "Yes — SOPs validated, equipment qualified",
          weight: 1,
        },
        {
          id: "in-progress",
          label: "In progress",
          weight: 0.5,
        },
        { id: "not-yet", label: "Not yet", weight: 0 },
      ],
    },
  ],
};

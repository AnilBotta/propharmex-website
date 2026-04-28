/**
 * Content dictionary for the Dosage Form Capability Matcher (Prompt 21
 * PR-A).
 *
 * Voice: anti-hype, plain language. The matcher is positioned as a
 * shortlisting tool, not a recommendation engine — the regulatory and
 * scientific decisions still belong with the user's team and ours.
 *
 * The "Talk to a scientist" escape hatch is rendered at every step per
 * Prompt 21 hard guardrail. The persistent disclaimer above results
 * carries the standard informational-only stamp.
 */

export const DOSAGE_MATCHER = {
  hero: {
    eyebrow: "Capability matcher",
    title: "Dosage Form Capability Matcher",
    body: "Describe your molecule or pick from the structured filters — the matcher shortlists the dosage forms Propharmex can take end-to-end and shows where each one sits in our capability envelope. Informational only. Confirm fit with our scientists before scoping.",
  },
  intro: {
    timeEstimate: "Takes about a minute",
    privacyNote:
      "Anonymous unless you submit. The free-text description is redacted for emails, phone numbers, and self-identifying patterns before reaching the model.",
    sampleCtaLabel: "See a sample",
  },
  /** Persistent disclaimer banner above the results. */
  disclaimer:
    "AI-assisted matching against our published capability set. Not regulatory or clinical advice. Confirm anything material with our scientists or your own counsel.",
  form: {
    descriptionLabel: "Describe the molecule or programme",
    descriptionPlaceholder:
      "e.g. Small-molecule API, BCS Class II, indicated for chronic adult dosing. Plan to file as a US ANDA. Need stability and method validation.",
    descriptionHelp:
      "Free-text. The more context you provide, the sharper the match.",
    filtersLabel: "Or use the structured filters (optional)",
    filterLabels: {
      apiType: "API type",
      indicationArea: "Indication area",
      releaseProfile: "Release profile",
      patientPopulation: "Patient population",
      developmentStage: "Development stage",
    },
    indicationPlaceholder: "e.g. Cardiovascular, oncology, infectious disease",
    selectAny: "Any",
    submitLabel: "Match dosage forms",
    submittingLabel: "Matching…",
    /** Inline error when both description and filters are empty. */
    emptyError:
      "Add a description or pick at least one filter so the matcher has something to work with.",
  },
  results: {
    eyebrow: "Top matches",
    inferredHeading: "Inferred requirements",
    requiredCapabilitiesLabel: "Required capabilities",
    considerationsLabel: "Considerations",
    matchesHeading: "Recommended dosage forms",
    fitTierLabels: {
      high: "High fit",
      medium: "Medium fit",
      low: "Low fit",
    },
    coverageLabel: "Capability coverage",
    rationaleLabel: "Rationale",
    mismatchHeading: "Things to confirm",
    caseStudiesHeading: "Case studies the model surfaced",
    caseStudiesEmpty:
      "No client-named case studies to surface here. Our team will walk you through anonymized comparable engagements on a discovery call.",
    nextStepsHeading: "Suggested next steps",
    actions: {
      bookConsultation: {
        label: "Talk to a scientist",
        href: "/contact?source=dosage-matcher-results",
      },
      downloadPdf: {
        label: "Download as PDF",
        renderingLabel: "Rendering…",
      },
      restart: {
        label: "Run another match",
      },
    },
    emptyHeading: "No matches surfaced",
    emptyBody:
      "The model didn't return a confident match against our capability set. The fastest path is a 20-minute scoping call — our scientists will confirm what's in scope and what isn't.",
  },
  /** "Talk to a scientist" escape hatch, persistent at every step. */
  escapeHatch: {
    label: "Talk to a scientist",
    href: "/contact?source=dosage-matcher",
  },
  errors: {
    /** 503 — no Anthropic key. */
    unconfigured:
      "Our matcher is being set up. Please use the contact form for now.",
    /** Stream / fetch failure. */
    streamFailed:
      "We couldn't finish that match. Please try again, or use the contact form.",
    /** 429 — rate limited. */
    rateLimited:
      "Too many matches in a short window. Please wait a minute and retry.",
    /** Catch-all. */
    generic: "Something went wrong. Please try again, or use the contact form.",
  },
  /** Humanizers — kept here so they go through brand-voice review. */
  humanize: {
    dosageForm: {
      "oral-solid": "Oral solid (tablet)",
      "oral-liquid": "Oral liquid",
      topical: "Topical",
      "injectable-lyo": "Injectable — lyophilised",
      "injectable-liquid": "Injectable — liquid",
      ophthalmic: "Ophthalmic",
      inhalation: "Inhalation",
      transdermal: "Transdermal",
      suppository: "Suppository",
      otic: "Otic",
      nasal: "Nasal",
      "soft-gel": "Soft gel",
      "hard-cap": "Hard capsule",
    },
    capability: {
      formulation: "Formulation",
      analytical: "Analytical",
      stability: "Stability",
      "process-validation": "Process validation",
      "scale-up": "Scale-up",
      "regulatory-us": "Regulatory — US",
      "regulatory-ca": "Regulatory — CA",
      "regulatory-eu": "Regulatory — EU",
      "regulatory-in": "Regulatory — IN",
      commercial: "Commercial",
    },
    apiType: {
      "small-molecule": "Small molecule",
      peptide: "Peptide",
      biologic: "Biologic",
      "natural-product": "Natural product",
      "device-combination": "Device combination",
      "not-sure": "Not sure",
    },
    releaseProfile: {
      "immediate-release": "Immediate release",
      "modified-release": "Modified release",
      "extended-release": "Extended release",
      "delayed-release": "Delayed release",
      "controlled-release": "Controlled release",
      depot: "Depot",
      "not-sure": "Not sure",
    },
    patientPopulation: {
      adult: "Adult",
      geriatric: "Geriatric",
      pediatric: "Pediatric",
      neonatal: "Neonatal",
      veterinary: "Veterinary",
      mixed: "Mixed",
    },
    developmentStage: {
      discovery: "Discovery",
      preformulation: "Pre-formulation",
      formulation: "Formulation",
      clinical: "Clinical",
      scaleup: "Scale-up",
      commercial: "Commercial",
    },
  },
} as const;

/**
 * Content dictionary for the DEL Readiness Assessment page (Prompt 20 PR-A).
 *
 * Voice: anti-hype, regulatory-precise. Every output is framed as
 * informational — never a regulatory promise. Every error / status string
 * keeps the "Talk to our regulatory team" handoff visible per Prompt 20
 * hard guardrail #2.
 */

export const DEL_READINESS = {
  hero: {
    eyebrow: "Health Canada DEL",
    title: "DEL Readiness Assessment",
    body: "Answer 12–13 short questions about your facility, QMS, personnel, and procedures. The assessment returns a readiness score, a traffic-light gap summary, and a prioritized remediation plan. Informational only — not a regulatory pre-inspection outcome.",
  },
  intro: {
    timeEstimate: "Takes about 5 minutes",
    privacyNote:
      "Anonymous unless you submit. We use your answers only to generate this assessment.",
    startCtaLabel: "Start the assessment",
  },
  /** Persistent disclaimer banner above and below the form. */
  disclaimer:
    "This is a self-assessment tool. It does not constitute regulatory advice and is not a Health Canada decision. Confirm anything material with our regulatory team or your own counsel.",
  form: {
    nextLabel: "Next",
    backLabel: "Back",
    submitLabel: "See my readiness score",
    submittingLabel: "Drafting your assessment…",
    optionGroupLabel: "Choose one",
    progressLabel: (current: number, total: number) =>
      `Question ${current} of ${total}`,
    /** Aria-label for the radio group on each step. */
    radioGroupAriaLabel: "Answer options",
    /** Inline message when the user tries to advance without answering. */
    answerRequired: "Please choose one option to continue.",
  },
  results: {
    eyebrow: "Your readiness",
    overallLabel: "Overall readiness score",
    overallSuffix: "/ 100",
    trafficLightLabels: {
      green: "On track",
      yellow: "Material gaps",
      red: "Significant work ahead",
    },
    categoriesHeading: "By category",
    gapsHeading: "Gaps the assessment surfaced",
    gapsEmptyBody:
      "No material gaps surfaced. Your answers indicate the foundational DEL prerequisites are in place — talk to our regulatory team about scoping a confirmation pass.",
    remediationHeading: "Prioritized next steps",
    remediationEmptyBody:
      "Nothing to action right now. If a regulator asked for documentation today, your starting position is strong.",
    effortLabel: {
      small: "Small effort",
      medium: "Medium effort",
      large: "Large effort",
    },
    actions: {
      bookConsultation: {
        label: "Book a DEL consultation",
        /** Cal.com link wired in PR-B; for PR-A points to /contact. */
        href: "/contact?source=del-readiness-results",
      },
      downloadReport: {
        label: "Download a personalized report (PDF)",
        renderingLabel: "Rendering…",
        /** Retained for tooltips on legacy callers; PR-B enables the button. */
        pendingLabel: "Coming soon — branded PDF report",
      },
      retake: {
        label: "Re-take the assessment",
      },
    },
  },
  errors: {
    /** 503 — no Anthropic key. */
    unconfigured:
      "Our assessment tool is being set up. Please use the contact form for now.",
    /** Stream / fetch failure. */
    streamFailed:
      "We couldn't finish that assessment. Please try again, or use the contact form.",
    /** 429 — rate limited. */
    rateLimited:
      "Too many assessments in a short window. Please wait a minute and retry.",
    /** Catch-all. */
    generic: "Something went wrong. Please try again, or use the contact form.",
  },
  /** "Talk to our regulatory team" link, kept persistent at every step. */
  escapeHatch: {
    label: "Talk to our regulatory team",
    href: "/contact?source=del-readiness",
  },
} as const;

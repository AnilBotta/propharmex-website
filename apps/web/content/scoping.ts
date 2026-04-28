/**
 * Content dictionary for the Project Scoping Assistant page (Prompt 19 PR-A).
 *
 * Voice rules (CLAUDE.md §1, §4.3): anti-hype, expert, plain language. The
 * page sits in the AI-tools tier of the site, so the framing is "structured
 * intake before a real conversation" — never a sales pitch.
 *
 * All user-facing strings live here, not inline in components. PR-A renders
 * the two action buttons as disabled with a "coming in PR-B" tooltip; PR-B
 * swaps in the live submit + PDF flows without changing this file.
 */

export interface ScopingSuggestion {
  id: string;
  /** Short label shown on the chip. */
  label: string;
  /** The actual prompt string sent when the user clicks the chip. */
  prompt: string;
}

export const SCOPING = {
  hero: {
    eyebrow: "AI-assisted intake",
    title: "Scope a project with us",
    body: "Answer a few questions and the assistant drafts a structured scope — objectives, deliverables, phased timeline, and recommended Propharmex services. You can edit any field before sending it to our team or downloading it as a PDF.",
    primaryCtaLabel: "Start scoping",
    sampleCtaLabel: "See a sample",
  },
  empty: {
    heading: "What are you scoping?",
    body: "Tell the assistant about the molecule or product, the dosage form, and the regulatory destination. It will ask a few follow-ups and then draft the scope.",
    suggestionsLabel: "Common starting points",
    suggestions: [
      {
        id: "anda-stability",
        label: "ICH stability for an ANDA",
        prompt:
          "I'm scoping an ICH-aligned 12-month stability programme for an oral solid (immediate-release tablet) that will file as a US ANDA. We need a Canadian sponsor-of-record under your DEL.",
      },
      {
        id: "method-validation",
        label: "Method development + validation",
        prompt:
          "We need analytical method development and validation for a small-molecule API and a finished product — assay, content uniformity, dissolution, related substances. Drug developer is in the EU; Canadian filing is in scope later.",
      },
      {
        id: "del-coverage",
        label: "Health Canada DEL coverage",
        prompt:
          "We have an approved product in another market and want a Canadian distribution surface under your Health Canada DEL — including 3PL out of Mississauga.",
      },
    ] as ScopingSuggestion[],
  },
  input: {
    placeholder: "Describe your scope or answer the assistant's question…",
    sendLabel: "Send",
    sendingLabel: "Sending…",
    disclaimer:
      "AI-assisted scoping. Informational only — not a quote, not a regulatory commitment.",
  },
  message: {
    /** Status pill rendered while the model is calling the proposeScope tool. */
    toolCallPending: "Drafting your scope…",
    /** Status pill rendered after a successful tool call resolution. */
    toolCallResolved: "Scope ready for review →",
  },
  preview: {
    emptyHeading: "Your scope appears here",
    emptyBody:
      "Answer a few questions on the left and the assistant will populate this card. You can edit any field before submitting or downloading.",
    sectionLabels: {
      objectives: "Objectives",
      dosageForms: "Dosage forms",
      developmentStage: "Stage",
      deliverables: "Deliverables",
      assumptions: "Assumptions",
      risks: "Risks",
      phases: "Phases",
      ballparkTimelineWeeks: "Ballpark timeline",
      recommendedServices: "Recommended services",
    },
    editLabel: "Edit",
    cancelEditLabel: "Cancel",
    saveEditLabel: "Save",
    /** Severity label rendered next to each risk. */
    severityLabel: {
      low: "Low",
      medium: "Medium",
      high: "High",
    },
    /** Format string for timeline range. */
    timelineRange: (min: number, max: number) =>
      min === max ? `${min} weeks` : `${min}–${max} weeks`,
    actions: {
      submitLabel: "Send to Propharmex",
      submitTooltipPending: "Coming in the next release — submit to BD",
      pdfLabel: "Download as PDF",
      pdfTooltipPending: "Coming in the next release — branded PDF download",
    },
  },
  /** Persistent "talk to a human" link, mirrored from the Concierge. */
  escapeHatch: {
    label: "Talk to a scientist",
    href: "/contact?source=scoping",
  },
  errors: {
    /** 503 — no Anthropic key. */
    unconfigured:
      "Our Scoping Assistant is being set up. Please use the contact form for now.",
    /** Network or stream failure. */
    streamFailed:
      "We couldn't finish that response. Please try again, or use the contact form.",
    /** 429 — rate limited. */
    rateLimited:
      "Too many requests in a short window. Please wait a minute and try again.",
    /** Generic catch-all. */
    generic: "Something went wrong. Please try again, or use the contact form.",
  },
} as const;

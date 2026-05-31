/**
 * Content dictionary for the floating CDMO Concierge chatbot (Prompt 18 PR-B).
 *
 * Voice rules: anti-hype, expert, regulatory-precise. The bubble is a quiet
 * affordance, not a marketing surface.
 *
 * Suggested prompts seed the empty-conversation state. Three is the right
 * count — fewer feels sparse, more crowds the panel.
 */

export interface ConciergeSuggestion {
  id: string;
  /** Short label shown on the chip. */
  label: string;
  /** The actual prompt string sent when the user clicks the chip. */
  prompt: string;
}

export interface ConciergeContent {
  /** Bubble launcher — accessible label and tooltip. */
  bubble: {
    openLabel: string;
    closeLabel: string;
    /** Title rendered at the top of the open panel. */
    title: string;
    /** Sub-eyebrow under the title. */
    subEyebrow: string;
  };
  /** Empty-state copy shown before the user sends their first message. */
  empty: {
    heading: string;
    body: string;
    suggestionsLabel: string;
    suggestions: ConciergeSuggestion[];
  };
  /** Input area copy. */
  input: {
    placeholder: string;
    sendLabel: string;
    sendingLabel: string;
    /** Microcopy under the input — disclaimer line. */
    disclaimer: string;
  };
  /** Per-message UI affordances. */
  message: {
    sourcesHeading: string;
    thumbsUpLabel: string;
    thumbsDownLabel: string;
    feedbackThanks: string;
  };
  /** "Talk to a human" persistent CTA. */
  escapeHatch: {
    label: string;
    href: string;
  };
  /** Error / fallback states. */
  errors: {
    /** 503 — no Anthropic key. */
    unconfigured: string;
    /** Network or stream failure. */
    streamFailed: string;
    /** Catch-all retry copy. */
    generic: string;
  };
}

export const CONCIERGE: ConciergeContent = {
  bubble: {
    openLabel: "Open the Propharmex Concierge",
    closeLabel: "Close the Propharmex Concierge",
    title: "Propharmex Concierge",
    subEyebrow: "AI-assisted, with citations",
  },
  empty: {
    heading: "What are you scoping?",
    body: "Ask anything about our development, analytical, regulatory, or scoping work. Answers cite the page they came from. For specifics on a real engagement, talk to our team.",
    suggestionsLabel: "Suggested questions",
    suggestions: [
      {
        id: "dosage-forms",
        label: "What dosage forms do you handle?",
        prompt:
          "What dosage forms does Propharmex develop and where do you have the deepest experience?",
      },
      {
        id: "readiness",
        label: "How should we prepare a scope?",
        prompt:
          "What information should a global sponsor prepare before scoping analytical, regulatory, or development work with Propharmex?",
      },
      {
        id: "regulatory-scope",
        label: "Can you help with filings?",
        prompt:
          "How does Propharmex support regulatory strategy and dossier planning for a global sponsor?",
      },
    ],
  },
  input: {
    placeholder: "Ask the Concierge…",
    sendLabel: "Send",
    sendingLabel: "Sending…",
    disclaimer: "Informational only. Always confirm regulatory specifics with our team.",
  },
  message: {
    sourcesHeading: "Sources",
    thumbsUpLabel: "Helpful",
    thumbsDownLabel: "Not helpful",
    feedbackThanks: "Thanks — noted.",
  },
  escapeHatch: {
    label: "Talk to a human",
    href: "/contact?source=concierge",
  },
  errors: {
    unconfigured: "Our Concierge is being set up. Please use the contact form for now.",
    streamFailed: "We couldn't finish that response. Please try again, or use the contact form.",
    generic: "Something went wrong. Please try again, or use the contact form below.",
  },
};

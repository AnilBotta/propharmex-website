/**
 * Content dictionary for /our-process — Prompt 16.
 *
 * Six-phase engagement model: Inquiry → NDA & Scope → Proposal → Contract →
 * Execute → Deliver / Technology Transfer. Each phase carries four body
 * fields per spec: what happens, what we need from you, what you receive,
 * typical timeline.
 *
 * Voice: same anti-hype editorial register as case-studies.ts and
 * insights.ts. Operating discipline framing, not aspirational marketing.
 * The "Start my project" CTA in the closing block points at /contact?
 * source=process-closing today; it will retarget to /ai-tools/project-
 * scoping-assistant when that AI feature ships at Prompt 19.
 *
 * Migration path: shape mirrors a future Sanity `processPhase` collection.
 * The slug-as-id pattern (PROCESS_PHASE_IDS) and the four-field body
 * structure map cleanly to a Sanity object schema; bodies are plain
 * strings rather than Portable Text since the rendered card is short and
 * structurally fixed (no inline links or callouts within phase prose).
 */

import type { FacilityCta } from "./facilities";

/* -------------------------------------------------------------------------- */
/*  Shared primitives                                                         */
/* -------------------------------------------------------------------------- */

export type ProcessCta = FacilityCta;

/* -------------------------------------------------------------------------- */
/*  Phase taxonomy                                                            */
/* -------------------------------------------------------------------------- */

export const PROCESS_PHASE_IDS = [
  "inquiry",
  "nda-and-scope",
  "proposal",
  "contract",
  "execute",
  "deliver",
] as const;
export type ProcessPhaseId = (typeof PROCESS_PHASE_IDS)[number];

/* -------------------------------------------------------------------------- */
/*  Phase                                                                     */
/* -------------------------------------------------------------------------- */

export type ProcessPhase = {
  id: ProcessPhaseId;
  /** Phase number rendered as a label (string so "01" reads as a label, not as 1). */
  number: string;
  /** Short label for the rail / mobile stepper marker. */
  label: string;
  /** Full phase title — H3 on the card. */
  title: string;
  /** One-sentence summary shown at the top of the phase card. */
  summary: string;
  /** What happens during this phase — one paragraph. */
  whatHappens: string;
  /** What we need from the client — short list. */
  whatWeNeed: string[];
  /** What the client receives by the end of this phase — short list. */
  whatYouReceive: string[];
  /** Typical elapsed time — short phrase, not a regulatory commitment. */
  typicalTimeline: string;
};

/* -------------------------------------------------------------------------- */
/*  Hero                                                                      */
/* -------------------------------------------------------------------------- */

export type ProcessHero = {
  eyebrow: string;
  headline: string;
  lede: string;
  /** Three short context stats. */
  stats: { label: string; value: string }[];
  primaryCta: ProcessCta;
  secondaryCta: ProcessCta;
};

/* -------------------------------------------------------------------------- */
/*  Closing                                                                   */
/* -------------------------------------------------------------------------- */

export type ProcessClosing = {
  eyebrow: string;
  heading: string;
  body: string;
  primaryCta: ProcessCta;
  secondaryCta: ProcessCta;
  /** Short caveat / context line shown beneath the closing block. */
  caveat: string;
};

/* -------------------------------------------------------------------------- */
/*  Aggregate                                                                 */
/* -------------------------------------------------------------------------- */

export type ProcessContent = {
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  hero: ProcessHero;
  phases: ProcessPhase[];
  closing: ProcessClosing;
};

/* -------------------------------------------------------------------------- */
/*  Constant — PROCESS                                                        */
/* -------------------------------------------------------------------------- */

export const PROCESS: ProcessContent = {
  metaTitle: "Our process — six-phase engagement model | Propharmex",
  metaDescription:
    "How a Propharmex engagement runs from first inquiry to final technology transfer: six phases, defined inputs and outputs at each stage, and typical elapsed time.",
  ogTitle: "Our process — six phases, no surprises",
  ogDescription:
    "Inquiry, NDA and scope, proposal, contract, execute, deliver. The engagement model behind a Canada-anchored two-hub CDMO.",

  hero: {
    eyebrow: "Engagement model",
    headline: "Six phases. No surprises.",
    lede: "Every Propharmex engagement runs through the same six phases — from first inquiry to final technology transfer. The structure is operational discipline, not bureaucracy. Each phase has a defined input, a defined output, and a typical elapsed time.",
    stats: [
      { label: "Inquiry to signed scope", value: "~3 weeks typical" },
      { label: "Payment cadence", value: "Milestone-based" },
      {
        label: "Active projects per workstream owner",
        value: "Three or fewer",
      },
    ],
    primaryCta: {
      label: "Start my project",
      // TODO(prompt-19): swap to /ai-tools/project-scoping-assistant when shipped.
      href: "/contact?source=process-hero",
      variant: "primary",
    },
    secondaryCta: {
      label: "Talk through your scope",
      href: "/contact?source=process-discovery",
      variant: "secondary",
    },
  },

  phases: [
    {
      id: "inquiry",
      number: "01",
      label: "Inquiry",
      title: "Initial inquiry",
      summary:
        "A short conversation to confirm the work fits both sides before either commits time.",
      whatHappens:
        "First call is 30 minutes, no NDA required. We listen for the molecule, the dosage form, the target market, and the stage. We share the work we have done in adjacent space and where we are honestly weaker. If the project is not a good fit on either side, we say so on this call rather than after a proposal cycle.",
      whatWeNeed: [
        "Public-information description of the molecule and dosage form",
        "Target geographies and rough filing timeline",
        "Whoever holds QA / regulatory decision authority on your side",
      ],
      whatYouReceive: [
        "A clear yes-or-no on capability fit",
        "An indicative scope of services that would apply if the project moves forward",
        "Names of the regulatory and analytical leads who would own the engagement",
      ],
      typicalTimeline: "1–3 business days from first email to call",
    },
    {
      id: "nda-and-scope",
      number: "02",
      label: "NDA & scope",
      title: "NDA and scoping",
      summary:
        "Mutual NDA, then a structured scoping conversation that produces a written scope document.",
      whatHappens:
        "Mutual NDA in place within one business day; standard form available, redlines welcomed. Then a 60–90 minute scoping call covering the molecule under NDA, the analytical and regulatory specifics, and the operational constraints — timeline, budget envelope, geographic reach. The scope document we produce afterward is the artifact the proposal is built against.",
      whatWeNeed: [
        "Mutual NDA executed (we provide a standard form; your form is also fine)",
        "Confidential project brief — molecule, target product profile, current state of development",
        "Identified counterparts on your side for QA, RA, and CMC",
      ],
      whatYouReceive: [
        "A written scope document covering objectives, deliverables, assumptions, and risks",
        "Identified workstreams across our two hubs",
        "An honest opinion on what we would do differently if we were running this on the inside",
      ],
      typicalTimeline: "1–2 weeks from NDA execution to signed scope",
    },
    {
      id: "proposal",
      number: "03",
      label: "Proposal",
      title: "Proposal",
      summary:
        "A line-itemized proposal with timeline, deliverables, and costs — built directly from the scope document.",
      whatHappens:
        "Proposal built from the scope. Each workstream priced separately so you can adjust scope without rebuilding the proposal. Timeline shown in calendar weeks rather than working days, with realistic buffers. We name the people who will own each workstream — not titles.",
      whatWeNeed: [
        "Confirmation of scope assumptions or any updates to them",
        "Decision-maker availability for a 60-minute proposal review call",
      ],
      whatYouReceive: [
        "Full proposal with line-item pricing, timeline, and deliverables",
        "Workstream owners named on our side",
        "Our redline-friendly draft of the master services agreement and statement of work",
      ],
      typicalTimeline: "5–10 business days from signed scope to delivered proposal",
    },
    {
      id: "contract",
      number: "04",
      label: "Contract",
      title: "Contract",
      summary:
        "MSA, SOW, and Quality Agreement — handled in parallel with project mobilization so the calendar does not stall on legal review.",
      whatHappens:
        "Three documents need to be in place before active work starts: the master services agreement, the statement of work, and the Quality Agreement. We begin project mobilization — team allocation, materials sourcing, regulatory pre-meetings — in parallel with contracting so the calendar does not stall on legal review. The Canadian-side Quality Agreement is structured to align with the PIC/S guide PI 050-1; the MSA and SOW have reasonable redline cycles.",
      whatWeNeed: [
        "Counterparts on your side for legal review of the MSA and Quality Agreement",
        "Your Quality Agreement template if you have one (we work from ours otherwise)",
        "Final scope confirmation",
      ],
      whatYouReceive: [
        "Executed MSA, SOW, and Quality Agreement",
        "Project mobilization status on the day of signature",
        "Named project manager and the standing meeting cadence",
      ],
      typicalTimeline: "2–4 weeks from delivered proposal to executed contract",
    },
    {
      id: "execute",
      number: "05",
      label: "Execute",
      title: "Execute",
      summary:
        "Active engagement across both hubs, under one quality system, with weekly visibility.",
      whatHappens:
        "The project runs across the two hubs as designed in the proposal. Weekly project meetings between your team and our project manager; bi-weekly milestone reviews with the workstream owners; monthly executive steering committees for projects long enough to need them. All deviations and CAPAs visible in real time through the shared project workspace; data integrity controls (ALCOA+) apply equally at both sites. Regulatory pre-meetings with Health Canada or your target regulator are scheduled into the timeline rather than treated as external dependencies.",
      whatWeNeed: [
        "Decision availability on the agreed cadence",
        "Timely review and approval of regulatory editorial drafts",
        "Sample shipments where the protocol requires them",
      ],
      whatYouReceive: [
        "All deliverables per the SOW — analytical reports, regulatory dossiers, batch records, validation packages",
        "Weekly status reports plus change log",
        "Single shared project workspace with documents, deviations, and CAPAs visible",
      ],
      typicalTimeline:
        "Project-specific — typical engagement is 6–18 months depending on dosage form and filing scope",
    },
    {
      id: "deliver",
      number: "06",
      label: "Deliver",
      title: "Deliver and technology transfer",
      summary:
        "Final deliverables and a defined handoff. Engagement is not closed until the receiving site has independently produced an in-spec batch.",
      whatHappens:
        "Final deliverables released against the SOW. Where the engagement included tech transfer, the receiving site — your facility or a designated CMO — is qualified through a defined transfer protocol with cross-site method validation, batch confirmation, and a written handoff package. We do not consider an engagement closed until the receiving site has independently produced an in-spec batch using only the documents we transferred.",
      whatWeNeed: [
        "Receiving-site readiness assessment if tech transfer is in scope",
        "Reciprocal QA audit windows",
        "Final invoice approval and project close-out signature",
      ],
      whatYouReceive: [
        "All final deliverables per the SOW, archived",
        "A complete technology-transfer package where applicable — methods, validation, batch records, training materials",
        "Project close-out report with lessons learned and an open-issues list",
        "Continued post-engagement support per the agreed warranty period",
      ],
      typicalTimeline:
        "1–3 months after the last execute milestone, depending on tech-transfer scope",
    },
  ],

  closing: {
    eyebrow: "Ready when you are",
    heading: "Start your project.",
    body: "First call is 30 minutes, no NDA required. We listen, share what we have done in adjacent space, and tell you honestly whether your project is a good fit. If it is not, we say so on this call rather than after a proposal cycle.",
    primaryCta: {
      label: "Start my project",
      // TODO(prompt-19): swap to /ai-tools/project-scoping-assistant when shipped.
      href: "/contact?source=process-closing",
      variant: "primary",
    },
    secondaryCta: {
      label: "Schedule a discovery call",
      href: "/contact?source=process-discovery-2",
      variant: "secondary",
    },
    caveat:
      "We respond to inquiries within one business day. The team that picks up the inquiry is the team that runs the engagement; there is no separate sales handoff.",
  },
};

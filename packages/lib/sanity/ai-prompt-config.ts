/**
 * aiPromptConfig fetcher (Prompt 18 PR-B).
 *
 * Wraps `sanityFetch` to retrieve the Concierge slice of the singleton
 * aiPromptConfig document. The Sanity schema (apps/studio/schemas/documents/
 * aiPromptConfig.ts) is in place but the document itself has not been
 * published yet — population is deferred until the regulatory lead signs
 * off on the system prompt copy.
 *
 * Until then, this module returns a hardcoded fallback that encodes:
 *   - The Canadian-anchored identity (lexicon Section 4 voice)
 *   - The three hard guardrails specified in Prompt 18:
 *       * No medical advice
 *       * No regulatory promise
 *       * Always cite sources + always offer the "Talk to a human" escape hatch
 *   - Citation format instructions ([1], [2] markers + footer link block)
 *
 * When Sanity is populated, the fetcher returns the parsed CMS value and the
 * fallback is bypassed automatically. No code change needed at switchover.
 */
import { z } from "zod";

import { log } from "../log";

import { sanityFetch, sanityTag } from "./fetch";

/* -------------------------------------------------------------------------- */
/*  Parser                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Schema for the `concierge` slice of the aiPromptConfig singleton. Mirrors
 * the field shape declared in apps/studio/schemas/documents/aiPromptConfig.ts.
 */
export const conciergePromptParser = z.object({
  systemPrompt: z.string().min(40),
  temperature: z.number().min(0).max(2).default(0.4),
  model: z.string().min(1).default("claude-sonnet-4-5-20250929"),
  disclaimer: z.string().min(1),
});

export type ConciergePromptConfig = z.infer<typeof conciergePromptParser>;

/**
 * Wraps the singleton query to project just the `concierge` slice plus the
 * global disclaimer. Returns `null` when the document doesn't exist.
 */
const conciergeQueryParser = z
  .object({
    concierge: conciergePromptParser.nullable(),
    globalDisclaimer: z.string().nullable(),
  })
  .nullable();

const CONCIERGE_QUERY = /* groq */ `
  *[_type == "aiPromptConfig"][0] {
    concierge,
    globalDisclaimer
  }
`;

/* -------------------------------------------------------------------------- */
/*  Hardcoded fallback                                                         */
/* -------------------------------------------------------------------------- */

/**
 * Fallback config used when the Sanity singleton hasn't been published yet
 * (and any time the live fetch fails). Captures the Canadian-anchored voice
 * + the three Prompt 18 hard guardrails.
 *
 * Citation contract: every claim grounded in a retrieved chunk must carry an
 * inline [N] marker. The route handler renders a numbered footer mapping
 * those markers back to the source URLs after streaming completes.
 */
export const FALLBACK_CONCIERGE_CONFIG: ConciergePromptConfig = {
  // Pinned to a dated Anthropic model id. The `-latest` alias suffix is not
  // accepted by every @ai-sdk/anthropic version or every org's catalog, so a
  // dated id is the safest default. The Sanity singleton can override per
  // environment when a newer revision is preferred.
  model: "claude-sonnet-4-5-20250929",
  temperature: 0.3,
  disclaimer:
    "AI-assisted, with citations. Informational only. Always confirm regulatory specifics with our team.",
  systemPrompt: `You are the Propharmex Concierge — a focused, anti-hype AI assistant for the Propharmex public website.

# Identity

Propharmex is a Canadian pharmaceutical services company. Operations are anchored at our Mississauga, Ontario site under Health Canada Drug Establishment Licence (DEL) and Canadian Food and Drug Regulations Part C, Division 1A. Our Indian development centre in Hyderabad operates under the same quality management system, contributing formulation, method development, analytical, and stability work to programmes that file in Canada. The DEL anchor is Mississauga; the QMS scope honestly extends to Hyderabad.

# Audience

Drug developers worldwide — US generic sponsors filing ANDAs, EU innovators with branded programmes, contract manufacturers needing a Canadian regulatory surface, multilateral procurement agencies, NGO programmes. Procurement, regulatory affairs, CMC, and quality leaders are the primary readers.

# Voice

Anti-hype. Expert. Humble. Regulatory-precise. Plain language. The reader is technically literate; do not over-explain. Never use words like "world-class", "cutting-edge", "seamless", "industry-leading", "trusted partner", "best-in-class", or "premier". Never make medical efficacy or safety claims. Never promise a regulatory outcome or timeline.

# Hard guardrails

1. **No medical advice.** If asked anything about treating a condition, recommending a drug, or interpreting a clinical result, decline politely and point the user to a qualified healthcare professional.
2. **No regulatory promise.** Never claim a programme will be approved, never quote a non-public timeline as fact, never characterise an inspection outcome you don't have a primary source for. If asked "how long will my ANDA take", explain the published service-standard ranges and mark the answer as informational.
3. **Always cite + always offer the escape hatch.** Every factual claim grounded in a retrieved Propharmex source MUST carry an inline citation marker like [1], [2], etc. — these map to the numbered source list the UI renders below your reply. At the end of every substantive reply, suggest "If this is shaping a real engagement, our team will reply within one Canadian business day — [/contact](/contact)" so the user always has a human-handoff path.

# Citation format

When you make a factual claim that comes from a retrieved Propharmex source, place a marker like [1] immediately after the claim. The UI renders a clickable Sources footer below your message, automatically, using the [N] markers in your text — so:

- DO use inline [1], [2], [3] markers right after each claim that came from a source.
- DO use the numbers in the order the sources are listed in the "Retrieved Propharmex sources" context block below.
- DO reuse the same number if you cite the same source more than once.
- DO NOT write your own "Sources:" / "### Sources" / "References:" / footnote section at the end of your reply. The UI handles that. Writing it yourself produces duplication.
- DO NOT invent sources. Only cite numbers that exist in the context block.
- If the context block is empty (no retrieved chunks), say so plainly in one sentence and answer from your general knowledge without producing any [N] markers.

# Out of scope

- Specific pricing or quotes — say we share that on a discovery call after scoping
- Confidential client names — never name a client unless the retrieved source explicitly does so
- Internal staff names beyond what the public site already publishes (the about + leadership pages)
- Speculation about competitors — describe what we do, not what they do

# Format

Keep replies tight. 2–4 short paragraphs is the norm. Use bullets for lists. Use bold sparingly. No emojis. No exclamation points.`,
};

/* -------------------------------------------------------------------------- */
/*  Public fetcher                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Fetch the Concierge prompt config from Sanity, falling back to the
 * hardcoded default when the singleton isn't populated or the fetch fails.
 *
 * Cached via Next.js ISR (default 5 minutes via sanityFetch) and tagged so
 * the eventual /api/revalidate webhook can invalidate on update.
 */
export async function fetchConciergePromptConfig(opts?: {
  preview?: boolean;
}): Promise<ConciergePromptConfig> {
  try {
    const data = await sanityFetch({
      query: CONCIERGE_QUERY,
      parser: conciergeQueryParser,
      tags: [sanityTag("aiPromptConfig")],
      preview: opts?.preview ?? false,
      queryName: "concierge-prompt",
    });
    if (data?.concierge) {
      return data.concierge;
    }
    log.warn("concierge.prompt.fallback", { reason: "no_sanity_doc" });
    return FALLBACK_CONCIERGE_CONFIG;
  } catch (err) {
    log.warn("concierge.prompt.fallback", {
      reason: "sanity_error",
      message: err instanceof Error ? err.message : String(err),
    });
    return FALLBACK_CONCIERGE_CONFIG;
  }
}

/* ========================================================================== */
/*  Scoping Assistant (Prompt 19)                                              */
/* ========================================================================== */

/**
 * Schema for the `scoping` slice of the aiPromptConfig singleton. Same field
 * shape as Concierge — the `aiPromptConfig` schema reuses one factory across
 * all four AI tools.
 */
export const scopingPromptParser = z.object({
  systemPrompt: z.string().min(40),
  temperature: z.number().min(0).max(2).default(0.3),
  model: z.string().min(1).default("claude-sonnet-4-5-20250929"),
  disclaimer: z.string().min(1),
});

export type ScopingPromptConfig = z.infer<typeof scopingPromptParser>;

const scopingQueryParser = z
  .object({
    scoping: scopingPromptParser.nullable(),
    globalDisclaimer: z.string().nullable(),
  })
  .nullable();

const SCOPING_QUERY = /* groq */ `
  *[_type == "aiPromptConfig"][0] {
    scoping,
    globalDisclaimer
  }
`;

/**
 * Fallback used until the Sanity singleton's `scoping` slice is populated.
 *
 * Encodes the three Prompt 19 hard guardrails: no medical advice, no
 * regulatory promise, escape-hatch always offered. Also enumerates the
 * tool-calling contract — the model is instructed to ask 5–8 adaptive
 * questions, then call `proposeScope` exactly once with the structured
 * summary; never to invent fields it wasn't told.
 */
export const FALLBACK_SCOPING_CONFIG: ScopingPromptConfig = {
  model: "claude-sonnet-4-5-20250929",
  temperature: 0.3,
  disclaimer:
    "AI-assisted scoping. Informational only — not a quote, not a regulatory commitment. Our team confirms the real scope before any engagement.",
  systemPrompt: `You are the Propharmex Project Scoping Assistant — a focused, anti-hype intake agent for the Propharmex public website.

# Your job

Run a structured discovery conversation with a drug developer who is considering working with Propharmex. Your output is a strongly-typed scope summary that the user reviews and either submits to our business-development team or downloads as a PDF.

# Identity

Propharmex is a Canadian pharmaceutical services company. Operations are anchored at our Mississauga, Ontario site under Health Canada Drug Establishment Licence (DEL) and Canadian Food and Drug Regulations Part C, Division 1A. Our Indian development centre in Hyderabad operates under the same QMS, contributing formulation, method development, analytical, and stability work to programmes that file in Canada. The DEL anchor is Mississauga; the Canadian sponsor-of-record sits in Canada.

# Conversation flow

Ask 5–8 short, adaptive questions — one at a time. Build on answers. Cover (in roughly this order, but skip questions that the user has already answered):

1. The target product or molecule and the indication area at a high level
2. The dosage form(s) under consideration
3. Where they are today: stage of development, what's already been done, what data they have
4. The regulatory destination (Health Canada, USFDA ANDA, EU, multilateral procurement, etc.)
5. The deliverable they're after — analytical, stability, formulation, regulatory, distribution, full programme
6. Hard constraints — timeline, budget envelope (qualitative is fine), any IP or partnership constraints
7. What would make this a successful engagement to them in a year

Skip the questions you already have answers for. If the user front-loads everything in turn one, you may go directly to the scope.

# Tool calling

Once you have enough signal — typically after 5–8 user turns — call the \`proposeScope\` tool exactly once with the full structured summary. Do not call it more than once per conversation. Do not call it before you have at least: objectives, dosage forms, stage, and regulatory destination.

If the user asks for a scope before you have enough information, ask one more clarifying question first.

# Hard guardrails

1. **No medical advice.** Never recommend a drug, a dose, or a clinical pathway. Your remit is the engagement with Propharmex, not the molecule's clinical merit.
2. **No regulatory promise.** Never say a programme will be approved or quote a non-public timeline as a commitment. Phases and timelines you propose are service-standard ranges, not contractual commitments — say so explicitly in the assumptions.
3. **Always offer the escape hatch.** At every turn, if the user asks something you can't credibly answer (specific pricing, a competitor comparison, a confidential client name), say so and point them to the contact form.

# Voice

Anti-hype. Expert. Humble. Plain language. Never use "world-class", "cutting-edge", "seamless", "industry-leading", "trusted partner". The reader is a procurement, regulatory, or CMC lead — technically literate.

# Format

Keep replies tight. One question per turn until you have enough information. When you call \`proposeScope\`, the structured tool args ARE the deliverable — don't repeat them in prose. After the tool call, send one short message that says the scope is ready for review and points the user to the inline-edit affordance and the two action buttons on the right.

# Out of scope for this conversation

- Specific pricing or quotes — we share that on a discovery call after this scope is agreed
- Confidential client names — never name a client
- Speculation about competitors — describe what we do, not what they do
- Anything that requires a wet signature, a regulatory opinion, or a clinical judgment`,
};

/**
 * Fetch the Scoping prompt config from Sanity, falling back to the
 * hardcoded default when the singleton isn't populated or the fetch fails.
 *
 * Same caching + tagging contract as `fetchConciergePromptConfig`.
 */
export async function fetchScopingPromptConfig(opts?: {
  preview?: boolean;
}): Promise<ScopingPromptConfig> {
  try {
    const data = await sanityFetch({
      query: SCOPING_QUERY,
      parser: scopingQueryParser,
      tags: [sanityTag("aiPromptConfig")],
      preview: opts?.preview ?? false,
      queryName: "scoping-prompt",
    });
    if (data?.scoping) {
      return data.scoping;
    }
    log.warn("scoping.prompt.fallback", { reason: "no_sanity_doc" });
    return FALLBACK_SCOPING_CONFIG;
  } catch (err) {
    log.warn("scoping.prompt.fallback", {
      reason: "sanity_error",
      message: err instanceof Error ? err.message : String(err),
    });
    return FALLBACK_SCOPING_CONFIG;
  }
}

/* ========================================================================== */
/*  DEL Readiness Assessment (Prompt 20)                                       */
/* ========================================================================== */

/**
 * Schema for the `delReadiness` slice of the aiPromptConfig singleton.
 * Same field shape as Concierge / Scoping — the `aiPromptConfig` schema
 * reuses one factory across all four AI tools.
 */
export const delReadinessPromptParser = z.object({
  systemPrompt: z.string().min(40),
  temperature: z.number().min(0).max(2).default(0.3),
  model: z.string().min(1).default("claude-sonnet-4-5-20250929"),
  disclaimer: z.string().min(1),
});

export type DelReadinessPromptConfig = z.infer<
  typeof delReadinessPromptParser
>;

const delReadinessQueryParser = z
  .object({
    delReadiness: delReadinessPromptParser.nullable(),
    globalDisclaimer: z.string().nullable(),
  })
  .nullable();

const DEL_READINESS_QUERY = /* groq */ `
  *[_type == "aiPromptConfig"][0] {
    delReadiness,
    globalDisclaimer
  }
`;

/**
 * Fallback used until the Sanity singleton's `delReadiness` slice is
 * populated. The hard guardrails Prompt 20 specifies are encoded here:
 *   - Explicitly informational, not a regulatory guarantee
 *   - Every output includes the disclaimer
 *   - Every output offers the regulatory-team handoff
 *
 * The model receives the rubric + the user's answers + the deterministic
 * score, and is asked to produce ONLY the gap analysis + remediation —
 * the score itself is computed in `packages/lib/del-readiness/score.ts`
 * and the model never emits it.
 */
export const FALLBACK_DEL_READINESS_CONFIG: DelReadinessPromptConfig = {
  model: "claude-sonnet-4-5-20250929",
  temperature: 0.2,
  disclaimer:
    "Informational only. This is not a Health Canada pre-inspection outcome and not regulatory advice. Confirm with our regulatory team before any submission.",
  systemPrompt: `You are the Propharmex DEL Readiness Assistant — a focused, regulatory-precise tool that helps drug developers gauge their readiness for a Health Canada Drug Establishment Licence (DEL).

# Your job

You receive (a) the canonical DEL readiness rubric, (b) the user's answers, and (c) the deterministic score the rubric produced for those answers. Your job is to call the \`recommend\` tool exactly once with two things:

  1. \`gaps\`: a short list of the most material gaps surfaced by the answers. One entry per significant gap. Skip categories the user marked as not in scope. Each entry has \`category\`, \`headline\` (≤160 chars), and \`description\` (1–2 sentences explaining why this matters under Canadian Food and Drug Regulations Part C, Division 1A and GUI-0001).

  2. \`remediation\`: a prioritized action list. Each item has \`priority\` (1 = most urgent), \`action\` (imperative, plain language — what to do), \`rationale\` (why now, including which gap it addresses), and \`effort\` (\`small\` / \`medium\` / \`large\` — coarse signal so the user can scope a plan).

# Identity

Propharmex is a Canadian pharmaceutical services company. Operations are anchored at the Mississauga, Ontario site under a Health Canada DEL. We are NOT recommending the user becomes us — we are helping them assess their own readiness against the regulatory standard.

# Hard guardrails

1. **No regulatory promise.** Never claim a particular score corresponds to a guaranteed inspection outcome or DEL grant. Never quote a non-public timeline as fact. The rubric is a structured self-assessment, not a Health Canada decision.

2. **Informational only.** Every recommendation should land like guidance, not advice. If the user has a complex case, your default fallback is "Talk to our regulatory team via /contact?source=del-readiness."

3. **Stay within rubric scope.** Only flag gaps the rubric measured. Do not invent regulatory categories the user wasn't asked about. If the user's score is high, return a short, calibrated gap list (or empty) and a short remediation list — do not pad to look thorough.

4. **No medical or clinical advice.** This tool is about establishment licensure, not products or therapies.

# Voice

Anti-hype. Expert. Plain language. Never use "world-class", "best-in-class", "industry-leading", "trusted partner". The reader is a regulatory or QA lead — write for someone who already understands the terrain.

# Output rules

- Call \`recommend\` exactly once.
- Do not write prose responses outside the tool call. Any text you stream is shown to the user as a brief "drafting your assessment" status.
- Keep gap headlines tight (under 160 chars).
- Sort remediation items so priority ascends from 1 (most urgent).
- An effort of \`large\` should be reserved for items that genuinely require months of work (a full QMS rewrite, a SMF authorship from scratch, a cold-chain qualification programme). Do not over-grade.

# Out of scope

- Specific pricing — we discuss that on a regulatory consultation.
- Confidential client examples — never name a client.
- Speculation about other CDMOs — describe the standard, not who else meets it.`,
};

/**
 * Fetch the DEL Readiness prompt config from Sanity, falling back to the
 * hardcoded default when the singleton isn't populated or the fetch fails.
 *
 * Same caching + tagging contract as `fetchConciergePromptConfig` /
 * `fetchScopingPromptConfig`.
 */
export async function fetchDelReadinessPromptConfig(opts?: {
  preview?: boolean;
}): Promise<DelReadinessPromptConfig> {
  try {
    const data = await sanityFetch({
      query: DEL_READINESS_QUERY,
      parser: delReadinessQueryParser,
      tags: [sanityTag("aiPromptConfig")],
      preview: opts?.preview ?? false,
      queryName: "del-readiness-prompt",
    });
    if (data?.delReadiness) {
      return data.delReadiness;
    }
    log.warn("del-readiness.prompt.fallback", { reason: "no_sanity_doc" });
    return FALLBACK_DEL_READINESS_CONFIG;
  } catch (err) {
    log.warn("del-readiness.prompt.fallback", {
      reason: "sanity_error",
      message: err instanceof Error ? err.message : String(err),
    });
    return FALLBACK_DEL_READINESS_CONFIG;
  }
}

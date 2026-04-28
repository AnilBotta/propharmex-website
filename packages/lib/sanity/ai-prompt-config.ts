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

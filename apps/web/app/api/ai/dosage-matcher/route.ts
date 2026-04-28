/**
 * /api/ai/dosage-matcher — Match a programme description to dosage forms.
 *
 * Prompt 21 PR-A. Edge runtime. Architecturally: same one-shot tool-
 * call pattern as DEL Readiness, with three differences:
 *
 *   1. NO rubric, NO score. The model returns up to 3 dosage-form
 *      recommendations with qualitative `fitTier` (high/medium/low) and
 *      a per-match rationale.
 *   2. The user message embeds the SOP capability list (the model has
 *      to "match against" something concrete; without it, it would just
 *      hallucinate capabilities).
 *   3. Coverage % is computed deterministically per match in
 *      `enrichRecommendation` and shipped back via
 *      `writer.writeMessageAnnotation` — same delivery channel as
 *      DEL Readiness's score.
 *
 * Reused verbatim from Prompts 18–20:
 *   - `redact()` over the user description (free text — could carry PII)
 *   - `getRateLimiter` per IP
 *   - 503 / 429 / 400 graceful-degradation shapes
 */
import { createAnthropic } from "@ai-sdk/anthropic";
import {
  createDataStreamResponse,
  streamText,
  tool,
  type CoreMessage,
} from "ai";
import { NextResponse } from "next/server";
import { z } from "zod";

import {
  dosageMatcher,
  env,
  getRateLimiter,
  log,
  redact,
  sanity,
} from "@propharmex/lib";

export const runtime = "edge";

/* -------------------------------------------------------------------------- */
/*  Inbound schema                                                             */
/* -------------------------------------------------------------------------- */

const BodySchema = z.object({
  input: dosageMatcher.MatcherInputSchema,
});

/* -------------------------------------------------------------------------- */
/*  Constants                                                                  */
/* -------------------------------------------------------------------------- */

const MAX_TOKENS = 2000;
const RATE_LIMIT_TOKENS = 10;
const RATE_LIMIT_WINDOW = "5 m" as const;

const matcherRateLimiter = getRateLimiter("dosage-matcher:ip", {
  tokens: RATE_LIMIT_TOKENS,
  window: RATE_LIMIT_WINDOW,
});

/* -------------------------------------------------------------------------- */
/*  Handler                                                                    */
/* -------------------------------------------------------------------------- */

export async function POST(req: Request) {
  // 1) Hard-fail when Anthropic isn't configured.
  if (!env.ANTHROPIC_API_KEY) {
    log.warn("dosage-matcher.unconfigured", { reason: "no_anthropic_key" });
    return NextResponse.json(
      {
        error:
          "Our Dosage Form Matcher is being set up — please use the contact form for now.",
        contactUrl: "/contact?source=dosage-matcher-unconfigured",
      },
      { status: 503 },
    );
  }

  // 2) Per-IP rate limit.
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anon";
  const rl = await matcherRateLimiter.limit(ip);
  if (!rl.success) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((rl.reset - Date.now()) / 1000),
    );
    log.warn("dosage-matcher.rate_limited", { ip, retryAfterSeconds });
    return NextResponse.json(
      {
        error: "Too many matches in a short window. Please wait and retry.",
        contactUrl: "/contact?source=dosage-matcher-rate-limited",
      },
      {
        status: 429,
        headers: { "Retry-After": String(retryAfterSeconds) },
      },
    );
  }

  // 3) Parse + validate body.
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const parsed = BodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request shape." },
      { status: 400 },
    );
  }
  const { input } = parsed.data;

  // 4) Redact the free-text description before it reaches the model or
  // the logger. Filters are categorical enums — nothing to redact there.
  let totalRedactionCount = 0;
  const redactedInput: dosageMatcher.MatcherInput = { ...input };
  if (input.description) {
    const { redactedText, redactionCount } = redact(input.description);
    totalRedactionCount += redactionCount;
    if (redactionCount > 0) {
      redactedInput.description = redactedText;
    }
  }
  if (totalRedactionCount > 0) {
    log.info("dosage-matcher.redacted", { count: totalRedactionCount });
  }

  // 5) Fetch the prompt config and ship the SOP capability list with the
  // user message — the model has to match against a concrete catalogue.
  const config = await sanity.fetchDosageMatcherPromptConfig();

  const messages: CoreMessage[] = [
    {
      role: "user",
      content: buildUserMessage(redactedInput),
    },
  ];

  log.info("dosage-matcher.invoked", {
    hasDescription: Boolean(redactedInput.description),
    filterCount: redactedInput.filters
      ? Object.values(redactedInput.filters).filter((v) => v != null && v !== "")
          .length
      : 0,
    model: config.model,
  });

  // 6) Stream. Model is asked to call `recommend` exactly once with
  // `{ inferredRequirements, matches }`. We enrich each match with
  // deterministic coverage server-side and ship the full payload back
  // via `writer.writeMessageAnnotation` (frame `8:`).
  const anthropic = createAnthropic({ apiKey: env.ANTHROPIC_API_KEY });

  return createDataStreamResponse({
    execute: (writer) => {
      let recommendationAttached = false;

      const result = streamText({
        model: anthropic(config.model),
        system: config.systemPrompt,
        messages,
        temperature: config.temperature,
        maxTokens: MAX_TOKENS,
        tools: {
          recommend: tool({
            description:
              "Emit up to 3 ranked dosage-form recommendations with qualitative fitTier and rationale. Call exactly once per request. Capability coverage % is computed by the server — do not emit it.",
            parameters: dosageMatcher.ModelRecommendationSchema,
            execute: async (args) => {
              // Enrich with deterministic coverage and ship as an
              // annotation. The annotation is what the client renders;
              // the tool call's stream frame still passes through as
              // metadata for parsers that consume it directly.
              try {
                const enriched = dosageMatcher.enrichRecommendation(args);
                writer.writeMessageAnnotation({
                  type: "dosage-matcher.recommendation",
                  rubricVersion: "v1",
                  recommendation: enriched,
                  disclaimer: config.disclaimer,
                });
                recommendationAttached = true;
              } catch (err) {
                log.error("dosage-matcher.enrich_error", {
                  message: err instanceof Error ? err.message : String(err),
                });
              }
              return { ok: true } as const;
            },
          }),
        },
        onError: ({ error }) => {
          log.error("dosage-matcher.stream_error", {
            message: error instanceof Error ? error.message : String(error),
            model: config.model,
          });
        },
      });

      result.mergeIntoDataStream(writer);

      // Defensive: if the stream finishes without a tool call, surface
      // a sentinel annotation so the client renders the empty-results
      // path rather than spinning forever.
      void result.finishReason.then((reason) => {
        if (!recommendationAttached) {
          log.warn("dosage-matcher.no_tool_call", { reason });
          writer.writeMessageAnnotation({
            type: "dosage-matcher.recommendation",
            rubricVersion: "v1",
            recommendation: null,
            disclaimer: config.disclaimer,
          });
        }
      });
    },
    onError: (error) => {
      log.error("dosage-matcher.data_stream_error", {
        message: error instanceof Error ? error.message : String(error),
      });
      return "An error occurred while matching — please try again.";
    },
  });
}

/* -------------------------------------------------------------------------- */
/*  User-message builder                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Format the user's input + the full SOP capability list as the model's
 * grounding context. Plain Markdown — keeps token usage low and parse
 * fidelity high.
 */
function buildUserMessage(input: dosageMatcher.MatcherInput): string {
  const lines: string[] = [];

  lines.push("# Dosage Form Capability Matcher — match request");
  lines.push("");
  lines.push(
    "Match the request below against the Propharmex SOP capability list. Call `recommend` exactly once with up to 3 ranked dosage-form recommendations. Do NOT emit a capability coverage % — that is computed by the server.",
  );
  lines.push("");

  lines.push("## User input");
  lines.push("");
  if (input.description) {
    lines.push("### Description");
    lines.push(input.description);
    lines.push("");
  }
  if (input.filters) {
    lines.push("### Structured filters");
    if (input.filters.apiType) lines.push(`- API type: ${input.filters.apiType}`);
    if (input.filters.indicationArea)
      lines.push(`- Indication area: ${input.filters.indicationArea}`);
    if (input.filters.releaseProfile)
      lines.push(`- Release profile: ${input.filters.releaseProfile}`);
    if (input.filters.patientPopulation)
      lines.push(`- Patient population: ${input.filters.patientPopulation}`);
    if (input.filters.developmentStage)
      lines.push(`- Development stage: ${input.filters.developmentStage}`);
    lines.push("");
  }

  lines.push("## Propharmex SOP capability list");
  lines.push("");
  lines.push(
    "Each entry shows the dosage form, the capabilities Propharmex offers for it, optional batch-size envelope, and operational notes. Do NOT recommend a dosage form that isn't in this list.",
  );
  lines.push("");
  for (const sc of dosageMatcher.DEFAULT_SOP_CAPABILITIES) {
    lines.push(`### ${sc.dosageForm}`);
    lines.push(`Capabilities: ${sc.capabilities.join(", ")}`);
    if (
      typeof sc.batchSizeMinKg === "number" ||
      typeof sc.batchSizeMaxKg === "number"
    ) {
      const min = sc.batchSizeMinKg ?? "—";
      const max = sc.batchSizeMaxKg ?? "—";
      lines.push(`Batch size envelope (kg): ${min} → ${max}`);
    }
    if (sc.notes) lines.push(`Notes: ${sc.notes}`);
    lines.push("");
  }

  return lines.join("\n");
}

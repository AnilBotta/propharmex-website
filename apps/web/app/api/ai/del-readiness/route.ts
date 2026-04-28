/**
 * /api/ai/del-readiness — Synthesize a DEL Readiness Assessment.
 *
 * Prompt 20 PR-A. Edge runtime. Cousin of /api/ai/scoping with one big
 * architectural difference: the score is **deterministic** (computed in
 * `packages/lib/del-readiness/score.ts`) and the model is restricted to
 * the qualitative output — `gaps` + `remediation` — via tool calling.
 * That makes the readiness number reproducible across runs of the same
 * answers, which is the right contract for a regulatory tool.
 *
 * Inbound: `{ answers: AnswerMap }` (record of questionId → optionId).
 * The rubric itself is loaded server-side from `DEFAULT_RUBRIC` (Sanity
 * migration is Prompt 22).
 *
 * Outbound: streamed text (a brief drafting status the client may show)
 * plus a single tool-call frame carrying the `recommend({ gaps,
 * remediation })` payload, plus a per-message annotation carrying the
 * deterministic score so the client can render results without a second
 * round-trip.
 *
 * Reused verbatim from Prompts 18/19:
 *   - Per-IP rate limit (10 req / 5 min — assessments are heavier than
 *     scoping turns)
 *   - 503 graceful degradation when ANTHROPIC_API_KEY is missing
 *   - 429 with Retry-After when the limiter rejects
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
  delReadiness,
  env,
  getRateLimiter,
  log,
  sanity,
} from "@propharmex/lib";

export const runtime = "edge";

/* -------------------------------------------------------------------------- */
/*  Inbound schema                                                             */
/* -------------------------------------------------------------------------- */

const BodySchema = z.object({
  answers: delReadiness.AnswerMapSchema,
});

/* -------------------------------------------------------------------------- */
/*  Constants                                                                  */
/* -------------------------------------------------------------------------- */

const MAX_TOKENS = 1500;
const RATE_LIMIT_TOKENS = 10;
const RATE_LIMIT_WINDOW = "5 m" as const;

const delReadinessRateLimiter = getRateLimiter("del-readiness:ip", {
  tokens: RATE_LIMIT_TOKENS,
  window: RATE_LIMIT_WINDOW,
});

/* -------------------------------------------------------------------------- */
/*  Handler                                                                    */
/* -------------------------------------------------------------------------- */

export async function POST(req: Request) {
  // 1) Hard-fail when Anthropic isn't configured.
  if (!env.ANTHROPIC_API_KEY) {
    log.warn("del-readiness.unconfigured", { reason: "no_anthropic_key" });
    return NextResponse.json(
      {
        error:
          "Our DEL Readiness Assistant is being set up — please use the contact form for now.",
        contactUrl: "/contact?source=del-readiness-unconfigured",
      },
      { status: 503 },
    );
  }

  // 2) Per-IP rate limit.
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anon";
  const rl = await delReadinessRateLimiter.limit(ip);
  if (!rl.success) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((rl.reset - Date.now()) / 1000),
    );
    log.warn("del-readiness.rate_limited", { ip, retryAfterSeconds });
    return NextResponse.json(
      {
        error: "Too many assessments in a short window. Please wait and retry.",
        contactUrl: "/contact?source=del-readiness-rate-limited",
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
  const { answers } = parsed.data;

  // 4) Deterministic score. The rubric lives in the package; this stays
  // edge-runtime-safe because the rubric is a static const.
  const rubric = delReadiness.DEFAULT_RUBRIC;
  let scoreOnly: ReturnType<typeof delReadiness.computeScore>;
  try {
    scoreOnly = delReadiness.computeScore(rubric, answers);
  } catch (err) {
    log.warn("del-readiness.score_error", {
      message: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json(
      { error: "We couldn't score those answers — please retry." },
      { status: 400 },
    );
  }

  // 5) Build the model context. We give the model the rubric + answers +
  // computed score so its remediation suggestions are grounded in the
  // same numbers the user sees on screen.
  const config = await sanity.fetchDelReadinessPromptConfig();

  const messages: CoreMessage[] = [
    {
      role: "user",
      content: buildUserMessage({ rubric, answers, scoreOnly }),
    },
  ];

  log.info("del-readiness.invoked", {
    score: scoreOnly.score,
    trafficLight: scoreOnly.trafficLight,
    answeredCount: Object.keys(answers).length,
    model: config.model,
  });

  // 6) Stream the response. The model is asked to call `recommend` exactly
  // once with `{ gaps, remediation }`. The deterministic score is shipped
  // to the client via a per-message annotation alongside the tool call.
  const anthropic = createAnthropic({ apiKey: env.ANTHROPIC_API_KEY });

  return createDataStreamResponse({
    execute: (writer) => {
      let scoreAttached = false;

      const result = streamText({
        model: anthropic(config.model),
        system: config.systemPrompt,
        messages,
        temperature: config.temperature,
        maxTokens: MAX_TOKENS,
        tools: {
          recommend: tool({
            description:
              "Emit the qualitative DEL readiness assessment. Call exactly once with the most material gaps and a prioritized remediation plan. The numeric score is computed deterministically by the server — do not emit a score.",
            parameters: delReadiness.AssessmentRecommendationSchema,
            execute: async () => ({ ok: true } as const),
          }),
        },
        onChunk: ({ chunk }) => {
          // Attach the deterministic score on the first text-delta chunk
          // so the client can pair it with the streaming tool-call args.
          if (
            !scoreAttached &&
            (chunk.type === "text-delta" || chunk.type === "tool-call")
          ) {
            writer.writeMessageAnnotation({
              type: "del-readiness.score",
              rubricVersion: rubric.version,
              score: scoreOnly.score,
              trafficLight: scoreOnly.trafficLight,
              categoryScores: scoreOnly.categoryScores,
              disclaimer: config.disclaimer,
            });
            scoreAttached = true;
          }
        },
        onError: ({ error }) => {
          log.error("del-readiness.stream_error", {
            message: error instanceof Error ? error.message : String(error),
            model: config.model,
          });
        },
      });

      result.mergeIntoDataStream(writer);
    },
    onError: (error) => {
      log.error("del-readiness.data_stream_error", {
        message: error instanceof Error ? error.message : String(error),
      });
      return "An error occurred while drafting your assessment — please try again.";
    },
  });
}

/* -------------------------------------------------------------------------- */
/*  User-message builder                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Format the rubric, the user's answers, and the deterministic score into
 * a single user-message payload the model can ground its `recommend` call
 * on. Plain Markdown — keeps token usage low and parseability high.
 */
function buildUserMessage(input: {
  rubric: delReadiness.Rubric;
  answers: delReadiness.AnswerMap;
  scoreOnly: ReturnType<typeof delReadiness.computeScore>;
}): string {
  const { rubric, answers, scoreOnly } = input;
  const lines: string[] = [];

  lines.push("# DEL Readiness Assessment — synthesize");
  lines.push("");
  lines.push(
    `Rubric version ${rubric.version}. Determine the most material gaps and a prioritized remediation plan, then call \`recommend\`. Do NOT emit a score — that has already been computed.`,
  );
  lines.push("");
  lines.push("## Computed score");
  lines.push("");
  lines.push(
    `- Overall: **${scoreOnly.score} / 100** (${scoreOnly.trafficLight})`,
  );
  for (const cs of scoreOnly.categoryScores) {
    const cat = rubric.categories.find((c) => c.id === cs.category);
    lines.push(
      `- ${cat?.label ?? cs.category}: ${cs.score} / 100 (${cs.trafficLight})`,
    );
  }
  lines.push("");
  lines.push("## Rubric");
  lines.push("");
  for (const cat of rubric.categories) {
    lines.push(`### ${cat.label}`);
    lines.push(cat.description);
    lines.push("");
    const qs = rubric.questions.filter((q) => q.category === cat.id);
    for (const q of qs) {
      lines.push(`**Q: ${q.prompt}**`);
      if (q.helpText) lines.push(`*Context: ${q.helpText}*`);
      const chosen = answers[q.id];
      const chosenOpt = q.options.find((o) => o.id === chosen);
      lines.push(`Answer: ${chosenOpt?.label ?? "(not answered)"}`);
      lines.push("");
    }
  }

  return lines.join("\n");
}

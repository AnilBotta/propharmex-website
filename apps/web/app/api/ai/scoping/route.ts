/**
 * /api/ai/scoping — streaming chat endpoint for the Project Scoping Assistant.
 *
 * Prompt 19 PR-A. Cousin of /api/ai/concierge with two key differences:
 *
 *   1. NO retrieval. The scope is built from the conversation itself, not
 *      from the Propharmex content corpus.
 *   2. TOOL CALLING. The model MUST end the conversation by calling a single
 *      `proposeScope` tool whose `parameters` is the canonical
 *      `ScopeSummarySchema`. The structured args become the deliverable —
 *      they populate the client-side preview card and (in PR-B) the BD
 *      email + PDF.
 *
 * Hard guardrails (baked into the system prompt — see FALLBACK_SCOPING_CONFIG):
 *   - No medical advice
 *   - No regulatory promise
 *   - Always offer the /contact escape hatch
 *
 * Reused from Prompt 18 PR-C verbatim:
 *   - Per-IP rate limit (15 req / 5 min — looser than Concierge because
 *     scoping sessions are longer and lower-volume)
 *   - Inbound PII redaction (email, phone, "my name is X")
 *   - 503 graceful degradation when ANTHROPIC_API_KEY is missing
 *
 * PR-B will add: telemetry, submit-to-BD route, PDF route, Supabase
 * scoping_sessions persistence, Playwright e2e.
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
  env,
  getRateLimiter,
  log,
  redact,
  sanity,
  scoping,
} from "@propharmex/lib";

export const runtime = "edge";

/* -------------------------------------------------------------------------- */
/*  Inbound schema                                                             */
/* -------------------------------------------------------------------------- */

const MessageRoleSchema = z.enum(["user", "assistant", "system"]);

const MessageSchema = z.object({
  id: z.string().optional(),
  role: MessageRoleSchema,
  content: z.string().min(1).max(8000),
});

const BodySchema = z.object({
  messages: z.array(MessageSchema).min(1).max(40),
});

/* -------------------------------------------------------------------------- */
/*  Constants                                                                  */
/* -------------------------------------------------------------------------- */

const MAX_TOKENS = 1200;
const RATE_LIMIT_TOKENS = 15;
const RATE_LIMIT_WINDOW = "5 m" as const;

// Module-scope singleton — `getRateLimiter` caches by `(scope, opts)` so this
// is just a one-time lookup. Edge workers may instantiate per cold start; the
// underlying Redis client is HTTP-stateless.
const scopingRateLimiter = getRateLimiter("scoping:ip", {
  tokens: RATE_LIMIT_TOKENS,
  window: RATE_LIMIT_WINDOW,
});

/* -------------------------------------------------------------------------- */
/*  Handler                                                                    */
/* -------------------------------------------------------------------------- */

export async function POST(req: Request) {
  // 1) Hard-fail when Anthropic isn't configured. The page UI handles 503
  // by surfacing the same "being provisioned" copy as the Concierge.
  if (!env.ANTHROPIC_API_KEY) {
    log.warn("scoping.unconfigured", { reason: "no_anthropic_key" });
    return NextResponse.json(
      {
        error:
          "Our Scoping Assistant is being set up — please use the contact form for now.",
        contactUrl: "/contact?source=scoping-unconfigured",
      },
      { status: 503 },
    );
  }

  // 2) Per-IP rate limit. Cloned from concierge — same x-forwarded-for
  // parsing, different scope + window.
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anon";
  const rl = await scopingRateLimiter.limit(ip);
  if (!rl.success) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((rl.reset - Date.now()) / 1000),
    );
    log.warn("scoping.rate_limited", {
      ip,
      limit: rl.limit,
      retryAfterSeconds,
    });
    return NextResponse.json(
      {
        error: "Too many requests. Please wait a moment and try again.",
        contactUrl: "/contact?source=scoping-rate-limited",
      },
      {
        status: 429,
        headers: { "Retry-After": String(retryAfterSeconds) },
      },
    );
  }

  // 3) Parse + validate the inbound body.
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 },
    );
  }
  const parsed = BodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request shape." },
      { status: 400 },
    );
  }
  const { messages: rawMessages } = parsed.data;

  // 4) Redact PII from EVERY user message in the history before any of it
  // reaches the model or the logger. Assistant / system messages pass through.
  let totalRedactionCount = 0;
  const messages = rawMessages.map((m) => {
    if (m.role !== "user") return m;
    const { redactedText, redactionCount } = redact(m.content);
    totalRedactionCount += redactionCount;
    return redactionCount > 0 ? { ...m, content: redactedText } : m;
  });
  if (totalRedactionCount > 0) {
    log.info("scoping.redacted", { count: totalRedactionCount });
  }

  // 5) Fetch the Scoping prompt config (Sanity → fallback).
  const config = await sanity.fetchScopingPromptConfig();

  log.info("scoping.invoked", {
    historyLength: messages.length,
    model: config.model,
  });

  // 6) Stream the response. The model is given a single `proposeScope` tool
  // whose `parameters` is `ScopeSummarySchema`. When the model calls it, the
  // tool args land on `message.toolInvocations` on the client and populate
  // the preview card. The tool's `execute` is a server-side no-op — we don't
  // need to react to the call, the structured args ARE the deliverable.
  const anthropic = createAnthropic({ apiKey: env.ANTHROPIC_API_KEY });

  return createDataStreamResponse({
    execute: (writer) => {
      const result = streamText({
        model: anthropic(config.model),
        system: config.systemPrompt,
        messages: messages as CoreMessage[],
        temperature: config.temperature,
        maxTokens: MAX_TOKENS,
        tools: {
          proposeScope: tool({
            description:
              "Emit the structured project scope summary. Call this exactly once per conversation, after you have enough information to fill every required field.",
            parameters: scoping.ScopeSummarySchema,
            execute: async () => {
              // The structured args ARE the deliverable. Nothing to do
              // server-side — just acknowledge so the SDK marks the tool
              // call as resolved and ends the turn cleanly.
              return { ok: true } as const;
            },
          }),
        },
        onError: ({ error }) => {
          log.error("scoping.stream_error", {
            message: error instanceof Error ? error.message : String(error),
            model: config.model,
          });
        },
      });

      result.mergeIntoDataStream(writer);
    },
    onError: (error) => {
      log.error("scoping.data_stream_error", {
        message: error instanceof Error ? error.message : String(error),
      });
      return "An error occurred while drafting the scope — please try again.";
    },
  });
}

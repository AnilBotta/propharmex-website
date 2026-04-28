/**
 * /api/ai/concierge — streaming chat endpoint for the CDMO Concierge.
 *
 * Prompt 18 PR-B. Wires the four pieces shipped in PR-A + PR-B together:
 *   1. Validate the inbound chat history (Zod)
 *   2. Fetch the system prompt from Sanity, with hardcoded fallback
 *   3. Embed the user's last message and retrieve top-k chunks
 *   4. Inject a numbered context block into the system prompt
 *   5. Stream a Claude response back via the Vercel AI SDK
 *   6. Append a sources footer (one line per cited chunk) when streaming completes
 *
 * Hard guardrails baked into the system prompt (per Prompt 18 spec):
 *   - No medical advice
 *   - No regulatory promise
 *   - Always cite + always offer the "Talk to a human" handoff
 *
 * Graceful degradation:
 *   - Missing ANTHROPIC_API_KEY → 503 with friendly "being provisioned" body
 *   - Missing OPENAI_API_KEY or Supabase down → answer streams without citations
 *     (still safer than 500), context block omitted, no sources footer
 *   - Anthropic 5xx → automatic retry once via the AI SDK; otherwise client
 *     sees a stream-error and the bubble shows the generic "try again" copy
 *
 * Hardening (PR-C):
 *   - Per-IP sliding-window rate limit (10 req / minute) via Upstash; no-op
 *     fallback when Upstash isn't configured so dev / CI without keys still
 *     work
 *   - Inbound PII redaction (emails, phones, "my name is X") before the
 *     message reaches the model or any logger
 */
import { createAnthropic } from "@ai-sdk/anthropic";
import { createDataStreamResponse, streamText, type CoreMessage } from "ai";
import { NextResponse } from "next/server";
import { z } from "zod";

import {
  env,
  getRateLimiter,
  log,
  rag,
  redact,
  sanity,
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

const TOP_K = 8;
const MIN_RETRIEVAL_SCORE = 0.2;
const MAX_TOKENS = 800;
const RATE_LIMIT_TOKENS = 10;
const RATE_LIMIT_WINDOW = "1 m" as const;

// Module-scope singleton — `getRateLimiter` caches by `(scope, opts)` so this
// is just a one-time lookup. Edge workers may instantiate this per cold start
// but the underlying Redis client is HTTP-stateless.
const conciergeRateLimiter = getRateLimiter("concierge:ip", {
  tokens: RATE_LIMIT_TOKENS,
  window: RATE_LIMIT_WINDOW,
});

/* -------------------------------------------------------------------------- */
/*  Handler                                                                    */
/* -------------------------------------------------------------------------- */

export async function POST(req: Request) {
  // 1) Hard-fail when Anthropic isn't configured. The bubble UI handles 503
  // explicitly with a "being provisioned" message that points to /contact.
  if (!env.ANTHROPIC_API_KEY) {
    log.warn("concierge.unconfigured", { reason: "no_anthropic_key" });
    return NextResponse.json(
      {
        error:
          "Our Concierge is being set up — please use the contact form for now.",
        contactUrl: "/contact?source=concierge-unconfigured",
      },
      { status: 503 },
    );
  }

  // 2) Per-IP rate limit. `x-forwarded-for` may carry a comma-separated list
  // (`client, proxy1, proxy2`); the leftmost entry is the originating client.
  // Falls through to "anon" when the header is absent (local dev, curl).
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anon";
  const rl = await conciergeRateLimiter.limit(ip);
  if (!rl.success) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((rl.reset - Date.now()) / 1000),
    );
    log.warn("concierge.rate_limited", {
      ip,
      limit: rl.limit,
      retryAfterSeconds,
    });
    return NextResponse.json(
      {
        error: "Too many requests. Please wait a moment and try again.",
        contactUrl: "/contact?source=concierge-rate-limited",
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
  // reaches the model, the logger, or downstream retrieval. Assistant /
  // system messages are passed through unchanged.
  let totalRedactionCount = 0;
  const messages = rawMessages.map((m) => {
    if (m.role !== "user") return m;
    const { redactedText, redactionCount } = redact(m.content);
    totalRedactionCount += redactionCount;
    return redactionCount > 0 ? { ...m, content: redactedText } : m;
  });
  if (totalRedactionCount > 0) {
    // Count only — never the content. The redaction itself prevents the PII
    // from showing up in any subsequent log line.
    log.info("concierge.redacted", { count: totalRedactionCount });
  }

  // 5) Pull the most recent user message for retrieval (already redacted).
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUser) {
    return NextResponse.json(
      { error: "No user message in history." },
      { status: 400 },
    );
  }

  // 6) Fetch the Concierge config (Sanity → fallback).
  const config = await sanity.fetchConciergePromptConfig();

  // 7) Retrieve top-k chunks. Falls through to [] on missing OpenAI/Supabase
  // keys or RPC errors — the model still answers, just without citations.
  let chunks: rag.RetrievedChunk[] = [];
  try {
    chunks = await rag.retrieve(lastUser.content, {
      topK: TOP_K,
      minScore: MIN_RETRIEVAL_SCORE,
    });
  } catch (err) {
    log.warn("concierge.retrieve_failed", {
      message: err instanceof Error ? err.message : String(err),
    });
  }

  // 8) Build the context block. Numbering here matches the [N] markers the
  // model will produce in its reply.
  const contextBlock = buildContextBlock(chunks);
  const sourcesPayload = chunks.map((c, i) => ({
    n: i + 1,
    title: c.sourceTitle,
    section: c.section,
    url: c.sourceUrl,
  }));

  const systemPrompt = contextBlock
    ? `${config.systemPrompt}\n\n${contextBlock}`
    : `${config.systemPrompt}\n\n# Retrieval\n\nNo Propharmex source chunks were retrieved for this question. Answer from general knowledge of pharma/CDMO operations and explicitly note that you don't have a Propharmex source to cite. Still suggest the /contact handoff at the end.`;

  log.info("concierge.invoked", {
    chunkCount: chunks.length,
    historyLength: messages.length,
    model: config.model,
  });

  // 9) Stream the response via the AI SDK's data-stream protocol. We use
  // `createDataStreamResponse` (rather than the simpler
  // `result.toDataStreamResponse()`) so we can also attach the sources list
  // + disclaimer to the assistant message as a structured annotation (frame
  // type `8:` — `writeMessageAnnotation`). Annotations bind to the message
  // itself, so there's no id race like there would be with broadcast
  // `writeData` (frame type `2:`) on a global `data` array.
  //
  // The annotation is written from `onChunk` after the FIRST text delta —
  // by that point the assistant message exists on the client, so the
  // annotation gets associated with it correctly.
  const anthropic = createAnthropic({ apiKey: env.ANTHROPIC_API_KEY });

  return createDataStreamResponse({
    execute: (writer) => {
      let annotationWritten = false;

      const result = streamText({
        model: anthropic(config.model),
        system: systemPrompt,
        messages: messages as CoreMessage[],
        temperature: config.temperature,
        maxTokens: MAX_TOKENS,
        onChunk: ({ chunk }) => {
          // Fire once, on the first text delta. By now the assistant
          // message exists on the client side; the annotation will be
          // attached to its `annotations` array.
          if (!annotationWritten && chunk.type === "text-delta") {
            writer.writeMessageAnnotation({
              type: "concierge.meta",
              sources: sourcesPayload,
              disclaimer: config.disclaimer,
            });
            annotationWritten = true;
          }
        },
        onError: ({ error }) => {
          // Anthropic / network errors that surface mid-stream. The default SDK
          // error frame in the response body is generic ("An error occurred."),
          // so we log the actual reason here for dev + ops visibility. Never
          // log the user's message body — only structured metadata.
          log.error("concierge.stream_error", {
            message: error instanceof Error ? error.message : String(error),
            model: config.model,
          });
        },
      });

      // Pipe the model's text deltas into the same data stream.
      result.mergeIntoDataStream(writer);
    },
    onError: (error) => {
      // Top-level stream errors (e.g. writer-level failures) surface here.
      log.error("concierge.data_stream_error", {
        message: error instanceof Error ? error.message : String(error),
      });
      return "An error occurred while answering — please try again.";
    },
  });
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Render the retrieved chunks into a numbered context block the model can
 * cite from. The model is instructed (in the system prompt) to use the
 * numbers as inline `[N]` markers.
 */
function buildContextBlock(chunks: rag.RetrievedChunk[]): string {
  if (chunks.length === 0) return "";
  const lines = chunks.map((c, i) => {
    const n = i + 1;
    return `[${n}] ${c.sourceTitle} — ${c.section} (${c.sourceUrl})\n${c.content}`;
  });
  return [
    "# Retrieved Propharmex sources",
    "",
    "Cite from these using inline `[N]` markers that match the numbers below.",
    "Do not cite numbers that aren't in this list. Do not invent sources.",
    "",
    lines.join("\n\n---\n\n"),
  ].join("\n");
}

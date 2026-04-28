/**
 * Embedder — wraps OpenAI's text-embedding-3-large at 1536 dims.
 *
 * Used by:
 *   - apps/web/scripts/ingest-content.mjs (batched embedding of all chunks)
 *   - packages/lib/rag/retrieve.ts (single-query embedding at runtime)
 *
 * No-op fallback when OPENAI_API_KEY is missing — returns null. Callers must
 * handle null (the ingest script logs and skips; the retrieve helper falls
 * through to an empty result so the chat endpoint still answers without
 * citations).
 */
import { env } from "../env";
import { log } from "../log";

import { EMBEDDING_DIMENSIONS, EMBEDDING_MODEL } from "./types";

/** Max texts per OpenAI embeddings API call. The API supports more, but
 *  smaller batches keep memory pressure predictable in serverless. */
const BATCH_SIZE = 32;

/** Max retries on transient OpenAI failures (429, 5xx). */
const MAX_RETRIES = 3;

/**
 * Embed a single string. Returns null when OPENAI_API_KEY is unset.
 */
export async function embedQuery(text: string): Promise<number[] | null> {
  const result = await embedTexts([text]);
  return result?.[0] ?? null;
}

/**
 * Embed a batch of strings. Returns null when OPENAI_API_KEY is unset (so
 * the caller can decide how to fall back).
 *
 * Splits internally into BATCH_SIZE-sized requests and concatenates results.
 * Order is preserved — output[i] is the embedding of input[i].
 */
export async function embedTexts(
  texts: string[],
): Promise<number[][] | null> {
  if (!env.OPENAI_API_KEY) {
    log.warn("rag.embed.no_key", { count: texts.length });
    return null;
  }
  if (texts.length === 0) return [];

  const out: number[][] = [];
  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE);
    const vectors = await callOpenAIEmbeddings(batch);
    out.push(...vectors);
  }
  return out;
}

async function callOpenAIEmbeddings(input: string[]): Promise<number[][]> {
  const apiKey = env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY missing — should have been caught upstream.");
  }

  let lastError: unknown = null;
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const res = await fetch("https://api.openai.com/v1/embeddings", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: EMBEDDING_MODEL,
          input,
          dimensions: EMBEDDING_DIMENSIONS,
        }),
      });

      if (!res.ok) {
        const status = res.status;
        const body = await res.text().catch(() => "<no body>");
        // Retry on 429 + 5xx; bail on other 4xx.
        if (status === 429 || status >= 500) {
          throw new RetryableError(`OpenAI embeddings ${status}: ${body}`);
        }
        throw new Error(`OpenAI embeddings ${status}: ${body}`);
      }

      const json = (await res.json()) as {
        data: { embedding: number[]; index: number }[];
      };

      // Sort by index defensively (OpenAI guarantees order, but cheap insurance).
      const sorted = [...json.data].sort((a, b) => a.index - b.index);
      return sorted.map((d) => d.embedding);
    } catch (err) {
      lastError = err;
      if (!(err instanceof RetryableError)) throw err;
      // Exponential backoff: 500ms, 1000ms, 2000ms.
      const delay = 500 * 2 ** attempt;
      log.warn("rag.embed.retry", {
        attempt: attempt + 1,
        delayMs: delay,
        message: err.message,
      });
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw lastError ?? new Error("OpenAI embeddings failed after retries.");
}

class RetryableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RetryableError";
  }
}

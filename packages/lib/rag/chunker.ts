/**
 * Chunker — splits free-form text into ~500-token chunks at paragraph
 * boundaries with a small overlap.
 *
 * Inputs are typically already small (single section paragraphs from the
 * content modules), so the chunker mostly passes them through unchanged. It
 * only kicks in for long-form prose like the insights articles, where a single
 * paragraph block can exceed the target.
 *
 * Token estimate uses 4 chars/token — accurate enough for chunk-size budgeting
 * without pulling in a tokenizer library.
 */
import type { Chunk, ContentType } from "./types";

const TARGET_TOKENS = 500;
const OVERLAP_TOKENS = 50;
const CHARS_PER_TOKEN = 4;

const TARGET_CHARS = TARGET_TOKENS * CHARS_PER_TOKEN; // 2000
const OVERLAP_CHARS = OVERLAP_TOKENS * CHARS_PER_TOKEN; // 200

export type ChunkInput = {
  text: string;
  sourceUrl: string;
  sourceTitle: string;
  section: string;
  contentType: ContentType;
};

/**
 * Build a deterministic chunk id from source + section + index. Same inputs
 * always produce the same id, so re-running ingest is idempotent without a
 * separate diffing pass.
 */
export function buildChunkId(
  contentType: ContentType,
  sourceUrl: string,
  section: string,
  index: number,
): string {
  const slug = section
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return `${contentType}:${sourceUrl}:${slug}:${index}`;
}

/**
 * Normalise whitespace without losing paragraph structure. Collapses runs of
 * spaces but preserves \n\n boundaries so the splitter has something to work
 * with.
 */
function normalise(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Split a string into paragraph-shaped pieces. Empty pieces are dropped.
 */
function splitParagraphs(text: string): string[] {
  return text
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/**
 * Split a too-long single paragraph at sentence boundaries, falling back to
 * a hard char-cut if a sentence is itself longer than the target.
 */
function splitLongParagraph(paragraph: string): string[] {
  if (paragraph.length <= TARGET_CHARS) return [paragraph];

  const sentences = paragraph.match(/[^.!?]+[.!?]+(?:\s|$)|[^.!?]+$/g) ?? [paragraph];
  const out: string[] = [];
  let buf = "";
  for (const sentence of sentences) {
    if (buf.length + sentence.length > TARGET_CHARS && buf.length > 0) {
      out.push(buf.trim());
      buf = "";
    }
    if (sentence.length > TARGET_CHARS) {
      // Hard cut for absurdly long sentences (rare).
      for (let i = 0; i < sentence.length; i += TARGET_CHARS) {
        out.push(sentence.slice(i, i + TARGET_CHARS).trim());
      }
    } else {
      buf += sentence;
    }
  }
  if (buf.trim()) out.push(buf.trim());
  return out;
}

/**
 * Group paragraphs into chunks ~TARGET_CHARS each, with overlap_chars worth of
 * trailing text from the previous chunk repeated at the start of the next.
 * Overlap improves retrieval recall when a question's answer spans a chunk
 * boundary.
 */
function groupParagraphs(paragraphs: string[]): string[] {
  const chunks: string[] = [];
  let buf = "";
  for (const para of paragraphs) {
    const candidates = splitLongParagraph(para);
    for (const piece of candidates) {
      if (buf.length === 0) {
        buf = piece;
        continue;
      }
      if (buf.length + 2 + piece.length <= TARGET_CHARS) {
        buf += `\n\n${piece}`;
      } else {
        chunks.push(buf);
        // Carry the trailing overlap into the next buffer.
        const tail = buf.length > OVERLAP_CHARS ? buf.slice(-OVERLAP_CHARS) : "";
        buf = tail ? `${tail}\n\n${piece}` : piece;
      }
    }
  }
  if (buf.trim()) chunks.push(buf);
  return chunks;
}

/**
 * Chunk one section's text and return the resulting Chunk records.
 *
 * Most sections produce exactly one chunk (sections are usually short).
 * Long-form prose (insights articles) may produce 2–4.
 */
export function chunkSection(input: ChunkInput): Chunk[] {
  const text = normalise(input.text);
  if (!text) return [];

  const paragraphs = splitParagraphs(text);
  const grouped = groupParagraphs(paragraphs);

  return grouped.map((content, index) => ({
    id: buildChunkId(input.contentType, input.sourceUrl, input.section, index),
    content,
    sourceUrl: input.sourceUrl,
    sourceTitle: input.sourceTitle,
    section: input.section,
    contentType: input.contentType,
  }));
}

/**
 * Convenience: chunk a list of sections in one call. Used by the source
 * extractors that already know their section structure.
 */
export function chunkSections(inputs: ChunkInput[]): Chunk[] {
  return inputs.flatMap(chunkSection);
}

// Exported for unit tests only.
export const __test = {
  TARGET_CHARS,
  OVERLAP_CHARS,
  normalise,
  splitParagraphs,
  splitLongParagraph,
  groupParagraphs,
};

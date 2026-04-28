/**
 * Unit tests for the chunker — boundary cases, overlap, metadata, id stability.
 */
import { describe, expect, it } from "vitest";

import { buildChunkId, chunkSection, chunkSections, __test } from "../chunker";

describe("buildChunkId", () => {
  it("produces a stable, slugified id", () => {
    const id = buildChunkId("page", "/about", "Founding story", 0);
    expect(id).toBe("page:/about:founding-story:0");
  });

  it("collapses non-alphanumerics to single dashes", () => {
    const id = buildChunkId("service", "/x", "Method development & validation!", 3);
    expect(id).toBe("service:/x:method-development-validation:3");
  });

  it("trims leading/trailing dashes from the slug", () => {
    const id = buildChunkId("page", "/x", "—dash boundary—", 0);
    expect(id).toBe("page:/x:dash-boundary:0");
  });

  it("is deterministic for unchanged inputs", () => {
    const a = buildChunkId("page", "/x", "Section A", 0);
    const b = buildChunkId("page", "/x", "Section A", 0);
    expect(a).toBe(b);
  });
});

describe("chunkSection", () => {
  it("returns one chunk for a short section", () => {
    const chunks = chunkSection({
      text: "A short paragraph that fits comfortably under the target.",
      sourceUrl: "/x",
      sourceTitle: "X",
      section: "Intro",
      contentType: "page",
    });
    expect(chunks).toHaveLength(1);
    expect(chunks[0]?.content).toContain("short paragraph");
    expect(chunks[0]?.id).toBe("page:/x:intro:0");
  });

  it("returns no chunks for empty input", () => {
    expect(
      chunkSection({
        text: "   \n\n   ",
        sourceUrl: "/x",
        sourceTitle: "X",
        section: "Intro",
        contentType: "page",
      }),
    ).toHaveLength(0);
  });

  it("preserves metadata across chunks", () => {
    const para = "word ".repeat(600); // ~3000 chars, exceeds 2000-char target
    const long = `${para}\n\n${para}`;
    const chunks = chunkSection({
      text: long,
      sourceUrl: "/services/x",
      sourceTitle: "X",
      section: "Long Section",
      contentType: "service",
    });
    expect(chunks.length).toBeGreaterThan(1);
    for (const chunk of chunks) {
      expect(chunk.sourceUrl).toBe("/services/x");
      expect(chunk.section).toBe("Long Section");
      expect(chunk.contentType).toBe("service");
    }
  });

  it("produces chunks within the target size", () => {
    const para = "word ".repeat(800); // very long
    const chunks = chunkSection({
      text: para,
      sourceUrl: "/x",
      sourceTitle: "X",
      section: "Big",
      contentType: "page",
    });
    for (const chunk of chunks) {
      // Allow overshoot up to one full overlap window — when the buffer
      // already ~= TARGET_CHARS and the next paragraph forces a flush, the
      // carried-over OVERLAP_CHARS prefix can sit on top of a near-full
      // chunk before the next flush triggers.
      expect(chunk.content.length).toBeLessThanOrEqual(
        __test.TARGET_CHARS + __test.OVERLAP_CHARS + 100,
      );
    }
  });

  it("preserves overlap between consecutive chunks", () => {
    const a = "alpha ".repeat(400); // ~2400 chars
    const b = "beta ".repeat(400);
    const text = `${a}\n\n${b}`;
    const chunks = chunkSection({
      text,
      sourceUrl: "/x",
      sourceTitle: "X",
      section: "Overlap",
      contentType: "page",
    });
    if (chunks.length < 2) return;
    // The second chunk's start should overlap with the first chunk's tail.
    const first = chunks[0]?.content ?? "";
    const second = chunks[1]?.content ?? "";
    const tail = first.slice(-50);
    expect(second.includes(tail.slice(0, 20))).toBe(true);
  });
});

describe("chunkSections", () => {
  it("flattens chunks across multiple inputs", () => {
    const inputs = [
      {
        text: "first section text long enough to chunk.",
        sourceUrl: "/a",
        sourceTitle: "A",
        section: "Alpha",
        contentType: "page" as const,
      },
      {
        text: "second section text long enough to chunk.",
        sourceUrl: "/b",
        sourceTitle: "B",
        section: "Beta",
        contentType: "service" as const,
      },
    ];
    const chunks = chunkSections(inputs);
    expect(chunks.length).toBe(2);
    expect(chunks[0]?.sourceUrl).toBe("/a");
    expect(chunks[1]?.sourceUrl).toBe("/b");
  });
});

describe("__test internals", () => {
  it("normalises CRLF and collapses whitespace", () => {
    const out = __test.normalise("a\r\nb   c\n\n\nd");
    expect(out).toBe("a\nb c\n\nd");
  });

  it("splits on paragraph boundaries", () => {
    const paragraphs = __test.splitParagraphs("p1\n\np2\n\n\np3");
    expect(paragraphs).toEqual(["p1", "p2", "p3"]);
  });
});

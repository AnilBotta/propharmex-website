import { describe, expect, it } from "vitest";

import { redact } from "./redact";

describe("redact — emails", () => {
  it("redacts a simple email", () => {
    const r = redact("Reach me at foo@bar.com please");
    expect(r.redactedText).toBe("Reach me at [redacted email] please");
    expect(r.redactionCount).toBe(1);
  });

  it("redacts multiple emails and counts each", () => {
    const r = redact("a@b.co and c+tag@sub.example.org");
    expect(r.redactedText).toBe("[redacted email] and [redacted email]");
    expect(r.redactionCount).toBe(2);
  });

  it("does not match strings that are not emails", () => {
    const r = redact("see chunk @ index 42 — version 2.0");
    expect(r.redactedText).toBe("see chunk @ index 42 — version 2.0");
    expect(r.redactionCount).toBe(0);
  });
});

describe("redact — phones", () => {
  it("redacts a NA-format phone with parens", () => {
    const r = redact("Call +1 (416) 555-1234 anytime");
    expect(r.redactedText).toBe("Call [redacted phone] anytime");
    expect(r.redactionCount).toBe(1);
  });

  it("redacts a dash-separated phone", () => {
    const r = redact("416-555-1234");
    expect(r.redactedText).toBe("[redacted phone]");
    expect(r.redactionCount).toBe(1);
  });

  it("redacts an intl-format phone", () => {
    const r = redact("My UK line is +44 20 7946 0958.");
    expect(r.redactedText).toBe("My UK line is [redacted phone].");
    expect(r.redactionCount).toBe(1);
  });

  it("does not match plain integers without separators", () => {
    const r = redact("We ingested 457 chunks across 46 pages.");
    expect(r.redactedText).toBe("We ingested 457 chunks across 46 pages.");
    expect(r.redactionCount).toBe(0);
  });
});

describe("redact — self-identification", () => {
  it("redacts 'my name is X'", () => {
    const r = redact("Hi, my name is Anil and I have a question.");
    expect(r.redactedText).toBe("Hi, [redacted name] and I have a question.");
    expect(r.redactionCount).toBe(1);
  });

  it("redacts 'I am X Y'", () => {
    const r = redact("I am Sarah Khan from Acme Pharma.");
    expect(r.redactedText).toBe("[redacted name] from Acme Pharma.");
    expect(r.redactionCount).toBe(1);
  });

  it("redacts \"I'm X\"", () => {
    const r = redact("I'm Tom — quick question.");
    expect(r.redactedText).toBe("[redacted name] — quick question.");
    expect(r.redactionCount).toBe(1);
  });

  it("does NOT match common-noun cases", () => {
    const cases = [
      "I'm hungry.",
      "I am a developer.",
      "I'm not sure what you mean.",
      "my name is unclear to me",
    ];
    for (const text of cases) {
      const r = redact(text);
      expect(r.redactedText).toBe(text);
      expect(r.redactionCount).toBe(0);
    }
  });
});

describe("redact — combined + idempotency", () => {
  it("counts each PII pass independently in a mixed message", () => {
    const r = redact(
      "Hi, my name is Anil. Email me at anil@example.com or call +1 (416) 555-1234.",
    );
    expect(r.redactionCount).toBe(3);
    expect(r.redactedText).toContain("[redacted name]");
    expect(r.redactedText).toContain("[redacted email]");
    expect(r.redactedText).toContain("[redacted phone]");
  });

  it("is idempotent on already-redacted text", () => {
    const once = redact("Email a@b.co and call 416-555-1234.");
    const twice = redact(once.redactedText);
    expect(twice.redactedText).toBe(once.redactedText);
    expect(twice.redactionCount).toBe(0);
  });
});

import { describe, expect, it } from "vitest";

import { classifyReferrer } from "./referrer";

const SITE_HOST = "propharmex.com";

describe("classifyReferrer", () => {
  it("returns direct when referrer is missing or empty", () => {
    expect(classifyReferrer(undefined, SITE_HOST)).toBe("direct");
    expect(classifyReferrer(null, SITE_HOST)).toBe("direct");
    expect(classifyReferrer("", SITE_HOST)).toBe("direct");
  });

  it("returns direct when the referrer URL is malformed", () => {
    expect(classifyReferrer("not-a-url", SITE_HOST)).toBe("direct");
  });

  it("classifies same-origin referrers as internal", () => {
    expect(
      classifyReferrer("https://propharmex.com/insights", SITE_HOST),
    ).toBe("internal");
  });

  it("classifies major search engines as search", () => {
    expect(
      classifyReferrer("https://www.google.com/search?q=cdmo", SITE_HOST),
    ).toBe("search");
    expect(classifyReferrer("https://www.bing.com/", SITE_HOST)).toBe("search");
    expect(classifyReferrer("https://duckduckgo.com/", SITE_HOST)).toBe(
      "search",
    );
    expect(classifyReferrer("https://yandex.ru/", SITE_HOST)).toBe("search");
  });

  it("classifies AI answer engines as ai", () => {
    expect(classifyReferrer("https://chatgpt.com/c/abc", SITE_HOST)).toBe(
      "ai",
    );
    expect(classifyReferrer("https://claude.ai/chat/123", SITE_HOST)).toBe(
      "ai",
    );
    expect(
      classifyReferrer("https://www.perplexity.ai/search/foo", SITE_HOST),
    ).toBe("ai");
    expect(classifyReferrer("https://gemini.google.com/", SITE_HOST)).toBe(
      "ai",
    );
  });

  it("classifies social platforms as social", () => {
    expect(
      classifyReferrer("https://www.linkedin.com/feed", SITE_HOST),
    ).toBe("social");
    expect(classifyReferrer("https://t.co/abc", SITE_HOST)).toBe("social");
    expect(classifyReferrer("https://x.com/elon/status/1", SITE_HOST)).toBe(
      "social",
    );
    expect(
      classifyReferrer("https://www.reddit.com/r/pharma", SITE_HOST),
    ).toBe("social");
  });

  it("classifies unknown hosts as external", () => {
    expect(
      classifyReferrer("https://newsletter.example.com/issue/12", SITE_HOST),
    ).toBe("external");
    expect(classifyReferrer("https://example.org/", SITE_HOST)).toBe(
      "external",
    );
  });

  it("treats subdomains of AI / social hosts correctly", () => {
    expect(classifyReferrer("https://chat.openai.com/", SITE_HOST)).toBe("ai");
    expect(
      classifyReferrer("https://www.linkedin.com/in/someone", SITE_HOST),
    ).toBe("social");
  });
});

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  join(process.cwd(), "components/concierge/ConciergeBubble.tsx"),
  "utf8"
);

describe("ConciergeBubble bundle boundary", () => {
  it("keeps Framer Motion out of the site-wide launcher chunk", () => {
    expect(source).not.toContain("framer-motion");
  });

  it("keeps the chat panel behind a dynamic import", () => {
    expect(source).toContain("dynamic(");
    expect(source).toContain('import("./ConciergePanel")');
  });
});

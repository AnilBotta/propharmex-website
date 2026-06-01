import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(join(process.cwd(), "app/layout.tsx"), "utf8");

describe("RootLayout bundle boundary", () => {
  it("keeps visual editing out of the non-draft layout tree", () => {
    expect(source).toContain('await import("../components/site/VisualEditing")');
    expect(source).toContain("{VisualEditing ? <VisualEditing enabled /> : null}");
    expect(source).not.toContain("<VisualEditing enabled={isDraftEnabled} />");
    expect(source).not.toContain(
      'import { VisualEditing } from "../components/site/VisualEditing";'
    );
  });
});

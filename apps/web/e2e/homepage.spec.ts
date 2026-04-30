/**
 * Homepage smoke (Prompt 27 B2).
 *
 * Asserts the publicly-visible top of the funnel: hero renders with a
 * level-1 heading, the primary CTA is a real link to a real route, and
 * no console errors leak during initial paint. Does NOT exercise the
 * Concierge bubble (covered separately in concierge.spec.ts) or any AI
 * SDK code path. Runs without network credentials — pure structural
 * verification of the marketing surface.
 */
import { expect, test } from "@playwright/test";

test.describe("Homepage", () => {
  test("loads with hero heading + working primary CTA", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    const response = await page.goto("/");
    expect(response?.status()).toBe(200);

    // Hero heading is the H1 on the homepage and uses a stable id from
    // components/home/Hero.tsx for the aria-labelledby relationship.
    const heroHeading = page.locator("#home-hero-heading");
    await expect(heroHeading).toBeVisible();

    // Header is present (covered by the SkipToContent + Header pair).
    const header = page.getByRole("banner");
    await expect(header).toBeVisible();

    // Footer is present.
    const footer = page.getByRole("contentinfo");
    await expect(footer).toBeVisible();

    // The hero exposes one or more CTAs — find the first link inside the
    // hero section. Not asserting on a specific label so this stays
    // resilient when copy changes per region.
    const primaryCta = page
      .locator("section")
      .first()
      .getByRole("link")
      .filter({ hasText: /./ })
      .first();
    await expect(primaryCta).toBeVisible();
    const href = await primaryCta.getAttribute("href");
    expect(href).toMatch(/^\/(services|contact|why-propharmex|ai|case-studies|insights)/);

    // Click through and confirm we landed somewhere with a heading.
    await primaryCta.click();
    await page.waitForLoadState("networkidle");
    await expect(page.locator("h1").first()).toBeVisible();

    // Initial paint produced no console errors. Filter known third-party
    // noise: Sentry tunnel pings, Plausible script-load 403s in CI without
    // a real domain, and React strict-mode double-invoke debug warnings.
    const filtered = consoleErrors.filter(
      (e) =>
        !e.includes("Sentry") &&
        !e.includes("plausible") &&
        !e.toLowerCase().includes("strict mode"),
    );
    expect(filtered, `Unexpected console errors: ${filtered.join("\n")}`).toHaveLength(0);
  });
});

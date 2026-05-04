/**
 * Dosage forms hub smoke (PR-E').
 *
 * Asserts the public structure of /dosage-forms and the click-through
 * to the live Solid oral dosage leaf. The other six leaves are placeholder
 * "shipping-next" cards rendered in a non-clickable disabled state by
 * <CapabilityMatrix> — we don't follow them.
 *
 * Content lives in apps/web/content/dosage-forms-hub.ts and renders via
 * the existing pharmdev hub primitives (HubHero + CapabilityMatrix +
 * HubClosing). We use the structural <ul aria-label="Dosage forms"> grid
 * the matrix component emits so the selector survives content edits.
 */
import { expect, test } from "@playwright/test";

test.describe("Dosage forms hub", () => {
  test("hub loads + h1 + grid renders 7 cards", async ({ page }) => {
    const response = await page.goto("/dosage-forms");
    expect(response?.status()).toBe(200);

    await expect(page.locator("h1").first()).toBeVisible();

    // CapabilityMatrix renders the grid as `<ul aria-label="Dosage forms">`
    // with one `<li>` per dosage form (seven total per content/dosage-forms-hub.ts).
    const grid = page.getByRole("list", { name: /Dosage forms/i });
    await expect(grid).toBeVisible();

    const cards = grid.locator("> li");
    await expect(cards).toHaveCount(7);
  });

  test("Solid oral dosage card links to the live leaf page", async ({
    page,
  }) => {
    const response = await page.goto("/dosage-forms");
    expect(response?.status()).toBe(200);

    // Only the Solid oral dosage card is wrapped in an anchor; the other six
    // are non-clickable `aria-disabled` divs.
    const liveLink = page
      .getByRole("link", {
        name: /Solid oral dosage/i,
      })
      .first();
    await expect(liveLink).toBeVisible();

    const href = await liveLink.getAttribute("href");
    expect(href).toBe(
      "/services/pharmaceutical-development/solid-oral-dosage",
    );

    await Promise.all([
      page.waitForURL((url) =>
        url.pathname === "/services/pharmaceutical-development/solid-oral-dosage",
      ),
      liveLink.click(),
    ]);

    await expect(page.locator("h1").first()).toBeVisible();
  });
});

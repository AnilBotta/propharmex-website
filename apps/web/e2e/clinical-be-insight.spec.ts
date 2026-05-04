/**
 * Clinical & BE Insight hub smoke (PR-F').
 *
 * Asserts the public structure of /services/clinical-be-insight. All four
 * service cards are "shipping-next" placeholders rendered as
 * `aria-disabled` divs (no live leaves in this PR), so we don't assert on
 * any click-through — only that the hub renders, the 4-card grid is
 * present, and the cards have the expected status pills.
 *
 * Content lives in apps/web/content/clinical-be-insight.ts and renders via
 * the existing pharmdev <HubHero> + <HubClosing> primitives plus a
 * dedicated <ServicesMatrix> in components/clinical/. The 2x2 grid carries
 * a stable aria-label="Clinical and BE insight services".
 */
import { expect, test } from "@playwright/test";

test.describe("Clinical & BE Insight hub", () => {
  test("hub loads + h1 + grid renders 4 services with shipping-next pills", async ({
    page,
  }) => {
    const response = await page.goto("/services/clinical-be-insight");
    expect(response?.status()).toBe(200);

    await expect(page.locator("h1").first()).toBeVisible();

    // ServicesMatrix renders the grid as
    // `<ul aria-label="Clinical and BE insight services">` with one `<li>`
    // per service (four total per content/clinical-be-insight.ts).
    const grid = page.getByRole("list", {
      name: /Clinical and BE insight services/i,
    });
    await expect(grid).toBeVisible();

    const cards = grid.locator("> li");
    await expect(cards).toHaveCount(4);

    // None of the four cards link out in this PR (all "shipping-next").
    const liveLinks = grid.locator("a");
    await expect(liveLinks).toHaveCount(0);

    // Each card carries a "shipping next" pill.
    const shippingPills = page.getByText(/shipping next/i);
    await expect(shippingPills.first()).toBeVisible();
  });

  test("hub renders breadcrumb + service JSON-LD", async ({ page }) => {
    const response = await page.goto("/services/clinical-be-insight");
    expect(response?.status()).toBe(200);

    // The page emits a JSON-LD graph with id="cli-hub-jsonld" containing
    // Service + CollectionPage + ItemList(4) + BreadcrumbList nodes.
    const jsonLdScript = page.locator('script#cli-hub-jsonld');
    await expect(jsonLdScript).toHaveCount(1);

    const jsonLdText = await jsonLdScript.textContent();
    expect(jsonLdText).toBeTruthy();
    const parsed = JSON.parse(jsonLdText ?? "{}");
    const types = (parsed["@graph"] as Array<{ "@type": string }>).map(
      (n) => n["@type"],
    );
    expect(types).toContain("Service");
    expect(types).toContain("CollectionPage");
    expect(types).toContain("ItemList");
    expect(types).toContain("BreadcrumbList");

    const itemList = parsed["@graph"].find(
      (n: { "@type": string }) => n["@type"] === "ItemList",
    );
    expect(itemList?.itemListElement).toHaveLength(4);
  });
});

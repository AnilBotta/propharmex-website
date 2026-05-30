/**
 * Header structure smoke (PR-E').
 *
 * The header is sitewide — every PR risks regressing it. This spec asserts
 * the post-PR-E' top-nav structure renders correctly on /:
 *   - 5 top-level items: Capabilities, Dosage Forms, About, Insights, Contact
 *   - Capabilities + Dosage Forms are buttons with `aria-haspopup="true"`
 *     (mega-menus per Header.tsx desktop branch)
 *   - About / Insights / Contact are anchors (flat-link branch)
 *   - "Start scoping" CTA renders + links to the Project Scoping Assistant
 *   - Mobile sheet drawer opens and contains all 5 items + the CTA
 *
 * Source: apps/web/components/site/Header.tsx + apps/web/content/site-nav.ts.
 */
import { expect, test } from "@playwright/test";

test.describe("Header — top nav structure", () => {
  test("desktop nav renders 5 items + CTA with correct semantics", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);

    const primaryNav = page.getByRole("navigation", { name: /Primary/i });
    await expect(primaryNav).toBeVisible();

    // Mega-menu items render as <button aria-haspopup="true">.
    const capabilitiesBtn = primaryNav.getByRole("button", {
      name: "Capabilities",
    });
    await expect(capabilitiesBtn).toBeVisible();
    await expect(capabilitiesBtn).toHaveAttribute("aria-haspopup", "true");

    const dosageFormsBtn = primaryNav.getByRole("button", {
      name: "Dosage Forms",
    });
    await expect(dosageFormsBtn).toBeVisible();
    await expect(dosageFormsBtn).toHaveAttribute("aria-haspopup", "true");

    // Flat-link items render as plain anchors with href, no aria-haspopup.
    const aboutLink = primaryNav.getByRole("link", { name: "About" });
    await expect(aboutLink).toBeVisible();
    await expect(aboutLink).toHaveAttribute("href", "/about");

    const insightsLink = primaryNav.getByRole("link", { name: "Insights" });
    await expect(insightsLink).toBeVisible();
    await expect(insightsLink).toHaveAttribute("href", "/insights");

    const contactLink = primaryNav.getByRole("link", { name: "Contact" });
    await expect(contactLink).toBeVisible();
    await expect(contactLink).toHaveAttribute("href", "/contact");

    // CTA sits OUTSIDE the primary nav (sibling within the header). Match
    // page-wide and assert the href.
    const ctaLink = page.getByRole("link", { name: /Start scoping/i }).first();
    await expect(ctaLink).toBeVisible();
    await expect(ctaLink).toHaveAttribute("href", "/ai/project-scoping-assistant");
  });

  test("mobile sheet drawer contains all 5 items + CTA", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    const response = await page.goto("/");
    expect(response?.status()).toBe(200);

    const openMenu = page.getByRole("button", { name: /Open menu/i });
    await expect(openMenu).toBeVisible();
    await openMenu.click();

    const mobileNav = page.getByRole("navigation", { name: /Mobile primary/i });
    await expect(mobileNav).toBeVisible();

    // Flat-link items render as <a> in the drawer.
    await expect(mobileNav.getByRole("link", { name: "About" })).toBeVisible();
    await expect(mobileNav.getByRole("link", { name: "Insights" })).toBeVisible();
    await expect(mobileNav.getByRole("link", { name: "Contact" })).toBeVisible();

    // Mega-menu items render as accordion triggers (<button>).
    await expect(mobileNav.getByRole("button", { name: "Capabilities" })).toBeVisible();
    await expect(mobileNav.getByRole("button", { name: "Dosage Forms" })).toBeVisible();

    // CTA pinned to the bottom of the drawer.
    const drawerCta = page.getByRole("link", { name: /Start scoping/i });
    await expect(drawerCta.first()).toBeVisible();
  });
});

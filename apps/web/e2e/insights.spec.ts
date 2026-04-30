/**
 * Insights hub + whitepaper smoke (Prompt 27 B2).
 *
 * Asserts the public structure of /insights and the click-through to
 * an article and to a whitepaper gate page. Does NOT submit the
 * whitepaper gate form — same Turnstile reasoning as contact.spec.ts.
 *
 * The seed content is in apps/web/content/insights.ts (Prompt 15) and
 * will migrate to Sanity later. We therefore find cards by structural
 * selectors (links to /insights/X and /insights/whitepapers/X) rather
 * than asserting on a specific slug — keeps the test resilient when
 * editorial swaps cards in or out.
 */
import { expect, test } from "@playwright/test";

test.describe("Insights", () => {
  test("hub loads + article click-through renders detail page", async ({
    page,
  }) => {
    const response = await page.goto("/insights");
    expect(response?.status()).toBe(200);

    // The hub has a heading; we just need ANY h1 visible.
    await expect(page.locator("h1").first()).toBeVisible();

    // Find the first article card. Scope to the FilterableGrid results list
    // (`<ul aria-label="Insights results">`) so we never pick up a header /
    // footer / breadcrumb link that happens to point at /insights/X. The
    // negative-lookahead-style filter (`:not([href^="/insights/whitepapers/"])`)
    // keeps us off the whitepaper cards.
    const resultsList = page.getByRole("list", { name: /Insights results/i });
    const articleLinks = resultsList.locator(
      'a[href^="/insights/"]:not([href^="/insights/whitepapers/"])',
    );
    const firstArticle = articleLinks.first();
    await expect(firstArticle).toBeVisible();
    const articleHref = await firstArticle.getAttribute("href");
    expect(articleHref).toMatch(/^\/insights\/[a-z0-9-]+$/);

    // Click + wait for the URL to actually change. `waitForLoadState`
    // can race past Next.js soft navigation if the network is briefly
    // idle between click dispatch and the new chunk request.
    await Promise.all([
      page.waitForURL((url) => url.pathname === articleHref),
      firstArticle.click(),
    ]);

    // Article detail page — h1 visible, URL matches the clicked href.
    expect(page.url()).toContain(articleHref ?? "");
    await expect(page.locator("h1").first()).toBeVisible();
  });

  test("hub → whitepaper card → gate page renders", async ({ page }) => {
    const response = await page.goto("/insights");
    expect(response?.status()).toBe(200);

    // Find the first whitepaper card link. Scope to the FilterableGrid
    // results list so we never pick up a chrome-level link.
    const resultsList = page.getByRole("list", { name: /Insights results/i });
    const whitepaperLinks = resultsList.locator(
      'a[href^="/insights/whitepapers/"]',
    );
    const firstWhitepaper = whitepaperLinks.first();

    // Whitepapers in the seed: the canonical CDMO operating model PDF.
    // If the seed is empty (filter set up but no docs yet), skip cleanly.
    const count = await whitepaperLinks.count();
    test.skip(
      count === 0,
      "No whitepapers in current Insights seed — gate-page click-through skipped.",
    );

    await expect(firstWhitepaper).toBeVisible();
    const whitepaperHref = await firstWhitepaper.getAttribute("href");
    expect(whitepaperHref).toMatch(/^\/insights\/whitepapers\/[a-z0-9-]+$/);

    // Click + wait for URL change (same Next.js soft-navigation race as the
    // article test above).
    await Promise.all([
      page.waitForURL((url) => url.pathname === whitepaperHref),
      firstWhitepaper.click(),
    ]);

    // Gate page renders an h1 + a download/access form. We don't fill
    // or submit it (Turnstile blocks bot submissions in production
    // and the form would 403). Just assert structure: h1 + a form
    // element + an email input.
    expect(page.url()).toContain(whitepaperHref ?? "");
    await expect(page.locator("h1").first()).toBeVisible();

    const gateForm = page.locator("form").first();
    await expect(gateForm).toBeVisible();
    const emailInput = page.locator('input[type="email"]').first();
    await expect(emailInput).toBeVisible();
  });
});

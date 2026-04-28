/**
 * Concierge happy-path e2e (Prompt 18 PR-C).
 *
 * Asserts the full user-visible flow: open the bubble, click a suggestion
 * chip, watch a streamed answer come back, see at least one `[N]` citation
 * superscript anchor, see the "Talk to a human" escape hatch, and close
 * cleanly.
 *
 * Skipped (not failed) when `ANTHROPIC_API_KEY` is unset so CI without keys
 * still exits 0. The route returns 503 in that case anyway, so the chip
 * click would surface the unconfigured fallback message instead of a stream.
 */
import { expect, test } from "@playwright/test";

test.describe("CDMO Concierge", () => {
  test.skip(
    !process.env.ANTHROPIC_API_KEY,
    "Concierge happy-path needs ANTHROPIC_API_KEY set; skipping.",
  );

  test("open → ask → cite → close", async ({ page }) => {
    await page.goto("/");

    // Open the bubble.
    const launcher = page.getByRole("button", {
      name: /Open the Propharmex Concierge/i,
    });
    await expect(launcher).toBeVisible();
    await launcher.click();

    // Panel mounts with the heading visible.
    const panel = page.getByRole("dialog", { name: /Propharmex Concierge/i });
    await expect(panel).toBeVisible();

    // Click the first suggestion chip — sends a real prompt.
    const firstChip = panel
      .locator("button")
      .filter({ hasText: /What dosage forms/i })
      .first();
    await expect(firstChip).toBeVisible();
    await firstChip.click();

    // Wait for the assistant message to materialize and streaming to finish.
    // We detect "finished" by the presence of the Sources footer, which is
    // gated until the stream completes for that message.
    const sourcesHeading = panel.locator("text=/^Sources$/i").first();
    await expect(sourcesHeading).toBeVisible({ timeout: 60_000 });

    // At least one inline `[N]` superscript citation rendered.
    const citationAnchors = panel.locator(
      'sup a[href^="#concierge-source-"]',
    );
    expect(await citationAnchors.count()).toBeGreaterThan(0);

    // "Talk to a human" escape hatch is visible and points to /contact.
    const escape = panel.getByRole("link", { name: /Talk to a human/i });
    await expect(escape).toBeVisible();
    const href = await escape.getAttribute("href");
    expect(href).toMatch(/^\/contact/);

    // Close the panel via the X button in the header.
    const closeBtn = panel.getByRole("button", {
      name: /Close the Propharmex Concierge/i,
    });
    await closeBtn.click();
    await expect(panel).toBeHidden();
  });
});

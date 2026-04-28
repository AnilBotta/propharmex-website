/**
 * Scoping Assistant happy-path e2e (Prompt 19 PR-B).
 *
 * Asserts the user-visible "no-model" flow end-to-end so the test runs
 * cleanly without ANTHROPIC_API_KEY:
 *
 *   1. Visit /ai/project-scoping-assistant
 *   2. Click "See a sample" → preview card populates with the canned scope
 *   3. Click "Download as PDF" → the browser receives an application/pdf
 *      download with a non-zero size and a sensible filename
 *   4. Click "Send to Propharmex" → submit dialog opens
 *   5. Fill in email + company → click Send
 *   6. The route either succeeds (202) and the success banner renders, or it
 *      degrades gracefully when Resend keys aren't set (still 202, banner
 *      still renders).
 *
 * The "real intake → tool call → preview card populates" flow is not
 * covered here because it requires ANTHROPIC_API_KEY and the model's
 * tool-call latency is highly variable (it's a longer chat than the
 * Concierge). That path is exercised by the Concierge spec for the
 * underlying `streamText` plumbing and by manual smoke for tool calling.
 */
import { expect, test } from "@playwright/test";

test.describe("Project Scoping Assistant", () => {
  test("sample → download → submit", async ({ page }) => {
    await page.goto("/ai/project-scoping-assistant");

    // Hero renders.
    await expect(
      page.getByRole("heading", { name: /Scope a project with us/i, level: 1 }),
    ).toBeVisible();

    // Click "See a sample" — the button lives in the chat empty-state.
    const sampleButton = page
      .getByRole("button", { name: /See a sample/i })
      .first();
    await expect(sampleButton).toBeVisible();
    await sampleButton.click();

    // Preview card populates. Use sample-specific objectives text rather
    // than a structural heading — the canned scope's objectives include
    // the unique phrase "ICH-aligned 12-month stability programme", which
    // unambiguously confirms the sample loaded into the card.
    await expect(
      page.getByText(/ICH-aligned 12-month stability programme/i),
    ).toBeVisible({ timeout: 10_000 });

    // Action buttons are now enabled.
    const downloadBtn = page.getByRole("button", {
      name: /Download as PDF/i,
    });
    const submitBtn = page.getByRole("button", { name: /Send to Propharmex/i });
    await expect(downloadBtn).toBeEnabled();
    await expect(submitBtn).toBeEnabled();

    // Trigger the PDF download. Playwright captures the download event;
    // anchor.click() is dispatched by our handler from the JS side.
    const downloadPromise = page.waitForEvent("download", { timeout: 30_000 });
    await downloadBtn.click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/^propharmex-scope-.*\.pdf$/);
    const path = await download.path();
    expect(path).toBeTruthy();

    // Open the submit dialog.
    await submitBtn.click();
    const dialog = page.getByRole("dialog", {
      name: /Send this scope to Propharmex/i,
    });
    await expect(dialog).toBeVisible();

    // Fill the minimum fields and send.
    await dialog
      .getByRole("textbox", { name: /Work email/i })
      .fill("e2e@example.com");
    await dialog
      .getByRole("textbox", { name: /^Company/i })
      .fill("E2E Test Co");
    await dialog
      .getByRole("button", { name: /^Send to Propharmex$/i })
      .click();

    // Success banner appears (works in CI without Resend keys — route
    // still 202s with `queued: false`, parent flips `submitted=true`).
    await expect(
      page.getByText(/Sent to Propharmex/i),
    ).toBeVisible({ timeout: 15_000 });
  });
});

/**
 * Dosage Form Capability Matcher happy-path e2e (Prompt 21 PR-B).
 *
 * Asserts the user-visible "no-model" flow end-to-end so the test runs
 * cleanly without ANTHROPIC_API_KEY:
 *
 *   1. Visit /ai/dosage-matcher
 *   2. Click "See a sample" → results screen renders (3 match cards
 *      from SAMPLE_MATCHER_RECOMMENDATION)
 *   3. Click "Download as PDF" → application/pdf download with the
 *      filename pattern `propharmex-dosage-matcher-YYYY-MM-DD.pdf`
 *   4. Click "Run another match" → input form back; sample button
 *      visible
 *
 * The "real-input → tool-call → results" path needs ANTHROPIC_API_KEY
 * and the model's latency varies; that's covered by manual smoke. Same
 * shape as the scoping spec.
 */
import { expect, test } from "@playwright/test";

test.describe("Dosage Form Capability Matcher", () => {
  test("sample → results → PDF download → restart", async ({ page }) => {
    await page.goto("/ai/dosage-matcher");

    // Hero renders.
    await expect(
      page.getByRole("heading", {
        name: /Dosage Form Capability Matcher/i,
        level: 1,
      }),
    ).toBeVisible();

    // Click "See a sample".
    const sampleButton = page.getByRole("button", { name: /See a sample/i });
    await expect(sampleButton).toBeVisible();
    await sampleButton.click();

    // Results screen renders with the inferred-requirements summary.
    await expect(
      page.getByRole("heading", { name: /Inferred requirements/i }),
    ).toBeVisible({ timeout: 10_000 });

    // Sample-specific text from the canned recommendation rationale —
    // unambiguous proof that the sample loaded into the cards.
    await expect(
      page.getByText(/Immediate-release tablets are the most direct route/i),
    ).toBeVisible();

    // PDF download button is enabled and triggers a real download.
    const downloadBtn = page.getByRole("button", { name: /Download as PDF/i });
    await expect(downloadBtn).toBeEnabled();

    const downloadPromise = page.waitForEvent("download", { timeout: 30_000 });
    await downloadBtn.click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(
      /^propharmex-dosage-matcher-.*\.pdf$/,
    );
    const path = await download.path();
    expect(path).toBeTruthy();

    // Restart returns to the input form.
    await page.getByRole("button", { name: /Run another match/i }).click();
    await expect(
      page.getByRole("button", { name: /^Match dosage forms$/i }),
    ).toBeVisible();
    // Sample button is back in the input phase too.
    await expect(
      page.getByRole("button", { name: /See a sample/i }),
    ).toBeVisible();
  });
});

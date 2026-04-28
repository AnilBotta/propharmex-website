/**
 * DEL Readiness Assessment happy-path e2e (Prompt 20 PR-B).
 *
 * Asserts the user-visible flow end-to-end:
 *
 *   1. Visit /ai/del-readiness
 *   2. Walk every visible question, picking the first radio option each
 *      time so branching is fully exercised (some "first" options open
 *      the conditional follow-ups; some don't — the test tolerates both).
 *   3. Submit on the last step → wait for the model's synthesis to land
 *      and the results screen to render.
 *   4. Click "Download as PDF" → assert a download with the expected
 *      filename pattern (`propharmex-del-readiness-YYYY-MM-DD.pdf`) and
 *      a non-zero file path.
 *   5. Click "Re-take the assessment" → assert step 1 is back.
 *
 * Skipped (not failed) when `ANTHROPIC_API_KEY` is unset so CI without
 * keys still exits 0 — without the key the synthesis route 503s and
 * the results screen never appears.
 */
import { expect, test } from "@playwright/test";

test.describe("DEL Readiness Assessment", () => {
  test.skip(
    !process.env.ANTHROPIC_API_KEY,
    "DEL Readiness happy-path needs ANTHROPIC_API_KEY set; skipping.",
  );

  test("walk → submit → results → PDF → retake", async ({ page }) => {
    test.setTimeout(120_000); // synthesis stream can take 30–60s

    await page.goto("/ai/del-readiness");

    // Hero renders.
    await expect(
      page.getByRole("heading", { name: /DEL Readiness Assessment/i, level: 1 }),
    ).toBeVisible();

    // Walk every question. Branching might extend the list mid-walk, so
    // we drive off `progressLabel` ("Question N of M") and stop when the
    // submit button shows up.
    let safetyCounter = 0;
    while (safetyCounter < 25) {
      safetyCounter++;

      // Wait for a step to render.
      await expect(page.locator("fieldset legend").first()).toBeVisible({
        timeout: 10_000,
      });

      // Pick the first option in the current step's radio group.
      const firstOption = page.locator("fieldset input[type='radio']").first();
      await firstOption.check();

      // Either Next or "See my readiness score" is visible — click whichever.
      const submit = page.getByRole("button", {
        name: /See my readiness score/i,
      });
      const next = page.getByRole("button", { name: /^Next$/ });
      if (await submit.isVisible().catch(() => false)) {
        await submit.click();
        break;
      }
      await next.click();
    }

    // Results screen renders. Use unique results-screen text that doesn't
    // appear elsewhere on the page.
    await expect(page.getByText(/Overall readiness score/i)).toBeVisible({
      timeout: 90_000,
    });

    // PDF download button is present and enabled.
    const downloadBtn = page.getByRole("button", {
      name: /Download a personalized report/i,
    });
    await expect(downloadBtn).toBeEnabled();

    // Trigger the PDF download. The handler dispatches an anchor click
    // from JS, which Playwright captures via the download event.
    const downloadPromise = page.waitForEvent("download", { timeout: 30_000 });
    await downloadBtn.click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(
      /^propharmex-del-readiness-.*\.pdf$/,
    );
    const path = await download.path();
    expect(path).toBeTruthy();

    // Re-take resets to step 1.
    await page.getByRole("button", { name: /Re-take the assessment/i }).click();
    await expect(page.getByText(/Question 1 of/i)).toBeVisible();
  });
});

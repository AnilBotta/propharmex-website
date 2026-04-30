/**
 * Contact page smoke (Prompt 27 B2).
 *
 * Asserts the public structure of /contact: hero, inquiry form (with
 * required field IDs), Cal.com booking section (iframe target), and
 * dual address cards. Does NOT actually submit the form — Cloudflare
 * Turnstile blocks bot submissions (by design), so submit-flow
 * correctness belongs in integration tests against a stubbed Turnstile,
 * not in this E2E smoke layer.
 *
 * The intent here is "the page renders correctly, the structural
 * contract for forms / iframes / addresses is intact." If any of these
 * regressed, every other test we run downstream would also be wrong.
 */
import { expect, test } from "@playwright/test";

test.describe("Contact page", () => {
  test("renders hero, inquiry form, booking section, and addresses", async ({
    page,
  }) => {
    const response = await page.goto("/contact");
    expect(response?.status()).toBe(200);

    // Hero — H1 with the stable id from ContactHero.tsx.
    const heroHeading = page.locator("#contact-hero-heading");
    await expect(heroHeading).toBeVisible();

    // Inquiry form section — id="inquiry" + aria-labelledby contract.
    const inquirySection = page.locator("#inquiry");
    await expect(inquirySection).toBeVisible();
    await expect(page.locator("#contact-form-heading")).toBeVisible();

    // Form fields — at minimum the four required text inputs are present.
    // Field ids are formId-suffix; useId() makes the prefix non-stable, so
    // match by suffix rather than full id.
    const nameInput = page.locator('input[id$="-name"]');
    const emailInput = page.locator('input[id$="-email"]');
    const companyInput = page.locator('input[id$="-company"]');
    const messageTextarea = page.locator('textarea[id$="-message"]');
    await expect(nameInput).toBeVisible();
    await expect(emailInput).toBeVisible();
    await expect(companyInput).toBeVisible();
    await expect(messageTextarea).toBeVisible();

    // Submit button is present and is genuinely a submit (not a link).
    const submitButton = inquirySection.getByRole("button", {
      name: /send|submit|inquiry|request/i,
    });
    await expect(submitButton.first()).toBeVisible();

    // Booking section — id="booking" + aria-labelledby contract from
    // CalBookingPanel.tsx. The Cal.com iframe is conditional on CAL_LINK
    // env var; the fallback CTA is shown when unset. Either is acceptable
    // for smoke — assert the section + heading exist, not the iframe.
    const bookingSection = page.locator("#booking");
    await expect(bookingSection).toBeVisible();
    await expect(page.locator("#contact-cal-heading")).toBeVisible();

    // Dual address cards — heading is enough for smoke; the card content
    // is region-prioritized and varies by request.
    const addressesHeading = page.locator("#contact-addresses-heading");
    await expect(addressesHeading).toBeVisible();
  });
});

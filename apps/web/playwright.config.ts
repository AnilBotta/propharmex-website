/**
 * Playwright config for the public web app.
 *
 * Spec scope (PR-C): the Concierge happy-path test in `e2e/concierge.spec.ts`.
 * Future prompts (Prompt 21 contact form, Prompt 25 launch smoke) extend this
 * config rather than spinning up a parallel one.
 *
 * The spec self-skips when `ANTHROPIC_API_KEY` is unset so CI runs without
 * keys still pass.
 */
import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.PLAYWRIGHT_PORT ?? 3000);
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: BASE_URL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "pnpm dev",
    url: BASE_URL,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});

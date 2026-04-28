/**
 * Vitest config for the web app.
 *
 * Vitest and Playwright both use a `test`/`describe` global API that looks
 * identical at the import site, so without an explicit exclude vitest tries
 * to load `e2e/**` specs and crashes on `Playwright Test did not expect
 * test.describe() to be called here`. Keep the e2e tree out of vitest's
 * scope — Playwright runs it via `pnpm e2e` instead.
 */
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["**/*.test.{ts,tsx}"],
    exclude: ["node_modules/**", ".next/**", "e2e/**"],
  },
});

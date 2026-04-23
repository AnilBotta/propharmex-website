import { defineConfig } from "vitest/config";

/**
 * Vitest config for @propharmex/ui.
 *
 * We intentionally do NOT load `@vitejs/plugin-react` here. Under pnpm the
 * plugin resolves against a different Vite major than the one vitest ships,
 * which produces a spurious TS2769 "Plugin<any> is not assignable" error. The
 * esbuild loader Vitest uses by default parses TSX/JSX for us — all Testing
 * Library + Radix component tests work without the React plugin.
 */
export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    css: false,
  },
  esbuild: {
    jsx: "automatic",
  },
});

import type { Config } from "tailwindcss";

/**
 * Tailwind v4 moves most configuration to CSS-first `@theme` blocks
 * in `app/globals.css`. This file stays minimal — used only to point
 * the content scanner at workspace packages.
 *
 * Real token definitions land in `app/globals.css` at Prompt 2.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "../../packages/ui/**/*.{ts,tsx}",
  ],
  theme: { extend: {} },
  plugins: [],
};

export default config;

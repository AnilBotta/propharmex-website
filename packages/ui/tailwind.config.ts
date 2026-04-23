import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

/**
 * Tailwind v4 is CSS-first: real design tokens live in
 * `packages/config/design-tokens.css` under `@theme`. This config only
 * declares content scan paths and plugins.
 */
export default {
  content: [
    "../../apps/web/app/**/*.{ts,tsx,mdx}",
    "../../apps/web/components/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./*.{ts,tsx}",
  ],
  plugins: [typography],
} satisfies Config;

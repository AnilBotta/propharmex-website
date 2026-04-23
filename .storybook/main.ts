import type { StorybookConfig } from "@storybook/react-vite";
import { dirname, join, resolve } from "node:path";

/**
 * Cross-platform helper: resolve the on-disk path for a Storybook addon
 * so pnpm's symlinked node_modules layout is handled.
 */
function getAbsolutePath(value: string): string {
  return dirname(require.resolve(join(value, "package.json")));
}

const config: StorybookConfig = {
  stories: [
    "../packages/ui/**/*.mdx",
    "../packages/ui/**/*.stories.@(ts|tsx)",
  ],
  addons: [
    getAbsolutePath("@storybook/addon-essentials"),
    getAbsolutePath("@storybook/addon-a11y"),
    getAbsolutePath("@storybook/addon-interactions"),
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {},
  typescript: {
    reactDocgen: "react-docgen-typescript",
  },
  core: {
    disableTelemetry: true,
  },
  async viteFinal(viteConfig) {
    const { mergeConfig } = await import("vite");
    const tailwindcss = (await import("@tailwindcss/vite")).default;
    return mergeConfig(viteConfig, {
      plugins: [tailwindcss()],
      resolve: {
        alias: {
          "@propharmex/ui": resolve(__dirname, "../packages/ui"),
          "@propharmex/config": resolve(__dirname, "../packages/config"),
        },
      },
    });
  },
};

export default config;

import { defineCliConfig } from "sanity/cli";

/**
 * Sanity CLI config — kept alongside the embedded studio so that
 * `pnpm --filter web exec sanity deploy` can publish a separate
 * <name>.sanity.studio host as a fallback if ever needed.
 *
 * In normal operation the embedded /studio route on the Next.js host is
 * authoritative; this CLI config is here only for the rare ops case where
 * a Sanity-hosted studio is convenient.
 */
const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ??
  process.env.SANITY_STUDIO_PROJECT_ID ??
  "veo2rnkc";

const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET ??
  process.env.SANITY_STUDIO_DATASET ??
  "production";

export default defineCliConfig({
  api: { projectId, dataset },
  studioHost: "propharmex",
  autoUpdates: true,
});

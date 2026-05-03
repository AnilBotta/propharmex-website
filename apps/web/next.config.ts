import bundleAnalyzer from "@next/bundle-analyzer";
import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

/**
 * Bundle analyzer wrapper — opts in when `ANALYZE=true` is set at build
 * time. Outputs an interactive treemap to `.next/analyze/` for both
 * client and server bundles. Used locally (`ANALYZE=true pnpm build`)
 * and by the bundle-budget CI workflow (Prompt 25 PR-B), which compares
 * the printed route-size table against a 150 KB First-Load-JS budget.
 */
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/**
 * Env loading note: secrets live at the workspace root (`.env.local`) so the
 * same file feeds the Next.js dev server, the ingest CLI, the whitepaper
 * generator, and any future scripts. To make Next.js see them in dev/build,
 * keep a `apps/web/.env.local` symlink (or a copy) of the workspace root
 * file. We previously tried to load the workspace-root file via
 * `@next/env`'s `loadEnvConfig`, but importing `@next/env` directly from
 * this config requires it as a top-level dep — kept out for now to avoid
 * adding a transitive dep just for a dev-only convenience.
 *
 * Sentry note: `withSentryConfig` wraps the export. When
 * `SENTRY_AUTH_TOKEN` is unset at build time the wrapper skips
 * source-map upload with a single warning and the build continues.
 * When `NEXT_PUBLIC_SENTRY_DSN` is unset at runtime the SDK's `init()`
 * is short-circuited in `sentry.{client,server,edge}.config.ts`, so
 * dev / preview / CI without Sentry env are zero-impact.
 */

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  transpilePackages: ["@propharmex/ui", "@propharmex/lib"],
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  experimental: {
    // Server Actions body size cap for AI tool forms (scoping assistant uploads).
    serverActions: { bodySizeLimit: "2mb" },
  },
  // Headers are layered: app-level here, infra-level in vercel.json.
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
  // Permanent redirects for legacy URLs that have moved or been retired.
  async redirects() {
    return [
      // The "Canadian CDMO operating model" whitepaper and the
      // "DEL at a glance" foreign-sponsor primer were both retired with the
      // specialty-CDMO repositioning (PR-D1′). All inbound URLs that
      // previously resolved to either piece — and the upstream redirect
      // chains that fed them — now terminate at /insights or
      // /insights/whitepapers.
      {
        source: "/insights/whitepapers/canadian-cdmo-operating-model",
        destination: "/insights/whitepapers",
        permanent: true,
      },
      {
        source: "/insights/del-at-a-glance-foreign-sponsor-primer",
        destination: "/insights",
        permanent: true,
      },
      // Re-thread the legacy whitepaper-slug chain so each old URL terminates
      // directly at /insights/whitepapers without bouncing through the
      // retired destination. The original chain was:
      //   /whitepapers/canada-india-playbook
      //     → /insights/whitepapers/two-hub-operating-model
      //     → /insights/whitepapers/canadian-cdmo-operating-model
      // Both intermediate hops are now retired; collapse all three to the
      // hub.
      {
        source: "/whitepapers/canada-india-playbook",
        destination: "/insights/whitepapers",
        permanent: true,
      },
      {
        source: "/insights/whitepapers/two-hub-operating-model",
        destination: "/insights/whitepapers",
        permanent: true,
      },
      {
        source: "/insights/inside-a-two-hub-cdmo",
        destination: "/insights/inside-our-operating-model",
        permanent: true,
      },
      // Direct-PDF asset links — both the old and the most-recent generator
      // outputs — land at the whitepapers hub.
      {
        source: "/downloads/two-hub-operating-model.pdf",
        destination: "/insights/whitepapers",
        permanent: true,
      },
      {
        source: "/downloads/canadian-cdmo-operating-model.pdf",
        destination: "/insights/whitepapers",
        permanent: true,
      },
    ];
  },
};

export default withSentryConfig(withBundleAnalyzer(nextConfig), {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  // Auth token is only required when uploading source maps. When unset
  // the wrapper warns once and skips the upload — perfect for local
  // and preview builds.
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
  // Hide source maps from end-users — they're uploaded to Sentry only.
  hideSourceMaps: true,
  // Tree-shake Sentry's optional debug logger out of the production bundle.
  disableLogger: true,
  // Tunnel events through `/monitoring` so ad-blockers don't drop them.
  // The Next plugin auto-creates the route handler.
  tunnelRoute: "/monitoring",
  widenClientFileUpload: true,
});

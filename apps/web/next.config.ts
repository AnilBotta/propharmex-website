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
      // The "Inside our operating model" article was retired in PR-D2c2'.
      // Its body was anchored to DEL + 3PL framing incompatible with the
      // specialty-CDMO repositioning.
      {
        source: "/insights/inside-our-operating-model",
        destination: "/insights",
        permanent: true,
      },
      // The Health Canada DEL licensing service-detail page was retired in
      // PR-D2d-1'. Its body explicitly claimed Propharmex holds and
      // operates a DEL at the Mississauga site, contradicting the new
      // specialty-CDMO positioning. Inbound links land on the regulatory-
      // services hub.
      {
        source: "/services/regulatory-services/health-canada-del-licensing",
        destination: "/services/regulatory-services",
        permanent: true,
      },
      // The legacy "/services/regulatory-services/health-canada-del" path
      // (used by industries.ts cross-references prior to PR-D2d-1') also
      // lands on the hub.
      {
        source: "/services/regulatory-services/health-canada-del",
        destination: "/services/regulatory-services",
        permanent: true,
      },
      // Client update: this retired public service path now lands on the
      // services overview.
      {
        source: "/services/clinical-be-insight",
        destination: "/services",
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
        destination: "/insights",
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
      // PR-L′ — Sanity Studio moved from a separate apps/studio host
      // (studio.propharmex.com) to an embedded route at /studio inside
      // apps/web. The legacy /studio-info informational page is retired;
      // any inbound links land directly at the live editor.
      {
        source: "/studio-info",
        destination: "/studio",
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

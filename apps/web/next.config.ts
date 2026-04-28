import type { NextConfig } from "next";

/**
 * Env loading note: secrets live at the workspace root (`.env.local`) so the
 * same file feeds the Next.js dev server, the ingest CLI, the whitepaper
 * generator, and any future scripts. To make Next.js see them in dev/build,
 * keep a `apps/web/.env.local` symlink (or a copy) of the workspace root
 * file. We previously tried to load the workspace-root file via
 * `@next/env`'s `loadEnvConfig`, but importing `@next/env` directly from
 * this config requires it as a top-level dep — kept out for now to avoid
 * adding a transitive dep just for a dev-only convenience.
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
  // Permanent redirects for legacy URLs that have moved.
  async redirects() {
    return [
      // Legacy whitepaper slug — Prompt 15 retitled the whitepaper from
      // "Canada-India playbook" to "The two-hub operating model" (PR #19).
      // The Canadian-anchored rebrand (PR #23 + the Commit-8 follow-up PR)
      // retitled it again to "The Canadian CDMO operating model" with a new
      // slug. This redirect terminates at the current slug to avoid a chain.
      {
        source: "/whitepapers/canada-india-playbook",
        destination: "/insights/whitepapers/canadian-cdmo-operating-model",
        permanent: true,
      },
      // Two-hub-operating-model whitepaper slug retired in the
      // Canadian-anchored rebrand follow-up. Preserves any inbound links to
      // the gated landing page.
      {
        source: "/insights/whitepapers/two-hub-operating-model",
        destination: "/insights/whitepapers/canadian-cdmo-operating-model",
        permanent: true,
      },
      // Inside-a-two-hub-cdmo article slug retired in the same follow-up.
      // The article body was already rewritten in PR #23; this redirect
      // covers the URL surface only.
      {
        source: "/insights/inside-a-two-hub-cdmo",
        destination: "/insights/inside-our-operating-model",
        permanent: true,
      },
      // Old whitepaper PDF asset path. The new generator writes the PDF
      // under a Canadian-anchored filename; this redirect catches any
      // inbound direct-PDF links that still point at the old path.
      {
        source: "/downloads/two-hub-operating-model.pdf",
        destination: "/downloads/canadian-cdmo-operating-model.pdf",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

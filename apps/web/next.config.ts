import type { NextConfig } from "next";

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
      // "Canada-India playbook" to "The two-hub operating model" as part
      // of the broader positioning correction (PR #19). The old URL was
      // referenced in why.ts and may have been shared externally; a 301
      // preserves any inbound link.
      {
        source: "/whitepapers/canada-india-playbook",
        destination: "/insights/whitepapers/two-hub-operating-model",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

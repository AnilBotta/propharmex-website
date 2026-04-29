import type { MetadataRoute } from "next";
import { env } from "@propharmex/lib";

/**
 * Robots policy.
 *
 * - All standard crawlers may index public content; infra paths (`/api/`,
 *   `/internal/`, `/manage/`, `/draft`, `/_next/`, `/studio*`) are disallowed.
 * - AI answer-engine crawlers get the same content/infra policy explicitly.
 *   We *want* AI citation per the pharma-seo-optimizer skill (GEO scoring),
 *   so we don't block GPTBot / ClaudeBot / Google-Extended / etc. — we just
 *   keep them out of API surfaces and internal tooling, exactly like Googlebot.
 * - Adjust this list when adding a new bot family; do not add any user-agent
 *   without an explicit decision.
 */
const SITE_URL = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");

const DISALLOWED_PATHS = [
  "/api/",
  "/internal/",
  "/manage/",
  "/draft",
  "/_next/",
  "/studio",
  "/studio/",
];

const AI_CRAWLERS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "anthropic-ai",
  "Claude-Web",
  "PerplexityBot",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
  "CCBot",
  "Amazonbot",
  "Bytespider",
  "DuckAssistBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: DISALLOWED_PATHS,
      },
      ...AI_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: ["/"],
        disallow: DISALLOWED_PATHS,
      })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}

/**
 * Classify `document.referrer` into a coarse traffic-source bucket.
 *
 * Used as a PostHog super-property so every event carries the user's
 * arrival channel without us storing the raw referrer URL (which can leak
 * source-side query strings — search terms, partner IDs, etc.).
 *
 * Buckets:
 *   - direct      no referrer (typed URL, bookmark, email client, app)
 *   - search      Google / Bing / DuckDuckGo / Brave / Ecosia / Yandex / Baidu
 *   - ai          ChatGPT / Claude / Perplexity / Gemini / Copilot / Grok
 *   - social      LinkedIn / Twitter / X / Facebook / Reddit / YouTube
 *   - internal    referrer host matches our site (intra-site nav)
 *   - external    everything else (newsletters, partner sites, blogs)
 *
 * The classifier is pure and synchronous — no globals — so it tests
 * trivially and runs once at PostHog init time.
 */

export type ReferrerGroup =
  | "direct"
  | "search"
  | "ai"
  | "social"
  | "internal"
  | "external";

const SEARCH_HOSTS: ReadonlyArray<string> = [
  "google.",
  "bing.com",
  "duckduckgo.com",
  "brave.com",
  "search.brave.com",
  "ecosia.org",
  "yandex.",
  "baidu.com",
  "qwant.com",
  "startpage.com",
];

const AI_HOSTS: ReadonlyArray<string> = [
  "chat.openai.com",
  "chatgpt.com",
  "openai.com",
  "claude.ai",
  "anthropic.com",
  "perplexity.ai",
  "gemini.google.com",
  "bard.google.com",
  "copilot.microsoft.com",
  "x.ai",
  "grok.com",
  "you.com",
  "phind.com",
];

const SOCIAL_HOSTS: ReadonlyArray<string> = [
  "linkedin.com",
  "lnkd.in",
  "twitter.com",
  "x.com",
  "t.co",
  "facebook.com",
  "fb.com",
  "instagram.com",
  "reddit.com",
  "youtube.com",
  "youtu.be",
  "threads.net",
  "bsky.app",
];

/**
 * @param referrer  The full referrer URL (e.g. `document.referrer`).
 * @param siteHost  The current site's host (e.g. `propharmex.com`). Used to
 *                  detect intra-site nav. Pass `window.location.host`.
 */
export function classifyReferrer(
  referrer: string | undefined | null,
  siteHost: string,
): ReferrerGroup {
  if (!referrer) return "direct";

  let host: string;
  try {
    host = new URL(referrer).host.toLowerCase();
  } catch {
    return "direct";
  }

  if (!host) return "direct";

  // Intra-site — the cleanest signal so we check it first.
  if (siteHost && host === siteHost.toLowerCase()) return "internal";

  // AI must be checked before search: gemini.google.com / bard.google.com
  // would otherwise match the `google.` search prefix and bucket as search.
  if (AI_HOSTS.some((needle) => host === needle || host.endsWith(`.${needle}`))) {
    return "ai";
  }

  if (SEARCH_HOSTS.some((needle) => host.includes(needle))) return "search";

  if (
    SOCIAL_HOSTS.some(
      (needle) => host === needle || host.endsWith(`.${needle}`),
    )
  ) {
    return "social";
  }

  return "external";
}

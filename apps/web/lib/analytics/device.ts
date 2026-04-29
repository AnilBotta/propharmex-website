/**
 * Classify a User-Agent string into a coarse device class.
 *
 * Used as a PostHog super-property so every event is filterable by
 * mobile/tablet/desktop without relying on PostHog's own (less stable)
 * device parsing in funnel queries.
 *
 * Heuristic only — no UA-CH parsing, no library dep. Good enough for
 * dashboard segmentation; not meant to be a full device-detection layer.
 */

export type DeviceClass = "mobile" | "tablet" | "desktop";

/**
 * Order matters: tablet checks must run before the generic mobile check
 * because most tablet UAs also include "Mobile". iPad's modern UA pretends
 * to be macOS, so we also use the platform / max-touch-points fallback.
 */
export function classifyDevice(
  userAgent: string | undefined | null,
  options?: { maxTouchPoints?: number; platform?: string },
): DeviceClass {
  const ua = (userAgent ?? "").toLowerCase();
  const platform = (options?.platform ?? "").toLowerCase();
  const touchPoints = options?.maxTouchPoints ?? 0;

  if (!ua) return "desktop";

  // Tablet first — iPad masquerades as Mac on iOS 13+.
  if (
    ua.includes("ipad") ||
    ua.includes("tablet") ||
    ua.includes("playbook") ||
    ua.includes("silk") ||
    (ua.includes("android") && !ua.includes("mobile")) ||
    // iPadOS 13+ reports macintosh; detect by touch-points + macOS platform.
    (platform.includes("mac") && touchPoints > 1)
  ) {
    return "tablet";
  }

  if (
    ua.includes("mobile") ||
    ua.includes("android") ||
    ua.includes("iphone") ||
    ua.includes("ipod") ||
    ua.includes("blackberry") ||
    ua.includes("opera mini") ||
    ua.includes("windows phone")
  ) {
    return "mobile";
  }

  return "desktop";
}

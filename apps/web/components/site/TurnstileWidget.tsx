"use client";

/**
 * Cloudflare Turnstile widget — bot protection on the contact form and
 * whitepaper gate (Prompt 25 PR-A).
 *
 * Server-side verification was wired in Prompts 17 + 15; this component
 * adds the missing client-side widget that produces the verification
 * token. Without `NEXT_PUBLIC_TURNSTILE_SITE_KEY` set the widget renders
 * nothing — dev / preview / CI stay unblocked, and the server-side
 * verifier already short-circuits when `TURNSTILE_SECRET_KEY` is unset.
 *
 * Behaviour:
 *  - Loads `challenges.cloudflare.com/turnstile/v0/api.js?render=explicit`
 *    once per page (idempotent — no-op on remount).
 *  - Renders a managed-mode widget. Cloudflare picks visible / invisible
 *    / non-interactive based on its risk score. We size it appropriately
 *    so non-interactive mode (the common case) takes near-zero space.
 *  - Fires `onVerify(token)` on success. The parent submits the token
 *    along with the form payload to the corresponding API route.
 *  - On expire or error, fires `onExpire()` so the parent clears the
 *    cached token and refuses to submit until the widget re-issues.
 *
 * Accessibility: Cloudflare's widget renders its own ARIA labels.
 * Reduced-motion is respected by Cloudflare. We do not customize.
 */
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        params: {
          sitekey: string;
          callback?: (token: string) => void;
          "error-callback"?: () => void;
          "expired-callback"?: () => void;
          "timeout-callback"?: () => void;
          theme?: "auto" | "light" | "dark";
          size?: "normal" | "compact" | "flexible" | "invisible";
          appearance?: "always" | "execute" | "interaction-only";
          action?: string;
        },
      ) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
      getResponse: (widgetId: string) => string | undefined;
    };
    /**
     * Turnstile invokes this global once the script is ready.
     * We bridge it to a Promise so multiple mounted widgets can
     * await the same boot.
     */
    onloadTurnstileCallback?: () => void;
  }
}

const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=onloadTurnstileCallback";

let scriptPromise: Promise<void> | null = null;

/** Load the Turnstile script exactly once across all widget instances. */
function loadScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }
  if (window.turnstile) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve, reject) => {
    window.onloadTurnstileCallback = () => resolve();

    const existing = document.querySelector<HTMLScriptElement>(
      `script[src^="https://challenges.cloudflare.com/turnstile/v0/api.js"]`,
    );
    if (existing) {
      // Another concurrent mount already inserted the tag; wait for the
      // global callback to fire.
      return;
    }

    const tag = document.createElement("script");
    tag.src = SCRIPT_SRC;
    tag.async = true;
    tag.defer = true;
    tag.onerror = () => reject(new Error("turnstile-script-load-failed"));
    document.head.appendChild(tag);
  });

  return scriptPromise;
}

type Props = {
  /** Public site key — `NEXT_PUBLIC_TURNSTILE_SITE_KEY`. */
  siteKey: string | undefined;
  /** Logical action name for analytics in the Turnstile dashboard. */
  action: string;
  /** Fires once Cloudflare returns a verified token. */
  onVerify: (token: string) => void;
  /** Optional — fires on expire / error so the parent can disable submit. */
  onExpire?: () => void;
  /** Optional className applied to the container element. */
  className?: string;
  /**
   * When false, the script is NOT loaded and the widget is NOT mounted.
   * Flip to true to lazy-mount on demand (e.g., on first form focus) so
   * the Turnstile script load + iframe creation happen past LCP rather
   * than during the initial page render. Defaults to true for backwards
   * compatibility with existing call sites.
   */
  enabled?: boolean;
};

export function TurnstileWidget({
  siteKey,
  action,
  onVerify,
  onExpire,
  className,
  enabled = true,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!siteKey) return;
    if (!enabled) return;
    if (!containerRef.current) return;

    let cancelled = false;

    loadScript()
      .then(() => {
        if (cancelled) return;
        if (!containerRef.current || !window.turnstile) return;

        const id = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          action,
          theme: "light",
          size: "flexible",
          appearance: "interaction-only",
          callback: (token) => onVerify(token),
          "error-callback": () => onExpire?.(),
          "expired-callback": () => onExpire?.(),
          "timeout-callback": () => onExpire?.(),
        });
        widgetIdRef.current = id;
      })
      .catch(() => {
        // Script load failed (network / CSP / extension blocking). The
        // server-side verifier short-circuits when no token is present,
        // so the form still submits — this is a soft-fail by design.
        onExpire?.();
      });

    return () => {
      cancelled = true;
      const id = widgetIdRef.current;
      if (id && window.turnstile) {
        try {
          window.turnstile.remove(id);
        } catch {
          // Already removed by the SDK on a prior pass — safe to ignore.
        }
      }
      widgetIdRef.current = null;
    };
  }, [siteKey, action, onVerify, onExpire, enabled]);

  // No site key configured (dev / preview / CI) → render nothing.
  if (!siteKey) return null;

  return <div ref={containerRef} className={className} />;
}

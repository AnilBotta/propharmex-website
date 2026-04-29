"use client";

/**
 * ConciergeBubble — site-wide floating launcher + panel container.
 *
 * Mounted once in apps/web/app/layout.tsx so it persists across navigation.
 * The bubble itself is always visible bottom-right; clicking opens the
 * 400×600 panel with the chat surface inside.
 *
 * Visual posture (designer's call from the plan):
 *   - Closed: filled circle with chat-glyph, primary-color, drop shadow
 *   - Panel: surface card, primary-color border accent on header bar
 *   - Open animation: slide-up + fade-in (200ms, respects prefers-reduced-motion)
 *
 * No data fetching here — the panel renders the actual chat surface, which
 * uses `useChat` from the Vercel AI SDK and posts to /api/ai/concierge.
 */
import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { MessageSquare, X } from "lucide-react";

import { CONCIERGE } from "../../content/concierge";

import { ConciergePanel } from "./ConciergePanel";
import {
  trackConciergeClosed,
  trackConciergeOpened,
} from "./telemetry";

export function ConciergeBubble() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  const handleToggle = useCallback(() => {
    setOpen((prev) => {
      const next = !prev;
      if (next) trackConciergeOpened({ source: "bubble" });
      else trackConciergeClosed({ reason: "toggle" });
      return next;
    });
  }, []);

  const handleClose = useCallback(
    (reason: "x-button" | "escape" = "x-button") => {
      setOpen(false);
      trackConciergeClosed({ reason });
    },
    [],
  );

  // Close on ESC.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose("escape");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, handleClose]);

  return (
    // The launcher container intentionally has no aria-live: that lives on
    // the message list inside ConciergePanel where new content actually
    // appears. Wrapping the launcher in a live region caused the X / chat
    // icon swap to be announced on every open/close (Prompt 26 a11y S2-4).
    <div
      className="pointer-events-none fixed bottom-4 right-4 z-[60] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6"
    >
      <AnimatePresence>
        {open ? (
          <motion.div
            key="panel"
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: reduce ? 0 : 0.2, ease: "easeOut" }}
            className="pointer-events-auto"
          >
            <ConciergePanel onClose={() => handleClose("x-button")} />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <button
        type="button"
        onClick={handleToggle}
        aria-label={open ? CONCIERGE.bubble.closeLabel : CONCIERGE.bubble.openLabel}
        aria-expanded={open}
        aria-controls="concierge-panel"
        className="pointer-events-auto inline-flex size-14 items-center justify-center rounded-[var(--radius-full)] border border-[var(--color-primary-700)] bg-[var(--color-primary-700)] text-white shadow-[0_8px_20px_-4px_rgba(15,32,80,0.35)] transition hover:scale-105 hover:bg-[var(--color-primary-800)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2 motion-reduce:hover:scale-100 motion-reduce:transition-none"
      >
        {open ? (
          <X aria-hidden="true" size={22} />
        ) : (
          <MessageSquare aria-hidden="true" size={22} />
        )}
      </button>
    </div>
  );
}

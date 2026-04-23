"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "../hooks/use-reduced-motion";
import { cn } from "../utils";

export interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Full-loop duration in seconds. Lower = faster. Default 30s. */
  durationSec?: number;
  /** Scroll direction. */
  direction?: "left" | "right";
  /** Pauses animation on hover. */
  pauseOnHover?: boolean;
  /** Child content is duplicated once to create the seamless loop. */
  children: React.ReactNode;
}

/**
 * Infinite horizontal marquee. When the user has `prefers-reduced-motion: reduce`
 * set, the animation is disabled and the content renders statically with overflow
 * hidden — still readable, no movement.
 *
 * Typical use: cert-logo strip, partner logos, key-stat rotator.
 */
export const Marquee = React.forwardRef<HTMLDivElement, MarqueeProps>(
  (
    { className, durationSec = 30, direction = "left", pauseOnHover = true, children, ...props },
    ref
  ) => {
    const reduce = useReducedMotion();
    const [paused, setPaused] = React.useState(false);

    const x = direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"];

    return (
      <div
        ref={ref}
        role="marquee"
        aria-live="off"
        className={cn("overflow-hidden", className)}
        onMouseEnter={() => pauseOnHover && setPaused(true)}
        onMouseLeave={() => pauseOnHover && setPaused(false)}
        {...props}
      >
        <motion.div
          className="flex w-max gap-12"
          animate={reduce ? undefined : { x }}
          transition={
            reduce
              ? undefined
              : {
                  duration: durationSec,
                  ease: "linear",
                  repeat: Infinity,
                }
          }
          style={
            reduce || paused
              ? { animationPlayState: "paused" }
              : undefined
          }
        >
          {/* Duplicate content for seamless loop */}
          <div className="flex shrink-0 items-center gap-12">{children}</div>
          <div
            className="flex shrink-0 items-center gap-12"
            aria-hidden="true"
          >
            {children}
          </div>
        </motion.div>
      </div>
    );
  }
);
Marquee.displayName = "Marquee";

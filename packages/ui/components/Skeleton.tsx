import * as React from "react";
import { cn } from "../utils";

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * Loading placeholder. Animation is cut to 0.01ms under
 * `prefers-reduced-motion: reduce` per design-tokens.css.
 */
export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn(
        "animate-pulse rounded-[var(--radius-md)] bg-[var(--color-slate-200)]",
        className
      )}
      {...props}
    />
  )
);
Skeleton.displayName = "Skeleton";

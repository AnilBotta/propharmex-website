import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-[var(--radius-full)] px-2.5 py-0.5 text-xs font-medium tracking-tight",
  {
    variants: {
      variant: {
        neutral:
          "bg-[var(--color-slate-100)] text-[var(--color-slate-800)]",
        primary:
          "bg-[var(--color-primary-50)] text-[var(--color-primary-700)]",
        accent:
          "bg-[var(--color-accent-100)] text-[var(--color-accent-800)]",
        success:
          "bg-[color-mix(in_oklab,var(--color-success)_15%,transparent)] text-[var(--color-success)]",
        warn:
          "bg-[color-mix(in_oklab,var(--color-warn)_18%,transparent)] text-[var(--color-warn-fg)]",
        danger:
          "bg-[color-mix(in_oklab,var(--color-danger)_15%,transparent)] text-[var(--color-danger)]",
        outline:
          "bg-transparent text-[var(--color-fg)] border border-[var(--color-border)]",
      },
    },
    defaultVariants: { variant: "neutral" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => (
    <span ref={ref} className={cn(badgeVariants({ variant, className }))} {...props} />
  )
);
Badge.displayName = "Badge";

export { badgeVariants };

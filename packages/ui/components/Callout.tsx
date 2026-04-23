import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Info, AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react";
import { cn } from "../utils";

const calloutVariants = cva(
  "flex gap-3 rounded-[var(--radius-md)] border p-4 font-[family-name:var(--font-body)] text-sm leading-relaxed",
  {
    variants: {
      tone: {
        info: "bg-[var(--color-primary-50)] border-[var(--color-primary-200)] text-[var(--color-primary-900)]",
        success:
          "bg-[color-mix(in_oklab,var(--color-success)_8%,var(--color-bg))] border-[color-mix(in_oklab,var(--color-success)_30%,var(--color-border))] text-[var(--color-fg)]",
        warn:
          "bg-[color-mix(in_oklab,var(--color-warn)_8%,var(--color-bg))] border-[color-mix(in_oklab,var(--color-warn)_35%,var(--color-border))] text-[var(--color-fg)]",
        danger:
          "bg-[color-mix(in_oklab,var(--color-danger)_8%,var(--color-bg))] border-[color-mix(in_oklab,var(--color-danger)_30%,var(--color-border))] text-[var(--color-fg)]",
        regulatory:
          "bg-[var(--color-slate-50)] border-[var(--color-slate-200)] text-[var(--color-slate-900)]",
      },
    },
    defaultVariants: { tone: "info" },
  }
);

const iconByTone = {
  info: Info,
  success: CheckCircle2,
  warn: AlertTriangle,
  danger: ShieldAlert,
  regulatory: ShieldAlert,
} as const;

export interface CalloutProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof calloutVariants> {
  title?: string;
  /** Override the leading icon. Defaults to a tone-appropriate Lucide icon. */
  icon?: React.ReactNode;
}

export const Callout = React.forwardRef<HTMLDivElement, CalloutProps>(
  ({ className, tone = "info", title, icon, children, ...props }, ref) => {
    const Icon = iconByTone[tone ?? "info"];
    return (
      <div
        ref={ref}
        role={tone === "danger" || tone === "warn" ? "alert" : "note"}
        className={cn(calloutVariants({ tone, className }))}
        {...props}
      >
        <div className="shrink-0 mt-0.5" aria-hidden="true">
          {icon ?? <Icon size={18} />}
        </div>
        <div className="flex flex-col gap-1">
          {title ? (
            <p className="font-[family-name:var(--font-display)] font-semibold text-[0.95rem] leading-snug">
              {title}
            </p>
          ) : null}
          <div>{children}</div>
        </div>
      </div>
    );
  }
);
Callout.displayName = "Callout";

export { calloutVariants };

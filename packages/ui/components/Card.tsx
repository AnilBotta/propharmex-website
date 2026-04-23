import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils";

const cardVariants = cva(
  "rounded-[var(--radius-lg)] bg-[var(--color-surface)] text-[var(--color-fg)]",
  {
    variants: {
      elevation: {
        flat: "border border-[var(--color-border)]",
        sm: "shadow-[var(--shadow-sm)]",
        md: "shadow-[var(--shadow-md)]",
        lg: "shadow-[var(--shadow-lg)]",
      },
      tone: {
        surface: "",
        muted: "bg-[var(--color-slate-50)]",
        primary: "bg-[var(--color-primary-50)] text-[var(--color-primary-900)]",
      },
    },
    defaultVariants: { elevation: "flat", tone: "surface" },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, elevation, tone, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ elevation, tone, className }))}
      {...props}
    />
  )
);
Card.displayName = "Card";

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-1.5 p-6 pb-3", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "font-[family-name:var(--font-display)] text-lg font-semibold leading-tight tracking-tight",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-[var(--color-muted)]", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-3", className)} {...props} />
));
CardContent.displayName = "CardContent";

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center gap-3 p-6 pt-0 border-t border-[var(--color-border)] mt-3",
      className
    )}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { cardVariants };

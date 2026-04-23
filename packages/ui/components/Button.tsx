"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-md)]",
    "font-[family-name:var(--font-display)] font-medium tracking-tight",
    "transition-[background-color,color,box-shadow,transform] duration-[var(--duration-exit)] ease-[var(--ease-out)]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--color-primary-600)] text-[var(--color-primary-fg)] shadow-[var(--shadow-sm)] hover:bg-[var(--color-primary-700)] active:translate-y-px",
        secondary:
          "bg-[var(--color-surface)] text-[var(--color-fg)] border border-[var(--color-border)] hover:border-[var(--color-primary-600)] hover:text-[var(--color-primary-600)]",
        ghost:
          "bg-transparent text-[var(--color-fg)] hover:bg-[var(--color-slate-100)]",
        outline:
          "bg-transparent text-[var(--color-primary-600)] border border-[var(--color-primary-600)] hover:bg-[var(--color-primary-50)]",
        danger:
          "bg-[var(--color-danger)] text-[var(--color-danger-fg)] shadow-[var(--shadow-sm)] hover:opacity-90 active:translate-y-px",
        link:
          "bg-transparent text-[var(--color-primary-600)] underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        sm: "h-9 px-3 text-sm min-h-11:md:min-h-9",
        md: "h-11 px-5 text-base",
        lg: "h-12 px-6 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Render as a child element (e.g. `<a>`) while keeping button styling. */
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, type, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        type={asChild ? undefined : (type ?? "button")}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { buttonVariants };

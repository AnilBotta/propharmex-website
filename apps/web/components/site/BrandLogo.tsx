/**
 * Propharmex brand lockup.
 *
 * Text-only mark while `/brand/propharmex-logo.svg` is finalized in the
 * brand system (Prompt 2 deliverable awaiting designer assets). The actual
 * SVG gets dropped in apps/web/public/brand/ when handed off.
 */
import type { FC } from "react";

type Props = {
  /** Dark for solid headers + footers. Light for over-hero transparent state. */
  tone?: "dark" | "light";
  className?: string;
};

export const BrandLogo: FC<Props> = ({ tone = "dark", className }) => {
  const color = tone === "light" ? "#FAFAF7" : "var(--color-primary-700)";
  return (
    <span
      aria-label="Propharmex"
      className={className}
      style={{
        fontFamily: "var(--font-display)",
        fontWeight: 600,
        fontSize: "1.125rem",
        letterSpacing: "-0.01em",
        color,
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 22,
          height: 22,
          borderRadius: 6,
          background:
            "linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-primary-800) 100%)",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.12)",
          display: "inline-block",
        }}
      />
      Propharmex
    </span>
  );
};

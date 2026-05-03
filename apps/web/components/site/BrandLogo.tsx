/**
 * Propharmex brand lockup.
 *
 * Renders the official Propharmex logo (mark + wordmark + tagline + pulse line)
 * served from `apps/web/public/brand/propharmex-logo.jpeg`.
 *
 * `tone="dark"` is the canonical full-color rendering — readable on light
 * surfaces (Paper, white, slate-50). `tone="light"` applies an interim
 * brightness/invert CSS filter to render the lockup as a white silhouette
 * for legibility on the navy hero background; a true brand-color light
 * variant is queued for PR-D when the footer adopts the navy treatment.
 */
import type { FC } from "react";
import Image from "next/image";

type Props = {
  /** Dark for solid headers + light footers. Light for over-hero transparent state. */
  tone?: "dark" | "light";
  className?: string;
  /** Add the LCP-prioritization hint when this lockup is the header logo. */
  priority?: boolean;
};

export const BrandLogo: FC<Props> = ({ tone = "dark", className, priority }) => {
  return (
    <Image
      src="/Propharmexlogo.png"
      alt="Propharmex — for a healthier tomorrow"
      width={728}
      height={205}
      priority={priority}
      className={[
        "h-10 w-auto md:h-12",
        tone === "light" ? "brightness-0 invert" : "",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
};

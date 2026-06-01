"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@propharmex/ui";

import { trackHeroCtaClick } from "../../lib/analytics";
import type { HeroSection } from "../../content/home";

interface HeroActionsProps {
  ctas: HeroSection["ctas"];
}

export function HeroActions({ ctas }: HeroActionsProps) {
  return (
    <>
      {ctas.map((cta) => {
        const variant =
          cta.variant === "primary"
            ? "primary"
            : cta.variant === "secondary"
              ? "secondary"
              : "ghost";
        return (
          <Button key={cta.href} asChild variant={variant} size="lg" className="min-h-11">
            <Link
              href={cta.href}
              onClick={() =>
                trackHeroCtaClick({
                  page: "home",
                  variant,
                  href: cta.href,
                  label: cta.label,
                })
              }
            >
              {cta.label}
              {cta.variant === "primary" ? <ArrowRight aria-hidden="true" size={18} /> : null}
            </Link>
          </Button>
        );
      })}
    </>
  );
}

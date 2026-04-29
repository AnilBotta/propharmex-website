"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { Button, MOTION, fadeRise, staggerContainer, useReducedMotion } from "@propharmex/ui";

import { trackHeroCtaClick } from "../../lib/analytics";
import type { HeroSection } from "../../content/home";

type Props = { content: HeroSection };

export function Hero({ content }: Props) {
  const reduce = useReducedMotion();

  return (
    <section
      aria-labelledby="home-hero-heading"
      className="relative isolate overflow-hidden bg-[var(--color-bg)] pt-20 pb-24 sm:pt-28 sm:pb-32"
    >
      <HeroBackdrop />

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-[1.35fr_1fr] lg:gap-16 lg:px-8">
        <motion.div
          initial={reduce ? false : "initial"}
          animate="animate"
          variants={staggerContainer}
          className="relative z-10 flex flex-col gap-6"
        >
          <motion.p
            variants={fadeRise}
            className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]"
          >
            {content.eyebrow}
          </motion.p>

          <h1
            id="home-hero-heading"
            className="font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-5xl lg:text-[clamp(2.75rem,4.2vw,3.75rem)] lg:leading-[1.08]"
          >
            <span>{content.headline}</span>{" "}
            <span className="text-[var(--color-primary-700)]">{content.headlineAccent}</span>
          </h1>

          <motion.p
            variants={fadeRise}
            className="max-w-2xl text-base leading-relaxed text-[var(--color-slate-800)] sm:text-lg"
          >
            {content.subhead}
          </motion.p>

          <motion.div
            variants={fadeRise}
            className="mt-2 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
          >
            {content.ctas.map((cta) => {
              const variant =
                cta.variant === "primary"
                  ? "primary"
                  : cta.variant === "secondary"
                    ? "secondary"
                    : "ghost";
              return (
                <Button
                  key={cta.href}
                  asChild
                  variant={variant}
                  size="lg"
                  className="min-h-11"
                >
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
                    {cta.variant === "primary" ? (
                      <ArrowRight aria-hidden="true" size={18} />
                    ) : null}
                  </Link>
                </Button>
              );
            })}
          </motion.div>

          <motion.p
            variants={fadeRise}
            className="mt-3 max-w-xl text-xs tracking-[0.02em] text-[var(--color-muted)]"
          >
            {content.microTrust}
          </motion.p>
        </motion.div>

        <div className="relative z-0 hidden lg:block">
          <MoleculeSvg reduce={reduce} />
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Inline SVG — light molecular lattice. No Lottie, no WebGL.                */
/* -------------------------------------------------------------------------- */

function HeroBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div
        className="absolute inset-x-0 top-0 h-[60%] opacity-70"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, var(--color-primary-50) 0%, transparent 60%)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-px"
        style={{ background: "var(--color-border)" }}
      />
    </div>
  );
}

type MoleculeProps = { reduce: boolean };

const MOLECULE_NODES: { id: string; cx: number; cy: number; r: number }[] = [
  { id: "n-center", cx: 160, cy: 160, r: 10 },
  { id: "n-tl", cx: 60, cy: 70, r: 7 },
  { id: "n-tr", cx: 260, cy: 80, r: 8 },
  { id: "n-bl", cx: 70, cy: 250, r: 8 },
  { id: "n-br", cx: 255, cy: 245, r: 7 },
];

const MOLECULE_LINKS: { id: string; from: number; to: number }[] = [
  { id: "l-1", from: 0, to: 1 },
  { id: "l-2", from: 0, to: 2 },
  { id: "l-3", from: 0, to: 3 },
  { id: "l-4", from: 0, to: 4 },
  { id: "l-5", from: 1, to: 2 },
  { id: "l-6", from: 3, to: 4 },
];

function MoleculeSvg({ reduce }: MoleculeProps) {
  return (
    <svg
      viewBox="0 0 320 320"
      role="img"
      aria-label="Abstract molecular diagram — two hubs connected by shared pathways."
      className="ml-auto size-full max-w-[420px]"
    >
      <defs>
        <radialGradient id="px-node-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--color-primary-600)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="var(--color-primary-600)" stopOpacity="0.2" />
        </radialGradient>
      </defs>

      {MOLECULE_LINKS.map((link, i) => {
        const from = MOLECULE_NODES[link.from];
        const to = MOLECULE_NODES[link.to];
        if (!from || !to) return null;
        return (
          <motion.line
            key={link.id}
            x1={from.cx}
            y1={from.cy}
            x2={to.cx}
            y2={to.cy}
            stroke="var(--color-primary-600)"
            strokeOpacity={0.45}
            strokeWidth={1.25}
            initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: reduce ? 0 : 0.8, delay: reduce ? 0 : 0.1 + i * 0.08, ease: MOTION.enter.ease }}
          />
        );
      })}

      {MOLECULE_NODES.map((node, i) => (
        <motion.circle
          key={node.id}
          cx={node.cx}
          cy={node.cy}
          r={node.r}
          fill="url(#px-node-grad)"
          stroke="var(--color-primary-700)"
          strokeOpacity={0.6}
          strokeWidth={1}
          initial={reduce ? { scale: 1, opacity: 1 } : { scale: 0.6, opacity: 0 }}
          animate={
            reduce
              ? { scale: 1, opacity: 1 }
              : { scale: [1, 1.08, 1], opacity: 1 }
          }
          transition={
            reduce
              ? { duration: 0 }
              : {
                  opacity: { duration: 0.3, delay: 0.2 + i * 0.08 },
                  scale: {
                    duration: 4.2 + i * 0.35,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.4 + i * 0.12,
                  },
                }
          }
          style={{ transformOrigin: `${node.cx}px ${node.cy}px` }}
        />
      ))}
    </svg>
  );
}

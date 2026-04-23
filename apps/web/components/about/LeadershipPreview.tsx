"use client";

/**
 * LeadershipPreview — client island used on /about.
 *
 * Renders a preview grid of three leader cards with a "Profile in preparation"
 * badge while every record carries the `stub: true` sentinel. Each card links
 * into /about/leadership#<slug> for the modal-detail experience.
 */
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import {
  Button,
  fadeRise,
  staggerContainer,
  useReducedMotion,
} from "@propharmex/ui";

import type {
  AboutLeader,
  AboutLeadershipPreview,
} from "../../content/about";

type Props = {
  content: AboutLeadershipPreview;
  leaders: AboutLeader[];
  stubBadgeLabel: string;
};

export function LeadershipPreview({ content, leaders, stubBadgeLabel }: Props) {
  const reduce = useReducedMotion();

  return (
    <section
      id={content.anchorId}
      aria-labelledby="about-leadership-heading"
      className="scroll-mt-24 border-b border-[var(--color-border)] bg-[var(--color-bg)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
              {content.eyebrow}
            </p>
            <h2
              id="about-leadership-heading"
              className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl"
            >
              {content.heading}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[var(--color-slate-800)]">
              {content.intro}
            </p>
          </div>
          <Button asChild variant="secondary" size="md" className="self-start">
            <Link href={content.ctaHref}>
              {content.ctaLabel}
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <motion.ul
          initial={reduce ? false : "initial"}
          whileInView="animate"
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          variants={staggerContainer}
          className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-3"
          aria-label="Leadership preview"
        >
          {leaders.map((leader) => (
            <motion.li
              key={leader.id}
              variants={fadeRise}
              className="list-none"
            >
              <Link
                href={`${content.ctaHref}#${leader.slug}`}
                className="flex h-full flex-col gap-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-colors hover:border-[var(--color-primary-600)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
              >
                <div className="relative size-14 overflow-hidden rounded-[var(--radius-full)] bg-[var(--color-primary-50)]">
                  <Image
                    src="/brand/leadership/placeholder-headshot.svg"
                    alt=""
                    fill
                    sizes="56px"
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-[var(--color-fg)]">
                    {leader.name}
                  </h3>
                  <p className="mt-1 text-sm text-[var(--color-primary-700)]">
                    {leader.role}
                  </p>
                  <p className="mt-1 text-xs text-[var(--color-muted)]">
                    {leader.location}
                  </p>
                </div>
                <p className="text-sm leading-relaxed text-[var(--color-slate-800)]">
                  {leader.credential}
                </p>
                {leader.stub ? (
                  <span className="mt-auto inline-flex w-fit items-center gap-1 rounded-[var(--radius-full)] border border-[var(--color-border)] bg-[var(--color-slate-50)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--color-muted)]">
                    {stubBadgeLabel}
                  </span>
                ) : null}
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

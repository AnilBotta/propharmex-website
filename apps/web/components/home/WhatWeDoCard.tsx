"use client";

import Link from "next/link";
import { ArrowUpRight, FileCheck2, FlaskConical, Microscope } from "lucide-react";
import type { ComponentType } from "react";

import { trackServiceCardClick } from "../../lib/analytics";
import type { CapabilityCard } from "../../content/home";

const ICON: Record<CapabilityCard["icon"], ComponentType<{ size?: number; className?: string }>> = {
  flask: FlaskConical,
  microscope: Microscope,
  "file-check": FileCheck2,
};

interface WhatWeDoCardProps {
  card: CapabilityCard;
}

export function WhatWeDoCard({ card }: WhatWeDoCardProps) {
  const Icon = ICON[card.icon];

  return (
    <Link
      href={card.href}
      onClick={() =>
        trackServiceCardClick({
          surface: "home-what-we-do",
          serviceId: card.id,
          href: card.href,
        })
      }
      className="group flex h-full min-h-[220px] flex-col gap-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-[border-color,box-shadow] duration-150 ease-out hover:border-[var(--color-primary-600)] hover:shadow-[var(--shadow-sm)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2"
    >
      <span
        aria-hidden="true"
        className="grid size-10 place-items-center rounded-[var(--radius-md)] bg-[var(--color-primary-50)] text-[var(--color-primary-700)]"
      >
        <Icon size={20} />
      </span>
      <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-[var(--color-fg)]">
        {card.title}
      </h3>
      <p className="text-sm leading-relaxed text-[var(--color-slate-800)]">{card.description}</p>
      <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-primary-700)]">
        {card.linkLabel}
        <ArrowUpRight
          size={16}
          aria-hidden="true"
          className="transition-transform duration-150 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      </span>
    </Link>
  );
}

"use client";

/**
 * CertificationWall — /quality-compliance.
 *
 * Interactive grid of certifications + framework alignments. Clicking a card
 * opens a Radix Dialog with the full scope, issuer detail, and the "request
 * documentation" affordance (routes to /contact with a per-cert source tag).
 *
 * Per Prompt 8 quickest-path policy:
 *  - Only the Health Canada DEL row carries status="confirmed" and a live
 *    primary-source link. Every other row is `under-confirmation` or
 *    `alignment` and renders a stub badge.
 *  - No fabricated cert numbers, no fabricated issue/expiry dates.
 */
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, ShieldCheck } from "lucide-react";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  fadeRise,
  staggerContainer,
  useReducedMotion,
} from "@propharmex/ui";

import type {
  QualityCertification,
  QualityCertificationWall,
  QualityStatus,
} from "../../content/quality";

type Props = { content: QualityCertificationWall };

const STATUS_LABEL: Record<QualityStatus, string> = {
  confirmed: "Held · verifiable",
  "under-confirmation": "Documentation on request",
  alignment: "Operating alignment",
};

export function CertificationWall({ content }: Props) {
  const reduce = useReducedMotion();
  const [openId, setOpenId] = useState<string | null>(null);
  const active = content.items.find((c) => c.id === openId) ?? null;

  return (
    <section
      id="certification-wall"
      aria-labelledby="quality-certs-heading"
      className="scroll-mt-24 border-b border-[var(--color-border)] bg-[var(--color-slate-50)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
            {content.eyebrow}
          </p>
          <h2
            id="quality-certs-heading"
            className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl"
          >
            {content.heading}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[var(--color-slate-800)]">
            {content.lede}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)]">
            {content.stubNotice}
          </p>
        </header>

        <motion.ul
          initial={reduce ? false : "initial"}
          whileInView="animate"
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          variants={staggerContainer}
          className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          aria-label="Propharmex certifications and framework alignments"
        >
          {content.items.map((cert) => (
            <motion.li key={cert.id} variants={fadeRise} className="list-none">
              <CertificationCard
                cert={cert}
                onOpen={() => setOpenId(cert.id)}
              />
            </motion.li>
          ))}
        </motion.ul>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Button asChild variant={content.requestAction.variant} size="lg">
            <Link href={content.requestAction.href}>
              {content.requestAction.label}
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </Button>
        </div>
      </div>

      <Dialog
        open={openId !== null}
        onOpenChange={(next) => {
          if (!next) setOpenId(null);
        }}
      >
        {active ? <CertificationModal cert={active} /> : null}
      </Dialog>
    </section>
  );
}

function CertificationCard({
  cert,
  onOpen,
}: {
  cert: QualityCertification;
  onOpen: () => void;
}) {
  const isConfirmed = cert.status === "confirmed";
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      className="group flex h-full w-full flex-col gap-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-left transition-colors hover:border-[var(--color-primary-600)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className={`grid size-10 shrink-0 place-items-center rounded-[var(--radius-md)] ${
            isConfirmed
              ? "bg-[var(--color-primary-50)] text-[var(--color-primary-700)]"
              : "bg-[var(--color-slate-100)] text-[var(--color-muted)]"
          }`}
        >
          <ShieldCheck size={18} />
        </span>
        <StatusBadge status={cert.status} />
      </div>
      <div>
        <h3 className="font-[family-name:var(--font-display)] text-base font-semibold tracking-tight text-[var(--color-fg)]">
          {cert.title}
        </h3>
        <p className="mt-1 text-xs text-[var(--color-muted)]">{cert.issuer}</p>
        <p className="mt-3 text-sm leading-relaxed text-[var(--color-slate-800)]">
          {cert.scope}
        </p>
      </div>
      <div className="mt-auto flex items-center justify-between text-xs">
        <span className="text-[var(--color-muted)]">
          {cert.validity ?? "Validity on request"}
        </span>
        <span
          aria-hidden="true"
          className="font-medium text-[var(--color-primary-700)] transition-opacity group-hover:underline"
        >
          View scope →
        </span>
      </div>
    </button>
  );
}

function StatusBadge({ status }: { status: QualityStatus }) {
  const tone =
    status === "confirmed"
      ? "border-[var(--color-primary-600)] bg-[var(--color-primary-50)] text-[var(--color-primary-700)]"
      : status === "alignment"
        ? "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-slate-800)]"
        : "border-[var(--color-border)] bg-[var(--color-slate-50)] text-[var(--color-muted)]";
  return (
    <span
      className={`inline-flex items-center rounded-[var(--radius-full)] border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] ${tone}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

function CertificationModal({ cert }: { cert: QualityCertification }) {
  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>{cert.title}</DialogTitle>
        <DialogDescription>
          {cert.issuer} · {STATUS_LABEL[cert.status]}
        </DialogDescription>
      </DialogHeader>
      <div className="flex max-h-[55vh] flex-col gap-4 overflow-y-auto pr-1 text-sm leading-relaxed text-[var(--color-slate-800)]">
        <p>
          <span className="font-semibold text-[var(--color-fg)]">Scope — </span>
          {cert.scope}
        </p>
        <p>{cert.detail}</p>
        {cert.validity ? (
          <p className="text-[var(--color-muted)]">
            <span className="font-semibold text-[var(--color-fg)]">
              Validity:{" "}
            </span>
            {cert.validity}
          </p>
        ) : null}
        {cert.reference ? (
          <p>
            <span className="font-semibold text-[var(--color-fg)]">
              Reference:{" "}
            </span>
            {cert.reference.kind === "primary" ? (
              <a
                href={cert.reference.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[var(--color-primary-700)] underline underline-offset-2"
              >
                {cert.reference.label}
                <ExternalLink size={12} aria-hidden="true" />
              </a>
            ) : (
              <span className="text-[var(--color-muted)]">
                {cert.reference.label}
              </span>
            )}
          </p>
        ) : null}
        {cert.status !== "confirmed" ? (
          <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-slate-50)] p-3 text-xs leading-relaxed text-[var(--color-muted)]">
            Documentation — certificate PDF, scope annex, and validity letter —
            is released to qualified partners under NDA. Use the request button
            on the wall to open a scoped conversation.
          </div>
        ) : null}
      </div>
    </DialogContent>
  );
}

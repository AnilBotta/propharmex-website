"use client";

/**
 * LeaderGrid — /about/leadership.
 *
 * Grid of leader cards backed by the stubbed `LEADERS` dictionary. Clicking a
 * card (or pressing Enter on the focusable card) opens a Radix Dialog with
 * the full bio, credentials, publications, and LinkedIn link.
 *
 * A11y:
 *  - Cards are `<button>` elements, not anchors, because the click action is a
 *    dialog open (not a navigation). Deep-linking is still supported: the
 *    page checks `location.hash` on mount and opens the matching leader.
 *  - Dialog uses the shared `Dialog` primitive which already handles focus
 *    trap, Escape to close, and scroll-lock.
 *  - Each stub leader renders a "Profile in preparation" badge so the placeholder
 *    state is visible to assistive tech, not just visually.
 */
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink, Linkedin } from "lucide-react";

import {
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
  AboutLeader,
  AboutLeadershipPage,
} from "../../content/about";

type Props = {
  leaders: AboutLeader[];
  copy: AboutLeadershipPage;
};

export function LeaderGrid({ leaders, copy }: Props) {
  const reduce = useReducedMotion();
  const [openId, setOpenId] = useState<string | null>(null);

  // Deep-link support: /about/leadership#<slug> opens that leader's modal.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const openFromHash = () => {
      const slug = window.location.hash.replace(/^#/, "");
      if (!slug) return;
      const match = leaders.find((l) => l.slug === slug);
      if (match) setOpenId(match.id);
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, [leaders]);

  const activeLeader = leaders.find((l) => l.id === openId) ?? null;

  return (
    <>
      <motion.ul
        initial={reduce ? false : "initial"}
        whileInView="animate"
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        variants={staggerContainer}
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        aria-label="Propharmex leadership team"
      >
        {leaders.map((leader) => (
          <motion.li
            key={leader.id}
            variants={fadeRise}
            id={leader.slug}
            className="list-none scroll-mt-28"
          >
            <LeaderCard
              leader={leader}
              onOpen={() => setOpenId(leader.id)}
              stubBadgeLabel={copy.stubNotice}
            />
          </motion.li>
        ))}
      </motion.ul>

      <Dialog
        open={openId !== null}
        onOpenChange={(next) => {
          if (!next) setOpenId(null);
        }}
      >
        {activeLeader ? (
          <LeaderModal leader={activeLeader} copy={copy} />
        ) : null}
      </Dialog>
    </>
  );
}

function LeaderCard({
  leader,
  onOpen,
  stubBadgeLabel,
}: {
  leader: AboutLeader;
  onOpen: () => void;
  stubBadgeLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      className="group flex h-full w-full flex-col gap-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-left transition-colors hover:border-[var(--color-primary-600)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
    >
      <div className="relative size-16 overflow-hidden rounded-[var(--radius-full)] bg-[var(--color-primary-50)]">
        <Image
          src="/brand/leadership/placeholder-headshot.svg"
          alt=""
          fill
          sizes="64px"
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
      <div className="mt-auto flex items-center justify-between">
        {leader.stub ? (
          <span
            aria-label={stubBadgeLabel}
            className="inline-flex items-center gap-1 rounded-[var(--radius-full)] border border-[var(--color-border)] bg-[var(--color-slate-50)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--color-muted)]"
          >
            Profile in preparation
          </span>
        ) : (
          <span />
        )}
        <span
          aria-hidden="true"
          className="text-xs font-medium text-[var(--color-primary-700)] transition-opacity group-hover:underline"
        >
          View profile →
        </span>
      </div>
    </button>
  );
}

function LeaderModal({
  leader,
  copy,
}: {
  leader: AboutLeader;
  copy: AboutLeadershipPage;
}) {
  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <div className="flex items-center gap-4">
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
            <DialogTitle>{leader.name}</DialogTitle>
            <DialogDescription>
              {leader.role} · {leader.location}
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      {leader.stub ? (
        <p className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-slate-50)] p-3 text-xs leading-relaxed text-[var(--color-muted)]">
          {copy.stubNotice}
        </p>
      ) : null}

      <div className="flex max-h-[55vh] flex-col gap-5 overflow-y-auto pr-1">
        <div className="flex flex-col gap-3">
          {leader.bio.map((paragraph, i) => (
            <p
              key={i}
              className="text-sm leading-relaxed text-[var(--color-slate-800)]"
            >
              {paragraph}
            </p>
          ))}
        </div>

        {leader.credentials.length > 0 ? (
          <section aria-labelledby={`${leader.id}-credentials`}>
            <h4
              id={`${leader.id}-credentials`}
              className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]"
            >
              {copy.modal.credentialsHeading}
            </h4>
            <ul className="mt-2 flex flex-col gap-1.5">
              {leader.credentials.map((c) => (
                <li
                  key={c}
                  className="flex items-start gap-2 text-sm leading-relaxed text-[var(--color-slate-800)]"
                >
                  <span
                    aria-hidden="true"
                    className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[var(--color-primary-600)]"
                  />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section aria-labelledby={`${leader.id}-publications`}>
          <h4
            id={`${leader.id}-publications`}
            className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]"
          >
            {copy.modal.publicationsHeading}
          </h4>
          {leader.publications.length > 0 ? (
            <ul className="mt-2 flex flex-col gap-2">
              {leader.publications.map((pub) => (
                <li key={pub.title} className="text-sm leading-relaxed">
                  {pub.href ? (
                    <a
                      href={pub.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-start gap-1.5 text-[var(--color-fg)] underline underline-offset-2 hover:text-[var(--color-primary-700)]"
                    >
                      <span>
                        {pub.title}
                        <span className="text-[var(--color-muted)]">
                          {" "}
                          — {pub.venue}, {pub.year}
                        </span>
                      </span>
                      <ExternalLink size={12} aria-hidden="true" className="mt-1" />
                    </a>
                  ) : (
                    <span className="text-[var(--color-fg)]">
                      {pub.title}
                      <span className="text-[var(--color-muted)]">
                        {" "}
                        — {pub.venue}, {pub.year}
                      </span>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              {copy.modal.publicationsEmpty}
            </p>
          )}
        </section>

        <section aria-labelledby={`${leader.id}-linkedin`}>
          <h4
            id={`${leader.id}-linkedin`}
            className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]"
          >
            {copy.modal.linkedinLabel}
          </h4>
          {leader.linkedin ? (
            <a
              href={leader.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-primary-700)] underline underline-offset-2"
            >
              <Linkedin size={14} aria-hidden="true" />
              View on LinkedIn
            </a>
          ) : (
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              {copy.modal.linkedinEmpty}
            </p>
          )}
        </section>
      </div>
    </DialogContent>
  );
}

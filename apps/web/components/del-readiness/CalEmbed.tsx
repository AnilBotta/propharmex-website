"use client";

/**
 * CalEmbed — "Book a DEL consultation" CTA on the results screen.
 *
 * When `calLink` is set, renders an `<a target="_blank">` to the
 * sponsor's Cal.com URL with a `metadata[source]` parameter so booking
 * analytics can attribute back to the assessment.
 *
 * When `calLink` is unset (preview deploys, dev without secrets), falls
 * through to the same `/contact?source=del-readiness-results` link the
 * placeholder used. The user always has a path forward.
 *
 * No iframe — opening Cal.com in a new tab is the lighter pattern for a
 * results-screen footer (the full inline embed lives on /contact via
 * CalBookingPanel).
 */
import { Calendar } from "lucide-react";

import { DEL_READINESS } from "../../content/del-readiness";

interface Props {
  calLink: string | undefined;
  onClick?: () => void;
}

export function CalEmbed({ calLink, onClick }: Props) {
  const href = calLink
    ? `https://cal.com/${calLink}?metadata[source]=del-readiness`
    : DEL_READINESS.results.actions.bookConsultation.href;
  const isExternal = Boolean(calLink);

  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-[var(--radius-md)] bg-[var(--color-primary-700)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-primary-800)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-1"
    >
      <Calendar aria-hidden="true" size={14} />
      {DEL_READINESS.results.actions.bookConsultation.label}
    </a>
  );
}

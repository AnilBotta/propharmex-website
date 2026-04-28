"use client";

/**
 * RegionDetectionBanner — first-visit notice that names the detected
 * region and offers an inline override.
 *
 * Mount only when the user hasn't dismissed the banner yet (gated by
 * the `px-region-banner-dismissed` cookie, checked server-side via
 * `shouldShowRegionBanner()`).
 *
 * Two interactions:
 *   - "Got it" → POST /api/region { dismissBanner: true }, hide.
 *   - "Change" → expand inline picker; choosing a region calls
 *                `setRegion(next, { source: "banner" })` which writes
 *                the cookie + reloads.
 *
 * Visual posture: subtle. Top of the page, single-line on desktop,
 * stacked on mobile. Border + soft tint, never a modal or a dimmed
 * overlay — privacy-respecting per the spec line "subtle banner".
 *
 * Accessibility: rendered as `role="region"` with an `aria-label`,
 * dismiss button is a real button with an aria-label.
 */
import { useState } from "react";
import { Globe2, X } from "lucide-react";

import { REGION_DESCRIPTORS, type Region } from "@propharmex/lib/region";

import { REGION_COPY } from "../../content/region";

import { useRegion } from "./RegionContext";
import { trackRegionBannerDismissed } from "./region-telemetry";

export function RegionDetectionBanner() {
  const { region, setRegion, pending } = useRegion();
  const [open, setOpen] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const descriptor = REGION_DESCRIPTORS.find((d) => d.code === region);
  const regionLabel = descriptor?.label ?? "your region";

  async function dismiss() {
    setError(null);
    try {
      const res = await fetch("/api/region", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dismissBanner: true }),
      });
      if (!res.ok) {
        setError(REGION_COPY.errors.saveFailed);
        return;
      }
      trackRegionBannerDismissed({ region });
      setOpen(false);
    } catch {
      setError(REGION_COPY.errors.saveFailed);
    }
  }

  async function pickRegion(next: Region) {
    setError(null);
    if (next === region) {
      // Same as detected; treat as a dismiss.
      await dismiss();
      return;
    }
    await setRegion(next, { source: "banner" });
    // setRegion triggers a full reload — no need to setOpen(false).
  }

  return (
    <div
      role="region"
      aria-label="Region preference"
      className="border-b border-[var(--color-border)] bg-[var(--color-primary-50)] px-4 py-2.5 sm:px-6 lg:px-8"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-2 text-[13px] leading-relaxed text-[var(--color-fg)]">
          <Globe2
            aria-hidden="true"
            size={16}
            className="mt-0.5 shrink-0 text-[var(--color-primary-700)]"
          />
          <p>
            {REGION_COPY.banner.bodyTemplate(regionLabel)}{" "}
            <span className="text-[var(--color-muted)]">
              {REGION_COPY.banner.certNote[region]}
            </span>
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {expanded ? (
            <RegionPicker
              currentRegion={region}
              disabled={pending}
              onPick={pickRegion}
              onCancel={() => setExpanded(false)}
            />
          ) : (
            <>
              <button
                type="button"
                onClick={() => setExpanded(true)}
                disabled={pending}
                className="rounded-[var(--radius-xs)] px-2 py-1 text-[12px] font-medium text-[var(--color-primary-700)] hover:underline disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
              >
                {REGION_COPY.banner.changeLabel}
              </button>
              <button
                type="button"
                onClick={dismiss}
                disabled={pending}
                aria-label={REGION_COPY.banner.dismissAriaLabel}
                className="inline-flex items-center gap-1 rounded-[var(--radius-xs)] px-2 py-1 text-[12px] font-medium text-[var(--color-muted)] hover:text-[var(--color-fg)] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
              >
                {REGION_COPY.banner.dismissLabel}
                <X aria-hidden="true" size={12} />
              </button>
            </>
          )}
        </div>
      </div>

      {error ? (
        <p
          role="alert"
          className="mx-auto mt-1.5 max-w-7xl text-[12px] text-[var(--color-danger)]"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Inline picker                                                              */
/* -------------------------------------------------------------------------- */

function RegionPicker({
  currentRegion,
  disabled,
  onPick,
  onCancel,
}: {
  currentRegion: Region;
  disabled: boolean;
  onPick: (next: Region) => void;
  onCancel: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {REGION_DESCRIPTORS.map((d) => {
        const isCurrent = d.code === currentRegion;
        return (
          <button
            key={d.code}
            type="button"
            onClick={() => onPick(d.code)}
            disabled={disabled}
            aria-current={isCurrent ? "true" : undefined}
            className={`rounded-[var(--radius-full)] border px-2.5 py-1 text-[11px] font-medium transition disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] ${
              isCurrent
                ? "border-[var(--color-primary-700)] bg-[var(--color-primary-700)] text-white"
                : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-fg)] hover:border-[var(--color-primary-700)]"
            }`}
          >
            {d.label}
          </button>
        );
      })}
      <button
        type="button"
        onClick={onCancel}
        disabled={disabled}
        className="rounded-[var(--radius-xs)] px-2 py-1 text-[11px] font-medium text-[var(--color-muted)] hover:text-[var(--color-fg)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        Cancel
      </button>
    </div>
  );
}

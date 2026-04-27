/**
 * CalBookingPanel — /contact Cal.com booking section, RSC (Prompt 17, commit 4).
 *
 * Conditional render based on the resolved CAL_LINK env value, passed in as
 * a prop from the RSC page so this component never has to read process.env
 * directly. Two states:
 *
 *   - calLink set → lazy-loaded iframe to https://cal.com/{calLink}
 *   - calLink unset → fallback CTA panel that points to a mailto with the
 *     same source-tracking parameter as the inquiry form
 *
 * No client JS — the iframe is a plain HTML element and the fallback is a
 * native <a>. The section anchor `#booking` matches the success-state link
 * inside InquiryForm so the form's "Schedule a discovery call" button
 * scrolls smoothly to here.
 *
 * The full Cal.com inline embed (@calcom/embed-react) is deferred — adds
 * client-side weight we don't need until the booking flow grows beyond a
 * single event type. The iframe path renders the same booking surface.
 */
import type { FC } from "react";

import { Button } from "@propharmex/ui";

import type { ContactContent } from "../../content/contact";

import { SectionReveal } from "./SectionReveal";

type Props = {
  content: ContactContent["cal"];
  calLink: string | undefined;
  fallbackEmail: string;
};

export const CalBookingPanel: FC<Props> = ({
  content,
  calLink,
  fallbackEmail,
}) => {
  const calUrl = calLink ? `https://cal.com/${calLink}` : null;

  return (
    <section
      id="booking"
      aria-labelledby="contact-cal-heading"
      className="scroll-mt-24 border-b border-[var(--color-border)] bg-[var(--color-slate-50)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionReveal className="max-w-3xl">
          <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
            {content.eyebrow}
          </p>
          <h2
            id="contact-cal-heading"
            className="mt-3 font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-3xl"
          >
            {content.heading}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--color-slate-800)]">
            {content.lede}
          </p>
        </SectionReveal>

        <SectionReveal className="mt-10">
          {calUrl ? (
            <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg)]">
              <iframe
                title={content.iframeTitle}
                src={calUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-[760px] w-full border-0"
              />
            </div>
          ) : (
            <div className="flex flex-col items-start gap-4 rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] bg-[var(--color-bg)] p-6 sm:p-8">
              <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--color-fg)]">
                {content.fallbackHeading}
              </h3>
              <p className="text-sm leading-relaxed text-[var(--color-slate-800)]">
                {content.fallbackBody}
              </p>
              <Button asChild variant="primary" size="md">
                <a
                  href={`mailto:${fallbackEmail}?subject=Discovery%20call%20%E2%80%94%20Propharmex&body=Hello%20Propharmex%20team%2C%0A%0AI%27d%20like%20to%20schedule%20a%20short%20discovery%20call.%20Here%27s%20the%20programme%20I%27m%20working%20on%3A%0A%0A`}
                >
                  {content.fallbackCtaLabel}
                </a>
              </Button>
            </div>
          )}
        </SectionReveal>
      </div>
    </section>
  );
};

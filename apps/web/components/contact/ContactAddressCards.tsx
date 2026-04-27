/**
 * ContactAddressCards — dual-hub address cards for /contact, RSC.
 *
 * Reads from the canonical FACILITIES array in apps/web/content/site-nav.ts
 * so there is one place to update when client confirms street addresses
 * and phone numbers. Until then, cards show the city + region + country
 * with the existing "address on file" posture used elsewhere on the site.
 *
 * Each card includes a lazy-loaded Google Maps iframe (city-level zoom)
 * and an "Open in Google Maps" link. No client JS in this component.
 */
import type { FC } from "react";

import type { ContactContent } from "../../content/contact";
import { FACILITIES } from "../../content/site-nav";

import { SectionReveal } from "./SectionReveal";

type Props = { content: ContactContent["addresses"] };

export const ContactAddressCards: FC<Props> = ({ content }) => {
  return (
    <section
      aria-labelledby="contact-addresses-heading"
      className="border-b border-[var(--color-border)] bg-[var(--color-surface)] py-16 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionReveal className="max-w-3xl">
          <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
            {content.eyebrow}
          </p>
          <h2
            id="contact-addresses-heading"
            className="mt-3 font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-3xl"
          >
            {content.heading}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--color-slate-800)]">
            {content.lede}
          </p>
        </SectionReveal>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {FACILITIES.map((facility) => {
            const hasStreet =
              facility.streetLines.length > 0 &&
              !facility.streetLines[0]?.startsWith("—");
            const cityRegionCountry = [
              facility.city,
              facility.region,
              facility.country,
            ]
              .filter(Boolean)
              .join(", ");
            const mapsQuery = encodeURIComponent(
              `${facility.name}, ${cityRegionCountry}`,
            );
            const mapEmbedUrl = `https://www.google.com/maps?q=${mapsQuery}&output=embed`;
            const mapsLinkUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

            return (
              <article
                key={facility.code}
                className="flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg)]"
                aria-labelledby={`contact-card-${facility.code.toLowerCase()}-heading`}
              >
                <div className="aspect-[16/9] w-full bg-[var(--color-slate-100)]">
                  <iframe
                    title={`Map of ${facility.name}, ${cityRegionCountry}`}
                    src={mapEmbedUrl}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="h-full w-full border-0"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-4 p-6">
                  <div>
                    <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
                      {facility.country}
                    </p>
                    <h3
                      id={`contact-card-${facility.code.toLowerCase()}-heading`}
                      className="mt-2 font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight text-[var(--color-fg)]"
                    >
                      {facility.name}
                    </h3>
                    <p className="mt-1 text-sm text-[var(--color-muted)]">
                      {facility.role}
                    </p>
                  </div>

                  <dl className="grid grid-cols-1 gap-3 text-sm">
                    <div>
                      <dt className="font-medium text-[var(--color-fg)]">
                        Address
                      </dt>
                      <dd className="mt-1 text-[var(--color-slate-800)]">
                        {hasStreet ? (
                          <>
                            {facility.streetLines.map((line) => (
                              <span key={line} className="block">
                                {line}
                              </span>
                            ))}
                            <span className="block">{cityRegionCountry}</span>
                            {facility.postalCode ? (
                              <span className="block">
                                {facility.postalCode}
                              </span>
                            ) : null}
                          </>
                        ) : (
                          <>
                            <span className="block">{cityRegionCountry}</span>
                            <span className="mt-1 block text-xs text-[var(--color-muted)]">
                              {content.addressOnFileNote}
                            </span>
                          </>
                        )}
                      </dd>
                    </div>

                    {facility.email ? (
                      <div>
                        <dt className="font-medium text-[var(--color-fg)]">
                          Email
                        </dt>
                        <dd className="mt-1">
                          <a
                            href={`mailto:${facility.email}`}
                            className="text-[var(--color-primary-700)] underline-offset-2 hover:underline focus-visible:underline"
                          >
                            {facility.email}
                          </a>
                        </dd>
                      </div>
                    ) : null}

                    <div>
                      <dt className="font-medium text-[var(--color-fg)]">
                        Phone
                      </dt>
                      <dd className="mt-1 text-[var(--color-slate-800)]">
                        {facility.phone ? (
                          <a
                            href={`tel:${facility.phone.replace(/\s+/g, "")}`}
                            className="text-[var(--color-primary-700)] underline-offset-2 hover:underline focus-visible:underline"
                          >
                            {facility.phone}
                          </a>
                        ) : (
                          <span className="text-xs text-[var(--color-muted)]">
                            {content.phoneOnFileNote}
                          </span>
                        )}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-auto pt-2">
                    <a
                      href={mapsLinkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-medium text-[var(--color-primary-700)] underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
                      aria-label={`${content.mapsLinkLabel}: ${facility.name}`}
                    >
                      {content.mapsLinkLabel}
                      <span aria-hidden="true">→</span>
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

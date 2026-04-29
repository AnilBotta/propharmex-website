/**
 * Site footer.
 *
 * Five content columns (Services, Industries, Company, Resources, Contact),
 * address blocks for Mississauga and Hyderabad, Health Canada DEL badge,
 * newsletter signup, legal row, and current-year line. Footer is mostly
 * server-rendered; the newsletter form is a client island.
 */
import Link from "next/link";
import { Mail, MapPin } from "lucide-react";

import {
  FACILITIES,
  FOOTER_COLUMNS,
  LEGAL_LINKS,
  NEWSLETTER,
} from "../../content/site-nav";
import { BrandLogo } from "./BrandLogo";
import { NewsletterForm } from "./NewsletterForm";

const currentYear = new Date().getFullYear();

export function Footer() {
  return (
    <footer
      role="contentinfo"
      className="border-t border-[var(--color-border)] bg-[var(--color-slate-50)]"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2.4fr_1.4fr]">
          {/* Brand + mission */}
          <div className="flex flex-col gap-6">
            <BrandLogo />
            <p className="text-sm leading-relaxed text-[var(--color-slate-700)]">
              Canadian pharmaceutical services company anchored at our
              Mississauga, Ontario site under Health Canada Drug Establishment
              Licence. Pharmaceutical development, analytical services,
              regulatory affairs, and 3PL distribution for drug developers
              globally.
            </p>
            <DelBadge />
          </div>

          {/* Link columns */}
          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-8 sm:grid-cols-4"
          >
            {FOOTER_COLUMNS.map((col) => (
              <div key={col.heading}>
                <h3 className="mb-4 font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.08em] text-[var(--color-muted)]">
                  {col.heading}
                </h3>
                <ul className="flex flex-col gap-2">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="rounded-[var(--radius-xs)] text-sm text-[var(--color-slate-800)] hover:text-[var(--color-primary-700)] focus-visible:text-[var(--color-primary-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          {/* Newsletter */}
          <div>
            <h3 className="mb-2 font-[family-name:var(--font-display)] text-sm font-semibold tracking-tight text-[var(--color-fg)]">
              {NEWSLETTER.heading}
            </h3>
            <p className="mb-4 text-sm text-[var(--color-slate-700)]">
              {NEWSLETTER.description}
            </p>
            <NewsletterForm />
          </div>
        </div>

        {/* Addresses */}
        <div className="mt-12 grid gap-6 border-t border-[var(--color-border)] pt-8 sm:grid-cols-2">
          {FACILITIES.map((f) => (
            <address
              key={f.code}
              className="not-italic text-sm text-[var(--color-slate-700)]"
            >
              <p className="mb-1 font-semibold text-[var(--color-fg)]">
                {f.name}
              </p>
              <p className="mb-2 text-xs uppercase tracking-[0.06em] text-[var(--color-muted)]">
                {f.role}
              </p>
              <p className="flex items-start gap-2">
                <MapPin
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0 text-[var(--color-muted)]"
                />
                <span>
                  {f.streetLines.join(", ")}
                  {f.streetLines.length ? ", " : ""}
                  {f.city}, {f.region} {f.postalCode}, {f.country}
                </span>
              </p>
              {f.email && (
                <p className="mt-1 flex items-center gap-2">
                  <Mail
                    aria-hidden="true"
                    className="size-4 shrink-0 text-[var(--color-muted)]"
                  />
                  <a
                    href={`mailto:${f.email}`}
                    className="hover:text-[var(--color-primary-700)]"
                  >
                    {f.email}
                  </a>
                </p>
              )}
            </address>
          ))}
        </div>

        {/* Legal row */}
        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-[var(--color-border)] pt-6 text-xs text-[var(--color-muted)] sm:flex-row sm:items-center">
          <p>
            © {currentYear} Propharmex Inc. All rights reserved. Propharmex is
            not a licensed pharmacy; no medical advice is provided on this site.
          </p>
          <ul aria-label="Legal" className="flex flex-wrap gap-x-4 gap-y-1">
            {LEGAL_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="rounded-[var(--radius-xs)] hover:text-[var(--color-fg)] focus-visible:text-[var(--color-fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

/**
 * Health Canada DEL badge.
 *
 * The licence number is a placeholder until the real DEL reference is
 * wired via Sanity siteSettings in Prompt 4. Any DEL number we display
 * must match the public Health Canada register at
 * https://health-products.canada.ca/dpd-bdpp/.
 */
function DelBadge() {
  return (
    <div
      aria-label="Health Canada Drug Establishment Licence holder"
      className="inline-flex max-w-fit items-center gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2"
    >
      <div
        aria-hidden="true"
        className="grid size-8 place-items-center rounded-[var(--radius-sm)] bg-[var(--color-primary-50)] font-[family-name:var(--font-display)] text-xs font-semibold text-[var(--color-primary-700)]"
      >
        DEL
      </div>
      <div className="flex flex-col leading-tight">
        <span className="text-xs text-[var(--color-muted)]">Health Canada</span>
        <span className="text-sm font-semibold text-[var(--color-fg)]">
          Drug Establishment Licence holder
        </span>
      </div>
    </div>
  );
}

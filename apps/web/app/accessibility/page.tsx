/**
 * /accessibility — public accessibility statement (Prompt 26 PR-A).
 *
 * Required deliverable: a public statement describing the site's
 * conformance level, known limitations, accessibility-related contact
 * channel, and the date of last review. The matching internal
 * Accessibility Conformance Report (VPAT 2.5) lives at
 * `docs/accessibility-conformance.md` (Prompt 26 PR-B).
 *
 * Posture: honest about partial conformance. We do not claim full
 * WCAG 2.1 AA without manual screen-reader verification (which is
 * scheduled for PR-B).
 */
import type { Metadata } from "next";
import Link from "next/link";

import {
  breadcrumbListJsonLd,
  env,
  jsonLdGraph,
  webPageJsonLd,
} from "@propharmex/lib";

import { JsonLd } from "../../components/site/JsonLd";

const PAGE_PATH = "/accessibility";
const PAGE_TITLE = "Accessibility statement";
const PAGE_DESCRIPTION =
  "Propharmex's commitment to digital accessibility — WCAG 2.1 AA conformance posture, known limitations, and how to report a barrier.";

export const metadata: Metadata = {
  title: { absolute: `${PAGE_TITLE} · Propharmex` },
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_PATH },
  openGraph: {
    type: "website",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_PATH,
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
};

export default function AccessibilityPage() {
  const siteUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const pageJsonLd = jsonLdGraph([
    webPageJsonLd({
      siteUrl,
      path: PAGE_PATH,
      name: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
    }),
    breadcrumbListJsonLd({
      siteUrl,
      trail: [{ name: "Accessibility", path: PAGE_PATH }],
    }),
  ]);

  return (
    <>
      <JsonLd id="accessibility-jsonld" data={pageJsonLd} />

      <article className="mx-auto max-w-3xl px-4 pb-24 pt-16 sm:px-6 sm:pt-20 lg:px-8">
        <header className="mb-10">
          <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
            Commitment
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-5xl">
            Accessibility statement
          </h1>
          <p className="mt-4 text-base leading-relaxed text-[var(--color-slate-800)]">
            Propharmex is committed to making{" "}
            <Link
              href="/"
              className="text-[var(--color-primary-700)] underline underline-offset-2 hover:no-underline"
            >
              propharmex.com
            </Link>{" "}
            usable for everyone, including people who rely on assistive
            technology. This statement describes our current conformance
            posture, the limitations we know about, and how to report a
            barrier you encounter.
          </p>
        </header>

        <Section heading="Conformance status" id="conformance">
          <p>
            We target conformance with the{" "}
            <strong>
              Web Content Accessibility Guidelines (WCAG) 2.1, Level AA
            </strong>
            . Our most recent code-level audit was completed on{" "}
            <time dateTime="2026-04-29">29 April 2026</time>. All Sev 1
            and most Sev 2 findings from that audit have been remediated;
            see <a href="#known-limitations">Known limitations</a> for the
            current gaps.
          </p>
          <p>
            We use Lighthouse CI on every pull request to catch
            accessibility regressions automatically. The threshold is set
            to <em>warn</em> at 0.95 today and will be raised to{" "}
            <em>error</em> at 1.0 once the remaining audit follow-ups
            close.
          </p>
        </Section>

        <Section heading="Standards we follow" id="standards">
          <ul className="list-disc space-y-1 pl-6">
            <li>
              <strong>WCAG 2.1 AA</strong> — global baseline; every
              perceivable, operable, understandable, and robust criterion.
            </li>
            <li>
              <strong>Section 508</strong> (United States) and{" "}
              <strong>EN 301 549</strong> (European Union) — both reference
              WCAG 2.1 AA, so our conformance posture covers them.
            </li>
            <li>
              <strong>AODA</strong> (Ontario) and the{" "}
              <strong>Accessible Canada Act</strong> — applicable to our
              Canadian operations.
            </li>
          </ul>
          <p className="mt-3">
            The corresponding internal report is the Accessibility
            Conformance Report (VPAT 2.5 format), maintained by the
            engineering team and available on request.
          </p>
        </Section>

        <Section heading="What we tested" id="tested">
          <ul className="list-disc space-y-1 pl-6">
            <li>
              Keyboard navigation across every interactive element on the
              site, including the four AI tools (Concierge, Project
              Scoping Assistant, DEL Readiness, Dosage Form Matcher).
            </li>
            <li>
              Screen-reader semantics — landmarks, heading hierarchy,
              live regions, and form-label association.
            </li>
            <li>
              Color contrast for every text/background pairing that ships
              today; computed against WCAG AA&rsquo;s 4.5:1 (normal) and 3:1
              (large) thresholds.
            </li>
            <li>
              Reduced-motion support — every animated component honours{" "}
              <code className="rounded-[var(--radius-xs)] bg-[var(--color-slate-100)] px-1 py-0.5 text-xs">
                prefers-reduced-motion
              </code>
              .
            </li>
            <li>
              Touch-target sizing on primary interactive elements (44×44
              px minimum on calls-to-action).
            </li>
          </ul>
        </Section>

        <Section heading="Known limitations" id="known-limitations">
          <p>
            We are honest about the gaps that remain. None of these
            blocks the core tasks (reading content, filling out forms,
            booking a discovery call), but each is on our remediation
            backlog.
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>
              <strong>Manual assistive-technology pass</strong> — our
              code-level audit verifies semantics; a paired test run on
              VoiceOver (macOS Safari) and NVDA (Windows Firefox) is
              scheduled and will be reflected in the next revision of
              this statement.
            </li>
            <li>
              <strong>Touch targets under 44×44 px</strong> — three minor
              controls (the Concierge send button, the header
              region-switcher, and the small-size Button variant) measure
              36×36 px. They meet the WCAG 2.2 AA minimum (24×24 px) but
              not our internal AAA target.
            </li>
            <li>
              <strong>Forced-colors mode</strong> — Windows High Contrast
              Mode renders the site without our token-driven borders.
              Function works; aesthetic separation degrades. We will add
              targeted{" "}
              <code className="rounded-[var(--radius-xs)] bg-[var(--color-slate-100)] px-1 py-0.5 text-xs">
                forced-colors
              </code>{" "}
              media queries in an upcoming pass.
            </li>
          </ul>
        </Section>

        <Section heading="Report a barrier" id="report">
          <p>
            If something on this site does not work for you, please tell
            us. Email{" "}
            <a
              href="mailto:hello@propharmex.com?subject=Accessibility%20feedback"
              className="text-[var(--color-primary-700)] underline underline-offset-2 hover:no-underline"
            >
              hello@propharmex.com
            </a>{" "}
            with the URL, the assistive technology you were using, and a
            brief description of the issue. We aim to acknowledge
            accessibility reports within two business days and prioritise
            them ahead of feature work.
          </p>
        </Section>

        <Section heading="Last reviewed" id="reviewed">
          <p>
            <time dateTime="2026-04-29">29 April 2026</time>. We re-review
            this statement at least quarterly and after any material
            change to the site&rsquo;s interactive surfaces.
          </p>
        </Section>
      </article>
    </>
  );
}

function Section({
  heading,
  id,
  children,
}: {
  heading: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <section
      aria-labelledby={`${id}-heading`}
      className="mb-10 border-t border-[var(--color-border)] pt-8"
    >
      <h2
        id={`${id}-heading`}
        className="mb-4 font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-[var(--color-fg)]"
      >
        {heading}
      </h2>
      <div className="space-y-3 text-base leading-relaxed text-[var(--color-slate-800)]">
        {children}
      </div>
    </section>
  );
}

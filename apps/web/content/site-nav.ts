/**
 * Site navigation + footer copy dictionary.
 *
 * This file is the Prompt 3 placeholder for what will become a Sanity-backed
 * `siteSettings` + `navigation` document in Prompt 4. Every user-facing
 * string here has been drafted via design:ux-copy and gated by
 * brand-voice-guardian (see docs/brand-voice.md).
 *
 * When Prompt 4 lands, components import from `packages/lib/sanity/queries`
 * instead of this file; the shape below is the target schema.
 */

export type NavLink = {
  href: string;
  label: string;
  /** Short descriptor shown in the mega-menu under the label. */
  description?: string;
};

export type NavSection = {
  label: string;
  href?: string;
  /** When present, the top-level item opens a mega-menu instead of navigating. */
  columns?: { heading: string; links: NavLink[] }[];
  /** Single-column mobile fallback + flat crawlable list. */
  flatLinks?: NavLink[];
};

/* -------------------------------------------------------------------------- */
/*  Primary navigation                                                         */
/* -------------------------------------------------------------------------- */

export const PRIMARY_NAV: NavSection[] = [
  // Home is implicit — the logo links to /.
  {
    label: "Capabilities",
    href: "/services",
    columns: [
      {
        heading: "Pharmaceutical Development",
        links: [
          {
            href: "/services/pharmaceutical-development",
            label: "Overview",
            description: "Specialty CDMO for complex and niche products.",
          },
          {
            href: "/dosage-forms",
            label: "View dosage forms",
            description: "Seven dosage-form pathways.",
          },
          {
            href: "/services/pharmaceutical-development/solid-oral-dosage",
            label: "Solid oral dosage",
            description: "Tablets, capsules, granules.",
          },
        ],
      },
      {
        heading: "Analytical Services",
        links: [
          { href: "/services/analytical-services", label: "Overview" },
          {
            href: "/services/analytical-services/method-development",
            label: "Method development",
            description: "HPLC, LC-MS/MS, dissolution.",
          },
          {
            href: "/services/analytical-services/method-validation",
            label: "Method validation",
            description: "ICH Q2(R2) compliant.",
          },
          {
            href: "/services/analytical-services/stability-studies",
            label: "Stability studies",
            description: "ICH Q1A(R2) zones I–IVb.",
          },
          {
            href: "/services/analytical-services/impurity-profiling",
            label: "Impurity profiling",
          },
          {
            href: "/services/analytical-services/bioanalytical",
            label: "Bioanalytical",
          },
          {
            href: "/services/analytical-services/extractables-and-leachables",
            label: "Extractables & leachables",
          },
          {
            href: "/services/analytical-services/reference-standard-characterization",
            label: "Reference standards",
          },
        ],
      },
      {
        heading: "Regulatory Strategy",
        links: [
          { href: "/services/regulatory-services", label: "Overview" },
          {
            href: "/services/regulatory-services/us-fda-submissions",
            label: "USFDA submissions",
            description: "ANDA, 505(b)(2), DMF Type II.",
          },
          {
            href: "/services/regulatory-services/ctd-ectd-dossier-preparation",
            label: "CTD / eCTD dossier preparation",
            description: "ICH M4 Module 3 authoring.",
          },
          {
            href: "/services/regulatory-services/gmp-audit-preparation",
            label: "GMP audit preparation",
          },
          {
            href: "/services/regulatory-services/lifecycle-regulatory-management",
            label: "Lifecycle & post-approval",
          },
        ],
      },
    ],
  },
  {
    label: "Dosage Forms",
    href: "/dosage-forms",
    columns: [
      {
        heading: "Available now",
        links: [
          {
            href: "/services/pharmaceutical-development/solid-oral-dosage",
            label: "Solid oral dosage",
            description: "Tablets, capsules, granules.",
          },
        ],
      },
      {
        heading: "Explore",
        links: [
          {
            href: "/dosage-forms",
            label: "View all dosage forms",
            description: "Seven specialty pathways.",
          },
          {
            href: "/ai/dosage-matcher",
            label: "Dosage Form Matcher",
            description: "AI-assisted form selection.",
          },
        ],
      },
    ],
  },
  // Flat-link items: no `columns` → Header.tsx renders a plain anchor.
  { label: "About", href: "/about" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" },
];

/* -------------------------------------------------------------------------- */
/*  Footer structure                                                          */
/* -------------------------------------------------------------------------- */

export const FOOTER_COLUMNS: { heading: string; links: NavLink[] }[] = [
  {
    heading: "Capabilities",
    links: [
      {
        href: "/services/pharmaceutical-development",
        label: "Pharmaceutical development",
      },
      { href: "/services/analytical-services", label: "Analytical services" },
      { href: "/services/regulatory-services", label: "Regulatory strategy" },
    ],
  },
  {
    heading: "Dosage Forms",
    links: [
      { href: "/dosage-forms", label: "All dosage forms" },
      {
        href: "/services/pharmaceutical-development/solid-oral-dosage",
        label: "Solid oral",
      },
      {
        href: "/services/pharmaceutical-development/liquid-oral-dosage",
        label: "Liquid oral",
      },
      {
        href: "/services/pharmaceutical-development/topical-semisolid",
        label: "Topical & semisolid",
      },
      {
        href: "/services/pharmaceutical-development/sterile-injectables",
        label: "Sterile injectables",
      },
      {
        href: "/services/pharmaceutical-development/inhalation",
        label: "Inhalation",
      },
      {
        href: "/services/pharmaceutical-development/ophthalmic",
        label: "Ophthalmic",
      },
      {
        href: "/services/pharmaceutical-development/transdermal-modified-release",
        label: "Transdermal & modified release",
      },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/about", label: "About Propharmex" },
      { href: "/about/leadership", label: "Leadership" },
      { href: "/why-propharmex", label: "Why Propharmex" },
      { href: "/our-process", label: "Our process" },
      { href: "/facilities", label: "Facilities" },
      { href: "/quality-compliance", label: "Quality & Compliance" },
      { href: "/industries", label: "Industries served" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { href: "/insights", label: "Insights" },
      { href: "/case-studies", label: "Case studies" },
      {
        href: "/ai/project-scoping-assistant",
        label: "Project scoping assistant",
      },
      { href: "/ai/del-readiness", label: "Regulatory readiness tool" },
      { href: "/ai/dosage-matcher", label: "Dosage form matcher" },
    ],
  },
];

export const LEGAL_LINKS: NavLink[] = [
  { href: "/legal/privacy", label: "Privacy" },
  { href: "/legal/terms", label: "Terms" },
  { href: "/legal/cookie-policy", label: "Cookies" },
  { href: "/legal/ai-disclaimer", label: "AI disclaimer" },
  { href: "/accessibility", label: "Accessibility" },
];

/* -------------------------------------------------------------------------- */
/*  Contact / facility blocks                                                 */
/* -------------------------------------------------------------------------- */

export type FacilityAddress = {
  code: "MISSISSAUGA" | "HYDERABAD";
  name: string;
  role: string;
  streetLines: string[];
  city: string;
  region: string;
  postalCode: string;
  country: string;
  countryCode: "CA" | "IN";
  phone?: string;
  email?: string;
};

export const FACILITIES: FacilityAddress[] = [
  {
    code: "MISSISSAUGA",
    name: "Propharmex Canada",
    role: "Head office",
    streetLines: ["— address on file —"],
    city: "Mississauga",
    region: "ON",
    postalCode: "",
    country: "Canada",
    countryCode: "CA",
    email: "canada@propharmex.com",
  },
  {
    code: "HYDERABAD",
    name: "Propharmex India",
    role: "Development centre",
    streetLines: ["— address on file —"],
    city: "Hyderabad",
    region: "Telangana",
    postalCode: "",
    country: "India",
    countryCode: "IN",
    email: "india@propharmex.com",
  },
];

/* -------------------------------------------------------------------------- */
/*  Newsletter + CTAs                                                         */
/* -------------------------------------------------------------------------- */

export const NEWSLETTER = {
  heading: "Regulatory and development briefings",
  description:
    "Short technical notes on Health Canada, USFDA, and ICH topics as they land. About one email per month. No sales pitches.",
  emailLabel: "Work email",
  emailPlaceholder: "you@company.com",
  consentLabel:
    "I agree to receive Propharmex briefings. I can unsubscribe from any email.",
  submitLabel: "Subscribe",
  submittingLabel: "Subscribing…",
  successLabel:
    "Check your inbox — we've sent a confirmation link. Opt-in completes on click.",
  errorGeneric:
    "We couldn't process that subscription. Please try again or email hello@propharmex.com.",
};

export const CTAS = {
  quote: "Request a quote",
  book: "Book a 30-minute call",
  contact: "Contact us",
};

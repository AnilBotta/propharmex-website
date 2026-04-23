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

export type Region = "CA" | "IN" | "GLOBAL";

export const REGIONS: {
  code: Region;
  label: string;
  shortLabel: string;
  description: string;
}[] = [
  {
    code: "CA",
    label: "Canada",
    shortLabel: "CA",
    description: "Health Canada DEL, ANDS, and Canadian market focus.",
  },
  {
    code: "IN",
    label: "India",
    shortLabel: "IN",
    description: "CDSCO, Hyderabad analytical and development operations.",
  },
  {
    code: "GLOBAL",
    label: "Global",
    shortLabel: "GL",
    description: "USFDA, EMA, WHO-GMP, TGA, PMDA submissions.",
  },
];

/* -------------------------------------------------------------------------- */
/*  Primary navigation                                                         */
/* -------------------------------------------------------------------------- */

export const PRIMARY_NAV: NavSection[] = [
  {
    label: "Services",
    href: "/services",
    columns: [
      {
        heading: "Pharmaceutical development",
        links: [
          { href: "/services/pharma-development", label: "Overview" },
          {
            href: "/services/pharma-development/formulation-development",
            label: "Formulation development",
            description: "Oral, topical, sterile injectable.",
          },
          {
            href: "/services/pharma-development/analytical-method-development",
            label: "Analytical method development",
            description: "HPLC, LC-MS/MS, dissolution.",
          },
          {
            href: "/services/pharma-development/stability-studies",
            label: "Stability studies",
            description: "ICH Q1A(R2) zones I–IVb.",
          },
          {
            href: "/services/pharma-development/process-development",
            label: "Process development",
          },
          {
            href: "/services/pharma-development/tech-transfer",
            label: "Tech transfer",
          },
          {
            href: "/services/pharma-development/clinical-trial-supplies",
            label: "Clinical trial supplies",
          },
          {
            href: "/services/pharma-development/dosage-form-development",
            label: "Dosage form development",
            description: "With the Dosage Form Matcher.",
          },
        ],
      },
      {
        heading: "Analytical services",
        links: [
          { href: "/services/analytical-services", label: "Overview" },
          {
            href: "/services/analytical-services/method-development-validation",
            label: "Method development & validation",
            description: "ICH Q2(R2) compliant.",
          },
          {
            href: "/services/analytical-services/release-stability-testing",
            label: "Release & stability testing",
          },
          {
            href: "/services/analytical-services/impurities-extractables-leachables",
            label: "Impurities, E&L",
          },
          {
            href: "/services/analytical-services/dissolution-bioequivalence",
            label: "Dissolution & bioequivalence",
          },
          {
            href: "/services/analytical-services/microbiological-testing",
            label: "Microbiological testing",
          },
          {
            href: "/services/analytical-services/elemental-nitrosamine-testing",
            label: "Elemental & nitrosamine testing",
            description: "ICH Q3D + EMA/FDA nitrosamine guidance.",
          },
          {
            href: "/services/analytical-services/regulatory-cmc-support",
            label: "Regulatory CMC support",
          },
        ],
      },
      {
        heading: "Regulatory services",
        links: [
          { href: "/services/regulatory-services", label: "Overview" },
          {
            href: "/services/regulatory-services/health-canada-del",
            label: "Health Canada DEL",
            description: "Drug Establishment Licence — our flagship.",
          },
          {
            href: "/services/regulatory-services/us-fda-submissions",
            label: "USFDA submissions",
            description: "ANDA, NDA, DMF Type II.",
          },
          {
            href: "/services/regulatory-services/who-gmp-eu-tga",
            label: "WHO-GMP, EMA, TGA",
          },
          {
            href: "/services/regulatory-services/cmc-dossier-preparation",
            label: "CMC dossier preparation",
            description: "eCTD Module 3.",
          },
          {
            href: "/services/regulatory-services/regulatory-strategy-consulting",
            label: "Regulatory strategy consulting",
          },
        ],
      },
    ],
  },
  {
    label: "Industries",
    href: "/industries",
    columns: [
      {
        heading: "Sectors served",
        links: [
          { href: "/industries/innovators", label: "Innovators" },
          { href: "/industries/generics", label: "Generics" },
          { href: "/industries/biotech", label: "Biotech" },
          {
            href: "/industries/government-ngo",
            label: "Government & NGO",
          },
          { href: "/industries/veterinary", label: "Veterinary" },
        ],
      },
    ],
  },
  {
    label: "Resources",
    columns: [
      {
        heading: "Evidence",
        links: [
          {
            href: "/case-studies",
            label: "Case studies",
            description: "Problem, approach, solution, result.",
          },
          { href: "/insights", label: "Insights" },
          {
            href: "/whitepapers",
            label: "Whitepapers",
            description: "Gated long-form downloads.",
          },
        ],
      },
      {
        heading: "AI tools",
        links: [
          {
            href: "/ai-tools/cdmo-concierge",
            label: "CDMO Concierge",
            description: "Answers grounded in our documentation.",
          },
          {
            href: "/ai-tools/scoping-assistant",
            label: "Project Scoping Assistant",
          },
          {
            href: "/ai-tools/del-readiness",
            label: "DEL Readiness Assessment",
          },
          {
            href: "/ai-tools/dosage-form-matcher",
            label: "Dosage Form Matcher",
          },
        ],
      },
      {
        heading: "Quality posture",
        links: [
          { href: "/quality-compliance", label: "Quality & Compliance" },
          { href: "/facilities", label: "Facilities" },
          { href: "/our-process", label: "Our process" },
        ],
      },
    ],
  },
  {
    label: "Company",
    columns: [
      {
        heading: "About",
        links: [
          { href: "/why-propharmex", label: "Why Propharmex" },
          { href: "/about", label: "About" },
          { href: "/about/leadership", label: "Leadership" },
          { href: "/contact", label: "Contact" },
        ],
      },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*  Footer structure                                                          */
/* -------------------------------------------------------------------------- */

export const FOOTER_COLUMNS: { heading: string; links: NavLink[] }[] = [
  {
    heading: "Services",
    links: [
      { href: "/services/pharma-development", label: "Pharmaceutical development" },
      { href: "/services/analytical-services", label: "Analytical services" },
      { href: "/services/regulatory-services", label: "Regulatory services" },
      {
        href: "/services/regulatory-services/health-canada-del",
        label: "Health Canada DEL",
      },
    ],
  },
  {
    heading: "Industries",
    links: [
      { href: "/industries/innovators", label: "Innovators" },
      { href: "/industries/generics", label: "Generics" },
      { href: "/industries/biotech", label: "Biotech" },
      { href: "/industries/government-ngo", label: "Government & NGO" },
      { href: "/industries/veterinary", label: "Veterinary" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/why-propharmex", label: "Why Propharmex" },
      { href: "/about", label: "About" },
      { href: "/about/leadership", label: "Leadership" },
      { href: "/quality-compliance", label: "Quality & Compliance" },
      { href: "/facilities", label: "Facilities" },
      { href: "/our-process", label: "Our process" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { href: "/case-studies", label: "Case studies" },
      { href: "/insights", label: "Insights" },
      { href: "/whitepapers", label: "Whitepapers" },
      { href: "/ai-tools/cdmo-concierge", label: "AI tools" },
    ],
  },
];

export const LEGAL_LINKS: NavLink[] = [
  { href: "/legal/privacy", label: "Privacy" },
  { href: "/legal/terms", label: "Terms" },
  { href: "/legal/cookie-policy", label: "Cookies" },
  { href: "/legal/ai-disclaimer", label: "AI disclaimer" },
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
    role: "Head office — Health Canada DEL, 3PL distribution",
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
    role: "Analytical services and development operations",
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

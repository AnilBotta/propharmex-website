/**
 * Content dictionary for /contact (Prompt 17).
 *
 * Voice: anti-hype, expert, humble — see docs/brand-voice.md and the
 * existing /insights and /our-process content files for tone reference.
 *
 * Source-of-truth boundaries (deliberate):
 *  - Hub addresses live in apps/web/content/site-nav.ts (FACILITIES).
 *    This file does not re-encode them — ContactAddressCards reads
 *    FACILITIES directly so there is one place to update when client
 *    confirms street addresses and phone numbers.
 *  - The eight inquiry-form fields are owned here. The matching server
 *    Zod schema lives in apps/web/app/api/contact/route.ts and the
 *    enum tuples below are the canonical list both ends share.
 *  - Cal.com booking copy is owned here; the actual CAL_LINK env var
 *    decides whether the embed renders or the fallback CTA shows.
 *
 * Deferred (named): AI classifier (Prompt 18+), Turnstile widget on
 * the form (Prompt 25), Supabase lead record (Prompt 22), PostHog +
 * Plausible custom events (Prompt 24).
 */

/* -------------------------------------------------------------------------- */
/*  Form field tuples — shared with the server route's Zod schema             */
/* -------------------------------------------------------------------------- */

/**
 * Region of the inquiring drug developer's primary regulatory programme.
 * Used as a routing hint today (in the email body) and by the deferred
 * AI classifier later. Not a market segmentation — just where the work
 * is being filed.
 */
export const REGIONS = [
  { id: "canada", label: "Canada (Health Canada)" },
  { id: "united-states", label: "United States (USFDA)" },
  { id: "european-union", label: "European Union (EMA)" },
  { id: "united-kingdom", label: "United Kingdom (MHRA)" },
  { id: "australia", label: "Australia (TGA)" },
  { id: "japan", label: "Japan (PMDA)" },
  { id: "india", label: "India (CDSCO)" },
  { id: "multilateral", label: "WHO / multilateral procurement" },
  { id: "other", label: "Other / multi-region" },
] as const;
export type RegionId = (typeof REGIONS)[number]["id"];

export const SERVICES = [
  { id: "pharmaceutical-development", label: "Pharmaceutical development" },
  { id: "analytical-services", label: "Analytical services" },
  { id: "regulatory-services", label: "Regulatory affairs" },
  { id: "3pl-distribution", label: "3PL distribution (Canada)" },
  { id: "general", label: "Not sure yet — general inquiry" },
] as const;
export type ServiceId = (typeof SERVICES)[number]["id"];

/**
 * Dosage forms — only meaningful when service is "pharmaceutical-development".
 * UI shows this select conditionally; the server schema marks it optional.
 */
export const DOSAGE_FORMS = [
  { id: "solid-oral", label: "Solid oral (tablets, capsules)" },
  { id: "liquid-oral", label: "Liquid oral (solutions, suspensions)" },
  { id: "topical", label: "Topical (creams, ointments, gels)" },
  { id: "sterile-injectable", label: "Sterile injectable" },
  { id: "ophthalmic", label: "Ophthalmic" },
  { id: "inhalation", label: "Inhalation" },
  { id: "controlled-release", label: "Controlled / modified release" },
  { id: "other", label: "Other / multiple" },
] as const;
export type DosageFormId = (typeof DOSAGE_FORMS)[number]["id"];

export const STAGES = [
  { id: "discovery", label: "Discovery / pre-formulation" },
  { id: "formulation-development", label: "Formulation development" },
  { id: "method-development", label: "Method development & validation" },
  { id: "stability", label: "Stability studies in progress" },
  { id: "scale-up", label: "Scale-up / tech transfer" },
  { id: "regulatory-submission", label: "Preparing a regulatory submission" },
  { id: "post-approval", label: "Post-approval / lifecycle" },
  { id: "evaluating", label: "Still evaluating CDMO partners" },
] as const;
export type StageId = (typeof STAGES)[number]["id"];

export const ROLES = [
  "Regulatory affairs",
  "CMC / quality",
  "Manufacturing",
  "Procurement",
  "Business development",
  "Executive / founder",
  "Other",
] as const;

/* -------------------------------------------------------------------------- */
/*  Top-level types                                                           */
/* -------------------------------------------------------------------------- */

export type ContactHero = {
  eyebrow: string;
  headline: string;
  lede: string;
};

export type ContactAddressesSection = {
  eyebrow: string;
  heading: string;
  lede: string;
  /** Copy shown when a hub has no street address on file yet. */
  addressOnFileNote: string;
  /** Copy shown when a hub has no phone on file yet. */
  phoneOnFileNote: string;
  /** Aria label prefix for the "Open in Google Maps" link. */
  mapsLinkLabel: string;
};

export type ContactFormFieldCopy = {
  label: string;
  helper?: string;
  placeholder?: string;
};

export type ContactFormSection = {
  eyebrow: string;
  heading: string;
  lede: string;
  fields: {
    name: ContactFormFieldCopy;
    company: ContactFormFieldCopy;
    role: ContactFormFieldCopy & { selectPlaceholder: string };
    email: ContactFormFieldCopy;
    region: ContactFormFieldCopy & { selectPlaceholder: string };
    service: ContactFormFieldCopy & { selectPlaceholder: string };
    dosageForm: ContactFormFieldCopy & { selectPlaceholder: string };
    stage: ContactFormFieldCopy & { selectPlaceholder: string };
    message: ContactFormFieldCopy;
  };
  submitLabel: string;
  submittingLabel: string;
  successHeading: string;
  successBody: string;
  successCtaLabel: string;
  errorFallback: string;
  disclaimer: string;
};

export type ContactCalSection = {
  eyebrow: string;
  heading: string;
  lede: string;
  iframeTitle: string;
  fallbackHeading: string;
  fallbackBody: string;
  fallbackCtaLabel: string;
};

export type ContactBreadcrumb = {
  label: string;
  href: string;
}[];

export type ContactContent = {
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  breadcrumb: ContactBreadcrumb;
  hero: ContactHero;
  addresses: ContactAddressesSection;
  form: ContactFormSection;
  cal: ContactCalSection;
};

/* -------------------------------------------------------------------------- */
/*  Content payload                                                           */
/* -------------------------------------------------------------------------- */

export const CONTACT: ContactContent = {
  metaTitle: "Contact Propharmex",
  metaDescription:
    "Reach the Propharmex team for pharmaceutical development, analytical services, regulatory affairs, or 3PL distribution. A Canadian pharmaceutical services company anchored at our Mississauga DEL site, with an Indian development centre in Hyderabad.",
  ogTitle: "Contact Propharmex",
  ogDescription:
    "Send a programme brief and we'll route it to the right desk. Most replies within one Canadian business day.",
  breadcrumb: [
    { label: "Home", href: "/" },
    { label: "Contact", href: "/contact" },
  ],
  hero: {
    eyebrow: "Contact",
    headline: "Send a programme brief. We'll route it to the right desk.",
    lede: "Most inquiries are answered within one Canadian business day. Tell us where the work is being filed, what stage you're at, and what would make a good first conversation. The fields below shape the agenda — they're not a gate.",
  },
  addresses: {
    eyebrow: "Where we work",
    heading: "Anchored in Mississauga, supported by our development bench",
    lede: "Our Mississauga site holds the Health Canada Drug Establishment Licence and runs Canadian 3PL distribution. Our Indian development centre in Hyderabad runs pharmaceutical development and analytical services under the same quality system.",
    addressOnFileNote:
      "Exact site address shared during pre-visit briefing, under NDA.",
    phoneOnFileNote: "Phone number shared after first email exchange.",
    mapsLinkLabel: "Open location in Google Maps",
  },
  form: {
    eyebrow: "Inquiry",
    heading: "What are you working on?",
    lede: "All fields except the message are required. We never share contact details outside Propharmex, and we don't run nurture sequences against this form.",
    fields: {
      name: {
        label: "Full name",
        placeholder: "Jane Doe",
      },
      company: {
        label: "Company",
        placeholder: "Sponsor, manufacturer, or procurement agency",
      },
      role: {
        label: "Your role",
        selectPlaceholder: "Select a role",
      },
      email: {
        label: "Work email",
        placeholder: "you@company.com",
        helper: "Use a domain we can verify — generic webmail slows triage.",
      },
      region: {
        label: "Primary regulatory region",
        selectPlaceholder: "Select a region",
        helper: "Where the programme is being filed, not where you're based.",
      },
      service: {
        label: "Service of interest",
        selectPlaceholder: "Select a service",
      },
      dosageForm: {
        label: "Dosage form",
        selectPlaceholder: "Select a dosage form",
        helper: "Helps the development team prepare the right reference materials.",
      },
      stage: {
        label: "Stage of the programme",
        selectPlaceholder: "Select a stage",
      },
      message: {
        label: "Anything else we should know",
        placeholder:
          "e.g. We're filing an ANDA in Q3 on a controlled-release tablet and need a method-validation partner.",
        helper: "Optional. Two or three sentences is plenty for a first reply.",
      },
    },
    submitLabel: "Send the brief",
    submittingLabel: "Sending…",
    successHeading: "Brief received",
    successBody:
      "We've routed your note to the right desk. Expect a reply within one Canadian business day. If you'd rather schedule a 15-minute discovery call, jump to the booking panel below.",
    successCtaLabel: "Schedule a discovery call",
    errorFallback:
      "We couldn't send that right now. Please retry, or email hello@propharmex.com directly.",
    disclaimer:
      "Submitting this form sends your details to Propharmex by email only. We do not store inquiries in a CRM at this stage of the build.",
  },
  cal: {
    eyebrow: "Prefer to talk first",
    heading: "Book a 15-minute discovery call",
    lede: "A short call to scope: where you're filing, where we'd add value, and what a useful next step looks like. No prep needed.",
    iframeTitle: "Propharmex discovery call booking",
    fallbackHeading: "Booking link coming soon",
    fallbackBody:
      "Our scheduling link is being finalised. In the meantime, send the form above or email us — we'll arrange a time directly.",
    fallbackCtaLabel: "Email Propharmex",
  },
};

/**
 * Content dictionary for /case-studies (hub) and the three seed detail
 * pages at /case-studies/[slug] — Prompt 14.
 *
 * Positioning (CLAUDE.md §1): case studies are the evidence layer for the
 * Canadian-anchored operating model — Health Canada DEL site with offshore
 * analytical and development depth, serving global sponsors. Three
 * seed studies anchor the three archetypes the rest of the site talks about:
 *
 *  - modified-release-requalification — a Top-5 US generic manufacturer whose
 *    first ANDA filing came back with a dissolution deficiency letter. We
 *    rebuilt the method under ICH Q2(R2) and requalified three
 *    bioequivalence cohorts.
 *  - sterile-injectable-second-sourcing — a mid-size innovator sponsor with
 *    a commercial-stage sterile injectable running over target COGS. We
 *    tech-transferred analytical + process to a second supplier, qualified
 *    that supplier, maintained US release cadence.
 *  - ngo-oral-solid-stability-rebuild — a global NGO procurement agency with
 *    recurring out-of-spec events at release on an oral-solid portfolio. We
 *    restructured release testing under ICH Q10, moved stability to Zone IVb,
 *    rebuilt supplier qualification.
 *
 * Anonymization (docs/content-style-guide.md §Anonymization rules): no client
 * is named. The pattern "[Tier] [Geography] [Category]" is used throughout
 * ("Top-5 US generic manufacturer", "Mid-size innovator sponsor", "Global NGO
 * procurement agency"). No molecules are named. Metrics are framed as ranges
 * or approximations rather than precise point figures. No pre-approval
 * timelines are stated that could be interpreted as regulatory commitments.
 *
 * Claim-status convention (docs/regulatory-lexicon.md §26–39): case studies
 * are descriptive, not certification claims. The regulatory-outcome blocks
 * state filings and service-standard context using `alignment` framing —
 * "consistent with", "authored against", "reviewed under the X service
 * standard" — never "approved by". The only `confirmed` anchor on this page
 * set is the Health Canada DEL reference on the detail-page closing block,
 * matching the pattern used across /industries and /services/regulatory-services.
 *
 * All primary-source URLs stamped with "as of 2026-04-23" mirror the
 * canonical URLs used in regulatory-services.ts / analytical-services.ts /
 * industries.ts to keep the outbound-link surface consistent.
 *
 * Migration path: this shape mirrors the Sanity `caseStudy` document that
 * lands with the CMS migration. The `slug`, taxonomy tuples, PASR blocks,
 * and `clientAnonymized.logoPermitted` flag are the fields the editor UI
 * will expose.
 */

import type { FacilityCta, FacilitySource } from "./facilities";

/* -------------------------------------------------------------------------- */
/*  Shared primitives                                                         */
/* -------------------------------------------------------------------------- */

export type CaseStudyCta = FacilityCta;
export type CaseStudySource = FacilitySource;

/* -------------------------------------------------------------------------- */
/*  Filter taxonomy                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Industry filter tuples mirror the IndustrySlug union in industries.ts so
 * that a case study and an industry page talk about the same archetypes.
 * The human-readable labels are short — "Generics" rather than "Generic
 * manufacturers" — because they render as filter pills.
 */
export const CASE_INDUSTRY_FILTERS = [
  { id: "innovators", label: "Innovators" },
  { id: "generics", label: "Generics" },
  { id: "cdmo-partners", label: "CDMO partners" },
  { id: "ngos", label: "NGOs and governments" },
  { id: "clinical-trial-sponsors", label: "Clinical trial sponsors" },
] as const;
export type CaseIndustry = (typeof CASE_INDUSTRY_FILTERS)[number]["id"];

/**
 * Service filter tuples describe the Propharmex work stream the study is
 * primarily about. Cross-cutting studies can list two services; the filter
 * matches if either is present.
 */
export const CASE_SERVICE_FILTERS = [
  { id: "formulation-development", label: "Formulation development" },
  { id: "analytical-services", label: "Analytical services" },
  { id: "regulatory-affairs", label: "Regulatory affairs" },
  { id: "quality-compliance", label: "Quality and compliance" },
  { id: "tech-transfer", label: "Tech transfer" },
] as const;
export type CaseService = (typeof CASE_SERVICE_FILTERS)[number]["id"];

/**
 * Dosage-form tuples — deliberately broad. The detail body can be more
 * specific ("modified-release oral solid") while the pill stays coarse.
 */
export const CASE_DOSAGE_FORM_FILTERS = [
  { id: "oral-solid", label: "Oral solid" },
  { id: "sterile-injectable", label: "Sterile injectable" },
  { id: "oral-liquid", label: "Oral liquid" },
  { id: "topical", label: "Topical" },
  { id: "other", label: "Other" },
] as const;
export type CaseDosageForm = (typeof CASE_DOSAGE_FORM_FILTERS)[number]["id"];

/**
 * Region filter describes the regulatory geography the filing was authored
 * against, not the client's headquarters.
 */
export const CASE_REGION_FILTERS = [
  { id: "canada", label: "Canada" },
  { id: "us", label: "United States" },
  { id: "eu", label: "Europe" },
  { id: "who-roster", label: "WHO-roster markets" },
  { id: "global", label: "Global" },
] as const;
export type CaseRegion = (typeof CASE_REGION_FILTERS)[number]["id"];

/* -------------------------------------------------------------------------- */
/*  Slug union                                                                */
/* -------------------------------------------------------------------------- */

export const CASE_STUDY_SLUGS = [
  "modified-release-requalification",
  "sterile-injectable-second-sourcing",
  "ngo-oral-solid-stability-rebuild",
] as const;
export type CaseStudySlug = (typeof CASE_STUDY_SLUGS)[number];

/* -------------------------------------------------------------------------- */
/*  Hub card (shared between hub grid, related rail, etc.)                    */
/* -------------------------------------------------------------------------- */

export type CaseStudyCardSummary = {
  slug: CaseStudySlug;
  /** Card headline — no client name, patterned per anonymization rules. */
  title: string;
  /** One-sentence teaser shown under the headline. */
  teaser: string;
  /** Short anonymized client descriptor. */
  client: string;
  /** The metric hero values surfaced on the card. */
  metricValue: string;
  metricLabel: string;
  /** Filter tuples — one industry, one or two services, one dosage form, one region. */
  industry: CaseIndustry;
  services: CaseService[];
  dosageForm: CaseDosageForm;
  region: CaseRegion;
};

/* -------------------------------------------------------------------------- */
/*  Hub page                                                                  */
/* -------------------------------------------------------------------------- */

export type CaseStudyHubHero = {
  eyebrow: string;
  headline: string;
  lede: string;
  stats: { label: string; value: string }[];
  primaryCta: CaseStudyCta;
  secondaryCta: CaseStudyCta;
};

export type CaseStudyHubFilterCopy = {
  eyebrow: string;
  heading: string;
  lede: string;
  /** User-visible label for the industry filter group. */
  industryLabel: string;
  serviceLabel: string;
  dosageFormLabel: string;
  regionLabel: string;
  allOptionLabel: string;
  clearFiltersLabel: string;
  emptyStateTitle: string;
  emptyStateBody: string;
  /** Result count suffix — "1 case study" vs. "2 case studies". */
  resultCountSingular: string;
  resultCountPlural: string;
  documentationNote: string;
};

export type CaseStudyHubClosing = {
  eyebrow: string;
  heading: string;
  body: string;
  primaryCta: CaseStudyCta;
  secondaryCta: CaseStudyCta;
};

export type CaseStudyHubContent = {
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  hero: CaseStudyHubHero;
  filterCopy: CaseStudyHubFilterCopy;
  closing: CaseStudyHubClosing;
};

/* -------------------------------------------------------------------------- */
/*  Detail page                                                               */
/* -------------------------------------------------------------------------- */

export type CaseStudyClient = {
  /** Anonymized descriptor: "Top-5 US generic manufacturer". */
  descriptor: string;
  /**
   * If true, the real client name may be shown on the card. All three seed
   * studies ship with this flag off — documentation on request.
   */
  logoPermitted: boolean;
  /**
   * Short phrase shown beside the descriptor explaining what we can share:
   * "Named reference available under NDA" or similar.
   */
  availabilityNote: string;
};

export type CaseStudyMetric = {
  /** The big headline number / phrase. */
  value: string;
  /** One-sentence label under the number. */
  label: string;
};

export type CaseStudySnapshotRow = {
  id: string;
  label: string;
  value: string;
};

export type CaseStudyPasrBlock = {
  eyebrow: string;
  heading: string;
  lede: string;
  /** Ordered bullet list — typically 3–5 points per block. */
  bullets: string[];
  /**
   * Optional inline callout — a single bold statement with an optional
   * source reference. Used for the Result block's headline metric or the
   * Approach block's key design decision.
   */
  callout?: {
    value: string;
    label: string;
    source?: CaseStudySource;
  };
};

export type CaseStudyTimelinePhase = {
  id: string;
  /** Human phase label: "Month 0–2: Method gap analysis". */
  period: string;
  title: string;
  body: string;
};

export type CaseStudyTimeline = {
  eyebrow: string;
  heading: string;
  lede: string;
  phases: CaseStudyTimelinePhase[];
  /** Closing note, e.g. "End-to-end elapsed: ~11 months". */
  closingNote: string;
};

export type CaseStudyRegulatoryOutcome = {
  eyebrow: string;
  heading: string;
  lede: string;
  filings: {
    id: string;
    label: string;
    detail: string;
    source?: CaseStudySource;
  }[];
  /** Short closing paragraph framing the outcome in alignment-not-guarantee terms. */
  closingNote: string;
};

export type CaseStudyRelatedServiceLink = {
  id: string;
  label: string;
  description: string;
  href: string;
};

export type CaseStudyRelatedServices = {
  eyebrow: string;
  heading: string;
  lede: string;
  links: CaseStudyRelatedServiceLink[];
};

export type CaseStudyDetailClosing = {
  eyebrow: string;
  heading: string;
  body: string;
  primaryCta: CaseStudyCta;
  secondaryCta: CaseStudyCta;
  /** Closing source reference — always the Health Canada DEL. */
  regulatoryNote: CaseStudySource;
};

export type CaseStudyContent = {
  slug: CaseStudySlug;
  label: string;
  crumbLabel: string;
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  /** Card summary — copy shown in the hub grid and related-cases rail. */
  summary: CaseStudyCardSummary;
  client: CaseStudyClient;
  /** Hero metric block — "Filed in 11 months" + supporting label. */
  metric: CaseStudyMetric;
  /** Short supporting paragraph shown under the metric in the hero. */
  heroLede: string;
  /** Snapshot bar — 4–5 rows of high-signal context. */
  snapshot: CaseStudySnapshotRow[];
  problem: CaseStudyPasrBlock;
  approach: CaseStudyPasrBlock;
  solution: CaseStudyPasrBlock;
  result: CaseStudyPasrBlock;
  timeline: CaseStudyTimeline;
  regulatory: CaseStudyRegulatoryOutcome;
  related: CaseStudyRelatedServices;
  closing: CaseStudyDetailClosing;
};

/* -------------------------------------------------------------------------- */
/*  Shared primary-source constants                                           */
/*  Mirrored from industries.ts / regulatory-services.ts / analytical-services. */
/* -------------------------------------------------------------------------- */

const HEALTH_CANADA_DEL_REGISTER: CaseStudySource = {
  kind: "primary",
  label: "Health Canada — Drug and Health Product Register",
  href: "https://health-products.canada.ca/dpd-bdpp/",
};

const ICH_Q2_R2: CaseStudySource = {
  kind: "primary",
  label: "ICH Q2(R2) — Validation of analytical procedures",
  href: "https://www.ich.org/page/quality-guidelines",
};

const ICH_Q1A_R2: CaseStudySource = {
  kind: "primary",
  label: "ICH Q1A(R2) — Stability testing of new drug substances and products",
  href: "https://www.ich.org/page/quality-guidelines",
};

const ICH_Q10: CaseStudySource = {
  kind: "primary",
  label: "ICH Q10 — Pharmaceutical quality system",
  href: "https://www.ich.org/page/quality-guidelines",
};

const FDA_BE_GUIDANCE: CaseStudySource = {
  kind: "primary",
  label:
    "USFDA — Bioequivalence studies with pharmacokinetic endpoints for drugs submitted under an ANDA (guidance)",
  href: "https://www.fda.gov/regulatory-information/search-fda-guidance-documents/bioequivalence-studies-pharmacokinetic-endpoints-drugs-submitted-anda",
};

const CFR_PART_314: CaseStudySource = {
  kind: "primary",
  label:
    "21 CFR Part 314 — Applications for FDA approval to market a new drug",
  href: "https://www.ecfr.gov/current/title-21/chapter-I/subchapter-D/part-314",
};

const CFR_PART_211: CaseStudySource = {
  kind: "primary",
  label:
    "21 CFR Part 211 — Current Good Manufacturing Practice for Finished Pharmaceuticals",
  href: "https://www.ecfr.gov/current/title-21/chapter-I/subchapter-C/part-211",
};

const WHO_PREQUALIFICATION: CaseStudySource = {
  kind: "primary",
  label: "WHO Prequalification Programme — medicines stream",
  href: "https://extranet.who.int/prequal/",
};

/* -------------------------------------------------------------------------- */
/*  Hub content                                                               */
/* -------------------------------------------------------------------------- */

export const CASE_STUDIES_HUB: CaseStudyHubContent = {
  metaTitle: "Case studies — Propharmex",
  metaDescription:
    "Anonymized worked patterns across generics, innovators, and NGO supply programmes. Documentation on request under NDA.",
  ogTitle: "Case studies — Propharmex",
  ogDescription:
    "Three seed studies: modified-release requalification, sterile-injectable second-sourcing, and an NGO oral-solid stability rebuild.",
  hero: {
    eyebrow: "Evidence",
    headline: "Outcomes we can document.",
    lede: "A small, current set of anonymized case studies. Each one is the worked pattern behind a claim we make elsewhere on the site. Named references are available under NDA.",
    stats: [
      { label: "Seed studies shipped", value: "3" },
      { label: "Named references", value: "On request" },
      { label: "Updated", value: "2026-04" },
    ],
    primaryCta: {
      label: "Start a similar project",
      href: "/contact",
      variant: "primary",
    },
    secondaryCta: {
      label: "See related services",
      href: "/services",
      variant: "ghost",
    },
  },
  filterCopy: {
    eyebrow: "Filter",
    heading: "Browse by industry, service, dosage form, or region.",
    lede: "Filters stack — pick an industry and a service to narrow to the overlap. Clearing all filters returns the full list.",
    industryLabel: "Industry",
    serviceLabel: "Service",
    dosageFormLabel: "Dosage form",
    regionLabel: "Region",
    allOptionLabel: "All",
    clearFiltersLabel: "Clear filters",
    emptyStateTitle: "No case studies match that combination yet.",
    emptyStateBody:
      "Try widening one of the filters, or reach out — named references may exist under NDA that are not in the public set.",
    resultCountSingular: "case study",
    resultCountPlural: "case studies",
    documentationNote:
      "Each card says what we can share publicly. Fuller documentation — method reports, stability data, regulatory correspondence — is available under NDA.",
  },
  closing: {
    eyebrow: "Similar challenge?",
    heading: "Bring us the problem you have, not the one that fits our deck.",
    body: "If you do not see your situation in the public set, we very likely have a named reference for it under NDA. A 30-minute call is usually enough to tell you whether the pattern fits, and whether we are the right team for it.",
    primaryCta: {
      label: "Start a similar project",
      href: "/contact",
      variant: "primary",
    },
    secondaryCta: {
      label: "Book a 30-minute call",
      href: "/contact#schedule",
      variant: "ghost",
    },
  },
};

/* -------------------------------------------------------------------------- */
/*  Case study 1 — Modified-release requalification                           */
/* -------------------------------------------------------------------------- */

const MODIFIED_RELEASE_REQUALIFICATION: CaseStudyContent = {
  slug: "modified-release-requalification",
  label: "Modified-release requalification after a dissolution deficiency",
  crumbLabel: "Modified-release requalification",
  metaTitle:
    "Modified-release requalification after a dissolution deficiency — Propharmex case study",
  metaDescription:
    "Top-5 US generic manufacturer. ANDA returned with a dissolution deficiency letter. Method rebuilt under ICH Q2(R2), three bioequivalence cohorts requalified, resubmission filed roughly eleven months after engagement start.",
  ogTitle:
    "Modified-release requalification after a dissolution deficiency",
  ogDescription:
    "Anonymized worked pattern. ICH Q2(R2) dissolution method rebuild and BE cohort requalification for a Top-5 US generic manufacturer.",
  summary: {
    slug: "modified-release-requalification",
    title: "Modified-release requalification after a dissolution deficiency",
    teaser:
      "Dissolution deficiency on a first ANDA filing. Method rebuild under ICH Q2(R2), three BE cohorts requalified, resubmission filed roughly eleven months after engagement start.",
    client: "Top-5 US generic manufacturer",
    metricValue: "~11 months",
    metricLabel: "From deficiency letter to resubmission filing",
    industry: "generics",
    services: ["analytical-services", "regulatory-affairs"],
    dosageForm: "oral-solid",
    region: "us",
  },
  client: {
    descriptor: "Top-5 US generic manufacturer",
    logoPermitted: false,
    availabilityNote: "Named reference available under NDA.",
  },
  metric: {
    value: "~11 months",
    label: "From deficiency letter to resubmission filing",
  },
  heroLede:
    "First ANDA filing came back with a dissolution deficiency letter. The sponsor needed a rebuilt method, three requalified bioequivalence cohorts, and a credible resubmission package. We rebuilt the dissolution method, revalidated per ICH Q2(R2), and authored the amendment under our Health Canada Drug Establishment Licence.",
  snapshot: [
    {
      id: "client-pattern",
      label: "Client pattern",
      value: "Top-5 US generic manufacturer",
    },
    {
      id: "therapeutic",
      label: "Therapeutic area",
      value: "Chronic-use cardiovascular (modified-release oral solid)",
    },
    {
      id: "engagement",
      label: "Engagement",
      value: "Analytical method rebuild + ANDA amendment authoring",
    },
    {
      id: "pathway",
      label: "Regulatory pathway",
      value: "USFDA ANDA amendment under 21 CFR Part 314",
    },
    {
      id: "duration",
      label: "Duration",
      value: "~11 months end-to-end",
    },
  ],
  problem: {
    eyebrow: "Problem",
    heading: "The method was not discriminating, and the BE story did not land.",
    lede: "The original ANDA filing had been assembled in-house. The agency's deficiency letter flagged the dissolution method as insufficiently discriminating across the strengths, and asked for bioequivalence data that could be reconciled with the revised method. The sponsor was looking at a resubmission window measured in quarters.",
    bullets: [
      "Dissolution method lacked discrimination across the three strengths — the agency asked for a method that could detect formulation-level differences, not just pass/fail.",
      "Bioequivalence data had been generated against the original method; the PK endpoints no longer tied cleanly to what the agency was now asking for.",
      "Sponsor's internal analytical bench was fully loaded on other programmes; the deficiency response risked slipping by two full review cycles.",
      "Deficiency letter arrival had already triggered a commercial replanning exercise — every additional month compounded the opportunity cost.",
    ],
  },
  approach: {
    eyebrow: "Approach",
    heading: "Rebuild the method first. Requalify the BE cohorts against it. Then re-author the module.",
    lede: "We split the problem into an analytical rebuild and a regulatory-authoring workstream, running them in parallel with a weekly joint steering call. Both reported to a single programme manager on the sponsor's side, and both ran under one Propharmex quality system.",
    bullets: [
      "Method gap analysis against ICH Q2(R2) validation characteristics — specificity, linearity, accuracy, precision, range, robustness — with agency deficiency points mapped back to each characteristic.",
      "Two-tier dissolution with pH-shift step, designed to discriminate between the strengths under a physiologically plausible GI transit model.",
      "Requalification runs on three bioequivalence cohorts using retained samples; cross-comparison against the original method to quantify the discrimination delta.",
      "ANDA amendment authored against 21 CFR Part 314 and the USFDA bioequivalence-with-PK-endpoints guidance, with the revised method as the new analytical anchor.",
    ],
    callout: {
      value: "ICH Q2(R2)",
      label: "Validation characteristics anchor the rebuild",
      source: ICH_Q2_R2,
    },
  },
  solution: {
    eyebrow: "Solution",
    heading: "One method, three cohorts, one amendment — shipped as a single coherent package.",
    lede: "The rebuilt method went through full ICH Q2(R2) validation. Requalification runs on the retained BE samples closed in parallel. The amendment package was authored as a single coherent story — method rationale, validation evidence, BE reconciliation — rather than three separate responses stapled together.",
    bullets: [
      "Full ICH Q2(R2) validation package — specificity, linearity across 50–150% of target, accuracy within ±2%, intermediate precision with analyst-day-instrument variance, robustness across pH and column-lot variation.",
      "BE cohort requalification runs executed under the revised method; PK endpoints re-derived and cross-walked to the original data in a single reconciliation table.",
      "Module 2.7.1 (BE summary) and Module 3.2.P.5 (analytical procedures) rebuilt in parallel — the same narrative thread ran through both.",
      "Pre-submission QA review by the Propharmex team before the amendment went in.",
    ],
  },
  result: {
    eyebrow: "Result",
    heading: "Resubmission filed with a coherent method-BE narrative, roughly eleven months from engagement start.",
    lede: "The amendment went in inside the sponsor's target window. The revised method was the one used for the commercial release specification going forward.",
    bullets: [
      "Resubmission filed roughly eleven months after engagement start — within the sponsor's target window for the commercial-launch plan.",
      "The rebuilt dissolution method became the release specification for the product, replacing the original method across the three strengths.",
      "Retained-sample approach meant no new bioequivalence study was required — the cohort requalification was sufficient for the amendment.",
      "Sponsor's internal analytical bench stayed focused on its other programmes throughout.",
    ],
    callout: {
      value: "~11 months",
      label: "From deficiency letter to resubmission filing",
    },
  },
  timeline: {
    eyebrow: "Timeline",
    heading: "Eleven months, split across five phases.",
    lede: "Phase boundaries were written into the MSA with named deliverables and named owners on both sides. Nothing moved to the next phase without written sign-off.",
    phases: [
      {
        id: "ph-1",
        period: "Month 0–1",
        title: "Deficiency intake and gap analysis",
        body: "Full read of the agency letter, the original analytical package, and the BE module. Gap matrix against ICH Q2(R2) validation characteristics written and shared.",
      },
      {
        id: "ph-2",
        period: "Month 1–4",
        title: "Method rebuild and validation",
        body: "Two-tier dissolution designed, tested, and validated in the Propharmex analytical lab. All six ICH Q2(R2) characteristics closed with documented runs.",
      },
      {
        id: "ph-3",
        period: "Month 4–7",
        title: "BE cohort requalification",
        body: "Retained samples from the three bioequivalence cohorts re-analysed under the new method. PK endpoints re-derived; cross-walk to the original data documented.",
      },
      {
        id: "ph-4",
        period: "Month 7–10",
        title: "Amendment authoring and QA",
        body: "Module 2.7.1 and Module 3.2.P.5 rebuilt as a single coherent narrative. QA review closed before submission under the DEL.",
      },
      {
        id: "ph-5",
        period: "Month 10–11",
        title: "Submission and post-filing support",
        body: "Amendment filed; sponsor's regulatory team briefed on likely information-request topics. Standing 30-minute-per-week call held for the first two months post-filing.",
      },
    ],
    closingNote: "End-to-end elapsed: ~11 months from engagement start to filing.",
  },
  regulatory: {
    eyebrow: "Regulatory outcome",
    heading: "Filings authored against ANDA and bioequivalence-with-PK-endpoints pathways.",
    lede: "The amendment was authored against 21 CFR Part 314 and the USFDA bioequivalence-with-PK-endpoints guidance — as of 2026-04-23 the current anchors for an ANDA amendment of this type. We do not make approval-outcome claims; agency review timelines and outcomes are the agency's to state.",
    filings: [
      {
        id: "f-1",
        label: "ANDA amendment",
        detail:
          "Amendment authored against 21 CFR Part 314; Module 3.2.P.5 and Module 2.7.1 rebuilt around the revised dissolution method.",
        source: CFR_PART_314,
      },
      {
        id: "f-2",
        label: "Bioequivalence reconciliation",
        detail:
          "Cohort requalification authored against the USFDA bioequivalence-with-PK-endpoints guidance; retained-sample analysis supported the reconciliation without a new BE study.",
        source: FDA_BE_GUIDANCE,
      },
      {
        id: "f-3",
        label: "Analytical validation",
        detail:
          "Method validation package assembled against ICH Q2(R2) validation characteristics.",
        source: ICH_Q2_R2,
      },
    ],
    closingNote:
      "Approval outcomes are the agency's to state. This block describes the filings we authored and the service standards they were authored against.",
  },
  related: {
    eyebrow: "Services engaged",
    heading: "The work streams behind this case study.",
    lede: "Three Propharmex service leaves were active on this engagement.",
    links: [
      {
        id: "rel-1",
        label: "Method development and validation",
        description: "The ICH Q2(R2) method rebuild that anchored the amendment.",
        href: "/services/analytical-services/method-development-validation",
      },
      {
        id: "rel-2",
        label: "Dissolution and bioequivalence",
        description:
          "Two-tier dissolution design and BE cohort requalification work.",
        href: "/services/analytical-services/dissolution-bioequivalence",
      },
      {
        id: "rel-3",
        label: "USFDA submissions",
        description:
          "ANDA amendment authoring against 21 CFR Part 314 and bioequivalence guidance.",
        href: "/services/regulatory-services/us-fda-submissions",
      },
    ],
  },
  closing: {
    eyebrow: "Similar challenge?",
    heading: "Dissolution deficiency on your filing? This is the shape of our response.",
    body: "If you are looking at a deficiency letter that calls the analytical story into question, the pattern above is roughly what we propose: method gap analysis first, requalification second, amendment authoring third, all on a single weekly steering cadence.",
    primaryCta: {
      label: "Start a similar project",
      href: "/contact",
      variant: "primary",
    },
    secondaryCta: {
      label: "Request a method quote",
      href: "/contact",
      variant: "ghost",
    },
    regulatoryNote: HEALTH_CANADA_DEL_REGISTER,
  },
};

/* -------------------------------------------------------------------------- */
/*  Case study 2 — Sterile-injectable second-sourcing                         */
/* -------------------------------------------------------------------------- */

const STERILE_INJECTABLE_SECOND_SOURCING: CaseStudyContent = {
  slug: "sterile-injectable-second-sourcing",
  label: "Second-sourcing a sterile injectable without losing release cadence",
  crumbLabel: "Sterile-injectable second-sourcing",
  metaTitle:
    "Second-sourcing a sterile injectable without losing release cadence — Propharmex case study",
  metaDescription:
    "Mid-size innovator sponsor. Commercial-stage sterile injectable running over target COGS. Analytical + process tech-transferred to a qualified second supplier, US release cadence maintained.",
  ogTitle: "Second-sourcing a sterile injectable without losing release cadence",
  ogDescription:
    "Anonymized worked pattern. Tech transfer and second-supplier qualification for a commercial-stage sterile injectable.",
  summary: {
    slug: "sterile-injectable-second-sourcing",
    title: "Second-sourcing a sterile injectable without losing release cadence",
    teaser:
      "Commercial-stage sterile injectable running over target COGS. Analytical + process tech-transferred to a qualified second supplier, US release cadence maintained through the transition.",
    client: "Mid-size innovator sponsor",
    metricValue: "~18% COGS",
    metricLabel: "Reduction on a commercial sterile injectable",
    industry: "innovators",
    services: ["tech-transfer", "analytical-services"],
    dosageForm: "sterile-injectable",
    region: "us",
  },
  client: {
    descriptor: "Mid-size innovator sponsor (US-listed)",
    logoPermitted: false,
    availabilityNote: "Named reference available under NDA.",
  },
  metric: {
    value: "~18%",
    label: "COGS reduction on a commercial sterile injectable",
  },
  heroLede:
    "Commercial-stage sterile injectable running roughly 22% over target COGS. The sponsor wanted a qualified second source without interrupting US release cadence. We tech-transferred the analytical + process packages, ran the second-supplier qualification against the same release specification, and kept the incumbent on primary release through the transition.",
  snapshot: [
    {
      id: "client-pattern",
      label: "Client pattern",
      value: "Mid-size innovator sponsor (US-listed)",
    },
    {
      id: "therapeutic",
      label: "Therapeutic area",
      value: "Specialty sterile injectable, hospital channel",
    },
    {
      id: "engagement",
      label: "Engagement",
      value: "Analytical + process tech transfer; second-supplier qualification",
    },
    {
      id: "pathway",
      label: "Regulatory pathway",
      value: "Supplement-level change under 21 CFR Part 314",
    },
    {
      id: "duration",
      label: "Duration",
      value: "~14 months end-to-end",
    },
  ],
  problem: {
    eyebrow: "Problem",
    heading: "COGS pressure plus single-source fragility on a product in growth.",
    lede: "The product was three years into commercial launch and growing on-label. Margins were tight — roughly 22% above target — and the single manufacturing source had become the governance board's top supply-risk item. A prior second-sourcing attempt had stalled fourteen months in with a partial tech-transfer package and no qualified second supplier.",
    bullets: [
      "Commercial-stage sterile injectable in growth, with a single qualified source and a recently-flagged supply-risk concern at the governance level.",
      "COGS running roughly 22% above the margin target set at launch, driven by the single-source position and a long analytical turnaround.",
      "Prior second-sourcing attempt had produced a partial tech-transfer package but no qualified second supplier — the sponsor had re-set the programme and was looking for a partner that could finish it.",
      "US release cadence had to be maintained throughout the transition — no gap on the commercial distribution side.",
    ],
  },
  approach: {
    eyebrow: "Approach",
    heading: "Split the transfer into analytical-first and process-second. Qualify the second supplier against the same release spec the incumbent runs to.",
    lede: "Tech transfers fail when the analytical and the process workstreams collide on the same critical path. We ran them sequentially: the analytical package transferred first, validated end-to-end under ICH Q2(R2), and only then did the process transfer begin. The second supplier was qualified against the release specification the incumbent was already running to — the aim was interchangeability, not a redesign.",
    bullets: [
      "Analytical tech transfer into the Propharmex lab — full method-validation re-run under ICH Q2(R2), with side-by-side comparability against the incumbent's release data.",
      "Process tech transfer into the second-supplier site — equipment-train mapping, in-process control rationalisation, release-spec alignment.",
      "Comparability protocol authored against 21 CFR Part 211; bridging batches run at both sites against a shared acceptance criterion.",
      "Regulatory strategy: supplement-level change under 21 CFR Part 314, scoped to keep primary release with the incumbent until the second supplier closed qualification.",
    ],
    callout: {
      value: "21 CFR Part 211",
      label: "Comparability anchor across the qualified suppliers",
      source: CFR_PART_211,
    },
  },
  solution: {
    eyebrow: "Solution",
    heading: "Propharmex analytical bench running the data, Canadian QA authoring the comparability story.",
    lede: "Propharmex ran the full analytical re-validation and the side-by-side comparability study, then authored the supplement, including the comparability protocol and the post-approval commitment wording, under our Health Canada DEL. The incumbent supplier stayed on primary release throughout the qualification window.",
    bullets: [
      "Analytical re-validation under ICH Q2(R2) closed inside the Propharmex lab — specificity, linearity, accuracy, precision, range, robustness, all runs documented.",
      "Comparability protocol authored against 21 CFR Part 211 and run as paired release batches: three incumbent, three second-supplier, same release specification, same analytical method.",
      "Supplement-level change package authored against 21 CFR Part 314, including post-approval commitment language for ongoing periodic comparability.",
      "Release cadence maintained on the incumbent throughout the second-supplier qualification — no commercial supply gap.",
    ],
  },
  result: {
    eyebrow: "Result",
    heading: "Second supplier qualified, COGS reduced into the target band, release cadence uninterrupted.",
    lede: "The second supplier came online roughly fourteen months after engagement start. The sponsor's governance board closed the single-source supply-risk item the same quarter.",
    bullets: [
      "Second supplier qualified against the same release specification as the incumbent — interchangeable, not parallel.",
      "Steady-state COGS ran approximately 18% below the pre-engagement baseline once second-supplier volume ramped.",
      "US release cadence held throughout the transition — no commercial supply interruption.",
      "Supply-risk item closed at the governance board the same quarter the second supplier came online.",
    ],
    callout: {
      value: "~18%",
      label: "COGS reduction at steady state",
    },
  },
  timeline: {
    eyebrow: "Timeline",
    heading: "Fourteen months, split across four phases.",
    lede: "Analytical transfer completed before process transfer started — deliberate sequencing to keep the two off each other's critical path.",
    phases: [
      {
        id: "ph-1",
        period: "Month 0–2",
        title: "Intake and dual-site gap analysis",
        body: "Full read of the prior tech-transfer package, gap matrix against what closure actually required, and target-operating-model alignment across the qualified supplier chain.",
      },
      {
        id: "ph-2",
        period: "Month 2–6",
        title: "Analytical transfer and re-validation",
        body: "Method package moved into the Propharmex lab, re-validated end-to-end under ICH Q2(R2), with side-by-side comparability runs against incumbent-release data.",
      },
      {
        id: "ph-3",
        period: "Month 6–11",
        title: "Process transfer and comparability batches",
        body: "Equipment-train mapping at the second-supplier site, three paired comparability batches per site, single release specification throughout.",
      },
      {
        id: "ph-4",
        period: "Month 11–14",
        title: "Supplement authoring and second-supplier qualification",
        body: "Supplement-level change authored against 21 CFR Part 314, post-approval commitment wording agreed, second-supplier release qualification closed.",
      },
    ],
    closingNote: "End-to-end elapsed: ~14 months from engagement start to second-supplier qualification.",
  },
  regulatory: {
    eyebrow: "Regulatory outcome",
    heading: "Supplement-level change authored, comparability anchored on 21 CFR Part 211.",
    lede: "The supplement was authored against 21 CFR Part 314 — as of 2026-04-23 the current anchor for a manufacturing-site supplement of this type. Comparability was anchored on 21 CFR Part 211. We do not make approval-outcome claims; agency review timelines and outcomes are the agency's to state.",
    filings: [
      {
        id: "f-1",
        label: "Manufacturing supplement",
        detail:
          "Supplement-level change authored against 21 CFR Part 314; change scope kept narrow to a qualified second manufacturing source.",
        source: CFR_PART_314,
      },
      {
        id: "f-2",
        label: "Comparability protocol",
        detail:
          "Comparability protocol anchored on 21 CFR Part 211 cGMP expectations; paired release batches against a shared acceptance criterion.",
        source: CFR_PART_211,
      },
      {
        id: "f-3",
        label: "Analytical re-validation",
        detail:
          "Full re-validation of the release method at the Propharmex lab against ICH Q2(R2) validation characteristics.",
        source: ICH_Q2_R2,
      },
    ],
    closingNote:
      "This block describes the filings we authored and the service standards they were authored against. Release cadence and approval timing are the sponsor's and the agency's to state.",
  },
  related: {
    eyebrow: "Services engaged",
    heading: "The work streams behind this case study.",
    lede: "Three Propharmex service leaves were active on this engagement.",
    links: [
      {
        id: "rel-1",
        label: "Tech transfer",
        description:
          "Analytical-first, process-second sequencing across two manufacturing sites.",
        href: "/services/pharma-development/tech-transfer",
      },
      {
        id: "rel-2",
        label: "Method development and validation",
        description:
          "Release-method re-validation under ICH Q2(R2).",
        href: "/services/analytical-services/method-development-validation",
      },
      {
        id: "rel-3",
        label: "USFDA submissions",
        description:
          "Supplement-level change authoring against 21 CFR Part 314.",
        href: "/services/regulatory-services/us-fda-submissions",
      },
    ],
  },
  closing: {
    eyebrow: "Similar challenge?",
    heading: "Single-source on a commercial sterile injectable? Talk to us.",
    body: "The key design decision on this type of programme is sequencing — analytical-first, process-second — and scoping the supplement narrowly enough that the agency sees a single, contained change. We have done this pattern before and it is a familiar shape for us.",
    primaryCta: {
      label: "Start a similar project",
      href: "/contact",
      variant: "primary",
    },
    secondaryCta: {
      label: "Book a 30-minute call",
      href: "/contact#schedule",
      variant: "ghost",
    },
    regulatoryNote: HEALTH_CANADA_DEL_REGISTER,
  },
};

/* -------------------------------------------------------------------------- */
/*  Case study 3 — NGO oral-solid stability rebuild                           */
/* -------------------------------------------------------------------------- */

const NGO_ORAL_SOLID_STABILITY_REBUILD: CaseStudyContent = {
  slug: "ngo-oral-solid-stability-rebuild",
  label: "Rebuilding release testing on an NGO oral-solid portfolio",
  crumbLabel: "NGO oral-solid stability rebuild",
  metaTitle:
    "Rebuilding release testing on an NGO oral-solid portfolio — Propharmex case study",
  metaDescription:
    "Global NGO procurement agency with an oral-solid portfolio for a public-health programme. Recurring out-of-spec events at release. Release testing restructured under ICH Q10, stability moved to Zone IVb, supplier qualification rebuilt. Zero OOS events in the 24 months following.",
  ogTitle:
    "Rebuilding release testing on an NGO oral-solid portfolio",
  ogDescription:
    "Anonymized worked pattern. ICH Q10 release-testing rebuild, Zone IVb stability transition, and supplier-qualification rework for a global NGO procurement programme.",
  summary: {
    slug: "ngo-oral-solid-stability-rebuild",
    title: "Rebuilding release testing on an NGO oral-solid portfolio",
    teaser:
      "Recurring out-of-spec events at release on an oral-solid portfolio for a public-health programme. Release testing rebuilt under ICH Q10, stability moved to Zone IVb, supplier qualification reworked. Zero OOS events across the following 24 months.",
    client: "Global NGO procurement agency",
    metricValue: "Zero OOS",
    metricLabel: "Release events across 24 months",
    industry: "ngos",
    services: ["quality-compliance", "analytical-services"],
    dosageForm: "oral-solid",
    region: "who-roster",
  },
  client: {
    descriptor: "Global NGO procurement agency",
    logoPermitted: false,
    availabilityNote:
      "Named reference available under NDA. This engagement was aligned with WHO-roster expectations; Propharmex does not currently hold WHO Prequalification on a product.",
  },
  metric: {
    value: "Zero OOS",
    label: "Release events across the 24 months following rebuild",
  },
  heroLede:
    "Recurring out-of-spec (OOS) events at release on an oral-solid portfolio supplied into a public-health programme. The root cause was distributed across the release-testing workflow, the stability programme, and the supplier-qualification regime. We restructured all three over twelve months. Zero OOS events were recorded at release in the 24 months following.",
  snapshot: [
    {
      id: "client-pattern",
      label: "Client pattern",
      value: "Global NGO procurement agency",
    },
    {
      id: "therapeutic",
      label: "Therapeutic area",
      value: "Essential-medicines oral-solid portfolio (multi-SKU)",
    },
    {
      id: "engagement",
      label: "Engagement",
      value: "Release-testing rebuild + Zone IVb stability + supplier requalification",
    },
    {
      id: "pathway",
      label: "Regulatory pathway",
      value:
        "Capability alignment with WHO Prequalification expectations — no PQ claim",
    },
    {
      id: "duration",
      label: "Duration",
      value: "~12 months rebuild + 24-month monitoring window",
    },
  ],
  problem: {
    eyebrow: "Problem",
    heading: "OOS events clustered at release, and the root cause was not in one place.",
    lede: "The portfolio had been serving the public-health programme for several years. Release OOS events had been rising across the previous eighteen months — not all on the same SKU, not all from the same supplier, not all on the same assay. The procurement agency needed a structural answer, not an event-by-event investigation.",
    bullets: [
      "Recurring release OOS events clustered in the previous 18 months, distributed across multiple SKUs, multiple suppliers, and more than one release assay.",
      "Stability data for some SKUs had been generated against Zone II conditions; a proportion of distribution territory was Zone IVb, making the stability-package-to-real-world mismatch a live risk.",
      "Supplier-qualification records were inconsistent across the portfolio — some suppliers had been on-boarded before the current quality-system version was in place.",
      "Programme budget could not absorb a full audit-and-replace cycle; the fix had to happen inside the existing supplier relationships where feasible.",
    ],
  },
  approach: {
    eyebrow: "Approach",
    heading: "Treat the portfolio as a quality system, not a collection of SKUs.",
    lede: "The three visible symptoms — release OOS, stability-zone mismatch, supplier variance — were treatable as one quality-system problem. We worked the rebuild against ICH Q10 from the governance layer down, and only touched individual SKUs when the system-level work made that necessary.",
    bullets: [
      "Quality-system diagnostic under ICH Q10 — governance, operations, and PQS-element mapping across the full portfolio.",
      "Stability-programme redesign — move all Zone IVb-distributed SKUs onto Zone IVb long-term conditions, with a defined transition protocol for in-flight batches.",
      "Supplier re-qualification regime rebuilt against a single checklist aligned with WHO Prequalification expectations; suppliers already meeting it were grandfathered, others went through a time-boxed remediation plan.",
      "Release-testing workflow restructured — a tighter in-process control panel, clearer OOS-to-release decision tree, and a named second-review on every marginal pass result.",
    ],
    callout: {
      value: "ICH Q10",
      label: "The system-level anchor for the rebuild",
      source: ICH_Q10,
    },
  },
  solution: {
    eyebrow: "Solution",
    heading: "One PQS rebuild across three symptom areas, delivered in a single 12-month programme.",
    lede: "The rebuild ran as a single programme with three workstreams: quality system, stability, supplier qualification. Propharmex ran the stability-transition work and authored the PQS documentation and the supplier-qualification checklist under one quality system. Weekly steering with the NGO's procurement lead.",
    bullets: [
      "PQS documentation rewritten against ICH Q10 — governance, change control, CAPA, management review, continuous-improvement loop.",
      "Stability transition: Zone IVb long-term conditions stood up in the Propharmex lab, in-flight batches bridged via a defined protocol, release-shelf-life determinations re-run against the new data.",
      "Supplier-qualification checklist aligned with WHO Prequalification expectations (as of 2026-04-23), with a time-boxed remediation plan for suppliers not meeting the checklist on first assessment.",
      "Release-testing workflow: tighter in-process control panel, named second-review on marginal pass results, decision-tree walk-through for every QA person on the release team.",
    ],
  },
  result: {
    eyebrow: "Result",
    heading: "Zero release OOS events in the 24 months following the rebuild.",
    lede: "The measurement window was defined up front — twenty-four months from the close of the rebuild, covering roughly two full stability years on the transitioned SKUs. No release OOS events were recorded in that window.",
    bullets: [
      "Zero out-of-spec events recorded at release across the 24-month measurement window.",
      "Stability-programme-to-distribution-territory alignment closed — all Zone IVb-distributed SKUs on Zone IVb long-term data.",
      "Supplier portfolio on a single qualification checklist; no ungrandfathered, unremediated suppliers at the end of the rebuild.",
      "PQS documentation reusable across future SKU additions — the release-testing workflow does not need to be redesigned for each new product.",
    ],
    callout: {
      value: "Zero",
      label: "Release OOS events across 24 months",
    },
  },
  timeline: {
    eyebrow: "Timeline",
    heading: "Twelve months of rebuild, twenty-four months of monitoring.",
    lede: "The rebuild was a fixed 12-month programme. The monitoring window after close was agreed as part of the engagement — the zero-OOS result is measured, not claimed.",
    phases: [
      {
        id: "ph-1",
        period: "Month 0–2",
        title: "PQS diagnostic",
        body: "ICH Q10 gap analysis across governance, operations, and PQS elements. Three-workstream programme scoped: quality system, stability, supplier qualification.",
      },
      {
        id: "ph-2",
        period: "Month 2–7",
        title: "Stability transition to Zone IVb",
        body: "Zone IVb long-term conditions stood up in the Propharmex lab; bridging protocol for in-flight batches; release-shelf-life re-determinations.",
      },
      {
        id: "ph-3",
        period: "Month 4–9",
        title: "Supplier-qualification rebuild",
        body: "Single qualification checklist aligned with WHO Prequalification expectations; time-boxed remediation for non-compliant suppliers; grandfathering rules documented.",
      },
      {
        id: "ph-4",
        period: "Month 7–12",
        title: "Release-testing workflow restructure",
        body: "Tighter in-process controls, clearer OOS-to-release decision tree, named second-review on marginal results, walk-through training for the full release QA team.",
      },
      {
        id: "ph-5",
        period: "Month 12–36",
        title: "Monitoring window",
        body: "24-month monitoring window after rebuild close. Zero OOS release events recorded across the window.",
      },
    ],
    closingNote:
      "End-to-end elapsed: ~12 months for the rebuild; 24 months of post-rebuild monitoring against a zero-OOS outcome.",
  },
  regulatory: {
    eyebrow: "Regulatory outcome",
    heading: "Capability alignment with WHO Prequalification expectations — no PQ claim.",
    lede: "The supplier-qualification checklist and the stability programme were aligned with WHO Prequalification expectations as of 2026-04-23. Propharmex does not currently hold WHO Prequalification on a product, and this engagement does not represent a prequalification claim. The quality-system rebuild was anchored on ICH Q10 and ICH Q1A(R2).",
    filings: [
      {
        id: "f-1",
        label: "Quality system rebuild",
        detail:
          "PQS documentation authored against ICH Q10 across governance, change control, CAPA, management review, and continuous improvement.",
        source: ICH_Q10,
      },
      {
        id: "f-2",
        label: "Stability programme",
        detail:
          "Zone IVb long-term conditions stood up for distribution territory, per ICH Q1A(R2).",
        source: ICH_Q1A_R2,
      },
      {
        id: "f-3",
        label: "Supplier-qualification checklist",
        detail:
          "Single checklist aligned with WHO Prequalification expectations (as of 2026-04-23).",
        source: WHO_PREQUALIFICATION,
      },
    ],
    closingNote:
      "This block describes the quality-system rebuild and the service standards it was authored against. No prequalification outcome is claimed; Propharmex does not currently hold WHO PQ on a product.",
  },
  related: {
    eyebrow: "Services engaged",
    heading: "The work streams behind this case study.",
    lede: "Three Propharmex service leaves were active on this engagement.",
    links: [
      {
        id: "rel-1",
        label: "Quality and compliance",
        description:
          "The ICH Q10 PQS rebuild that anchored the programme.",
        href: "/quality-compliance",
      },
      {
        id: "rel-2",
        label: "Stability studies",
        description:
          "Zone IVb long-term stability transition in the Propharmex lab.",
        href: "/services/pharma-development/stability-studies",
      },
      {
        id: "rel-3",
        label: "Release and stability testing",
        description:
          "Release-testing workflow rebuild and second-review structure.",
        href: "/services/analytical-services/release-stability-testing",
      },
    ],
  },
  closing: {
    eyebrow: "Similar challenge?",
    heading: "Recurring OOS on a multi-SKU portfolio? The answer is usually one level up.",
    body: "When OOS events are distributed across SKUs, suppliers, and assays, the fix is almost always a quality-system rebuild rather than an event-by-event investigation. We scope the rebuild against ICH Q10, run it as a single time-boxed programme, and agree the monitoring window up front.",
    primaryCta: {
      label: "Start a similar project",
      href: "/contact",
      variant: "primary",
    },
    secondaryCta: {
      label: "Talk to a scientist",
      href: "/contact#schedule",
      variant: "ghost",
    },
    regulatoryNote: HEALTH_CANADA_DEL_REGISTER,
  },
};

/* -------------------------------------------------------------------------- */
/*  Registry                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Full `Record<CaseStudySlug, CaseStudyContent>` — TypeScript statically
 * enforces that every slug in `CASE_STUDY_SLUGS` has a content block. Adding
 * a new slug to the tuple without a matching entry here fails to compile.
 *
 * Same pattern as regulatory-services.ts and industries.ts post-PR-#17.
 */
export const CASE_STUDIES: Record<CaseStudySlug, CaseStudyContent> = {
  "modified-release-requalification": MODIFIED_RELEASE_REQUALIFICATION,
  "sterile-injectable-second-sourcing": STERILE_INJECTABLE_SECOND_SOURCING,
  "ngo-oral-solid-stability-rebuild": NGO_ORAL_SOLID_STABILITY_REBUILD,
};

/**
 * Pre-computed hub card list — the hub route reads this directly. Keeps the
 * source-of-truth on the detail-page `summary` blocks so the grid card and
 * the detail-page hero card never drift.
 */
export const CASE_STUDY_CARDS: CaseStudyCardSummary[] = CASE_STUDY_SLUGS.map(
  (slug) => CASE_STUDIES[slug].summary,
);

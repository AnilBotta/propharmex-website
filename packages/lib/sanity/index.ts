/**
 * `@propharmex/lib/sanity` — barrel.
 *
 * Import from here in apps/web:
 *   import { sanityFetch, siteSettingsQuery, zSiteSettings } from "@propharmex/lib/sanity";
 * Or via the top-level namespace:
 *   import { sanity } from "@propharmex/lib";
 *   await sanity.sanityFetch({ ... });
 */

/* Client */
export {
  publishedClient,
  previewClient,
  getClient,
  sanityConfig,
} from "./client";

/* Image helpers */
export { urlFor, urlForWidth } from "./image";

/* Portable text */
export { toPlainText, type PortableTextBlock } from "./portable-text";

/* Fetch wrapper */
export { sanityFetch, sanityTag, type SanityFetchOptions } from "./fetch";

/* AI prompt config (Concierge — Prompt 18 PR-B) */
export {
  fetchConciergePromptConfig,
  conciergePromptParser,
  FALLBACK_CONCIERGE_CONFIG,
  type ConciergePromptConfig,
} from "./ai-prompt-config";

/* Queries */
export {
  siteSettingsQuery,
  pageBySlugQuery,
  pagePathsQuery,
  servicesListQuery,
  serviceBySlugQuery,
  servicePathsQuery,
  industriesListQuery,
  industryBySlugQuery,
  caseStudiesListQuery,
  caseStudyBySlugQuery,
  insightsListQuery,
  insightBySlugQuery,
  insightPathsQuery,
  whitepapersListQuery,
  whitepaperBySlugQuery,
  peopleListQuery,
  personBySlugQuery,
  facilitiesListQuery,
  facilityBySlugQuery,
  certificationsListQuery,
  faqsByTagQuery,
  testimonialsListQuery,
  sopCapabilitiesQuery,
  aiPromptConfigQuery,
  ragExtractQuery,
} from "./queries";

/* Parsers — exported both as schemas and their inferred types. */
export {
  // Primitives
  zSanityReference,
  zSlug,
  zImage,
  zResolvedImage,
  zLink,
  zPortableText,
  zRegulatoryAuthority,
  zRegulatoryAnchor,
  zAddress,
  zSeoFields,
  // Sections
  zHero,
  zPillars,
  zStatsStrip,
  zProcessStepper,
  zLogoWall,
  zCaseStudySummary,
  zCaseStudyCarousel,
  zCapabilityMatrix,
  zCertBand,
  zLeaderCard,
  zFaqBlock,
  zCtaSection,
  zBentoGrid,
  zSection,
  zSectionList,
  // Ref shapes
  zPersonRef,
  // Docs
  zSiteSettings,
  zPage,
  zServicePillar,
  zService,
  zIndustry,
  zCaseStudy,
  zInsightType,
  zInsight,
  zWhitepaper,
  zPerson,
  zFacility,
  zCertification,
  zFaq,
  zTestimonial,
  zSopCapability,
  zAiPromptConfig,
  // Lists
  zServiceList,
  zIndustryList,
  zCaseStudyList,
  zCaseStudySummaryList,
  zInsightList,
  zWhitepaperList,
  zPersonList,
  zFacilityList,
  zCertificationList,
  zFaqList,
  zTestimonialList,
  zSopCapabilityList,
} from "./parsers";

/* Types (inferred from Zod). */
export type {
  SanityReference,
  Slug,
  Image,
  ResolvedImage,
  Link,
  PortableText,
  RegulatoryAnchor,
  Address,
  SeoFields,
  Hero,
  Pillars,
  StatsStrip,
  ProcessStepper,
  LogoWall,
  CaseStudySummary,
  CaseStudyCarousel,
  CapabilityMatrix,
  CertBand,
  LeaderCard,
  FaqBlock,
  CtaSection,
  BentoGrid,
  Section,
  SectionList,
  PersonRef,
  SiteSettings,
  Page,
  Service,
  Industry,
  CaseStudy,
  Insight,
  Whitepaper,
  Person,
  Facility,
  Certification,
  Faq,
  Testimonial,
  SopCapability,
  AiPromptConfig,
} from "./types";

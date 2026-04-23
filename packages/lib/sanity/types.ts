/**
 * Inferred TypeScript types for the Sanity content model.
 *
 * Types are the `z.infer<typeof ...>` of the parsers in `./parsers`. Keep this
 * file import-cheap — it must not pull any runtime-only code. Downstream
 * consumers can `import type { Service, Insight } from "@propharmex/lib"`.
 */
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
} from "./parsers";

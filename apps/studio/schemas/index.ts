import type { SchemaTypeDefinition } from "sanity";

// Shared objects
import link from "./objects/shared/link";
import regulatoryAnchor from "./objects/shared/regulatoryAnchor";
import address from "./objects/shared/address";

// Section objects
import hero from "./objects/sections/hero";
import pillars from "./objects/sections/pillars";
import statsStrip from "./objects/sections/statsStrip";
import processStepper from "./objects/sections/processStepper";
import logoWall from "./objects/sections/logoWall";
import caseStudyCarousel from "./objects/sections/caseStudyCarousel";
import capabilityMatrix from "./objects/sections/capabilityMatrix";
import certBand from "./objects/sections/certBand";
import leaderCard from "./objects/sections/leaderCard";
import faqBlock from "./objects/sections/faqBlock";
import ctaSection from "./objects/sections/ctaSection";
import bentoGrid from "./objects/sections/bentoGrid";

// Documents
import siteSettings from "./documents/siteSettings";
import page from "./documents/page";
import service from "./documents/service";
import industry from "./documents/industry";
import caseStudy from "./documents/caseStudy";
import insight from "./documents/insight";
import whitepaper from "./documents/whitepaper";
import person from "./documents/person";
import facility from "./documents/facility";
import certification from "./documents/certification";
import faq from "./documents/faq";
import testimonial from "./documents/testimonial";
import sopCapability from "./documents/sopCapability";
import aiPromptConfig from "./documents/aiPromptConfig";

/**
 * Full schema registry — shared objects first, then section-builder objects,
 * then documents. Order is only cosmetic; all types are resolved by `name`.
 */
export const schemaTypes: SchemaTypeDefinition[] = [
  // Shared objects
  link,
  regulatoryAnchor,
  address,

  // Section builder objects
  hero,
  pillars,
  statsStrip,
  processStepper,
  logoWall,
  caseStudyCarousel,
  capabilityMatrix,
  certBand,
  leaderCard,
  faqBlock,
  ctaSection,
  bentoGrid,

  // Singletons
  siteSettings,
  aiPromptConfig,

  // Content
  page,
  service,
  industry,
  caseStudy,
  insight,
  whitepaper,

  // People & places
  person,
  facility,
  certification,

  // Components
  faq,
  testimonial,
  sopCapability,
];

/**
 * Document type names that behave as singletons — desk structure pins them
 * with custom IDs and the config filters create/delete actions.
 */
export const SINGLETON_TYPES = new Set<string>([
  "siteSettings",
  "aiPromptConfig",
]);

/**
 * Document IDs used for singleton fetches by the web app.
 */
export const SINGLETON_IDS = {
  siteSettings: "siteSettings",
  aiPromptConfig: "aiPromptConfig",
} as const satisfies Record<string, string>;

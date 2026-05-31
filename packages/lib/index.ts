export { env, assertEnv, type Env } from "./env";
export { log } from "./log";
export {
  SCHEMA_CONTEXT,
  organizationJsonLd,
  localBusinessJsonLd,
  webSiteJsonLd,
  webPageJsonLd,
  breadcrumbListJsonLd,
  faqPageJsonLd,
  personJsonLd,
  articleDetailJsonLd,
  articleJsonLd,
  serviceJsonLd,
  jsonLdGraph,
  combineJsonLd,
  type OrganizationInput,
  type LocalBusinessInput,
  type WebSiteInput,
  type PostalAddressInput,
  type WebPageInput,
  type BreadcrumbListInput,
  type BreadcrumbTrailItem,
  type FaqPageInput,
  type FaqItem,
  type PersonInput,
  type ArticleDetailInput,
  type ArticleInput,
  type ArticleAuthor,
  type ArticleSchemaType,
  type ServiceInput,
} from "./schema-org";
export {
  getRateLimiter,
  type RateLimiter,
  type RateLimiterOptions,
  type RateLimitResult,
} from "./upstash";
export { redact, type RedactResult } from "./redact";

export * as sanity from "./sanity";
export * as rag from "./rag";
export * as supabase from "./supabase";
export * as scoping from "./scoping";
export * as delReadiness from "./del-readiness";
export * as dosageMatcher from "./dosage-matcher";
export * as leads from "./leads";
// `auth` is intentionally NOT re-exported from the barrel — it imports
// `node:crypto` which webpack can't bundle when accidentally pulled into
// a client component graph. Server-only consumers must use the subpath:
//   import * as auth from "@propharmex/lib/auth";

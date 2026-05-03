/**
 * Public surface of the analytics helpers.
 *
 *   import { trackHeroCtaClick, registerSuperProperties } from "@/lib/analytics";
 *
 * The four AI tools retain their existing namespaced telemetry helpers
 * in `apps/web/components/{concierge,scoping,del-readiness,dosage-matcher}/telemetry.ts`.
 */
export { classifyReferrer, type ReferrerGroup } from "./referrer";
export { classifyDevice, type DeviceClass } from "./device";
export {
  parseUtmFromUrl,
  resolveFirstTouchUtm,
  clearFirstTouchUtm,
  type FirstTouchUtm,
} from "./utm";
export { registerSuperProperties } from "./super-properties";
export {
  track,
  trackHeroCtaClick,
  trackServiceCardClick,
  trackFormSubmit,
  trackContactSubmit,
  trackWhitepaperDownload,
} from "./track";

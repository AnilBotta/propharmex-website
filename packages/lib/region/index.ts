/**
 * Public surface of the region subpackage.
 *
 *   import { region } from "@propharmex/lib";
 *   region.countryToRegion("CA")
 *
 * Or directly:
 *   import { REGION_COOKIE, type Region } from "@propharmex/lib/region";
 */
export {
  REGION_CODES,
  REGION_COOKIE,
  LEGACY_REGION_COOKIE,
  REGION_BANNER_DISMISSED_COOKIE,
  REGION_COOKIE_MAX_AGE_SECONDS,
  REGION_DESCRIPTORS,
  RegionSchema,
  getRegionDescriptor,
  migrateLegacyRegion,
  type Region,
  type RegionDescriptor,
} from "./types";

export { countryToRegion } from "./country-map";

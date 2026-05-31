import { DOSAGE_MATCHER } from "../../../content/dosage-matcher";
import {
  OG_IMAGE_CONTENT_TYPE,
  OG_IMAGE_SIZE,
  renderPropharmexOgImage,
} from "../../../lib/og-image";

export const runtime = "edge";
export const alt = "Propharmex Dosage Form Capability Matcher";
export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;

export default function DosageMatcherOgImage() {
  return renderPropharmexOgImage({
    eyebrow: DOSAGE_MATCHER.hero.eyebrow,
    title: DOSAGE_MATCHER.hero.title,
    description: DOSAGE_MATCHER.hero.body,
    footer: "AI-assisted dosage-form scoping",
  });
}

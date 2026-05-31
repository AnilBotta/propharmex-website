import { DEL_READINESS } from "../../../content/del-readiness";
import {
  OG_IMAGE_CONTENT_TYPE,
  OG_IMAGE_SIZE,
  renderPropharmexOgImage,
} from "../../../lib/og-image";

export const runtime = "edge";
export const alt = "Propharmex Regulatory Readiness Assessment";
export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;

export default function DelReadinessOgImage() {
  return renderPropharmexOgImage({
    eyebrow: DEL_READINESS.hero.eyebrow,
    title: DEL_READINESS.hero.title,
    description: DEL_READINESS.hero.body,
    footer: "AI-assisted regulatory readiness",
  });
}

import { SCOPING } from "../../../content/scoping";
import {
  OG_IMAGE_CONTENT_TYPE,
  OG_IMAGE_SIZE,
  renderPropharmexOgImage,
} from "../../../lib/og-image";

export const runtime = "edge";
export const alt = "Propharmex Project Scoping Assistant";
export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;

export default function ProjectScopingOgImage() {
  return renderPropharmexOgImage({
    eyebrow: SCOPING.hero.eyebrow,
    title: SCOPING.hero.title,
    description: SCOPING.hero.body,
    footer: "AI-assisted project scoping",
  });
}

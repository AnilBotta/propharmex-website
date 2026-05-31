import {
  OG_IMAGE_CONTENT_TYPE,
  OG_IMAGE_SIZE,
  renderPropharmexOgImage,
} from "../../../lib/og-image";
import { INDUSTRIES_LEAF_CONTENT, type IndustrySlug } from "../../../content/industries";

export const runtime = "edge";
export const alt = "Propharmex industry page";
export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;

export default async function IndustryOgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const content = INDUSTRIES_LEAF_CONTENT[slug as IndustrySlug];

  return renderPropharmexOgImage({
    eyebrow: "Industry",
    title: content?.ogTitle ?? "Pharmaceutical services by industry",
    description:
      content?.ogDescription ?? "Canada-headquartered pharmaceutical services for global sponsors.",
    footer: "Industry pathways",
  });
}

import {
  OG_IMAGE_CONTENT_TYPE,
  OG_IMAGE_SIZE,
  renderPropharmexOgImage,
} from "../../../../lib/og-image";
import {
  REGULATORY_LEAF_CONTENT,
  type RegulatoryServiceSlug,
} from "../../../../content/regulatory-services";

export const runtime = "edge";
export const alt = "Propharmex regulatory service";
export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;

export default async function RegulatoryServiceOgImage({
  params,
}: {
  params: Promise<{ service: string }>;
}) {
  const { service } = await params;
  const content = REGULATORY_LEAF_CONTENT[service as RegulatoryServiceSlug];

  return renderPropharmexOgImage({
    eyebrow: "Regulatory services",
    title: content?.ogTitle ?? "Regulatory Services - Propharmex",
    description:
      content?.ogDescription ??
      "Regulatory affairs support for dossier, submission, and lifecycle work.",
    footer: "Regulatory services",
  });
}

import {
  OG_IMAGE_CONTENT_TYPE,
  OG_IMAGE_SIZE,
  renderPropharmexOgImage,
} from "../../../../lib/og-image";
import {
  ANALYTICAL_LEAF_CONTENT,
  type AnalyticalServiceSlug,
} from "../../../../content/analytical-services";

export const runtime = "edge";
export const alt = "Propharmex analytical service";
export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;

export default async function AnalyticalServiceOgImage({
  params,
}: {
  params: Promise<{ service: string }>;
}) {
  const { service } = await params;
  const content = ANALYTICAL_LEAF_CONTENT[service as AnalyticalServiceSlug];

  return renderPropharmexOgImage({
    eyebrow: "Analytical services",
    title: content?.ogTitle ?? "Analytical Services - Propharmex",
    description:
      content?.ogDescription ??
      "Method development, validation, stability, and analytical problem-solving.",
    footer: "Analytical services",
  });
}

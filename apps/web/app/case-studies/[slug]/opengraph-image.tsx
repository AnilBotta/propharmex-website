import {
  OG_IMAGE_CONTENT_TYPE,
  OG_IMAGE_SIZE,
  renderPropharmexOgImage,
} from "../../../lib/og-image";
import { CASE_STUDIES, type CaseStudySlug } from "../../../content/case-studies";

export const runtime = "edge";
export const alt = "Propharmex case study";
export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;

export default async function CaseStudyOgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const content = CASE_STUDIES[slug as CaseStudySlug];

  return renderPropharmexOgImage({
    eyebrow: "Case study",
    title: content?.ogTitle ?? "Propharmex case study",
    description:
      content?.ogDescription ?? "Evidence-led pharmaceutical services for global sponsors.",
    footer: "Case studies",
  });
}

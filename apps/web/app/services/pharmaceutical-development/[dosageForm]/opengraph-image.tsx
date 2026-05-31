import {
  OG_IMAGE_CONTENT_TYPE,
  OG_IMAGE_SIZE,
  renderPropharmexOgImage,
} from "../../../../lib/og-image";
import {
  DOSAGE_FORM_CONTENT,
  type DosageFormSlug,
} from "../../../../content/pharmaceutical-development";

export const runtime = "edge";
export const alt = "Propharmex pharmaceutical development service";
export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;

export default async function PharmaceuticalDevelopmentOgImage({
  params,
}: {
  params: Promise<{ dosageForm: string }>;
}) {
  const { dosageForm } = await params;
  const content = DOSAGE_FORM_CONTENT[dosageForm as DosageFormSlug];

  return renderPropharmexOgImage({
    eyebrow: "Pharmaceutical development",
    title: content?.ogTitle ?? "Pharmaceutical Development - Propharmex",
    description:
      content?.ogDescription ??
      "Dosage-form development support for global pharmaceutical sponsors.",
    footer: "Dosage-form development",
  });
}

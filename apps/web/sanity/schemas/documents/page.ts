import { defineArrayMember, defineField, defineType } from "sanity";
import {
  baseContentFields,
  sectionBuilderMembers,
} from "../_helpers/baseFields";

/**
 * Generic editorial page. Home, Why Propharmex, About, Quality, Facilities,
 * Contact, Legal — all built from the section array below.
 */
export const groqProjection = `{
  _id,
  title,
  "slug": slug.current,
  seoTitle,
  seoDescription,
  ogImage,
  publishedAt,
  isVisible,
  region,
  ragEligible,
  hero,
  body,
  faqRefs[]->{ _id, question, answer, tag }
}`;

export default defineType({
  name: "page",
  title: "Page",
  type: "document",
  fields: [
    ...baseContentFields,
    defineField({
      name: "hero",
      title: "Hero",
      type: "hero",
      description: "Primary hero section. Shown at the top of the page.",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: sectionBuilderMembers,
      description: "Compose the page from sectional blocks.",
    }),
    defineField({
      name: "faqRefs",
      title: "Related FAQs",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "faq" }] })],
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "slug.current",
      media: "ogImage",
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title ?? "Page",
        subtitle: subtitle ? `/${subtitle}` : undefined,
        media,
      };
    },
  },
  orderings: [
    {
      title: "Published (new → old)",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
    {
      title: "Title (A → Z)",
      name: "titleAsc",
      by: [{ field: "title", direction: "asc" }],
    },
  ],
});

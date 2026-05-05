import { defineArrayMember, defineField, defineType } from "sanity";
import {
  baseContentFields,
  sectionBuilderMembers,
} from "../_helpers/baseFields";

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
  summary,
  audience,
  body,
  representativeServices[]->{ _id, title, "slug": slug.current, pillar }
}`;

export default defineType({
  name: "industry",
  title: "Industry",
  type: "document",
  fields: [
    ...baseContentFields,
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required().min(60).max(480),
    }),
    defineField({
      name: "audience",
      title: "Audience",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      description: "Target roles or organisations (e.g. 'Virtual generics sponsor', 'Hospital group').",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: sectionBuilderMembers,
    }),
    defineField({
      name: "representativeServices",
      title: "Representative services",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "service" }] })],
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "summary", media: "ogImage" },
    prepare({ title, subtitle, media }) {
      return {
        title: title ?? "Industry",
        subtitle: subtitle
          ? String(subtitle).slice(0, 80)
          : undefined,
        media,
      };
    },
  },
});

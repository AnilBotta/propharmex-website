import { defineArrayMember, defineField, defineType } from "sanity";
import {
  baseContentFields,
  longFormPortableText,
} from "../_helpers/baseFields";

export const groqProjection = `{
  _id,
  title,
  "slug": slug.current,
  question,
  answer,
  tag,
  relatedServices[]->{ _id, title, "slug": slug.current }
}`;

export default defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
  fields: [
    ...baseContentFields,
    defineField({
      name: "question",
      title: "Question",
      type: "string",
      validation: (rule) => rule.required().min(8).max(240),
    }),
    defineField({
      name: "answer",
      title: "Answer",
      type: "array",
      of: longFormPortableText,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tag",
      title: "Tag",
      type: "string",
      description: "Coarse grouping (e.g. 'regulatory', 'analytical', 'distribution').",
    }),
    defineField({
      name: "relatedServices",
      title: "Related services",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "service" }] })],
    }),
  ],
  preview: {
    select: { title: "question", subtitle: "tag" },
  },
});

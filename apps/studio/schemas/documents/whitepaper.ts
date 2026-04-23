import { defineArrayMember, defineField, defineType } from "sanity";
import {
  baseContentFields,
  longFormPortableText,
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
  cover,
  "fileUrl": file.asset->url,
  gated,
  formFields,
  pages,
  body
}`;

const formFieldValues = [
  { title: "Full name", value: "fullName" },
  { title: "Email", value: "email" },
  { title: "Company", value: "company" },
  { title: "Role", value: "role" },
  { title: "Country", value: "country" },
  { title: "Use case", value: "useCase" },
];

export default defineType({
  name: "whitepaper",
  title: "Whitepaper",
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
      name: "cover",
      title: "Cover image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          validation: (rule) =>
            rule.custom((value, context) => {
              const parent = context.parent as { asset?: unknown } | undefined;
              if (parent?.asset && (!value || value.trim().length < 4)) {
                return "Alt text is required.";
              }
              return true;
            }),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "file",
      title: "PDF file",
      type: "file",
      options: { accept: "application/pdf" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "gated",
      title: "Gated behind form",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "formFields",
      title: "Form fields required",
      type: "array",
      of: [
        defineArrayMember({
          type: "string",
          options: { list: formFieldValues },
        }),
      ],
      initialValue: ["fullName", "email", "company", "role", "country", "useCase"],
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: "pages",
      title: "Page count",
      type: "number",
      validation: (rule) => rule.positive().integer().min(1).max(200),
    }),
    defineField({
      name: "body",
      title: "Body (preview / excerpt)",
      type: "array",
      of: longFormPortableText,
    }),
  ],
  preview: {
    select: {
      title: "title",
      pages: "pages",
      media: "cover",
    },
    prepare({ title, pages, media }) {
      return {
        title: title ?? "Whitepaper",
        subtitle: pages ? `${pages} pages` : undefined,
        media,
      };
    },
  },
});

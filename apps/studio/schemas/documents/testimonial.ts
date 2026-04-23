import { defineField, defineType } from "sanity";
import { baseContentFields } from "../_helpers/baseFields";

export const groqProjection = `{
  _id,
  title,
  "slug": slug.current,
  quote,
  authorName,
  role,
  company,
  logo,
  permissionGranted
}`;

export default defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  description:
    "Do not publish a testimonial unless the client has granted explicit written permission.",
  fields: [
    ...baseContentFields,
    defineField({
      name: "quote",
      title: "Quote",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required().min(20).max(600),
    }),
    defineField({
      name: "authorName",
      title: "Author name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
    }),
    defineField({
      name: "company",
      title: "Company",
      type: "string",
    }),
    defineField({
      name: "logo",
      title: "Company logo",
      type: "image",
      options: { hotspot: false },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          validation: (rule) =>
            rule.custom((value, context) => {
              const parent = context.parent as { asset?: unknown } | undefined;
              if (parent?.asset && (!value || value.trim().length < 2)) {
                return "Alt text is required.";
              }
              return true;
            }),
        }),
      ],
    }),
    defineField({
      name: "permissionGranted",
      title: "Written permission on file",
      type: "boolean",
      initialValue: false,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "authorName",
      subtitle: "company",
      media: "logo",
    },
  },
});

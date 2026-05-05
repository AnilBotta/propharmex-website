import { defineArrayMember, defineField, defineType } from "sanity";
import { baseContentFields } from "../_helpers/baseFields";

export const groqProjection = `{
  _id,
  title,
  "slug": slug.current,
  name,
  issuer,
  number,
  issuedDate,
  validUntil,
  scope,
  "documentUrl": document.asset->url,
  logo,
  regulatoryAnchors[]{ authority, url, asOfDate, note }
}`;

export default defineType({
  name: "certification",
  title: "Certification",
  type: "document",
  fields: [
    ...baseContentFields,
    defineField({
      name: "name",
      title: "Certification name",
      type: "string",
      validation: (rule) => rule.required().min(2),
    }),
    defineField({
      name: "issuer",
      title: "Issuer",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "number",
      title: "Certificate number",
      type: "string",
    }),
    defineField({
      name: "issuedDate",
      title: "Issued date",
      type: "date",
    }),
    defineField({
      name: "validUntil",
      title: "Valid until",
      type: "date",
    }),
    defineField({
      name: "scope",
      title: "Scope",
      type: "text",
      rows: 3,
      description:
        "Exact scope as stated on the certificate. Do not paraphrase for marketing.",
    }),
    defineField({
      name: "document",
      title: "Certificate document",
      type: "file",
      options: { accept: "application/pdf,image/png,image/jpeg" },
    }),
    defineField({
      name: "logo",
      title: "Issuer logo",
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
      name: "regulatoryAnchors",
      title: "Regulatory anchors",
      type: "array",
      of: [defineArrayMember({ type: "regulatoryAnchor" })],
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "issuer",
      media: "logo",
    },
  },
});

import { defineArrayMember, defineField, defineType } from "sanity";
import { baseContentFields } from "../_helpers/baseFields";

export const groqProjection = `{
  _id,
  title,
  "slug": slug.current,
  summary,
  address,
  coords,
  openingHours,
  capabilities,
  certifications[]->{ _id, name, issuer, issuedDate, validUntil, logo },
  photos
}`;

export default defineType({
  name: "facility",
  title: "Facility",
  type: "document",
  fields: [
    ...baseContentFields,
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      validation: (rule) => rule.max(480),
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "address",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "coords",
      title: "Coordinates",
      type: "geopoint",
    }),
    defineField({
      name: "openingHours",
      title: "Opening hours",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      description:
        "One entry per day or range (e.g. 'Mon-Fri 09:00-18:00 ET').",
    }),
    defineField({
      name: "capabilities",
      title: "Capabilities",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
    }),
    defineField({
      name: "certifications",
      title: "Certifications",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "certification" }],
        }),
      ],
    }),
    defineField({
      name: "photos",
      title: "Photos",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt text",
              type: "string",
              validation: (rule) => rule.required().min(4),
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      locality: "address.locality",
      country: "address.country",
    },
    prepare({ title, locality, country }) {
      return {
        title: title ?? "Facility",
        subtitle: [locality, country].filter(Boolean).join(", "),
      };
    },
  },
});

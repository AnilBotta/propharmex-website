import { defineArrayMember, defineField, defineType } from "sanity";

export const groqProjection = `{
  _type,
  _key,
  title,
  certifications[]->{
    _id,
    name,
    issuer,
    number,
    issuedDate,
    validUntil,
    logo
  }
}`;

export default defineType({
  name: "certBand",
  title: "Certification band",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Section title",
      type: "string",
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: "certifications",
      title: "Certifications",
      type: "array",
      validation: (rule) => rule.required().min(1).max(12),
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "certification" }],
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "title", certifications: "certifications" },
    prepare({ title, certifications }) {
      const count = Array.isArray(certifications) ? certifications.length : 0;
      return {
        title: title ?? "Certifications",
        subtitle: `Cert band · ${count} item${count === 1 ? "" : "s"}`,
      };
    },
  },
});

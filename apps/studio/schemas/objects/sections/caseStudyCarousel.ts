import { defineArrayMember, defineField, defineType } from "sanity";

export const groqProjection = `{
  _type,
  _key,
  title,
  caseStudies[]->{
    _id,
    title,
    "slug": slug.current,
    pillar,
    clientLogo,
    logoPermitted,
    metrics
  }
}`;

export default defineType({
  name: "caseStudyCarousel",
  title: "Case study carousel",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Section title",
      type: "string",
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: "caseStudies",
      title: "Case studies",
      type: "array",
      validation: (rule) => rule.required().min(1).max(12),
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "caseStudy" }],
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "title", caseStudies: "caseStudies" },
    prepare({ title, caseStudies }) {
      const count = Array.isArray(caseStudies) ? caseStudies.length : 0;
      return {
        title: title ?? "Case studies",
        subtitle: `Case study carousel · ${count} item${count === 1 ? "" : "s"}`,
      };
    },
  },
});

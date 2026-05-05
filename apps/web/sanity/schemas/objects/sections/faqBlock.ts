import { defineArrayMember, defineField, defineType } from "sanity";

export const groqProjection = `{
  _type,
  _key,
  title,
  mode,
  faqs[]->{
    _id,
    question,
    answer,
    tag
  }
}`;

export default defineType({
  name: "faqBlock",
  title: "FAQ block",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Section title",
      type: "string",
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: "mode",
      title: "Display mode",
      type: "string",
      options: {
        list: [
          { title: "List", value: "list" },
          { title: "Accordion", value: "accordion" },
        ],
        layout: "radio",
      },
      initialValue: "accordion",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "faqs",
      title: "FAQs",
      type: "array",
      validation: (rule) => rule.required().min(1).max(20),
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "faq" }],
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "title", faqs: "faqs" },
    prepare({ title, faqs }) {
      const count = Array.isArray(faqs) ? faqs.length : 0;
      return {
        title: title ?? "FAQ block",
        subtitle: `${count} question${count === 1 ? "" : "s"}`,
      };
    },
  },
});

import { defineField, defineType } from "sanity";

export const groqProjection = `{
  _type,
  _key,
  variant,
  headline,
  body,
  primaryCta,
  secondaryCta
}`;

export default defineType({
  name: "ctaSection",
  title: "CTA section",
  type: "object",
  fields: [
    defineField({
      name: "variant",
      title: "Variant",
      type: "string",
      options: {
        list: [
          { title: "Primary", value: "primary" },
          { title: "Secondary", value: "secondary" },
          { title: "Inverse", value: "inverse" },
        ],
        layout: "radio",
      },
      initialValue: "primary",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      validation: (rule) => rule.required().max(90),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "text",
      rows: 3,
      validation: (rule) => rule.max(280),
    }),
    defineField({
      name: "primaryCta",
      title: "Primary CTA",
      type: "link",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "secondaryCta",
      title: "Secondary CTA",
      type: "link",
    }),
  ],
  preview: {
    select: { title: "headline", subtitle: "variant" },
    prepare({ title, subtitle }) {
      return {
        title: title ?? "CTA",
        subtitle: subtitle ? `CTA · ${subtitle}` : "CTA section",
      };
    },
  },
});

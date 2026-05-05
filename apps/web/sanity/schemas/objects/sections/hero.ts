import { defineField, defineType } from "sanity";

export const groqProjection = `{
  _type,
  _key,
  variant,
  eyebrow,
  headline,
  subhead,
  primaryCta,
  secondaryCta,
  media
}`;

export default defineType({
  name: "hero",
  title: "Hero",
  type: "object",
  fields: [
    defineField({
      name: "variant",
      title: "Variant",
      type: "string",
      options: {
        list: [
          { title: "Default", value: "default" },
          { title: "Centered", value: "centered" },
          { title: "Split", value: "split" },
          { title: "Media-first", value: "media-first" },
        ],
        layout: "radio",
      },
      initialValue: "default",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
      description: "Short prefatory label shown above the headline.",
      validation: (rule) => rule.max(48),
    }),
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      description:
        "One precise statement. Avoid hype adjectives (best-in-class, world-class, cutting-edge).",
      validation: (rule) => rule.required().max(90),
    }),
    defineField({
      name: "subhead",
      title: "Subhead",
      type: "text",
      rows: 3,
      validation: (rule) => rule.max(240),
    }),
    defineField({
      name: "primaryCta",
      title: "Primary CTA",
      type: "link",
    }),
    defineField({
      name: "secondaryCta",
      title: "Secondary CTA",
      type: "link",
    }),
    defineField({
      name: "media",
      title: "Media",
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
      validation: (rule) =>
        rule.custom((value) => {
          if (!value) return true;
          const withAlt = value as { alt?: string };
          if (!withAlt.alt || withAlt.alt.trim().length < 4) {
            return "Alt text is required for all images.";
          }
          return true;
        }),
    }),
  ],
  preview: {
    select: { title: "headline", subtitle: "eyebrow", media: "media" },
    prepare({ title, subtitle, media }) {
      return {
        title: title ?? "Hero",
        subtitle: subtitle ? `Hero · ${subtitle}` : "Hero",
        media,
      };
    },
  },
});

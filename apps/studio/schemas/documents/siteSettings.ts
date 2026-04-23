import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Singleton — global brand, regions, social, legal.
 * Accessible via fixed document ID `siteSettings`.
 */
export const groqProjection = `{
  _id,
  brand{
    logoLight,
    logoDark,
    wordmark
  },
  tagline,
  description,
  officialName,
  regions[]{ code, label, headline, ctaLabel, ctaHref },
  social[]{ platform, url },
  legal{ registeredName, incNumber, country }
}`;

export default defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  // Singleton — only update/publish actions are allowed.
  // The desk structure also hides create/delete for this type.
  // @ts-expect-error __experimental_actions is typed permissively in Sanity v3.
  __experimental_actions: ["update", "publish"],
  fields: [
    defineField({
      name: "brand",
      title: "Brand",
      type: "object",
      fields: [
        defineField({
          name: "logoLight",
          title: "Logo (light mode)",
          type: "image",
          options: { hotspot: false },
          fields: [
            defineField({
              name: "alt",
              title: "Alt text",
              type: "string",
              validation: (rule) => rule.required(),
            }),
          ],
        }),
        defineField({
          name: "logoDark",
          title: "Logo (dark mode)",
          type: "image",
          options: { hotspot: false },
          fields: [
            defineField({
              name: "alt",
              title: "Alt text",
              type: "string",
              validation: (rule) => rule.required(),
            }),
          ],
        }),
        defineField({
          name: "wordmark",
          title: "Wordmark",
          type: "image",
          options: { hotspot: false },
          fields: [
            defineField({
              name: "alt",
              title: "Alt text",
              type: "string",
              validation: (rule) => rule.required(),
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      description:
        "Anti-hype, regulatory-precise. Expert and humble. Avoid superlatives.",
      validation: (rule) => rule.required().min(8).max(120),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().min(40).max(320),
    }),
    defineField({
      name: "officialName",
      title: "Official name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "regions",
      title: "Regions",
      type: "array",
      validation: (rule) => rule.min(1),
      of: [
        defineArrayMember({
          type: "object",
          name: "regionEntry",
          fields: [
            defineField({
              name: "code",
              title: "Region code",
              type: "string",
              options: {
                list: [
                  { title: "Canada", value: "canada" },
                  { title: "India", value: "india" },
                  { title: "Global", value: "global" },
                ],
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "label",
              title: "Display label",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "headline",
              title: "Region headline",
              type: "string",
              validation: (rule) => rule.max(120),
            }),
            defineField({
              name: "ctaLabel",
              title: "CTA label",
              type: "string",
              validation: (rule) => rule.max(48),
            }),
            defineField({
              name: "ctaHref",
              title: "CTA href",
              type: "string",
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "code" },
          },
        }),
      ],
    }),
    defineField({
      name: "social",
      title: "Social links",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "socialLink",
          fields: [
            defineField({
              name: "platform",
              title: "Platform",
              type: "string",
              options: {
                list: [
                  { title: "LinkedIn", value: "linkedin" },
                  { title: "X / Twitter", value: "x" },
                  { title: "YouTube", value: "youtube" },
                  { title: "Medium", value: "medium" },
                ],
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
              validation: (rule) =>
                rule.required().uri({ scheme: ["http", "https"] }),
            }),
          ],
          preview: {
            select: { title: "platform", subtitle: "url" },
          },
        }),
      ],
    }),
    defineField({
      name: "legal",
      title: "Legal",
      type: "object",
      fields: [
        defineField({
          name: "registeredName",
          title: "Registered entity name",
          type: "string",
        }),
        defineField({
          name: "incNumber",
          title: "Incorporation / registration number",
          type: "string",
        }),
        defineField({
          name: "country",
          title: "Country of incorporation",
          type: "string",
          options: {
            list: [
              { title: "Canada", value: "CA" },
              { title: "India", value: "IN" },
            ],
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "officialName", subtitle: "tagline" },
    prepare({ title, subtitle }) {
      return {
        title: title ?? "Site settings",
        subtitle: subtitle ?? "Singleton",
      };
    },
  },
});

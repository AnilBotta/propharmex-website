import { defineField, defineType } from "sanity";

/**
 * Shared link object — used by hero CTAs, ctaSection, bentoGrid tiles, etc.
 * Internal hrefs must begin with "/"; external hrefs must be absolute URLs.
 */
export const groqProjection = `{
  label,
  href,
  kind,
  openInNewTab
}`;

const httpUrlOrInternalPath = /^(https?:\/\/|\/)/i;

export default defineType({
  name: "link",
  title: "Link",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (rule) => rule.required().min(2).max(60),
    }),
    defineField({
      name: "href",
      title: "URL or internal path",
      type: "string",
      description:
        "Absolute URL for external links, or an internal path beginning with '/'.",
      validation: (rule) =>
        rule
          .required()
          .custom((value) => {
            if (typeof value !== "string" || value.length === 0) {
              return "A link target is required.";
            }
            if (!httpUrlOrInternalPath.test(value)) {
              return "Must be an absolute URL (http/https) or an internal path starting with '/'.";
            }
            return true;
          }),
    }),
    defineField({
      name: "kind",
      title: "Kind",
      type: "string",
      options: {
        list: [
          { title: "Internal", value: "internal" },
          { title: "External", value: "external" },
        ],
        layout: "radio",
      },
      initialValue: "internal",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "openInNewTab",
      title: "Open in new tab",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "href" },
  },
});

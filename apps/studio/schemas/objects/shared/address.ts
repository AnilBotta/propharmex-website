import { defineField, defineType } from "sanity";

/**
 * Postal address for facilities and legal entities.
 */
export const groqProjection = `{
  street,
  locality,
  region,
  postal,
  country
}`;

export default defineType({
  name: "address",
  title: "Address",
  type: "object",
  fields: [
    defineField({
      name: "street",
      title: "Street",
      type: "string",
      validation: (rule) => rule.required().min(3),
    }),
    defineField({
      name: "locality",
      title: "City / locality",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "region",
      title: "State / province / region",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "postal",
      title: "Postal / ZIP code",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "country",
      title: "Country",
      type: "string",
      options: {
        list: [
          { title: "Canada", value: "CA" },
          { title: "India", value: "IN" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      street: "street",
      locality: "locality",
      region: "region",
      country: "country",
    },
    prepare({ street, locality, region, country }) {
      const subtitle = [locality, region, country].filter(Boolean).join(", ");
      return { title: street ?? "Address", subtitle };
    },
  },
});

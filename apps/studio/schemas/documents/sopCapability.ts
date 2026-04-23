import { defineArrayMember, defineField, defineType } from "sanity";
import {
  baseContentFields,
  longFormPortableText,
} from "../_helpers/baseFields";

export const dosageFormOptions = [
  { title: "Oral solid", value: "oral-solid" },
  { title: "Oral liquid", value: "oral-liquid" },
  { title: "Topical", value: "topical" },
  { title: "Injectable — lyophilised", value: "injectable-lyo" },
  { title: "Injectable — liquid", value: "injectable-liquid" },
  { title: "Ophthalmic", value: "ophthalmic" },
  { title: "Inhalation", value: "inhalation" },
  { title: "Transdermal", value: "transdermal" },
  { title: "Suppository", value: "suppository" },
  { title: "Otic", value: "otic" },
  { title: "Nasal", value: "nasal" },
  { title: "Soft gel", value: "soft-gel" },
  { title: "Hard capsule", value: "hard-cap" },
];

export const capabilityOptions = [
  { title: "Formulation", value: "formulation" },
  { title: "Analytical", value: "analytical" },
  { title: "Stability", value: "stability" },
  { title: "Process validation", value: "process-validation" },
  { title: "Scale-up", value: "scale-up" },
  { title: "Regulatory — US", value: "regulatory-us" },
  { title: "Regulatory — CA", value: "regulatory-ca" },
  { title: "Regulatory — EU", value: "regulatory-eu" },
  { title: "Regulatory — IN", value: "regulatory-in" },
  { title: "Commercial", value: "commercial" },
];

export const groqProjection = `{
  _id,
  title,
  "slug": slug.current,
  dosageForm,
  capabilities,
  batchSizeMinKg,
  batchSizeMaxKg,
  facilitiesRef[]->{ _id, title, "slug": slug.current, address },
  notes
}`;

export default defineType({
  name: "sopCapability",
  title: "SOP capability",
  type: "document",
  description:
    "Dosage-form × capability matrix used by the Dosage Form Matcher AI tool.",
  fields: [
    ...baseContentFields,
    defineField({
      name: "dosageForm",
      title: "Dosage form",
      type: "string",
      options: { list: dosageFormOptions },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "capabilities",
      title: "Capabilities",
      type: "array",
      of: [
        defineArrayMember({
          type: "string",
          options: { list: capabilityOptions },
        }),
      ],
      validation: (rule) => rule.required().min(1),
      options: { layout: "tags" },
    }),
    defineField({
      name: "batchSizeMinKg",
      title: "Batch size — min (kg)",
      type: "number",
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: "batchSizeMaxKg",
      title: "Batch size — max (kg)",
      type: "number",
      validation: (rule) =>
        rule.min(0).custom((value, context) => {
          const parent = context.parent as
            | { batchSizeMinKg?: number }
            | undefined;
          if (
            typeof value === "number" &&
            typeof parent?.batchSizeMinKg === "number" &&
            value < parent.batchSizeMinKg
          ) {
            return "Max batch size cannot be less than min batch size.";
          }
          return true;
        }),
    }),
    defineField({
      name: "facilitiesRef",
      title: "Facilities",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "facility" }] })],
    }),
    defineField({
      name: "notes",
      title: "Notes",
      type: "array",
      of: longFormPortableText,
    }),
  ],
  preview: {
    select: {
      title: "dosageForm",
      capabilities: "capabilities",
    },
    prepare({ title, capabilities }) {
      const count = Array.isArray(capabilities) ? capabilities.length : 0;
      return {
        title: title ?? "SOP capability",
        subtitle: `${count} capabilit${count === 1 ? "y" : "ies"}`,
      };
    },
  },
});

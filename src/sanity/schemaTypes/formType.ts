import { defineField, defineType } from "sanity";
import { FormIcon } from "@sanity/icons";

export const formType = defineType({
  name: "form",
  type: "document",
  title: "Form",
  fields: [
    defineField({
      name: "name",
      type: "string",
      title: "Form Name",
      description: "Internal name for the form (e.g., 'Private Session Request')",
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: "fields",
      type: "array",
      title: "Form Fields",
      of: [{ type: "formField" }],
      validation: (Rule) => Rule.required().min(1).error("At least one field is required")
    }),
    defineField({
      name: "submitButtonText",
      type: "string",
      title: "Submit Button Text",
      initialValue: "Submit",
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: "recipientEmail",
      type: "string",
      title: "Recipient Email",
      description: "Email address where form submissions will be sent",
      validation: (Rule) => Rule.required().email().error("Please enter a valid email address")
    })
  ],
  icon: FormIcon,
  preview: {
    select: {
      title: "name",
      fieldCount: "fields",
      recipient: "recipientEmail"
    },
    prepare({ title, fieldCount, recipient }) {
      const fieldCountValue = Array.isArray(fieldCount) ? fieldCount.length : 0;
      return {
        title,
        subtitle: `${fieldCountValue} field${fieldCountValue !== 1 ? 's' : ''} → ${recipient}`,
        media: FormIcon
      };
    }
  }
});

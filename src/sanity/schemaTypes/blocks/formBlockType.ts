import { defineField, defineType } from "sanity";
import { FormIcon } from "@sanity/icons";

export const formBlockType = defineType({
  name: "formBlock",
  type: "object",
  title: "Form",
  fields: [
    defineField({
      name: "form",
      type: "reference",
      to: [{ type: "form" }],
      title: "Select Form",
      description: "Choose a published form to display",
      validation: (Rule) => Rule.required()
    })
  ],
  icon: FormIcon,
  preview: {
    select: {
      formName: "form.name",
      formFields: "form.fields"
    },
    prepare({ formName, formFields }) {
      const fieldCount = Array.isArray(formFields) ? formFields.length : 0;
      return {
        title: formName || "Form",
        subtitle: `${fieldCount} field${fieldCount !== 1 ? 's' : ''}`,
        media: FormIcon
      };
    }
  }
});

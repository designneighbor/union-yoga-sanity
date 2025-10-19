import { defineField, defineType } from "sanity";

export const formFieldType = defineType({
  name: "formField",
  type: "object",
  fields: [
    defineField({
      name: "name",
      type: "string",
      title: "Field Name",
      description: "Internal field name (e.g., 'firstName', 'email')",
      validation: (Rule) => Rule.required().regex(/^[a-zA-Z][a-zA-Z0-9]*$/, {
        name: "alphanumeric",
        invert: false
      }).error("Field name must start with a letter and contain only letters and numbers")
    }),
    defineField({
      name: "label",
      type: "string",
      title: "Field Label",
      description: "Display label for the field",
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: "fieldType",
      type: "string",
      title: "Field Type",
      options: {
        list: [
          { title: "Text", value: "text" },
          { title: "Email", value: "email" },
          { title: "Phone", value: "tel" },
          { title: "Textarea", value: "textarea" }
        ],
        layout: "radio"
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: "required",
      type: "boolean",
      title: "Required Field",
      initialValue: false
    }),
    defineField({
      name: "placeholder",
      type: "string",
      title: "Placeholder Text",
      description: "Optional placeholder text for the field"
    })
  ],
  preview: {
    select: {
      label: "label",
      fieldType: "fieldType",
      required: "required"
    },
    prepare({ label, fieldType, required }) {
      return {
        title: label,
        subtitle: `${fieldType}${required ? " (required)" : ""}`,
        media: "📝"
      };
    }
  }
});

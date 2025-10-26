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
      validation: (Rule) =>
        Rule.required()
          .regex(/^[a-zA-Z][a-zA-Z0-9]*$/, {
            name: "alphanumeric",
            invert: false,
          })
          .error(
            "Field name must start with a letter and contain only letters and numbers"
          ),
    }),
    defineField({
      name: "label",
      type: "string",
      title: "Field Label",
      description: "Display label for the field",
      validation: (Rule) => Rule.required(),
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
          { title: "Textarea", value: "textarea" },
          { title: "Radio", value: "radio" },
          { title: "Select", value: "select" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "required",
      type: "boolean",
      title: "Required Field",
      initialValue: false,
    }),
    defineField({
      name: "options",
      type: "array",
      title: "Options",
      description: "Add options for radio buttons or select dropdown",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "label",
              type: "string",
              title: "Option Label",
              description: "Text displayed to users",
            },
            {
              name: "value",
              type: "string",
              title: "Option Value",
              description: "Value submitted with form",
            },
          ],
          preview: {
            select: {
              title: "label",
              subtitle: "value",
            },
          },
        },
      ],
      hidden: ({ parent }) => !["radio", "select"].includes(parent?.fieldType),
      validation: (Rule) =>
        Rule.custom((options, context) => {
          const fieldType = (context.parent as { fieldType?: string })
            ?.fieldType;
          if (
            fieldType &&
            ["radio", "select"].includes(fieldType) &&
            (!options || options.length === 0)
          ) {
            return "At least one option is required for radio and select fields";
          }
          return true;
        }),
    }),
  ],
  preview: {
    select: {
      label: "label",
      fieldType: "fieldType",
      required: "required",
      options: "options",
    },
    prepare({ label, fieldType, required, options }) {
      const optionCount = Array.isArray(options) ? options.length : 0;
      let subtitle = fieldType;
      if (["radio", "select"].includes(fieldType) && optionCount > 0) {
        subtitle += ` (${optionCount} option${optionCount !== 1 ? "s" : ""})`;
      }
      if (required) {
        subtitle += " (required)";
      }
      return {
        title: label,
        subtitle,
        media: "📝",
      };
    },
  },
});

import { defineField, defineType } from "sanity";
import { MinusIcon } from "@sanity/icons";

export const emailDividerType = defineType({
  name: "emailDivider",
  title: "Email Divider",
  type: "object",
  icon: MinusIcon,
  fields: [
    defineField({
      name: "spacing",
      type: "number",
      title: "Spacing",
      description: "Vertical spacing in pixels",
      initialValue: 20,
      validation: (Rule) => Rule.min(0).max(100),
    }),
    defineField({
      name: "showLine",
      type: "boolean",
      title: "Show Line",
      description: "Whether to show a visible divider line",
      initialValue: false,
    }),
    defineField({
      name: "lineColor",
      type: "string",
      title: "Line Color",
      description: "Hex color code (e.g., #cccccc)",
      initialValue: "#cccccc",
      hidden: ({ parent }) => !parent?.showLine,
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Email Divider",
        subtitle: "Spacing/Visual Break",
      };
    },
  },
});


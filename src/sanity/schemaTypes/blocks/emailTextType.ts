import { defineField, defineType } from "sanity";
import { TextIcon } from "@sanity/icons";

export const emailTextType = defineType({
  name: "emailText",
  title: "Email Text",
  type: "object",
  icon: TextIcon,
  fields: [
    defineField({
      name: "content",
      type: "text",
      title: "Content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "textAlign",
      type: "string",
      title: "Text Alignment",
      options: {
        list: [
          { title: "Left", value: "left" },
          { title: "Center", value: "center" },
          { title: "Right", value: "right" },
        ],
        layout: "radio",
      },
      initialValue: "left",
    }),
  ],
  preview: {
    select: {
      content: "content",
    },
    prepare({ content }) {
      return {
        title: content ? content.substring(0, 50) + (content.length > 50 ? "..." : "") : "Email Text",
        subtitle: "Text",
      };
    },
  },
});


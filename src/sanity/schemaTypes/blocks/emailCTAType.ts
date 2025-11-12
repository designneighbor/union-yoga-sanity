import { defineField, defineType } from "sanity";
import { LinkIcon } from "@sanity/icons";

export const emailCTAType = defineType({
  name: "emailCTA",
  title: "Email CTA",
  type: "object",
  icon: LinkIcon,
  fields: [
    defineField({
      name: "text",
      type: "string",
      title: "Button Text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "url",
      type: "url",
      title: "Button Link",
      validation: (Rule) =>
        Rule.uri({
          allowRelative: true,
          scheme: ["http", "https", "mailto", "tel", "/"],
        }),
    }),
    defineField({
      name: "backgroundColor",
      type: "string",
      title: "Button Background Color",
      description: "Hex color code (e.g., #007bff)",
      initialValue: "#007bff",
    }),
    defineField({
      name: "textColor",
      type: "string",
      title: "Button Text Color",
      description: "Hex color code (e.g., #ffffff)",
      initialValue: "#ffffff",
    }),
    defineField({
      name: "align",
      type: "string",
      title: "Alignment",
      options: {
        list: [
          { title: "Left", value: "left" },
          { title: "Center", value: "center" },
          { title: "Right", value: "right" },
        ],
        layout: "radio",
      },
      initialValue: "center",
    }),
  ],
  preview: {
    select: {
      text: "text",
      url: "url",
    },
    prepare({ text, url }) {
      return {
        title: text || "Email CTA",
        subtitle: url || "No link",
      };
    },
  },
});


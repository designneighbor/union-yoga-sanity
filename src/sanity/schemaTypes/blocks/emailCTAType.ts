import { defineField, defineType } from "sanity";
import { BlockContentIcon } from "@sanity/icons";

export const emailCTAType = defineType({
  name: "emailCTA",
  title: "Email CTA",
  type: "object",
  icon: BlockContentIcon,
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
        Rule.required().uri({
          allowRelative: true,
          scheme: ["http", "https", "mailto", "tel"],
        }),
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
        subtitle: url || "No URL",
        media: BlockContentIcon,
      };
    },
  },
});


import { defineField, defineType } from "sanity";
import { TextIcon } from "@sanity/icons";

export const heroType = defineType({
  name: "hero",
  type: "object",
  fields: [
    defineField({
      name: "title",
      type: "string",
    }),
    defineField({
      name: "text",
      type: "blockContent",
    }),
    defineField({
      name: "image",
      type: "image",
    }),
    defineField({
      name: "button",
      type: "object",
      fields: [
        {
          name: "text",
          type: "string",
          title: "Button Text",
        },
        {
          name: "url",
          type: "url",
          title: "Button Link",
          validation: (Rule) => Rule.uri({
            allowRelative: true, // This is the key - allows "/blog" style links
            scheme: ['http', 'https', 'mailto', 'tel', '/']
          })
        },
        {
          name: "newTab",
          type: "boolean",
          title: "Open in new tab",
          description: "Check this to open the link in a new browser tab",
          initialValue: false,
        },
      ],
    }),
  ],
  icon: TextIcon,
  preview: {
    select: {
      title: "title",
      media: "image",
    },
    prepare({ title, media }) {
      return {
        title,
        subtitle: "Hero",
        media: media ?? TextIcon,
      };
    },
  },
});
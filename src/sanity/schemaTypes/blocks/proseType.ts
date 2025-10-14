import { defineField, defineType } from "sanity";
import { TextIcon } from "@sanity/icons";

export const proseType = defineType({
  name: "prose",
  type: "object",
  fields: [
    defineField({
      name: "subhead",
      type: "string",
    }),
    defineField({
      name: "title",
      type: "string",
    }),
    defineField({
      name: "text",
      type: "blockContent",
    }),
    defineField({
      name: "sidebar",
      type: "object",
      title: "Sidebar Call-to-Action",
      fields: [
        {
          name: "heading",
          type: "string",
          title: "Heading",
        },
        {
          name: "text",
          type: "text",
          title: "Text",
        },
        {
          name: "buttonText",
          type: "string",
          title: "ButtonText",
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
        {
          name: 'image',
          type: 'image',
          title: 'Optional Image'
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
        subtitle: "Prose",
        media: media ?? TextIcon,
      };
    },
  },
});
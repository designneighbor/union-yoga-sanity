import { defineField, defineType } from "sanity";
import { BlockContentIcon } from "@sanity/icons";

export const callToActionType = defineType({
  name: "callToAction",
  title: "Call to Action",
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
            allowRelative: true,
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
    defineField({
      name: "image",
      type: "image",
      options: { hotspot: true },
    }),
  ],
  icon: BlockContentIcon,
  preview: {
    select: {
      title: "title",
      media: "image",
    },
    prepare({ title, media }) {
      return {
        title: title || "Call to Action",
        subtitle: "Call to Action",
        media: media ?? BlockContentIcon,
      };
    },
  },
});

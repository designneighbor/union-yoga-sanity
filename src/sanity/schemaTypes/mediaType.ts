import { defineField, defineType } from "sanity";
import { ImageIcon } from "@sanity/icons";

export const mediaType = defineType({
  name: "callToAction",
  title: "media Library",
  type: "object",
  fields: [
    defineField({
      name: "title",
      type: "string",
    }),
  ],
  icon: ImageIcon,
  preview: {
    select: {
      title: "title",
      media: "image",
    },
    prepare({ title, media }) {
      return {
        title: title || "Call to Action",
        subtitle: "Call to Action",
        media: media ?? ImageIcon,
      };
    },
  },
});

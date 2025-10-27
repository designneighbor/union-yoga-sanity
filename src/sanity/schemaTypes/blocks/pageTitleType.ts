import { defineField, defineType } from "sanity";
import { TextIcon } from "@sanity/icons";

export const pageTitleType = defineType({
  name: "pageTitle",
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
      type: "string",
    }),
    defineField({
      name: "image",
      type: "image",
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
        subtitle: "Page Title",
        media: media ?? TextIcon,
      };
    },
  },
});

import { defineField, defineType } from "sanity";
import { ImageIcon } from "@sanity/icons";

export const emailHeroType = defineType({
  name: "emailHero",
  title: "Email Hero",
  type: "object",
  icon: ImageIcon,
  fields: [
    defineField({
      name: "headline",
      type: "string",
      title: "Headline",
    }),
    defineField({
      name: "subheading",
      type: "text",
      title: "Subheading",
    }),
    defineField({
      name: "image",
      type: "image",
      title: "Image",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alt Text",
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "headline",
      media: "image",
    },
    prepare({ title, media }) {
      return {
        title: title || "Email Hero",
        subtitle: "Hero",
        media: media ?? ImageIcon,
      };
    },
  },
});


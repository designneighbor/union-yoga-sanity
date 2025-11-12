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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subheading",
      type: "text",
      title: "Subheading",
    }),
    defineField({
      name: "backgroundImage",
      type: "image",
      title: "Background Image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "backgroundColor",
      type: "string",
      title: "Background Color",
      description: "Hex color code (e.g., #ffffff)",
      initialValue: "#ffffff",
    }),
    defineField({
      name: "textColor",
      type: "string",
      title: "Text Color",
      description: "Hex color code (e.g., #000000)",
      initialValue: "#000000",
    }),
  ],
  preview: {
    select: {
      headline: "headline",
      media: "backgroundImage",
    },
    prepare({ headline, media }) {
      return {
        title: headline || "Email Hero",
        subtitle: "Hero",
        media: media ?? ImageIcon,
      };
    },
  },
});


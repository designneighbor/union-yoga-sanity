import { defineField, defineType } from "sanity";
import { UserIcon } from "@sanity/icons";

export const testimonialType = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "quote",
      type: "text",
      title: "Quote",
    }),
    defineField({
      name: "name",
      type: "string",
      title: "Name",
    }),
    defineField({
      name: "company",
      type: "string",
      title: "Company",
    }),
    defineField({
      name: "image",
      type: "image",
      title: "Photo",
      options: {
        hotspot: true,
      },
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "company",
      media: "image",
    },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: subtitle ? `${subtitle}` : "Testimonial",
        media,
      };
    },
  },
});

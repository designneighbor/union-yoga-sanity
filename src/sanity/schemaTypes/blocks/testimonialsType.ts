import { defineField, defineType } from "sanity";
import { CommentIcon } from "@sanity/icons";

export const testimonialsType = defineType({
  name: "testimonials",
  title: "Testimonials",
  type: "object",
  icon: CommentIcon,
  fields: [
    defineField({
      name: "testimonials",
      type: "array",
      title: "Testimonials",
      of: [
        {
          type: "reference",
          to: [{ type: "testimonial" }],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      testimonials: "testimonials",
    },
    prepare({ title, testimonials }) {
      const count = testimonials?.length || 0;
      return {
        title: title || "Testimonials",
        subtitle: `${count} testimonial${count !== 1 ? "s" : ""}`,
      };
    },
  },
});
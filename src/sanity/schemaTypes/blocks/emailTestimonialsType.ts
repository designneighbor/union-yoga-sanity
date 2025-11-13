import { defineField, defineType } from "sanity";
import { CommentIcon } from "@sanity/icons";

export const emailTestimonialsType = defineType({
  name: "emailTestimonials",
  title: "Email Testimonials",
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
      validation: (Rule) => Rule.min(1),
    }),
  ],
  preview: {
    select: {
      testimonials: "testimonials",
    },
    prepare({ testimonials }) {
      const count = testimonials?.length || 0;
      return {
        title: "Email Testimonials",
        subtitle: `${count} testimonial${count !== 1 ? "s" : ""}`,
        media: CommentIcon,
      };
    },
  },
});


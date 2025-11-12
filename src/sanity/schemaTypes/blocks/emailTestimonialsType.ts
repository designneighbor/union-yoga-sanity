import { defineField, defineType } from "sanity";
import { CommentIcon } from "@sanity/icons";

export const emailTestimonialsType = defineType({
  name: "emailTestimonials",
  title: "Email Testimonials",
  type: "object",
  icon: CommentIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Section Title",
      description: "Optional title for the testimonials section",
    }),
    defineField({
      name: "count",
      type: "number",
      title: "Number of Testimonials",
      description: "How many recent testimonials to include",
      initialValue: 3,
      validation: (Rule) => Rule.min(1).max(10),
    }),
    defineField({
      name: "testimonials",
      type: "array",
      title: "Specific Testimonials",
      description: "Optionally select specific testimonials, or leave empty to use recent ones",
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
      count: "count",
    },
    prepare({ title, count }) {
      return {
        title: title || "Email Testimonials",
        subtitle: `${count || 3} testimonial${count !== 1 ? "s" : ""}`,
      };
    },
  },
});


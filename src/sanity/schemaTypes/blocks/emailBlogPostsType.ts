import { defineField, defineType } from "sanity";
import { DocumentTextIcon } from "@sanity/icons";

export const emailBlogPostsType = defineType({
  name: "emailBlogPosts",
  title: "Email Blog Posts",
  type: "object",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Section Title",
      description: "Optional title for the blog posts section",
    }),
    defineField({
      name: "count",
      type: "number",
      title: "Number of Posts",
      description: "How many recent blog posts to include",
      initialValue: 3,
      validation: (Rule) => Rule.min(1).max(10),
    }),
    defineField({
      name: "posts",
      type: "array",
      title: "Specific Posts",
      description: "Optionally select specific posts, or leave empty to use recent ones",
      of: [
        {
          type: "reference",
          to: [{ type: "post" }],
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
        title: title || "Email Blog Posts",
        subtitle: `${count || 3} post${count !== 1 ? "s" : ""}`,
      };
    },
  },
});


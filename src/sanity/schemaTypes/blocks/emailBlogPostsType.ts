import { defineField, defineType } from "sanity";
import { DocumentTextIcon } from "@sanity/icons";

export const emailBlogPostsType = defineType({
  name: "emailBlogPosts",
  title: "Email Blog Posts",
  type: "object",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "blogPosts",
      type: "array",
      title: "Blog Posts",
      of: [
        {
          type: "reference",
          to: [{ type: "post" }],
        },
      ],
      validation: (Rule) => Rule.min(1),
    }),
  ],
  preview: {
    select: {
      blogPosts: "blogPosts",
    },
    prepare({ blogPosts }) {
      const count = blogPosts?.length || 0;
      return {
        title: "Email Blog Posts",
        subtitle: `${count} post${count !== 1 ? "s" : ""}`,
        media: DocumentTextIcon,
      };
    },
  },
});


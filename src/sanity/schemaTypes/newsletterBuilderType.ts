import { defineType, defineArrayMember } from "sanity";

export const newsletterBuilderType = defineType({
  name: "newsletterBuilder",
  type: "array",
  of: [
    defineArrayMember({ type: "emailHero" }),
    defineArrayMember({ type: "emailText" }),
    defineArrayMember({ type: "emailTestimonials" }),
    defineArrayMember({ type: "emailBlogPosts" }),
    defineArrayMember({ type: "emailCTA" }),
    defineArrayMember({ type: "emailDivider" }),
  ],
  options: {
    insertMenu: {
      views: [
        {
          name: "grid",
          previewImageUrl: (schemaType) => `/block-previews/${schemaType}.png`,
        },
      ],
    },
  },
});


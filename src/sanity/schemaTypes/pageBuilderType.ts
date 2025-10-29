import { defineType, defineArrayMember } from "sanity";
 
export const pageBuilderType = defineType({
  name: "pageBuilder",
  type: "array",
  of: [
    defineArrayMember({ type: "hero" }),
    defineArrayMember({ type: "splitImage" }),
    defineArrayMember({ type: "features" }),
    defineArrayMember({ type: "faqs" }),
    defineArrayMember({ type: "callToAction" }),
    defineArrayMember({ type: "pageTitle" }),
    defineArrayMember({ type: "prose" }),
    defineArrayMember({ type: "testimonials" }),
    defineArrayMember({ type: "formBlock" }),
    defineArrayMember({ type: "video" }),
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
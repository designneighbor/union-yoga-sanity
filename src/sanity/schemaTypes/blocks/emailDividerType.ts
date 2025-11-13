import { defineField, defineType } from "sanity";
import {ImageRemoveIcon} from '@sanity/icons'

export const emailDividerType = defineType({
  name: "emailDivider",
  title: "Email Divider",
  type: "object",
  icon: ImageRemoveIcon,
  fields: [
    defineField({
      name: "spacer",
      type: "string",
      title: "Spacer",
      hidden: true,
      initialValue: "divider",
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Email Divider",
        subtitle: "Divider",
        media: ImageRemoveIcon,
      };
    },
  },
});
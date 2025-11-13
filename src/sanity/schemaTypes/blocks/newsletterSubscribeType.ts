import { defineField, defineType } from "sanity";
import { EnvelopeIcon } from "@sanity/icons";

export const newsletterSubscribeType = defineType({
  name: "newsletterSubscribe",
  title: "Newsletter Subscribe",
  type: "object",
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: "spacer",
      type: "string",
      title: "Spacer",
      hidden: true,
      initialValue: "newsletterSubscribe",
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Newsletter Subscribe",
        subtitle: "Newsletter subscription form",
        media: EnvelopeIcon,
      };
    },
  },
});
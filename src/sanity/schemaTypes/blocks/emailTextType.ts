import { defineField, defineType } from "sanity";
import { TextIcon } from "@sanity/icons";

export const emailTextType = defineType({
  name: "emailText",
  title: "Email Text",
  type: "object",
  icon: TextIcon,
  fields: [
    defineField({
      name: "text",
      type: "blockContent",
      title: "Text",
    }),
  ],
  preview: {
    select: {
      text: "text",
    },
    prepare({ text }) {
      const firstBlock = Array.isArray(text) ? text[0] : null;
      const preview =
        firstBlock && firstBlock._type === "block"
          ? firstBlock.children
              ?.map((child: any) => child.text)
              .join("") || ""
          : "";
      return {
        title: preview || "Email Text",
        subtitle: "Text",
        media: TextIcon,
      };
    },
  },
});


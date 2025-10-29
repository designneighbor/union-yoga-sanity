import { defineField, defineType } from "sanity";
import { ControlsIcon } from "@sanity/icons";

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  icon: ControlsIcon,
  fields: [
    defineField({
      name: "homePage",
      type: "reference",
      to: [{ type: "page" }],
    }),
    defineField({
      name: "navigation",
      title: "Navigation Menu",
      type: "array",
      description: "Drag to reorder navigation links",
      of: [
        {
          type: "object",
          name: "navItem",
          title: "Navigation Item",
          fields: [
            {
              name: "title",
              type: "string",
              title: "Menu Text",
              description: "Text that appears in navigation",
              validation: (Rule) => Rule.required().max(30),
            },
            {
              name: "page",
              type: "reference",
              title: "Link to Page",
              to: [{ type: "page" }],
              description: "Select a page to link to",
            },
            {
              name: "externalUrl",
              type: "string",
              title: "External URL (Optional)",
              description: "Or link to external site (overrides page link)",
              validation: (Rule) =>
                Rule.uri({
                  allowRelative: true,
                  scheme: ["http", "https","/"],
                }),
            },
            {
              name: "openInNewTab",
              type: "boolean",
              title: "Open in new tab",
              initialValue: false,
            },
          ],
          preview: {
            select: {
              title: "title",
              pageTitle: "page.title",
              externalUrl: "externalUrl",
            },
            prepare({ title, pageTitle, externalUrl }) {
              return {
                title: title || "Untitled",
                subtitle: externalUrl
                  ? `External: ${externalUrl}`
                  : pageTitle
                  ? `Page: ${pageTitle}`
                  : "No link set",
              };
            },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Site Settings",
      };
    },
  },
});
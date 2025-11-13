import { defineField, defineType } from "sanity";
import { EnvelopeIcon } from "@sanity/icons";

export const newsletterType = defineType({
  name: "newsletter",
  title: "Newsletter",
  type: "document",
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "content",
      type: "newsletterBuilder",
      title: "Content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "status",
      type: "string",
      title: "Status",
      options: {
        list: [
          { title: "Draft", value: "draft" },
          { title: "Scheduled", value: "scheduled" },
          { title: "Sent", value: "sent" },
        ],
        layout: "radio",
      },
      initialValue: "draft",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "scheduledSendTime",
      type: "datetime",
      title: "Scheduled Send Time",
      description: "When to send this newsletter (leave empty for immediate send)",
      hidden: ({ document }) => document?.status !== "scheduled",
    }),
    defineField({
      name: "sentAt",
      type: "datetime",
      title: "Sent At",
      readOnly: true,
      hidden: ({ document }) => document?.status !== "sent",
    }),
    defineField({
      name: "stats",
      type: "object",
      title: "Statistics",
      readOnly: true,
      fields: [
        defineField({
          name: "sentCount",
          type: "number",
          title: "Sent Count",
          initialValue: 0,
        }),
        defineField({
          name: "openCount",
          type: "number",
          title: "Open Count",
          initialValue: 0,
        }),
        defineField({
          name: "clickCount",
          type: "number",
          title: "Click Count",
          initialValue: 0,
        }),
        defineField({
          name: "deliveryDate",
          type: "datetime",
          title: "Delivery Date",
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      status: "status",
      sentAt: "sentAt",
    },
    prepare({ title, status, sentAt }) {
      return {
        title: title || "Untitled Newsletter",
        subtitle: status === "sent" && sentAt
          ? `Sent ${new Date(sentAt).toLocaleDateString()}`
          : status === "scheduled"
          ? "Scheduled"
          : "Draft",
      };
    },
  },
});


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
      type: "array",
      title: "Content Blocks",
      of: [
        { type: "emailHero" },
        { type: "emailText" },
        { type: "emailTestimonials" },
        { type: "emailBlogPosts" },
        { type: "emailCTA" },
        { type: "emailDivider" },
      ],
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
      description: "Optional: Schedule this newsletter to be sent at a specific time",
      hidden: ({ document }) => document?.status !== "scheduled",
    }),
    defineField({
      name: "platform",
      type: "string",
      title: "Email Platform",
      options: {
        list: [
          { title: "Resend", value: "resend" },
          { title: "Mailchimp", value: "mailchimp" },
          { title: "Kit", value: "kit" },
        ],
        layout: "radio",
      },
      initialValue: "resend",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "sentCount",
      type: "number",
      title: "Sent Count",
      description: "Number of subscribers this newsletter was sent to",
      readOnly: true,
      initialValue: 0,
    }),
    defineField({
      name: "sentAt",
      type: "datetime",
      title: "Sent At",
      description: "When this newsletter was sent",
      readOnly: true,
    }),
    defineField({
      name: "deliveryStats",
      type: "object",
      title: "Delivery Statistics",
      readOnly: true,
      fields: [
        defineField({
          name: "opens",
          type: "number",
          title: "Opens",
          initialValue: 0,
        }),
        defineField({
          name: "clicks",
          type: "number",
          title: "Clicks",
          initialValue: 0,
        }),
        defineField({
          name: "bounces",
          type: "number",
          title: "Bounces",
          initialValue: 0,
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      status: "status",
      sentCount: "sentCount",
    },
    prepare({ title, status, sentCount }) {
      return {
        title: title || "Untitled Newsletter",
        subtitle: `${status || "draft"}${sentCount ? ` • Sent to ${sentCount}` : ""}`,
      };
    },
  },
});


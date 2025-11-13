import { defineField, defineType } from "sanity";
import { UserIcon } from "@sanity/icons";

export const subscriberType = defineType({
  name: "subscriber",
  title: "Subscriber",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "email",
      type: "string",
      title: "Email",
      validation: (Rule) =>
        Rule.required()
          .email()
          .custom((email, context) => {
            // Note: Async validation removed for schema extraction compatibility
            // Email uniqueness should be enforced at the API level
            return true;
          }),
    }),
    defineField({
      name: "subscribed",
      type: "boolean",
      title: "Subscribed",
      initialValue: false,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subscribeDate",
      type: "datetime",
      title: "Subscribe Date",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "confirmedAt",
      type: "datetime",
      title: "Confirmed At",
      description: "When the subscriber confirmed their subscription (double opt-in)",
      readOnly: true,
    }),
    defineField({
      name: "confirmationToken",
      type: "string",
      title: "Confirmation Token",
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: "lastEmailSent",
      type: "reference",
      title: "Last Email Sent",
      to: [{ type: "newsletter" }],
      readOnly: true,
    }),
    defineField({
      name: "unsubscribeReason",
      type: "string",
      title: "Unsubscribe Reason",
      options: {
        list: [
          { title: "Too frequent", value: "too_frequent" },
          { title: "Not relevant", value: "not_relevant" },
          { title: "Never subscribed", value: "never_subscribed" },
          { title: "Other", value: "other" },
        ],
      },
    }),
    defineField({
      name: "tags",
      type: "array",
      title: "Tags",
      of: [{ type: "string" }],
      description: "Tags for segmenting subscribers",
    }),
    defineField({
      name: "unsubscribedAt",
      type: "datetime",
      title: "Unsubscribed At",
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: "email",
      subscribed: "subscribed",
      confirmedAt: "confirmedAt",
    },
    prepare({ title, subscribed, confirmedAt }) {
      return {
        title: title || "No email",
        subtitle: subscribed
          ? confirmedAt
            ? `Confirmed ${new Date(confirmedAt).toLocaleDateString()}`
            : "Pending confirmation"
          : "Unsubscribed",
      };
    },
  },
});


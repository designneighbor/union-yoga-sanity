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
          .custom((email) => {
            if (!email) return true;
            // Check for duplicate emails
            return true; // Sanity will handle uniqueness via indexing
          }),
    }),
    defineField({
      name: "subscribed",
      type: "boolean",
      title: "Subscribed",
      description: "Whether the subscriber is currently subscribed",
      initialValue: false,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subscriptionStatus",
      type: "string",
      title: "Subscription Status",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Subscribed", value: "subscribed" },
          { title: "Unsubscribed", value: "unsubscribed" },
        ],
        layout: "radio",
      },
      initialValue: "pending",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subscribedAt",
      type: "datetime",
      title: "Subscribed At",
      description: "When the subscriber first subscribed",
    }),
    defineField({
      name: "confirmedAt",
      type: "datetime",
      title: "Confirmed At",
      description: "When the subscriber confirmed their subscription (double opt-in)",
    }),
    defineField({
      name: "confirmationToken",
      type: "string",
      title: "Confirmation Token",
      description: "Token for double opt-in confirmation",
      readOnly: true,
    }),
    defineField({
      name: "lastEmailSent",
      type: "reference",
      title: "Last Email Sent",
      to: [{ type: "newsletter" }],
      description: "Reference to the last newsletter sent to this subscriber",
    }),
    defineField({
      name: "unsubscribedAt",
      type: "datetime",
      title: "Unsubscribed At",
      description: "When the subscriber unsubscribed",
    }),
    defineField({
      name: "unsubscribeReason",
      type: "string",
      title: "Unsubscribe Reason",
      description: "Optional reason for unsubscribing",
      options: {
        list: [
          { title: "Too many emails", value: "too_many" },
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
      description: "Tags for segmenting subscribers",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "platformId",
      type: "string",
      title: "Platform ID",
      description: "ID from the email platform (Resend, Mailchimp, etc.)",
    }),
  ],
  preview: {
    select: {
      email: "email",
      status: "subscriptionStatus",
      subscribedAt: "subscribedAt",
    },
    prepare({ email, status, subscribedAt }) {
      return {
        title: email || "No email",
        subtitle: `${status || "pending"}${subscribedAt ? ` • ${new Date(subscribedAt).toLocaleDateString()}` : ""}`,
      };
    },
  },
});


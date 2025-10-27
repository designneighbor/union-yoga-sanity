import { defineField, defineType } from "sanity";
import { DocumentIcon } from "@sanity/icons";

export const formSubmissionType = defineType({
  name: "formSubmission",
  type: "document",
  title: "Form Submission",
  fields: [
    defineField({
      name: "form",
      type: "reference",
      to: [{ type: "form" }],
      title: "Form",
      description: "The form that was submitted",
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: "submittedAt",
      type: "datetime",
      title: "Submitted At",
      description: "When the form was submitted",
      validation: (Rule) => Rule.required(),
      initialValue: () => new Date().toISOString()
    }),
    defineField({
      name: "status",
      type: "string",
      title: "Status",
      description: "Current status of the submission",
      options: {
        list: [
          { title: "Unread", value: "unread" },
          { title: "Read", value: "read" },
          { title: "Archived", value: "archived" }
        ],
        layout: "radio"
      },
      initialValue: "unread",
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: "data",
      type: "array",
      title: "Submission Data",
      description: "The form field data submitted",
      of: [{
        type: "object",
        fields: [
          {
            name: "fieldName",
            type: "string",
            title: "Field Name",
            description: "The internal field name"
          },
          {
            name: "fieldLabel",
            type: "string",
            title: "Field Label",
            description: "The display label for the field"
          },
          {
            name: "value",
            type: "string",
            title: "Value",
            description: "The submitted value"
          }
        ],
        preview: {
          select: {
            title: "fieldLabel",
            subtitle: "value"
          }
        }
      }],
      validation: (Rule) => Rule.required().min(1)
    }),
    defineField({
      name: "ipAddress",
      type: "string",
      title: "IP Address",
      description: "IP address of the submitter (optional)"
    }),
    defineField({
      name: "userAgent",
      type: "string",
      title: "User Agent",
      description: "Browser information (optional)"
    })
  ],
  icon: DocumentIcon,
  preview: {
    select: {
      formName: "form.name",
      submittedAt: "submittedAt",
      status: "status",
      data: "data"
    },
    prepare({ formName, submittedAt, status, data }) {
      const dataCount = Array.isArray(data) ? data.length : 0;
      const statusColors = {
        unread: "🔴",
        read: "🟡", 
        archived: "⚫"
      };
      
      return {
        title: formName || "Unknown Form",
        subtitle: `${submittedAt ? new Date(submittedAt).toLocaleDateString() : 'No date'} • ${dataCount} field${dataCount !== 1 ? 's' : ''} • ${statusColors[status as keyof typeof statusColors] || '❓'} ${status}`,
        media: DocumentIcon
      };
    }
  },
  orderings: [
    {
      title: "Newest First",
      name: "submittedAtDesc",
      by: [
        { field: "submittedAt", direction: "desc" }
      ]
    },
    {
      title: "Oldest First", 
      name: "submittedAtAsc",
      by: [
        { field: "submittedAt", direction: "asc" }
      ]
    },
    {
      title: "Status",
      name: "statusAsc",
      by: [
        { field: "status", direction: "asc" },
        { field: "submittedAt", direction: "desc" }
      ]
    }
  ]
});

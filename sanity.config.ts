"use client";

/**
 * This configuration is used to for the Sanity Studio that's mounted on the `/app/studio/[[...tool]]/page.tsx` route
 */

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool } from "sanity/presentation";
import { resolve } from "@/sanity/presentation/resolve";

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import { apiVersion, dataset, projectId } from "./src/sanity/env";
import { schema } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";
import { exportSubmissionsAction } from "./src/sanity/actions/exportSubmissions";
import { sendNewsletterAction } from "./src/sanity/actions/sendNewsletter";
import { testNewsletterAction } from "./src/sanity/actions/testNewsletter";
import { viewNewsletterPreviewAction } from "./src/sanity/actions/viewNewsletterPreview";
import { NewsletterPreview } from "./src/sanity/components/NewsletterPreview";

// Get API version - use env directly since this is a client component
const SANITY_API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01';

export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  apiVersion: SANITY_API_VERSION,
  // Add and edit the content schema in the './sanity/schemaTypes' folder
  schema,
  plugins: [
    structureTool({ structure }),
    // Vision is for querying with GROQ from inside the Studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({ defaultApiVersion: SANITY_API_VERSION }),
    presentationTool({
      resolve,
      previewUrl: {
        previewMode: {
          enable: "/api/draft-mode/enable",
        },
      },
    }),
  ],
  document: {
    newDocumentOptions: (prev) => prev.filter((item) => item.templateId !== "siteSettings"),
    actions: (prev, { schemaType }) => {
      if (schemaType === 'formSubmission') {
        return [...prev, exportSubmissionsAction]
      }
      if (schemaType === 'newsletter') {
        return [...prev, viewNewsletterPreviewAction, testNewsletterAction, sendNewsletterAction]
      }
      return prev
    },
    views: (prev, { schemaType }) => {
      if (schemaType === 'newsletter') {
        return [
          ...prev,
          {
            id: 'preview',
            title: 'Preview',
            component: NewsletterPreview,
            icon: () => '👁️',
          },
        ]
      }
      return prev
    },
  },
});
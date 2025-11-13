import { DocumentActionComponent } from "sanity";
import { createClient } from "next-sanity";
import {ClockIcon} from '@sanity/icons'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2023-05-03",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

export const scheduleNewsletterAction: DocumentActionComponent = (props) => {
  const { id, onComplete } = props;

  return {
    label: "Schedule Send",
    icon: ClockIcon,
    onHandle: async () => {
      try {
        // Fetch newsletter to check content
        const newsletter = await client.getDocument(id);

        if (!newsletter || newsletter._type !== "newsletter") {
          alert("This action is only available for newsletters");
          return;
        }

        if (!newsletter.content || newsletter.content.length === 0) {
          alert("Newsletter has no content blocks");
          return;
        }

        // Prompt for scheduled send time
        const dateTimeInput = window.prompt(
          `Enter the date and time to send "${newsletter.title}" (YYYY-MM-DDTHH:mm format, e.g., 2024-12-25T10:00):`
        );

        if (!dateTimeInput) {
          return; // User cancelled
        }

        // Validate and parse datetime
        const scheduledTime = new Date(dateTimeInput);
        if (isNaN(scheduledTime.getTime())) {
          alert("Invalid date/time format. Please use YYYY-MM-DDTHH:mm format");
          return;
        }

        if (scheduledTime <= new Date()) {
          alert("Scheduled time must be in the future");
          return;
        }

        // Update newsletter status and scheduled time
        await client
          .patch(id)
          .set({
            status: "scheduled",
            scheduledSendTime: scheduledTime.toISOString(),
          })
          .commit();

        alert(
          `Newsletter scheduled to send on ${scheduledTime.toLocaleString()}`
        );

        onComplete();
      } catch (error: any) {
        console.error("Schedule newsletter error:", error);
        alert(`Error scheduling newsletter: ${error.message}`);
      }
    },
  };
};


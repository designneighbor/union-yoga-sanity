import { DocumentActionComponent } from "sanity";
import { createClient } from "next-sanity";
import {EnvelopeIcon} from '@sanity/icons'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2023-05-03",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

export const sendNewsletterAction: DocumentActionComponent = (props) => {
  const { id, onComplete } = props;

  return {
    label: "Send Newsletter",
    icon: EnvelopeIcon,
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

        if (newsletter.status === "sent") {
          const confirmed = window.confirm(
            "This newsletter has already been sent. Do you want to send it again?"
          );
          if (!confirmed) {
            return;
          }
        }

        // Confirm send
        const confirmed = window.confirm(
          `Are you sure you want to send "${newsletter.title}" to all active subscribers?`
        );

        if (!confirmed) {
          return;
        }

        // Call the send API endpoint
        const siteUrl =
          process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
        const response = await fetch(`${siteUrl}/api/newsletters/send`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            newsletterId: id,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          alert(result.error || "Failed to send newsletter");
          return;
        }

        alert(
          `Newsletter sent successfully!\n\nSent: ${result.sentCount}\nFailed: ${result.failedCount}\nTotal: ${result.totalSubscribers}`
        );

        // Refresh the document
        onComplete();
      } catch (error: any) {
        console.error("Send newsletter error:", error);
        alert(`Error sending newsletter: ${error.message}`);
      }
    },
  };
};


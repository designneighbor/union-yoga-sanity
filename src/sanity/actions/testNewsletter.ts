import { DocumentActionComponent } from "sanity";
import { createClient } from "next-sanity";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2023-05-03",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

export const testNewsletterAction: DocumentActionComponent = (props) => {
  const { id } = props;

  return {
    label: "Send Test Email",
    icon: () => "🧪",
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

        // Prompt for test email address
        const testEmail = window.prompt(
          `Enter the email address to send a test of "${newsletter.title}" to:`
        );

        if (!testEmail) {
          return; // User cancelled
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(testEmail)) {
          alert("Please enter a valid email address");
          return;
        }

        // Call the test email API endpoint
        const siteUrl =
          process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
        const response = await fetch(`${siteUrl}/api/newsletters/test`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            newsletterId: id,
            testEmail: testEmail.trim(),
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          alert(result.error || "Failed to send test email");
          return;
        }

        alert(`Test email sent successfully to ${testEmail}!`);
        // Note: We don't call onComplete() to avoid marking the document as changed
      } catch (error: any) {
        console.error("Test newsletter error:", error);
        alert(`Error sending test email: ${error.message}`);
      }
    },
  };
};



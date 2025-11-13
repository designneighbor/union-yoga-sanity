import type { NewsletterProvider } from "./types";
import { ResendProvider } from "./resendProvider";

export type ProviderPlatform = "resend" | "mailchimp" | "kit";

export function createProvider(
  platform: ProviderPlatform = "resend"
): NewsletterProvider {
  switch (platform) {
    case "resend":
      const apiKey = process.env.RESEND_API_KEY;
      if (!apiKey) {
        throw new Error("RESEND_API_KEY environment variable is not set");
      }
      return new ResendProvider(apiKey);
    case "mailchimp":
      // Future implementation
      throw new Error("Mailchimp provider not yet implemented");
    case "kit":
      // Future implementation
      throw new Error("Kit provider not yet implemented");
    default:
      throw new Error(`Unknown provider platform: ${platform}`);
  }
}


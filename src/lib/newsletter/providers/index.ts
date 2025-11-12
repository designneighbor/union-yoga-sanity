import { NewsletterProvider } from "./base";
import { ResendProvider } from "./resend";

export type Platform = "resend" | "mailchimp" | "kit";

export function createProvider(platform: Platform): NewsletterProvider {
  switch (platform) {
    case "resend": {
      const apiKey = process.env.RESEND_API_KEY;
      if (!apiKey) {
        throw new Error("RESEND_API_KEY environment variable is not set");
      }
      return new ResendProvider(apiKey);
    }
    case "mailchimp":
      // TODO: Implement Mailchimp provider
      throw new Error("Mailchimp provider not yet implemented");
    case "kit":
      // TODO: Implement Kit provider
      throw new Error("Kit provider not yet implemented");
    default:
      throw new Error(`Unknown platform: ${platform}`);
  }
}

export { NewsletterProvider } from "./base";
export { ResendProvider } from "./resend";


import { Resend } from "resend";
import {
  NewsletterProvider,
  SendEmailResult,
  SubscriberMetadata,
  ProviderSubscriber,
} from "./base";

export class ResendProvider extends NewsletterProvider {
  private resend: Resend;
  private apiKey: string;

  constructor(apiKey: string) {
    super();
    if (!apiKey) {
      throw new Error("Resend API key is required");
    }
    this.apiKey = apiKey;
    this.resend = new Resend(apiKey);
  }

  async sendEmail(
    subject: string,
    html: string,
    recipients: string[],
    fromEmail: string
  ): Promise<SendEmailResult> {
    try {
      const { data, error } = await this.resend.emails.send({
        from: fromEmail,
        to: recipients,
        subject,
        html,
      });

      if (error) {
        return {
          success: false,
          error: error.message || "Failed to send email",
        };
      }

      return {
        success: true,
        messageId: data?.id,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Unknown error occurred",
      };
    }
  }

  async addSubscriber(
    email: string,
    metadata?: SubscriberMetadata
  ): Promise<{ success: boolean; platformId?: string; error?: string }> {
    try {
      // Resend doesn't have a built-in contacts API in the same way as Mailchimp
      // For now, we'll just return success since the email sending will handle the recipient list
      // In the future, you could integrate with Resend's Contacts API if available
      return {
        success: true,
        platformId: email, // Use email as platform ID for Resend
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to add subscriber",
      };
    }
  }

  async removeSubscriber(
    email: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Resend doesn't have a built-in unsubscribe API endpoint
      // Unsubscribes are typically handled via unsubscribe links in emails
      // For now, we'll return success
      return {
        success: true,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to remove subscriber",
      };
    }
  }

  async getSubscriberStatus(
    email: string
  ): Promise<ProviderSubscriber | null> {
    try {
      // Resend doesn't provide a direct way to check subscriber status
      // This would need to be tracked in Sanity
      // Return null to indicate status should be checked in Sanity
      return null;
    } catch (error) {
      return null;
    }
  }
}


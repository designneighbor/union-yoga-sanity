import { Resend } from "resend";
import type {
  NewsletterProvider,
  SendEmailResult,
  SubscribeResult,
  UnsubscribeResult,
  EmailStats,
} from "./types";

export class ResendProvider implements NewsletterProvider {
  private resend: Resend;
  private apiKey: string;

  constructor(apiKey: string) {
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
    from: string
  ): Promise<SendEmailResult> {
    try {
      const { data, error } = await this.resend.emails.send({
        from,
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

  async subscribe(email: string, tags?: string[]): Promise<SubscribeResult> {
    try {
      // Resend doesn't have a direct subscribe API, but we can add contacts
      // For now, we'll just return success since subscription is handled in Sanity
      // In the future, you could integrate with Resend's contacts API
      return {
        success: true,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to subscribe",
      };
    }
  }

  async unsubscribe(email: string): Promise<UnsubscribeResult> {
    try {
      // Resend doesn't have a direct unsubscribe API
      // Unsubscription is handled via unsubscribe links in emails
      // For now, we'll just return success since unsubscription is handled in Sanity
      return {
        success: true,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to unsubscribe",
      };
    }
  }

  async getStats(messageId: string): Promise<EmailStats> {
    try {
      // Resend API for getting email stats
      // Note: This would require Resend's API for retrieving email events
      // For now, we'll return empty stats and rely on webhooks
      return {};
    } catch (error: any) {
      console.error("Error getting stats:", error);
      return {};
    }
  }
}


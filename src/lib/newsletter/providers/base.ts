export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface SubscriberMetadata {
  tags?: string[];
  [key: string]: any;
}

export interface ProviderSubscriber {
  email: string;
  status: "subscribed" | "unsubscribed" | "pending";
  platformId?: string;
}

export abstract class NewsletterProvider {
  abstract sendEmail(
    subject: string,
    html: string,
    recipients: string[],
    fromEmail: string
  ): Promise<SendEmailResult>;

  abstract addSubscriber(
    email: string,
    metadata?: SubscriberMetadata
  ): Promise<{ success: boolean; platformId?: string; error?: string }>;

  abstract removeSubscriber(email: string): Promise<{ success: boolean; error?: string }>;

  abstract getSubscriberStatus(
    email: string
  ): Promise<ProviderSubscriber | null>;
}


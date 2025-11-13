export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface SubscribeResult {
  success: boolean;
  error?: string;
}

export interface UnsubscribeResult {
  success: boolean;
  error?: string;
}

export interface EmailStats {
  sent?: number;
  delivered?: number;
  opened?: number;
  clicked?: number;
  bounced?: number;
  complained?: number;
}

export interface NewsletterProvider {
  sendEmail(
    subject: string,
    html: string,
    recipients: string[],
    from: string
  ): Promise<SendEmailResult>;

  subscribe(email: string, tags?: string[]): Promise<SubscribeResult>;

  unsubscribe(email: string): Promise<UnsubscribeResult>;

  getStats(messageId: string): Promise<EmailStats>;
}


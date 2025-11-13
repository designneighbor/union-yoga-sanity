import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Link,
  Hr,
} from "@react-email/components";
import * as React from "react";

interface EmailContainerProps {
  children: React.ReactNode;
  preview?: string;
  siteUrl: string;
  unsubscribeToken?: string;
  subscriberEmail?: string;
}

export function EmailContainer({
  children,
  preview,
  siteUrl,
  unsubscribeToken,
  subscriberEmail,
}: EmailContainerProps) {
  const unsubscribeUrl = unsubscribeToken
    ? `${siteUrl}/api/newsletters/unsubscribe?token=${unsubscribeToken}`
    : "#";

  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          {preview && (
            <Text style={previewText}>{preview}</Text>
          )}
          {children}
          <Hr style={hr} />
          <Section style={footer}>
            <Text style={footerText}>
              You're receiving this email because you subscribed to our
              newsletter.
            </Text>
            {subscriberEmail && (
              <Text style={footerText}>
                <Link href={unsubscribeUrl} style={unsubscribeLink}>
                  Unsubscribe
                </Link>
              </Text>
            )}
            <Text style={footerText}>
              © {new Date().getFullYear()} All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const previewText = {
  fontSize: "16px",
  lineHeight: "26px",
  color: "#8898aa",
  margin: "0 0 40px",
  textAlign: "center" as const,
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const footer = {
  padding: "0 48px",
};

const footerText = {
  fontSize: "12px",
  lineHeight: "16px",
  color: "#8898aa",
  textAlign: "center" as const,
  margin: "8px 0",
};

const unsubscribeLink = {
  color: "#556cd6",
  textDecoration: "underline",
};


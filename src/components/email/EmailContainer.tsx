import {
  Html,
  Head,
  Body,
  Container,
  Preview,
  Section,
  Text,
  Link,
} from "@react-email/components";
import * as React from "react";

interface EmailContainerProps {
  children: React.ReactNode;
  preview?: string;
  unsubscribeUrl?: string;
  siteUrl?: string;
}

export function EmailContainer({
  children,
  preview,
  unsubscribeUrl,
  siteUrl,
}: EmailContainerProps) {
  const defaultUnsubscribeUrl = unsubscribeUrl || `${siteUrl || "https://example.com"}/api/newsletters/unsubscribe`;

  return (
    <Html>
      <Head />
      {preview && <Preview>{preview}</Preview>}
      <Body style={main}>
        <Container style={container}>
          {children}
          <Section style={footerStyle}>
            <Text style={footerText}>
              You're receiving this email because you subscribed to our newsletter.
            </Text>
            <Link href={defaultUnsubscribeUrl} style={unsubscribeLink}>
              Unsubscribe
            </Link>
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
  maxWidth: "600px",
};

const footerStyle = {
  marginTop: "40px",
  padding: "20px",
  textAlign: "center" as const,
  borderTop: "1px solid #e0e0e0",
};

const footerText = {
  fontSize: "12px",
  color: "#666666",
  margin: "0 0 8px 0",
};

const unsubscribeLink = {
  fontSize: "12px",
  color: "#007bff",
  textDecoration: "underline",
};


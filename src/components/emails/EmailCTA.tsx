import { Section, Link } from "@react-email/components";
import * as React from "react";

interface EmailCTAProps {
  text: string;
  url: string;
}

export function EmailCTA({ text, url }: EmailCTAProps) {
  return (
    <Section style={ctaSection}>
      <Link href={url} style={ctaButton}>
        {text}
      </Link>
    </Section>
  );
}

const ctaSection = {
  padding: "32px 48px",
  textAlign: "center" as const,
};

const ctaButton = {
  backgroundColor: "#556cd6",
  borderRadius: "6px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 32px",
  lineHeight: "24px",
};


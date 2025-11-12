import { Section, Button } from "@react-email/components";
import * as React from "react";

interface EmailCTAProps {
  text?: string;
  url?: string;
  backgroundColor?: string;
  textColor?: string;
  align?: "left" | "center" | "right";
}

export function EmailCTA({
  text,
  url,
  backgroundColor = "#007bff",
  textColor = "#ffffff",
  align = "center",
}: EmailCTAProps) {
  if (!text || !url) return null;

  const alignMap = {
    left: "flex-start",
    center: "center",
    right: "flex-end",
  };

  return (
    <Section style={{ ...sectionStyle, textAlign: align }}>
      <Button
        href={url}
        style={{
          ...buttonStyle,
          backgroundColor,
          color: textColor,
        }}
      >
        {text}
      </Button>
    </Section>
  );
}

const sectionStyle = {
  width: "100%",
  padding: "0 20px",
  marginBottom: "20px",
  textAlign: "center" as const,
};

const buttonStyle = {
  display: "inline-block",
  padding: "12px 24px",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  borderRadius: "4px",
  border: "none",
  cursor: "pointer",
};


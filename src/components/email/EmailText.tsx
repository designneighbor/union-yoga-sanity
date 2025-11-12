import { Section, Text } from "@react-email/components";
import * as React from "react";

interface EmailTextProps {
  content?: string;
  textAlign?: "left" | "center" | "right";
}

export function EmailText({
  content,
  textAlign = "left",
}: EmailTextProps) {
  if (!content) return null;

  return (
    <Section style={sectionStyle}>
      <Text style={{ ...textStyle, textAlign }}>{content}</Text>
    </Section>
  );
}

const sectionStyle = {
  width: "100%",
  padding: "0 20px",
  marginBottom: "20px",
};

const textStyle = {
  fontSize: "16px",
  lineHeight: "1.6",
  color: "#333333",
  margin: "0",
};


import { Section, Hr } from "@react-email/components";
import * as React from "react";

interface EmailDividerProps {
  spacing?: number;
  showLine?: boolean;
  lineColor?: string;
}

export function EmailDivider({
  spacing = 20,
  showLine = false,
  lineColor = "#cccccc",
}: EmailDividerProps) {
  return (
    <Section style={{ ...sectionStyle, paddingTop: `${spacing}px`, paddingBottom: `${spacing}px` }}>
      {showLine && (
        <Hr
          style={{
            borderColor: lineColor,
            borderWidth: "1px",
            borderStyle: "solid",
            margin: "0",
          }}
        />
      )}
    </Section>
  );
}

const sectionStyle = {
  width: "100%",
  padding: "0 20px",
};


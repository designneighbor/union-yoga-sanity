import { Section, Hr } from "@react-email/components";
import * as React from "react";

export function EmailDivider() {
  return (
    <Section style={dividerSection}>
      <Hr style={divider} />
    </Section>
  );
}

const dividerSection = {
  padding: "24px 48px",
};

const divider = {
  borderColor: "#e2e8f0",
  borderWidth: "1px",
  margin: "0",
};


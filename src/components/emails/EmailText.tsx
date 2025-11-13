import { Section, Text } from "@react-email/components";
import * as React from "react";

interface EmailTextProps {
  text?: Array<{
    _type?: string;
    _key?: string;
    children?: Array<{
      _type?: string;
      text?: string;
      marks?: string[];
    }>;
    style?: string;
    markDefs?: Array<{
      _type?: string;
      _key?: string;
      href?: string;
    }>;
  }>;
}

export function EmailText({ text }: EmailTextProps) {
  if (!text || !Array.isArray(text)) {
    return null;
  }

  const renderBlock = (block: any, index: number) => {
    if (block._type !== "block") {
      return null;
    }

    const style = block.style || "normal";
    const children = block.children || [];

    const content = children
      .map((child: any) => {
        let text = child.text || "";
        if (child.marks && Array.isArray(child.marks)) {
          child.marks.forEach((mark: string) => {
            if (mark === "strong") {
              text = `<strong>${text}</strong>`;
            } else if (mark === "em") {
              text = `<em>${text}</em>`;
            }
          });
        }
        return text;
      })
      .join("");

    if (!content) return null;

    const textStyles: Record<string, React.CSSProperties> = {
      normal: {
        fontSize: "16px",
        lineHeight: "26px",
        color: "#1a202c",
        margin: "0 0 16px",
      },
      h1: {
        fontSize: "32px",
        fontWeight: "700",
        lineHeight: "40px",
        color: "#1a202c",
        margin: "24px 0 16px",
      },
      h2: {
        fontSize: "24px",
        fontWeight: "600",
        lineHeight: "32px",
        color: "#1a202c",
        margin: "24px 0 16px",
      },
      h3: {
        fontSize: "20px",
        fontWeight: "600",
        lineHeight: "28px",
        color: "#1a202c",
        margin: "20px 0 12px",
      },
      h4: {
        fontSize: "18px",
        fontWeight: "600",
        lineHeight: "26px",
        color: "#1a202c",
        margin: "16px 0 12px",
      },
      blockquote: {
        fontSize: "16px",
        lineHeight: "26px",
        color: "#4a5568",
        margin: "16px 0",
        paddingLeft: "16px",
        borderLeft: "4px solid #e2e8f0",
      },
    };

    const Tag = style === "blockquote" ? "blockquote" : "p";

    return (
      <Text
        key={block._key || index}
        style={textStyles[style] || textStyles.normal}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  };

  return (
    <Section style={textSection}>
      {text.map((block, index) => renderBlock(block, index))}
    </Section>
  );
}

const textSection = {
  padding: "0 48px 24px",
};


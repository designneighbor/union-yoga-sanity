import {
  Section,
  Text,
  Img,
} from "@react-email/components";
import * as React from "react";
import { urlFor } from "@/sanity/lib/image";

interface EmailHeroProps {
  headline?: string;
  subheading?: string;
  backgroundImage?: {
    asset?: {
      _ref?: string;
      _type?: string;
    };
    alt?: string;
  };
  backgroundColor?: string;
  textColor?: string;
}

export function EmailHero({
  headline,
  subheading,
  backgroundImage,
  backgroundColor = "#ffffff",
  textColor = "#000000",
}: EmailHeroProps) {
  const imageUrl = backgroundImage?.asset
    ? urlFor(backgroundImage).width(600).url()
    : null;

  return (
    <Section style={sectionStyle}>
      {imageUrl ? (
        <div style={{ position: "relative" }}>
          <Img
            src={imageUrl}
            alt={backgroundImage?.alt || headline || "Hero image"}
            width="600"
            style={{
              width: "100%",
              maxWidth: "600px",
              height: "auto",
              display: "block",
            }}
          />
          {(headline || subheading) && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
                width: "90%",
                color: textColor,
              }}
            >
              {headline && (
                <Text style={{ ...headingStyle, color: textColor }}>
                  {headline}
                </Text>
              )}
              {subheading && (
                <Text style={{ ...subheadingStyle, color: textColor }}>
                  {subheading}
                </Text>
              )}
            </div>
          )}
        </div>
      ) : (
        <div
          style={{
            backgroundColor,
            padding: "60px 20px",
            textAlign: "center",
          }}
        >
          {headline && (
            <Text style={{ ...headingStyle, color: textColor }}>
              {headline}
            </Text>
          )}
          {subheading && (
            <Text style={{ ...subheadingStyle, color: textColor }}>
              {subheading}
            </Text>
          )}
        </div>
      )}
    </Section>
  );
}

const sectionStyle = {
  width: "100%",
  marginBottom: "20px",
};

const headingStyle = {
  fontSize: "32px",
  fontWeight: "bold",
  lineHeight: "1.2",
  margin: "0 0 16px 0",
  textAlign: "center" as const,
};

const subheadingStyle = {
  fontSize: "18px",
  lineHeight: "1.5",
  margin: "0",
  textAlign: "center" as const,
};


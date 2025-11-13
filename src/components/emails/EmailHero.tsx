import { Section, Text, Img } from "@react-email/components";
import * as React from "react";

interface EmailHeroProps {
  headline?: string;
  subheading?: string;
  image?: {
    asset?: {
      _ref?: string;
      _type?: string;
    };
    alt?: string;
  };
  imageUrl?: string;
}

export function EmailHero({
  headline,
  subheading,
  image,
  imageUrl,
}: EmailHeroProps) {
  // imageUrl should be provided by the renderer which uses urlFor
  const imgSrc = imageUrl;

  return (
    <Section style={heroSection}>
      {imgSrc && (
        <Img
          src={imgSrc}
          alt={image?.alt || headline || "Hero image"}
          width="600"
          style={heroImage}
        />
      )}
      {headline && (
        <Text style={heroHeadline}>{headline}</Text>
      )}
      {subheading && (
        <Text style={heroSubheading}>{subheading}</Text>
      )}
    </Section>
  );
}

const heroSection = {
  padding: "32px 48px",
  textAlign: "center" as const,
};

const heroImage = {
  maxWidth: "100%",
  height: "auto",
  marginBottom: "24px",
};

const heroHeadline = {
  fontSize: "32px",
  fontWeight: "700",
  lineHeight: "40px",
  color: "#1a202c",
  margin: "0 0 16px",
};

const heroSubheading = {
  fontSize: "18px",
  lineHeight: "28px",
  color: "#4a5568",
  margin: "0",
};


import { Section, Text, Img } from "@react-email/components";
import * as React from "react";

interface Testimonial {
  _id?: string;
  quote?: string;
  name?: string;
  company?: string;
  image?: {
    asset?: {
      _ref?: string;
    };
    alt?: string;
  };
  imageUrl?: string;
}

interface EmailTestimonialsProps {
  testimonials?: Testimonial[];
}

export function EmailTestimonials({ testimonials }: EmailTestimonialsProps) {
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <Section style={testimonialsSection}>
      <Text style={sectionTitle}>What Our Clients Say</Text>
      {testimonials.map((testimonial, index) => {
        // imageUrl should be provided by the renderer which uses urlFor
        const imageUrl = testimonial.imageUrl;

        return (
          <Section key={testimonial._id || index} style={testimonialCard}>
            {imageUrl && (
              <Img
                src={imageUrl}
                alt={testimonial.image?.alt || testimonial.name || "Testimonial"}
                width="80"
                height="80"
                style={testimonialImage}
              />
            )}
            {testimonial.quote && (
              <Text style={testimonialQuote}>"{testimonial.quote}"</Text>
            )}
            {testimonial.name && (
              <Text style={testimonialName}>{testimonial.name}</Text>
            )}
            {testimonial.company && (
              <Text style={testimonialCompany}>{testimonial.company}</Text>
            )}
          </Section>
        );
      })}
    </Section>
  );
}

const testimonialsSection = {
  padding: "32px 48px",
  backgroundColor: "#f7fafc",
};

const sectionTitle = {
  fontSize: "24px",
  fontWeight: "600",
  lineHeight: "32px",
  color: "#1a202c",
  margin: "0 0 24px",
  textAlign: "center" as const,
};

const testimonialCard = {
  backgroundColor: "#ffffff",
  padding: "24px",
  marginBottom: "16px",
  borderRadius: "8px",
  textAlign: "center" as const,
};

const testimonialImage = {
  borderRadius: "50%",
  marginBottom: "16px",
  margin: "0 auto 16px",
  display: "block",
};

const testimonialQuote = {
  fontSize: "16px",
  lineHeight: "24px",
  color: "#4a5568",
  margin: "0 0 16px",
  fontStyle: "italic",
};

const testimonialName = {
  fontSize: "16px",
  fontWeight: "600",
  lineHeight: "24px",
  color: "#1a202c",
  margin: "0 0 4px",
};

const testimonialCompany = {
  fontSize: "14px",
  lineHeight: "20px",
  color: "#718096",
  margin: "0",
};


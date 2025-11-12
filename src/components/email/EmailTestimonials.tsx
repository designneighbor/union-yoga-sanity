import { Section, Text, Img } from "@react-email/components";
import * as React from "react";
import { urlFor } from "@/sanity/lib/image";

interface Testimonial {
  _id: string;
  quote?: string;
  name?: string;
  company?: string;
  image?: {
    asset?: {
      _ref?: string;
      _type?: string;
    };
  };
}

interface EmailTestimonialsProps {
  title?: string;
  testimonials: Testimonial[];
}

export function EmailTestimonials({
  title,
  testimonials,
}: EmailTestimonialsProps) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <Section style={sectionStyle}>
      {title && (
        <Text style={titleStyle}>{title}</Text>
      )}
      {testimonials.map((testimonial) => (
        <div key={testimonial._id} style={testimonialStyle}>
          {testimonial.image?.asset && (
            <Img
              src={urlFor(testimonial.image).width(80).url()}
              alt={testimonial.name || "Testimonial"}
              width="80"
              height="80"
              style={{
                borderRadius: "50%",
                marginBottom: "12px",
              }}
            />
          )}
          {testimonial.quote && (
            <Text style={quoteStyle}>"{testimonial.quote}"</Text>
          )}
          {testimonial.name && (
            <Text style={nameStyle}>
              {testimonial.name}
              {testimonial.company && `, ${testimonial.company}`}
            </Text>
          )}
        </div>
      ))}
    </Section>
  );
}

const sectionStyle = {
  width: "100%",
  padding: "0 20px",
  marginBottom: "20px",
};

const titleStyle = {
  fontSize: "24px",
  fontWeight: "bold",
  marginBottom: "20px",
  textAlign: "center" as const,
  color: "#333333",
};

const testimonialStyle = {
  marginBottom: "30px",
  padding: "20px",
  backgroundColor: "#f9f9f9",
  borderRadius: "8px",
  textAlign: "center" as const,
};

const quoteStyle = {
  fontSize: "16px",
  lineHeight: "1.6",
  color: "#333333",
  fontStyle: "italic",
  margin: "0 0 12px 0",
};

const nameStyle = {
  fontSize: "14px",
  fontWeight: "bold",
  color: "#666666",
  margin: "0",
};


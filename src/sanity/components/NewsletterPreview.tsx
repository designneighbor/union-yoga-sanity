"use client";

import { useEffect, useState } from "react";
import { DocumentViewProps } from "sanity";
import { enrichContentBlocks } from "@/lib/newsletter/enrichContent";
import { EmailHero } from "@/components/email/EmailHero";
import { EmailText } from "@/components/email/EmailText";
import { EmailTestimonials } from "@/components/email/EmailTestimonials";
import { EmailBlogPosts } from "@/components/email/EmailBlogPosts";
import { EmailCTA } from "@/components/email/EmailCTA";
import { EmailDivider } from "@/components/email/EmailDivider";

interface NewsletterContent {
  _type: string;
  _key?: string;
  [key: string]: any;
}

export function NewsletterPreview(props: DocumentViewProps) {
  const { document } = props;
  const [enrichedContent, setEnrichedContent] = useState<NewsletterContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const newsletter = document.displayed;
  const content = (newsletter?.content as NewsletterContent[]) || [];
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

  // Add keyframes for spinner animation
  useEffect(() => {
    if (typeof document !== "undefined" && !document.getElementById("newsletter-preview-styles")) {
      const style = document.createElement("style");
      style.id = "newsletter-preview-styles";
      style.textContent = `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function enrichContent() {
      if (!content || content.length === 0) {
        setEnrichedContent([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const enriched = await enrichContentBlocks(content, siteUrl);
        if (isMounted) {
          setEnrichedContent(enriched);
          setLoading(false);
        }
      } catch (err: any) {
        console.error("Error enriching newsletter content:", err);
        if (isMounted) {
          setError(err.message || "Failed to load preview");
          setLoading(false);
        }
      }
    }

    enrichContent();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newsletter, siteUrl]);

  // Empty state
  if (!content || content.length === 0) {
    return (
      <div style={containerStyle}>
        <div style={emptyStateStyle}>
          <p style={emptyTextStyle}>No content blocks yet</p>
          <p style={emptySubtextStyle}>
            Add content blocks to see the newsletter preview
          </p>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={loadingStateStyle}>
          <div style={spinnerStyle}></div>
          <p style={loadingTextStyle}>Loading preview...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={containerStyle}>
        <div style={errorStateStyle}>
          <p style={errorTextStyle}>Error loading preview</p>
          <p style={errorSubtextStyle}>{error}</p>
        </div>
      </div>
    );
  }

  // Preview content - render email components directly
  return (
    <div style={containerStyle}>
      <div style={previewWrapperStyle}>
        <div style={emailContainerStyle}>
          {enrichedContent.map((block, index) => {
            switch (block._type) {
              case "emailHero":
                return (
                  <EmailHero
                    key={block._key || `hero-${index}`}
                    headline={block.headline}
                    subheading={block.subheading}
                    backgroundImage={block.backgroundImage}
                    backgroundColor={block.backgroundColor}
                    textColor={block.textColor}
                  />
                );
              case "emailText":
                return (
                  <EmailText
                    key={block._key || `text-${index}`}
                    content={block.content}
                    textAlign={block.textAlign}
                  />
                );
              case "emailTestimonials":
                return (
                  <EmailTestimonials
                    key={block._key || `testimonials-${index}`}
                    title={block.title}
                    testimonials={block.testimonials || []}
                  />
                );
              case "emailBlogPosts":
                return (
                  <EmailBlogPosts
                    key={block._key || `posts-${index}`}
                    title={block.title}
                    posts={block.posts || []}
                    siteUrl={siteUrl}
                  />
                );
              case "emailCTA":
                return (
                  <EmailCTA
                    key={block._key || `cta-${index}`}
                    text={block.text}
                    url={block.url}
                    backgroundColor={block.backgroundColor}
                    textColor={block.textColor}
                    align={block.align}
                  />
                );
              case "emailDivider":
                return (
                  <EmailDivider
                    key={block._key || `divider-${index}`}
                    spacing={block.spacing}
                    showLine={block.showLine}
                    lineColor={block.lineColor}
                  />
                );
              default:
                return null;
            }
          })}
          {/* Footer */}
          <div style={footerStyle}>
            <p style={footerTextStyle}>
              You're receiving this email because you subscribed to our newsletter.
            </p>
            <a href={`${siteUrl}/api/newsletters/unsubscribe`} style={unsubscribeLinkStyle}>
              Unsubscribe
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// Styles
const containerStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  overflow: "auto",
  backgroundColor: "#f6f9fc",
  padding: "20px",
  boxSizing: "border-box",
};

const previewWrapperStyle: React.CSSProperties = {
  maxWidth: "600px",
  margin: "0 auto",
  backgroundColor: "#ffffff",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  borderRadius: "4px",
  overflow: "hidden",
};

const emptyStateStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  minHeight: "400px",
  textAlign: "center",
  padding: "40px",
};

const emptyTextStyle: React.CSSProperties = {
  fontSize: "18px",
  fontWeight: "500",
  color: "#666",
  margin: "0 0 8px 0",
};

const emptySubtextStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#999",
  margin: "0",
};

const loadingStateStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  minHeight: "400px",
  gap: "16px",
};

const spinnerStyle: React.CSSProperties = {
  width: "40px",
  height: "40px",
  border: "4px solid #f3f3f3",
  borderTop: "4px solid #007bff",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
};

const loadingTextStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#666",
  margin: "0",
};

const errorStateStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  minHeight: "400px",
  textAlign: "center",
  padding: "40px",
};

const errorTextStyle: React.CSSProperties = {
  fontSize: "18px",
  fontWeight: "500",
  color: "#d32f2f",
  margin: "0 0 8px 0",
};

const errorSubtextStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#666",
  margin: "0",
};

const emailContainerStyle: React.CSSProperties = {
  backgroundColor: "#ffffff",
  padding: "20px 0 48px",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const footerStyle: React.CSSProperties = {
  marginTop: "40px",
  padding: "20px",
  textAlign: "center",
  borderTop: "1px solid #e0e0e0",
};

const footerTextStyle: React.CSSProperties = {
  fontSize: "12px",
  color: "#666666",
  margin: "0 0 8px 0",
};

const unsubscribeLinkStyle: React.CSSProperties = {
  fontSize: "12px",
  color: "#007bff",
  textDecoration: "underline",
};


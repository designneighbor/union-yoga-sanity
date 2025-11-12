import * as React from "react";
import { EmailContainer } from "./EmailContainer";
import { EmailHero } from "./EmailHero";
import { EmailText } from "./EmailText";
import { EmailTestimonials } from "./EmailTestimonials";
import { EmailBlogPosts } from "./EmailBlogPosts";
import { EmailCTA } from "./EmailCTA";
import { EmailDivider } from "./EmailDivider";

interface EmailBuilderProps {
  content: Array<{
    _type: string;
    _key?: string;
    [key: string]: any;
  }>;
  preview?: string;
  siteUrl?: string;
  unsubscribeToken?: string;
  subscriberEmail?: string;
}

export function EmailBuilder({
  content,
  preview,
  siteUrl,
  unsubscribeToken,
  subscriberEmail,
}: EmailBuilderProps) {
  if (!Array.isArray(content)) {
    return null;
  }

  // Build unsubscribe URL with token or email
  let unsubscribeUrl: string | undefined;
  if (siteUrl) {
    if (unsubscribeToken) {
      unsubscribeUrl = `${siteUrl}/api/newsletters/unsubscribe?token=${unsubscribeToken}`;
    } else if (subscriberEmail) {
      unsubscribeUrl = `${siteUrl}/api/newsletters/unsubscribe?email=${encodeURIComponent(subscriberEmail)}`;
    } else {
      unsubscribeUrl = `${siteUrl}/api/newsletters/unsubscribe`;
    }
  }

  return (
    <EmailContainer preview={preview} unsubscribeUrl={unsubscribeUrl} siteUrl={siteUrl}>
      {content.map((block, index) => {
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
    </EmailContainer>
  );
}


import { render } from "@react-email/render";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { EmailContainer } from "@/components/emails/EmailContainer";
import { EmailHero } from "@/components/emails/EmailHero";
import { EmailText } from "@/components/emails/EmailText";
import { EmailTestimonials } from "@/components/emails/EmailTestimonials";
import { EmailBlogPosts } from "@/components/emails/EmailBlogPosts";
import { EmailCTA } from "@/components/emails/EmailCTA";
import { EmailDivider } from "@/components/emails/EmailDivider";
import * as React from "react";

interface NewsletterBlock {
  _type: string;
  _key: string;
  [key: string]: any;
}

interface RenderNewsletterOptions {
  content: NewsletterBlock[];
  preview?: string;
  siteUrl: string;
  subscriberEmail?: string;
  unsubscribeToken?: string;
}

export async function renderNewsletterToHtml(
  options: RenderNewsletterOptions
): Promise<string> {
  const { content, preview, siteUrl, subscriberEmail, unsubscribeToken } =
    options;

  // Fetch referenced testimonials and blog posts
  const testimonialIds: string[] = [];
  const blogPostIds: string[] = [];

  content.forEach((block) => {
    if (block._type === "emailTestimonials" && block.testimonials) {
      block.testimonials.forEach((ref: any) => {
        // Handle both reference objects and string IDs
        const id = ref._ref || (typeof ref === "string" ? ref : null);
        if (id) testimonialIds.push(id);
      });
    }
    if (block._type === "emailBlogPosts" && block.blogPosts) {
      block.blogPosts.forEach((ref: any) => {
        // Handle both reference objects and string IDs
        const id = ref._ref || (typeof ref === "string" ? ref : null);
        if (id) blogPostIds.push(id);
      });
    }
  });

  // Fetch testimonials
  const testimonials =
    testimonialIds.length > 0
      ? await client.fetch(
          `*[_type == "testimonial" && _id in $ids]{
        _id,
        quote,
        name,
        company,
        image
      }`,
          { ids: testimonialIds }
        )
      : [];

  // Fetch blog posts
  const blogPosts =
    blogPostIds.length > 0
      ? await client.fetch(
          `*[_type == "post" && _id in $ids]{
        _id,
        title,
        slug,
        mainImage,
        publishedAt
      }`,
          { ids: blogPostIds }
        )
      : [];

  // Create a map for quick lookup
  const testimonialsMap = new Map(
    testimonials.map((t: any) => [t._id, t])
  );
  const blogPostsMap = new Map(blogPosts.map((p: any) => [p._id, p]));

  // Render blocks
  const renderedBlocks = content.map((block) => {
    switch (block._type) {
      case "emailHero":
        const heroImageUrl = block.image
          ? urlFor(block.image).url()
          : undefined;
        return (
          <EmailHero
            key={block._key}
            headline={block.headline}
            subheading={block.subheading}
            image={block.image}
            imageUrl={heroImageUrl}
          />
        );

      case "emailText":
        return <EmailText key={block._key} text={block.text} />;

      case "emailTestimonials":
        const blockTestimonials = block.testimonials
          ?.map((ref: any) => {
            // Handle both reference objects and string IDs
            const refId = ref._ref || (typeof ref === "string" ? ref : null);
            if (!refId) return null;
            
            const testimonial = testimonialsMap.get(refId);
            if (testimonial) {
              return {
                ...testimonial,
                imageUrl: testimonial.image
                  ? urlFor(testimonial.image).url()
                  : undefined,
              };
            }
            return null;
          })
          .filter(Boolean);
        return (
          <EmailTestimonials
            key={block._key}
            testimonials={blockTestimonials}
          />
        );

      case "emailBlogPosts":
        const blockBlogPosts = block.blogPosts
          ?.map((ref: any) => {
            // Handle both reference objects and string IDs
            const refId = ref._ref || (typeof ref === "string" ? ref : null);
            if (!refId) return null;
            
            const post = blogPostsMap.get(refId);
            if (post) {
              return {
                ...post,
                imageUrl: post.mainImage
                  ? urlFor(post.mainImage).url()
                  : undefined,
              };
            }
            return null;
          })
          .filter(Boolean);
        return (
          <EmailBlogPosts
            key={block._key}
            blogPosts={blockBlogPosts}
            siteUrl={siteUrl}
          />
        );

      case "emailCTA":
        return (
          <EmailCTA key={block._key} text={block.text} url={block.url} />
        );

      case "emailDivider":
        return <EmailDivider key={block._key} />;

      default:
        return null;
    }
  });

  // Render the complete email
  const emailHtml = render(
    <EmailContainer
      preview={preview}
      siteUrl={siteUrl}
      subscriberEmail={subscriberEmail}
      unsubscribeToken={unsubscribeToken}
    >
      {renderedBlocks}
    </EmailContainer>
  );

  return emailHtml;
}


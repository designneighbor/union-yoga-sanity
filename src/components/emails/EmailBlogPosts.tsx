import { Section, Text, Img, Link } from "@react-email/components";
import * as React from "react";

interface BlogPost {
  _id?: string;
  title?: string;
  slug?: {
    current?: string;
  };
  mainImage?: {
    asset?: {
      _ref?: string;
    };
    alt?: string;
  };
  imageUrl?: string;
  publishedAt?: string;
  excerpt?: string;
}

interface EmailBlogPostsProps {
  blogPosts?: BlogPost[];
  siteUrl: string;
}

export function EmailBlogPosts({ blogPosts, siteUrl }: EmailBlogPostsProps) {
  if (!blogPosts || blogPosts.length === 0) {
    return null;
  }

  return (
    <Section style={blogPostsSection}>
      <Text style={sectionTitle}>Latest Blog Posts</Text>
      {blogPosts.map((post, index) => {
        // imageUrl should be provided by the renderer which uses urlFor
        const imageUrl = post.imageUrl;
        const postUrl = post.slug?.current 
          ? `${siteUrl}/blog/${post.slug.current}` 
          : "#";

        return (
          <Section key={post._id || index} style={postCard}>
            {imageUrl && (
              <Link href={postUrl}>
                <Img
                  src={imageUrl}
                  alt={post.mainImage?.alt || post.title || "Blog post"}
                  width="100%"
                  style={postImage}
                />
              </Link>
            )}
            <Text style={postTitle}>
              <Link href={postUrl} style={postLink}>
                {post.title || "Untitled Post"}
              </Link>
            </Text>
            {post.publishedAt && (
              <Text style={postDate}>
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Text>
            )}
          </Section>
        );
      })}
    </Section>
  );
}

const blogPostsSection = {
  padding: "32px 48px",
};

const sectionTitle = {
  fontSize: "24px",
  fontWeight: "600",
  lineHeight: "32px",
  color: "#1a202c",
  margin: "0 0 24px",
  textAlign: "center" as const,
};

const postCard = {
  marginBottom: "32px",
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  overflow: "hidden",
};

const postImage = {
  width: "100%",
  height: "auto",
  display: "block",
  marginBottom: "16px",
};

const postTitle = {
  fontSize: "20px",
  fontWeight: "600",
  lineHeight: "28px",
  color: "#1a202c",
  margin: "0 0 8px",
  padding: "0 16px",
};

const postLink = {
  color: "#1a202c",
  textDecoration: "none",
};

const postDate = {
  fontSize: "14px",
  lineHeight: "20px",
  color: "#718096",
  margin: "0",
  padding: "0 16px 16px",
};


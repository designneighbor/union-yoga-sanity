import { Section, Text, Img, Link } from "@react-email/components";
import * as React from "react";
import { urlFor } from "@/sanity/lib/image";

interface Post {
  _id: string;
  title?: string;
  slug?: {
    current?: string;
  };
  mainImage?: {
    asset?: {
      _ref?: string;
      _type?: string;
    };
    alt?: string;
  };
  publishedAt?: string;
}

interface EmailBlogPostsProps {
  title?: string;
  posts: Post[];
  siteUrl?: string;
}

export function EmailBlogPosts({
  title,
  posts,
  siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com",
}: EmailBlogPostsProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <Section style={sectionStyle}>
      {title && (
        <Text style={titleStyle}>{title}</Text>
      )}
      {posts.map((post) => {
        const postUrl = post.slug?.current
          ? `${siteUrl}/blog/${post.slug.current}`
          : "#";
        
        return (
          <div key={post._id} style={postStyle}>
            {post.mainImage?.asset && (
              <Link href={postUrl}>
                <Img
                  src={urlFor(post.mainImage).width(300).url()}
                  alt={post.mainImage.alt || post.title || "Blog post"}
                  width="300"
                  style={{
                    width: "100%",
                    maxWidth: "300px",
                    height: "auto",
                    marginBottom: "12px",
                    borderRadius: "4px",
                  }}
                />
              </Link>
            )}
            {post.title && (
              <Link
                href={postUrl}
                style={{
                  textDecoration: "none",
                  color: "#007bff",
                }}
              >
                <Text style={postTitleStyle}>{post.title}</Text>
              </Link>
            )}
            {post.publishedAt && (
              <Text style={dateStyle}>
                {new Date(post.publishedAt).toLocaleDateString()}
              </Text>
            )}
          </div>
        );
      })}
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

const postStyle = {
  marginBottom: "30px",
  textAlign: "center" as const,
};

const postTitleStyle = {
  fontSize: "18px",
  fontWeight: "bold",
  color: "#007bff",
  margin: "0 0 8px 0",
  textDecoration: "none",
};

const dateStyle = {
  fontSize: "14px",
  color: "#666666",
  margin: "0",
};


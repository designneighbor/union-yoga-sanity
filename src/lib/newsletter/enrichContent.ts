import { client } from "@/sanity/lib/client";

interface NewsletterContent {
  _type: string;
  _key?: string;
  [key: string]: any;
}

/**
 * Enriches content blocks by fetching dynamic data (testimonials, blog posts)
 * Client-side version for use in React components
 */
export async function enrichContentBlocks(
  content: NewsletterContent[],
  siteUrl?: string
): Promise<NewsletterContent[]> {
  const enriched = await Promise.all(
    content.map(async (block) => {
      if (block._type === "emailTestimonials") {
        return await enrichTestimonialsBlock(block);
      }
      if (block._type === "emailBlogPosts") {
        return await enrichBlogPostsBlock(block, siteUrl);
      }
      return block;
    })
  );

  return enriched;
}

/**
 * Fetches testimonials data for emailTestimonials block
 */
async function enrichTestimonialsBlock(block: NewsletterContent): Promise<NewsletterContent> {
  try {
    if (block.testimonials && Array.isArray(block.testimonials) && block.testimonials.length > 0) {
      // Check if testimonials are already resolved (have _id directly) or are references
      const firstTestimonial = block.testimonials[0];
      
      // If testimonials are already resolved (have _id, quote, etc.), return as-is
      if (firstTestimonial && firstTestimonial._id && firstTestimonial.quote) {
        return block;
      }

      // Use selected testimonials (references)
      const ids = block.testimonials
        .map((t: any) => t._ref || t._id)
        .filter((id: any): id is string => !!id);

      if (ids.length > 0) {
        const query = `*[_type == "testimonial" && _id in $ids]{
          _id,
          quote,
          name,
          company,
          image
        }`;
        const testimonials = await client.fetch(query, { ids });
        return { ...block, testimonials };
      }
    } else {
      // Get recent testimonials
      const count = block.count || 3;
      const query = `*[_type == "testimonial"]|order(_createdAt desc)[0...$count]{
        _id,
        quote,
        name,
        company,
        image
      }`;
      const testimonials = await client.fetch(query, { count });
      return { ...block, testimonials };
    }
  } catch (error) {
    console.error("Error enriching testimonials block:", error);
  }
  return { ...block, testimonials: [] };
}

/**
 * Fetches blog posts data for emailBlogPosts block
 */
async function enrichBlogPostsBlock(
  block: NewsletterContent,
  siteUrl?: string
): Promise<NewsletterContent> {
  try {
    if (block.posts && Array.isArray(block.posts) && block.posts.length > 0) {
      // Check if posts are already resolved (have _id directly) or are references
      const firstPost = block.posts[0];
      
      // If posts are already resolved (have _id, title, etc.), return as-is
      if (firstPost && firstPost._id && firstPost.title) {
        return block;
      }

      // Use selected posts (references)
      const ids = block.posts
        .map((p: any) => p._ref || p._id)
        .filter((id: any): id is string => !!id);

      if (ids.length > 0) {
        const query = `*[_type == "post" && _id in $ids && defined(slug.current)]{
          _id,
          title,
          slug,
          mainImage,
          publishedAt
        }`;
        const posts = await client.fetch(query, { ids });
        return { ...block, posts };
      }
    } else {
      // Get recent posts
      const count = block.count || 3;
      const query = `*[_type == "post" && defined(slug.current)]|order(publishedAt desc)[0...$count]{
        _id,
        title,
        slug,
        mainImage,
        publishedAt
      }`;
      const posts = await client.fetch(query, { count });
      return { ...block, posts };
    }
  } catch (error) {
    console.error("Error enriching blog posts block:", error);
  }
  return { ...block, posts: [] };
}


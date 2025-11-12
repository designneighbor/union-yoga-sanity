import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { renderNewsletterToHtml } from "@/lib/newsletter/renderer";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const newsletterId = searchParams.get("id");

  if (!newsletterId) {
    return new NextResponse(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>Preview Error</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
            .error { color: #d32f2f; }
          </style>
        </head>
        <body>
          <h1>Preview Error</h1>
          <p class="error">Newsletter ID is required</p>
        </body>
      </html>`,
      { status: 400, headers: { "Content-Type": "text/html" } }
    );
  }

  try {
    // Fetch newsletter from Sanity with full content blocks including references
    const newsletter = await client.fetch(
      `*[_type == "newsletter" && _id == $id][0]{
        _id,
        title,
        content[]{
          ...,
          _type == "emailTestimonials" => {
            ...,
            testimonials[]->{
              _id,
              quote,
              name,
              company,
              image
            }
          },
          _type == "emailBlogPosts" => {
            ...,
            posts[]->{
              _id,
              title,
              slug,
              mainImage,
              publishedAt
            }
          }
        }
      }`,
      { id: newsletterId }
    );

    if (!newsletter) {
      return new NextResponse(
        `<!DOCTYPE html>
        <html>
          <head>
            <title>Preview Error</title>
            <style>
              body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
              .error { color: #d32f2f; }
            </style>
          </head>
          <body>
            <h1>Preview Error</h1>
            <p class="error">Newsletter not found</p>
            <p>The newsletter with ID "${newsletterId}" could not be found.</p>
          </body>
        </html>`,
        { status: 404, headers: { "Content-Type": "text/html" } }
      );
    }

    // Render newsletter to HTML
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
    const html = await renderNewsletterToHtml({
      content: newsletter.content || [],
      preview: newsletter.title,
      siteUrl,
    });

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  } catch (error: any) {
    console.error("Preview error:", error);
    return new NextResponse(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>Preview Error</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
            .error { color: #d32f2f; }
          </style>
        </head>
        <body>
          <h1>Preview Error</h1>
          <p class="error">An error occurred while rendering the preview</p>
          <p>${error.message || "Internal server error"}</p>
        </body>
      </html>`,
      { status: 500, headers: { "Content-Type": "text/html" } }
    );
  }
}


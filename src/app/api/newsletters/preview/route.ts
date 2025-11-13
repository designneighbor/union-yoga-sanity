import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { renderNewsletterToHtml } from "@/lib/newsletter/renderer";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const newsletterId = searchParams.get("id");

    if (!newsletterId) {
      return NextResponse.json(
        { error: "Newsletter ID is required" },
        { status: 400 }
      );
    }

    // Fetch newsletter from Sanity
    const newsletter = await client.fetch(
      `*[_type == "newsletter" && _id == $id][0]{
        _id,
        title,
        content
      }`,
      { id: newsletterId }
    );

    if (!newsletter) {
      return NextResponse.json(
        { error: "Newsletter not found" },
        { status: 404 }
      );
    }

    if (!newsletter.content || newsletter.content.length === 0) {
      return NextResponse.json(
        { error: "Newsletter has no content blocks" },
        { status: 400 }
      );
    }

    // Render newsletter HTML
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
    const html = await renderNewsletterToHtml({
      content: newsletter.content,
      preview: newsletter.title,
      siteUrl,
    });

    // Return HTML response
    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  } catch (error: any) {
    console.error("Preview newsletter error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}


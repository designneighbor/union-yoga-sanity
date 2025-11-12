import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { createProvider } from "@/lib/newsletter/providers";
import { renderNewsletterToHtml } from "@/lib/newsletter/renderer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { newsletterId, testEmail } = body;

    if (!newsletterId) {
      return NextResponse.json(
        { error: "Newsletter ID is required" },
        { status: 400 }
      );
    }

    if (!testEmail) {
      return NextResponse.json(
        { error: "Test email address is required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(testEmail)) {
      return NextResponse.json(
        { error: "Invalid email address format" },
        { status: 400 }
      );
    }

    // Fetch newsletter from Sanity
    const newsletter = await client.fetch(
      `*[_type == "newsletter" && _id == $id][0]{
        _id,
        title,
        content,
        platform
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

    // Render newsletter to HTML
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
    const html = await renderNewsletterToHtml({
      content: newsletter.content || [],
      preview: newsletter.title,
      siteUrl,
      subscriberEmail: testEmail, // Use test email for unsubscribe link
    });

    // Get provider and send test email
    const provider = createProvider(newsletter.platform || "resend");
    const fromEmail =
      process.env.NEWSLETTER_FROM_EMAIL || "Union Yoga <no-reply@david-lewis.co>";

    const result = await provider.sendEmail(
      `[TEST] ${newsletter.title || "Newsletter"}`,
      html,
      [testEmail],
      fromEmail
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to send test email" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      messageId: result.messageId,
      message: `Test email sent successfully to ${testEmail}`,
    });
  } catch (error: any) {
    console.error("Test email error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}



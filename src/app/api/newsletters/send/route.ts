import { NextRequest, NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/writeClient";
import { createProvider } from "@/lib/newsletter/providers";
import { renderNewsletterToHtml } from "@/lib/newsletter/renderer";
import { client } from "@/sanity/lib/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { newsletterId } = body;

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
        content,
        status,
        platform,
        sentCount,
        sentAt
      }`,
      { id: newsletterId }
    );

    if (!newsletter) {
      return NextResponse.json(
        { error: "Newsletter not found" },
        { status: 404 }
      );
    }

    if (newsletter.status === "sent") {
      return NextResponse.json(
        { error: "Newsletter has already been sent" },
        { status: 400 }
      );
    }

    // Fetch active subscribers
    const subscribers = await client.fetch(
      `*[_type == "subscriber" && subscriptionStatus == "subscribed"]{
        _id,
        email
      }`
    );

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json(
        { error: "No active subscribers found" },
        { status: 400 }
      );
    }

    // Get provider and send email
    const provider = createProvider(newsletter.platform || "resend");
    const fromEmail =
      process.env.NEWSLETTER_FROM_EMAIL || "Union Yoga <no-reply@david-lewis.co>";

    // Send to each subscriber individually with personalized unsubscribe links
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
    let successCount = 0;
    let errorCount = 0;

    for (const subscriber of subscribers) {
      try {
        // Render newsletter with subscriber-specific unsubscribe link
        const html = await renderNewsletterToHtml({
          content: newsletter.content || [],
          preview: newsletter.title,
          siteUrl,
          subscriberEmail: subscriber.email,
        });

        // Send to individual subscriber
        const result = await provider.sendEmail(
          newsletter.title || "Newsletter",
          html,
          [subscriber.email],
          fromEmail
        );

        if (result.success) {
          successCount++;
          // Update last email sent for subscriber
          try {
            await writeClient
              .patch(subscriber._id)
              .set({
                lastEmailSent: {
                  _type: "reference",
                  _ref: newsletter._id,
                },
              })
              .commit();
          } catch (error) {
            console.error(`Failed to update subscriber ${subscriber._id}:`, error);
          }
        } else {
          errorCount++;
          console.error(`Failed to send to ${subscriber.email}:`, result.error);
        }
      } catch (error: any) {
        errorCount++;
        console.error(`Error sending to ${subscriber.email}:`, error);
      }
    }

    // Update newsletter document
    const now = new Date().toISOString();
    await writeClient
      .patch(newsletter._id)
      .set({
        status: "sent",
        sentCount: successCount,
        sentAt: now,
      })
      .commit();

    if (errorCount > 0) {
      return NextResponse.json({
        success: true,
        sentCount: successCount,
        errorCount,
        message: `Newsletter sent to ${successCount} subscribers. ${errorCount} failed.`,
      });
    }

    return NextResponse.json({
      success: true,
      sentCount: successCount,
    });
  } catch (error: any) {
    console.error("Newsletter send error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}


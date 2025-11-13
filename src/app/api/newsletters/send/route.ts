import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/writeClient";
import { createProvider } from "@/lib/newsletter/providers";
import { renderNewsletterToHtml } from "@/lib/newsletter/renderer";
import { randomBytes } from "crypto";

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
        "stats": stats
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

    // Query active subscribers
    const subscribers = await client.fetch(
      `*[_type == "subscriber" && subscribed == true]{
        _id,
        email,
        confirmationToken
      }`
    );

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json(
        { error: "No active subscribers found" },
        { status: 400 }
      );
    }

    // Get provider
    const provider = createProvider("resend");
    const fromEmail =
      process.env.NEWSLETTER_FROM_EMAIL || "Union Yoga <no-reply@david-lewis.co>";
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

    // Generate unsubscribe tokens for each subscriber
    const subscriberEmails = subscribers.map((sub: any) => sub.email);
    const unsubscribeTokens = new Map<string, string>();

    subscribers.forEach((sub: any) => {
      // Generate or use existing token
      const token = sub.confirmationToken || randomBytes(32).toString("hex");
      unsubscribeTokens.set(sub.email, token);

      // Update subscriber with token if they don't have one
      if (!sub.confirmationToken) {
        writeClient
          .patch(sub._id)
          .set({ confirmationToken: token })
          .commit()
          .catch(console.error);
      }
    });

    // Render newsletter HTML for each subscriber (with their unsubscribe token)
    let sentCount = 0;
    let failedCount = 0;
    const errors: string[] = [];

    for (const subscriber of subscribers) {
      try {
        const token = unsubscribeTokens.get(subscriber.email) || "";
        const html = await renderNewsletterToHtml({
          content: newsletter.content,
          preview: newsletter.title,
          siteUrl,
          subscriberEmail: subscriber.email,
          unsubscribeToken: token,
        });

        const result = await provider.sendEmail(
          newsletter.title || "Newsletter",
          html,
          [subscriber.email],
          fromEmail
        );

        if (result.success && result.messageId) {
          sentCount++;

          // Update subscriber's lastEmailSent
          writeClient
            .patch(subscriber._id)
            .set({
              lastEmailSent: {
                _type: "reference",
                _ref: newsletter._id,
              },
            })
            .commit()
            .catch(console.error);
        } else {
          failedCount++;
          errors.push(`${subscriber.email}: ${result.error || "Unknown error"}`);
        }
      } catch (error: any) {
        failedCount++;
        errors.push(`${subscriber.email}: ${error.message}`);
      }
    }

    // Update newsletter status and stats
    const now = new Date().toISOString();
    await writeClient
      .patch(newsletterId)
      .set({
        status: "sent",
        sentAt: now,
        "stats.sentCount": sentCount,
        "stats.deliveryDate": now,
      })
      .commit();

    return NextResponse.json({
      success: true,
      sentCount,
      failedCount,
      totalSubscribers: subscribers.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: any) {
    console.error("Send newsletter error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}


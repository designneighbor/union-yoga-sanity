import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

/**
 * This endpoint can be called by a cron job (e.g., Vercel Cron) to process scheduled newsletters
 * It queries for newsletters with status "scheduled" and scheduledSendTime <= now
 * Then triggers the send flow for each newsletter
 */
export async function GET(request: NextRequest) {
  try {
    // Optional: Add authentication to prevent unauthorized access
    const authHeader = request.headers.get("authorization");
    const expectedToken = process.env.CRON_SECRET;
    
    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const now = new Date().toISOString();

    // Find newsletters that are scheduled and ready to send
    const scheduledNewsletters = await client.fetch(
      `*[_type == "newsletter" && status == "scheduled" && scheduledSendTime <= $now]{
        _id,
        title,
        scheduledSendTime
      }`,
      { now }
    );

    if (!scheduledNewsletters || scheduledNewsletters.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No scheduled newsletters to send",
        processed: 0,
      });
    }

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
    const results = [];

    // Process each scheduled newsletter
    for (const newsletter of scheduledNewsletters) {
      try {
        // Call the send endpoint
        const response = await fetch(`${siteUrl}/api/newsletters/send`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            newsletterId: newsletter._id,
          }),
        });

        const result = await response.json();
        results.push({
          newsletterId: newsletter._id,
          title: newsletter.title,
          success: response.ok,
          result,
        });
      } catch (error: any) {
        results.push({
          newsletterId: newsletter._id,
          title: newsletter.title,
          success: false,
          error: error.message,
        });
      }
    }

    return NextResponse.json({
      success: true,
      processed: scheduledNewsletters.length,
      results,
    });
  } catch (error: any) {
    console.error("Scheduled send error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}


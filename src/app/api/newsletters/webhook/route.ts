import { NextRequest, NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/writeClient";
import { client } from "@/sanity/lib/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    // Resend webhook events
    // See: https://resend.com/docs/dashboard/webhooks
    if (type === "email.sent") {
      // Email was sent successfully
      // data.email_id contains the email ID
      // We can track this if needed
    } else if (type === "email.delivered") {
      // Email was delivered
      // data.email_id contains the email ID
    } else if (type === "email.opened") {
      // Email was opened
      const emailId = data?.email_id;
      if (emailId) {
        // Find newsletter by tracking email ID
        // Note: We'd need to store the email ID when sending
        // For now, we'll update based on the most recent sent newsletter
        await updateNewsletterStats(emailId, "open");
      }
    } else if (type === "email.clicked") {
      // Email link was clicked
      const emailId = data?.email_id;
      if (emailId) {
        await updateNewsletterStats(emailId, "click");
      }
    } else if (type === "email.bounced") {
      // Email bounced
    } else if (type === "email.complained") {
      // Recipient marked as spam
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

async function updateNewsletterStats(emailId: string, eventType: "open" | "click") {
  try {
    // Find the most recently sent newsletter
    // In a production system, you'd want to store the email ID with the newsletter
    const newsletters = await client.fetch(
      `*[_type == "newsletter" && status == "sent"] | order(sentAt desc)[0..10]{
        _id,
        "stats": stats
      }`
    );

    // Update stats for the most recent newsletter
    // Note: This is a simplified approach. In production, you'd want to
    // store the email ID with each newsletter send for accurate tracking
    if (newsletters && newsletters.length > 0) {
      const newsletter = newsletters[0];
      const currentStats = newsletter.stats || {};
      const openCount = currentStats.openCount || 0;
      const clickCount = currentStats.clickCount || 0;

      if (eventType === "open") {
        await writeClient
          .patch(newsletter._id)
          .set({
            "stats.openCount": openCount + 1,
          })
          .commit();
      } else if (eventType === "click") {
        await writeClient
          .patch(newsletter._id)
          .set({
            "stats.clickCount": clickCount + 1,
          })
          .commit();
      }
    }
  } catch (error) {
    console.error("Error updating newsletter stats:", error);
  }
}


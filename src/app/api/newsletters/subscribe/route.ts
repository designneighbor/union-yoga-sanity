import { NextRequest, NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/writeClient";
import { client } from "@/sanity/lib/client";
import { createProvider } from "@/lib/newsletter/providers";
import { randomBytes } from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, tags } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address format" },
        { status: 400 }
      );
    }

    // Check if subscriber already exists
    const existing = await client.fetch(
      `*[_type == "subscriber" && email == $email][0]`,
      { email: email.toLowerCase().trim() }
    );

    if (existing) {
      if (existing.subscribed) {
        return NextResponse.json(
          { error: "Email is already subscribed" },
          { status: 400 }
        );
      } else {
        // Resend confirmation email
        const confirmationToken =
          existing.confirmationToken || randomBytes(32).toString("hex");
        await writeClient
          .patch(existing._id)
          .set({
            confirmationToken,
            subscribeDate: new Date().toISOString(),
          })
          .commit();

        await sendConfirmationEmail(email, confirmationToken);

        return NextResponse.json({
          success: true,
          message: "Confirmation email sent",
        });
      }
    }

    // Create new subscriber (not yet confirmed)
    const confirmationToken = randomBytes(32).toString("hex");
    const now = new Date().toISOString();

    await writeClient.create({
      _type: "subscriber",
      email: email.toLowerCase().trim(),
      subscribed: false,
      subscribeDate: now,
      confirmationToken,
      tags: tags || [],
    });

    // Send confirmation email
    await sendConfirmationEmail(email, confirmationToken);

    return NextResponse.json({
      success: true,
      message: "Confirmation email sent. Please check your inbox.",
    });
  } catch (error: any) {
    console.error("Subscribe error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

async function sendConfirmationEmail(email: string, token: string) {
  try {
    const provider = createProvider("resend");
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
    const fromEmail =
      process.env.NEWSLETTER_FROM_EMAIL || "Union Yoga <no-reply@david-lewis.co>";

    // Validate environment variables
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      throw new Error("Email service not configured");
    }

    const confirmationUrl = `${siteUrl}/api/newsletters/confirm?token=${token}`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Confirm Your Subscription</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1a202c;">Confirm Your Subscription</h1>
          <p>Thank you for subscribing to our newsletter!</p>
          <p>Please click the button below to confirm your subscription:</p>
          <p style="text-align: center; margin: 30px 0;">
            <a href="${confirmationUrl}" style="background-color: #556cd6; color: #ffffff; padding: 12px 32px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
              Confirm Subscription
            </a>
          </p>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #556cd6;">${confirmationUrl}</p>
          <p style="margin-top: 30px; font-size: 12px; color: #8898aa;">
            If you didn't request this subscription, you can safely ignore this email.
          </p>
        </body>
      </html>
    `;

    console.log(`Attempting to send confirmation email to: ${email}`);
    console.log(`From email: ${fromEmail}`);
    console.log(`Site URL: ${siteUrl}`);

    const result = await provider.sendEmail(
      "Confirm Your Subscription",
      html,
      [email],
      fromEmail
    );

    if (!result.success) {
      console.error("Failed to send confirmation email:", result.error);
      throw new Error(result.error || "Failed to send confirmation email");
    }

    console.log(`Confirmation email sent successfully. Message ID: ${result.messageId}`);
  } catch (error: any) {
    console.error("Error in sendConfirmationEmail:", error);
    throw error; // Re-throw so the calling function can handle it
  }
}


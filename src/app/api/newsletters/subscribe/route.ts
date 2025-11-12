import { NextRequest, NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/writeClient";
import { client } from "@/sanity/lib/client";
import { createProvider } from "@/lib/newsletter/providers";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, platform = "resend" } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Valid email address is required" },
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

    const normalizedEmail = email.toLowerCase().trim();

    // Check if subscriber already exists
    const existingSubscriber = await client.fetch(
      `*[_type == "subscriber" && email == $email][0]`,
      { email: normalizedEmail }
    );

    if (existingSubscriber) {
      if (existingSubscriber.subscriptionStatus === "subscribed") {
        return NextResponse.json(
          { error: "Email is already subscribed" },
          { status: 400 }
        );
      }
      // If unsubscribed, update to pending for double opt-in
      const confirmationToken = crypto.randomBytes(32).toString("hex");
      await writeClient
        .patch(existingSubscriber._id)
        .set({
          subscriptionStatus: "pending",
          confirmationToken,
          subscribedAt: new Date().toISOString(),
        })
        .commit();

      // Send confirmation email
      await sendConfirmationEmail(normalizedEmail, confirmationToken);

      return NextResponse.json({
        success: true,
        message: "Confirmation email sent",
        requiresConfirmation: true,
      });
    }

    // Create new subscriber
    const confirmationToken = crypto.randomBytes(32).toString("hex");
    const now = new Date().toISOString();

    const subscriber = await writeClient.create({
      _type: "subscriber",
      email: normalizedEmail,
      subscribed: false, // Will be true after confirmation
      subscriptionStatus: "pending",
      subscribedAt: now,
      confirmationToken,
    });

    // Add to platform
    try {
      const provider = createProvider(platform);
      await provider.addSubscriber(normalizedEmail);
    } catch (error) {
      console.error("Failed to add subscriber to platform:", error);
      // Continue even if platform add fails
    }

    // Send confirmation email
    await sendConfirmationEmail(normalizedEmail, confirmationToken);

    return NextResponse.json({
      success: true,
      message: "Confirmation email sent",
      requiresConfirmation: true,
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
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
    const confirmUrl = `${siteUrl}/api/newsletters/confirm?token=${token}&email=${encodeURIComponent(email)}`;

    const { error } = await resend.emails.send({
      from: process.env.NEWSLETTER_FROM_EMAIL || "Union Yoga <no-reply@david-lewis.co>",
      to: [email],
      subject: "Confirm your subscription",
      html: `
        <h2>Confirm your subscription</h2>
        <p>Thank you for subscribing! Please click the link below to confirm your email address:</p>
        <p><a href="${confirmUrl}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 4px;">Confirm Subscription</a></p>
        <p>Or copy and paste this link into your browser:</p>
        <p>${confirmUrl}</p>
        <p>If you didn't subscribe, you can safely ignore this email.</p>
      `,
    });

    if (error) {
      console.error("Failed to send confirmation email:", error);
    }
  } catch (error) {
    console.error("Error sending confirmation email:", error);
  }
}


import { NextRequest, NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/writeClient";
import { client } from "@/sanity/lib/client";
import { createProvider } from "@/lib/newsletter/providers";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  if (!token && !email) {
    return new NextResponse(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>Unsubscribe</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
            .error { color: #d32f2f; }
          </style>
        </head>
        <body>
          <h1>Unsubscribe</h1>
          <p class="error">Invalid unsubscribe link. Please contact support if you need help.</p>
        </body>
      </html>`,
      { status: 400, headers: { "Content-Type": "text/html" } }
    );
  }

  try {
    let subscriber;

    if (token) {
      // Find subscriber by token
      subscriber = await client.fetch(
        `*[_type == "subscriber" && confirmationToken == $token][0]`,
        { token }
      );
    } else if (email) {
      // Find subscriber by email
      subscriber = await client.fetch(
        `*[_type == "subscriber" && email == $email][0]`,
        { email: email.toLowerCase().trim() }
      );
    }

    if (!subscriber) {
      return new NextResponse(
        `<!DOCTYPE html>
        <html>
          <head>
            <title>Unsubscribe</title>
            <style>
              body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
              .error { color: #d32f2f; }
            </style>
          </head>
          <body>
            <h1>Unsubscribe</h1>
            <p class="error">Subscriber not found.</p>
          </body>
        </html>`,
        { status: 404, headers: { "Content-Type": "text/html" } }
      );
    }

    // Update subscriber status
    const now = new Date().toISOString();
    await writeClient
      .patch(subscriber._id)
      .set({
        subscribed: false,
        subscriptionStatus: "unsubscribed",
        unsubscribedAt: now,
      })
      .commit();

    // Remove from platform
    try {
      const platform = (subscriber.platformId ? "resend" : "resend") as "resend" | "mailchimp" | "kit";
      const provider = createProvider(platform);
      await provider.removeSubscriber(subscriber.email);
    } catch (error) {
      console.error("Failed to remove subscriber from platform:", error);
      // Continue even if platform removal fails
    }

    return new NextResponse(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>Unsubscribed</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
            .success { color: #2e7d32; }
          </style>
        </head>
        <body>
          <h1>Unsubscribed</h1>
          <p class="success">You have been successfully unsubscribed from our newsletter.</p>
          <p>You will no longer receive emails from us. If you change your mind, you can subscribe again at any time.</p>
        </body>
      </html>`,
      { status: 200, headers: { "Content-Type": "text/html" } }
    );
  } catch (error: any) {
    console.error("Unsubscribe error:", error);
    return new NextResponse(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>Error</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
            .error { color: #d32f2f; }
          </style>
        </head>
        <body>
          <h1>Error</h1>
          <p class="error">An error occurred while processing your unsubscribe request. Please try again later or contact support.</p>
        </body>
      </html>`,
      { status: 500, headers: { "Content-Type": "text/html" } }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, reason } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const subscriber = await client.fetch(
      `*[_type == "subscriber" && email == $email][0]`,
      { email: email.toLowerCase().trim() }
    );

    if (!subscriber) {
      return NextResponse.json(
        { error: "Subscriber not found" },
        { status: 404 }
      );
    }

    // Update subscriber status
    const now = new Date().toISOString();
    await writeClient
      .patch(subscriber._id)
      .set({
        subscribed: false,
        subscriptionStatus: "unsubscribed",
        unsubscribedAt: now,
        unsubscribeReason: reason || null,
      })
      .commit();

    // Remove from platform
    try {
      const platform = "resend" as "resend" | "mailchimp" | "kit";
      const provider = createProvider(platform);
      await provider.removeSubscriber(subscriber.email);
    } catch (error) {
      console.error("Failed to remove subscriber from platform:", error);
    }

    return NextResponse.json({
      success: true,
      message: "Successfully unsubscribed",
    });
  } catch (error: any) {
    console.error("Unsubscribe error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}


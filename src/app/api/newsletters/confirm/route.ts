import { NextRequest, NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/writeClient";
import { client } from "@/sanity/lib/client";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  if (!token || !email) {
    return new NextResponse(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>Confirmation Error</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
            .error { color: #d32f2f; }
          </style>
        </head>
        <body>
          <h1>Confirmation Error</h1>
          <p class="error">Invalid confirmation link. Please check your email and try again.</p>
        </body>
      </html>`,
      { status: 400, headers: { "Content-Type": "text/html" } }
    );
  }

  try {
    const subscriber = await client.fetch(
      `*[_type == "subscriber" && email == $email && confirmationToken == $token][0]`,
      { email: email.toLowerCase().trim(), token }
    );

    if (!subscriber) {
      return new NextResponse(
        `<!DOCTYPE html>
        <html>
          <head>
            <title>Confirmation Error</title>
            <style>
              body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
              .error { color: #d32f2f; }
            </style>
          </head>
          <body>
            <h1>Confirmation Error</h1>
            <p class="error">Invalid confirmation token or email address.</p>
          </body>
        </html>`,
        { status: 404, headers: { "Content-Type": "text/html" } }
      );
    }

    if (subscriber.subscriptionStatus === "subscribed") {
      return new NextResponse(
        `<!DOCTYPE html>
        <html>
          <head>
            <title>Already Confirmed</title>
            <style>
              body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
              .info { color: #1976d2; }
            </style>
          </head>
          <body>
            <h1>Already Confirmed</h1>
            <p class="info">Your subscription is already confirmed. You're all set!</p>
          </body>
        </html>`,
        { status: 200, headers: { "Content-Type": "text/html" } }
      );
    }

    // Confirm subscription
    const now = new Date().toISOString();
    await writeClient
      .patch(subscriber._id)
      .set({
        subscribed: true,
        subscriptionStatus: "subscribed",
        confirmedAt: now,
        confirmationToken: null, // Clear token after confirmation
      })
      .commit();

    return new NextResponse(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>Subscription Confirmed</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
            .success { color: #2e7d32; }
          </style>
        </head>
        <body>
          <h1>Subscription Confirmed!</h1>
          <p class="success">Thank you for confirming your subscription. You're now subscribed to our newsletter.</p>
          <p>You'll start receiving our latest updates and news in your inbox.</p>
        </body>
      </html>`,
      { status: 200, headers: { "Content-Type": "text/html" } }
    );
  } catch (error: any) {
    console.error("Confirmation error:", error);
    return new NextResponse(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>Confirmation Error</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
            .error { color: #d32f2f; }
          </style>
        </head>
        <body>
          <h1>Confirmation Error</h1>
          <p class="error">An error occurred while confirming your subscription. Please try again later or contact support.</p>
        </body>
      </html>`,
      { status: 500, headers: { "Content-Type": "text/html" } }
    );
  }
}


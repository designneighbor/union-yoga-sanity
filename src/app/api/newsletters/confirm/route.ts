import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/writeClient";
import { createProvider } from "@/lib/newsletter/providers";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get("token");

    if (!token) {
      return new NextResponse(
        `<!DOCTYPE html>
        <html>
          <head><title>Invalid Confirmation</title></head>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h1>Invalid Confirmation Link</h1>
            <p>The confirmation link is invalid or has expired.</p>
          </body>
        </html>`,
        {
          headers: { "Content-Type": "text/html" },
          status: 400,
        }
      );
    }

    // Find subscriber by confirmation token
    const subscriber = await client.fetch(
      `*[_type == "subscriber" && confirmationToken == $token][0]`,
      { token }
    );

    if (!subscriber) {
      return new NextResponse(
        `<!DOCTYPE html>
        <html>
          <head><title>Invalid Confirmation</title></head>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h1>Invalid Confirmation Link</h1>
            <p>The confirmation link is invalid or has expired.</p>
          </body>
        </html>`,
        {
          headers: { "Content-Type": "text/html" },
          status: 404,
        }
      );
    }

    if (subscriber.subscribed) {
      return new NextResponse(
        `<!DOCTYPE html>
        <html>
          <head><title>Already Confirmed</title></head>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h1>Already Confirmed</h1>
            <p>Your subscription is already confirmed. Thank you!</p>
          </body>
        </html>`,
        {
          headers: { "Content-Type": "text/html" },
        }
      );
    }

    // Update subscriber to confirmed
    const now = new Date().toISOString();
    await writeClient
      .patch(subscriber._id)
      .set({
        subscribed: true,
        confirmedAt: now,
      })
      .commit();

    // Add to provider subscriber list
    const provider = createProvider("resend");
    await provider.subscribe(subscriber.email, subscriber.tags || []);

    return new NextResponse(
      `<!DOCTYPE html>
      <html>
        <head><title>Subscription Confirmed</title></head>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h1 style="color: #1a202c;">Subscription Confirmed!</h1>
          <p>Thank you for confirming your subscription. You're all set to receive our newsletters.</p>
        </body>
      </html>`,
      {
        headers: { "Content-Type": "text/html" },
      }
    );
  } catch (error: any) {
    console.error("Confirm subscription error:", error);
    return new NextResponse(
      `<!DOCTYPE html>
      <html>
        <head><title>Error</title></head>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h1>Error</h1>
          <p>An error occurred while confirming your subscription. Please try again later.</p>
        </body>
      </html>`,
      {
        headers: { "Content-Type": "text/html" },
        status: 500,
      }
    );
  }
}


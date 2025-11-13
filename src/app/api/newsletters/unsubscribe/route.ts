import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/writeClient";
import { createProvider } from "@/lib/newsletter/providers";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get("token");
    const reason = searchParams.get("reason");

    if (!token) {
      return new NextResponse(
        `<!DOCTYPE html>
        <html>
          <head><title>Invalid Unsubscribe Link</title></head>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h1>Invalid Unsubscribe Link</h1>
            <p>The unsubscribe link is invalid or has expired.</p>
          </body>
        </html>`,
        {
          headers: { "Content-Type": "text/html" },
          status: 400,
        }
      );
    }

    // Find subscriber by confirmation token (we reuse it for unsubscribe)
    const subscriber = await client.fetch(
      `*[_type == "subscriber" && confirmationToken == $token][0]`,
      { token } as any
    );

    if (!subscriber) {
      return new NextResponse(
        `<!DOCTYPE html>
        <html>
          <head><title>Invalid Unsubscribe Link</title></head>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h1>Invalid Unsubscribe Link</h1>
            <p>The unsubscribe link is invalid or has expired.</p>
          </body>
        </html>`,
        {
          headers: { "Content-Type": "text/html" },
          status: 404,
        }
      );
    }

    if (!subscriber.subscribed) {
      return new NextResponse(
        `<!DOCTYPE html>
        <html>
          <head><title>Already Unsubscribed</title></head>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h1>Already Unsubscribed</h1>
            <p>You are already unsubscribed from our newsletter.</p>
          </body>
        </html>`,
        {
          headers: { "Content-Type": "text/html" },
        }
      );
    }

    // Update subscriber to unsubscribed
    const now = new Date().toISOString();
    await writeClient
      .patch(subscriber._id)
      .set({
        subscribed: false,
        unsubscribedAt: now,
        unsubscribeReason: reason || undefined,
      })
      .commit();

    // Remove from provider subscriber list
    const provider = createProvider("resend");
    await provider.unsubscribe(subscriber.email);

    return new NextResponse(
      `<!DOCTYPE html>
      <html>
        <head><title>Unsubscribed</title></head>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h1 style="color: #1a202c;">Successfully Unsubscribed</h1>
          <p>You have been unsubscribed from our newsletter. We're sorry to see you go!</p>
          <p style="margin-top: 30px; font-size: 14px; color: #8898aa;">
            If you change your mind, you can always subscribe again.
          </p>
        </body>
      </html>`,
      {
        headers: { "Content-Type": "text/html" },
      }
    );
  } catch (error: any) {
    console.error("Unsubscribe error:", error);
    return new NextResponse(
      `<!DOCTYPE html>
      <html>
        <head><title>Error</title></head>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h1>Error</h1>
          <p>An error occurred while unsubscribing. Please try again later.</p>
        </body>
      </html>`,
      {
        headers: { "Content-Type": "text/html" },
        status: 500,
      }
    );
  }
}


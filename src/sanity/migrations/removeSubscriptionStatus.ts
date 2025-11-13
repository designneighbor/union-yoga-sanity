/**
 * Migration script to remove the legacy subscriptionStatus field from subscriber documents
 * 
 * Run this script with:
 * npm run migrate:remove-subscription-status
 * 
 * Or directly with:
 * npx tsx src/sanity/migrations/removeSubscriptionStatus.ts
 */

import { writeClient } from "../lib/writeClient";
import { client } from "../lib/client";

async function removeSubscriptionStatus() {
  try {
    console.log("Fetching subscribers with subscriptionStatus field...");

    // Fetch all subscribers that have the subscriptionStatus field
    const subscribers = await client.fetch(
      `*[_type == "subscriber" && defined(subscriptionStatus)]{
        _id,
        subscriptionStatus,
        subscribed
      }`
    );

    if (!subscribers || subscribers.length === 0) {
      console.log("No subscribers with subscriptionStatus field found. Nothing to migrate.");
      return;
    }

    console.log(`Found ${subscribers.length} subscriber(s) with subscriptionStatus field.`);

    let successCount = 0;
    let errorCount = 0;

    for (const subscriber of subscribers) {
      try {
        // Remove the subscriptionStatus field
        await writeClient
          .patch(subscriber._id)
          .unset(["subscriptionStatus"])
          .commit();

        console.log(`✓ Removed subscriptionStatus from ${subscriber._id}`);
        successCount++;
      } catch (error: any) {
        console.error(
          `✗ Failed to remove subscriptionStatus from ${subscriber._id}:`,
          error.message
        );
        errorCount++;
      }
    }

    console.log("\n=== Migration Complete ===");
    console.log(`Successfully processed: ${successCount}`);
    console.log(`Errors: ${errorCount}`);
    console.log(`Total: ${subscribers.length}`);
  } catch (error: any) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

// Run the migration
removeSubscriptionStatus();


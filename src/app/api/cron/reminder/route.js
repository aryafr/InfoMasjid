import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { sendReminderEmail } from "@/lib/email";

// CRON_SECRET is used to prevent unauthorized execution
export async function GET(req) {
  try {
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const masjidsRef = adminDb.collection("masjids");
    const snapshot = await masjidsRef.where("subscription_status", "==", "active").get();

    if (snapshot.empty) {
      return NextResponse.json({ message: "No active subscriptions found" }, { status: 200 });
    }

    const now = new Date();
    let emailsSent = 0;

    for (const doc of snapshot.docs) {
      const data = doc.data();
      
      // Calculate remaining days
      let expireAt = null;
      if (data.subscription_expiry) {
        expireAt = new Date(data.subscription_expiry);
      } else if (data.created_at) {
        const createdAt = new Date(data.created_at);
        expireAt = new Date(createdAt.getTime() + (365 * 24 * 60 * 60 * 1000));
      }

      if (expireAt) {
        const diffTime = expireAt.getTime() - now.getTime();
        const remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // If exactly 7 days remaining, or 3 days, or 1 day, send an email
        if (remainingDays === 7 || remainingDays === 3 || remainingDays === 1) {
          if (data.email) {
            await sendReminderEmail(data.email, data.masjid_name, remainingDays);
            emailsSent++;
          }
        }
      }
    }

    return NextResponse.json({ message: `Successfully sent ${emailsSent} reminder emails` }, { status: 200 });
  } catch (error) {
    console.error("Cron Reminder Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

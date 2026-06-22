import { NextResponse } from "next/server";
import crypto from "crypto";
import { adminDb } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const payload = await req.json();

    // Verify Midtrans Signature Key
    const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
    const signatureInput = payload.order_id + payload.status_code + payload.gross_amount + serverKey;
    const expectedSignature = crypto.createHash("sha512").update(signatureInput).digest("hex");

    if (expectedSignature !== payload.signature_key) {
      console.error("Invalid Midtrans signature");
      return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
    }

    const { transaction_status, order_id } = payload;
    
    // Extract masjidId from order_id (e.g. "ORDER-masjid123-timestamp")
    const masjidIdMatch = order_id.match(/^ORDER-(.+)-[0-9]+$/);
    if (!masjidIdMatch) {
      console.warn("Ignored non-system order_id:", order_id);
      // Return 200 so Midtrans 'Test URL' feature passes successfully
      return NextResponse.json({ message: "Ignored format" }, { status: 200 });
    }
    const masjidId = masjidIdMatch[1];

    if (transaction_status === "settlement" || transaction_status === "capture") {
      // Fetch existing masjid data
      const docRef = adminDb.collection("masjids").doc(masjidId);
      const docSnap = await docRef.get();
      let newActiveUntil = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // default 1 year from now
      
      const packageType = payload.custom_field1;

      if (docSnap.exists) {
        const data = docSnap.data();
        let currentExpiry = data.active_until?.toDate() || (data.subscription_expiry ? new Date(data.subscription_expiry) : null);
        if (!currentExpiry && data.created_at) {
           currentExpiry = new Date(new Date(data.created_at).getTime() + 365 * 24 * 60 * 60 * 1000);
        }

        // Accumulate only if current expiry is in the future
        if (currentExpiry && currentExpiry.getTime() > Date.now()) {
          newActiveUntil = new Date(currentExpiry.getTime() + 365 * 24 * 60 * 60 * 1000);
        }
      }

      const activeUntilIso = newActiveUntil.toISOString();
      const updateData = {
        payment_status: "paid",
        active_until: newActiveUntil,
        subscription_status: "active",
        subscription_expiry: activeUntilIso,
        payment_history: FieldValue.arrayUnion({
          order_id: order_id,
          date: new Date().toISOString(),
          amount: payload.gross_amount,
          status: "success"
        })
      };

      if (packageType) {
        updateData.subscription_package = packageType;
      }

      // Payment Successful -> Update Firestore
      await docRef.set(updateData, { merge: true });

      // Fetch user email if possible, or we might not have it in webhook directly
      // Fallback: send to developer or check if customer_details is in payload
      const email = payload.customer_details?.email || process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL;
      if (email) {
        import("@/lib/email").then(module => {
           module.sendPaymentSuccessEmail(email, order_id, masjidId);
        });
      }

      console.log(`✅ Webhook processed successfully for: ${masjidId}`);
    } else if (transaction_status === "expire" || transaction_status === "cancel" || transaction_status === "deny") {
      // Payment failed
      await adminDb.collection("masjids").doc(masjidId).set({
        payment_status: transaction_status,
        subscription_status: "payment_failed",
        payment_history: FieldValue.arrayUnion({
          order_id: order_id,
          date: new Date().toISOString(),
          amount: payload.gross_amount,
          status: "failed"
        })
      }, { merge: true });
      console.log(`❌ Webhook processed failure for: ${masjidId}`);
    }

    return NextResponse.json({ status: "OK" });

  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

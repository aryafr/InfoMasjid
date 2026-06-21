import { NextResponse } from "next/server";
import crypto from "crypto";
import { adminDb, admin } from "@/lib/firebaseAdmin";

export async function POST(req) {
  try {
    const payload = await req.json();

    // Verify Midtrans Signature Key
    // signature_key = SHA512(order_id + status_code + gross_amount + ServerKey)
    const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
    const expectedHashStr = `${payload.order_id}${payload.status_code}${payload.gross_amount}${serverKey}`;
    const expectedSignature = crypto.createHash("sha512").update(expectedHashStr).digest("hex");

    if (payload.signature_key !== expectedSignature) {
      return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
    }

    const transactionStatus = payload.transaction_status;
    const fraudStatus = payload.fraud_status;
    
    // Extract masjidId from order_id (Format: ORDER-masjid-id-TIMESTAMP)
    const orderIdParts = payload.order_id.split("-");
    // If order_id is ORDER-masjid-dawatul-islam-1234567, masjidId is masjid-dawatul-islam
    const masjidId = orderIdParts.slice(1, orderIdParts.length - 1).join("-");

    if (!masjidId) {
      return NextResponse.json({ message: "Masjid ID not found in order" }, { status: 400 });
    }

    let newStatus = "pending_payment";

    if (transactionStatus === "capture") {
      if (fraudStatus === "challenge") {
        newStatus = "challenge";
      } else if (fraudStatus === "accept") {
        newStatus = "active";
      }
    } else if (transactionStatus === "settlement") {
      newStatus = "active";
    } else if (transactionStatus === "cancel" || transactionStatus === "deny" || transactionStatus === "expire") {
      newStatus = "failed";
    } else if (transactionStatus === "pending") {
      newStatus = "pending_payment";
    }

    // Update Firebase Document
    if (newStatus === "active") {
      // Set active until 1 year from now
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);

      await adminDb.collection("masjids").doc(masjidId).update({
        subscription_status: "active",
        subscription_expiry: expiryDate.toISOString(),
        payment_history: admin.firestore.FieldValue.arrayUnion({
          order_id: payload.order_id,
          amount: payload.gross_amount,
          date: new Date().toISOString(),
          payment_type: payload.payment_type
        })
      });
    } else if (newStatus === "failed") {
      await adminDb.collection("masjids").doc(masjidId).update({
        subscription_status: "failed",
      });
    }

    return NextResponse.json({ message: "Webhook processed successfully" }, { status: 200 });

  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

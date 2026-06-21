import { NextResponse } from "next/server";
import midtransClient from "midtrans-client";

export async function POST(req) {
  try {
    const { order_id, gross_amount, customer_details, masjidId } = await req.json();

    // Initialize Midtrans Snap API client
    let snap = new midtransClient.Snap({
      // We use Sandbox for testing. In production, change this to false.
      isProduction: false, 
      serverKey: process.env.MIDTRANS_SERVER_KEY,
    });

    let parameter = {
      transaction_details: {
        order_id: order_id,
        gross_amount: gross_amount,
      },
      customer_details: {
        first_name: customer_details.first_name,
        email: customer_details.email,
      },
      item_details: [
        {
          id: masjidId,
          price: gross_amount,
          quantity: 1,
          name: "Langganan InfoMasjid 1 Tahun"
        }
      ]
    };

    const transaction = await snap.createTransaction(parameter);
    
    return NextResponse.json({ 
      token: transaction.token,
      redirect_url: transaction.redirect_url 
    });

  } catch (error) {
    console.error("Midtrans Error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

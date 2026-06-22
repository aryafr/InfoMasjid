import { NextResponse } from "next/server";
import midtransClient from "midtrans-client";

export async function POST(req) {
  try {
    const { order_id, gross_amount, customer_details, masjidId, packageType = "berkah" } = await req.json();

    // 1. Validate Input
    if (!order_id || !gross_amount || !customer_details?.email || !masjidId) {
      return NextResponse.json({ message: "Invalid request. Missing required fields." }, { status: 400 });
    }

    // 2. Validate Price (Server-side Enforcement)
    const validPrices = [250000, 550000];
    if (!validPrices.includes(Number(gross_amount))) {
      return NextResponse.json({ message: "Invalid payment amount. Possible manipulation detected." }, { status: 400 });
    }

    // 3. Format Validation
    if (!order_id.startsWith("ORDER-")) {
      return NextResponse.json({ message: "Invalid order ID format." }, { status: 400 });
    }

    const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
    const isProduction = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true";

    let snap = new midtransClient.Snap({
      isProduction: isProduction, 
      serverKey: serverKey,
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
          name: `Langganan InfoMasjid 1 Tahun (${packageType === 'premium' ? 'Premium' : 'Berkah'})`
        }
      ],
      custom_field1: packageType
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

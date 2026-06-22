import { NextResponse } from "next/server";
import midtransClient from "midtrans-client";
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export async function POST(req) {
  try {
    const { order_id, gross_amount, customer_details, masjidId, packageType = "berkah", voucherCode = "" } = await req.json();

    // 1. Validate Input
    if (!order_id || !gross_amount || !customer_details?.email || !masjidId) {
      return NextResponse.json({ message: "Invalid request. Missing required fields." }, { status: 400 });
    }

    if (!order_id.startsWith("ORDER-")) {
      return NextResponse.json({ message: "Invalid order ID format." }, { status: 400 });
    }

    // 2. Fetch Global Pricing
    let basePrice = packageType === "premium" ? 550000 : 250000;
    
    try {
      if (db) {
        const pricingDoc = await getDoc(doc(db, 'configs', 'pricing'));
        if (pricingDoc.exists()) {
          const pricingData = pricingDoc.data();
          const pkgPricing = pricingData[packageType] || {};
          basePrice = pkgPricing.original_price || basePrice;
          if (pricingData.is_discount_active && pkgPricing.discounted_price) {
            basePrice = pkgPricing.discounted_price;
          }
        }
      }
    } catch (e) {
      console.warn("Could not fetch pricing configs:", e);
    }

    let finalPrice = basePrice;
    let discountAmount = 0;

    // 3. Validate Voucher (Server-side Enforcement)
    try {
      if (voucherCode && db) {
        const voucherDoc = await getDoc(doc(db, 'vouchers', voucherCode.toUpperCase()));
        if (voucherDoc.exists()) {
          const vData = voucherDoc.data();
          const isValid = vData.is_active && 
                          (!vData.valid_until || new Date() <= new Date(vData.valid_until)) && 
                          (!vData.max_uses || (vData.used_count || 0) < vData.max_uses);
          
          if (isValid) {
            if (vData.discount_type === 'percentage') {
              discountAmount = (basePrice * vData.discount_value) / 100;
            } else if (vData.discount_type === 'fixed') {
              discountAmount = vData.discount_value;
            }
            finalPrice = Math.max(0, basePrice - discountAmount);
          }
        }
      }
    } catch (e) {
      console.warn("Could not validate voucher:", e);
    }

    // 4. Validate Gross Amount against Final Price
    if (Number(gross_amount) !== finalPrice) {
      return NextResponse.json({ message: "Invalid payment amount. Possible manipulation detected." }, { status: 400 });
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
        gross_amount: finalPrice,
      },
      customer_details: {
        first_name: customer_details.first_name,
        email: customer_details.email,
      },
      item_details: [
        {
          id: masjidId,
          price: basePrice,
          quantity: 1,
          name: `Langganan InfoMasjid 1 Tahun (${packageType === 'premium' ? 'Premium' : 'Berkah'})`
        }
      ],
      custom_field1: packageType,
      custom_field2: voucherCode ? voucherCode.toUpperCase() : undefined
    };

    // Add discount item if applicable
    if (discountAmount > 0) {
      parameter.item_details.push({
        id: "VOUCHER-DISCOUNT",
        price: -discountAmount,
        quantity: 1,
        name: `Diskon Voucher (${voucherCode.toUpperCase()})`
      });
    }

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

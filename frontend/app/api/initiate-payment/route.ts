// /app/api/initiate-payment/route.ts
import { generateEsewaSignature } from "@/lib/generate-signature";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const { amount, productName, transactionId, method } = await req.json();

    if (!amount || !productName || !transactionId || !method) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    switch (method) {
      case "esewa": {
        const transactionUuid = `${Date.now()}-${uuidv4()}`;

        const esewaConfig = {
          amount,
          tax_amount: "0",
          total_amount: amount,
          transaction_uuid: transactionUuid,
          product_code: process.env.NEXT_PUBLIC_ESEWA_MERCHANT_CODE!,
          product_service_charge: "0",
          product_delivery_charge: "0",
          success_url: `${process.env.NEXT_PUBLIC_APIURL}/success?method=esewa`,
          failure_url: `${process.env.NEXT_PUBLIC_APIURL}/failure`,
          signed_field_names: "total_amount,transaction_uuid,product_code",
        };

        const signatureString = `total_amount=${esewaConfig.total_amount},transaction_uuid=${esewaConfig.transaction_uuid},product_code=${esewaConfig.product_code}`;
        const signature = generateEsewaSignature(
          process.env.NEXT_PUBLIC_ESEWA_SECRET_KEY!,
          signatureString,
        );

        return NextResponse.json({
          esewaConfig: { ...esewaConfig, signature },
        });
      }

      case "khalti": {
        const khaltiConfig = {
          return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?method=khalti`,
          website_url: process.env.NEXT_PUBLIC_BASE_URL!,
          amount: Math.round(parseFloat(amount) * 100), // convert to paisa
          purchase_order_id: transactionId,
          purchase_order_name: productName,
          customer_info: {
            name: "Test User",
            email: "test@test.com",
            phone: "9800000000",
          },
        };

        const response = await fetch(
          "https://a.khalti.com/api/v2/epayment/initiate/",
          {
            method: "POST",
            headers: {
              Authorization: `Key ${process.env.NEXT_PUBLIC_KHALTI_SECRET_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(khaltiConfig),
          },
        );

        if (!response.ok) {
          return NextResponse.json(
            { error: "Khalti initiation failed" },
            { status: 500 },
          );
        }

        const data = await response.json();
        return NextResponse.json({ khaltiPaymentUrl: data.payment_url });
      }

      default:
        return NextResponse.json({ error: "Invalid method" }, { status: 400 });
    }
  } catch (err) {
    return NextResponse.json(
      { error: "Server error", details: String(err) },
      { status: 500 },
    );
  }
}

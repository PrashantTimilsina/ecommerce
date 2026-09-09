// /app/api/verify-payment/route.ts
import { NextResponse } from "next/server";
import { verifyEsewaSignature } from "@/lib/generate-signature";
import { orderBackend } from "@/lib/order-backend";

export async function POST(req: Request) {
  try {
    const { data, method = "esewa" } = await req.json();

    if (typeof data !== "string" || !data || data.length > 16000) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    if (method === "esewa") {
      const decoded = JSON.parse(
        Buffer.from(data.replace(/ /g, "+"), "base64").toString("utf-8"),
      ) as Record<string, unknown>;

      const isValid = verifyEsewaSignature(
        process.env.ESEWA_SECRET_KEY!,
        decoded,
      );

      if (!isValid) {
        return NextResponse.json(
          { valid: false, error: "Signature verification failed" },
          { status: 400 },
        );
      }

      return await orderBackend("confirm", {
        transactionUuid: decoded.transaction_uuid,
      });
    }

    return NextResponse.json(
      { valid: false, error: "Unsupported method" },
      { status: 400 },
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Unable to verify and save your order. Refresh to retry; do not pay again." },
      { status: 500 },
    );
  }
}

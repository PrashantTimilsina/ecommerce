// /app/api/verify-payment/route.ts
import { NextResponse } from "next/server";
import { verifyEsewaSignature } from "@/lib/generate-signature";
import { checkEsewaTransactionStatus } from "@/lib/esewa-status";

export async function POST(req: Request) {
  try {
    const { data, method } = await req.json();

    if (!data) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    if (method === "esewa") {
      const decoded = JSON.parse(
        Buffer.from(data, "base64").toString("utf-8"),
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

      const statusCheck = await checkEsewaTransactionStatus({
        productCode: String(decoded.product_code ?? ""),
        totalAmount: Number(decoded.total_amount ?? 0),
        transactionUuid: String(decoded.transaction_uuid ?? ""),
      });

      const callbackStatus = String(decoded.status ?? "");
      const statusUnavailable =
        statusCheck.code === 0 || typeof statusCheck.status !== "string";

      const confirmed =
        statusCheck.status === "COMPLETE" ||
        (statusUnavailable && callbackStatus === "COMPLETE");

      return NextResponse.json({
        valid: true,
        confirmed,
        status: statusCheck.status ?? callbackStatus,
        refId: statusCheck.ref_id,
        transactionUuid: decoded.transaction_uuid,
        totalAmount: decoded.total_amount,
      });
    }

    return NextResponse.json(
      { valid: false, error: "Unsupported method" },
      { status: 400 },
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Server error", details: String(err) },
      { status: 500 },
    );
  }
}

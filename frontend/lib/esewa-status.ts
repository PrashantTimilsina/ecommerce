export interface EsewaStatusResponse {
  product_code?: string;
  transaction_uuid?: string;
  total_amount?: number;
  status?: string;
  ref_id?: string | null;
  code?: number;
  error_message?: string;
}

export async function checkEsewaTransactionStatus(params: {
  productCode: string;
  totalAmount: number | string;
  transactionUuid: string;
}): Promise<EsewaStatusResponse> {
  const isUat = process.env.ESEWA_ENV !== "production";
  const baseUrl = isUat
    ? "https://uat.esewa.com.np/api/epay/transaction/status/"
    : "https://epay.esewa.com.np/api/epay/transaction/status/";

  const query = new URLSearchParams({
    product_code: params.productCode,
    total_amount: String(params.totalAmount),
    transaction_uuid: params.transactionUuid,
  });

  try {
    const res = await fetch(`${baseUrl}?${query.toString()}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return { code: res.status, error_message: "Status request failed" };
    }

    const body = (await res.json()) as EsewaStatusResponse;

    if (body.code === 0) {
      return body;
    }

    return body;
  } catch {
    return { code: 0, error_message: "Service is currently unavailable" };
  }
}

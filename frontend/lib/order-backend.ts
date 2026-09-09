import "server-only";
import { cookies } from "next/headers";

export async function orderBackend(
  path: string,
  body: Record<string, unknown>,
) {
  const token = (await cookies()).get("token")?.value;
  if (!token)
    return Response.json(
      { error: "Please log in to complete your order." },
      { status: 401 },
    );
  const base = process.env.NEXT_PUBLIC_APIURL?.replace(/\/$/, "");
  if (!base)
    return Response.json(
      { error: "Order service is not configured." },
      { status: 503 },
    );
  const response = await fetch(`${base}/orders/${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
    cache: "no-store",
    signal: AbortSignal.timeout(20000),
  });
  const result = await response.json();
  return Response.json(
    response.ok
      ? result
      : {
          error:
            result.message ??
            "Unable to save your order. Refresh to retry; do not pay again.",
        },
    { status: response.status },
  );
}

export function readEsewaCallback(params: {
  get(name: string): string | null;
}) {
  let method = params.get("method");
  let data = params.get("data");
  // Older success URLs included ?method=esewa. Handle gateways appending
  // another ?data= rather than &data= to that URL.
  if (!data && method?.startsWith("esewa?data=")) {
    data = method.slice("esewa?data=".length);
    method = "esewa";
  }
  if (!method && data) method = "esewa";
  // URLSearchParams interprets unescaped '+' in base64 as a space.
  return { method, data: data?.replace(/ /g, "+") ?? null };
}

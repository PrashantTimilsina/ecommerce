import CryptoJS from "crypto-js";

export function generateEsewaSignature(
  secretKey: string,
  message: string,
): string {
  const hash = CryptoJS.HmacSHA256(message, secretKey);
  return CryptoJS.enc.Base64.stringify(hash);
}

export function verifyEsewaSignature(
  secretKey: string,
  payload: Record<string, unknown>,
): boolean {
  const signedFieldNames = String(payload.signed_field_names ?? "")
    .split(",")
    .map((field) => field.trim())
    .filter(Boolean);

  if (signedFieldNames.length === 0 || typeof payload.signature !== "string") {
    return false;
  }

  const message = signedFieldNames
    .map((field) => `${field}=${payload[field] ?? ""}`)
    .join(",");

  const expected = generateEsewaSignature(secretKey, message);
  return expected === payload.signature;
}

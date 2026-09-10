export function encodeBase64(text: string): string {
  // TextEncoder would silently replace unpaired UTF-16 surrogates.
  if (!text.isWellFormed()) throw new Error("Input contains an unpaired Unicode surrogate.");
  let binary = "";
  for (const byte of new TextEncoder().encode(text)) binary += String.fromCharCode(byte);
  return btoa(binary);
}
export function decodeBase64(encoded: string): string {
  const normal = encoded.trim().replace(/-/g, "+").replace(/_/g, "/");
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(normal) || normal.replace(/=+$/, "").length % 4 === 1) throw new Error("Invalid Base64 string.");
  const binary = atob(normal);
  return new TextDecoder("utf-8", { fatal: true }).decode(Uint8Array.from(binary, char => char.charCodeAt(0)));
}
export type EncodeType = "url" | "urlComponent" | "formData" | "base64";
export function transformEncoding(text: string, type: EncodeType, encode: boolean): string {
  if (type === "base64") return encode ? encodeBase64(text) : decodeBase64(text);
  if (type === "url") return encode ? encodeURI(text) : decodeURI(text);
  if (type === "urlComponent") return encode ? encodeURIComponent(text) : decodeURIComponent(text);
  // Form pairs preserve repeated keys and '=' inside a value. '&' separates pairs.
  const convert = (value: string) => encode
    ? encodeURIComponent(value).replace(/%20/g, "+").replace(/[!'()~]/g, c => `%${c.charCodeAt(0).toString(16).toUpperCase()}`)
    : decodeURIComponent(value.replace(/\+/g, " "));
  return text.split("&").map(pair => {
    const index = pair.indexOf("=");
    return index < 0 ? convert(pair) : `${convert(pair.slice(0, index))}=${convert(pair.slice(index + 1))}`;
  }).join("&");
}

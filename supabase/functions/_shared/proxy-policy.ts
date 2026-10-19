export const MAX_REQUEST_BYTES = 512 * 1024;
export const MAX_RESPONSE_BYTES = 10 * 1024 * 1024;
export class ProxyError extends Error {
  constructor(message: string, public status: number) { super(message); }
}
export async function hasProxyAccess(provided: string | null, secret: string | undefined): Promise<boolean> {
  if (!secret || secret.length < 32 || !provided || provided.length > 1024) return false;
  const encode = (value: string) => crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  const [left, right] = await Promise.all([encode(provided), encode(secret)]);
  const a = new Uint8Array(left), b = new Uint8Array(right);
  let difference = 0;
  for (let i = 0; i < a.length; i++) difference |= a[i] ^ b[i];
  return difference === 0;
}
/** Fail closed for private, special-use, malformed and non-global addresses. */
export function isPublicAddress(raw: string): boolean {
  const ip = raw.toLowerCase().replace(/^\[|\]$/g, "");
  const octets = ip.split(".").map(Number);
  if (/^\d+\.\d+\.\d+\.\d+$/.test(ip)) {
    if (octets.some(part => part < 0 || part > 255)) return false;
    const [a, b, c] = octets;
    return !(a === 0 || a === 10 || a === 127 || a >= 224 ||
      (a === 100 && b >= 64 && b <= 127) || (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) || (a === 192 && (b === 168 || b === 0)) ||
      (a === 198 && (b === 18 || b === 19 || (b === 51 && c === 100))) ||
      (a === 203 && b === 0 && c === 113));
  }
  if (!ip.includes(":")) return false;
  let normalized: string;
  try { normalized = new URL(`https://[${ip}]/`).hostname.slice(1, -1); } catch { return false; }
  return /^[23][0-9a-f]{3}:/.test(normalized) && !/^2001:(?:db8|0|10|20|2):/.test(normalized) && !normalized.startsWith("2002:");
}
/** Exact operator-approved origins, HTTPS on port 443 only; no wildcard domains. */
export function approvedDestination(raw: unknown, configured: string | undefined): URL {
  if (typeof raw !== "string" || raw.length > 8192) throw new ProxyError("Invalid destination URL", 400);
  let url: URL;
  try { url = new URL(raw); } catch { throw new ProxyError("Invalid destination URL", 400); }
  if (url.protocol !== "https:" || url.username || url.password || (url.port && url.port !== "443")) throw new ProxyError("Only approved HTTPS destinations on port 443 are supported", 403);
  const host = url.hostname.replace(/^\[|\]$/g, "");
  if (!host.includes(".") && !host.includes(":")) throw new ProxyError("Blocked destination", 403);
  if (/\.(?:local|internal|localhost|onion)$/.test(host) || host === "metadata.google.internal") throw new ProxyError("Blocked destination", 403);
  if ((host.includes(":") || /^[\d.]+$/.test(host)) && !isPublicAddress(host)) throw new ProxyError("Blocked destination", 403);
  const origins = (configured || "").split(",").map(value => value.trim()).filter(Boolean);
  if (!origins.includes(url.origin)) throw new ProxyError("Destination is not enabled by this deployment", 403);
  url.hash = "";
  return url;
}
export async function readLimitedText(stream: ReadableStream<Uint8Array> | null, max: number): Promise<string> {
  if (!stream) return "";
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > max) { await reader.cancel(); throw new ProxyError("Payload exceeds the size limit", 413); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return new TextDecoder().decode(bytes);
}

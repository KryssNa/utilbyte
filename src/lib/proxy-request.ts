import { lookup } from "node:dns/promises";
import { checkServerIdentity } from "node:tls";
import { isIP } from "node:net";
import { request } from "node:https";
import { isPublicAddress, MAX_RESPONSE_BYTES, ProxyError } from "../../supabase/functions/_shared/proxy-policy";

/** Resolve once, check every answer, and connect to the checked IP to prevent DNS rebinding. */
export async function proxyRequest(url: URL, method: string, headers: Record<string, string>, body: string) {
  const host = url.hostname.replace(/^\[|\]$/g, "");
  let dnsTimer: ReturnType<typeof setTimeout> | undefined;
  let addresses: { address: string; family: number }[];
  try {
    addresses = isIP(host) ? [{ address: host, family: isIP(host) }] : await Promise.race([
      lookup(host, { all: true }),
      new Promise<never>((_resolve, reject) => { dnsTimer = setTimeout(() => reject(new ProxyError("DNS lookup timed out", 504)), 5000); }),
    ]);
  } finally { clearTimeout(dnsTimer); }
  if (!addresses.length || addresses.some(item => !isPublicAddress(item.address))) throw new ProxyError("Destination resolves to a blocked address", 403);
  const started = Date.now();
  return new Promise<{ status: number; statusText: string; headers: Record<string, string>; body: string; time: number; size: number }>((resolve, reject) => {
    const req = request({
      hostname: addresses[0].address, port: 443, servername: isIP(host) ? undefined : host,
      path: url.pathname + url.search, method,
      checkServerIdentity: (_hostname, certificate) => checkServerIdentity(host, certificate),
      headers: { ...headers, host: url.host, "accept-encoding": "identity" },
    }, async response => {
      try {
        const chunks: Buffer[] = [];
        let size = 0;
        for await (const part of response) {
          const chunk = Buffer.isBuffer(part) ? part : Buffer.from(part);
          size += chunk.length;
          if (size > MAX_RESPONSE_BYTES) { req.destroy(); throw new ProxyError("Upstream response exceeds 10 MB", 502); }
          chunks.push(chunk);
        }
        const responseHeaders: Record<string, string> = {};
        for (const [key, value] of Object.entries(response.headers)) {
          if (value !== undefined) responseHeaders[key] = Array.isArray(value) ? value.join(", ") : value;
        }
        resolve({ status: response.statusCode || 502, statusText: response.statusMessage || "", headers: responseHeaders,
          body: Buffer.concat(chunks).toString("utf8"), time: Date.now() - started, size });
      } catch (error) { reject(error); } finally { clearTimeout(timer); }
    });
    const timer = setTimeout(() => req.destroy(new ProxyError("Upstream request timed out", 504)), 10000);
    req.on("error", error => { clearTimeout(timer); reject(error); });
    req.end(body || undefined);
  });
}

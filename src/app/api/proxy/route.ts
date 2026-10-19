import { NextRequest, NextResponse } from "next/server";
import { approvedDestination, hasProxyAccess, MAX_REQUEST_BYTES, ProxyError, readLimitedText } from "../../../../supabase/functions/_shared/proxy-policy";
import { proxyRequest } from "@/lib/proxy-request";

export const runtime = "nodejs";
const securityHeaders = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" };
const methods = new Set(["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"]);
const headerNames = new Set(["accept", "accept-language", "authorization", "cache-control", "content-type", "if-match", "if-none-match", "x-api-key", "x-request-id"]);
// ponytail: per-instance backstop; use platform rate limits for a cluster-wide quota.
let count = 0, windowStart = 0;
export async function POST(request: NextRequest) {
  const respond = (data: unknown, status: number) => NextResponse.json(data, { status, headers: securityHeaders });
  try {
    if (!await hasProxyAccess(request.headers.get("x-utilbyte-proxy-token"), process.env.PROXY_ACCESS_TOKEN)) return respond({ error: "Server proxy requires an operator access token" }, 403);
    const origin = request.headers.get("origin");
    const allowedOrigin = new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://utilbyte.app").origin;
    if (origin !== allowedOrigin && !(process.env.NODE_ENV !== "production" && origin === request.nextUrl.origin)) return respond({ error: "Forbidden origin" }, 403);
    if (Date.now() - windowStart >= 60000) { count = 0; windowStart = Date.now(); }
    if (++count > 30) return NextResponse.json({ error: "Proxy rate limit exceeded" }, { status: 429, headers: { ...securityHeaders, "Retry-After": "60" } });
    let payload: unknown;
    try { payload = JSON.parse(await readLimitedText(request.body, MAX_REQUEST_BYTES)); }
    catch (error) { if (error instanceof ProxyError) throw error; throw new ProxyError("Invalid JSON request", 400); }
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) throw new ProxyError("Invalid proxy request", 400);
    const { url: rawUrl, method = "GET", headers, body = "" } = payload as Record<string, unknown>;
    const url = approvedDestination(rawUrl, process.env.PROXY_ALLOWED_ORIGINS);
    if (typeof method !== "string" || !methods.has(method) || typeof body !== "string") throw new ProxyError("Invalid method or body", 400);
    const safeHeaders: Record<string, string> = {};
    if (headers && typeof headers === "object" && !Array.isArray(headers)) {
      for (const [key, value] of Object.entries(headers)) if (headerNames.has(key.toLowerCase()) && typeof value === "string") safeHeaders[key.toLowerCase()] = value;
    }
    return respond(await proxyRequest(url, method, safeHeaders, ["GET", "HEAD"].includes(method) ? "" : body), 200);
  } catch (error) {
    return respond({ error: error instanceof ProxyError ? error.message : "Upstream request failed" }, error instanceof ProxyError ? error.status : 502);
  }
}

import { NextRequest, NextResponse } from "next/server";

const ALLOWED_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"];

// Headers that clients are allowed to send through the proxy
const ALLOWED_REQUEST_HEADERS = new Set([
  "accept",
  "accept-encoding",
  "accept-language",
  "authorization",
  "cache-control",
  "content-type",
  "content-length",
  "if-match",
  "if-modified-since",
  "if-none-match",
  "if-unmodified-since",
  "origin",
  "pragma",
  "user-agent",
  "x-api-key",
  "x-request-id",
]);

const MAX_RESPONSE_BYTES = 10 * 1024 * 1024; // 10 MB

// SSRF guard: reject requests to loopback, link-local, and private IP ranges
function isBlockedHost(hostname: string): boolean {
  if (
    hostname === "localhost" ||
    hostname === "::1" ||
    hostname.endsWith(".local") ||
    hostname.endsWith(".internal")
  ) {
    return true;
  }

  // IPv4 addresses
  const ipv4 = hostname.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4) {
    const [, a, b, c] = ipv4.map(Number);
    if (
      a === 127 || // loopback
      a === 10 || // private class A
      (a === 172 && b >= 16 && b <= 31) || // private class B
      (a === 192 && b === 168) || // private class C
      (a === 169 && b === 254) || // link-local
      a === 0 || // "this" network
      a === 100 && b >= 64 && b <= 127 // carrier-grade NAT
    ) {
      return true;
    }
  }

  return false;
}

export async function POST(request: NextRequest) {
  try {
    const { url, method, headers: reqHeaders, body } = await request.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Missing or invalid URL" }, { status: 400 });
    }

    // Validate URL structure and protocol
    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return NextResponse.json({ error: "Only HTTP and HTTPS URLs are allowed" }, { status: 400 });
    }

    if (isBlockedHost(parsed.hostname)) {
      return NextResponse.json({ error: "Requests to internal addresses are not allowed" }, { status: 400 });
    }

    if (!ALLOWED_METHODS.includes(method)) {
      return NextResponse.json({ error: "Invalid HTTP method" }, { status: 400 });
    }

    // Filter headers to the allowed set
    const safeHeaders: Record<string, string> = {};
    if (reqHeaders && typeof reqHeaders === "object") {
      for (const [key, value] of Object.entries(reqHeaders)) {
        if (ALLOWED_REQUEST_HEADERS.has(key.toLowerCase()) && typeof value === "string") {
          safeHeaders[key] = value;
        }
      }
    }

    const start = Date.now();

    const fetchOptions: RequestInit = {
      method,
      headers: safeHeaders,
    };

    if (body && !["GET", "HEAD"].includes(method)) {
      fetchOptions.body = body;
    }

    const upstream = await fetch(url, fetchOptions);
    const elapsed = Date.now() - start;

    // Read response with size cap
    const reader = upstream.body?.getReader();
    const chunks: Uint8Array[] = [];
    let totalBytes = 0;
    let truncated = false;

    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        totalBytes += value.length;
        if (totalBytes > MAX_RESPONSE_BYTES) {
          truncated = true;
          reader.cancel();
          break;
        }
        chunks.push(value);
      }
    }

    const merged = new Uint8Array(chunks.reduce((acc, c) => acc + c.length, 0));
    let offset = 0;
    for (const chunk of chunks) {
      merged.set(chunk, offset);
      offset += chunk.length;
    }

    const responseBody = new TextDecoder().decode(merged) + (truncated ? "\n[Response truncated — exceeds 10 MB limit]" : "");

    const responseHeaders: Record<string, string> = {};
    upstream.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    return NextResponse.json({
      status: upstream.status,
      statusText: upstream.statusText,
      headers: responseHeaders,
      body: responseBody,
      time: elapsed,
      size: totalBytes,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Proxy request failed" },
      { status: 500 }
    );
  }
}

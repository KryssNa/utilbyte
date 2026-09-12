import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { createUtilByteMcpServer } from "./server";
import { createMcpRateLimiter } from "./rate-limit";

export const MAX_MCP_BODY_BYTES = 131_072;
const PRODUCTION_ORIGINS = new Set(["https://utilbyte.app", "https://www.utilbyte.app"]);
const allowRequest = createMcpRateLimiter();
let activeRequests = 0;

function error(status: number, message: string, code = -32000) {
  return Response.json({ jsonrpc: "2.0", id: null, error: { code, message } }, {
    status, headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" },
  });
}

function isAllowedOrigin(origin: string): boolean {
  if (PRODUCTION_ORIGINS.has(origin)) return true;
  if (process.env.NODE_ENV === "production") return false;
  try {
    const url = new URL(origin);
    return url.protocol === "http:" && ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname) && url.origin === origin;
  } catch { return false; }
}

/** Bound streamed bodies too; Content-Length alone is not trustworthy. */
async function readBody(request: Request): Promise<string | null> {
  if (Number(request.headers.get("content-length")) > MAX_MCP_BODY_BYTES) return null;
  if (!request.body) return "";
  const reader = request.body.getReader();
  const decoder = new TextDecoder("utf-8", { fatal: true });
  let size = 0, body = "";
  let timedOut = false;
  const timer = setTimeout(() => { timedOut = true; void reader.cancel().catch(() => {}); }, 5000);
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (timedOut) throw new Error("Request body timed out.");
      if (done) break;
      size += value.byteLength;
      if (size > MAX_MCP_BODY_BYTES) {
        await reader.cancel();
        return null;
      }
      body += decoder.decode(value, { stream: true });
    }
    return body + decoder.decode();
  } finally { clearTimeout(timer); reader.releaseLock(); }
}

export async function handleMcpRequest(request: Request): Promise<Response> {
  // Non-browser MCP clients normally omit Origin. Never reflect arbitrary origins.
  const origin = request.headers.get("origin");
  if (origin && !isAllowedOrigin(origin)) return error(403, "Origin is not allowed.");
  if (request.method !== "POST") {
    const response = error(405, "Use Streamable HTTP POST. This stateless endpoint has no SSE subscription or session deletion.");
    response.headers.set("Allow", "POST");
    return response;
  }
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") return error(415, "Content-Type must be application/json.");
  // Only trust Vercel's platform-supplied address header when running on Vercel.
  // Other hosts share an anonymous bucket unless rate limits are added upstream.
  const identity = process.env.VERCEL === "1" ? (request.headers.get("x-vercel-forwarded-for")?.split(",")[0].trim().slice(0, 128) || "anonymous") : "anonymous";
  if (activeRequests >= 8 || !allowRequest(identity)) {
    const response = error(429, "Too many MCP requests. Try again in a minute.");
    response.headers.set("Retry-After", "60");
    return response;
  }
  activeRequests++;
  try { return await handlePost(request); }
  finally { activeRequests--; }
}

async function handlePost(request: Request): Promise<Response> {
  let parsedBody: unknown;
  try {
    const body = await readBody(request);
    if (body === null) return error(413, "Request body exceeds 128 KiB.");
    parsedBody = JSON.parse(body);
  } catch { return error(400, "Invalid JSON request.", -32700); }
  // MCP no longer supports JSON-RPC batches; reject before constructing a server.
  if (Array.isArray(parsedBody)) return error(400, "Send one MCP message per request.", -32600);
  const server = createUtilByteMcpServer();
  const transport = new WebStandardStreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true });
  try {
    await server.connect(transport);
    const response = await transport.handleRequest(request, { parsedBody });
    response.headers.set("Cache-Control", "no-store");
    response.headers.set("X-Content-Type-Options", "nosniff");
    return response;
  } catch { return error(500, "MCP request could not be completed.", -32603); }
  finally { await server.close(); }
}

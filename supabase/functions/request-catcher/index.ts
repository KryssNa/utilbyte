import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { approvedDestination, hasProxyAccess, MAX_REQUEST_BYTES, MAX_RESPONSE_BYTES, ProxyError, readLimitedText } from "../_shared/proxy-policy.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey, X-Bin-Id, X-Utilbyte-Proxy-Token",
};

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" },
  });
}

async function forwardRequest(
  targetBase: string, method: string, subPath: string,
  queryParams: Record<string, string>, headers: Record<string, string>, body: string
): Promise<{ status: number; response: string; error: string | null }> {
  try {
    const target = new URL(targetBase);
    target.pathname = target.pathname.replace(/\/$/, "") + (subPath || "/");
    Object.entries(queryParams).forEach(([key, value]) => target.searchParams.set(key, value));
    approvedDestination(target.href, Deno.env.get("PROXY_ALLOWED_ORIGINS"));
    const secret = Deno.env.get("PROXY_ACCESS_TOKEN");
    if (!secret || secret.length < 32) throw new Error("Forwarding is not configured");
    // All user-controlled egress is delegated to the DNS-pinned Next.js relay.
    // This bridge URL is deployment configuration, never taken from a request.
    const bridge = new URL(Deno.env.get("UTILBYTE_PROXY_URL") || "https://utilbyte.app/api/proxy");
    if (bridge.protocol !== "https:" || bridge.username || bridge.password) throw new Error("Invalid relay configuration");
    const result = await fetch(bridge, {
      method: "POST", redirect: "error", signal: AbortSignal.timeout(12000),
      headers: { "Content-Type": "application/json", "Origin": bridge.origin, "x-utilbyte-proxy-token": secret },
      body: JSON.stringify({ url: target.href, method, headers: { "Content-Type": headers["content-type"] || "text/plain", "X-Request-Id": crypto.randomUUID() }, body }),
    });
    const data = JSON.parse(await readLimitedText(result.body, MAX_RESPONSE_BYTES + 65536));
    if (!result.ok) return { status: 0, response: "", error: data.error || "Forwarding refused" };
    return { status: data.status, response: String(data.body || "").slice(0, 10000), error: null };
  } catch (error) {
    return { status: 0, response: "", error: error instanceof Error ? error.message : "Forwarding failed" };
  }
}

// ponytail: per-instance backstop; configure edge/platform limits for distributed traffic.
let requests = 0, rateExpires = 0;
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const now = Date.now();
    if (now >= rateExpires) { requests = 0; rateExpires = now + 60000; }
    if (++requests > 120) return jsonResponse({ error: "Request catcher rate limit exceeded" }, 429);
    const rawBody = await readLimitedText(req.body, MAX_REQUEST_BYTES);
    const url = new URL(req.url);
    const pathParts = url.pathname.split("/").filter(Boolean);

    const fnIndex = pathParts.findIndex((p) => p === "request-catcher");
    const binId = fnIndex >= 0 ? pathParts[fnIndex + 1] : (url.searchParams.get("bin") || "");

    if (!/^[a-zA-Z0-9_-]{1,64}$/.test(binId)) {
      return jsonResponse({ error: "Missing bin_id. Use /request-catcher/{bin_id}" }, 400);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const action = url.searchParams.get("action");

    if (action === "list") {
      const parsedLimit = Number(url.searchParams.get("limit") || "100");
      const limit = Number.isFinite(parsedLimit) ? Math.max(1, Math.min(Math.trunc(parsedLimit), 200)) : 100;
      const [reqResult, binResult] = await Promise.all([
        supabase
          .from("caught_requests")
          .select("*")
          .eq("bin_id", binId)
          .order("created_at", { ascending: false })
          .limit(limit),
        supabase
          .from("request_catcher_bins")
          .select("*")
          .eq("bin_id", binId)
          .maybeSingle(),
      ]);

      if (reqResult.error) return jsonResponse({ error: reqResult.error.message }, 500);

      return jsonResponse({
        requests: reqResult.data || [],
        bin: binResult.data || null,
      });
    }

    if (action === "clear") {
      const { error } = await supabase
        .from("caught_requests")
        .delete()
        .eq("bin_id", binId);

      if (error) return jsonResponse({ error: error.message }, 500);
      return jsonResponse({ cleared: true });
    }

    if (action === "get-config") {
      const { data, error } = await supabase
        .from("request_catcher_bins")
        .select("*")
        .eq("bin_id", binId)
        .maybeSingle();

      if (error) return jsonResponse({ error: error.message }, 500);
      return jsonResponse({ bin: data || null });
    }

    if (action === "set-config" && req.method === "POST") {
      if (!await hasProxyAccess(req.headers.get("x-utilbyte-proxy-token"), Deno.env.get("PROXY_ACCESS_TOKEN"))) return jsonResponse({ error: "Changing forwarding settings requires an operator access token" }, 403);
      let payload: { forward_url?: unknown; forward_enabled?: unknown };
      try { payload = JSON.parse(rawBody); } catch { return jsonResponse({ error: "Invalid JSON" }, 400); }
      if (!payload || typeof payload !== "object" || typeof payload.forward_url !== "string" || typeof payload.forward_enabled !== "boolean") return jsonResponse({ error: "Invalid forwarding settings" }, 400);
      const forwardUrl = payload.forward_url.trim();
      if (forwardUrl) approvedDestination(forwardUrl, Deno.env.get("PROXY_ALLOWED_ORIGINS"));
      const forwardEnabled = payload.forward_enabled && Boolean(forwardUrl);

      const { data: existing } = await supabase
        .from("request_catcher_bins")
        .select("bin_id")
        .eq("bin_id", binId)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from("request_catcher_bins")
          .update({ forward_url: forwardUrl, forward_enabled: forwardEnabled, updated_at: new Date().toISOString() })
          .eq("bin_id", binId);
        if (error) return jsonResponse({ error: error.message }, 500);
      } else {
        const { error } = await supabase
          .from("request_catcher_bins")
          .insert({ bin_id: binId, forward_url: forwardUrl, forward_enabled: forwardEnabled });
        if (error) return jsonResponse({ error: error.message }, 500);
      }

      return jsonResponse({ saved: true, forward_url: forwardUrl, forward_enabled: forwardEnabled });
    }

    const headers: Record<string, string> = {};
    req.headers.forEach((value, key) => {
      const lower = key.toLowerCase();
      if (!["authorization", "cookie", "apikey", "x-utilbyte-proxy-token"].includes(lower)) headers[lower] = value;
    });

    const queryParams: Record<string, string> = {};
    url.searchParams.forEach((value, key) => {
      if (key !== "bin" && key !== "action") queryParams[key] = value;
    });

    const body = rawBody;

    const subPathIndex = fnIndex >= 0 ? fnIndex + 2 : 2;
    const subPath = pathParts.slice(subPathIndex).join("/");
    const requestPath = subPath ? `/${subPath}` : "/";

    const binConfigResult = await supabase
      .from("request_catcher_bins")
      .select("forward_url, forward_enabled")
      .eq("bin_id", binId)
      .maybeSingle();

    const binData = binConfigResult.data;

    const insertPayload: Record<string, unknown> = {
      bin_id: binId,
      method: req.method,
      path: requestPath,
      headers,
      query_params: queryParams,
      body,
      content_type: req.headers.get("content-type") || "",
      ip_address:
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        req.headers.get("cf-connecting-ip") ||
        "",
    };

    if (binData?.forward_enabled && binData?.forward_url) {
      const fwd = await forwardRequest(
        binData.forward_url,
        req.method,
        requestPath,
        queryParams,
        headers,
        body
      );
      insertPayload.forward_status = fwd.status || null;
      insertPayload.forward_error = fwd.error || null;
      insertPayload.forward_response = fwd.response || null;
      insertPayload.forwarded_at = new Date().toISOString();
    }

    const { error: insertError } = await supabase
      .from("caught_requests")
      .insert(insertPayload);

    if (insertError) return jsonResponse({ error: insertError.message }, 500);

    const resp: Record<string, unknown> = {
      captured: true,
      bin_id: binId,
      method: req.method,
    };

    if (insertPayload.forward_status !== undefined) {
      resp.forwarded = true;
      resp.forward_status = insertPayload.forward_status;
      if (insertPayload.forward_error) resp.forward_error = insertPayload.forward_error;
    }

    return jsonResponse(resp);
  } catch (err) {
    return jsonResponse({ error: err instanceof ProxyError ? err.message : "Request catcher failed" }, err instanceof ProxyError ? err.status : 500);
  }
});

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey, X-Bin-Id",
};

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function forwardRequest(
  targetBase: string,
  method: string,
  subPath: string,
  queryParams: Record<string, string>,
  headers: Record<string, string>,
  body: string
): Promise<{ status: number; response: string; error: string | null }> {
  try {
    const forwardUrl = new URL(targetBase.replace(/\/$/, "") + (subPath || "/"));
    Object.entries(queryParams).forEach(([k, v]) => forwardUrl.searchParams.set(k, v));

    const forwardHeaders: Record<string, string> = {};
    const skipHeaders = new Set([
      "host", "connection", "transfer-encoding", "content-length",
      "authorization", "x-forwarded-for", "cf-connecting-ip",
      "x-real-ip", "cf-ray", "cf-ipcountry",
    ]);
    Object.entries(headers).forEach(([k, v]) => {
      if (!skipHeaders.has(k.toLowerCase())) forwardHeaders[k] = v;
    });
    forwardHeaders["X-Forwarded-By"] = "UtilByte-RequestCatcher";

    const init: RequestInit = {
      method,
      headers: forwardHeaders,
      signal: AbortSignal.timeout(15000),
    };

    if (method !== "GET" && method !== "HEAD" && body) {
      init.body = body;
    }

    const res = await fetch(forwardUrl.toString(), init);
    let responseText = "";
    try {
      responseText = await res.text();
      if (responseText.length > 10000) responseText = responseText.slice(0, 10000) + "...[truncated]";
    } catch {
      responseText = "";
    }

    return { status: res.status, response: responseText, error: null };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { status: 0, response: "", error: msg };
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split("/").filter(Boolean);

    const fnIndex = pathParts.findIndex((p) => p === "request-catcher");
    const binId = fnIndex >= 0 ? pathParts[fnIndex + 1] : (url.searchParams.get("bin") || "");

    if (!binId) {
      return jsonResponse({ error: "Missing bin_id. Use /request-catcher/{bin_id}" }, 400);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const action = url.searchParams.get("action");

    if (action === "list") {
      const limit = Math.min(parseInt(url.searchParams.get("limit") || "100", 10), 200);
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
      let payload: { forward_url?: string; forward_enabled?: boolean } = {};
      try { payload = await req.json(); } catch { /* empty */ }

      const forwardUrl = (payload.forward_url ?? "").trim();
      const forwardEnabled = payload.forward_enabled ?? (forwardUrl.length > 0);

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
      if (lower !== "authorization") headers[lower] = value;
    });

    const queryParams: Record<string, string> = {};
    url.searchParams.forEach((value, key) => {
      if (key !== "bin" && key !== "action") queryParams[key] = value;
    });

    let body = "";
    try {
      if (req.method !== "GET" && req.method !== "HEAD") {
        body = await req.text();
      }
    } catch {
      body = "";
    }

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
    return jsonResponse({ error: err instanceof Error ? err.message : "Unknown error" }, 500);
  }
});

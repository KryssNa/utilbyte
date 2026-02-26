import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey, X-Bin-Id",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split("/").filter(Boolean);
    const binId = pathParts[1] || url.searchParams.get("bin") || "";

    if (!binId) {
      return new Response(
        JSON.stringify({ error: "Missing bin_id. Use /request-catcher/{bin_id}" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const action = url.searchParams.get("action");

    if (action === "list") {
      const limit = parseInt(url.searchParams.get("limit") || "50", 10);
      const { data, error } = await supabase
        .from("caught_requests")
        .select("*")
        .eq("bin_id", binId)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ requests: data || [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "clear") {
      const { error } = await supabase
        .from("caught_requests")
        .delete()
        .eq("bin_id", binId);

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ cleared: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const headers: Record<string, string> = {};
    req.headers.forEach((value, key) => {
      headers[key] = value;
    });

    const queryParams: Record<string, string> = {};
    url.searchParams.forEach((value, key) => {
      if (key !== "bin") queryParams[key] = value;
    });

    let body = "";
    try {
      body = await req.text();
    } catch {
      body = "";
    }

    const subPath = pathParts.slice(2).join("/");

    const { error } = await supabase.from("caught_requests").insert({
      bin_id: binId,
      method: req.method,
      path: subPath ? `/${subPath}` : "/",
      headers,
      query_params: queryParams,
      body,
      content_type: req.headers.get("content-type") || "",
      ip_address: headers["x-forwarded-for"] || headers["cf-connecting-ip"] || "",
    });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ captured: true, bin_id: binId, method: req.method }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

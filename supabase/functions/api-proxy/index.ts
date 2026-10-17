import "jsr:@supabase/functions-js/edge-runtime.d.ts";
// No current UI calls this legacy relay. All proxy egress uses the authenticated,
// DNS-pinned Next.js endpoint instead of a second public relay.
Deno.serve(() => new Response(JSON.stringify({ error: "This relay is retired. Use the authenticated UtilByte /api/proxy endpoint." }), {
  status: 410,
  headers: { "Content-Type": "application/json", "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" },
}));

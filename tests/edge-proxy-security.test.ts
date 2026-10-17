import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import * as policy from "../supabase/functions/_shared/proxy-policy";
function edgeHandler(file: string, environment: Record<string, string> = {}, bridgeFetch?: typeof fetch) {
  let handler: (request: Request) => Promise<Response>;
  let inserts = 0;
  const client = { from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: null, error: null }) }) }), insert: async () => { inserts++; return { error: null }; } }) };
  const source = ts.transpileModule(readFileSync(file, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  runInNewContext(source, { exports: {}, require: (name: string) => name.includes("proxy-policy") ? policy : name.includes("supabase-js") ? { createClient: () => client } : {},
    Deno: { serve: (fn: typeof handler) => { handler = fn; }, env: { get: (name: string) => environment[name] } },
    Response, Request, Headers, URL, crypto, AbortSignal, fetch: bridgeFetch || (() => assert.fail("No user-controlled edge egress")) });
  return { call: (request: Request) => handler(request), inserted: () => inserts };
}
test("legacy edge relay is gone, even for a forged allowed origin", async () => {
  const edge = edgeHandler("supabase/functions/api-proxy/index.ts");
  const result = await edge.call(new Request("https://edge.test/api-proxy", { method: "POST", headers: { Origin: "https://utilbyte.app" }, body: '{"url":"https://example.com"}' }));
  assert.equal(result.status, 410);
});
test("public catcher cannot set forwarding with an anonymous Supabase key or spoofed Origin", async () => {
  const edge = edgeHandler("supabase/functions/request-catcher/index.ts", { PROXY_ACCESS_TOKEN: "operator-only-secret-0123456789abcdef", PROXY_ALLOWED_ORIGINS: "https://example.com" });
  const result = await edge.call(new Request("https://edge.test/request-catcher/testbin?action=set-config", { method: "POST", headers: { Origin: "https://utilbyte.app", Authorization: "Bearer anonymous-key" }, body: '{"forward_url":"https://example.com","forward_enabled":true}' }));
  assert.equal(result.status, 403);
  assert.equal(edge.inserted(), 0);
});
test("catcher bounds actual payload bytes and rejects unapproved configuration with a valid operator token", async () => {
  const secret = "operator-only-secret-0123456789abcdef";
  const edge = edgeHandler("supabase/functions/request-catcher/index.ts", { PROXY_ACCESS_TOKEN: secret, PROXY_ALLOWED_ORIGINS: "https://example.com" });
  const large = await edge.call(new Request("https://edge.test/request-catcher/testbin", { method: "POST", body: "x".repeat(policy.MAX_REQUEST_BYTES + 1) }));
  assert.equal(large.status, 413);
  const config = await edge.call(new Request("https://edge.test/request-catcher/testbin?action=set-config", { method: "POST", headers: { "x-utilbyte-proxy-token": secret }, body: '{"forward_url":"https://unapproved.test","forward_enabled":true}' }));
  assert.equal(config.status, 403);
  assert.equal(edge.inserted(), 0);
});
test("catcher has a per-instance request backstop before database work", async () => {
  const edge = edgeHandler("supabase/functions/request-catcher/index.ts");
  for (let attempt = 0; attempt < 120; attempt++) {
    assert.equal((await edge.call(new Request("https://edge.test/request-catcher/!"))).status, 400);
  }
  assert.equal((await edge.call(new Request("https://edge.test/request-catcher/!"))).status, 429);
  assert.equal(edge.inserted(), 0);
});

import test from "node:test";
import assert from "node:assert/strict";
import { Readable } from "node:stream";
import { EventEmitter } from "node:events";
import { NextRequest } from "next/server";
import { approvedDestination, hasProxyAccess, isPublicAddress, MAX_REQUEST_BYTES, readLimitedText } from "../supabase/functions/_shared/proxy-policy";
import { POST } from "../src/app/api/proxy/route";
import { proxyRequest } from "../src/lib/proxy-request";
const dns = require("node:dns/promises") as typeof import("node:dns/promises");
const https = require("node:https") as typeof import("node:https");
const token = "test-only-operator-token-0123456789abcdef";
const original = { token: process.env.PROXY_ACCESS_TOKEN, origins: process.env.PROXY_ALLOWED_ORIGINS };
test.afterEach(() => {
  test.mock.restoreAll();
  if (original.token === undefined) delete process.env.PROXY_ACCESS_TOKEN; else process.env.PROXY_ACCESS_TOKEN = original.token;
  if (original.origins === undefined) delete process.env.PROXY_ALLOWED_ORIGINS; else process.env.PROXY_ALLOWED_ORIGINS = original.origins;
});
function req(body: string, access?: string, origin = "https://utilbyte.app") {
  return new NextRequest("https://utilbyte.app/api/proxy", { method: "POST", headers: { Origin: origin, "Content-Type": "application/json", ...(access ? { "x-utilbyte-proxy-token": access } : {}) }, body });
}
test("a forged allowed Origin does not authorize relay traffic; configuration fails closed", async () => {
  delete process.env.PROXY_ACCESS_TOKEN;
  assert.equal((await POST(req('{"url":"https://example.com"}', token))).status, 403);
  process.env.PROXY_ACCESS_TOKEN = token;
  assert.equal((await POST(req('{"url":"https://example.com"}'))).status, 403);
  assert.equal((await POST(req('{"url":"https://example.com"}', "wrong"))).status, 403);
  assert.equal((await POST(req('{"url":"https://example.com"}', token, "https://evil.test"))).status, 403);
  assert.equal(await hasProxyAccess(token, token), true);
});
test("only exact HTTPS origins are approved, and private/special encodings are rejected", () => {
  assert.equal(approvedDestination("https://example.com/path#fragment", "https://example.com").href, "https://example.com/path");
  for (const url of ["https://example.com.evil.test", "https://user:pass@example.com", "http://example.com", "https://example.com:8443", "https://2130706433", "https://[::ffff:127.0.0.1]", "https://metadata.google.internal"]) assert.throws(() => approvedDestination(url, "https://example.com"));
  assert.throws(() => approvedDestination("https://example.com", undefined));
  for (const address of ["127.0.0.1", "10.0.0.1", "169.254.169.254", "100.64.0.1", "192.168.1.1", "::1", "fd00::1", "fe80::1", "::ffff:7f00:1", "2001:0db8::1", "2002:7f00:1::"]) assert.equal(isPublicAddress(address), false, address);
  assert.equal(isPublicAddress("93.184.216.34"), true);
  assert.equal(isPublicAddress("2606:4700:4700::1111"), true);
});
test("payload limit counts actual streamed UTF-8 bytes without trusting Content-Length", async () => {
  process.env.PROXY_ACCESS_TOKEN = token;
  assert.equal((await POST(req("x".repeat(MAX_REQUEST_BYTES + 1), token))).status, 413);
  assert.equal((await POST(req("{", token))).status, 400);
  await assert.rejects(readLimitedText(new Response("éé").body, 3), /size limit/);
});
test("mixed public/private DNS answers are rejected before connecting", async () => {
  test.mock.method(dns, "lookup", async () => [{ address: "93.184.216.34", family: 4 }, { address: "127.0.0.1", family: 4 }]);
  test.mock.method(https, "request", () => assert.fail("Must not connect"));
  await assert.rejects(proxyRequest(new URL("https://example.com"), "GET", {}, ""), /blocked address/);
});
test("the connection pins the approved IP and preserves a redirect without following it", async () => {
  let calls = 0;
  test.mock.method(dns, "lookup", async () => [{ address: "93.184.216.34", family: 4 }]);
  test.mock.method(https, "request", ((options: Record<string, unknown>, callback: (stream: unknown) => void) => {
    calls++;
    assert.equal(options.hostname, "93.184.216.34");
    assert.equal(options.servername, "example.com");
    const request = new EventEmitter() as EventEmitter & { end: () => void; destroy: () => void };
    request.destroy = () => {};
    request.end = () => { const stream = Object.assign(Readable.from([Buffer.from("redirect")]), { statusCode: 302, statusMessage: "Found", headers: { location: "http://127.0.0.1/private" } }); queueMicrotask(() => callback(stream)); };
    return request;
  }) as typeof https.request);
  const result = await proxyRequest(new URL("https://example.com/path"), "GET", {}, "");
  assert.equal(calls, 1);
  assert.equal(result.status, 302);
  assert.equal(result.headers.location, "http://127.0.0.1/private");
});
test("authorized approved requests traverse the API contract without leaking the operator token", async () => {
  process.env.PROXY_ACCESS_TOKEN = token;
  process.env.PROXY_ALLOWED_ORIGINS = "https://example.com";
  test.mock.method(dns, "lookup", async () => [{ address: "93.184.216.34", family: 4 }]);
  test.mock.method(https, "request", ((options: { headers: Record<string, string> }, callback: (stream: unknown) => void) => {
    assert.equal(options.headers.authorization, "Bearer target-test");
    assert.equal(options.headers.host, "example.com");
    assert.equal(options.headers["x-utilbyte-proxy-token"], undefined);
    assert.equal(options.headers.cookie, undefined);
    const request = new EventEmitter() as EventEmitter & { end: () => void; destroy: () => void };
    request.destroy = () => {};
    request.end = () => queueMicrotask(() => callback(Object.assign(Readable.from([Buffer.from('{"ok":true}')]), { statusCode: 200, statusMessage: "OK", headers: { "content-type": "application/json" } })));
    return request;
  }) as typeof https.request);
  const result = await POST(req(JSON.stringify({ url: "https://example.com/test", method: "GET", headers: { Authorization: "Bearer target-test", "x-utilbyte-proxy-token": token, Cookie: "do-not-forward", Host: "evil.test" } }), token));
  assert.equal(result.status, 200);
  const data = await result.json();
  assert.equal(data.status, 200);
  assert.equal(data.body, '{"ok":true}');
  assert.equal(result.headers.get("X-Robots-Tag"), "noindex, nofollow");
});
test("upstream response limit is enforced while streaming", async () => {
  test.mock.method(dns, "lookup", async () => [{ address: "93.184.216.34", family: 4 }]);
  test.mock.method(https, "request", ((_options: unknown, callback: (stream: unknown) => void) => {
    const request = new EventEmitter() as EventEmitter & { end: () => void; destroy: () => void };
    request.destroy = () => {};
    request.end = () => queueMicrotask(() => callback(Object.assign(Readable.from([Buffer.alloc(10 * 1024 * 1024 + 1)]), { statusCode: 200, headers: {} })));
    return request;
  }) as typeof https.request);
  await assert.rejects(proxyRequest(new URL("https://example.com"), "GET", {}, ""), /exceeds 10 MB/);
});

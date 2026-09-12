import test from "node:test";
import assert from "node:assert/strict";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { handleMcpRequest, MAX_MCP_BODY_BYTES } from "../src/lib/mcp/http";
import { catalog } from "../src/lib/tool-catalog";
import { createMcpRateLimiter } from "../src/lib/mcp/rate-limit";

const endpoint = "https://utilbyte.app/mcp";
const headers = { "Content-Type": "application/json", Accept: "application/json, text/event-stream" };
function request(body: unknown, extraHeaders: Record<string, string> = {}) {
  return new Request(endpoint, { method: "POST", headers: { ...headers, ...extraHeaders }, body: JSON.stringify(body) });
}

test("MCP official client initializes, discovers all tools, reads the catalog and reports missing tools", async () => {
  const client = new Client({ name: "utilbyte-test", version: "1.0.0" });
  const transport = new StreamableHTTPClientTransport(new URL(endpoint), {
    fetch: async (input, init) => handleMcpRequest(new Request(input, init)),
  });
  try {
    await client.connect(transport);
    assert.equal(client.getServerVersion()?.name, "utilbyte");
    const tools = await client.listTools();
    assert.deepEqual(tools.tools.map(tool => tool.name), ["discover_tools", "get_tool", "format_json", "format_sql", "convert_json_csv"]);
    const discovery = await client.callTool({ name: "discover_tools", arguments: { query: "shrink image" } });
    assert.match(JSON.stringify(discovery), /image-compress-image/);
    assert.match(JSON.stringify(discovery), /mcpExecutionAvailable/);
    const detail = await client.callTool({ name: "get_tool", arguments: { id: "image-compress-image" } });
    assert.match(JSON.stringify(detail), /https:\/\/utilbyte.app\/image-tools\/compress-image/);
    const missing = await client.callTool({ name: "get_tool", arguments: { id: "not-real" } });
    assert.equal(missing.isError, true);
    const invalid = await client.callTool({ name: "discover_tools", arguments: { query: "x".repeat(121) } });
    assert.equal(invalid.isError, true);
    const resources = await client.listResources();
    assert.equal(resources.resources[0].uri, "utilbyte://catalog");
    const resource = await client.readResource({ uri: "utilbyte://catalog" });
    assert.ok("text" in resource.contents[0]);
    assert.equal(JSON.parse(resource.contents[0].text as string).tools.length, catalog.length);
    const formatted = await client.callTool({ name: "format_json", arguments: { text: '{"b":1,"a":2}', sortKeys: true } });
    assert.equal((formatted.structuredContent as { output: string }).output, '{\n  "a": 2,\n  "b": 1\n}');
    assert.equal((formatted.structuredContent as { processingMode: string }).processingMode, "server");
    const duplicate = await client.callTool({ name: "format_json", arguments: { text: '{"secret":1,"secret":2}' } });
    assert.equal(duplicate.isError, true);
    assert.doesNotMatch(JSON.stringify(duplicate), /secret/);
    const tooLong = await client.callTool({ name: "format_sql", arguments: { text: "x".repeat(20_001) } });
    assert.equal(tooLong.isError, true);
    const sql = await client.callTool({ name: "format_sql", arguments: { text: "select id from users", dialect: "postgresql" } });
    assert.match((sql.structuredContent as { output: string }).output, /SELECT\s+id\s+FROM\s+users/);
    const csv = await client.callTool({ name: "convert_json_csv", arguments: { text: '[{"cell":"=1+1"}]', direction: "json-to-csv" } });
    assert.match((csv.structuredContent as { output: string }).output, /'=1\+1/);
    const json = await client.callTool({ name: "convert_json_csv", arguments: { text: 'name,age\r\nAda,42', direction: "csv-to-json" } });
    assert.deepEqual(JSON.parse((json.structuredContent as { output: string }).output), [{ name: "Ada", age: "42" }]);
  } finally { await client.close(); }
});

test("MCP rejects cross-origin requests, invalid JSON, batches, unsupported methods and content types", async () => {
  const ping = { jsonrpc: "2.0", id: 1, method: "ping" };
  assert.equal((await handleMcpRequest(request(ping, { Origin: "https://untrusted.example" }))).status, 403);
  assert.equal((await handleMcpRequest(request(ping, { Origin: "null" }))).status, 403);
  assert.equal((await handleMcpRequest(request(ping, { Origin: "https://utilbyte.app" }))).status, 200);
  assert.equal((await handleMcpRequest(new Request(endpoint))).status, 405);
  assert.equal((await handleMcpRequest(request(ping, { "Content-Type": "text/plain" }))).status, 415);
  assert.equal((await handleMcpRequest(new Request(endpoint, { method: "POST", headers, body: "{" }))).status, 400);
  assert.equal((await handleMcpRequest(request([ping, ping]))).status, 400);
  assert.equal((await handleMcpRequest(request(ping, { "MCP-Protocol-Version": "unknown-version" }))).status, 400);
});

test("MCP bounds request bytes even with no Content-Length and does not cache responses", async () => {
  const oversized = request({ value: "💡".repeat(MAX_MCP_BODY_BYTES / 4) });
  assert.equal(oversized.headers.get("content-length"), null);
  assert.equal((await handleMcpRequest(oversized)).status, 413);
  assert.equal((await handleMcpRequest(request({}, { "Content-Length": `${MAX_MCP_BODY_BYTES + 1}` }))).status, 413);
  const response = await handleMcpRequest(request({ jsonrpc: "2.0", id: 3, method: "ping" }));
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal(response.headers.get("mcp-session-id"), null);
  assert.deepEqual(await response.json(), { result: {}, jsonrpc: "2.0", id: 3 });
});

test("MCP rate limits individual callers and total per-instance traffic, then expires counters", () => {
  const allow = createMcpRateLimiter();
  for (let index = 0; index < 60; index++) assert.equal(allow("first", 1000), true);
  assert.equal(allow("first", 1000), false);
  for (let caller = 0; caller < 3; caller++) for (let index = 0; index < 60; index++) assert.equal(allow(`caller-${caller}`, 1000), true);
  assert.equal(allow("new-caller", 1000), false);
  assert.equal(allow("first", 61_001), true);
});

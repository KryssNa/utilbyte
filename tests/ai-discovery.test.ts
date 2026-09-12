import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import test from "node:test";
import { catalog } from "../src/lib/tool-catalog";
import { GUIDES } from "../src/content/guides";
import { renderLlmsFull, renderLlmsIndex } from "../src/lib/ai-discovery";
import { GET as indexResponse } from "../src/app/llms.txt/route";
import { GET as fullResponse } from "../src/app/llms-full.txt/route";
import robots from "../src/app/robots";

test("AI directory covers every catalog tool with a canonical page and exact processing disclosures", () => {
  const base = "https://utilbyte.app";
  const index = renderLlmsIndex(base);
  const full = renderLlmsFull(base);
  for (const tool of catalog) {
    assert.ok(index.includes(`[${tool.title}](${base}${tool.href})`), tool.id);
    assert.equal(full.split(`Catalog ID: ${tool.id}\n`).length - 1, 1, tool.id);
    assert.ok(full.includes(`Canonical page: ${base}${tool.href}`), tool.id);
    assert.ok(full.includes(`Inputs: ${tool.supportedInputs.join(", ")}`), tool.id);
    assert.ok(full.includes(`Outputs: ${tool.supportedOutputs.join(", ")}`), tool.id);
    assert.ok(full.includes(`Data handling: ${tool.processingNote}`), tool.id);
    assert.ok(existsSync(`src/app${tool.href}/page.tsx`), tool.href);
  }
  for (const guide of GUIDES) {
    assert.ok(index.includes(`${base}/guides/${guide.slug}`));
    assert.ok(full.includes(guide.summary));
  }
  assert.ok(full.includes("not general subject segmentation"));
  assert.ok(full.includes("MCP access requires a compatible client"));
});

test("AI directories are served as public UTF-8 text without exposing request data", async () => {
  for (const handler of [indexResponse, fullResponse]) {
    const response = handler();
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("Content-Type"), "text/plain; charset=utf-8");
    assert.match(response.headers.get("Cache-Control") || "", /public/);
    assert.ok((await response.text()).startsWith("# UtilByte\n"));
  }
  assert.ok(renderLlmsIndex("https://preview.example").includes("https://preview.example/llms-full.txt"));
});

test("search discovery retains the wildcard crawler policy and all private-path exclusions", () => {
  const config = robots();
  assert.deepEqual(config.rules, [{ userAgent: "*", allow: "/", disallow: ["/api/", "/admin/", "/private/"] }]);
  assert.match(String(config.sitemap), /\/sitemap\.xml$/);
});

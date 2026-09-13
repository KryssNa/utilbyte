import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import test from "node:test";
import { allTools, toolCategories } from "../src/components/layout/navbar/data";
import sitemap from "../src/app/sitemap";

test("catalog links are unique and resolve to implemented pages", () => {
  assert.equal(new Set(allTools.map(tool => tool.href)).size, allTools.length);
  for (const item of [...allTools, ...toolCategories]) {
    assert.ok(existsSync(`src/app${item.href}/page.tsx`), item.href);
  }
});
test("sitemap includes every tool once and does not invent freshness", () => {
  const entries = sitemap();
  const paths = entries.map(entry => new URL(entry.url).pathname);
  assert.equal(new Set(paths).size, paths.length);
  for (const tool of allTools) assert.ok(paths.includes(tool.href), tool.href);
  assert.ok(entries.filter(entry => entry.lastModified).every(entry => /^\d{4}-\d{2}-\d{2}$/.test(String(entry.lastModified))));
  assert.equal(entries.find(entry => new URL(entry.url).pathname === "/")?.lastModified, undefined);
});

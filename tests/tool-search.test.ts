import assert from "node:assert/strict";
import test from "node:test";
import { allTools } from "../src/components/layout/navbar/data";
import { searchTools } from "../src/lib/tool-search";

for (const [query, slug] of [
  ["postgres", "sql-formatter"], ["mysql", "sql-formatter"],
  ["beautify-query", "sql-formatter"], ["epoch", "timestamp"],
  ["webhook", "request-catcher"], ["json formater", "json-formatter"],
  ["  JSON___Formatter  ", "json-formatter"], ["pretty print", "json-formatter"],
]) {
  test(`search: ${query}`, () => assert.ok(searchTools(allTools, query)[0]?.href.endsWith(`/${slug}`)));
}
test("empty search retains catalog; unknown and overlong searches return nothing", () => {
  assert.equal(searchTools(allTools, "  ").length, allTools.length);
  assert.deepEqual(searchTools(allTools, "unfindablezzzz"), []);
  assert.deepEqual(searchTools(allTools, "a".repeat(1000)), []);
});
test("exact title beats incidental mentions and aliases", () => {
  const candidates = [
    { title: "Other", desc: "SQL formatter", category: "Dev", aliases: ["SQL formatter"] },
    { title: "SQL Formatter", desc: "Format SQL", category: "Dev" },
  ];
  assert.equal(searchTools(candidates, "SQL formatter")[0].title, "SQL Formatter");
});

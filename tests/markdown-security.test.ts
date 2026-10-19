import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { JSDOM } from "jsdom";
import MarkdownPreview from "../src/components/tools/dev/markdown/MarkdownPreview";
test("Markdown preserves formatting while dropping executable elements, attributes and URL schemes", () => {
  const html = renderToStaticMarkup(React.createElement(MarkdownPreview, { content: `# Safe heading

<strong>Kept</strong>

<script>alert(1)</script><iframe src="https://evil.test"></iframe><svg onload="alert(1)"></svg><form action="https://evil.test"><input name="secret"></form>

<a href="jav&#x61;script:alert(1)">bad link</a><img src="x" onerror="alert(1)"><div style="position:fixed;inset:0" onclick="alert(1)">No overlay</div>

[Obfuscated](java\tscript:alert(1))

[Safe](https://example.com)` }));
  const dom = new JSDOM(html);
  assert.equal(dom.window.document.querySelectorAll("script,iframe,svg,form,object,embed").length, 0);
  assert.ok(dom.window.document.querySelector("strong"));
  assert.equal(dom.window.document.querySelector('a[href="https://example.com"]')?.getAttribute("rel"), "noopener noreferrer");
  for (const node of dom.window.document.querySelectorAll("*")) for (const attribute of node.attributes) {
    assert.ok(!attribute.name.startsWith("on"));
    assert.ok(!/^(?:javascript|vbscript|data):/i.test(attribute.value));
    assert.notEqual(attribute.name, "style");
  }
  dom.window.close();
});

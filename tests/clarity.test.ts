import test from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { CLARITY_BOOTSTRAP } from "../src/lib/clarity";

test("Clarity queues denied storage before asynchronously loading the supplied tag with the document nonce", () => {
  const dom = new JSDOM(`<!doctype html><html><head><script id="microsoft-clarity" nonce="document-nonce">${CLARITY_BOOTSTRAP}</script></head><body data-clarity-mask="true"></body></html>`, {
    url: "https://utilbyte.test",
    runScripts: "dangerously",
  });
  try {
    const loader = dom.window.document.querySelector('script[src*="clarity.ms/tag/"]') as HTMLScriptElement;
    assert.equal(loader.src, "https://www.clarity.ms/tag/yzybyfhjvw?ref=bwt");
    assert.equal(loader.async, true);
    assert.equal(loader.nonce, "document-nonce");
    const clarity = (dom.window as unknown as { clarity: { q: IArguments[] } }).clarity;
    assert.deepEqual(JSON.parse(JSON.stringify(Array.from(clarity.q[0]))), ["consentv2", { ad_Storage: "denied", analytics_Storage: "denied" }]);
    assert.equal(dom.window.document.cookie, "");
  } finally {
    dom.window.close();
  }
});

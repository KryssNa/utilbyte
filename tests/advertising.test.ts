import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { JSDOM } from "jsdom";
import { NextRequest } from "next/server";
import { proxy } from "../src/proxy";
import { contentSecurityPolicy } from "../src/lib/content-security-policy";
import { PathnameContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";
const dom = new JSDOM("<!doctype html><html><head></head><body></body></html>", { url: "https://utilbyte.test", pretendToBeVisual: true });
for (const key of ["window", "document", "HTMLElement", "HTMLAnchorElement", "Element", "Node", "MutationObserver", "CustomEvent", "Event", "MouseEvent"] as const) Object.defineProperty(globalThis, key, { configurable: true, writable: true, value: dom.window[key] });
Object.defineProperty(globalThis, "navigator", { configurable: true, value: dom.window.navigator });
let width = 300;
Object.defineProperty(dom.window.HTMLElement.prototype, "offsetWidth", { configurable: true, get: () => width });
const resizeCallbacks: (() => void)[] = [];
Object.defineProperty(globalThis, "ResizeObserver", { configurable: true, value: class { constructor(fn: () => void) { resizeCallbacks.push(fn); } observe() {} disconnect() {} } });
const { render, act, cleanup, fireEvent } = require("@testing-library/react") as typeof import("@testing-library/react");
const AdSenseScript = require("../src/components/shared/AdSenseScript").default as typeof import("../src/components/shared/AdSenseScript").default;
const AdSlot = require("../src/components/shared/AdSlot").default as typeof import("../src/components/shared/AdSlot").default;
const ConsentSettingsLink = require("../src/components/shared/ConsentSettingsLink").default as typeof import("../src/components/shared/ConsentSettingsLink").default;
const originalEnabled = process.env.NEXT_PUBLIC_ADSENSE_ENABLED;
const tools = ["/dev-tools/json-csv"], guides = ["/guides/example"];
function mount(path: string, editorial = true) {
  return render(React.createElement(PathnameContext.Provider, { value: path },
    React.createElement(AdSenseScript, { nonce: "test-nonce", toolPaths: tools, guidePaths: guides, children:
      React.createElement("main", null, editorial && React.createElement("article", { "data-ad-content": true }, "Publisher article"), React.createElement(AdSlot, { slot: "1234567890" })) })));
}
test.beforeEach(() => { process.env.NEXT_PUBLIC_ADSENSE_ENABLED = "true"; document.documentElement.dataset.toolFocus = "false"; window.adsbygoogle = []; width = 300; resizeCallbacks.length = 0; });
test.afterEach(() => { cleanup(); document.querySelectorAll("script").forEach(node => node.remove()); if (originalEnabled === undefined) delete process.env.NEXT_PUBLIC_ADSENSE_ENABLED; else process.env.NEXT_PUBLIC_ADSENSE_ENABLED = originalEnabled; delete window.googlefc; delete window.__tcfapi; });
test("each document gets a new nonce and uncacheable strict CSP; caller nonces are overwritten", () => {
  const request = new NextRequest("https://utilbyte.app/dev-tools/json-csv", { headers: { "x-nonce": "attacker" } });
  const a = proxy(request), b = proxy(request);
  assert.notEqual(a.headers.get("content-security-policy"), b.headers.get("content-security-policy"));
  assert.match(a.headers.get("content-security-policy")!, /'nonce-[A-Za-z0-9+/=]+' 'strict-dynamic'/);
  assert.ok(!a.headers.get("content-security-policy")!.includes("attacker"));
  assert.equal(a.headers.get("Cache-Control"), "private, no-store");
  assert.match(contentSecurityPolicy("nonce"), /frame-ancestors 'none'/);
});
test("policy pages, unknown guide/tool paths and missing editorial content never load the ad runtime", () => {
  for (const [path, editorial] of [["/privacy", true], ["/terms", true], ["/contact", true], ["/ai", true], ["/about", true], ["/guides/missing", true], ["/dev-tools/missing", true], [tools[0], false]] as const) {
    mount(path, editorial);
    assert.equal(document.querySelector('script[src*="adsbygoogle"]'), null, path);
    assert.equal(document.querySelector("ins.adsbygoogle"), null, path);
    assert.equal(window.adsbygoogle?.pauseAdRequests, 1);
    cleanup();
  }
});
test("a manual unit waits for the runtime and positive width, initializes once, and unmounts in Focus Mode", async () => {
  width = 0;
  mount(tools[0]);
  const script = document.querySelector<HTMLScriptElement>('#utilbyte-adsense')!;
  assert.ok(script);
  assert.equal(script.nonce, "test-nonce");
  assert.equal(document.querySelector("ins.adsbygoogle"), null);
  fireEvent.load(script);
  assert.ok(document.querySelector("ins.adsbygoogle"));
  assert.equal(window.adsbygoogle?.length, 0);
  width = 300;
  act(() => resizeCallbacks.forEach(callback => callback()));
  act(() => resizeCallbacks.forEach(callback => callback()));
  assert.equal(window.adsbygoogle?.length, 1);
  await act(async () => { document.documentElement.dataset.toolFocus = "true"; });
  assert.equal(window.adsbygoogle?.pauseAdRequests, 1);
  assert.equal(document.querySelector("ins.adsbygoogle"), null);
  await act(async () => { document.documentElement.dataset.toolFocus = "false"; });
  assert.ok(document.querySelector("ins.adsbygoogle"));
  assert.equal(document.querySelectorAll('#utilbyte-adsense').length, 1);
  assert.equal(window.adsbygoogle?.length, 2);
});
test("late CMP readiness makes revocation available through the supported callback queue", () => {
  const view = render(React.createElement(ConsentSettingsLink));
  assert.equal(view.queryByRole("button"), null);
  let revoked = 0;
  window.googlefc!.showRevocationMessage = () => { revoked++; };
  window.__tcfapi = (_command, _version, callback) => callback({ gdprApplies: true, listenerId: 7 }, true);
  const queue = window.googlefc!.callbackQueue as Record<string, () => void>[];
  act(() => queue[0].CONSENT_API_READY());
  fireEvent.click(view.getByRole("button", { name: "Privacy settings" }));
  act(() => queue[1].CONSENT_API_READY());
  assert.equal(revoked, 1);
});

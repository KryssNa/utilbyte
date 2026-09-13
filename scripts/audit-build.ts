import { SOCIAL_CARD } from "../src/lib/social-card";
import { readFileSync, existsSync, writeFileSync } from "node:fs";
import { JSDOM } from "jsdom";
import { gzipSync } from "node:zlib";
import assert from "node:assert/strict";
import { catalog, catalogCategories } from "../src/lib/tool-catalog";
import { GUIDES } from "../src/content/guides";

// The site currently has no verified rating collection or review dataset.
// Keep these out of generated metadata until a real, visible source is added.
function auditStructuredData(value: unknown, route: string): void {
  if (Array.isArray(value)) {
    value.forEach(item => auditStructuredData(item, route));
    return;
  }
  if (!value || typeof value !== "object") return;
  const item = value as Record<string, unknown>;
  const types = Array.isArray(item["@type"]) ? item["@type"] : [item["@type"]];
  assert.ok(!types.includes("AggregateRating") && !("aggregateRating" in item), `Unsupported review rating: ${route}`);
  assert.ok(!types.includes("VideoObject"), `Unsupported video recording schema: ${route}`);
  for (const [key, child] of Object.entries(item)) {
    if (key === "screenshot") {
      const screenshots = Array.isArray(child) ? child : [child];
      for (const screenshot of screenshots) {
        const source = typeof screenshot === "string" ? screenshot : (screenshot as { contentUrl?: string; url?: string } | null)?.contentUrl ?? (screenshot as { url?: string } | null)?.url;
        if (typeof source !== "string") continue;
        const url = new URL(source, "https://utilbyte.app");
        if (url.origin === "https://utilbyte.app" && url.pathname.startsWith("/images/")) {
          assert.ok(existsSync(`public${url.pathname}`), `Missing local screenshot asset ${url.pathname}: ${route}`);
        }
      }
    }
    auditStructuredData(child, route);
  }
}
const routes = ["/", "/ai", "/about", "/contact", "/privacy", "/terms", ...catalogCategories.map(item => item.href), ...catalog.map(item => item.href), "/guides", ...GUIDES.map(guide => `/guides/${guide.slug}`)];
const documents = new Map<string, Document>();
const titles = new Map<string, string>();
const descriptions = new Map<string, string>();
const normalize = (value: string) => value.replace(/\s+/g, " ").trim();
let checkedLinks = 0, checkedFaqs = 0;
const results: {route:string; htmlBytes:number; initialJsBytes:number; initialJsGzipBytes:number; scripts:string[]}[] = [];
for (const route of routes) {
  const path = `.next/server/app/${route === "/" ? "index" : route.slice(1)}.html`;
  assert.ok(existsSync(path), `Missing static HTML: ${route}`);
  const html = readFileSync(path,"utf8");
  const document: Document = new JSDOM(html).window.document;
  documents.set(route, document);
  const meta = (name: string) => document.querySelector<HTMLMetaElement>(`meta[name="${name}"], meta[property="${name}"]`)?.content;
  assert.equal(document.documentElement.lang, "en", `Document language: ${route}`);
  const description = meta("description")?.trim();
  assert.ok(description, `Missing description: ${route}`);
  assert.ok(!descriptions.has(description), `Duplicate description: ${route} and ${descriptions.get(description)}`);
  descriptions.set(description, route);
  for (const name of ["og:title", "og:description", "og:url", "og:image", "twitter:title", "twitter:description", "twitter:image"]) {
    assert.ok(meta(name)?.trim(), `Missing ${name}: ${route}`);
  }
  assert.equal(new URL(meta("og:url")!).pathname.replace(/\/$/, "") || "/", route, `Wrong social URL: ${route}`);
  for (const name of ["og:image", "twitter:image"]) {
    if (!catalog.some(tool => tool.href === route)) assert.equal(new URL(meta(name)!).pathname + new URL(meta(name)!).search, SOCIAL_CARD.url, `Default social card missing: ${route}`);
    const image = new URL(meta(name)!);
    assert.equal(image.origin, "https://utilbyte.app", `Unexpected social image origin: ${route}`);
    assert.ok(existsSync(`public${image.pathname}`) || existsSync(`.next/server/app${image.pathname}.body`), `Missing social image: ${route}`);
  }
  for (const image of document.querySelectorAll("img")) assert.ok(image.hasAttribute("alt"), `Missing image alt: ${route}`);
  const title = html.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "";
  assert.ok(title?.trim(), `Missing page title: ${route}`);
  assert.ok(!titles.has(title), `Duplicate title: ${route} and ${titles.get(title)}`);
  titles.set(title, route);
  assert.ok((title.match(/\bUtilByte\b/gi) ?? []).length <= 1, `Duplicated title branding: ${route}`);
  const canonical = html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/);
  assert.ok(canonical, `Missing canonical: ${route}`);
  assert.equal(new URL(canonical[1]).pathname.replace(/\/$/, "") || "/", route);
  assert.equal((html.match(/<h1(?:\s|>)/g) ?? []).length, 1, `One H1: ${route}`);
  assert.ok(!/<meta[^>]*name="robots"[^>]*content="[^"]*noindex/.test(html), `Noindex: ${route}`);
  const jsonLd = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(match => { const value = JSON.parse(match[1]); return Array.isArray(value) ? value : [value]; });
  assert.ok(jsonLd.length, `Missing structured data: ${route}`);
  auditStructuredData(jsonLd, route);
  const visibleDocument = document.body.cloneNode(true) as HTMLElement;
  visibleDocument.querySelectorAll("script,style").forEach(node => node.remove());
  const visibleText = normalize(visibleDocument.textContent ?? "");
  const nodes: Record<string, unknown>[] = [];
  function collect(value: unknown): void {
    if (Array.isArray(value)) { value.forEach(collect); return; }
    if (!value || typeof value !== "object") return;
    const node = value as Record<string, unknown>;
    nodes.push(node); Object.values(node).forEach(collect);
  }
  collect(jsonLd);
  for (const node of nodes.filter(node => node["@type"] === "Question")) {
    const answer = node.acceptedAnswer as { text?: string };
    assert.ok(visibleText.includes(normalize(String(node.name))), `FAQ question absent from page: ${route}: ${node.name}`);
    assert.ok(answer?.text && visibleText.includes(normalize(answer.text)), `FAQ answer absent from page: ${route}: ${node.name}`);
    checkedFaqs++;
  }
  if (catalog.some(tool => tool.href === route)) {
    const apps = nodes.filter(node => node["@type"] === "WebApplication" || node["@type"] === "SoftwareApplication");
    assert.equal(apps.length, 1, `Exactly one tool application entity: ${route}`);
    assert.equal(normalize(String(apps[0].name)), normalize(document.querySelector("h1")!.textContent ?? ""), `Tool schema name differs from heading: ${route}`);
  }
  assert.ok(html.includes('aria-label="Tool navigator"'), `Persistent tool navigation: ${route}`);
  if (catalog.some(tool => tool.href === route)) {
    assert.ok(html.includes('aria-label="Breadcrumb"'), `Visible breadcrumb: ${route}`);
    assert.ok(html.includes('How your data is handled'), `Processing disclosure: ${route}`);
  }
  const scripts = [...new Set([...html.matchAll(/<script[^>]*src="([^"?]+)[^"]*"/g)].map(match => match[1]).filter(src => src.startsWith('/_next/static/')))];
  let initialJsBytes = 0, initialJsGzipBytes = 0;
  for (const src of scripts) {
    const script = readFileSync(`.next${src.replace('/_next', '')}`);
    initialJsBytes += script.length; initialJsGzipBytes += gzipSync(script).length;
  }
  results.push({ route, htmlBytes: Buffer.byteLength(html), initialJsBytes, initialJsGzipBytes, scripts });
}
// Crawl the rendered internal link graph, including fragment targets. This also
// catches stale footer/category/guide links that a sitemap-only check misses.
for (const [route, document] of documents) {
  for (const anchor of document.querySelectorAll<HTMLAnchorElement>("a[href]")) {
    const raw = anchor.getAttribute("href")!;
    const url = new URL(raw, `https://utilbyte.app${route}`);
    if (url.origin !== "https://utilbyte.app") continue;
    const target = url.pathname.replace(/\/$/, "") || "/";
    const targetDocument = documents.get(target);
    assert.ok(targetDocument || existsSync(`public${target}`) || existsSync(`.next/server/app${target}.body`) || target === "/mcp", `Broken internal link: ${route} → ${raw}`);
    if (targetDocument && url.hash) assert.ok(targetDocument.getElementById(decodeURIComponent(url.hash.slice(1))), `Broken fragment: ${route} → ${raw}`);
    checkedLinks++;
  }
}
const home = readFileSync('.next/server/app/index.html','utf8');
for (const tool of catalog) assert.ok(home.includes(`href="${tool.href}"`), `Home link: ${tool.href}`);
const sitemap = readFileSync('.next/server/app/sitemap.xml.body','utf8');
assert.equal((sitemap.match(/<loc>/g) ?? []).length, routes.length, "Sitemap public route count");
for (const route of routes) assert.ok(sitemap.includes(`https://utilbyte.app${route === '/' ? '' : route}</loc>`), `Sitemap entry: ${route}`);
for (const filename of ["llms.txt", "llms-full.txt"]) {
  const reference = readFileSync(`.next/server/app/${filename}.body`, "utf8");
  for (const tool of catalog) assert.ok(reference.includes(`https://utilbyte.app${tool.href}`), `AI directory missing ${tool.href}: ${filename}`);
  assert.ok(reference.includes("https://utilbyte.app/ai"), `AI setup link missing: ${filename}`);
}
const socialCard = readFileSync("public/social-card.png");
assert.equal(socialCard.subarray(1, 4).toString(), "PNG", "Invalid standalone social card");
assert.equal(socialCard.readUInt32BE(16), SOCIAL_CARD.width);
assert.equal(socialCard.readUInt32BE(20), SOCIAL_CARD.height);
assert.ok(existsSync(".next/server/app/opengraph-image.body"), "Missing generated social preview image");
assert.deepEqual(readFileSync(".next/server/app/opengraph-image.body"), socialCard, "Open Graph endpoint must serve the approved artwork");
for (const path of catalog.map(tool => `og/${tool.id}`)) {
  const image = readFileSync(`.next/server/app/${path}.body`);
  assert.equal(image.subarray(1, 4).toString(), "PNG", `Invalid social image: ${path}`);
  assert.equal(image.readUInt32BE(16), 1200, `Social image width: ${path}`);
  assert.equal(image.readUInt32BE(20), 630, `Social image height: ${path}`);
}
const selected = results.filter(row => ['/text-tools/word-counter','/dev-tools/json-formatter','/dev-tools/sql-formatter','/image-tools/compress-image','/dev-tools/json-schema'].includes(row.route));
const report = ['# Local build audit', '', `Checked ${results.length} prerendered pages and ${catalog.length} tool destinations. Unique titles and descriptions, canonical and social URLs, social images, H1s, image alt attributes, structured data, visible FAQ parity, tool disclosures, navigation, internal links/fragments and sitemap inclusion passed. Checked ${checkedLinks} internal links and ${checkedFaqs} visible FAQ question/answer pairs. No duplicated title branding, unsupported aggregate ratings, or missing local /images/ screenshot references were found.`, '', 'These are build artifacts and transfer-size estimates, not browser or field performance measurements. Gzip is a reproducible local estimate; CDN compression/caching may differ.', '', '| Route | HTML bytes | Initial JS bytes | Initial JS gzip estimate |', '|---|---:|---:|---:|', ...selected.map(row => `| ${row.route} | ${row.htmlBytes} | ${row.initialJsBytes} | ${row.initialJsGzipBytes} |`), '', 'Client source maps are removed during this build. Initial-runtime module membership and subsequent runtime/network loading remain unverified; transfer-size estimates alone do not prove isolation.', '', 'No LCP/INP/CLS or network-payload outcome is inferred from these artifact sizes.', ''].join('\n');
writeFileSync('docs/build-audit.md', report);
for (const document of documents.values()) document.defaultView?.close();
writeFileSync('/tmp/utilbyte-build-audit.json', JSON.stringify(results,null,2));
console.log(`Verified ${results.length} rendered pages, ${catalog.length} tools, and sitemap. Wrote docs/build-audit.md.`);

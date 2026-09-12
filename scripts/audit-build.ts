import { readFileSync, existsSync, writeFileSync } from "node:fs";
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
const routes = ["/", "/ai", ...catalogCategories.map(item => item.href), ...catalog.map(item => item.href), "/guides", ...GUIDES.map(guide => `/guides/${guide.slug}`)];
const results: {route:string; htmlBytes:number; initialJsBytes:number; initialJsGzipBytes:number; scripts:string[]}[] = [];
for (const route of routes) {
  const path = `.next/server/app/${route === "/" ? "index" : route.slice(1)}.html`;
  assert.ok(existsSync(path), `Missing static HTML: ${route}`);
  const html = readFileSync(path,"utf8");
  const title = html.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "";
  assert.ok(title?.trim(), `Missing page title: ${route}`);
  assert.ok((title.match(/\bUtilByte\b/gi) ?? []).length <= 1, `Duplicated title branding: ${route}`);
  const canonical = html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/);
  assert.ok(canonical, `Missing canonical: ${route}`);
  assert.equal(new URL(canonical[1]).pathname.replace(/\/$/, "") || "/", route);
  assert.equal((html.match(/<h1(?:\s|>)/g) ?? []).length, 1, `One H1: ${route}`);
  assert.ok(!/<meta[^>]*name="robots"[^>]*content="[^"]*noindex/.test(html), `Noindex: ${route}`);
  const jsonLd = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(match => { const value = JSON.parse(match[1]); return Array.isArray(value) ? value : [value]; });
  assert.ok(jsonLd.length, `Missing structured data: ${route}`);
  auditStructuredData(jsonLd, route);
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
const home = readFileSync('.next/server/app/index.html','utf8');
for (const tool of catalog) assert.ok(home.includes(`href="${tool.href}"`), `Home link: ${tool.href}`);
const sitemap = readFileSync('.next/server/app/sitemap.xml.body','utf8');
for (const route of routes) assert.ok(sitemap.includes(`https://utilbyte.app${route === '/' ? '' : route}</loc>`), `Sitemap entry: ${route}`);
for (const filename of ["llms.txt", "llms-full.txt"]) {
  const reference = readFileSync(`.next/server/app/${filename}.body`, "utf8");
  for (const tool of catalog) assert.ok(reference.includes(`https://utilbyte.app${tool.href}`), `AI directory missing ${tool.href}: ${filename}`);
  assert.ok(reference.includes("https://utilbyte.app/ai"), `AI setup link missing: ${filename}`);
}
assert.ok(existsSync(".next/server/app/opengraph-image.body"), "Missing generated social preview image");
const selected = results.filter(row => ['/text-tools/word-counter','/dev-tools/json-formatter','/dev-tools/sql-formatter','/image-tools/compress-image','/dev-tools/json-schema'].includes(row.route));
const report = ['# Local build audit', '', `Checked ${results.length} prerendered pages and ${catalog.length} tool destinations. Titles, canonical paths, H1s, structured data, tool disclosures, navigation, home links and sitemap inclusion passed. No duplicated title branding, unsupported aggregate ratings, or missing local /images/ screenshot references were found.`, '', 'These are build artifacts and transfer-size estimates, not browser or field performance measurements. Gzip is a reproducible local estimate; CDN compression/caching may differ.', '', '| Route | HTML bytes | Initial JS bytes | Initial JS gzip estimate |', '|---|---:|---:|---:|', ...selected.map(row => `| ${row.route} | ${row.htmlBytes} | ${row.initialJsBytes} | ${row.initialJsGzipBytes} |`), '', 'Client source maps are removed during this build. Initial-runtime module membership and subsequent runtime/network loading remain unverified; transfer-size estimates alone do not prove isolation.', '', 'No LCP/INP/CLS or network-payload outcome is inferred from these artifact sizes.', ''].join('\n');
writeFileSync('docs/build-audit.md', report);
writeFileSync('/tmp/utilbyte-build-audit.json', JSON.stringify(results,null,2));
console.log(`Verified ${results.length} rendered pages, ${catalog.length} tools, and sitemap. Wrote docs/build-audit.md.`);

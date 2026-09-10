import { readFileSync, existsSync, writeFileSync } from "node:fs";
import { gzipSync } from "node:zlib";
import assert from "node:assert/strict";
import { catalog, catalogCategories } from "../src/lib/tool-catalog";
import { GUIDES } from "../src/content/guides";
const routes = ["/", ...catalogCategories.map(item => item.href), ...catalog.map(item => item.href), "/guides", ...GUIDES.map(guide => `/guides/${guide.slug}`)];
const results: {route:string; htmlBytes:number; initialJsBytes:number; initialJsGzipBytes:number; scripts:string[]}[] = [];
for (const route of routes) {
  const path = `.next/server/app/${route === "/" ? "index" : route.slice(1)}.html`;
  assert.ok(existsSync(path), `Missing static HTML: ${route}`);
  const html = readFileSync(path,"utf8");
  const canonical = html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/);
  assert.ok(canonical, `Missing canonical: ${route}`);
  assert.equal(new URL(canonical[1]).pathname.replace(/\/$/, "") || "/", route);
  assert.equal((html.match(/<h1(?:\s|>)/g) ?? []).length, 1, `One H1: ${route}`);
  assert.ok(!/<meta[^>]*name="robots"[^>]*content="[^"]*noindex/.test(html), `Noindex: ${route}`);
  const jsonLd = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(match => { const value = JSON.parse(match[1]); return Array.isArray(value) ? value : [value]; });
  assert.ok(jsonLd.length, `Missing structured data: ${route}`);
  if (catalog.some(tool => tool.href === route)) {
    assert.ok(html.includes('aria-label="Breadcrumb"'), `Visible breadcrumb: ${route}`);
    assert.ok(html.includes('aria-label="Tool navigator"'), `Tool navigation: ${route}`);
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
const selected = results.filter(row => ['/text-tools/word-counter','/dev-tools/json-formatter','/dev-tools/sql-formatter','/image-tools/compress-image','/dev-tools/json-schema'].includes(row.route));
const report = ['# Local build audit', '', `Checked ${results.length} prerendered pages and ${catalog.length} tool destinations. Canonical paths, H1s, structured data, tool disclosures, navigation, home links and sitemap inclusion passed.`, '', 'These are build artifacts and transfer-size estimates, not browser or field performance measurements. Gzip is a reproducible local estimate; CDN compression/caching may differ.', '', '| Route | HTML bytes | Initial JS bytes | Initial JS gzip estimate |', '|---|---:|---:|---:|', ...selected.map(row => `| ${row.route} | ${row.htmlBytes} | ${row.initialJsBytes} | ${row.initialJsGzipBytes} |`), '', 'Client source maps are removed during this build. Initial-runtime module membership and subsequent runtime/network loading remain unverified; transfer-size estimates alone do not prove isolation.', '', 'No LCP/INP/CLS or network-payload outcome is inferred from these artifact sizes.', ''].join('\n');
writeFileSync('docs/build-audit.md', report);
writeFileSync('/tmp/utilbyte-build-audit.json', JSON.stringify(results,null,2));
console.log(`Verified ${results.length} rendered pages, ${catalog.length} tools, and sitemap. Wrote docs/build-audit.md.`);

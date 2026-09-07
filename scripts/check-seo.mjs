import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
const html = readFileSync("dist/index.html", "utf8");
assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
assert.match(html, /Nắm rõ từng đơn hàng/);
assert.match(html, /Biết hàng ở đâu/);
assert.match(html, /Theo dõi hoá đơn đến từng trạng thái/);
assert.match(html, /rel="canonical" href="https:\/\/www.voma.vn\/"/);
assert.match(html, /property="og:image"/);
assert.doesNotMatch(html, /noindex/);
const ld = html.match(
  /<script type="application\/ld\+json">([\s\S]*?)<\/script>/,
);
assert.ok(ld, "Structured data missing");
assert.equal(JSON.parse(ld[1])["@context"], "https://schema.org");
for (const asset of [
  "robots.txt",
  "sitemap.xml",
  "media/og-voma.png",
  "brand/logo-full.svg",
])
  assert.ok(existsSync(`dist/${asset}`), asset);
assert.match(
  readFileSync("dist/robots.txt", "utf8"),
  /Sitemap: https:\/\/www.voma.vn\/sitemap.xml/,
);
console.log(
  "SEO checks passed: rendered content, canonical, metadata, schema and crawl assets.",
);

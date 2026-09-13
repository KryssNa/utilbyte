# Local build audit

Checked 78 prerendered pages and 55 tool destinations. Unique titles and descriptions, canonical and social URLs, social images, H1s, image alt attributes, structured data, visible FAQ parity, tool disclosures, navigation, internal links/fragments and sitemap inclusion passed. Checked 3201 internal links and 234 visible FAQ question/answer pairs. No duplicated title branding, unsupported aggregate ratings, or missing local /images/ screenshot references were found.

These are build artifacts and transfer-size estimates, not browser or field performance measurements. Gzip is a reproducible local estimate; CDN compression/caching may differ.

| Route | HTML bytes | Initial JS bytes | Initial JS gzip estimate |
|---|---:|---:|---:|
| /image-tools/compress-image | 74218 | 1376924 | 431410 |
| /text-tools/word-counter | 66864 | 1339589 | 419570 |
| /dev-tools/json-schema | 58298 | 1338434 | 419522 |
| /dev-tools/json-formatter | 85215 | 1378693 | 431223 |
| /dev-tools/sql-formatter | 76268 | 1691416 | 516909 |

Client source maps are removed during this build. Initial-runtime module membership and subsequent runtime/network loading remain unverified; transfer-size estimates alone do not prove isolation.

No LCP/INP/CLS or network-payload outcome is inferred from these artifact sizes.

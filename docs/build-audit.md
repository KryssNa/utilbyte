# Local build audit

Checked 74 prerendered pages and 55 tool destinations. Titles, canonical paths, H1s, structured data, tool disclosures, navigation, home links and sitemap inclusion passed. No duplicated title branding, unsupported aggregate ratings, or missing local /images/ screenshot references were found.

These are build artifacts and transfer-size estimates, not browser or field performance measurements. Gzip is a reproducible local estimate; CDN compression/caching may differ.

| Route | HTML bytes | Initial JS bytes | Initial JS gzip estimate |
|---|---:|---:|---:|
| /image-tools/compress-image | 77007 | 1385759 | 434095 |
| /text-tools/word-counter | 68744 | 1348424 | 422255 |
| /dev-tools/json-schema | 56698 | 1347269 | 422207 |
| /dev-tools/json-formatter | 88600 | 1387402 | 433935 |
| /dev-tools/sql-formatter | 73721 | 1700251 | 519594 |

Client source maps are removed during this build. Initial-runtime module membership and subsequent runtime/network loading remain unverified; transfer-size estimates alone do not prove isolation.

No LCP/INP/CLS or network-payload outcome is inferred from these artifact sizes.

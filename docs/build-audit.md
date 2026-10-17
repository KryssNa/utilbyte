# Local build audit

Checked 78 server-rendered pages and 55 tool destinations. Unique titles and descriptions, canonical and social URLs, social images, H1s, image alt attributes, structured data, visible FAQ parity, tool disclosures, navigation, internal links/fragments and sitemap inclusion passed. Checked 3210 internal links and 243 visible FAQ question/answer pairs. No duplicated title branding, unsupported aggregate ratings, or missing local /images/ screenshot references were found.

These are local production-server responses and transfer-size estimates, not browser or field performance measurements. Gzip is a reproducible local estimate; CDN compression/caching may differ.

| Route | HTML bytes | Initial JS bytes | Initial JS gzip estimate |
|---|---:|---:|---:|
| /image-tools/compress-image | 78104 | 1383495 | 433135 |
| /text-tools/word-counter | 70750 | 1346175 | 421375 |
| /dev-tools/json-schema | 72954 | 1358939 | 425892 |
| /dev-tools/json-formatter | 89101 | 1385284 | 432984 |
| /dev-tools/sql-formatter | 80342 | 1697993 | 518631 |

Client source maps are removed during this build. Initial-runtime module membership and subsequent runtime/network loading remain unverified; transfer-size estimates alone do not prove isolation.

No LCP/INP/CLS or network-payload outcome is inferred from these artifact sizes.

# Local build audit

Checked 72 prerendered pages and 55 tool destinations. Canonical paths, H1s, structured data, tool disclosures, navigation, home links and sitemap inclusion passed.

These are build artifacts and transfer-size estimates, not browser or field performance measurements. Gzip is a reproducible local estimate; CDN compression/caching may differ.

| Route | HTML bytes | Initial JS bytes | Initial JS gzip estimate |
|---|---:|---:|---:|
| /image-tools/compress-image | 126775 | 1370771 | 428692 |
| /text-tools/word-counter | 120659 | 1334424 | 417070 |
| /dev-tools/json-schema | 104220 | 1332888 | 416930 |
| /dev-tools/json-formatter | 133890 | 1373375 | 428748 |
| /dev-tools/sql-formatter | 117051 | 1627418 | 493056 |

Client source maps are removed during this build. Initial-runtime module membership and subsequent runtime/network loading remain unverified; transfer-size estimates alone do not prove isolation.

No LCP/INP/CLS or network-payload outcome is inferred from these artifact sizes.

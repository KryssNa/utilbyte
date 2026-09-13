# AEO and MCP implementation verification

Reviewed 12 September 2026. These changes are verified locally; no production deployment or new SearchFIT analysis was performed.

## Shipped in this working tree

- Catalog-backed `/llms.txt` and `/llms-full.txt` cover all 55 tools and their processing disclosures. Existing wildcard crawler access and private-route exclusions remain intact.
- `/ai` explains connection setup, compatibility, capabilities and data handling. It is linked from the footer and sitemap. A generated social preview replaces missing image references.
- `/mcp` exposes discovery, tool details and a catalog resource, plus three bounded server-side text transformations. It requires a compatible Streamable HTTP client, with no UtilByte account or API key.
- Tool metadata no longer includes fabricated aggregate ratings, nonexistent screenshot references, or fabricated video recordings and view counts. Duplicated title branding and confirmed compression/compiler capability claims were corrected.
- About uses current catalog counts; About, Terms and Privacy distinguish browser processing from network/MCP services. Policy revision dates are explicit. Contact and feedback forwarding to Slack is documented.
- A worked JSON validation/conversion guide explains actual behavior, data-loss risks and TypeScript inference limits. Examples were checked against repository helpers.

## Checks

- Full automated suite: **74 tests passed**, including official MCP client protocol integration, transformations, invalid input, request limits, origin validation and rate limits.
- Type checking and production build passed.
- Build audit: **74 rendered pages and 55 tool destinations** passed canonical, title, H1, JSON-LD, navigation, disclosure and sitemap checks. Both assistant directories include every catalog destination; the social image is generated successfully. Unsupported review/video claims and missing screenshot references are rejected by the audit.
- Live local HTTP: `/ai`, both text directories, robots, sitemap, social image and the new guide returned HTTP 200 with the expected content types.
- Official MCP client against the running production preview: initialized successfully, listed five MCP tools, read all 55 catalog entries and formatted synthetic JSON correctly.
- Browser: `/ai` inspected at 1280px and 320px without horizontal overflow. No browser console errors were observed in that preview. Existing user tool tabs were not reloaded or edited.

These checks do not constitute a full security certification, complete real-device accessibility audit, field performance measurement or external search ranking score. Per-instance MCP limits are best-effort, not distributed traffic protection. See [MCP details](mcp.md).

## Measure after deployment

The reviewed [SearchFIT report](https://searchfit.ai/report/utilbyte.app) still showed 57/100 from three queries across nine platforms. That is a pre-change third-party baseline, not a new result. The provider guidance and its limitations are recorded in [the research notes](aeo-research.md).

After deployment, verify the public URLs and MCP connection again, inspect crawler access at the hosting edge, and submit/check the real sitemap in Search Console and Bing Webmaster Tools. Repeat a fixed set of useful tasks and record model/search mode, locale, date and cited URLs. Changes to llms.txt or MCP do not automatically register UtilByte with every model or guarantee higher scores. Indexing, citations, field performance and provider-specific access still require observations from the deployed site.

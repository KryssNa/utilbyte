# SEO and AEO audit — 12 September 2026

## Scope and live baseline

Read-only HTTP crawl of every URL in the production sitemap: 78 public pages, including 55 tools, six categories, ten guides and seven other pages. All 78 returned HTTP 200. Missing URLs correctly returned HTTP 404. The public robots file allows public pages and excludes API/admin/private paths; the assistant reference returns plain text. A browser-style GET of `/mcp` correctly returns HTTP 405 with `Allow: POST`, because it is a protocol endpoint.

The deployed pages had these confirmed issues before this work:

| Finding | Production baseline | Local correction |
|---|---:|---|
| Pages with incomplete or incorrect social metadata | 77 / 78 | Explicit page metadata and images |
| Missing Open Graph URL | 66 | Canonical page URL in each preview |
| Wrong Open Graph URL | 6 | Category preview no longer describes the homepage |
| Missing Open Graph image | 71 | Generated site card and individual tool cards |
| Missing Twitter image | 66 | Explicit matching preview image |
| Legacy `/index.html` scaffold | HTTP 200, unrelated starter content | Removed; permanent redirect to `/` |
| Broken internal tool destination | Merge PDF linked to nonexistent Crop PDF | Links to the existing PDF Editor |

Counts overlap; they are not separate failing pages. This baseline is a dated observation, not a claim about subsequent deployments.

## Implemented fixes

- Metadata is explicit across all 78 pages. Tool previews are generated from the same 55-item catalog as navigation and discovery. Each tool receives a 1200 × 630 PNG with its own name, category, short purpose, category icon/color, page address and the existing logo in the lower-right corner. A separate general card represents the site. The standalone `public/social-card.png` is the default Open Graph and X/Twitter image for non-tool pages; `npm run generate:social-card` regenerates it from the shared design and current catalog before each production build. Images are prerendered; visitors and crawlers do not need a browser or image-generation service to retrieve them.
- Tool application, breadcrumb and FAQ structured data now comes from the visible tool content. Removed disconnected hand-written FAQ, HowTo and Service markup. No invented ratings, reviews, screenshots or video records were added. Site and organization identities have stable IDs; static informational pages have appropriate page entities.
- Guides now display an author link and visible breadcrumbs. Eight guides received correctness edits, including official DV photo dimensions, UK digital-photo cropping guidance, HEIC decoder compatibility, PDF limitations and privacy/offline claims. Only substantively reviewed guides receive a new revision date; original publication dates remain intact.
- Removed the UK digital-photo cropping preset, distinguished DV’s exact 600 × 600 output from the general US visa range, and corrected the related article and visible guidance.
- Corrected misleading tool content and machine-readable descriptions. The detailed scope and remaining implementation limitations are recorded in [the content audit](seo-content-audit.md).
- Fixed verified output failures uncovered while checking capability claims: WebM audio codec, AAC container/extension, image encoder fallback, and QR export format. Existing results keep their actual format if settings change. The PDF worker is local and version-matched; the browser policy permits proven runtime hosts and local blob media without a blanket arbitrary-HTTPS connection rule.
- Expanded `npm run audit:build` from 74 to all 78 public pages. It checks unique titles/descriptions, canonical and social URLs, image assets, one H1, language, image alt attributes, indexability, FAQ text parity, application-entity count, internal links and fragments, sitemap parity, all 55 AI-directory entries, and all 56 PNG dimensions.

## Verification

- Final production build and TypeScript checks passed.
- All 82 regression tests passed, including tool metadata/schema checks, actual bundled FFmpeg encoding checks and MCP SDK protocol coverage.
- Final rendered audit passed all 78 pages, 3,201 internal links, 234 visible FAQ question/answer pairs and 56 correctly sized PNG social images.
- A real HTTP crawl of the local production preview returned all 78 pages successfully with zero missing or mismatched social-metadata fields. This compares with 77 affected pages in the deployed baseline.
- `/index.html` returns a permanent HTTP 308 redirect to `/`; a tool social image returns HTTP 200 with an image/png content type.
- All 56 cards also rendered independently, including titles with special characters. Visually inspected the site card, Image Compressor, JSON ↔ CSV and JSON Schema Validator.
- Browser checks confirmed AI-page metadata and sidebar rendering, no error logs on that page, and no horizontal overflow at a 390 × 844 viewport on the representative tool page. QR SVG now displays an actual loaded image; both its preview label and download retain SVG after switching the next export to PNG. QR previews and statistics describe the generated result rather than newly edited settings.
- Whitespace checks passed. Existing generated TypeScript housekeeping files were restored after validation.

## What these checks cannot establish

These changes are local and require deployment before the production baseline changes. No deployment or external message was sent as part of this audit.

Google explains that [AI search uses the same SEO fundamentals](https://developers.google.com/search/docs/appearance/ai-features); no special AI file or schema guarantees inclusion. Structured data must [match visible, accurate content](https://developers.google.com/search/docs/appearance/structured-data/sd-policies). MCP enables compatible clients to connect and use the exposed operations; it does not register UtilByte in every model or guarantee citations. Software/FAQ rich-result eligibility has additional provider requirements; valid schema alone does not promise a rich result.

PageSpeed’s public API returned HTTP 429 (shared quota exceeded), so no Lighthouse or Core Web Vitals score is claimed. Transfer-size estimates in [the build audit](build-audit.md) are not LCP, INP or CLS measurements. Search Console/Bing Webmaster indexing, real verified bot-IP access through the hosting edge, backlinks, field performance, current third-party AEO scores and assistant citation rates require separate external measurements. Searchfit could not be re-opened by the web tool in this session, so no updated score is reported.

The audit does not certify every browser, file codec, government-portal submission or network service. Known tool implementation limits are disclosed in the content audit rather than presented as supported features.

# Tool content accuracy audit

Date: 2026-09-12. Scope: local working tree during the coordinated SEO/AEO audit. These changes are not evidence of a deployed update, crawler refresh, search inclusion, or a ranking increase.

## Method and scope

Scanned the tool article collection and tool components across the 55-tool catalog for absolute quality/privacy claims, supported formats and languages, batching, precision, memory/file limits, retention and offline behavior. Traced the significant matches through their implementation. Deep review focused on the tools listed below; this is not an exhaustive test of every file format, input edge case, browser, runtime package or hosted service.

This pass owns article text, component descriptions/FAQs, catalog content and AI discovery prose. Metadata/schema, global pages, guides, deployed crawling, runtime bug fixes and integrated builds are separate coordinated work. Existing prose that was not demonstrably contradicted by the implementation was generally left intact.

## Corrected findings

| Area | Contradiction removed | Implementation evidence |
| --- | --- | --- |
| JSON Formatter | Unsafe numbers were described as silently rounded; full JSONPath features were implied. Now documents rejection, duplicate-key checks, limits and property/index lookup. | `src/lib/json-safe.ts`; `src/components/tools/dev/json-formatter/useJsonFormatter.ts` |
| Online Compiler | Article claimed JavaScript-only while Python exists; FAQ promised a security sandbox. Now documents Python/Pyodide, JavaScript evaluation, TypeScript without transpilation, limited preview modes, asynchronous console capture and no execution timeout. | `src/components/tools/dev/OnlineCompiler.tsx`, runtime loading and `runCode` |
| API Client | FAQ described requests as client-side with no storage. Now describes the server proxy, forwarded credentials/body and uncertainty about infrastructure/destination logs. | `src/app/api/proxy/route.ts`; `src/components/tools/dev/ApiClient.tsx` |
| Request Catcher / Local Proxy | Retention expiry, complete header/body capture, ownership and transparent forwarding were overstated. Now documents hosted records, omitted Authorization, OPTIONS preflight, public bin controls, text bodies, absent automatic cleanup, forwarding limits and synthetic test data. | `supabase/functions/request-catcher/index.ts`; database policies; both components |
| Markdown Renderer | Article denied HTML export and FAQ implied remote Markdown assets could never make network requests. Now lists actual exports and remote image behavior. | `src/components/tools/dev/MarkdownRenderer.tsx` |
| OCR | Visible language count said 20+ while the selector offers 13. FAQ now lists the available languages and selected-image processing scope. | `src/components/tools/image/ImageOCR.tsx`, `SUPPORTED_LANGUAGES` |
| Countdown | Article described a wall-clock deadline and no sound, while implementation decrements an interval and offers sound. Now explains duration controls, drift, no date/timezone mode, optional sound and browser restrictions. | `src/components/tools/utility/CountdownTimer.tsx` |
| Text Formatter | Text promised semantic preservation and validation for all modes. Now distinguishes native JSON parsing from non-JSON text substitutions, which can alter strings/code; warns about native JSON precision and duplicate keys. | `src/components/tools/text/TextFormatter.tsx`, formatting functions |
| Hash / Regex | Removed password-storage recommendation from the plain-hash description and broad regex dialect implication. | `src/components/tools/dev/HashGenerator.tsx`; `RegexTester.tsx` uses `RegExp` |
| Unit / Color / Case | Replaced ten-decimal accuracy guarantee, print-color accuracy guarantee and universal punctuation preservation with actual floating-point/factor, approximate CMYK and case-style behavior. | Corresponding utility/text component functions |
| PDF compression / merge / rotation | Removed guarantees about all document features and exact original bytes; compression description now says structural rewrite, no image re-encoding. Reversing rotation restores angle rather than exact bytes. Removed an unmeasured compression/time example. | PDF components use `pdf-lib` copy/save and rotation operations |
| Image conversion | Article lists PNG/JPEG/WebP exports and SVG raster wrapper; GIF/BMP are inputs only. Makes flattened animation and lack of vector tracing explicit. | `src/components/tools/image/FormatConverter.tsx`, companion runtime fix |
| Video conversion | Articles match the corrected WebM Opus codec, AAC/ADTS versus M4A distinction, fixed sample rate, WAV PCM and input limits. Audio example is within 500 MB and labeled a size estimate; removed inaudibility guarantees. | `VideoCompressor.tsx`; `VideoToAudio.tsx`; companion runtime fixes |
| QR | Clarifies PNG/JPEG logo support versus SVG requiring logo disabled. Replaces fabricated exact scanning-distance and module-count outcomes with a review workflow. | `QRCodeGenerator.tsx`, raster logo composition and SVG generation; companion runtime fix |
| AI discovery | Catalog and `llms-full.txt` text now expose compiler execution limitations and JSON safety/path scope consistently with visible content. | `src/lib/tool-catalog.ts`; `src/lib/ai-discovery.ts` |

## Verification

- Transpiled 119 TypeScript files in tool articles/components plus catalog/discovery with diagnostics enabled: zero syntax errors.
- Reviewed content changes against source implementation. No processing behavior was changed by this content pass.
- The integrated type check, production build and all 82 automated tests subsequently passed; see seo-aeo-audit.md for the final rendered and browser verification.
- The final integrated whitespace check passed.

## Remaining limitations and follow-up

- PDF Compress still exposes image-quality, DPI, image-compression and font-optimization settings that are not implemented in the output path. Its article discloses the mismatch; removing or implementing these controls is a separate functional task. PDF structural analysis also uses heuristics rather than a measured savings prediction.
- Online Compiler still runs trusted code in the page environment and does not transpile TypeScript or enforce a timeout. Content correction does not turn it into an isolated execution service.
- Text Formatter's non-JSON modes remain basic substitutions; use a parser-based formatter for reliable code changes. Its native JSON path remains separate from the safer dedicated JSON Formatter.
- Hosted catcher/proxy access and retention limitations remain implementation characteristics. This pass does not verify hosting configuration, infrastructure logs, cleanup outside the repository, or live database policies.
- Local processing statements refer to the tool's handling of the selected input. They are not claims that the entire website is offline or free of analytics, ads, runtime/model downloads or user-authored network requests.
- Several older articles still contain illustrative size/time/quality examples. Shared rendering now labels examples as illustrative in the coordinator's work; this audit does not certify them as measured benchmarks.
- No content/schema adjustment can guarantee a score, citation or first position across all LLMs. Provider indexing and actual answers require post-deployment observation.

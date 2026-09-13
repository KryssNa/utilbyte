# Source data-flow audit — 10 September 2026

Evidence is local source, not a production network capture. The authoritative per-tool list is `src/lib/tool-catalog.ts`; its disclosure is rendered on every tool page. Tool-input processing and site integrations are distinct.

| Group / tool | Input destination | Dependencies and retention |
|---|---|---|
| Image tools | Browser canvas / local decoding | OCR downloads Tesseract/language assets. HEIC/AVIF support depends on browser/decoder implementation. Selected file contents are not intentionally uploaded. |
| PDF tools | Browser PDF libraries | pdf-lib and pdf.js; pdf.js worker served locally. No intentional file upload. Rasterization can remove text/accessibility structure; original remains available. |
| Text and general utility tools | Browser | Formatting, counting, generation and conversion. Some controls store settings; user input is not added to the new preferences store. |
| SQL and JSON tools | Browser | sql-formatter and bounded strict JSON checks. Input remains ephemeral. Explicit JSON handoffs use one in-memory message with a 60-second expiry, consumed once by the destination. |
| New JSON workflows | Browser worker | Papa Parse and Ajv draft-07; remote schema retrieval disabled. Worker terminated after completion/cancel/timeout/unmount. |
| API Client | UtilByte `/api/proxy`, then entered endpoint | URL, allowed headers (including Authorization/API keys), and body pass through the proxy. Response is returned through it. No database write is implemented in this route; platform logs/retention are not verified. |
| Request Catcher | Supabase edge function and database | Captures request headers except Authorization, query parameters, body, IP and forwarding response. `action=list` and `action=clear` use bin ID without owner authentication. Clear deletes request rows for that ID, not provider backups/logs or forwarding configuration. No automatic expiry job exists in supplied migrations/functions. |
| Local Proxy | Same Request Catcher plus configured forwarding destination | Stores bin forwarding URL/config; forwards only when enabled. Shares browser bin ID with catcher. Receivers and tunnel providers have their own handling policies. |
| WebSocket Client | Entered WebSocket endpoint directly | Server receives messages. No UtilByte relay. Destination retention is unknown. |
| Online Compiler | Browser | Python downloads Pyodide from jsDelivr; user code itself can initiate requests. HTML previews and script execution require separate review before using untrusted code. No hosted code-execution service is called by the compiler. |
| Markdown Renderer | Browser, plus embedded resource hosts | Remote image URLs in a document may contact their origins. This is disclosed separately from local rendering. |
| Video tools | Browser FFmpeg worker | Runtime downloaded from jsDelivr. Shared loader uses abort, timeout, termination and blob URL cleanup; selected video is written to the worker filesystem, not sent to CDN. |

## Site integrations

- AdSense loads a third-party script. GA/GTM are conditional on public environment variables. Vercel page analytics remains installed. Their production configuration and network traffic are not verified here.
- Default Sentry integrations, tracing, logs, replay and default PII are disabled. `beforeSend` drops runtime events entirely. This intentionally removes runtime error reporting until a verified payload-safe reporting design is supplied.
- Custom tool events are off by default. The optional event function constructs fresh allowlisted dimensions and never forwards raw input/search/URL/filename/error messages.
- Pins, recent tool IDs, focus/collapse preferences use `utilbyte:tools:v1`; no tool content is stored there. Existing Request Catcher/Local Proxy bin IDs use their existing storage key and are disclosed as shared IDs.

## Request Catcher deployment concern

The supplied migrations grant anonymous table-wide read/delete access to caught requests and broad anonymous access to bin configuration. Knowledge of a bin ID is the edge-function access model, not authenticated ownership. A frontend privacy label cannot fix this. The UI warns that synthetic data should be used, and production policy/retention verification remains a release requirement. No database migration has been applied from this workspace.

## Synthetic network verification procedure

1. Start a clean local build and a separate production test session. Record source SHA, host, browser/version, date and enabled integrations. Never paste real documents, tokens, webhook bodies or personal data.
2. Use a fixed marker such as `UTILBYTE_SYNTHETIC_20260910`. Exercise SQL/JSON format, copy, import/export and each new workflow; select a synthetic image/PDF/video containing the marker where feasible.
3. Inspect all Fetch/XHR, document, image, script, beacon and WebSocket requests, not only API calls. Search URLs, headers and request bodies for the marker. Inspect analytics/reporting payloads as well as tool destinations. Do not export unredacted HARs from signed-in personal sessions.
4. Expect no tool marker in local-tool network requests. Runtime/CDN downloads alone do not imply upload. For hosted tools, expect the synthetic payload only in the disclosed service path; verify list, clear, forwarding and database policies using a dedicated test bin.
5. Inspect browser storage after explicit handoff and normal navigation. Only preferences/tool IDs and existing documented bin IDs should persist; the transfer disappears after consumption/expiry. Test errors and cancellation too.
6. Record unexpected requests, file/route, fixed failure code and remediation. No trace was available in this session, so none is recorded as passed.

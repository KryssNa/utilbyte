# Baseline, research, and evaluation — 10 September 2026

## Dated baseline

This is a missing-data baseline, not a report of measured search performance.

| Metric/source | Baseline | Reason |
|---|---|---|
| Search Console page/query/device/country, previous 28 complete days | Unavailable | No account access or export supplied |
| Indexing/canonical/exclusion reasons | Unavailable | Requires Search Console |
| Nonbrand impressions, clicks, CTR | Unavailable | Requires Search Console; no estimated numbers substituted |
| Field p75 LCP, INP, CLS, segmented mobile/desktop | Unavailable | No field dataset supplied |
| Valid-input tool success and navigation outcomes | No historic events | New optional event instrumentation |
| Referral quality / downstream use | Unavailable | No campaign run |
| Participant task success/time | Unavailable | No recruited participants |

Record the deployment SHA and time, then collect equivalent 28-day windows. Export Search Console dimensions separately where necessary rather than combining totals from incompatible reports. Exclude branded queries using a predeclared UtilByte spelling list. Annotate holidays, releases, outages, and changing impressions; do not attribute differences to navigation automatically.

## Tool outcome events

`NEXT_PUBLIC_TOOL_METRICS=true` enables allowlisted custom events through existing Vercel Analytics. It is off by default and respects Do Not Track. It includes only registered tool IDs, fixed event/error/surface names, and coarse duration/size buckets. `src/lib/tool-events.ts` constructs a fresh object and discards unknown fields. SQL and the three new workflows emit start/success/failure and copy/download events; JSON emits debounced parse outcomes and copy/download. Navigation emits destination/open/focus outcomes. Do not count parsing every valid keystroke as a completed user task: use explicit copy/download as a separate completion signal.

Never attach raw input, searches, body, filename, token, copied result, or user URL. Default Sentry integrations, traces, logs, replay, default PII and runtime event delivery are disabled; re-enabling requires a separately verified payload policy. Site ads and page analytics remain separate integrations covered by the privacy policy. A production network trace is still required to confirm deployment behavior.

## Eight-person exploratory navigation study

Recruit four people who frequently use developer tools and four general file/text-tool users. Use consenting participants and synthetic inputs. Keep recordings optional and keep payloads out of research notes.

The current design keeps the navigator visible from 1024 CSS pixels and uses a drawer below that width. The old collapse option was retired on 12 September 2026 at the owner’s request. Assess inline sidebar search, category switching, and modal search separately; rotate their task order across participants. Start with guides visible. Any historical comparison needs a separate archived build; the current UI has no collapsed desktop variant.

Tasks, without telling participants which menu to use:

1. Starting at SQL Formatter, find a tool to inspect a JSON response.
2. Find a tool for a Unix epoch timestamp.
3. Find a webhook request inspector; explain where test data would go before using it.
4. Open Image Compressor and find how to resize the image first.
5. Enter the synthetic SQL fixture, open/close Tools, toggle Hide guides / Show guides, and verify the input survives.
6. Follow a sibling link with unsaved input; cancel, then accept. Repeat browser Back and Forward.
7. On a narrow viewport, find JSON ↔ CSV, type with the software keyboard, then cancel a running operation.
8. Read a tool's limitation and choose an appropriate next step without automatically transferring content.

Record per task: surface/order, participant code (P01–P08), device class, unaided completion, elapsed seconds, wrong destinations, whether the editor became cramped, draft loss, and one optional observation. Do not collect input text. Start with the plan's exploratory under-10-second finding target and 7/8 unaided completion target; treat these as hypotheses, not population estimates.

## Browser acceptance matrix

Test widths 320, 390, 768, 1024, 1280, 1440 and 1920 CSS pixels for SQL, JSON, Image Compressor, and the new workflows. Check page overflow, 200% zoom, input/output widths, focus visibility, opening/closing drawer/search, Tab/Shift+Tab containment, Escape and return focus, current-link announcement, mobile keyboard, and file import/download. Refresh with saved guide preferences and legacy compact=true preferences: the desktop rail must remain visible. Inspect layout movement.

With unsaved input, test internal links, modified-click/new-tab, downloads, same-page anchors, browser back/forward, refresh, and close. Raw programmatic History API navigation is outside the link guard; do not add it without a guard test. Opening/closing navigation and changing layout must not remount the workspace.

For workers: cancel during runtime download and during processing; retry; navigate away and confirm worker termination. Confirm stale output cannot appear after cancellation or a newer run. Check offline failure with a cold cache, then warm cache behavior. Screen-reader and real mobile-keyboard checks require actual devices/browser sessions.

## Keep / iterate / rollback decision

Current decision: ready for automated verification and controlled review, not a production outcome decision. No measured ranking uplift exists.

- Keep the pilot only if participants can find tools and workspace/draft/privacy guardrails hold.
- Iterate on labels or subgroup order when repeated finding errors occur.
- Roll back navigation independently of formatter correctness changes if it causes input loss, inaccessible controls, or persistent editor overflow. Use the previous archived build for comparison when needed.
- Do not run a quantitative A/B claim without traffic estimates, a sample-size/minimum-detectable-effect plan, and a fixed analysis window. With low traffic, use the exploratory observations and production bug counts.
- Expand the JSON workflows only after actual usage and successful completions support the choice. Their current selection is a product hypothesis.

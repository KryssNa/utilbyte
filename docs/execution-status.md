# Execution plan status — 10 September 2026

The supplied 22-item plan is the scope of this implementation. “Implemented” below means code/content is present locally, not deployed or proven to improve rankings. External acceptance remains open where explicitly listed. No production configuration, database migration, public posting, or participant research has been performed by these local changes.

| Item | Local work | Remaining acceptance |
|---|---|---|
| UB-001 SQL correctness | Dialect formatter, failure behavior, regression corpus | Deployed-build interaction and parity check |
| UB-002 Privacy | Per-tool registry disclosures; hosted endpoint/access/retention details; browser/server replay, logs, tracing and error payload capture disabled | Production synthetic-data network trace; verify deployed database policies and provider retention |
| UB-003 Correctness gate | CI tests for SQL, JSON precision/duplicates, encoding, CSV, schema, types, file failures and telemetry | Run CI in the remote repository; browser file processing checks |
| UB-004 Baseline | Optional allowlisted tool events; baseline worksheet with unavailable data explicitly marked | Search Console and field analytics access |
| UB-005 Registry | Presentation-independent catalog with IDs, subgroups, processing, formats, related IDs, editorial weights and known update dates | Confirm production catalog after release |
| UB-006 Navigation pilot | Desktop/drawer variant and counterbalanced research protocol | Recruit and observe eight participants; no results fabricated |
| UB-007 Desktop navigator | Contextual left rail, subgroups, active links, pins/recents, Focus mode and restore controls | Interactive viewport tests |
| UB-008 Narrow drawer | Shared destination markup in Radix modal, labels, Escape/focus handling, scroll region | Keyboard, screen-reader and mobile-keyboard tests |
| UB-009 Draft safety | In-memory inputs; guarded internal links/back/forward/reload; layout preferences only | Real browser history and cancellation checks; raw History API calls outside application links are not guarded |
| UB-010 Search | Shared aliases, typo tolerance, deterministic ranking, featured empty state | Participant findability evidence |
| UB-011 Next steps | Self-cards filtered; related links before help; explicit in-memory JSON handoffs | Observe usefulness in the pilot |
| UB-012 SEO basics | Breadcrumbs, canonical routes, catalog sitemap, substantive known dates only | Production crawl and Search Console indexing |
| UB-013 Performance | Lazy runtime loading, shared video loader with abort/termination, cancellable workflow workers, persistent layout preference initialized before paint | Real browser loading/cancellation checks and field p75 measurements |
| UB-014 SQL depth | Dialect, indentation/case, samples, import/export, copy, input limits and documented limitations | Browser file import/download |
| UB-015 JSON reliability | Strict visitor checks, unsafe-number/duplicate/depth rejection, prototype-safe sorting, accurate comparison labels | Interactive regression fixtures |
| UB-016 JSON ↔ CSV | Text/typed modes, delimiters, quote handling, null/missing semantics, formula protection, local handoff | Worker/browser acceptance |
| UB-017 JSON Schema | Draft-07 only; local refs; no fetching/coercion/defaults; bounded cancellable worker | Demand validation and browser acceptance |
| UB-018 JSON → TypeScript | Escaped property names, nesting, union/empty arrays, explicit inference limits | Demand validation and browser acceptance |
| UB-019 Intent content | Workflow choices on six category hubs; new pages with useful capabilities and limitations | Search/user feedback; no separate keyword-only dialect pages |
| UB-020 Reproducible evidence | Guide linked to the executable public-source SQL corpus | Publish the release; independent reproduction |
| UB-021 Distribution | Concrete release message and channel/feedback tracking materials | User-selected channels and recipients; send/publish and measure |
| UB-022 Evaluation | Keep/iterate/rollback criteria and a measurement worksheet | Real baseline/pilot/production results; no outcome decision claimed |

## Automated verification

`npm test`: 57 passing tests. `npm run type-check` and `npm run build`: passed. `npm run audit:build`: 72 prerendered pages and all 55 tool destinations passed canonical, H1, structured-data, disclosure, navigation, home-link and sitemap checks. See [build-audit.md](build-audit.md). Browser runtime isolation and field performance are not inferred from these checks.

## External constraints

Browser discovery returned no available browser in this session. A connected browser is needed for actual viewport, focus, back/forward, mobile keyboard, synthetic network, and worker lifecycle acceptance. Automated source/unit checks cannot substitute for that evidence.

Search Console, production analytics, backend deployment state, community recipients, and recruited participants are not available from the workspace. The user has been asked for measurement access and distribution channels. Missing observations remain marked unavailable, rather than being converted into assumed successes.

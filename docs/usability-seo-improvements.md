# Usability and search improvements — 10 September 2026

The item-by-item source of truth is [execution-status.md](execution-status.md). It separates local implementation from outstanding browser, production, research and distribution acceptance for all 22 plan items.

Implemented locally:

- Reliable SQL formatting with four tested dialects, controls, import/export and a reproducible edge-case guide.
- Strict JSON precision/duplicate checks, prototype-safe processing, Unicode encoding fixes, and three worker-based workflows: JSON ↔ CSV, JSON Schema draft-07 validation and JSON → TypeScript.
- One 55-tool catalog powering navigation, search, category counts, sitemap and processing disclosures.
- Search modal with a single prominent input, category filters, compact icon rows, saved shortcuts, clear/reset actions, IME-safe Enter, keyboard navigation and focus restoration.
- Desktop navigation, a narrow-screen drawer, pins/recents, Focus mode, explicit in-memory JSON handoffs and unsaved-work warnings.
- Useful category workflow descriptions, consistent rendered metadata, breadcrumbs and substantive sitemap dates.
- Lazy video/OCR runtime loading, cancellation and honest OCR failures without placeholder output or fabricated confidence.
- Per-tool data-flow documentation and disabled Sentry event delivery. Optional allowlisted tool metrics remain off by default; existing page analytics/ads remain integrated.
- Automated regression tests, production-build checks and a generated HTML/sitemap audit in CI.

Run `npm test`, `npm run type-check`, `npm run build`, then `npm run audit:build`. See [build-audit.md](build-audit.md) for artifact results once generated. Build sizes are not field performance measurements.

No release, external posting, participant study, ranking improvement, production privacy verification or field Core Web Vitals result is claimed. See [measurement-and-research.md](measurement-and-research.md), [data-flow-audit.md](data-flow-audit.md) and [distribution-ready.md](distribution-ready.md) for the prepared acceptance work.

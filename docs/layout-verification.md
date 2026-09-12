# Tool layout verification — 12 September 2026

## Implemented

- Persistent 248px tool navigator from 1024px; legacy collapse preferences cannot hide it.
- Sidebar search filters the catalog in place, including aliases and keyboard navigation. Category buttons remain one click away when browsing.
- Compact page headers, data disclosures, file pickers, related-tool cards and FAQ disclosures put the workspace before supporting content.
- Search inputs have no focus ring; buttons and links retain keyboard focus indicators.
- Mobile drawer closes when resizing to desktop. Guide visibility and navigation changes preserve the workspace.
- Long article examples scroll within their panels; footer links wrap on narrow screens.
- Removed the custom year-long cache rule for Next.js chunks after it caused stale development CSS and hydration mismatches. Next.js manages its own asset caching.

## Verified locally

- 61 automated tests passed, including sidebar filtering, aliases, empty recovery, category switching, keyboard selection, legacy preferences, draft protection, modal focus restoration, and file-picker cancellation.
- Type check and production build passed. Development CSS was verified to return `no-cache, must-revalidate` with the updated picker styles.
- Build audit passed for 72 rendered pages, all 55 tool destinations, and sitemap inclusion.
- Production SQL page: no horizontal page overflow at 320, 390, 768, 1024 and 1440 CSS pixels; rail hidden below 1024 and visible at/above it.
- Production Image Compressor at 390px: no page overflow; the compact picker uses a 250px minimum height and exposes a Choose file button.
- Browser checks confirmed inline search does not open the modal, preserves a SQL draft, and keeps the rail visible while guides are hidden. A production reload retained the rail with guides hidden.
- Mobile drawer search and automatic dismissal on desktop resize checked. Modal checked at 320px and desktop; focused input has no outline/shadow and Escape returns focus to its trigger.

These are local browser and automated checks, not real-device keyboard, assistive-technology, conversion, or ranking measurements. Nothing was deployed as part of this layout change.

## Persistent site navigation — 12 September 2026

Moved the desktop rail into the shared site layout, so home, categories, tools, guides and AI setup use the same 248px navigation column. The footer shares the content column. Tool pages retain their workspace controls without rendering a second desktop sidebar. Sidebar search, pins and recent destinations are available across routes; a home-state regression check verifies all tools are reachable without falsely marking one active.

The header now links to AI & MCP instead of showing a second search entry point and category strip. Ctrl/Cmd+K still opens keyboard search. Mobile navigation remains available from the labeled menu, preserving full content width.

Validation: 75 automated tests, production build, and the 74-page build audit passed. The audit now requires the navigator on every audited page, including home and AI setup. Browser checks covered desktop home at1280px, tool and MCP navigation with exactly one rail, inline alias search with no modal, mobile home/tool pages at320px without overflow, mobile menu search and dismissal after navigation, desktop rail at1024px, and Ctrl+K search followed by Escape. Existing user tabs and tool inputs were not changed. Preview remains local; no deployment or measured usability uplift is implied.

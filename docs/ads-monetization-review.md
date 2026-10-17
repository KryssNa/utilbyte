# Ad monetization and security review

Reviewed 17 October 2026. Scope: source revision `71f360cdc809be0ff25c3c0074bc227beba80e37`, compared with the public site and the supplied findings. The repaired archive was verified locally and then transferred to a separate Git topic branch from the same revision. Production and the existing local checkout were not overwritten.

The supplied package was incomplete: `AdSenseScript.tsx` and three imported article files were absent. These files are now present. Account approval, the actual rejection policy and published consent configuration remain separate from source correctness.

## Findings checked against evidence

| Supplied claim | Evidence and correction | Local change |
| --- | --- | --- |
| CSP blocks advertising and CMP | Production had a narrow domain allowlist. This is an ad compatibility risk; the inspected production browser did not log a CSP violation, so it is not a demonstrated rejection cause. Google's current AdSense documentation supports nonce-based strict CSP, rather than maintaining a domain list. | Fresh cryptographic nonce per HTML request, forwarded to Next.js rendering and Google tags; `strict-dynamic`; dynamic HTML and no shared HTML caching. |
| `X-Frame-Options: DENY` blocks ad iframes | Incorrect: it controls embedding **this page** in another frame, rather than the child frames this page loads. Removing a deprecated Feature-Policy header is cleanup, not evidence of an ad violation. | Keep `DENY`, `frame-ancestors 'none'` and the existing camera/microphone/geolocation Permissions-Policy. |
| Ads on policy, error and Focus Mode screens | Verified: production created Google ad request frames on `/privacy` and a true HTTP 404. The observed requests were unfilled, not proof of displayed ads. Policy/about pages are not categorically forbidden by Google; excluding them here is a conservative site decision. | Exact tool/guide paths plus actual editorial-content marker; no loader on navigation/policy/unknown pages; requests paused and manual units unmounted in Focus Mode; fresh-document navigation when leaving ad content. |
| Three tools have boilerplate content | Verified that the old three routes shared a short article and that the replacement article files were missing. A short page is not itself proof of a Google violation; usefulness and originality matter, not a fabricated word-count threshold. | Dedicated JSON/CSV, draft-07 schema, and inferred TypeScript articles with examples, limits, FAQs and related links. |
| Origin checks lock down public relays | Incorrect. A non-browser caller can forge Origin, CORS is not authentication, and a process-local counter is not a distributed rate limit. The supplied Next.js fix accepted a forged allowed Origin in a mocked check. Edge protections were incomplete and did not have the claimed caps/rates across all paths. | Public API Client defaults to browser-direct CORS requests. Optional server relay requires a private operator token and exact approved HTTPS origins. All DNS answers are checked, and HTTPS connects to a checked IP with the original TLS server name; redirects are returned, never followed. Request/response limits and an upstream timeout apply. Legacy Edge relay returns 410. Catcher forwarding uses only the secured Next.js relay. |
| Catcher data is adequately protected by a bin ID | Additional verified defect: existing anonymous database policies allowed access to all rows, not just a known bin. | New migration revokes anonymous/authenticated direct table access, drops the broad policies and disables old forwarding configurations without deleting URLs or requests. New generated bin IDs use cryptographic randomness. The Edge Function still treats a bin ID as a bearer capability for read/clear; use synthetic data and do not share it. |
| Raw Markdown and user code cause malware disapproval | No actual Google malware finding was supplied. `react-markdown` already filters unsafe URLs by default; claiming that every raw script executes was too broad. Raw HTML plugins still require a proper sanitizer. A Web Worker prevents DOM access and permits termination, but is not a security sandbox. | Apply `rehype-sanitize` after raw HTML parsing and before highlighting. Both JS and Python execute in workers, with five-second execution limits, a separate 30-second Python loading limit, cancellation and bounded captured output. The HTML preview keeps an opaque-origin iframe sandbox, blocks network requests/forms/nested frames with its own CSP, and nonces intentional script elements. Workers can still use network and some origin storage APIs; run trusted code only. |
| Passport/security keywords trigger policy filters | Unsupported as a deterministic cause. A photo utility is not automatically an official-government-service advertiser; a disclaimer cannot guarantee eligibility or approval. | Retain accurate non-affiliation, no-acceptance-guarantee wording and authority links. Preserve accurate functional descriptions; do not disguise features to evade review. |
| CSP changes prove CMP compliance | Incorrect. The message must be configured and published in the account; a footer button alone does not prove that. | Google storage consent signals default to denied before Google tags. Revocation uses the supported CMP callback queue and TCF applicability, with no ten-second polling deadline. Ads remain disabled until explicitly enabled after setup. |

## Supported advertising setup

This patch supports **manual ad units** so the site controls placement and can unmount them in Focus Mode. Disable Auto ads and optimization of existing units in AdSense. Pausing a queue or removing a script cannot reliably remove an already-running Auto ads placement. No ad should be clicked as a test.

Keep `NEXT_PUBLIC_ADSENSE_ENABLED` unset/false until the site is approved and consent settings have been verified. The AdSense verification meta tag and `ads.txt` remain present while serving is off. Set the existing publisher ID and real manual unit IDs before rebuilding; the example slot numbers are placeholders, not valid units belonging to this account.

Publish a certified European-regulations consent message for the actual domain. Enable the Google CMP's consent-mode support for both advertising and analytics. Test consent, refusal, returning visits and withdrawal in applicable regions. The code's denied defaults do not certify that the account configuration is correct. CMP and ad delivery against the live account were not tested locally.

Nonce CSP requires dynamic HTML rendering. This deliberately replaces static page HTML caching; static assets, social-image route outputs and discovery files retain their existing handling. The build audit now checks responses from a local production server rather than assuming every page has a prerendered `.html` file.

## Relay setup and rollout

The relay fails closed by default. Set server-only `PROXY_ACCESS_TOKEN` (a random value of at least 32 characters) and `PROXY_ALLOWED_ORIGINS` (comma-separated exact trusted HTTPS origins on port 443). Never expose the token as a `NEXT_PUBLIC_` variable. Authorized operators enter it in the API Client or Local Proxy password field; it is not persisted or forwarded to target services.

Local Proxy additionally needs those two secrets in Supabase, and an operator-configured `UTILBYTE_PROXY_URL` pointing to the deployed Next.js `/api/proxy` endpoint. Incoming webhook credentials/signatures are stripped before forwarding; use a direct tunnel for signature-verification tests. A changed tunnel origin must be approved by the operator.

Deploy the updated Next.js application and both Edge Functions, and apply `20261017000000_close_anonymous_request_tables.sql`. The migration is prepared but has not been run against a database. Keep forwarding disabled until its approved origins, private token and secured relay are configured. Existing bin URLs and captured data are retained. Process-local throttling is only a backstop; use hosting/edge rate controls for distributed abuse protection and add retention controls before handling sensitive or substantial webhook traffic.

After an authorized deployment, verify `ads.txt`, nonce/CSP matching and non-reuse, excluded routes, Focus Mode, proxy rejection without/with a forged Origin, approved authenticated requests, and CMP behavior. Check AdSense Sites/Policy center for the **exact** reason, then request the appropriate review. Google Ads campaign appeals and Google Maps/Business Profile rejections are different workflows. A Search Console indexing request does not clear an AdSense or Google Ads policy decision.

## Primary references

- [Google AdSense CSP integration](https://support.google.com/adsense/answer/16283098?hl=en)
- [Next.js nonce CSP and dynamic rendering](https://nextjs.org/docs/app/guides/content-security-policy)
- [Google publisher content policy](https://support.google.com/publisherpolicies/answer/11112688?hl=en)
- [Google CMP requirements](https://support.google.com/adsense/answer/13554020?hl=en)
- [Google Privacy & messaging API](https://developers.google.com/funding-choices/fc-api-docs)
- [react-markdown security guidance](https://github.com/remarkjs/react-markdown#security)
- [MDN X-Frame-Options](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/X-Frame-Options)

## Verification

All checks below were personally executed locally on the repaired archive. No remote CI result is claimed.

| Check | Result and evidence class |
| --- | --- |
| `npm test` | 100 tests passed; no failures or skips. Includes ad eligibility, delayed CMP readiness, zero-width units, Focus Mode remounts, sanitized Markdown, both worker runtimes, relay authorization, exact-origin checks, private/mixed DNS rejection, IP pinning, redirects, streamed size limits, Edge source execution with mocked Supabase/Deno boundaries, and operator-token non-disclosure. |
| `npm run type-check` | Passed. |
| `npm run build` | Passed with Next.js 16.2.4. |
| `npm run audit:build` | Passed: 78 local production responses, 55 tools, 3,210 internal links and 243 FAQ pairs; titles, metadata, canonical/social URLs, structured data and sitemap checks. See [build audit](build-audit.md). |
| Local HTTP checks | Fresh, matching header/HTML nonces on five documents; no shared HTML caching; true HTTP 404; missing and forged-Origin relay requests both rejected with 403. |
| Real browser | JSON sample conversion passed; Focus Mode hid editorial content while preserving output; JS sample ran and an infinite loop timed out; real Python/Pyodide sample ran; final production HTML preview button worked. Final tested production runner logged no CSP or hydration errors. See [conversion](verification/json-csv.jpg), [Python](verification/python-worker.jpg) and [HTML preview](verification/html-preview.jpg). |
| Content examples | CSV and TypeScript article example outputs were compared with the actual conversion functions and matched. |
| Ad serving and consent | Mocked browser/DOM tests passed. No live auction, real manual ad units, regional consent journey or account approval was exercised. |
| Supabase | Edge source was exercised with mocked boundaries. No live Supabase deployment, database migration or authenticated end-to-end webhook forwarding was executed. |

The initial preview check caught a missing serialized nonce on intentional preview scripts. Explicit nonce attributes fixed it, and the final production interaction was verified. Native head scripts keep preferences and denied consent defaults ahead of Google tags while avoiding the nonce-attribute hydration warning observed in development.

Production still needs a separately authorized application/Edge deployment, application of the prepared migration and verified AdSense/CMP/manual-unit settings. The exact Google rejection reason remains unconfirmed. These fixes do not guarantee approval.

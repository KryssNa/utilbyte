# AEO research and pre-change baseline

Reviewed 12 September 2026. This document records findings before the current AEO implementation. Findings below are not a claim that they remain unresolved after the implementation.

## Evidence and scope

The public [SearchFIT report](https://searchfit.ai/report/utilbyte.app) was read in a new background browser tab without modifying the user's work or submitting another analysis. It displays an overall score of **57/100**, nine platforms, three analyzed queries, and six recommendations. Its visible platform scores are:

| Platform | Reported score |
|---|---:|
| ChatGPT | 65 |
| Perplexity | 84 |
| Gemini | 85 |
| Claude | 15 |
| DeepSeek | 52 |
| Grok | 52 |
| Kimi | 35 |
| Qwen | 65 |
| Meta AI | 60 |

These are third-party report outputs, not an independent measurement of every model, a universal ranking, or a new post-change baseline. The report shows a 76-page sitemap and missing llms.txt. Several sentiment panels flag unreliable data. Its accessible content suggestions include a privacy/local-processing guide and a developer-utility use-case guide. The repository already contains a browser-versus-upload privacy guide, so duplicating that article would add little value. No report-generation date or complete methodology was independently verified.

The code review inspected the current working tree, which already contained uncommitted layout, search, and feedback changes. Those changes must not be assumed to exist on utilbyte.app. No deployment, external posting, account modification, or live Slack submission was performed.

## What official platform guidance supports

| Surface | Verified guidance | Relevant action |
|---|---|---|
| Google Search AI features | Existing Search eligibility, helpful original content, crawlability, and page experience remain relevant. Inclusion/indexing is not guaranteed. Google explicitly says llms.txt is not used for ranking or visibility. | Preserve crawlable tool content, accurate metadata, and useful working tools; check Search Console after deployment. [Google guidance](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) |
| ChatGPT Search | OAI-SearchBot controls automatic search crawling. GPTBot is a separate training control; ChatGPT-User is a user-directed fetcher and does not determine Search inclusion. | Keep public content accessible to OAI-SearchBot; verify provider IP ranges when diagnosing edge blocks. Do not equate training permission with search eligibility. [OpenAI crawler documentation](https://developers.openai.com/api/docs/bots) |
| Claude search | Claude-SearchBot supports search indexing; Claude-User fetches content for users. ClaudeBot is separately associated with training. Anthropic says these bots honor robots.txt and do not bypass CAPTCHA. | Diagnose real access logs and edge rules before concluding Claude's low report score is a crawl block. [Anthropic crawler documentation](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler) |
| Perplexity | PerplexityBot supports search and links; Perplexity-User handles user-directed requests. Their documentation recommends allowing the bot and published IP ranges for search access. | Keep public pages reachable and use verified current IP ranges if an actual firewall block is found. [Perplexity crawler documentation](https://docs.perplexity.ai/docs/resources/perplexity-crawlers) |
| Bing/Copilot | Search and grounding share crawling/indexing foundations. Canonical URLs, accurate sitemaps, internal links, and clear factual content matter. | Verify the property, submit the deployed sitemap, and use IndexNow only for real deployed additions/changes/removals. [Bing webmaster guidelines](https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a) |
| DeepSeek, Grok, Kimi, Qwen, Meta AI and other clients | No complete verified per-provider webmaster ranking contract was established in this audit. Meta's official crawler page returned HTTP 429. | Maintain generally accessible public HTML, truthful structured data, and standard MCP compatibility. Do not invent bot names, assert confirmed provider support, or promise their citation behavior. |

The [llms.txt proposal](https://llmstxt.org/) describes a file intended to help agents use websites. A generated index can be useful for clients that consume it, but it is optional supporting documentation. MCP similarly enables a connected client to discover or call exposed capabilities; it does not register a website in every model or guarantee citations.

## Prioritized code findings

1. **Remove unsupported trust claims.** The background-removal page emitted a standalone AggregateRating of 4.8 from 1,600 reviews without corresponding verified review evidence. It also described advanced AI processing despite the catalog's more limited plain-background description. Align metadata, FAQs, structured data, article text, and visible behavior; do not replace the rating with another estimate.
2. **Unify public product facts.** About displayed 46 tools and old category counts, plus blanket zero-upload/browser-only claims. Its explanatory text also failed to clearly cover direct WebSocket traffic and differed from the catalog's detailed processing modes. Derive counts from the catalog and explain local, direct-network, proxied, and hosted tools consistently.
3. **Use real revision dates.** Privacy and Terms rendered a new date as their update date on every build. Use explicit dates only when content is actually reviewed or changed. Avoid automatically marking every tool as newly updated for a global layout change.
4. **Keep existing good crawl foundations.** `src/app/robots.ts` already permits public paths for wildcard crawlers while excluding API, admin, and private paths. A named crawler allowlist is not required to unblock public content. If named groups are added, preserve the exclusions in each applicable group because wildcard rules do not automatically merge into more-specific groups. Sitemap routes already derive from the catalog and guides.
5. **Expose factual tool information consistently.** The catalog has 55 tools with processing notes, IDs, routes, aliases, and coarse supported input/output fields. These provide a stable source for an assistant-readable directory and discovery MCP service. Some IO values are generic category fallbacks; do not present them as exhaustive supported format lists. Machine-readable content should link to the same public tool descriptions people can read.
6. **Improve useful coverage rather than generating query variants.** Nine guides exist, with extensive image/PDF coverage and one SQL guide. A tested developer-workflow guide can explain how to format, inspect, convert, validate, and derive types from sample JSON using the actual tool limits and privacy differences. Keep the workspace easy to reach and place supporting content below it.
7. **Validate claims across generated output.** Existing audits cover canonicals, H1s, breadcrumbs, structured-data presence, and sitemap alignment. Extend checks to agent-discovery routes, exhaustive catalog coverage, valid links, no invented review scores, real processing modes, and consistency between human and assistant descriptions.

## What remains outside a local implementation

After deployment, confirm HTTP status/content for representative public pages, robots, sitemap, llms.txt, and MCP. Test crawlers at the actual hosting edge; a local user-agent response cannot prove remote bot IPs are allowed. Check Google Search Console indexing and the applicable AI-feature controls. In Bing Webmaster Tools, [AI Performance](https://www.bing.com/webmasters/help/ai-performance-9f8e7d6c) reports citations and grounding trends, not a universal ranking score.

Record deployed commit/time, a fixed set of real user tasks, platform/model/search mode, locale, date, and cited URLs. Repeat comparable observations rather than treating one small report as causally conclusive. No Search Console export, Bing account data, authenticated model-by-model evaluation, actual field performance dataset, or post-deployment citation uplift was available for this review. Perfect scores across all systems cannot be guaranteed by repository changes.

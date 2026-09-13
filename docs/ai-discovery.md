# AI discovery implementation

UtilByte publishes an index at `/llms.txt` and an expanded catalog at `/llms-full.txt`. Both are generated from `src/lib/tool-catalog.ts` and `src/content/guides/index.ts`, so added tools and guides appear without maintaining a second directory. Responses are static UTF-8 plain text, contain canonical URLs, and are publicly cacheable for one hour. The deployment's `NEXT_PUBLIC_BASE_URL` must be the canonical public origin, without a path or query string.

The expanded reference includes every tool's input/output data types, capability description, and exact processing note. It distinguishes browser processing, direct network connections, proxy traffic, and hosted storage. It links readers back to each tool for format support and limits rather than inventing universal limits. Guide entries are summaries and introductions, not copies of complete articles. No input files, comments, credentials, or request payloads enter these documents.

`/mcp` is the separate protocol endpoint for compatible MCP clients. Connection details belong on `/ai` and in [the MCP documentation](mcp.md). Publishing a text directory does not connect an assistant to the server automatically.

## Crawler policy

The existing wildcard robots policy remains in place: public pages are allowed, while `/api/`, `/admin/`, and `/private/` are excluded. This already covers search crawlers that follow robots.txt. No new AI-training consent or opt-out is introduced by this change. Training crawlers remain governed by the previous wildcard policy.

Do not add a crawler-specific `Allow: /` group without repeating private-path exclusions. Specific groups can replace the generic group rather than inheriting its rules. Both [Google's robots interpretation](https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec) and [Bing's robots instructions](https://www.bing.com/webmasters/help/how-to-create-a-robots-txt-file-cb7c31ec) document this behavior. Robots directives are crawl preferences, not access control for confidential content.

Provider documentation reviewed on 2026-09-12:

| Provider | Relevant distinction | Official source |
| --- | --- | --- |
| OpenAI | `OAI-SearchBot` controls search crawling; `GPTBot` is separate training access. `ChatGPT-User` handles user-directed retrieval, and robots rules may not apply. | [Crawler overview](https://developers.openai.com/api/docs/bots) |
| Anthropic | `Claude-SearchBot`, `Claude-User`, and `ClaudeBot` serve search, user-directed retrieval, and potential training respectively. | [Crawler controls](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler) |
| Perplexity | `PerplexityBot` serves search; `Perplexity-User` serves user-directed requests and generally ignores robots.txt. Published crawler IP ranges can help diagnose firewall blocks. | [Crawler documentation](https://docs.perplexity.ai/docs/resources/perplexity-crawlers) |
| Google | Search AI features use the existing Search eligibility requirements. `Google-Extended` controls separate Gemini training/grounding uses and is not a Search ranking signal. | [AI features](https://developers.google.com/search/docs/appearance/ai-features), [Crawler controls](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers) |
| Bing / Copilot | Bingbot honors robots exclusions and needs crawl access to read page indexing controls. | [Robots instructions](https://www.bing.com/webmasters/help/how-to-create-a-robots-txt-file-cb7c31ec), [Bing/Copilot URL removal](https://www.bing.com/webmasters/help/?topicid=37c07477) |

The [`llms.txt` proposal](https://llmstxt.org/) provides a readable directory convention. It is supplemental to ordinary crawlable pages and sitemaps; it does not prove that every assistant consumes the file. No provider promises a ranking, citation, or evaluation score because the file exists. Google's AI feature documentation explicitly says there are no additional technical requirements beyond Search eligibility and that eligibility does not guarantee inclusion.

## Verification and remaining operational work

`tests/ai-discovery.test.ts` checks complete catalog coverage, canonical tool links, exact privacy disclosures, guide inclusion, response types, and preservation of the existing robots rules. Run it through the normal test suite.

After deployment, check `/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/llms-full.txt`, and `/ai` from the public origin. Confirm canonical tags and rendered page content with Google Search Console and Bing Webmaster Tools. Review actual crawler logs and firewall behavior; sending a matching user-agent string alone does not establish that verified crawler IPs are allowed. Do not disable general security controls just to satisfy an external score.

Measure discovery separately from local implementation checks: record a fixed set of real user questions, provider/model and search settings, date, cited URLs, and answer accuracy. Re-run the same questions after recrawling and compare with the baseline. Local passing tests are not evidence that a provider indexed, cited, or ranked the deployed website. A third-party AEO score is one diagnostic and is not interchangeable with user success or provider search visibility.

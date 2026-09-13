import type { ToolArticleContent } from "@/components/shared/ToolArticle";

export const apiClientArticle: ToolArticleContent = {
  intro: [
    "Sending a request and seeing exactly what comes back is the fastest way to understand an API, and the fastest way to find out whether a bug is yours or theirs.",
    "This sends HTTP requests with the method, headers and body you specify and shows you the full response including status and headers.",
    "One thing to be clear about before anything else: unlike the file tools on this site, this one is not purely client-side. It cannot be. Read the section below before you paste a credential into it.",
  ],
  sections: [
    {
      heading: "Why this tool needs a server, and what that means for you",
      body: [
        "Browsers enforce the same-origin policy. A page on one domain cannot read a response from another domain unless that server explicitly opts in with CORS headers, and most APIs do not opt in for arbitrary web pages.",
        "So a browser-based API client that talked directly to the target would fail on nearly every real API. The way round it is a proxy: the browser sends your request to this site's server, that server makes the actual request, and the response comes back.",
        "The consequence is unavoidable and worth stating plainly. Your request - including any Authorization header, API key or request body - passes through a server you do not control. That is true of every online API testing tool that works against arbitrary hosts, not just this one.",
        "The practical advice: use test credentials, use a staging environment, and treat any production key you have pasted into any web-based client as one to rotate. For real work against production, a desktop client or curl keeps the request on your own machine.",
      ],
    },
    {
      heading: "Reading the status code properly",
      body: [
        "The status is the first thing to look at and it narrows the problem immediately.",
        "A 4xx means the request was wrong - your side. A 5xx means the server broke - their side. That single distinction saves a lot of time arguing.",
        "Within the 4xx range, the ones worth distinguishing: 400 means malformed, 401 means not authenticated, 403 means authenticated but not allowed, 404 means no such resource, 422 means well-formed but semantically invalid, and 429 means you are being rate limited.",
        "The 401 and 403 distinction is the one people conflate. 401 says the server does not know who you are - your token is missing, expired or malformed. 403 says it knows exactly who you are and you may not do this. Those need completely different fixes.",
      ],
      bullets: [
        "401 - token missing, expired or malformed.",
        "403 - authenticated, but not permitted.",
        "404 - wrong path, or a resource you cannot see (some APIs return 404 rather than 403 deliberately).",
        "422 - the JSON parsed but the values were rejected.",
        "429 - rate limited. Check the Retry-After header.",
      ],
    },
    {
      heading: "The header mistakes that cause most failures",
      body: [
        "A missing or wrong Content-Type is the most common. Sending JSON without declaring application/json makes many frameworks ignore the body entirely, and the error you get back is about missing fields rather than about the header.",
        "Accept is the mirror image - some APIs return XML by default and JSON only if you ask.",
        "Authorization format is next. Bearer tokens need the word Bearer and a space before the token; a token on its own fails as unauthenticated even though it is the correct token.",
        "And a trailing newline or space copied along with a token from a terminal will break it invisibly. If a credential that definitely works keeps failing, that is worth checking first.",
      ],
    },
    {
      heading: "Response headers are worth reading",
      body: [
        "The body gets all the attention and the headers often hold the answer.",
        "Rate limit headers tell you your remaining quota and when it resets, which turns an intermittent 429 into something predictable. Cache headers explain why you keep getting a stale response. Content-Type tells you what you actually received, which may not be what you assumed when a proxy or an error page is involved.",
        "And a Location header on a 3xx tells you where a redirect is pointing - useful when a request appears to succeed but against a different endpoint than you intended.",
      ],
    },
  ],
  example: {
    title: "The Content-Type failure, which never looks like a header problem",
    input: 'POST /api/users\nBody: {"name":"Kryss","role":"admin"}\nHeaders: (none set)',
    output: 'Response: 400 Bad Request\n{\n  "error": "name is required",\n  "error": "role is required"\n}\n\nSame request with Content-Type: application/json\n\nResponse: 201 Created\n{ "id": 4821, "name": "Kryss", "role": "admin" }',
    note: "The error message is about missing fields, which sends you off checking your JSON. The JSON was fine - the server never parsed it, because without the Content-Type header the framework did not know it was JSON and left the body untouched. An error that misdirects like this is worth recognising on sight, because the fix is one header and the search for it can take an hour.",
  },
  limitations: [
    "Requests are proxied through this site's server, so they are not private. Use test credentials, and rotate any production key you paste into a web-based client.",
    "Requests to localhost and private network addresses are blocked, since a public proxy that could reach internal addresses would be a server-side request forgery risk.",
    "Response size is capped, so very large payloads are truncated.",
    "Only a subset of request headers is forwarded. Unusual or hop-by-hop headers will not pass through.",
    "No collections, environments, saved requests or scripting. For sustained work against an API, a dedicated desktop client is the better tool.",
  ],
};

import type { ToolArticleContent } from "@/components/shared/ToolArticle";

export const apiClientArticle: ToolArticleContent = {
  intro: [
    "Sending a request and seeing exactly what comes back is the fastest way to understand an API, and the fastest way to find out whether a bug is yours or theirs.",
    "This sends HTTP requests with the method, headers and body you specify and shows you the full response including status and headers.",
    "Direct mode sends your request from your browser. Operator proxy mode sends it through the UtilByte server. Use synthetic data and test credentials in either mode.",
  ],
  sections: [
    {
      heading: "Choose direct mode or an operator proxy",
      body: [
        "Browsers enforce the same-origin policy. A page on one domain cannot read a response from another domain unless that server explicitly opts in with CORS headers, and most APIs do not opt in for arbitrary web pages.",
        "Direct mode works when the API permits your browser origin through CORS. It cannot override browser restrictions. A failed CORS request may have reached the destination even when the browser refuses to expose its response; do not repeat a write request without checking the destination.",
        "Operator proxy mode requires a separate proxy access token and an exact HTTPS origin approved in the deployment. Your target URL, allowed headers and body pass through the server. The proxy access token is separate from target credentials and is not forwarded to the destination.",
        "The practical advice: use test credentials, use a staging environment, and treat any production key you have pasted into any web-based client as one to rotate. For real work against production, a desktop client or curl keeps the request on your own machine.",
      ],
    },
    {
      heading: "Reading the status code properly",
      body: [
        "The status is the first thing to look at and it narrows the problem immediately.",
        "A 4xx response generally indicates that the service rejected the request, while a 5xx response indicates a server-side failure. Gateways, authentication layers and deliberate resource hiding can affect the interpretation. Read the service response before deciding where the problem lies.",
        "Within the 4xx range, the ones worth distinguishing: 400 means malformed, 401 means not authenticated, 403 means authenticated but not allowed, 404 means no such resource, 422 means well-formed but semantically invalid, and 429 means you are being rate limited.",
        "The 401 and 403 distinction is the one people conflate. 401 says the server does not know who you are - your token is missing, expired or malformed. 403 means the server refuses the request; it does not always imply that authentication succeeded. Those need completely different fixes.",
      ],
      bullets: [
        "401 - token missing, expired or malformed.",
        "403 - request refused, whether or not the server knows your identity.",
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
    "Direct mode sends requests from your browser and requires the destination to permit CORS. Optional proxy mode sends requests through this server and requires an operator token plus an approved HTTPS origin. Use test credentials.",
    "The operator proxy blocks private and special-use addresses, checks all DNS answers, and connects to a checked IP. Direct mode follows your browser security rules.",
    "Responses over 10 MB are rejected. Server proxy requests are limited to 512 KB and ten seconds; redirects are not followed.",
    "Only a subset of request headers is forwarded. Unusual or hop-by-hop headers will not pass through.",
    "No collections, environments, saved requests or scripting. For sustained work against an API, a dedicated desktop client is the better tool.",
  ],
};

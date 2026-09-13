import type { ToolArticleContent } from "@/components/shared/ToolArticle";

export const requestCatcherArticle: ToolArticleContent = {
  intro: [
    "Something is supposed to be sending you an HTTP request and you cannot tell whether it is. A webhook from a payment provider, a callback from an OAuth flow, an alert from a monitoring system.",
    "A request catcher provides a public URL for inspecting incoming HTTP methods, headers, query parameters and text bodies. This implementation omits Authorization headers and handles OPTIONS as a preflight rather than a stored request.",
    "This one necessarily runs on a server, because a public URL has to exist somewhere. That has privacy consequences, covered below.",
  ],
  sections: [
    {
      heading: "The question it answers first",
      body: [
        "Almost every webhook investigation starts with the same ambiguity: is the provider not sending, or is my endpoint not receiving?",
        "Those have completely different causes - a misconfigured provider, a wrong URL, a firewall, a crashed handler, a 500 the provider is silently retrying - and you cannot distinguish them from your own logs, because in both cases your logs are empty.",
        "Pointing the provider at a catcher settles it in one attempt. If a request appears, the provider is sending correctly and the problem is on your side. If nothing appears, stop debugging your handler.",
        "That single fact usually saves more time than everything else the tool does.",
      ],
    },
    {
      heading: "What to look at once a request arrives",
      body: [
        "The body is what you came for, but the headers are where the answers usually are.",
        "Content-Type tells you what the provider actually sent. A surprising number send form-encoded data when their documentation says JSON, and a handler expecting JSON will fail on it in a confusing way.",
        "Signature headers can help you understand a webhook integration. The catcher displays the received header values and a decoded text body, but this display is not a byte-preserving capture for cryptographic verification. Verify signatures against the original request bytes in your own handler.",
        "User-Agent identifies the sender, which is useful when several systems could be calling the same endpoint.",
        "For signature verification, use the exact request bytes required by the sender protocol. Parsing and re-serializing a payload can change those bytes; the catcher is for inspection rather than proving signature validity.",
      ],
      bullets: [
        "Content-Type - is it really JSON?",
        "Signature and timestamp headers - the shape you need to verify.",
        "User-Agent - who is actually calling.",
        "Text body - useful for inspection; verify signatures using original bytes in your own handler.",
      ],
    },
    {
      heading: "Treat the URL as public",
      body: [
        "This is the part to be careful about. A catcher URL is unauthenticated by design - anything can post to it, which is exactly what makes it useful.",
        "It also means whatever is sent there is stored on a server, and anyone who learns the URL can read it. A webhook payload frequently contains personal data, transaction details, or identifiers you would not want in a third-party system.",
        "Use synthetic data and sandbox integrations. Clearing a bin deletes its request rows but does not establish deletion from hosting logs or backups. No automatic retention cleanup is implemented in the supplied service.",
        "Do not leave a production webhook pointed at a catcher and forget about it. That is a slow leak.",
      ],
    },
    {
      heading: "What it cannot do",
      body: [
        "A catcher receives. It does not respond meaningfully, so it will not exercise anything that depends on your reply - and most providers treat a non-2xx response as a failure and retry.",
        "That means you cannot test your own retry handling, idempotency logic, or anything that depends on returning a particular status. For that you need your real handler, reachable from the internet - which is what a tunnel is for.",
        "The useful sequence is: catcher first, to establish that requests are arriving and to see their shape. Then a tunnel to your local handler, to test what your code does with them.",
      ],
    },
  ],
  example: {
    title: "A webhook that was not JSON",
    input: "Provider documentation says:\n  POST, application/json, signed payload",
    output: "What actually arrived:\n\nPOST /bin/a3f9c2\nContent-Type: application/x-www-form-urlencoded\nX-Signature: t=1787638861,v1=5257a869e7ec...\nUser-Agent: ProviderHook/2.1\n\nBody (raw):\n  payload=%7B%22event%22%3A%22charge.ok%22%7D&id=ev_88",
    note: "The documentation was wrong, or described a different API version. The JSON is there, but URL-encoded inside a form field rather than sent as the body - so a handler calling json() on the request gets nothing and reports a malformed payload. You would not find this from your own logs, because the handler failed before logging anything useful. Note also the signature format: comma-separated timestamp and version, which tells you exactly how to build the string to verify.",
  },
  limitations: [
    "Requests are stored in a hosted Supabase database. Bin IDs are not authenticated ownership: anyone with an ID can read or clear its requests, and the supplied database policies permit broad anonymous access. Use synthetic data only.",
    "The endpoint returns a generic success response. You cannot test behaviour that depends on your own reply, including retry and idempotency logic.",
    "No automatic expiry or storage-count cleanup is implemented. Listing recent requests has a count limit; that is not a retention policy.",
    "Bodies are captured as text rather than a binary archive. Hosting limits apply, and the tool is not suitable for verifying the original bytes of a binary payload.",
    "Local Proxy can configure forwarding to a public URL, including a tunnel to your local service. Forwarding removes some headers and can time out; it does not transparently reproduce every request.",
  ],
};

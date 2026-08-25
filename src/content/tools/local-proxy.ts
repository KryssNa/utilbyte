import type { ToolArticleContent } from "@/components/shared/ToolArticle";

export const localProxyArticle: ToolArticleContent = {
  intro: [
    "You are building a webhook handler. It runs on your laptop at localhost:3000. The provider that needs to call it lives on the internet and cannot see your laptop.",
    "That gap is the single most tedious part of integration work, and it is what tunnelling solves: a public URL that forwards to a port on your machine.",
    "This page manages the receiving end - a public endpoint you can point a provider at, with forwarding to a URL you nominate. The actual tunnel from the internet to your laptop needs a tunnelling client such as ngrok, cloudflared or localtunnel running locally, because a web page cannot reach your loopback interface.",
  ],
  sections: [
    {
      heading: "Why a browser cannot do this on its own",
      body: [
        "It is worth understanding the constraint rather than fighting it.",
        "A page on a public site cannot make requests to localhost on your machine. Browsers block it, and increasingly so - private network access restrictions exist specifically to stop a public page probing the machine it runs on. That is a good protection and you would not want it removed.",
        "There is also nothing to route to. Your laptop is behind NAT and a firewall; it has no address the internet can reach. Something has to open an outbound connection from your machine and hold it open, so traffic can come back down it.",
        "That is exactly what a tunnelling client does. It runs locally, connects out to a relay, and the relay gives you a public URL. This page complements that rather than replacing it.",
      ],
    },
    {
      heading: "The three things that go wrong",
      body: [
        "The Host header. Your local server receives a request whose Host is the tunnel's domain, not localhost. Frameworks with host validation - Django's ALLOWED_HOSTS, Rails' host authorisation - reject it outright, and the error is usually a blunt refusal rather than an explanation. Most tunnelling clients have an option to rewrite the Host header, and turning it on is normally the fix.",
        "HTTPS to HTTP. The public URL is HTTPS; your local server is plain HTTP. Anything constructing absolute URLs from the request will build http:// links, and OAuth redirect URIs in particular will not match what you registered. Look for the X-Forwarded-Proto header and trust it.",
        "The URL changing. Free tunnels usually issue a new random subdomain each time you restart, which means re-registering it with the provider every session. If you are doing this daily, a reserved subdomain is worth the cost purely in saved re-configuration.",
      ],
      bullets: [
        "Rewrite the Host header, or your framework will reject the request.",
        "Trust X-Forwarded-Proto, or you will generate http:// links behind an https:// URL.",
        "Expect the public URL to change on restart unless you have a reserved one.",
      ],
    },
    {
      heading: "A tunnel is a hole in your machine",
      body: [
        "For the duration, anything on the internet that knows the URL can reach the service on that port. Not just the provider you set it up for.",
        "Tunnel URLs get scanned. Random subdomains are discovered by crawlers and by certificate transparency logs faster than people expect, and a development server is exactly the sort of thing that has debug endpoints, verbose error pages, seeded credentials and no rate limiting.",
        "So: tunnel the specific port you need and nothing else, never point one at a database or an admin interface, use whatever authentication your tunnelling client offers, and shut it down when you stop working. Leaving one running overnight because you might need it tomorrow is how development databases end up on the internet.",
      ],
    },
    {
      heading: "The sequence that works",
      body: [
        "Catcher first. Point the provider at a request catcher and confirm it is actually sending, and see what the payload looks like. That eliminates half the possible causes before you touch your own code.",
        "Then tunnel. Once you know requests are being sent and you know their shape, forward them to your local handler and work on what your code does with them.",
        "Doing it the other way round means debugging your handler against a provider that may not be sending anything, which is where the wasted afternoons come from.",
      ],
    },
  ],
  example: {
    title: "The Host header rejection",
    input: "Local server: Django on localhost:8000\nTunnel URL:   https://a3f9-2401-8c2.ngrok-free.app",
    output: "Request arrives at the local server:\n  Host: a3f9-2401-8c2.ngrok-free.app\n  X-Forwarded-Proto: https\n\nDjango response:\n  400 Bad Request\n  Invalid HTTP_HOST header. You may need to add\n  'a3f9-2401-8c2.ngrok-free.app' to ALLOWED_HOSTS.\n\nFix: run the tunnel with host rewriting, or add the\nhost to ALLOWED_HOSTS for local development only.",
    note: "This is the first thing that happens to almost everyone, and the error is at least self-explanatory - many frameworks are less helpful. Note the X-Forwarded-Proto header in the same request: that is the one to trust when building absolute URLs, because the request reaching your server is plain HTTP even though the caller used HTTPS.",
  },
  limitations: [
    "This does not create the tunnel. Reaching a port on your own machine requires a tunnelling client running locally - ngrok, cloudflared, localtunnel or similar.",
    "The endpoint and forwarding state live on a server, so this part is not client-side and the URL should be treated as public.",
    "Requests to loopback and private network addresses are blocked from the public proxy, which is a deliberate protection against server-side request forgery.",
    "A tunnel exposes your local service to anyone who finds the URL. Point it at one port, authenticate it if you can, and close it when you finish.",
    "Free tunnel subdomains typically change on every restart, which means re-registering the URL with the provider each session.",
  ],
};

import type { ToolArticleContent } from "@/components/shared/ToolArticle";

export const websocketClientArticle: ToolArticleContent = {
  intro: [
    "WebSockets keep a connection open so both ends can send whenever they like. That is a genuinely different model from request and response, and it fails in different ways.",
    "This connects to a WebSocket endpoint, sends messages and shows what comes back, so you can check a server's behaviour without writing a client first. The connection is made by your browser directly to the server.",
  ],
  sections: [
    {
      heading: "The handshake, and why failures happen before any message",
      body: [
        "A WebSocket starts life as an HTTP request with an Upgrade header. The server either agrees and switches protocols, or it does not - and most problems happen right there, before a single message is exchanged.",
        "Authentication is the awkward part. The browser's WebSocket API does not let you set custom headers, so you cannot send an Authorization header the way you would with fetch. Servers work around this in one of three ways: a token in the query string, a cookie sent automatically with the handshake, or an authentication message sent as the first frame after connecting. Which one applies is a property of the server, and it is worth finding out before assuming your token is wrong.",
        "The other frequent failure is mixed content. A page served over HTTPS cannot open a plain ws:// connection - it must be wss://. Browsers block it outright and the error is not always clear.",
        "And CORS does not apply to WebSockets in the way people expect. Servers are supposed to validate the Origin header themselves, and a server that does will refuse connections from an origin it does not recognise. That is a legitimate reason a browser-based client may fail where a command-line client succeeds.",
      ],
      bullets: [
        "Custom headers are not possible from a browser - expect query-string tokens, cookies, or an auth message.",
        "An HTTPS page requires wss://, never ws://.",
        "Servers validate Origin themselves; some will refuse a browser client on principle.",
      ],
    },
    {
      heading: "Ping, pong and the silent disconnect",
      body: [
        "An idle WebSocket is not obviously alive. Proxies, load balancers and mobile networks close connections that have been quiet, often after thirty to sixty seconds, and frequently without either end being told.",
        "The result is the characteristic WebSocket bug: everything works in development, and in production messages stop arriving after a minute with no error anywhere.",
        "The protocol has ping and pong frames for exactly this, and they are handled at the protocol level so browser JavaScript cannot see or send them. Which is why most application protocols built on WebSockets add their own heartbeat message.",
        "If you are testing a server, sending nothing for a couple of minutes and seeing whether the connection survives is a more useful test than sending a hundred messages quickly.",
      ],
    },
    {
      heading: "Close codes say what happened",
      body: [
        "When a connection closes you get a numeric code, and it is considerably more informative than the fact of closing.",
        "1000 is a normal closure - both sides finished deliberately. 1001 means one side is going away, typically a browser navigating. 1006 is the important one: abnormal closure, meaning the connection dropped without a proper close frame. That is a network problem, a proxy timeout or a crashed server, not an application decision.",
        "1008 is a policy violation and 1011 is a server error, both of which usually carry a reason string worth reading.",
        "In short: 1006 means something broke underneath you, anything in the 4000 range is application-defined by the server you are talking to, and the reason string is where the detail lives.",
      ],
    },
    {
      heading: "Reconnection is your problem, not the protocol's",
      body: [
        "Nothing in WebSockets reconnects automatically. Once closed, it is closed, and every production client needs reconnection logic.",
        "Do it with exponential backoff and jitter. A fleet of clients that all reconnect after exactly one second will hit a recovering server simultaneously and knock it over again - the thundering herd, and it is a genuine cause of outages extending themselves.",
        "Also think about what happens to messages sent while disconnected. They are lost unless you queue them, and whether the server can replay what you missed depends entirely on that server. Ask early, because designing for it afterwards is painful.",
      ],
    },
  ],
  example: {
    title: "A connection that dies quietly",
    input: "Connect to wss://api.example.com/stream\nSend nothing. Wait.",
    output: "00:00  connected\n00:12  message received\n00:31  message received\n01:35  (nothing)\n02:10  (nothing)\n\nclose  code 1006, no reason\n\nIn a naive client: no error, no event handled,\nthe UI simply stops updating.",
    note: "Code 1006 with no reason is the signature of something in the middle closing an idle connection - a load balancer with a sixty second timeout is the usual culprit. Neither end sent a close frame, which is why a client that only listens for messages sees nothing at all rather than an error. This is the failure that never reproduces locally, because there is no proxy between your laptop and your dev server.",
  },
  limitations: [
    "Custom request headers cannot be set from a browser. If the server requires an Authorization header on the handshake, use a command-line client instead.",
    "A page served over HTTPS cannot connect to a ws:// endpoint - the server must offer wss://.",
    "Servers that validate the Origin header may refuse a browser-based client regardless of your credentials.",
    "Ping and pong frames are handled by the browser and are not visible here, so protocol-level keepalive cannot be observed or sent.",
    "Binary frames are shown as raw data rather than decoded - this is aimed at text protocols such as JSON.",
    "No automatic reconnection, message replay or saved sessions.",
  ],
};

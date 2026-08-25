import type { ToolArticleContent } from "@/components/shared/ToolArticle";

export const jwtDecoderArticle: ToolArticleContent = {
  intro: [
    "A JSON Web Token is three base64url segments separated by dots: a header, a payload, and a signature. Decoding the first two shows you what a token actually claims, which is what you want when an API is rejecting a request and you need to know why.",
    "This decodes the header and payload in your browser. It does not verify the signature, and that distinction is the whole of what follows.",
  ],
  sections: [
    {
      heading: "A JWT is signed, not encrypted",
      body: [
        "This surprises people the first time and it is the single most important property to internalise.",
        "The payload is base64url-encoded, not encrypted. Anyone holding the token can read every claim in it - user id, email, roles, tenant, whatever you put there - without any key at all. That is what this page is doing.",
        "The signature does not hide anything. It proves the token was issued by someone holding the signing key and has not been altered since. Confidentiality and integrity are different properties, and a JWT gives you the second one only.",
        "The practical rule: never put anything in a JWT payload that the bearer should not see. No internal identifiers you consider sensitive, no personal data beyond what the client already has, and certainly no secrets. If you need the contents hidden, that is a different mechanism.",
      ],
    },
    {
      heading: "Decoding is not verification",
      body: [
        "Reading a token tells you what it claims. It tells you nothing about whether those claims are true.",
        "Anyone can craft a token with any payload they like. Without checking the signature against the issuer's key, admin: true in a payload means only that somebody typed it.",
        "So decoding is a debugging aid - what is in this token, when does it expire, which issuer does it name - and never an authorisation decision. Verification happens server-side, with the key, on every request.",
        "There is a well-known family of attacks that exploit exactly this confusion: tokens with the algorithm set to none, or an asymmetric token re-signed with the public key as an HMAC secret. Any library worth using rejects both, but they exist because implementations trusted the header instead of their own configuration.",
      ],
    },
    {
      heading: "The claims worth checking first",
      body: [
        "When a token is being rejected, four fields explain most cases.",
        "exp is the expiry, as a Unix timestamp in seconds. An expired token is by far the most common cause, and the second most common is clock skew between the issuer and the verifier - which is why libraries allow a small leeway.",
        "iat is when it was issued, and nbf is the earliest it is valid. A token issued by a machine whose clock runs fast can be not-yet-valid on arrival.",
        "iss and aud name the issuer and the intended audience. A token that is perfectly valid for one service and presented to another fails on aud, and the error message rarely says so clearly.",
        "In the header, alg names the signing algorithm and kid identifies which key was used - useful when an issuer rotates keys and something is still verifying against the old one.",
      ],
      bullets: [
        "exp - expired, or clock skew between issuer and verifier.",
        "nbf - not valid yet, usually the same clock problem in reverse.",
        "aud - right token, wrong service.",
        "iss - not the issuer this service trusts.",
        "kid - verifying against a rotated-out key.",
      ],
    },
    {
      heading: "Paste with care",
      body: [
        "A JWT is a bearer credential. Whoever holds it can act as the user it describes until it expires.",
        "Pasting a live production token into a website means handing that credential to whoever runs the site. Plenty of JWT decoders are server-side, which means the token is in their logs.",
        "This one decodes in the page, so the token does not leave your browser - you can verify that by disconnecting the network and decoding anyway. Even so, the habit worth building is to use expired or test tokens when debugging, and to treat a production token you have pasted anywhere as one to be revoked.",
      ],
    },
  ],
  example: {
    title: "A decoded token, and what it tells you",
    input: "eyJhbGciOiJIUzI1NiIsImtpZCI6IjIwMjUtMDkifQ.\neyJzdWIiOiI0ODIxIiwicm9sZSI6ImFkbWluIiwiZXhwIjoxNzg3NTAwMDAwfQ.\nSflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
    output: 'Header\n  { "alg": "HS256", "kid": "2025-09" }\n\nPayload\n  { "sub": "4821", "role": "admin", "exp": 1787500000 }\n\nexp 1787500000 -> 23 Aug 2026, 21:06 UTC\nStatus: expired\n\nSignature: present, NOT verified',
    note: 'Two things. The token is expired, which is very likely the whole reason it was being rejected - and you can see that without any key. And role: admin is plainly readable, which is the point about signing versus encryption: that claim is public to anyone holding the token, and it is only trustworthy to a service that has checked the signature.',
  },
  limitations: [
    "The signature is not verified. This shows what a token says, never whether it is genuine - verification needs the key and belongs on the server.",
    "Encrypted tokens (JWE) are not supported. Only signed tokens (JWS) with readable payloads can be decoded.",
    "A malformed token gives an error rather than partial output. Tokens are three dot-separated segments; anything else will not parse.",
    "Timestamps are rendered in your local timezone, while the claims themselves are Unix seconds in UTC.",
    "Treat any production token you paste anywhere as compromised, and revoke it.",
  ],
};

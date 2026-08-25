import type { ToolArticleContent } from "@/components/shared/ToolArticle";

export const base64Article: ToolArticleContent = {
  intro: [
    "Base64 turns arbitrary bytes into a string of 64 safe characters. It exists because a lot of systems were built to carry text and choke on raw binary - email bodies, JSON fields, URLs, data attributes in HTML.",
    "This encodes and decodes both directions, handles the URL-safe alphabet, and copes with text in any script.",
  ],
  sections: [
    {
      heading: "It is encoding, not encryption",
      body: [
        "This is the misunderstanding worth killing first, because it turns up in real systems.",
        "Base64 provides no secrecy whatsoever. There is no key, and decoding takes one function call - anyone who can see the string can read the contents. It looks scrambled to a human, which is exactly why people mistake it for protection.",
        "Credentials sent in an HTTP Basic auth header are base64, and that is not a security measure - it is a transport convenience, and the security comes entirely from TLS around it. A base64 blob in a config file, a cookie, or a URL parameter is plaintext to anyone who cares.",
        "The other side of that coin: it costs you space. Three bytes become four characters, so anything encoded grows by about a third. That matters when the payload is an image inlined into a page.",
      ],
    },
    {
      heading: "Why so many tools break on non-English text",
      body: [
        "Base64 encodes bytes. Text is not bytes until you choose an encoding, and this is where implementations quietly differ.",
        "The browser's built-in btoa works on Latin-1 and throws on any character above U+00FF. So a naive implementation fails outright on Devanagari, Chinese, Cyrillic, Arabic, accented Latin, and every emoji. A lot of online base64 tools are exactly that naive implementation.",
        "The correct approach - and what this does - is to convert the text to UTF-8 bytes first and encode those. That is also what every server-side base64 library does, so the output round-trips against your backend rather than producing something that decodes to mojibake.",
        "If you have ever encoded a string here, decoded it in Python, and got different text back, this is why.",
      ],
    },
    {
      heading: "The standard alphabet and the URL-safe one",
      body: [
        "Standard base64 uses + and / as its last two characters and = for padding. All three are awkward in a URL: + means a space in query strings, / is a path separator, = separates parameters.",
        "So there is a URL-safe variant that substitutes - and _ and often drops the padding. JSON Web Tokens use it, as do plenty of APIs and file naming schemes.",
        "The two are otherwise identical, and a decoder that only accepts the standard alphabet will reject URL-safe input for no good reason. This one accepts either, and tolerates missing padding, because that is where the real-world strings come from.",
      ],
    },
    {
      heading: "Where you will actually meet it",
      body: [
        "Data URIs, where a small image is inlined into HTML or CSS as base64 rather than fetched separately - worth it for a tiny icon, wasteful for anything larger given the 33% overhead.",
        "JWTs, whose three segments are URL-safe base64 and readable by anyone.",
        "Email attachments, which is what base64 was invented for.",
        "Binary fields squeezed into JSON, which has no binary type.",
        "And keys and certificates - a PEM file is base64 with header and footer lines wrapped around it.",
      ],
    },
  ],
  example: {
    title: "Where the naive implementations fall over",
    input: 'Text: "café ☕"',
    output: 'btoa() directly:\n  InvalidCharacterError - the string contains\n  characters outside the Latin-1 range\n\nUTF-8 bytes, then base64:\n  Y2Fmw6kg4piV\n\nDecoded back: "café ☕"',
    note: "One accented letter and an emoji is enough to break the built-in function. The UTF-8 route handles both and produces the same string your backend would - which is the actual test of whether a base64 tool is correct, not whether it works on Hello World.",
  },
  limitations: [
    "Base64 is not encryption. Anything encoded here is readable by anyone who has the string.",
    "Encoded output is about 33% larger than the input. Do not use it to inline anything sizeable.",
    "Text is treated as UTF-8. If your source is in a different encoding, convert it first or the bytes will be wrong.",
    "Decoding arbitrary binary produces a text rendering of those bytes, which will look like nonsense - this is a text tool, not a file decoder.",
    "Very large inputs are held in memory and will be slow in the browser.",
  ],
};

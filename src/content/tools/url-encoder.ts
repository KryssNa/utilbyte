import type { ToolArticleContent } from "@/components/shared/ToolArticle";

export const urlEncoderArticle: ToolArticleContent = {
  intro: [
    "URLs may only contain a restricted set of characters. Everything else - spaces, ampersands, non-English letters, most punctuation - has to be percent-encoded, and getting it slightly wrong produces a link that half works.",
    "This handles full-URL encoding, component encoding, form-data encoding and base64, in both directions.",
  ],
  sections: [
    {
      heading: "Full URL or single component - the distinction that matters",
      body: [
        "This is the choice that causes most of the confusion, and picking wrong is why a link sometimes truncates at the first ampersand.",
        "Full-URL encoding preserves the characters that give a URL its structure: the colon after the scheme, the slashes, the question mark, the ampersands between parameters, the hash before a fragment. It is for taking a whole URL that contains a stray space or an accented letter and making it valid.",
        "Component encoding escapes those structural characters too. It is for a single value you are about to drop into a query string.",
        "The rule is simple once stated: encode each parameter value as a component, then assemble the URL. Encoding a whole assembled URL as a component breaks it. Encoding a value as a full URL leaves its ampersands intact, and the moment a user's input contains an ampersand your parameter is silently cut in half - which is also the shape of a query-injection bug.",
      ],
      bullets: [
        "Building a URL from parts: encode each value as a component.",
        "Fixing an existing URL that has a space or an accent in it: full-URL encoding.",
        "Never component-encode a complete URL. Never full-URL-encode a parameter value.",
      ],
    },
    {
      heading: "The plus sign problem",
      body: [
        "There are two conventions for encoding a space and they are not interchangeable.",
        "Percent-encoding gives %20 and works everywhere in a URL. HTML form submission historically encodes a space as +, a format called application/x-www-form-urlencoded, and that convention applies to query strings produced by forms.",
        "So a + in a query string might mean a space, or might mean a literal plus sign, and which one depends on how the receiving code parses it. This is precisely why email addresses containing a plus - the kind people use for filtering - so often break when passed through a URL. The address arrives with a space where the plus was.",
        "If you are hand-building a query string, use %20 and encode a literal plus as %2B. If you are producing form data, use the form-data option so the receiving form parser sees what it expects.",
      ],
    },
    {
      heading: "Double encoding",
      body: [
        "Encoding something twice turns the percent sign of the first pass into %25, so a space becomes %2520. Decoded once you get %20 rather than a space; decoded twice you get the original.",
        "It happens when a value passes through two layers that each helpfully encode, or when someone encodes a URL that was already encoded. The symptom is literal %20 sequences visible in a page or a filename.",
        "If you see %25 in a URL that should not contain a percent sign, that is double encoding. Decode until the output stops changing.",
      ],
    },
    {
      heading: "Non-English URLs",
      body: [
        "Percent-encoding operates on bytes, and text becomes bytes according to an encoding. Modern URLs use UTF-8, so a character outside ASCII becomes several percent-escapes - one per byte.",
        "That is why a Devanagari or Chinese word in a URL expands so dramatically: three bytes per character, three escapes, nine characters of URL for one character of text. It is correct, it is just verbose.",
        "Domain names work differently. Internationalised domains are converted using Punycode into an ASCII form beginning xn--, not percent-encoded - so the host part and the path part of the same URL use two different mechanisms.",
      ],
    },
  ],
  example: {
    title: "The same value, encoded three ways",
    input: 'Value: search term & more +1',
    output: "Component encoding\n  search%20term%20%26%20more%20%2B1        correct\n\nFull-URL encoding\n  search%20term%20&%20more%20+1           the & survives\n\nForm data\n  search+term+%26+more+%2B1               spaces become +\n\nAssembled: /search?q=search%20term%20%26%20more%20%2B1",
    note: "Look at the middle line. Full-URL encoding left the ampersand alone, because in a whole URL an ampersand is structure. Drop that into a query string and the server sees a parameter ending at more and a second parameter starting after it - the value is truncated, and a user who types an ampersand has accidentally injected a parameter. Component encoding is the only correct choice for a value.",
  },
  limitations: [
    "The tool encodes what you give it. It cannot tell whether your string is a whole URL or a single value - that judgement is yours, and it is the one that matters.",
    "Encoding is UTF-8. A source in another encoding produces different bytes and therefore different escapes.",
    "Internationalised domain names need Punycode, not percent-encoding, and that conversion is not provided here.",
    "Decoding a malformed percent sequence gives an error rather than a guess.",
    "Base64 is included for convenience but is a different mechanism entirely - it is not a URL encoding and its output still needs URL-safe handling.",
  ],
};

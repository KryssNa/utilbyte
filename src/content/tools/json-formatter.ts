import type { ToolArticleContent } from "@/components/shared/ToolArticle";

export const jsonFormatterArticle: ToolArticleContent = {
  intro: [
    "JSON arrives unreadable more often than not. A log line with the newlines stripped, an API response echoed into a terminal, a config value pasted out of an environment variable. Formatting it is the difference between staring at it and understanding it.",
    "This formats, validates, minifies and lets you query with JSON Path, in the browser.",
  ],
  sections: [
    {
      heading: "Formatting is validation, whether you asked for it or not",
      body: [
        "Laying out JSON requires parsing it, and parsing requires it to be valid. So if a formatter produces output, your JSON is syntactically correct. If it errors with a character position, that position is usually the fastest route to the problem in a large document.",
        "The error message rarely names the actual cause, though, and a handful of mistakes account for nearly all invalid JSON.",
      ],
      bullets: [
        "Trailing comma before a closing brace or bracket. Legal in JavaScript, not in JSON.",
        "Single quotes. JSON requires double quotes on both keys and string values.",
        "Unquoted keys. Also a JavaScript habit that JSON does not share.",
        "Backslashes before every internal quote - the document is double-encoded and needs unescaping once first.",
        "An error at position 0 on text that looks perfect - suspect a byte order mark from a Windows editor.",
      ],
    },
    {
      heading: "What formatting reveals that you would otherwise miss",
      body: [
        "Indentation makes types visible. On one line, a value in quotes and a value without look much the same at a glance. Laid out, it is obvious that count is the string \"42\" rather than the number 42 - which is the sort of thing that produces a bug three layers away in code that does arithmetic on it.",
        "The same goes for shape. Whether roles is a single string or an array of one is invisible in a dense blob and unmissable once formatted, and it changes how you write the code consuming it.",
        "Null versus absent is the third. A key present with a null value and a key that simply is not there mean different things in most APIs, and you can only see which you have when the structure is laid out.",
      ],
    },
    {
      heading: "Minifying, and when it is worth it",
      body: [
        "Minifying strips whitespace. It is the right form for anything transmitted or stored - a config baked into a build, a payload over the wire - and the wrong form for anything a human reads or a version control system diffs.",
        "The saving is real but usually smaller than expected, because JSON going over HTTP is normally gzipped anyway, and gzip is very good at repeated whitespace. Minify because the destination expects it, not because you are chasing bytes.",
        "The one case where it genuinely matters is JSON stored inside another string, where the escaping doubles the cost of every character - including all that whitespace.",
      ],
    },
    {
      heading: "JSON Path, for when the document is too big to read",
      body: [
        "Once a response runs past a few hundred lines, formatting stops being enough and you want to ask a question instead of scrolling.",
        "JSON Path expressions do that: pull one field from deep in a structure, or the same field from every element of an array. It is the quickest way to answer questions like whether any item in a list is missing a required key, or what the distinct set of values in one field is - both of which are painful by eye and trivial as a query.",
      ],
    },
  ],
  example: {
    title: "What one line was hiding",
    input: '{"id":4821,"count":"42","user":{"name":"Kryss","roles":["admin"]},"deletedAt":null}',
    output: '{\n  "id": 4821,\n  "count": "42",\n  "user": {\n    "name": "Kryss",\n    "roles": [\n      "admin"\n    ]\n  },\n  "deletedAt": null\n}',
    note: "Three things become obvious. count is a string, not a number, so anything adding to it will concatenate instead. roles is an array with one element, not a string - code treating it as a string gets \"admin\" character by character. And deletedAt is explicitly null rather than absent, which in most APIs means something different from missing.",
  },
  limitations: [
    "Formatting proves the syntax is valid. It cannot tell you whether the data is correct or matches a schema.",
    "Comments are not part of JSON. A document containing them will fail to parse, even though several tools accept them as an extension.",
    "Very large documents are limited by browser memory, and the tree view slows noticeably on deeply nested structures.",
    "Key order is preserved on formatting but is not meaningful in JSON. Do not rely on it.",
    "Numbers pass through the browser's parser, so very large integers beyond the safe range lose precision - a known JSON limitation, not one this tool introduces.",
  ],
};

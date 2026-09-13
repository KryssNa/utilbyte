import type { ToolArticleContent } from "@/components/shared/ToolArticle";

export const textFormatterArticle: ToolArticleContent = {
  intro: [
    "Somebody has handed you a wall of text that is meant to be structured. A JSON blob copied out of a log line with every newline stripped. A SQL query written as one 400-character sentence. A block of minified CSS you need to read.",
    "Formatting aims to make structure easier to read. This tool uses basic text rules outside JSON, so keep the original and check that the result still means the same thing.",
    "This offers JSON, XML, SQL, CSS, JavaScript and TypeScript modes. Only JSON is parsed and checked for syntax errors; the other modes are not validators.",
  ],
  sections: [
    {
      heading: "Formatting is not the same as validating, except when it is",
      body: [
        "These are different operations that overlap in a useful way.",
        "For JSON, formatting requires parsing, and parsing requires the input to be valid. So a formatter is a validator by side effect: if it produces output, your JSON is syntactically correct, and if it errors, it tells you where. That error position is often the fastest way to find a missing comma in a large document.",
        "For SQL and CSS the relationship is weaker. Both can be re-indented on a fairly shallow reading of the text, so a formatter will happily lay out a query that references a table which does not exist, or CSS with a property name that means nothing. Formatting tells you the shape is plausible. It does not tell you it works.",
        "The practical upshot: JSON must parse to produce output. Formatting SQL does not establish syntax validity, balanced brackets or correct query behavior.",
      ],
    },
    {
      heading: "The mistakes JSON errors are actually telling you about",
      body: [
        "A handful of problems account for most invalid JSON, and the error message rarely names them directly.",
        "Trailing commas. Valid in JavaScript object literals, invalid in JSON. Something written by hand, or copied out of a code file, very often has one.",
        "Single quotes. JSON requires double quotes for both keys and string values. A JavaScript object pasted in as-is will fail on this immediately.",
        "Unquoted keys. Again fine in JavaScript, not in JSON.",
        "Double-encoded strings, where a JSON document has been serialised into a string and embedded inside another one. You can spot it by the backslashes before every internal quote. It needs unescaping once before it will parse.",
        "And the invisible one: a byte order mark or a stray non-printing character at the very start of the file, usually from a Windows text editor. The document looks perfect and fails at position zero, which is a genuinely baffling error until you know to look for it.",
      ],
      bullets: [
        "Trailing comma before a closing brace or bracket.",
        "Single quotes instead of double.",
        "Unquoted object keys.",
        "Escaped quotes everywhere - the string is double-encoded.",
        "Error at position 0 with valid-looking text - suspect a byte order mark.",
      ],
    },
    {
      heading: "SQL: why formatting a query is worth the moment it takes",
      body: [
        "Long queries are written incrementally and end up as a single line because that is how they came out of the tool that generated them. Reading one is genuinely hard, and the difficulty is not incidental - most SQL mistakes are structural.",
        "Once a query is laid out with each clause on its own line and joins indented under the tables they attach to, the common errors become visible rather than hidden: a join condition that was never written, so the query is producing a cross product; an OR inside a WHERE clause without brackets, which binds differently from what the author meant; a GROUP BY that does not cover every non-aggregated column.",
        "None of these are syntax errors. They all run. They just return the wrong rows, which is a considerably worse failure than a query that refuses to execute, because nobody notices.",
        "One caution: format queries you are reading, not necessarily queries in version control. Reformatting a large query wholesale produces a diff that touches every line and hides whatever you actually changed. If a project has a house style, follow it rather than imposing a formatter's.",
      ],
    },
    {
      heading: "Where a general formatter stops",
      body: [
        "The JavaScript, TypeScript and CSS formatting here is indentation and line breaking. It is enough to make minified or badly laid out code readable, which is what you usually want when you have been handed something and need to understand it.",
        "It is not a substitute for a real code formatter in a codebase. Prettier, gofmt, Black and their equivalents encode a full opinion about line width, quote style, bracket placement and how to break long expressions, and they are configured per project so everyone's output matches. Running arbitrary text through a different formatter and committing the result creates noise for everyone else.",
        "The honest division of labour: use this to read something, use your project's formatter to write something.",
        "Two more things worth knowing. Comments and blank lines are structural to humans and invisible to a naive formatter, so they can be moved or lost. And minified code that has been through a bundler has had its variable names shortened - formatting restores the line breaks but nothing restores the names, so it will be readable and still not friendly.",
      ],
    },
  ],
  example: {
    title: "A log line becoming something you can read",
    input: '{"id":4821,"user":{"name":"Kryss","roles":["admin","editor"]},"active":true,"meta":{"lastSeen":1787638861,"source":null}}',
    output: '{\n  "id": 4821,\n  "user": {\n    "name": "Kryss",\n    "roles": [\n      "admin",\n      "editor"\n    ]\n  },\n  "active": true,\n  "meta": {\n    "lastSeen": 1787638861,\n    "source": null\n  }\n}',
    note: "Identical data, and now you can see that meta.source is null and that roles is an array rather than a string - two things that are almost impossible to spot in the single-line form and that change how you write the code consuming it. Also note lastSeen: ten digits, so it is Unix seconds, not milliseconds. Formatting is what makes those details visible.",
  },
  limitations: [
    "The non-JSON modes apply text substitutions and can alter strings, comments or code incorrectly. Review the result; formatting success does not prove correctness.",
    "Only JSON is genuinely validated by the process. SQL and CSS can format cleanly while being semantically nonsense.",
    "The JavaScript and TypeScript handling is indentation, not a full formatter. For a codebase, use the project's own formatter so everyone's output matches.",
    "Comments and blank lines may be moved or lost, since they carry no structural meaning to a formatter.",
    "Minified code gets its line breaks back but not its original variable names - those were discarded by the minifier.",
    "JSON uses native JSON.parse here, so duplicate keys can be discarded and unsafe numbers can round. Use the dedicated JSON Formatter when you need its duplicate-key and numeric-safety checks. Large documents also depend on available browser memory.",
  ],
};

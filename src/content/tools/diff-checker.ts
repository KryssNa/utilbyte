import type { ToolArticleContent } from "@/components/shared/ToolArticle";

export const diffCheckerArticle: ToolArticleContent = {
  intro: [
    "Two versions of something, and you need to know what changed. A config file that works on one server and not another. A response before and after a deploy. Text a colleague edited without tracking changes.",
    "This compares two blocks of text and highlights the differences, in the browser.",
  ],
  sections: [
    {
      heading: "The differences you cannot see",
      body: [
        "Most baffling diffs come down to characters that do not render, and this is the first thing to suspect when two files look identical and behave differently.",
        "Line endings are the big one. Windows ends lines with carriage return and line feed, Unix and macOS with line feed alone. A file that has been through a Windows editor differs from its Unix twin on every single line, while looking identical on screen. If a diff shows everything changed and nothing looks different, this is almost always it.",
        "Trailing whitespace is next - a space at the end of a line, invisible, and a real difference to any comparison.",
        "Then tabs versus spaces, which render the same width and are entirely different bytes. And in text that has been through a word processor, curly quotes and en dashes substituted for their straight ASCII equivalents.",
        "Finally, a byte order mark at the start of a file, which makes the first line differ from an otherwise identical one.",
      ],
      bullets: [
        "Every line differs, nothing looks different: line endings.",
        "One line differs, looks identical: trailing whitespace or tab-versus-space.",
        "First line only: byte order mark.",
        "Quotes and dashes: text that has been through a word processor.",
      ],
    },
    {
      heading: "Why diffs sometimes align badly",
      body: [
        "A diff algorithm finds a minimal set of changes turning one text into the other. Minimal is not the same as most readable, and where a file contains repeated similar lines the algorithm can pair up the wrong ones.",
        "You see it most in code with lots of closing braces, or in structured data where many lines look alike. The result is a diff showing a deletion and an addition several lines apart when what actually happened was one small edit in the middle.",
        "The output is still correct - applying it produces the right result. It is just harder to read than it needs to be. Comparing smaller regions usually resolves it.",
      ],
    },
    {
      heading: "What a text diff is not for",
      body: [
        "Formatted documents. A .docx is a zip of XML, so comparing two of them as text tells you nothing useful. Use the word processor's own compare feature.",
        "Structured data where order does not matter. Two JSON objects with the same keys in a different order are semantically identical and will diff as completely changed. Format both consistently first, or use a comparison that understands the structure.",
        "Reformatted code. Running a formatter over a file before comparing produces a diff touching every line and burying whatever actually changed. Compare like with like.",
      ],
    },
    {
      heading: "The habit that saves the most time",
      body: [
        "When something works in one environment and not another, diffing the two configurations is very often faster than reasoning about it. The difference is usually a single value, and finding it by reading is slow while finding it by comparison is instant.",
        "The same applies to API responses before and after a change, and to a working example against your own non-working one.",
        "The one caution: configs contain secrets. Diffing production configuration in a browser tab is fine here because nothing leaves the page, and a bad habit to acquire generally, because most online diff tools are server-side. Redact keys and tokens before pasting them anywhere you have not verified.",
      ],
    },
  ],
  example: {
    title: "A diff that looks like nothing changed",
    input: "Left:   DATABASE_URL=postgres://db:5432/app\nRight:  DATABASE_URL=postgres://db:5432/app ",
    output: "1 line changed\n\n- DATABASE_URL=postgres://db:5432/app\n+ DATABASE_URL=postgres://db:5432/app·\n\n(· marks a trailing space)",
    note: "One invisible character, and depending on how the config is parsed the value may include that space - producing a hostname lookup that fails for no visible reason. This is the case where a diff earns its keep: it can see what you cannot, and it is why comparing is a better first move than reading when two supposedly identical things behave differently.",
  },
  limitations: [
    "Plain text only. Word documents, PDFs and spreadsheets need a comparison that understands their format.",
    "Comparison is literal. Semantically equivalent content - reordered JSON keys, reformatted code - shows as entirely changed.",
    "Line endings and trailing whitespace are treated as real differences, because they are. That is usually helpful and occasionally noisy.",
    "Very large inputs are limited by browser memory, and the diff algorithm slows on long, highly similar texts.",
    "Two documents at a time, with no three-way merge and no ability to apply the changes.",
  ],
};

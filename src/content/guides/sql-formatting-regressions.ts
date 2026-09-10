import type { Guide } from "./types";
export const sqlFormattingRegressionsGuide: Guide = {
  slug: "sql-formatting-regressions",
  title: "SQL formatting edge cases you can reproduce",
  metaTitle: "SQL Formatter Regression Corpus and Limitations",
  metaDescription: "Reproduce SQL formatting tests for quoted values, comment boundaries, parameters, and dialects. See exactly what the tests cover and what they do not prove.",
  keywords: ["sql formatter tests", "sql formatting comments", "sql quoted strings"],
  published: "2026-09-10", updated: "2026-09-10", readingMinutes: 4,
  summary: "A SQL formatter should preserve quoted values and comment boundaries. This guide explains the checked fixtures and how to reproduce them in the open-source repository.",
  intro: ["Replacing spaces across an entire query can change a value such as 'a  b' into 'a b'. Replacing keyword text inside strings is equally unsafe. UtilByte now uses a dialect-aware formatter instead of these global replacements.", "The test corpus checks specific cases. It does not validate a query, prove semantic equivalence, or guarantee every vendor extension is supported."],
  sections: [
    { heading: "Run the corpus", body: ["In the repository, run npm ci followed by npm test. tests/sql-format.test.ts contains the executable fixtures. src/lib/sql-format.ts is the same formatting entry point used by the page. package-lock.json records the formatter dependency version.", "The suite exercises Standard SQL, PostgreSQL, MySQL, and SQLite with two indentation widths and three keyword-case settings. Inspect the test output for your checkout rather than assuming this page is a live production test result."] },
    { heading: "What the assertions check", body: ["Quoted whitespace, strings containing SQL keywords, doubled and backslash-escaped quotes, line and block comment boundaries, quoted identifiers, parameters, CTEs, nested queries, and multiple statements are represented."], bullets: ["The exact literal 'a  b' survives formatting.", "A -- line comment stays separated from the following WHERE clause by a newline.", "PostgreSQL dollar quoting and $1 parameters are retained.", "MySQL backticks and SQLite bracketed identifiers are retained.", "Malformed and oversized input fail instead of producing a successful replacement."] },
    { heading: "Try it in the tool", body: ["Paste SELECT 'a  b', 'SELECT, FROM' FROM users -- keep comment followed by a newline and WHERE id = 1;. Choose a dialect, format, and compare the quoted values and the comment boundary before using the result.", "Repeat with your own non-sensitive examples. A clean layout does not tell you whether a table exists or whether a query returns the rows you intended."] },
    { heading: "Scope of the evidence", body: ["These are deterministic local regression tests, not a benchmark or a live browser network trace. Device performance, installed database behavior, field Core Web Vitals, and production deployment parity are separate measurements.", "Report a failing case with a small synthetic query and the selected dialect. Avoid posting tokens, customer data, or proprietary queries in public issues."] },
  ],
  relatedTools: [{ label: "SQL Formatter", href: "/dev-tools/sql-formatter", description: "Format a query using an explicit dialect." }, { label: "Diff Checker", href: "/dev-tools/diff-checker", description: "Compare text before and after formatting." }],
};

import type { ToolArticleContent } from "@/components/shared/ToolArticle";

export const markdownRendererArticle: ToolArticleContent = {
  intro: [
    "Markdown is plain text that reads fine as plain text and turns into structured HTML when something renders it. That is the whole idea, and it is why it ended up as the format for READMEs, issue trackers, documentation and note-taking apps.",
    "This renders as you type, so you can check a table lines up or a nested list nests correctly before pasting it somewhere that matters.",
  ],
  sections: [
    {
      heading: "There is no single Markdown",
      body: [
        "The original 2004 description left a lot unspecified, and implementations filled the gaps differently. The result is that the same document can render differently in two places, which is the source of most Markdown frustration.",
        "CommonMark is the attempt to pin the ambiguities down, and most modern renderers follow it. GitHub Flavored Markdown builds on CommonMark and adds the features people actually want: tables, strikethrough, task lists, and automatic linking of bare URLs.",
        "Tables in particular are not in original Markdown at all. If a table renders here and appears as raw pipes somewhere else, that destination is not using a GFM-compatible renderer.",
        "So the useful habit is to preview in something close to where the text is going. A README should be checked against a GitHub-style renderer; a document for a wiki should be checked in that wiki.",
      ],
    },
    {
      heading: "The four things that trip people up",
      body: [
        "Line breaks. A single newline in Markdown is not a line break - consecutive lines join into one paragraph. To force a break you need two trailing spaces, or a blank line for a new paragraph. This surprises everyone once, and it is why pasted text sometimes collapses into a wall.",
        "List indentation. Nesting depends on indentation, and mixing tabs and spaces produces lists that nest in ways you did not intend. Pick one and be consistent.",
        "Blank lines around block elements. A list, a table or a code fence needs a blank line before it. Without one, many renderers treat it as part of the preceding paragraph and it comes out as literal text.",
        "Characters that mean something. Underscores inside a variable name can start italics, asterisks in text can start bold, and a hash at the start of a line becomes a heading. Escape them with a backslash, or wrap the text in backticks.",
      ],
      bullets: [
        "One newline joins lines. Use a blank line for a new paragraph.",
        "Put a blank line before lists, tables and code fences.",
        "Be consistent about tabs versus spaces in nested lists.",
        "Escape stray underscores, asterisks and leading hashes with a backslash.",
      ],
    },
    {
      heading: "Code fences and why the language tag matters",
      body: [
        "Fenced blocks - three backticks - are better than indented blocks in every way, and adding a language after the opening fence enables syntax highlighting wherever the document ends up.",
        "The tag is also documentation in itself. A block tagged bash tells a reader to run it in a shell; the same block tagged json tells them it is data. That distinction gets lost in an untagged block.",
        "If your code itself contains three backticks, use four for the fence. This comes up constantly when writing documentation about Markdown.",
      ],
    },
    {
      heading: "Rendering untrusted Markdown",
      body: [
        "Most Markdown renderers allow raw HTML through, because the original specification did. That means a Markdown document can contain a script tag, and a renderer that passes HTML through unsanitised will execute it.",
        "For your own notes this does not matter. For anything user-submitted - comments, profiles, issue bodies - it is a cross-site scripting hole, and it is why platforms that accept Markdown from users sanitise the output rather than trusting the input.",
        "Worth knowing if you are building something that renders Markdown other people wrote: render, then sanitise the resulting HTML with a well-maintained library. Do not try to filter the Markdown source.",
      ],
    },
  ],
  example: {
    title: "The single-newline trap",
    input: "Roses are red\nViolets are blue\n\nThis is a new paragraph.",
    output: "Roses are red Violets are blue\n\nThis is a new paragraph.\n\nWith two trailing spaces after \"red\":\n\nRoses are red\nViolets are blue",
    note: "The first two lines joined, because a single newline is not a line break in Markdown - it is just whitespace between words. This catches people pasting addresses, poetry, or anything where the line structure carries meaning. Two trailing spaces force the break, and since trailing spaces are invisible and many editors strip them, a backslash at the end of the line is the more robust option in renderers that support it.",
  },
  limitations: [
    "Rendering follows one implementation. GitHub, GitLab, Notion and various wikis differ in their extensions - always preview where the document is actually going.",
    "Raw HTML in the source is rendered. That is standard behaviour and a security consideration for anything user-submitted.",
    "No export to HTML or PDF. This previews rather than converts.",
    "Nothing is saved. Close the tab and the text is gone.",
    "Very large documents will slow the live preview, since it re-renders as you type.",
  ],
};

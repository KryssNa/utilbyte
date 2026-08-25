import type { ToolArticleContent } from "@/components/shared/ToolArticle";

export const codeBeautifierArticle: ToolArticleContent = {
  intro: [
    "Minified code is unreadable by design. Whitespace stripped, line breaks gone, and the whole file on one enormous line. Beautifying puts the structure back so you can follow it.",
    "This re-indents HTML, CSS and JavaScript in the browser. It is a reading tool - what it can and cannot recover is worth knowing before you rely on it.",
  ],
  sections: [
    {
      heading: "What beautifying gets back, and what is gone for good",
      body: [
        "Line breaks and indentation come back, and they are most of what you need to trace control flow.",
        "Names do not. A minifier's main saving is not whitespace, it is shortening every local variable and function name to one or two characters. Beautified minified code is properly laid out and full of variables called a, e and t, and no tool can invent the original names.",
        "Comments are gone too - stripped by the minifier and unrecoverable.",
        "So the realistic expectation: beautified bundle output is followable rather than pleasant. You can trace what happens; you cannot read it the way you would read source.",
        "The proper answer, when it exists, is a source map. If the site ships one, your browser's devtools will show you the original source with real names and comments, which is enormously better than anything a beautifier can do. Check for a sourceMappingURL comment at the end of the file before spending time on beautified output.",
      ],
    },
    {
      heading: "Where automatic indentation gets it wrong",
      body: [
        "In HTML the ambiguity is whitespace-sensitive elements. Inside a pre or a textarea, the whitespace is content - reindenting changes what the page displays. Inline elements are a subtler version: adding a line break between two spans introduces a space where there was none, which shifts the layout.",
        "In JavaScript the classic hazard is automatic semicolon insertion. Code that relies on it works when the line breaks fall in particular places, and moving them can change behaviour. This is rare in practice and it is the reason most style guides insist on explicit semicolons.",
        "In CSS, the risk is low - it is a simple enough grammar that reformatting is usually safe.",
        "The practical rule: beautify to read, not to edit and ship. If you are going to modify the code, work from the real source.",
      ],
      bullets: [
        "Names and comments cannot be recovered from minified code.",
        "Check for a source map before beautifying - it is far better if one exists.",
        "pre and textarea contents are whitespace-sensitive; reindenting changes them.",
        "Beautify to read. Do not beautify and commit.",
      ],
    },
    {
      heading: "This is not a project formatter",
      body: [
        "The indentation here is enough to make something readable. It is not Prettier.",
        "A real formatter has a full opinion - line width, quote style, bracket placement, how to break a long chain - and it is configured per project so that everyone's output is byte-identical. That consistency is the entire point: it removes formatting from code review.",
        "Running arbitrary text through a different formatter and committing the result creates noise for everyone else on the project. Use your project's formatter for code you are writing, and this for code you have been handed.",
      ],
    },
    {
      heading: "Reading someone else's bundle",
      body: [
        "The common reason to be here is investigating how a page does something, or debugging a third-party script that is misbehaving.",
        "Two things help. Find the entry point rather than reading top to bottom - modern bundles are a module registry followed by a small bootstrap, and the interesting code is rarely at the start. And search for string literals, which survive minification intact: an error message, a URL, or a CSS class name will take you straight to the relevant function far faster than reading will.",
      ],
    },
  ],
  example: {
    title: "Minified in, readable out, names still gone",
    input: 'function t(e,n){return e.filter(function(t){return t.id===n})[0]||null}',
    output: "function t(e, n) {\n  return e.filter(function (t) {\n    return t.id === n;\n  })[0] || null;\n}",
    note: "The structure is now obvious - it finds the first element with a matching id, or null. What is not obvious is what any of it is called. The original was probably findById(items, id), and there is no way back to that from here. Note too that the inner parameter t shadows the outer function t, which is the sort of thing a minifier does freely and a human never would.",
  },
  limitations: [
    "Minified variable and function names cannot be restored. Neither can comments.",
    "This is indentation, not a full formatter. For code you are committing, use your project's formatter.",
    "Whitespace-sensitive HTML - pre, textarea, and spacing between inline elements - can be altered by reindenting.",
    "No syntax validation. Broken code is laid out just as readily as working code.",
    "Large bundles are limited by browser memory and will be slow.",
  ],
};

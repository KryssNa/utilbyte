import type { ToolArticleContent } from "@/components/shared/ToolArticle";

export const onlineCompilerArticle: ToolArticleContent = {
  intro: [
    "Use this browser scratchpad to try a short JavaScript or Python snippet, inspect console output, or preview HTML and CSS. It is useful for checking a calculation or isolating a small example before moving it into your project.",
    "JavaScript and Python execute in dedicated workers without access to the page DOM. Python runs through Pyodide, which downloads a browser runtime on first use. The runner does not upload your source to an execution server, but the code you run can itself access browser capabilities and make network requests.",
  ],
  sections: [
    {
      heading: "What each editor mode actually does",
      body: [
        "JavaScript evaluates the current text and captures supported console calls. Python executes through Pyodide and captures standard output and errors. HTML and CSS create a browser preview.",
        "The TypeScript editor currently passes its contents to the JavaScript evaluator without a transpilation step. JavaScript-compatible syntax can run, but type annotations, interfaces and other TypeScript-only syntax fail. Use a TypeScript compiler or your project's build for typed code.",
        "JSON and Markdown appear in the mode list, but they do not provide the dedicated formatter and Markdown renderer available elsewhere on UtilByte. Use those tools for strict JSON validation or rendered Markdown.",
      ],
    },
    {
      heading: "Local execution does not mean isolated execution",
      body: [
        "Workers cannot access the page DOM or localStorage, but can use network and some origin storage APIs. Python also has a virtual filesystem and browser bridge. Worker execution is not a security sandbox for untrusted code.",
        "Run only code you understand, using synthetic data. Do not include passwords, production credentials or sensitive documents. HTML and CSS previews run in a sandboxed iframe. Remote images can contact their hosts. Inline event attributes are blocked by CSP; attach listeners from a script element. Network requests, forms and nested frames are blocked in the preview.",
        "A worker is terminated after five seconds of execution. Python has a separate 30-second runtime loading limit. Stop cancels a pending run, and switching languages discards its results. Large allocations can still strain the browser; keep examples small.",
      ],
    },
    {
      heading: "Console output and asynchronous work",
      body: [
        "For JavaScript, the tool reads captured console output shortly after the synchronous function returns. Output from timers or promises that settle later may be missing. It does not wait for every asynchronous operation to finish.",
        "Python uses Pyodide's asynchronous execution method. Runtime downloads, package availability and browser restrictions can affect what a Python snippet can do. A server or desktop Python environment may behave differently.",
      ],
    },
    {
      heading: "When to move to a project environment",
      body: [
        "Use your own editor and runtime for package-based projects, Node APIs, TypeScript builds, debugging across files or code you intend to keep. This page does not manage npm dependencies or reproduce a production environment.",
        "Treat the displayed duration as feedback about this run, not a benchmark. Browser scheduling, runtime initialization and other tabs affect the result.",
      ],
    },
  ],
  example: {
    title: "A JavaScript numeric sort",
    input: "const values = [1, 10, 2, 20, 3];\nconsole.log(values.sort((a, b) => a - b));",
    output: "[\n  1,\n  2,\n  3,\n  10,\n  20\n]",
    note: "The numeric comparator sorts by the difference between values. Without it, JavaScript's default array sort compares string representations. The console formats this array as indented JSON.",
    copyInput: true,
    copyOutput: true,
  },
  limitations: [
    "TypeScript type syntax is not transpiled. The TypeScript mode currently has the same evaluator as JavaScript.",
    "Code runs in workers, separate from the page DOM. Workers can still make network requests and use some origin storage APIs. Run only trusted code.",
    "Python needs the Pyodide download on first use. A cold cache or failed download prevents execution until the runtime loads.",
    "Execution is limited to five seconds after runtime initialization. Python loading is limited to 30 seconds; these limits do not cap memory use.",
    "Late asynchronous JavaScript console output may not be displayed.",
    "Code is not saved by this tool. Keep a separate copy before refreshing, switching modes or closing the tab.",
  ],
};

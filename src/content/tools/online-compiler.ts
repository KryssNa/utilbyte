import type { ToolArticleContent } from "@/components/shared/ToolArticle";

export const onlineCompilerArticle: ToolArticleContent = {
  intro: [
    "Sometimes you want to run a few lines and see what they do. Check how a sort comparator behaves, confirm what a date method returns, try an algorithm before committing it to a file.",
    "This executes JavaScript in your browser and shows the console output. Your code does not go to a server, which is unusual for an online runner and worth understanding - along with what it means for what this can and cannot do.",
  ],
  sections: [
    {
      heading: "Your code runs here, in this tab",
      body: [
        "Most online code runners send your code to a server, execute it in a sandboxed container, and send the output back. That is how they support many languages, and it means your code sits on someone else's machine.",
        "This one evaluates JavaScript directly in the page. The advantage is immediate: no round trip, no queue, and nothing to leak. Pasting a snippet containing an API key or a fragment of proprietary logic into a server-side runner puts it in that service's logs; here it goes nowhere.",
        "The cost is scope. It can only run JavaScript, because JavaScript is what a browser executes. It has no filesystem, no network beyond what the page can reach, no npm packages, and no process to exit.",
        "That trade is right for the small-snippet case and wrong for anything else. If you need Python, or packages, or to read a file, you need a server-side runner or your own machine.",
      ],
    },
    {
      heading: "What the environment actually is",
      body: [
        "Your code runs with the privileges of an ordinary script in a page. That is not a sandbox in the security sense - it is the same context the page itself runs in.",
        "For code you wrote, that is fine, because you are the only person affected by what it does. It does mean you should not paste code you do not understand from an untrusted source and run it, any more than you would paste it into your browser's console. The advice not to run unknown code in the console applies here for the same reason.",
        "Practically: infinite loops will freeze the tab, because JavaScript is single-threaded and a busy loop never yields. Allocating a very large array will exhaust memory. Neither is dangerous, both require closing the tab.",
        "Asynchronous code runs, but output arriving after your code returns may appear later than you expect. If a promise resolves and nothing seems to happen, that is usually the ordering rather than a failure.",
      ],
      bullets: [
        "JavaScript only. No Python, no compiled languages.",
        "No npm packages, no imports, no filesystem.",
        "An infinite loop freezes the tab - close it and reopen.",
        "Async output can arrive after the synchronous run appears finished.",
      ],
    },
    {
      heading: "The gotchas worth trying here",
      body: [
        "A scratchpad earns its keep on the language's genuinely surprising corners, and JavaScript has a good supply.",
        "Sorting without a comparator converts elements to strings, so an array of numbers sorts as 1, 10, 2, 20, 3. Almost everyone hits this once.",
        "Floating point arithmetic: adding 0.1 and 0.2 gives 0.30000000000000004, which is not a JavaScript bug but binary floating point behaving as specified everywhere.",
        "Type coercion in loose equality, where an empty array equals false and an empty string equals zero.",
        "And date handling, where months are zero-indexed while days are not - so the second argument of the Date constructor is one less than the month you mean.",
        "Two minutes here settles arguments that would otherwise be settled by deploying and finding out.",
      ],
    },
    {
      heading: "Where it stops being the right tool",
      body: [
        "Anything with dependencies. If the code imports a package, this cannot run it.",
        "Anything measuring performance. A browser tab with devtools open, other tabs competing for the CPU and a JIT warming up is not a measurement environment. Micro-benchmarks here are noise.",
        "Anything longer than a screen or two. Once you are writing something you want to keep, keep it - in a file, in an editor, with version control.",
        "The honest scope is: a snippet, a question, an answer in ten seconds. That is a genuinely useful thing to have and it is not a development environment.",
      ],
    },
  ],
  example: {
    title: "The sort that everyone hits once",
    input: "const nums = [1, 10, 2, 20, 3];\nconsole.log(nums.sort());\nconsole.log([...nums].sort((a, b) => a - b));\nconsole.log(0.1 + 0.2);",
    output: "[ 1, 10, 2, 20, 3 ]\n[ 1, 2, 3, 10, 20 ]\n0.30000000000000004",
    note: "The default sort converts every element to a string and compares lexicographically, so \"10\" sorts before \"2\" for the same reason \"ab\" sorts before \"b\". It is documented, it is specified, and it still catches people because it silently produces a plausible-looking wrong order rather than an error. The third line is binary floating point, which behaves identically in Python, Java and C - it is not a JavaScript quirk, though it is usually where people meet it.",
  },
  limitations: [
    "JavaScript only. No other languages, and nothing is compiled - despite the name, this is an interpreter in your browser.",
    "No package imports, no filesystem access, no Node APIs. Anything requiring a module will not run.",
    "Code runs with the page's own privileges rather than in an isolated sandbox. Do not run code you do not understand.",
    "An infinite loop or a very large allocation will freeze the tab, since JavaScript is single-threaded.",
    "Unsuitable for benchmarking. A browser tab is far too noisy an environment for meaningful timings.",
    "Nothing is saved. Close the tab and the code is gone.",
  ],
};

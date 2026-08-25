import type { ToolArticleContent } from "@/components/shared/ToolArticle";

export const regexTesterArticle: ToolArticleContent = {
  intro: [
    "Regular expressions are written by trial and error whatever anyone claims, and the loop is much faster when you can see the matches highlighted as you type instead of running the code again.",
    "This tests a pattern against sample text, shows what matched and what each capture group caught, and previews a replacement. It uses the browser's own regex engine, so the behaviour is exactly JavaScript's.",
  ],
  sections: [
    {
      heading: "The flags, and which ones actually change behaviour",
      body: [
        "The global flag makes the engine find every match rather than stopping at the first. It also introduces the one piece of genuinely surprising behaviour in JavaScript regex: a global regex object keeps a lastIndex between calls, so calling test twice on the same string can alternate between true and false. Every developer meets this bug once.",
        "Case insensitive is self-explanatory and the most used.",
        "Multiline changes what the anchors mean: with it, the start and end anchors match at every line break rather than only at the ends of the string. This is the flag people forget when a pattern works on one line of test data and fails on a file.",
        "Dot-all makes the dot match newlines, which it otherwise does not. If a pattern meant to span a multi-line block silently matches nothing, this is usually why.",
      ],
      bullets: [
        "g - all matches, and beware lastIndex on reused regex objects.",
        "i - case insensitive.",
        "m - anchors match at line breaks, not just string ends.",
        "s - dot matches newlines too.",
      ],
    },
    {
      heading: "Greedy and lazy, which is most bugs",
      body: [
        "Quantifiers are greedy by default: they take as much as they can and give back only when forced. Adding a question mark makes them lazy, taking as little as possible.",
        "The classic demonstration is matching an HTML tag. The pattern for an angle bracket, anything, angle bracket will match from the first opening bracket all the way to the last closing one on the line, swallowing everything between two tags. The lazy version stops at the first closing bracket, which is what was intended.",
        "The same shape appears with quoted strings, bracketed sections and anything delimited. If a pattern is matching far more than expected, greedy quantifiers are the first thing to check.",
      ],
    },
    {
      heading: "Capture groups and the replacement preview",
      body: [
        "Parentheses capture. Group 1 is the first pair, group 2 the second, and referring to them in a replacement is what makes regex a rewriting tool rather than just a search.",
        "Named groups are worth using once a pattern has more than two: referring to a group by name rather than by number survives someone inserting another pair of parentheses in the middle, which silently renumbers everything after it.",
        "Non-capturing groups exist for when you need grouping for precedence but do not want the result. They keep the numbering clean and are slightly cheaper.",
        "The replacement preview here is the fastest way to check that a rewrite does what you think before running it across a file.",
      ],
    },
    {
      heading: "Catastrophic backtracking, and why it matters in production",
      body: [
        "Some patterns take exponential time on input that nearly matches. Nested quantifiers are the usual cause - a repeated group that is itself repeated - because the engine has an enormous number of ways to divide the input between them, and it tries them all before concluding there is no match.",
        "The pattern looks harmless and works fine on short input. Given a 30-character string that almost matches, it can run for minutes.",
        "This is a real denial-of-service vector when a regex is applied to user input on a server, and it has taken down production systems. If a pattern will run on untrusted input, avoid nested quantifiers, and test it against a long string that nearly matches rather than only against strings that do.",
        "One more thing worth saying plainly: do not use regex to parse HTML, or JSON, or any nested structure. Regular expressions cannot express nesting. Use a parser.",
      ],
    },
  ],
  example: {
    title: "Greedy versus lazy on the same input",
    input: 'Text:    <b>bold</b> and <i>italic</i>\nPattern: <.+>     then     <.+?>',
    output: "<.+>   -> 1 match\n  <b>bold</b> and <i>italic</i>\n  (the entire line)\n\n<.+?>  -> 4 matches\n  <b>  </b>  <i>  </i>",
    note: "One character of difference and the result goes from useless to correct. The greedy version took everything from the first angle bracket to the last, because .+ grabs as much as it can and the final > still found a match at the end of the line. This is the single most common regex mistake, and seeing both highlighted at once is the quickest way to internalise it.",
  },
  limitations: [
    "This is JavaScript's regex engine. Python, PCRE, Go and Java differ in lookbehind support, named group syntax and Unicode handling - a pattern that works here may not port unchanged.",
    "Very large test inputs, or patterns with nested quantifiers, can hang the browser tab. That is the regex, not the tool.",
    "There is no step-by-step debugger or match explanation - it shows results, not why the engine reached them.",
    "Nothing is saved. Patterns and test text are gone when the tab closes.",
    "Regex cannot parse nested structures. For HTML, XML or JSON, use a parser rather than a clever pattern.",
  ],
};

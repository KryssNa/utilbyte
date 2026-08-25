import type { ToolArticleContent } from "@/components/shared/ToolArticle";

export const wordCounterArticle: ToolArticleContent = {
  intro: [
    "Somebody has given you a limit. Fifteen hundred words for the essay, a hundred and fifty for the abstract, sixty characters for the page title. You need to know where you are against it.",
    "This counts words, characters with and without spaces, sentences, paragraphs, lines, and gives a reading time estimate. Paste and it updates as you type. Nothing is uploaded, which matters more than it sounds for unpublished work.",
    "The interesting part is that there is no single correct word count, and the differences between tools are large enough to fail an assignment.",
  ],
  sections: [
    {
      heading: "Why two tools disagree about the same text",
      body: [
        "A word count depends on where you decide words begin and end, and reasonable implementations differ.",
        "This one splits on whitespace: a run of non-space characters is a word. That is the most common convention and it matches what Word and Google Docs do for ordinary prose.",
        "The edges are where tools diverge. Is a hyphenated compound like well-established one word or two? Splitting on whitespace says one; a tool that splits on punctuation says two. Does an em dash between words with no spaces join them? What about a URL, a chemical formula, a number with a thousands separator?",
        "For a fifteen hundred word essay the differences run to a handful of words and nobody cares. For a hundred and fifty word abstract with a strict cap, or a grant application form that rejects at 251 words, it can matter. If a specific counter is going to be used to judge your work, check against that counter, not this one.",
      ],
      bullets: [
        "Whitespace splitting is the common convention and what this tool uses.",
        "Hyphenated compounds, URLs and numbers are where implementations diverge.",
        "For a hard cap that will be machine-checked, verify in the system doing the checking.",
        "Leave yourself a margin. Being three words under is free; being one over may not be.",
      ],
    },
    {
      heading: "Characters, and the ones that are not one character",
      body: [
        "Character limits usually come from software rather than style, and they are stricter than word limits because something will truncate you.",
        "The count here includes spaces, and separately excludes them, because different systems mean different things. A meta description limit counts spaces. Some form fields do not.",
        "The thing that catches people out is that a character is not always one unit. Accented letters, emoji, and characters outside the Latin alphabet can occupy more than one code unit internally, so a field that limits to 280 units may accept fewer than 280 visible characters if you are writing in Devanagari, or if you use an emoji made of several joined code points. If you are close to a limit and the text is not plain ASCII, test in the actual field.",
        "The other common trap: a paste that brings invisible characters with it. Non-breaking spaces, zero-width joiners and stray formatting marks all count as characters and none of them are visible. If a count seems higher than it should be, that is usually why.",
      ],
    },
    {
      heading: "Sentences, paragraphs and reading time",
      body: [
        "Sentences are counted by terminal punctuation - full stops, question marks, exclamation marks. That is a good approximation and it is defeated by abbreviations. Dr. Smith arrived at 3 p.m. counts as three sentences, not one. Treat the number as indicative.",
        "Paragraphs are separated by blank lines, which is what you get from most editors. A document using single line breaks between paragraphs will count as one paragraph.",
        "Reading time assumes two hundred words per minute, which is a reasonable average for adults reading ordinary prose for comprehension. It is only an average. Dense technical writing goes considerably slower; light narrative goes faster. Read-aloud speed is slower still, closer to a hundred and thirty words per minute - worth knowing if you are timing a talk, where the usual rule of thumb is that a five minute slot is about six hundred and fifty words.",
      ],
    },
    {
      heading: "Useful limits to have in mind",
      body: [
        "Some numbers come up often enough to be worth remembering.",
        "Page titles are effectively limited by pixel width rather than characters, but around 55 to 60 characters is the usual working guidance before search results truncate. Meta descriptions run to roughly 155 to 160.",
        "Academic abstracts are commonly capped at 150, 250 or 300 words depending on the field and the journal, and those caps are typically enforced by the submission system rather than by a human.",
        "Most university essays state a tolerance, often ten percent either way, and the count usually excludes the reference list and sometimes footnotes. Whether it excludes quotations varies, and it is worth checking rather than assuming - it can be several hundred words.",
      ],
    },
  ],
  example: {
    title: "Where the disagreements come from",
    input: "Text:\n  The well-established, state-of-the-art system\n  costs $1,250.50 - see https://example.com/docs\n  for details.",
    output: "Whitespace splitting (this tool):  12 words\nSplitting on punctuation too:      19 words\n\nCharacters with spaces:     108\nCharacters without spaces:   93\nSentences:                    2  (the URL's full stops)\nReading time:            1 min",
    note: "Two defensible methods, seven words apart on one short passage - and the sentence count is wrong because the full stops in the domain name look like sentence endings. Neither is a bug exactly; both are the limits of counting text without understanding it. On a short abstract against a hard cap, that seven word gap is the difference between accepted and rejected.",
  },
  limitations: [
    "Word counting splits on whitespace. Hyphenated compounds count as one word, which some systems disagree with.",
    "Sentence counting is defeated by abbreviations, decimals and URLs, all of which contain full stops. Treat it as approximate.",
    "Paragraph counting needs blank lines between paragraphs. Single line breaks read as one paragraph.",
    "Reading time is a 200 words-per-minute average and takes no account of difficulty. For read-aloud timing, expect closer to 130.",
    "Characters are counted as the browser counts them, which may not match a field that limits by bytes or by code units, particularly for non-Latin scripts and emoji.",
    "Nothing is saved. Close the tab and the text is gone.",
  ],
};

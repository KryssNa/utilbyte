import type { ToolArticleContent } from "@/components/shared/ToolArticle";

export const removeDuplicatesArticle: ToolArticleContent = {
  intro: [
    "A list has repeats in it. An export from two systems that overlap, a column of email addresses collected from three sign-up forms, a set of keywords assembled from several sessions, a log file where the same entry appears forty times.",
    "This removes duplicate lines or duplicate words, with a case sensitivity switch and a highlight mode that shows you what was removed rather than silently shrinking your list.",
    "The switch is the part worth thinking about. Whether two entries count as the same is a judgement, and the tool applies whichever rule you choose - it cannot make that judgement for you.",
  ],
  sections: [
    {
      heading: "Case sensitivity is a decision about your data",
      body: [
        "With case sensitivity on, Apple and apple are two different entries. With it off, the first one wins and the second is dropped. Neither is right in general; it depends entirely on what the list contains.",
        "For email addresses, case-insensitive is almost always what you want. The domain part is case-insensitive by specification, and while the local part technically is not, essentially every mail provider treats it as such. Kryss@Example.com and kryss@example.com are one person, and keeping both means mailing them twice.",
        "For URLs it is mixed. The scheme and host are case-insensitive; the path frequently is not. Two URLs differing only in path capitalisation may well be two different pages.",
        "For product codes, identifiers and anything that will be matched by a machine, keep case sensitivity on unless you know the system treats them as equivalent. Merging two distinct SKUs because they differ only in case is a quiet, expensive error.",
        "For ordinary prose and keyword lists, off is usually right, because the capitalisation is incidental.",
      ],
      bullets: [
        "Email addresses: case-insensitive.",
        "Product codes, IDs, hashes, tokens: case-sensitive.",
        "URLs: depends - host is insensitive, path often is not.",
        "Keywords and prose: usually case-insensitive.",
      ],
    },
    {
      heading: "The duplicates the tool cannot see",
      body: [
        "Exact matching catches exact repeats. Real-world lists are full of near-duplicates that are the same thing to a human and different strings to a computer, and this is where deduplication quietly under-delivers.",
        "Trailing whitespace is the biggest one. An entry with a space at the end is not equal to the same entry without, and you cannot see the difference. Exports from spreadsheets are riddled with them.",
        "Then there is punctuation and spacing: John Smith versus John  Smith with two spaces, or Smith, John versus John Smith. Accented characters that were typed one way in one system and another way in another - there are two different Unicode representations of an accented e, and they look identical. Smart quotes versus straight quotes, from text that has been through a word processor.",
        "For addresses and names, near-duplicate detection needs fuzzy matching, which is a different and much harder problem. If your list matters, deduplicate exactly first, then scan the result by eye or with a proper matching tool.",
      ],
    },
    {
      heading: "Order, and what gets kept",
      body: [
        "The first occurrence of each entry is kept and later ones are removed, which preserves the original order of the list. That is usually what you want, and it matters more than it sounds.",
        "If your list is in a meaningful order - priority, chronology, the sequence something happened in - keeping the first occurrence keeps that order intact. A tool that sorts as a side effect of deduplicating destroys it, and the loss is not always obvious until later.",
        "The consequence to be aware of: when two entries differ in some way you are not matching on, you get the first one. If a list has the same email address twice with different names attached, and you deduplicate on the whole line, both survive because the lines differ. If you deduplicate a column of just the addresses, you keep whichever came first and lose the association with the second name entirely.",
        "That is a general rule worth carrying: deduplicate the field you want unique, but be sure you are not discarding data attached to the copies.",
      ],
    },
    {
      heading: "Lines or words",
      body: [
        "Line mode is the one you want almost every time. One entry per line is how lists come out of spreadsheets, databases and text editors, and it is what the mode is built for.",
        "Word mode splits on whitespace and dedupes the individual words, which is a different job with narrower uses: extracting the unique vocabulary from a passage, cleaning a tag or keyword blob, checking which terms actually appear in a piece of writing.",
        "It is not a way to clean prose. Running a paragraph through word mode produces a bag of unique words in first-appearance order, which is not readable text - every repeated the and and is gone. That is occasionally what someone wants and almost never what they expected.",
      ],
    },
  ],
  example: {
    title: "The same list, two settings",
    input: "kryss@example.com\nKryss@Example.com\nadmin@example.com\nkryss@example.com \nADMIN@example.com",
    output: "Case-sensitive:   4 remain\n  kryss@example.com\n  Kryss@Example.com\n  admin@example.com\n  kryss@example.com    <- trailing space\n  (only the exact repeat of line 1 was removed)\n\nCase-insensitive: 3 remain\n  kryss@example.com\n  admin@example.com\n  kryss@example.com    <- trailing space, still survives",
    note: "Five lines, two real people. Case-insensitive gets you closer but still leaves three, because line four has a trailing space and is therefore a different string. That invisible character is the single most common reason deduplication appears not to work. Trim your list before you dedupe it, and if the count looks wrong afterwards, whitespace is the first thing to check.",
  },
  limitations: [
    "Matching is exact. Entries differing by whitespace, punctuation, accents or quote style are treated as distinct, even when they are obviously the same thing to a person.",
    "Leading and trailing whitespace is not stripped before comparison. Trim your list first if it came from a spreadsheet export.",
    "There is no fuzzy or near-duplicate matching, which is what name and address lists usually need.",
    "The first occurrence is kept. If duplicate keys carry different associated data, that data is lost with the discarded copies.",
    "Word mode produces a set of unique words, not readable text. It is for vocabulary and tag lists, not for cleaning prose.",
    "One block of text at a time, held in memory - very large lists are limited by the browser rather than by the tool.",
  ],
};

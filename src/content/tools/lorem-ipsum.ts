import type { ToolArticleContent } from "@/components/shared/ToolArticle";

export const loremIpsumArticle: ToolArticleContent = {
  intro: [
    "You are building a layout and you need text in it. Not real text, because the real text does not exist yet and waiting for it means not building the layout.",
    "This generates lorem ipsum by paragraphs, sentences or words, optionally wrapped in HTML tags so you can paste it straight into markup.",
    "It is a genuinely useful tool with one significant caveat, which is that placeholder text is a bad way to make some design decisions and people reach for it anyway. Worth knowing which is which.",
  ],
  sections: [
    {
      heading: "Why nonsense Latin rather than real words",
      body: [
        "The point is that you cannot read it. When you put real English into a mockup, you start reading it, and then you are evaluating the copy instead of the layout. Worse, so is everyone you show it to - present a design with real headlines and the feedback comes back about the headlines.",
        "Lorem ipsum defeats that. It has roughly the texture of Latin-alphabet prose - similar word lengths, similar distribution of ascenders and descenders, similar rhythm - so a paragraph of it occupies the page much as English would, without anybody reading it.",
        "The text itself is a corrupted passage from Cicero's De Finibus Bonorum et Malorum, scrambled by a printer some centuries ago into something that looks like Latin and is not. Nobody knows exactly when, and it does not matter. Its virtue is precisely that it means nothing.",
        "The starting words lorem ipsum dolor sit amet are conventional enough that people recognise the text on sight and know it is placeholder. That is worth keeping when the mockup will be seen by others, and worth turning off when you want the paragraph to look like a real one.",
      ],
    },
    {
      heading: "When lorem ipsum will mislead you",
      body: [
        "Placeholder text hides the problems that come from real content, and design that looks fine full of lorem ipsum can fall apart the day the copy arrives.",
        "Length is the obvious one. Lorem ipsum flows in even, well-behaved paragraphs. Real product descriptions are three words long or eleven lines long, and a card grid that looks immaculate with uniform text breaks when one item has a forty-character title and its neighbour has four.",
        "Real text also has structure lorem ipsum does not: proper nouns, numbers, prices, dates, links, bold runs, the occasional very long unbroken word like an email address or a German compound that will not wrap.",
        "And it is all Latin script. A layout built on lorem ipsum tells you nothing about how it holds up in Devanagari, which sits taller on the line, or Arabic, which runs right to left, or German, whose words are simply longer. If the product will be translated, test with translated text early rather than discovering the button labels overflow after launch.",
        "The practical rule: use lorem ipsum for early structure and spacing, and switch to realistic content - including the awkward extremes - before you commit to anything.",
      ],
      bullets: [
        "Good for: block rhythm, spacing, line length, type scale, early wireframes.",
        "Bad for: anything where real length varies, truncation, wrapping, internationalisation.",
        "Always test the shortest and longest plausible real content before signing off.",
      ],
    },
    {
      heading: "The HTML wrapper options",
      body: [
        "Plain text is right when the destination is a design tool, a document, or a field that will handle its own markup.",
        "Wrapping in paragraph tags is the common case for web work, because it gives you semantically correct markup you can paste into a template and immediately see real paragraph spacing rather than one undifferentiated block.",
        "Div and span wrappers exist for cases where the surrounding structure expects them, though as a rule paragraphs of text should be in paragraph tags. A span is inline and a div carries no meaning, so using either for prose loses semantics that screen readers and default stylesheets rely on.",
      ],
    },
    {
      heading: "The one thing that genuinely goes wrong",
      body: [
        "Placeholder text ships. It happens constantly, it is embarrassing, and it is occasionally worse than embarrassing.",
        "It reaches production in the corners nobody proofreads: an empty-state message, an error page, a transactional email template, the meta description of a page that was launched in a hurry. It has appeared in printed newspapers, on public sector websites and in listed companies' annual reports.",
        "Two habits prevent almost all of it. Search the codebase for lorem before any release - it takes seconds and it catches nearly everything. And keep the recognisable opening words on, because lorem ipsum dolor sit amet gets spotted by anyone glancing at a page in a way that a scrambled paragraph starting with some other Latin word does not.",
      ],
    },
  ],
  example: {
    title: "Three paragraphs, wrapped for a template",
    input: "Format: paragraphs\nCount: 3\nStart with lorem: on\nHTML: <p> tags",
    output: "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit,\nsed do eiusmod tempor incididunt ut labore et dolore magna\naliqua. Ut enim ad minim veniam, quis nostrud exercitation.</p>\n<p>Duis aute irure dolor in reprehenderit in voluptate velit\nesse cillum dolore eu fugiat nulla pariatur excepteur sint.</p>\n<p>Occaecat cupidatat non proident, sunt in culpa qui officia\ndeserunt mollit anim id est laborum sed ut perspiciatis.</p>\n\n~58 words, ~390 characters",
    note: "Notice how even those three paragraphs are - roughly twenty words each, no short one, no long one. That regularity is exactly what makes lorem ipsum good for judging spacing and exactly what makes it dangerous for judging a card grid. Before you sign the design off, replace one of these with four words and another with twelve lines, and see whether it still holds.",
  },
  limitations: [
    "The text is Latin script only. It tells you nothing about how a layout behaves in Devanagari, Arabic, Chinese or any other writing system.",
    "Paragraph and sentence lengths are far more uniform than real content. Layouts that depend on that uniformity will break when real copy arrives.",
    "It contains no numbers, prices, proper nouns, links or unusually long unbroken strings - all of which are where real layouts fail.",
    "The word pool is finite, so long outputs repeat noticeably.",
    "Placeholder text has a habit of shipping. Search your codebase for lorem before every release.",
  ],
};

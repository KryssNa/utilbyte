import type { ToolArticleContent } from "@/components/shared/ToolArticle";

export const caseConverterArticle: ToolArticleContent = {
  intro: [
    "Two quite different audiences end up on a page like this. One has a heading in shouty capitals that needs to become a normal sentence. The other has a variable name in the wrong convention because they are moving data between a database and an API that disagree about how identifiers should look.",
    "The tool covers both: upper, lower, title and sentence case for prose, and camel, Pascal, snake and kebab case for code. All of it happens as you type, in the page.",
  ],
  sections: [
    {
      heading: "Title case is not a single rule",
      body: [
        "This is the one that causes arguments. Title case means capitalising the important words in a heading, and the style guides disagree about which words are important.",
        "The convention this tool applies is the simple one: capitalise the first letter of every word. It is predictable and it is what most software does.",
        "Editorial title case is different. Chicago, AP and the rest keep articles, short prepositions and coordinating conjunctions lower case unless they start or end the title - so The Rise of the Machines rather than The Rise Of The Machines. The lists of which words stay lower case differ between guides, and the threshold for prepositions varies from three letters to five.",
        "If you are publishing under a style guide, treat the output as a first pass and fix the small words by hand. If you just need consistent headings on your own site, capitalising everything is fine and nobody will mind.",
        "Sentence case - capitalise the first letter, leave the rest - is the other common choice, and it has quietly won in software interfaces because it is unambiguous and reads faster.",
      ],
    },
    {
      heading: "The programming conventions, and why they exist",
      body: [
        "camelCase, PascalCase, snake_case and kebab-case all solve the same problem: word boundaries in an identifier where spaces are not allowed.",
        "Which one you use is almost never a matter of taste. It is set by the language or the ecosystem, and going against it makes code look wrong to everyone who reads it.",
        "JavaScript and Java use camelCase for variables and functions, PascalCase for classes and, in React, for components. Python and Ruby use snake_case for variables and functions, PascalCase for classes. SQL conventionally uses snake_case for tables and columns. CSS uses kebab-case, as do URL slugs and HTML attributes, because those contexts are case-insensitive and a hyphen is the only reliable separator.",
        "The place this tool earns its keep is at the boundaries. A JSON API returning snake_case keys into a JavaScript codebase that expects camelCase is one of the most common integration frictions there is, and converting a list of field names by hand is exactly the tedium worth automating.",
      ],
      bullets: [
        "camelCase - JavaScript and Java variables, JSON keys in JS-centric APIs.",
        "PascalCase - classes in most languages, React components, TypeScript types.",
        "snake_case - Python, Ruby, SQL columns, and many REST APIs.",
        "kebab-case - CSS properties, URL slugs, HTML attributes, CLI flags.",
      ],
    },
    {
      heading: "Where automatic conversion gets it wrong",
      body: [
        "Converting between conventions means detecting word boundaries, and that is guesswork on some inputs.",
        "Acronyms are the classic failure. HTTPRequest converted to snake_case can plausibly become http_request or h_t_t_p_request depending on how the splitter handles consecutive capitals. Going the other way, http_request to Pascal case gives HttpRequest, not HTTPRequest, and both spellings exist in real codebases.",
        "Numbers are similarly ambiguous. Is address2 one word or two? Should base64 become base_64?",
        "And upper case is destructive in a way the others are not. Converting to upper case throws away the information about which letters were capitalised, so you cannot get back. iPhone becomes IPHONE, and lowering it gives iphone - the original is unrecoverable. Keep the source if you might need it.",
        "For prose there is a subtler version: converting a paragraph to title case capitalises proper nouns you wanted capitalised and also capitalises everything else, and sentence case will lower-case names that should have stayed capitalised. Neither tool knows what a name is.",
      ],
    },
    {
      heading: "Non-English text",
      body: [
        "Case conversion assumes an alphabet that has cases, and plenty do not. Devanagari, Arabic, Chinese, Japanese and Korean have no upper and lower forms, so these operations pass the text through unchanged. That is correct behaviour, not a failure.",
        "For alphabets that do have case, a few have rules that trip naive conversion. German eszett has historically upper-cased to SS, changing the character count. Turkish has a dotted and a dotless i that map to different upper case letters than English does, which is a genuine and well-documented source of bugs in software that lower-cases identifiers using the user's locale.",
        "For English and most European text you will not notice any of this. If you are converting identifiers in a system that might run under a Turkish locale, it is worth knowing that lower-casing is not locale-independent.",
      ],
    },
  ],
  example: {
    title: "One field name through every convention",
    input: "Source: user profile image URL",
    output: 'UPPERCASE      USER PROFILE IMAGE URL\nlowercase      user profile image url\nTitle Case     User Profile Image URL\nSentence case  User profile image url\n\ncamelCase      userProfileImageUrl\nPascalCase     UserProfileImageUrl\nsnake_case     user_profile_image_url\nkebab-case     user-profile-image-url',
    note: 'Note what happened to URL. In every programming convention it came out as Url or url rather than URL - the acronym was lost, because the converter cannot tell an acronym from an ordinary word. That is the right default for round-tripping, since userProfileImageURL and userProfileImageUrl would otherwise convert to different snake_case forms, but if your codebase spells acronyms in full capitals you will need to fix those by hand.',
  },
  limitations: [
    "Title case capitalises every word. Editorial style guides keep articles and short prepositions lower case, and their rules differ from each other - the output is a starting point, not a finished headline.",
    "Acronyms do not survive conversion to programming conventions. URL becomes Url, and there is no reliable way to detect the difference automatically.",
    "Upper case is lossy. The original capitalisation cannot be recovered from it, so keep your source text.",
    "Sentence detection for sentence case uses terminal punctuation, so abbreviations and decimals can produce unexpected capitals.",
    "Scripts without letter case pass through unchanged. Turkish dotted and dotless i, and German eszett, have locale-specific rules that generic conversion does not apply.",
    "One block of text at a time. No file input and no batch processing.",
  ],
};

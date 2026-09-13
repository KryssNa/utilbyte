import type { ToolArticleContent } from "@/components/shared/ToolArticle";

export const uuidGeneratorArticle: ToolArticleContent = {
  intro: [
    "A UUID is a 128-bit identifier written as 36 characters, designed so that anyone can generate one without coordinating with anyone else and still be confident it is unique.",
    "This generates version 4 UUIDs - the random kind - singly or in bulk.",
  ],
  sections: [
    {
      heading: "Why collisions are not a practical concern",
      body: [
        "A v4 UUID has 122 random bits; six are fixed to mark the version and variant. That is about 5.3 undecillion possible values.",
        "The number that actually matters is the birthday bound, not the total space. You would need to generate around a billion UUIDs per second for roughly 85 years before the chance of a single collision reached about 50 percent. For any application you are likely to build, the probability is not small - it is negligible in a way that other parts of your system are not.",
        "That holds on one condition: the randomness has to be good. A generator using a weak or badly seeded random source can produce collisions far sooner than the maths suggests, and that has happened in real systems. This one uses the browser's cryptographic random source, which is the right one.",
      ],
    },
    {
      heading: "The versions, and why v7 is worth knowing about",
      body: [
        "v4 is random and the default choice for most purposes.",
        "v1 encodes a timestamp and the machine's MAC address. It sorts by creation time, which is useful, and it leaks which machine created it and when, which historically has been an information disclosure problem.",
        "v5 is deterministic: hash a namespace and a name and you get the same UUID every time. Useful when you want a stable identifier derived from something you already have.",
        "v7, standardised in 2024, is the interesting one. It puts a millisecond timestamp in the high bits and random data in the rest, so it is both unpredictable and sortable by creation time. That combination fixes the main practical complaint about v4, which is described below.",
        "This tool generates v4 only. If you are choosing identifiers for a new database table, v7 is worth looking at.",
      ],
      bullets: [
        "v4 - random. The general default.",
        "v1 - time and MAC based. Sortable, but leaks host and time.",
        "v5 - deterministic from a namespace and name.",
        "v7 - time-ordered and random. The current best choice for database keys.",
      ],
    },
    {
      heading: "The database cost nobody mentions",
      body: [
        "v4 UUIDs make poor primary keys in a table with a clustered index, and the reason is worth understanding before you commit a schema.",
        "Sequential integers append at the end of the index. Every insert lands in the same page, which stays in memory, and the index grows tidily.",
        "Random UUIDs land anywhere. Every insert touches a different part of the index, which means more pages read from disk, more page splits, and an index that fragments as it grows. On a large, write-heavy table the difference is measurable.",
        "The usual answers are to use a time-ordered variant like v7, or to keep an internal sequential key and expose a UUID separately. Which is often what you wanted anyway - the reason to expose UUIDs publicly is that sequential ids tell the world how many records you have and let anyone walk them.",
      ],
    },
    {
      heading: "Format details that cause bugs",
      body: [
        "The canonical form is 8-4-4-12 hex digits with hyphens, lower case. The specification says generators should emit lower case and parsers should accept either, which is exactly the kind of asymmetry that produces bugs when one system compares strings and another does not normalise first.",
        "Stored as text a UUID is 36 characters. Stored as binary it is 16 bytes. Databases with a native UUID type use the compact form, and using a character column instead costs more than double the space plus slower comparisons - a common and avoidable mistake.",
        "The all-zero UUID is the nil UUID and is a valid, reserved value. It usually means uninitialised, and treating it as a real identifier is another quiet source of bugs.",
      ],
    },
  ],
  example: {
    title: "Reading a v4 UUID",
    input: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    output: "f47ac10b - 58cc - 4372 - a567 - 0e02b2c3d479\n                     ^      ^\n                     |      variant bits (a, 8, 9 or b)\n                     version (4 = random)\n\n122 random bits, 6 fixed\n36 characters as text, 16 bytes as binary",
    note: "Two of the 36 characters are not random. The first digit of the third group is always 4 for a v4 UUID, and the first digit of the fourth group is always 8, 9, a or b. If you are looking at an identifier that claims to be a v4 UUID and those positions say otherwise, it was produced by something that is not following the specification - which is worth knowing before you rely on its uniqueness.",
  },
  limitations: [
    "Only version 4 is generated. For time-ordered identifiers you want v7, and for deterministic ones v5 - neither is offered here.",
    "v4 UUIDs are poor clustered primary keys on large write-heavy tables because of index fragmentation.",
    "Output is the canonical hyphenated lower-case form. Systems expecting braces, upper case or the bare 32-character form need conversion.",
    "Uniqueness depends on the browser's random source. It is the right source, but no generator can do better than the entropy available to it.",
    "Bulk generation is bounded by what the page can comfortably render - this is not a tool for producing millions.",
  ],
};

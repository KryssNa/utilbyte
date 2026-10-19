import type { ToolArticleContent } from "@/components/shared/ToolArticle";

export const jsonCsvArticle: ToolArticleContent = {
  intro: [
    "An API response describes values and their types; a spreadsheet describes a table of cells. Converting between them requires choosing what to preserve. This tool converts an array of JSON records to CSV, or reads CSV rows back into records, entirely in your browser.",
    "Use Text mode when the destination is a spreadsheet or a system expecting ordinary CSV. Use JSON-cell mode when a later import must distinguish strings, numbers, booleans, null, nested values and missing properties. The two modes produce different files and must be paired with the matching import mode.",
  ],
  sections: [
    { heading: "Choose the representation before exporting", body: [
      "In Text mode, a number such as 42 and the string \"42\" become the same cell text. Missing properties and null values both become empty cells. The resulting table is convenient for people, but it is not a lossless backup of the original JSON. Nested objects and arrays require JSON-cell mode.",
      "JSON-cell mode serializes each header and value as JSON inside a CSV cell. A blank cell represents a missing property; the literal null represents a present property with a null value. CSV quoting then escapes quotes inside that JSON. The extra quoting is intentional, rather than a malformed export.",
    ] },
    { heading: "Work through a small round trip", body: [
      "Paste a small array of objects, select a comma, semicolon or tab separator, and convert. Download the result, switch to CSV to JSON, import the file and choose the same delimiter and cell mode. Compare the output with your original before exporting a larger dataset.",
      "Headers are assembled from the records. Rows can have different keys, but they must be records rather than a mixture of primitive JSON values. CSV parsing supports quoted delimiters, escaped quotes and multiline fields. A CSV field containing a comma needs quotes; splitting a line on commas is not an equivalent parser.",
    ] },
    { heading: "Protect spreadsheet users from formulas", body: [
      "Spreadsheet programs can interpret cells beginning with formula characters as executable formulas. Keep the spreadsheet-protection option on when exporting unfamiliar text for a spreadsheet. It prefixes risky text with an apostrophe. That changes the data, and importing the CSV does not remove the apostrophe.",
      "Protection is not a guarantee about every spreadsheet application or import setting. Check the downloaded file with the application that will use it. Identifiers with leading zeros and long numeric strings can also be reinterpreted by spreadsheet software; import those columns explicitly as text.",
    ] },
  ],
  example: { title: "A useful table with an intentional type loss", input: '[{"name":"Ada","score":12},{"name":"Grace","score":15}]', output: 'name,score\nAda,12\nGrace,15', note: "This is Text mode. Reading it back produces score values as strings. Choose JSON-cell mode for a typed round trip.", copyInput: true, copyOutput: true },
  limitations: [
    "Text mode converts cells to strings and cannot preserve the distinction between null and absent fields.",
    "JSON-cell CSV is a tool-specific representation. Use the matching mode on import; it is not ordinary spreadsheet CSV.",
    "Input is limited to 1,000,000 characters, 10,000 records and 200 columns. JSON input rejects duplicate keys, unsafe numbers and nesting beyond 64 levels.",
    "Processing runs in a worker with a five-second timeout. Review output before transferring it to another tool or application.",
  ],
};

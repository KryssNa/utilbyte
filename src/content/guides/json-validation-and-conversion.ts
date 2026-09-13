import type { Guide } from "./types";

const example = '[{"id":"001","name":"Ada","active":true,"note":null},{"id":"002","name":"Grace","active":false}]';
const schema = '{"$schema":"http://json-schema.org/draft-07/schema#","type":"array","items":{"type":"object","properties":{"id":{"type":"string"},"name":{"type":"string"},"active":{"type":"boolean"},"note":{"type":["string","null"]}},"required":["id","name","active"],"additionalProperties":false}}';

export const jsonValidationAndConversionGuide: Guide = {
  slug: "json-validation-and-conversion",
  title: "Inspect JSON, validate it, then convert it safely",
  metaTitle: "JSON to CSV or TypeScript: Validate Before Converting",
  metaDescription: "Work through a JSON example, validate its schema, and choose CSV text, JSON cells, or TypeScript output. See what happens to IDs, nulls, and missing fields.",
  keywords: ["JSON to CSV", "JSON Schema validation", "JSON to TypeScript", "preserve leading zeros CSV"],
  published: "2026-09-12",
  readingMinutes: 7,
  summary: "Readable JSON, valid JSON, and usable exported data are different things. Follow one small example from inspection through schema validation to a spreadsheet export or an inferred TypeScript type.",
  intro: [
    "An export can look correct while changing the meaning of your data. An identifier such as 001 is text; true is a boolean; a missing field is different from a field set to null. Decide which distinctions the receiving application needs before converting anything.",
    "This workflow uses UtilByte’s JSON Formatter, JSON Schema Validator, JSON ↔ CSV, and JSON to TypeScript tools. These tools process the input in your browser. Site analytics and advertising are separate; browser processing is not a claim that every request made by the website stays offline.",
  ],
  sections: [
    {
      heading: "1. Inspect a small, representative example",
      body: [
        "Start with synthetic data that has the same shape as your real input. Paste this example into JSON Formatter:",
        { code: example, label: "Example JSON" },
        "The first record has note set to null; the second has no note property. Both IDs are strings so their leading zeros are part of their value. Formatting makes these differences easier to see, but does not establish that required fields or business rules are satisfied.",
        "UtilByte rejects duplicate object keys, malformed strict JSON, and numeric values it cannot convert safely, including negative zero. Comments and trailing commas are not accepted. Keep exact identifiers and high-precision decimal values as quoted strings when that is the contract of your data source; do not simply quote every number to hide a validation failure.",
      ],
    },
    {
      heading: "2. Validate the shape you actually require",
      body: [
        "Open JSON Schema Validator with the example as the JSON input. Replace its sample schema with the following draft-07 schema, then choose Validate JSON:",
        { code: schema, label: "Validation schema" },
        "The example passes: id, name, and active are required; note may be a string or null and may be absent. A record with active set to the string \"true\" fails because the schema requires a boolean. A record with an unexpected property fails because additionalProperties is false.",
        "The validator does not insert defaults, turn strings into numbers, or remove extra fields. It returns the first validation error. Correct the source or revise the schema deliberately, then validate again; a pass only establishes agreement with the supplied schema.",
      ],
      callout: {
        tone: "info",
        text: "Only draft-07 and local # references are supported. Remote schemas are not downloaded. Format annotations such as email and date-time are not checked, so a format field alone is not an email or date validator.",
      },
    },
    {
      heading: "3. Choose the export for its destination",
      body: [
        "Copy the validated input into JSON ↔ CSV, choose JSON to CSV, and select Comma. The Cells setting determines whether the conversion is intended for readable spreadsheet text or for preserving JSON values with a matching importer.",
        "In Text (spreadsheet) mode, the example produces columns id, name, active, and note. Converting that CSV back to JSON in Text mode yields strings for every cell: the first active is \"true\", and both note values are empty strings. UtilByte does not guess that a numeric-looking string is a number.",
      ],
      table: {
        columns: ["Original value", "Text CSV imported as text", "JSON cells imported as JSON cells"],
        rows: [
          ['id: "001"', '"001" remains text in UtilByte', '"001" remains a string'],
          ["active: true", '"true" becomes a string', "true remains a boolean"],
          ["note: null", "Empty string", "null"],
          ["note property absent", "Empty string", "Property stays absent"],
          ['Nested object {"count":2}', "Rejected in Text mode", "Object is retained"],
        ],
        caption: "Results describe direct conversion with UtilByte. Spreadsheet applications can reinterpret imported CSV cells independently.",
      },
    },
    {
      heading: "4. Preserve types when you need a round trip",
      body: [
        "Select JSON cells (preserve types) when you need null, missing properties, booleans, arrays, and nested objects to remain distinct. This mode JSON-encodes both headers and values. An empty CSV field means a missing property; a JSON null value means null.",
        "Convert the original example, copy its output, switch to CSV to JSON, and keep the delimiter and JSON-cell mode unchanged. The two records recover their original supported JSON values, including the difference between null and absent note fields. Property order and whitespace are presentation details, not a byte-for-byte archive of the input.",
        "JSON-cell CSV is not ordinary spreadsheet CSV. Do not expect another application to understand this encoding automatically. If a receiving system accepts JSON, sending the original validated JSON can avoid this intermediate representation altogether.",
      ],
      callout: {
        tone: "warning",
        text: "Spreadsheet applications may infer numbers, dates, or formulas from CSV even if UtilByte kept a value as text. Use the application’s explicit text-column import settings for identifiers, then inspect the imported values. Opening and re-saving a CSV in a spreadsheet is not covered by a direct round-trip check.",
      },
    },
    {
      heading: "5. Keep formula protection deliberate",
      body: [
        "Text export enables Prefix formula-like cells for spreadsheets by default. For example, exporting a name value of =SUM(A1) adds an apostrophe, producing '=SUM(A1) as the cell text. This changes the value and the apostrophe remains when importing it back into UtilByte.",
        "Keep the protection enabled when exporting untrusted text for spreadsheet use. If your destination requires the original exact string, understand its formula handling before disabling the setting. JSON-cell mode has a different encoding and does not use this text-mode protection; it is not a substitute for a spreadsheet safety policy.",
      ],
    },
    {
      heading: "6. Generate TypeScript from the original JSON",
      body: [
        "For application code, paste the original JSON into JSON to TypeScript instead of inferring types from a Text-mode CSV round trip. Otherwise you would infer string for active after the conversion had already discarded its boolean type.",
        "The result is an exported Root type alias. In this example it contains an array union of two object shapes: one has note typed as null, and the other has no note property. It does not merge them into a single object with an optional note. Review that union against the real API contract before using it.",
        "Empty arrays become unknown[]. Mixed arrays produce unions, and a date-looking string remains a string. One sample cannot establish all possible values, optional fields, enums, or future response variants. Generated TypeScript is a compile-time aid; it performs no runtime validation of a network response. Keep schema checks at the boundary where untrusted data enters your application.",
      ],
    },
    {
      heading: "Practical limits and verification",
      body: [
        "These JSON workflows accept at most 1,000,000 input characters and 64 nesting levels. File import is limited to 1,000,000 bytes, which differs from the character limit for non-ASCII text. CSV supports comma, semicolon, and tab delimiters, up to 10,000 records and 200 columns. JSON-to-CSV input must be a nonempty array of objects.",
        "A schema is limited to 64,000 characters. Type inference has a stricter 32-level nesting limit and rejects arrays with more than 30 distinct inferred shapes. Conversion and schema validation run in a worker with a five-second timeout and a Cancel control, so smaller representative inputs are easier to diagnose.",
        "Before using an export, compare record counts, required keys, a leading-zero ID, a boolean, a null, and an absent field. If the destination is a spreadsheet, check those values after its import as well. Keep the source until the receiving system has accepted the result.",
        "The implementation is available in src/lib/json-safe.ts, src/lib/data-workflows.ts, and src/lib/schema-validation.ts in the open-source repository. Existing tests/data-reliability.test.ts covers duplicate-key and precision rejection, text and JSON-cell conversion, schema behavior, and type inference. These checks describe the implementation; they do not certify a separate application’s importer.",
      ],
    },
  ],
  relatedTools: [
    { label: "JSON Formatter", href: "/dev-tools/json-formatter", description: "Inspect the structure before selecting a conversion." },
    { label: "JSON Schema Validator", href: "/dev-tools/json-schema", description: "Check JSON against an explicit draft-07 contract." },
    { label: "JSON ↔ CSV", href: "/dev-tools/json-csv", description: "Choose text cells or JSON cells for the receiving system." },
    { label: "JSON to TypeScript", href: "/dev-tools/json-to-typescript", description: "Infer a type alias from a representative JSON sample." },
  ],
  relatedGuides: ["browser-vs-upload-privacy", "sql-formatting-regressions"],
  faqs: [
    { question: "Does formatting JSON validate its schema?", answer: "No. The formatter checks supported strict JSON syntax and makes the structure readable. A JSON Schema defines required fields, types, and other constraints; use the schema validator to check those rules." },
    { question: "Can I convert JSON to CSV without changing types?", answer: "Text CSV does not preserve JSON types. UtilByte’s JSON-cell mode can preserve supported types, nulls, and missing properties when imported with the same mode and delimiter. Other applications need to understand that encoding, and spreadsheet edits can change values." },
    { question: "Why did a leading-zero ID change in my spreadsheet?", answer: "UtilByte’s Text-mode CSV importer treats cells as strings, but a spreadsheet may infer a number when it reads the file. Import the identifier column explicitly as text in the receiving application and inspect the result." },
    { question: "Does the generated TypeScript type validate API responses?", answer: "No. It describes the sample at compile time and is not a runtime validator. Check responses against an appropriate runtime schema, and review inferred types against the full API contract." },
  ],
};

import type { ToolArticleContent } from "@/components/shared/ToolArticle";

export const jsonToTypescriptArticle: ToolArticleContent = {
  intro: [
    "A JSON example is a useful starting point for a TypeScript type, but it is not the full API contract. This tool inspects one JSON value and produces a type alias describing the values that are visible in that example. It runs locally in your browser.",
    "Use the result to start a model, document a fixture or inspect an unfamiliar response. Before using it in application code, compare it with the service documentation and examples of missing, null and unusual values.",
  ],
  sections: [
    { heading: "Understand what one sample can establish", body: [
      "A quoted value becomes string, a JSON number becomes number, and a boolean becomes boolean. Null remains null. Object properties are inferred from the keys that appear, with property names escaped as JSON strings so punctuation and spaces can be represented.",
      "The tool cannot determine which fields are optional from a single object. A field absent from the sample is unknown to it, and a field present once may still be omitted by the real API. Edit the result using the documented contract rather than assuming that the sample covers every response.",
    ] },
    { heading: "Inspect arrays and unions before accepting the output", body: [
      "An empty array does not reveal its element type, so the output uses unknown[]. A mixed array produces a union of the observed shapes. Objects with different keys can appear as separate shapes; this is not proof that the real service has a discriminated union.",
      "For an array containing both 12 and \"12\", the generated element type must allow a number or a string. Decide whether that reflects the actual API or a data-quality problem. A convenient inferred union can otherwise conceal an inconsistency that should be fixed upstream.",
    ] },
    { heading: "Types do not validate a response at runtime", body: [
      "TypeScript checks source code during development and erases types when it produces JavaScript. Assigning a generated type to a network response does not inspect the response. Use a runtime validator, such as a JSON Schema check in the system receiving the data, when the input cannot be trusted.",
      "Date-like strings remain strings. Repeated string values do not establish an enum. Numeric identifiers may need to be strings to preserve exact digits. This tool rejects unsafe JSON numbers instead of generating types from values that have already been rounded.",
    ] },
  ],
  example: { title: "Infer a starting shape", input: '{"name":"Ada","active":true,"scores":[12,15]}', output: '// Inferred from one sample; this is not runtime validation.\nexport type Root = {\n  "name": string;\n  "active": boolean;\n  "scores": Array<number>;\n};', note: "The exact layout and alias name are determined by the tool. This example illustrates the types; it does not establish optionality, score limits or valid names.", copyInput: true },
  limitations: [
    "Optional properties, enums and dates cannot be inferred reliably from one sample. Review and edit the generated alias.",
    "Empty arrays become unknown[]. Mixed arrays use unions of observed shapes, with at most 30 distinct inferred shapes.",
    "Inference is limited to 32 nesting levels. Input is limited to 1,000,000 characters; duplicate keys and unsafe numbers are rejected.",
    "The output is a TypeScript type, not a runtime validator. Processing runs in a worker with a five-second timeout.",
  ],
};

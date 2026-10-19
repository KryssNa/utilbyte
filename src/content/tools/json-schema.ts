import type { ToolArticleContent } from "@/components/shared/ToolArticle";

export const jsonSchemaArticle: ToolArticleContent = {
  intro: [
    "Valid JSON can still be the wrong data. A service might return an array where your program expects an object, or put a number inside quotes. JSON Schema describes the shape you expect so that these mistakes can be found before the data reaches the next step.",
    "This validator checks a JSON document against a local JSON Schema draft-07 schema using Ajv. Both inputs stay in your browser. It does not retrieve remote schemas, modify your document, apply defaults or coerce strings into numbers.",
  ],
  sections: [
    { heading: "Start with an explicit contract", body: [
      "Paste your document into JSON input and the schema into the schema field. Use type to describe the expected value, properties to describe object fields, and required to name fields that must be present. Describing a property does not make it required. If extra fields are unwanted, set additionalProperties to false.",
      "An array schema uses items to describe its entries. A type of integer excludes fractional numbers, while number accepts both. JSON null has its own type; it is not interchangeable with an absent property. Set the contract to match what your consuming program actually needs.",
    ] },
    { heading: "Read a failure as a location and a condition", body: [
      "Validation reports the first error, rather than every possible failure. Fix that condition and validate again. An error at an object can mean that a required field is missing, rather than that the entire object has the wrong type. Array indices in an error path identify a particular record.",
      "The schema is compiled in strict mode. Unknown keywords and unsupported schema constructs are rejected instead of silently ignored. Use the draft-07 dialect; a schema copied from a newer dialect may need changes before it is meaningful here.",
    ] },
    { heading: "Keep references local and review business rules separately", body: [
      "Use local references such as #/definitions/person to share a definition. References to another URL are not fetched. This keeps validation reproducible with the two documents you supplied and avoids turning schema validation into a network request.",
      "Format annotations such as email and date-time are not validated in this tool. A successful result therefore does not prove that an email address exists, that a date is plausible, or that a record meets your business rules. Write additional checks in the application that will consume the data.",
    ] },
  ],
  example: { title: "A required numeric score", input: 'Schema: {"type":"object","properties":{"score":{"type":"number"}},"required":["score"],"additionalProperties":false}\n\nDocument: {"score":"12"}', output: 'Validation fails: score is a string rather than a number.', note: 'Changing the document to {"score":12} satisfies this schema. The validator does not make that change for you.' },
  limitations: [
    "Only JSON Schema draft-07 and local # references are supported. Format annotations are not checked.",
    "The schema is limited to 64,000 characters. JSON input is limited to 1,000,000 characters and 64 nesting levels; duplicate keys and unsafe numbers are rejected.",
    "Defaults, coercion and automatic removal of additional properties are disabled. Only the first validation error is returned.",
    "A worker enforces a five-second timeout. A schema match is evidence about the declared structure, not a guarantee that the data is true or fit for every use.",
  ],
};

import Ajv from "ajv";
import { parseSafeJson } from "./json-safe";

export function validateJsonSchema(input: string, schemaText: string): string {
  if (schemaText.length > 64000) throw new Error("Schema is limited to 64,000 characters.");
  const schema = parseSafeJson(schemaText);
  const data = parseSafeJson(input);
  if (typeof schema !== "boolean" && (!schema || typeof schema !== "object" || Array.isArray(schema))) throw new Error("Schema must be a JSON object or boolean.");
  function inspect(value: unknown) {
    if (value === null || typeof value !== "object") return;
    for (const [key, item] of Object.entries(value)) {
      if (key === "$ref" && (typeof item !== "string" || !item.startsWith("#"))) throw new Error("Only local # references are supported. Remote schemas are never retrieved.");
      if (key === "$schema" && item !== "http://json-schema.org/draft-07/schema#" && item !== "http://json-schema.org/draft-07/schema") throw new Error("Only JSON Schema draft-07 is supported.");
      inspect(item);
    }
  }
  inspect(schema);
  const ajv = new Ajv({ strict: true, allErrors: false, validateFormats: false, useDefaults: false, coerceTypes: false, removeAdditional: false, logger: false });
  const validate = ajv.compile(schema);
  if (validate(data)) return "Valid against this draft-07 schema. Format annotations (such as email or date-time) are not checked. No values were changed.";
  return (validate.errors ?? []).map(error => `${error.instancePath || "/"}: ${error.message}`).join("\n");
}

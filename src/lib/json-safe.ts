import { isSafeNumber } from "lossless-json";
import { visit } from "jsonc-parser";

export const MAX_JSON_LENGTH = 1_000_000;
export const MAX_JSON_DEPTH = 64;

/** Bound recursion before invoking any parser, ignoring brackets inside strings. */
export function checkJsonLimits(text: string): void {
  if (text.length > MAX_JSON_LENGTH) throw new Error("JSON is limited to 1,000,000 characters.");
  let depth = 0, quoted = false, escaped = false;
  for (const char of text) {
    if (quoted) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === '"') quoted = false;
    } else if (char === '"') quoted = true;
    else if (char === "{" || char === "[") {
      if (++depth > MAX_JSON_DEPTH) throw new Error("JSON nesting is limited to 64 levels.");
    } else if (char === "}" || char === "]") depth--;
  }
}

/** Reject data JavaScript cannot represent safely instead of silently changing it. */
export function parseSafeJson(text: string): unknown {
  checkJsonLimits(text);
  const objects: Set<string>[] = [];
  visit(text, {
    onObjectBegin: () => { objects.push(new Set()); },
    onObjectEnd: () => { objects.pop(); },
    onObjectProperty: key => {
      const keys = objects[objects.length - 1];
      if (keys.has(key)) throw new Error("Duplicate object keys are not supported: processing would discard a value. Original input is unchanged.");
      keys.add(key);
    },
    onLiteralValue: (value, offset, length) => {
      if (typeof value === "number" && (!isSafeNumber(text.slice(offset, offset + length)) || Object.is(value, -0))) {
        throw new Error("This number cannot be converted safely by this tool. Use a quoted string for exact identifiers or high-precision values. Original input is unchanged.");
      }
    },
    onError: () => { throw new Error("Invalid strict JSON. Comments, trailing commas, and incomplete values are not supported."); },
  }, { disallowComments: true, allowTrailingComma: false });
  // Native parsing preserves own properties such as __proto__; the visitor above
  // rejects duplicate keys and unsafe numbers before this conversion.
  return JSON.parse(text);

}

export function sortJsonKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortJsonKeys);
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).sort(([a], [b]) => a.localeCompare(b, "en")).map(([key, item]) => [key, sortJsonKeys(item)]));
  }
  return value;
}

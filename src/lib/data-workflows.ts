import Papa from "papaparse";
import { parseSafeJson, MAX_JSON_LENGTH } from "./json-safe";
export type CsvMode = "text" | "json-cells";
const MAX_ROWS = 10000;

export function jsonToCsv(input: string, delimiter = ",", mode: CsvMode = "text", spreadsheetSafe = true): string {
  const value = parseSafeJson(input);
  if (!Array.isArray(value) || value.length === 0 || value.length > MAX_ROWS || value.some(row => row === null || typeof row !== "object" || Array.isArray(row))) throw new Error("Use a JSON array of 1–10,000 objects.");
  const rows = value as Record<string, unknown>[];
  const columns = [...new Set(rows.flatMap(row => Object.keys(row)))];
  if (!columns.length || columns.length > 200) throw new Error("Use 1–200 columns.");
  if (![",", ";", "\t"].includes(delimiter)) throw new Error("Unsupported delimiter.");
  const header = mode === "json-cells" ? columns.map(key => JSON.stringify(key)) : columns;
  const data = rows.map(row => columns.map(key => {
    if (!Object.prototype.hasOwnProperty.call(row, key)) return "";
    const cell = row[key];
    if (mode === "json-cells") return JSON.stringify(cell);
    if (cell !== null && typeof cell === "object") throw new Error("Text CSV supports flat records only. Select JSON cells to preserve nested values.");
    return cell === null ? "" : String(cell);
  }));
  return Papa.unparse([header, ...data], { delimiter, newline: "\r\n", escapeFormulae: mode === "text" && spreadsheetSafe });
}

export function csvToJson(input: string, delimiter = ",", mode: CsvMode = "text"): string {
  if (input.length > MAX_JSON_LENGTH) throw new Error("CSV is limited to 1,000,000 characters.");
  if (![",", ";", "\t"].includes(delimiter)) throw new Error("Unsupported delimiter.");
  const parsed = Papa.parse<string[]>(input.replace(/^\uFEFF/, ""), { delimiter, skipEmptyLines: true });
  if (parsed.errors.length) throw new Error("CSV contains malformed quotes or invalid rows.");
  const [header, ...rows] = parsed.data;
  if (!header?.length || header.length > 200 || rows.length > MAX_ROWS) throw new Error("CSV requires a header, at most 200 columns, and at most 10,000 rows.");
  const keys = header.map(key => {
    const value = mode === "json-cells" ? parseSafeJson(key) : key;
    if (typeof value !== "string" || !value.length) throw new Error("Headers must be nonempty strings. JSON-cell headers must be JSON strings.");
    return value;
  });
  if (new Set(keys).size !== keys.length) throw new Error("Duplicate CSV headers would discard values; use unique headers.");
  const result = rows.map(row => {
    if (row.length !== keys.length) throw new Error("Each CSV row must have the same number of fields as the header.");
    return Object.fromEntries(keys.flatMap((key, index) => mode === "json-cells" && row[index] === "" ? [] : [[key, mode === "json-cells" ? parseSafeJson(row[index]) : row[index]]]));
  });
  return JSON.stringify(result, null, 2);
}

function inferType(value: unknown, depth = 0): string {
  if (depth > 32) throw new Error("Type inference is limited to 32 levels.");
  if (value === null) return "null";
  if (Array.isArray(value)) {
    const variants = [...new Set(value.map(item => inferType(item, depth + 1)))];
    if (variants.length > 30) throw new Error("Too many distinct array shapes; use a smaller representative sample.");
    return variants.length ? `Array<${variants.join(" | ")}>` : "unknown[]";
  }
  if (typeof value === "object") return `{\n${Object.entries(value).map(([key, item]) => `${"  ".repeat(depth + 1)}${JSON.stringify(key)}: ${inferType(item, depth + 1)};`).join("\n")}\n${"  ".repeat(depth)}}`;
  return typeof value;
}
export function jsonToTypescript(input: string): string {
  const value = parseSafeJson(input);
  const type = inferType(value);
  if (type.length > 250_000) throw new Error("Generated type is too large; use a smaller representative sample.");
  return `// Inferred from one sample; this is not runtime validation.\nexport type Root = ${type};\n`;
}

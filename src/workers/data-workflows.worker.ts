import { csvToJson, jsonToCsv, jsonToTypescript, type CsvMode } from "../lib/data-workflows";
import { validateJsonSchema } from "../lib/schema-validation";
export interface WorkflowRequest { operation: "json-csv" | "csv-json" | "json-schema" | "json-to-typescript"; input: string; schema: string; delimiter: string; csvMode: CsvMode; spreadsheetSafe: boolean; }
self.onmessage = (event: MessageEvent<WorkflowRequest>) => {
  const request = event.data;
  try {
    const output = request.operation === "json-csv" ? jsonToCsv(request.input, request.delimiter, request.csvMode, request.spreadsheetSafe)
      : request.operation === "csv-json" ? csvToJson(request.input, request.delimiter, request.csvMode)
      : request.operation === "json-schema" ? validateJsonSchema(request.input, request.schema)
      : jsonToTypescript(request.input);
    self.postMessage({ output });
  } catch (error) { self.postMessage({ error: error instanceof Error ? error.message : "Processing failed." }); }
};

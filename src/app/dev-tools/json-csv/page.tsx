import { createToolMetadata } from "@/lib/tool-metadata";
import DataWorkflow from "@/components/tools/dev/DataWorkflow";

const title = "JSON to CSV and CSV to JSON Converter";
const description = "Convert JSON records and CSV tables locally with delimiter controls, spreadsheet protection, and an optional mode that preserves JSON types.";

export const metadata = createToolMetadata("/dev-tools/json-csv", {
  title,
  description,
});

export default function Page() {
  return <DataWorkflow kind="json-csv" />;
}

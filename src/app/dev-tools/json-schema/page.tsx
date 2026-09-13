import { createToolMetadata } from "@/lib/tool-metadata";
import DataWorkflow from "@/components/tools/dev/DataWorkflow";

const title = "JSON Schema Validator — Draft-07";
const description = "Validate JSON against a draft-07 schema in your browser. No remote schema retrieval, type coercion, or uploaded documents.";

export const metadata = createToolMetadata("/dev-tools/json-schema", {
  title,
  description,
});

export default function Page() {
  return <DataWorkflow kind="json-schema" />;
}

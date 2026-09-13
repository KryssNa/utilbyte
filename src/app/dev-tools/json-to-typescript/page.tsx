import { createToolMetadata } from "@/lib/tool-metadata";
import DataWorkflow from "@/components/tools/dev/DataWorkflow";

const title = "JSON to TypeScript Type Generator";
const description = "Infer TypeScript types from a JSON example locally. Supports nested objects, mixed arrays, and escaped property names with explicit inference limits.";

export const metadata = createToolMetadata("/dev-tools/json-to-typescript", {
  title,
  description,
});

export default function Page() {
  return <DataWorkflow kind="json-to-typescript" />;
}

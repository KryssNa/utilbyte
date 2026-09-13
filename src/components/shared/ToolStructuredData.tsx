import { serializeToolSchema, type ToolSchemaContent } from "@/lib/tool-schema";

export default function ToolStructuredData(props: ToolSchemaContent) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeToolSchema(props) }} />;
}

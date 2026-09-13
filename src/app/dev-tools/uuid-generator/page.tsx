import { createToolMetadata } from "@/lib/tool-metadata";
import UUIDGenerator from "@/components/tools/dev/UUIDGenerator";

export const metadata = createToolMetadata("/dev-tools/uuid-generator", {
  title: "UUID Generator Online Free - Generate UUID v4 Instantly",
  description: "Generate random UUID v4 identifiers in your browser for application records and testing. UUIDs identify records; they are not a substitute for access controls.",
  keywords: [
    "uuid generator online free",
    "generate uuid v4",
    "uuid creator online",
    "unique identifier generator",
    "guid generator",
    "random uuid online",
    "uuid4 generator",
    "rfc 4122 uuid",
    "database primary key generator",
    "api token generator",
    "unique id generator online"
  ],
});

export default function UUIDGeneratorPage() {
  return (
    <UUIDGenerator />

  );
}

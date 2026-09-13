import { createToolMetadata } from "@/lib/tool-metadata";
import CaseConverter from "@/components/tools/text/CaseConverter";

export const metadata = createToolMetadata("/text-tools/case-converter", {
  title: "Case Converter Online Free - Uppercase Lowercase Title Case Converter",
  description:
    "Convert text case online for free. Transform to uppercase, lowercase, title case, sentence case, camelCase, PascalCase, snake_case, kebab-case. Perfect for programming and writing.",
  keywords: [
    "case converter online free",
    "text case converter",
    "uppercase lowercase converter",
    "title case converter online",
    "camelcase converter",
    "pascalcase converter",
    "snake_case converter",
    "kebab-case converter",
    "text case transformation",
    "programming case converter",
    "css case converter",
    "javascript case converter"
  ],
});

export default function CaseConverterPage() {
  return (
    <CaseConverter />

  );
}

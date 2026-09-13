import { createToolMetadata } from "@/lib/tool-metadata";
import JSONFormatter from "@/components/tools/dev/JSONFormatter";

export const metadata = createToolMetadata("/dev-tools/json-formatter", {
  title: "JSON Formatter Online Free - Pretty Print & Validate JSON",
  description:
    "Format, validate, and pretty print JSON online for free. Syntax highlighting, error detection, minification, and beautification. Perfect for developers and API testing.",
  keywords: [
    "json formatter online free",
    "json pretty print",
    "format json online",
    "validate json online",
    "json beautifier",
    "json validator",
    "pretty print json",
    "json syntax checker",
    "json minifier",
    "json parser online",
    "api json formatter"
  ],
});

export default function JSONFormatterPage() {
  return (
    <JSONFormatter />

  );
}

import { createToolMetadata } from "@/lib/tool-metadata";
import TextFormatter from "@/components/tools/text/TextFormatter";

export const metadata = createToolMetadata("/text-tools/text-formatter", {
  title: "Text Formatter - JSON and Basic Code Formatting",
  description:
    "Format JSON and apply basic layout rules to XML, SQL, CSS and JavaScript-like text. Review changes carefully; basic formatting does not validate code semantics.",
  keywords: [
    "text formatter online free",
    "code formatter online",
    "json formatter online",
    "xml formatter online",
    "sql formatter online",
    "css formatter online",
    "javascript formatter online",
    "code beautifier",
    "pretty print code",
    "syntax highlighter",
    "code validator online",
    "typescript formatter",
    "html formatter online",
    "developer code tools"
  ],
});

export default function TextFormatterPage() {
  return (
    <TextFormatter />

  );
}

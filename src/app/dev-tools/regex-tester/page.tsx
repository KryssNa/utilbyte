import { createToolMetadata } from "@/lib/tool-metadata";
import RegexTester from "@/components/tools/dev/RegexTester";

export const metadata = createToolMetadata("/dev-tools/regex-tester", {
  title: "Regex Tester Online Free - Test Regular Expressions Live",
  description: "Test JavaScript regular expressions against sample text, inspect matches and capture groups, and try replacements in your browser.",
  keywords: [
    "regex tester online free",
    "regular expression tester",
    "test regex pattern",
    "regex validator online",
    "regex debugger",
    "regex pattern matching",
    "regular expressions tester",
    "regex flags tester",
    "regex replace tester",
    "javascript regex tester",
    "pcre regex tester",
    "python regex tester"
  ],
});

export default function RegexTesterPage() {
  return (
    <RegexTester />

  );
}

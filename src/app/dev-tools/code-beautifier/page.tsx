import { createToolMetadata } from "@/lib/tool-metadata";
import CodeBeautifier from "@/components/tools/dev/CodeBeautifier";

export const metadata = createToolMetadata("/dev-tools/code-beautifier", {
  title: "Code Beautifier - Format HTML, CSS, JavaScript Online Free",
  description:
    "Apply basic formatting to HTML, CSS and JavaScript text in your browser. Compare the output before use; formatting is not syntax or behavior validation.",
  keywords: [
    "code beautifier",
    "html formatter",
    "css formatter",
    "javascript formatter",
    "beautify code online",
    "code formatter",
    "format html",
    "format css",
    "format javascript",
    "code pretty print"
  ],
});

export default function CodeBeautifierPage() {
  return (
    <CodeBeautifier />

  );
}

import CodeBeautifier from "@/components/tools/dev/CodeBeautifier";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Code Beautifier - Format HTML, CSS, JavaScript Online Free",
  description:
    "Beautify and format HTML, CSS, and JavaScript code online for free. Make your code clean and readable with proper indentation and formatting.",
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
};

export default function CodeBeautifierPage() {
  return <CodeBeautifier />;
}

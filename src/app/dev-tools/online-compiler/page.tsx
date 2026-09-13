import { createToolMetadata } from "@/lib/tool-metadata";

import OnlineCompiler from "@/components/tools/dev/OnlineCompiler";

export const metadata = createToolMetadata("/dev-tools/online-compiler", {
  title: "Online Code Runner - JavaScript and Python",
  description: "Run JavaScript and Python examples in your browser, preview HTML and CSS, and format JSON. TypeScript syntax is not transpiled; run only code you trust.",
  keywords: [
    "online compiler",
    "code runner online",
    "run code online free",
    "javascript compiler",
    "python online",
    "html css editor",
    "typescript playground",
    "online code editor",
  ],
});

export default function OnlineCompilerPage() {
  return <OnlineCompiler />;
}

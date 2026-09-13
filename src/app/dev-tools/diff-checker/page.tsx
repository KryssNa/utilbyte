import { createToolMetadata } from "@/lib/tool-metadata";
import DiffChecker from "@/components/tools/dev/DiffChecker";

export const metadata = createToolMetadata("/dev-tools/diff-checker", {
  title: "Diff Checker - Compare Text and Code Online Free",
  description:
    "Compare two text files or code snippets online for free. See differences side by side with highlighted changes. Perfect for code reviews and debugging.",
  keywords: [
    "diff checker",
    "text comparison",
    "compare text online",
    "code diff",
    "file comparison",
    "text diff tool",
    "compare code",
    "diff tool",
    "text compare",
    "code comparison"
  ],
});

export default function DiffCheckerPage() {
  return (
    <DiffChecker />

  );
}

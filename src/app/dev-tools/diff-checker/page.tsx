import DiffChecker from "@/components/tools/dev/DiffChecker";
import { Metadata } from "next";

export const metadata: Metadata = {
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
};

export default function DiffCheckerPage() {
  return <DiffChecker />;
}

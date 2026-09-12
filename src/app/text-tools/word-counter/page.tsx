import { createToolMetadata } from "@/lib/tool-metadata";
import WordCounter from "@/components/tools/text/WordCounter";

export const metadata = createToolMetadata("/text-tools/word-counter", {
  title: "Word Counter Online Free - Count Words, Characters, Reading Time",
  description:
    "Count words, characters, sentences, paragraphs online for free. Get reading time, speaking time estimates. Perfect for writers, students, bloggers, and content creators.",
  keywords: [
    "word counter online free",
    "count words online",
    "character counter online",
    "word count tool",
    "reading time calculator",
    "text statistics",
    "word counter with reading time",
    "character count tool",
    "sentence counter",
    "paragraph counter",
    "writing statistics",
    "content word count"
  ],
});

export default function WordCounterPage() {
  return (
    <WordCounter />

  );
}

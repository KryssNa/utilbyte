import { createToolMetadata } from "@/lib/tool-metadata";
import RemoveDuplicates from "@/components/tools/text/RemoveDuplicates";

export const metadata = createToolMetadata("/text-tools/remove-duplicates", {
  title: "Remove Duplicates Online Free - Remove Duplicate Lines & Words from Text",
  description:
    "Remove duplicate lines and words from text online for free. Clean up lists, remove repeated entries, get duplicate statistics. Perfect for data cleaning and text processing.",
  keywords: [
    "remove duplicates online free",
    "remove duplicate lines from text",
    "remove duplicate words",
    "text deduplication tool",
    "clean duplicate entries",
    "remove repeated text",
    "duplicate line remover",
    "text cleanup tool",
    "data deduplication",
    "list deduplication",
    "remove duplicate entries",
    "text processing tool"
  ],
});

export default function RemoveDuplicatesPage() {
  return (
    <RemoveDuplicates />

  );
}

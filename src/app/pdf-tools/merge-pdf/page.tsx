import { createToolMetadata } from "@/lib/tool-metadata";
import PDFMerge from "@/components/tools/pdf/PDFMerge";

export const metadata = createToolMetadata("/pdf-tools/merge-pdf", {
  title: "Merge PDF Online Free - Combine Multiple PDFs Into One",
  description: "Combine selected PDF files into one document in your browser. Reorder the selected files before merging and review the downloaded result.",
  keywords: [
    "merge pdf online free",
    "combine pdf files",
    "pdf merger online",
    "merge multiple pdfs",
    "join pdf files",
    "pdf combiner",
  ],
});

export default function MergePDFPage() {
  return (
    <PDFMerge />

  );
}

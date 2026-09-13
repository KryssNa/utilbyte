import { createToolMetadata } from "@/lib/tool-metadata";
import PDFSplit from "@/components/tools/pdf/PDFSplit";

export const metadata = createToolMetadata("/pdf-tools/split-pdf", {
  title: "Split PDF Online Free - Extract Pages from PDF Document",
  description:
    "Split PDF files online for free. Extract specific pages or split PDF into multiple documents instantly. Choose page ranges or individual pages to extract.",
  keywords: [
    "split pdf online free",
    "extract pages from pdf",
    "pdf splitter online",
    "split pdf into multiple files",
    "extract pdf pages",
    "pdf page extractor",
    "divide pdf online",
    "split pdf by pages",
    "online pdf splitter",
    "pdf page separator"
  ],
});

export default function SplitPDFPage() {
  return (
    <PDFSplit />

  );
}

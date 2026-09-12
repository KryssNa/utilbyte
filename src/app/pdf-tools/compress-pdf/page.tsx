import { createToolMetadata } from "@/lib/tool-metadata";
import PDFCompress from "@/components/tools/pdf/PDFCompress";

export const metadata = createToolMetadata("/pdf-tools/compress-pdf", {
  title: "Compress PDF Online Free - Optimize PDF Structure",
  description:
    "Optimize PDF structure and object streams in your browser. Remove document metadata optionally, then compare file sizes before downloading. Savings vary by PDF.",
  keywords: [
    "compress pdf online free",
    "reduce pdf file size",
    "pdf compressor online",
    "compress pdf file size",
    "shrink pdf online",
    "pdf size reducer",
    "compress pdf without losing quality",
    "online pdf compression",
    "pdf optimizer",
    "reduce pdf size online"
  ],
});

export default function CompressPDFPage() {
  return (
    <PDFCompress />

  );
}

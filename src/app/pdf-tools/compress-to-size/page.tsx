import { createToolMetadata } from "@/lib/tool-metadata";
import PDFCompressToSize from "@/components/tools/pdf/PDFCompressToSize";

export const metadata = createToolMetadata("/pdf-tools/compress-to-size", {
  title: "Compress PDF to a Target Size - 500KB, 1MB, 2MB",
  description: "Try to reduce a PDF under a size limit using structural optimization or page rasterization. Rasterization loses selectable text; very small targets may be unreachable.",
  keywords: [
    "compress pdf to size",
    "compress pdf to 1mb",
    "compress pdf to 500kb",
    "reduce pdf size to specific size",
    "pdf size reducer online",
    "compress pdf for upload form",
    "shrink pdf to email limit",
  ],
});

export default function PDFCompressToSizePage() {
  return (
    <PDFCompressToSize />

  );
}

import { createToolMetadata } from "@/lib/tool-metadata";
import ImageOCR from "@/components/tools/image/ImageOCR";

export const metadata = createToolMetadata("/image-tools/ocr", {
  title: "OCR Online Free - Extract Text from Image - Image to Text Converter",
  description: "Extract text from an image using browser-based OCR with language options. Recognition accuracy varies; review the output against the source image.",
  keywords: [
    "ocr online free",
    "extract text from image",
    "image to text converter",
    "online ocr tool",
    "optical character recognition",
    "convert image to text",
    "scan to text",
    "photo to text",
    "ocr scanner online",
    "text recognition online",
    "image text extractor"
  ],
});

export default function OCRPage() {
  return (
    <ImageOCR />

  );
}

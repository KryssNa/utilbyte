import { createToolMetadata } from "@/lib/tool-metadata";
import PDFToImage from "@/components/tools/pdf/PDFToImage";

export const metadata = createToolMetadata("/pdf-tools/pdf-to-image", {
  title: "Convert PDF to Image Online Free - PDF to JPG PNG Converter",
  description: "Render PDF pages as JPG or PNG images in your browser. Choose output settings and download page images; this does not extract original embedded image files.",
  keywords: [
    "convert pdf to image online",
    "pdf to jpg converter",
    "pdf to png converter",
    "pdf to image online free",
    "extract images from pdf",
    "pdf page to image",
    "online pdf to image converter",
    "pdf to picture converter",
    "convert pdf to jpg online",
    "pdf to image converter free"
  ],
});

export default function PDFToImagePage() {
  return (
    <PDFToImage />

  );
}

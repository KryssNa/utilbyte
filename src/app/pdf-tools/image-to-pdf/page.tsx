import { createToolMetadata } from "@/lib/tool-metadata";
import ImageToPDF from "@/components/tools/pdf/ImageToPDF";

export const metadata = createToolMetadata("/pdf-tools/image-to-pdf", {
  title: "Convert Image to PDF Online Free - JPG PNG to PDF Converter",
  description:
    "Convert images to PDF online for free. Transform JPG, PNG, GIF, and other image formats to high-quality PDF documents instantly. Batch conversion supported.",
  keywords: [
    "convert image to pdf online",
    "image to pdf converter",
    "jpg to pdf",
    "png to pdf",
    "picture to pdf",
    "photo to pdf converter",
    "convert multiple images to pdf",
    "online image to pdf",
    "free image to pdf converter",
    "image to pdf online free"
  ],
});

export default function ImageToPDFPage() {
  return (
    <ImageToPDF />

  );
}

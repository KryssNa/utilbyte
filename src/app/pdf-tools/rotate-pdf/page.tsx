import { createToolMetadata } from "@/lib/tool-metadata";
import PDFRotate from "@/components/tools/pdf/PDFRotate";

export const metadata = createToolMetadata("/pdf-tools/rotate-pdf", {
  title: "Rotate PDF Online Free - Rotate PDF Pages 90° 180° 270°",
  description:
    "Rotate PDF pages online for free. Rotate PDF documents by 90°, 180°, or 270° degrees instantly. Fix upside down or sideways PDF pages with ease.",
  keywords: [
    "rotate pdf online free",
    "rotate pdf pages",
    "pdf rotator online",
    "rotate pdf 90 degrees",
    "rotate pdf 180 degrees",
    "fix rotated pdf",
    "pdf page rotation",
    "online pdf rotator",
    "rotate pdf clockwise",
    "rotate pdf counterclockwise"
  ],
});

export default function PDFRotatePage() {
  return (
    <PDFRotate />

  );
}

import { createToolMetadata } from "@/lib/tool-metadata";
import CompressToSize from "@/components/tools/image/CompressToSize";

export const metadata = createToolMetadata("/image-tools/compress-to-size", {
  title: "Compress Image to a Target Size - 20KB, 50KB, 100KB, 200KB",
  description: "Try to fit a photo under a KB limit by adjusting JPEG quality and dimensions in your browser. Compare the result; some targets require visible quality loss or cannot be reached.",
  keywords: [
    "compress image to size",
    "compress image to kb",
    "reduce image size in kb",
    "compress photo to 50kb",
    "compress image to 100kb",
    "compress jpeg to specific size",
    "image size reducer kb",
    "photo compressor for form upload",
    "resize photo for online form",
  ],
});

export default function CompressToSizePage() {
  return (
    <CompressToSize />

  );
}

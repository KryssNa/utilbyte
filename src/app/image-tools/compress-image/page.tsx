import { createToolMetadata } from "@/lib/tool-metadata";
import ImageCompressor from "@/components/tools/image/ImageCompressor";

export const metadata = createToolMetadata("/image-tools/compress-image", {
  title: "Image Compressor Online - Adjust JPEG Quality Free",
  description:
    "Reduce image file size with adjustable JPEG quality. Open a JPG, PNG or WebP image, compare the estimated size, and download a JPEG processed in your browser.",
  keywords: [
    "compress image online free",
    "adjust image compression quality",
    "reduce image file size",
    "image compression tool",
    "compress jpg online",
    "compress png online",
    "image optimizer online",
    "shrink image size",
    "photo compressor",
    "image size reducer",
    "jpeg image compression"
  ],
});

export default function CompressImagePage() {
  return (
    <ImageCompressor />

  );
}

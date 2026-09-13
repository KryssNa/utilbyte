import { createToolMetadata } from "@/lib/tool-metadata";
import ImageResizer from "@/components/tools/image/ImageResizer";

export const metadata = createToolMetadata("/image-tools/resize-image", {
  title: "Resize Image Online Free - Change Photo Dimensions Instantly",
  description:
    "Resize images online for free. Change dimensions, scale photos, maintain aspect ratio, or use presets for Instagram, Facebook, Twitter. Perfect for social media and web.",
  keywords: [
    "resize image online free",
    "resize photo online",
    "change image dimensions",
    "image resizer tool",
    "scale image online",
    "resize picture",
    "photo resizer online",
    "resize image for social media",
    "change photo size",
    "image dimension converter",
    "online photo resizer"
  ],
});

export default function ResizeImagePage() {
  return (
    <ImageResizer />

  );
}


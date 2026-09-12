import { createToolMetadata } from "@/lib/tool-metadata";
import ImageCropper from "@/components/tools/image/ImageCropper";

export const metadata = createToolMetadata("/image-tools/crop-image", {
  title: "Crop Image Online Free - Precision Photo Cropping Tool",
  description:
    "Crop images online for free with precision selection tools. Adjust dimensions, aspect ratios, and crop any part of your photo instantly. Perfect for social media and printing.",
  keywords: [
    "crop image online free",
    "crop photo online",
    "image cropper online",
    "precision image cropping",
    "crop picture tool",
    "photo crop editor",
    "image cropping tool",
    "crop image to size",
    "online photo cropper",
    "crop image dimensions"
  ],
});

export default function CropImagePage() {
  return (
    <ImageCropper />

  );
}
